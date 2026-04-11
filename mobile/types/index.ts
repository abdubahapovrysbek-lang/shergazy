export type SubscriptionStatus = 'free' | 'trial' | 'premium' | 'expired';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  has_used_trial: boolean;
  subscription_status: SubscriptionStatus;
  subscription_end_date: string | null;
  trial_start_date: string | null;
  paybox_order_id: string | null;
  created_at: string;
  updated_at: string;
}
