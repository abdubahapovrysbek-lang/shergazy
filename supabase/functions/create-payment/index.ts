// Supabase Edge Function: create-payment
// Creates a signed PayBox (FreedomPay) payment init request server-side
// so the secret key is never exposed to the mobile client.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHash } from 'node:crypto';

const PAYBOX_API_URL = 'https://api.paybox.money/init_payment.php';
const SCRIPT_NAME    = 'init_payment.php';

const SUBSCRIPTION_AMOUNT      = '0.99';
const SUBSCRIPTION_CURRENCY    = 'USD';
const SUBSCRIPTION_DESCRIPTION = 'Rysbek AI Premium — Monthly Subscription';
const PAYMENT_LIFETIME_SECONDS = 3600; // 1 hour

function md5(str: string): string {
  return createHash('md5').update(str).digest('hex');
}

function generateSalt(length = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (const byte of array) result += chars[byte % chars.length];
  return result;
}

/**
 * Compute PayBox HMAC-MD5 signature.
 * Algorithm: MD5(script_name ; sorted_param_values... ; secret_key)
 * All values joined with ";", params sorted alphabetically by key.
 * pg_sig is excluded from the signed payload.
 */
function computeSignature(
  params: Record<string, string>,
  secretKey: string,
): string {
  const sortedKeys = Object.keys(params)
    .filter((k) => k !== 'pg_sig')
    .sort();
  const values = sortedKeys.map((k) => params[k]);
  const payload = [SCRIPT_NAME, ...values, secretKey].join(';');
  return md5(payload);
}

Deno.serve(async (req) => {
  // CORS pre-flight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    // ── Authenticate the caller via Supabase JWT ──────────────────────────
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Parse request body ────────────────────────────────────────────────
    const { userId, userEmail } = await req.json();
    if (userId !== user.id) {
      return Response.json({ error: 'User ID mismatch' }, { status: 403 });
    }

    // ── Fetch PayBox secrets ──────────────────────────────────────────────
    const merchantId = Deno.env.get('PAYBOX_MERCHANT_ID');
    const secretKey  = Deno.env.get('PAYBOX_SECRET_KEY');
    if (!merchantId || !secretKey) {
      console.error('PayBox credentials not configured');
      return Response.json({ error: 'Payment service not configured' }, { status: 500 });
    }

    // ── Build PayBox params ───────────────────────────────────────────────
    const webhookUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/paybox-webhook`;
    const successUrl = 'rysbekai://payment-success';
    const failureUrl = 'rysbekai://payment-failure';

    const params: Record<string, string> = {
      pg_merchant_id:             merchantId,
      pg_amount:                  SUBSCRIPTION_AMOUNT,
      pg_currency:                SUBSCRIPTION_CURRENCY,
      pg_description:             SUBSCRIPTION_DESCRIPTION,
      pg_salt:                    generateSalt(),
      pg_result_url:              webhookUrl,
      pg_success_url:             successUrl,
      pg_failure_url:             failureUrl,
      pg_user_id:                 userId,
      pg_user_email:              userEmail,
      pg_lifetime:                String(PAYMENT_LIFETIME_SECONDS),
      pg_request_method:          'JSON',
      // Recurring / subscription params
      pg_recurring_profile:       '1',
      pg_recurring_profile_type:  'monthly',
      pg_recurring_lifetime:      '12',
    };

    params.pg_sig = computeSignature(params, secretKey);

    // ── Call PayBox API ───────────────────────────────────────────────────
    const formBody = new URLSearchParams(params).toString();
    const pbResp = await fetch(PAYBOX_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody,
    });

    if (!pbResp.ok) {
      const errText = await pbResp.text();
      console.error('PayBox HTTP error:', pbResp.status, errText);
      return Response.json({ error: 'PayBox request failed' }, { status: 502 });
    }

    const pbData = await pbResp.json();

    if (pbData.pg_status !== 'ok') {
      console.error('PayBox error:', pbData);
      return Response.json({ error: pbData.pg_error_description ?? 'Payment init failed' }, { status: 502 });
    }

    // ── Store the PayBox order ID on the user profile ─────────────────────
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    await adminClient
      .from('profiles')
      .update({ paybox_order_id: String(pbData.pg_payment_id), updated_at: new Date().toISOString() })
      .eq('id', userId);

    return Response.json(
      { redirectUrl: pbData.pg_redirect_url, paymentId: pbData.pg_payment_id },
      { headers: { 'Access-Control-Allow-Origin': '*' } },
    );
  } catch (err) {
    console.error('create-payment error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
});
