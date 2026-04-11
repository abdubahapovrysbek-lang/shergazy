-- ============================================================
-- Migration 001: user profiles + subscription management
-- App: Rysbek AI
-- ============================================================

-- Profiles table linked 1:1 to Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id                    UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                 TEXT        NOT NULL,
  full_name             TEXT,

  -- Subscription fields
  has_used_trial        BOOLEAN     NOT NULL DEFAULT FALSE,
  subscription_status   TEXT        NOT NULL DEFAULT 'free'
                          CHECK (subscription_status IN ('free', 'trial', 'premium', 'expired')),
  subscription_end_date TIMESTAMPTZ,
  trial_start_date      TIMESTAMPTZ,
  paybox_order_id       TEXT,

  -- Timestamps
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Row-Level Security ─────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile (called at sign-up)
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile (e.g. trial activation)
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Service role bypasses RLS by default — no extra policy needed
-- for the webhook Edge Function that uses SUPABASE_SERVICE_ROLE_KEY.

-- ── Enable Realtime on profiles ────────────────────────────
-- Allows the mobile app to receive live subscription status updates
-- via Supabase Realtime without polling.
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- ── Auto-update updated_at ─────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Expire trials automatically (called by a cron job) ─────
-- Run this query via Supabase pg_cron or a scheduled Edge Function:
--
-- UPDATE public.profiles
-- SET subscription_status = 'expired'
-- WHERE subscription_status = 'trial'
--   AND subscription_end_date < NOW();
--
-- ── Index for PayBox order lookup ──────────────────────────
CREATE INDEX IF NOT EXISTS profiles_paybox_order_idx
  ON public.profiles (paybox_order_id)
  WHERE paybox_order_id IS NOT NULL;
