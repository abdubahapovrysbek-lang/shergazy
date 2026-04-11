// Supabase Edge Function: paybox-webhook
// Receives payment result callbacks from PayBox (FreedomPay).
// Verifies the HMAC-MD5 signature, then updates the user's subscription
// status in the database.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHash } from 'node:crypto';

const SCRIPT_NAME = 'payment_result.php'; // PayBox uses this for result callback signature

function md5(str: string): string {
  return createHash('md5').update(str).digest('hex');
}

/**
 * Verify the PayBox callback signature.
 * Algorithm: MD5(script_name ; sorted_param_values... ; secret_key)
 */
function verifySignature(
  params: Record<string, string>,
  secretKey: string,
): boolean {
  const receivedSig = params['pg_sig'];
  if (!receivedSig) return false;

  const sortedKeys = Object.keys(params)
    .filter((k) => k !== 'pg_sig')
    .sort();
  const values = sortedKeys.map((k) => params[k]);
  const payload = [SCRIPT_NAME, ...values, secretKey].join(';');
  const expectedSig = md5(payload);

  return expectedSig === receivedSig;
}

Deno.serve(async (req) => {
  // PayBox sends POST with application/x-www-form-urlencoded or JSON
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const secretKey = Deno.env.get('PAYBOX_SECRET_KEY');
    if (!secretKey) {
      console.error('PAYBOX_SECRET_KEY not configured');
      return new Response('Configuration error', { status: 500 });
    }

    // ── Parse the callback payload ────────────────────────────────────────
    const contentType = req.headers.get('content-type') ?? '';
    let params: Record<string, string> = {};

    if (contentType.includes('application/json')) {
      params = await req.json();
    } else {
      // application/x-www-form-urlencoded (default PayBox format)
      const text = await req.text();
      for (const [k, v] of new URLSearchParams(text)) {
        params[k] = v;
      }
    }

    // ── Verify signature ──────────────────────────────────────────────────
    if (!verifySignature(params, secretKey)) {
      console.error('Signature verification failed for PayBox callback');
      return new Response('Invalid signature', { status: 403 });
    }

    const paymentId  = params['pg_payment_id'];
    const status     = params['pg_result'];   // '1' = success, '0' = failure
    const userId     = params['pg_user_id'];
    const amount     = params['pg_amount'];
    const currency   = params['pg_currency'];

    if (!userId) {
      console.error('No pg_user_id in PayBox callback');
      return new Response('Missing user ID', { status: 400 });
    }

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    if (status === '1') {
      // Payment successful → activate Premium for 1 month
      const subEnd = new Date();
      subEnd.setMonth(subEnd.getMonth() + 1);

      const { error } = await adminClient
        .from('profiles')
        .update({
          subscription_status: 'premium',
          subscription_end_date: subEnd.toISOString(),
          paybox_order_id: paymentId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        console.error('Failed to update profile to premium:', error);
        return new Response('DB update failed', { status: 500 });
      }

      console.log(`User ${userId} upgraded to Premium via PayBox payment ${paymentId} (${amount} ${currency})`);

      // PayBox expects an XML or JSON response with pg_status=ok
      return new Response(
        JSON.stringify({ pg_status: 'ok', pg_description: 'Premium activated' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    } else {
      // Payment failed or cancelled
      console.log(`Payment ${paymentId} failed/cancelled for user ${userId}`);
      return new Response(
        JSON.stringify({ pg_status: 'rejected', pg_description: 'Payment not completed' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }
  } catch (err) {
    console.error('paybox-webhook error:', err);
    return new Response('Internal server error', { status: 500 });
  }
});
