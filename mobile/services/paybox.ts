import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from './supabase';

export interface PaymentInitResult {
  type: 'success' | 'cancel' | 'dismiss';
}

/**
 * Calls the Supabase Edge Function to generate a signed PayBox payment URL,
 * then opens it in an in-app browser. Returns when the browser session ends.
 *
 * The Edge Function signs the request server-side so the PayBox secret key
 * is never exposed to the client.
 */
export async function initiateSubscriptionPayment(
  userId: string,
  userEmail: string,
): Promise<PaymentInitResult> {
  // 1. Ask our Edge Function to create a signed PayBox payment request
  const { data, error } = await supabase.functions.invoke('create-payment', {
    body: { userId, userEmail },
  });

  if (error) throw new Error(`Payment init failed: ${error.message}`);
  if (!data?.redirectUrl) throw new Error('No redirect URL returned from payment service.');

  // 2. The success deep-link that PayBox will redirect the user back to
  const successUrl = Linking.createURL('payment-success');

  // 3. Open the PayBox-hosted payment page in an in-app browser session.
  //    openAuthSessionAsync will close automatically when the browser redirects
  //    to a URL matching our app scheme (rysbekai://).
  const result = await WebBrowser.openAuthSessionAsync(data.redirectUrl, successUrl);

  if (result.type === 'success') {
    return { type: 'success' };
  }
  if (result.type === 'cancel') {
    return { type: 'cancel' };
  }
  return { type: 'dismiss' };
}

/**
 * Activates the 7-day free trial for a user.
 * Sets has_used_trial = true so it can never be claimed again.
 */
export async function activateTrial(userId: string): Promise<void> {
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 7);

  const { error } = await supabase
    .from('profiles')
    .update({
      has_used_trial: true,
      subscription_status: 'trial',
      trial_start_date: new Date().toISOString(),
      subscription_end_date: trialEnd.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) throw new Error(`Failed to activate trial: ${error.message}`);
}
