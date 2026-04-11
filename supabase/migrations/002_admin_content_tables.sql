-- ============================================================
-- Migration 002: admin role, blocked flag, content tables
-- App: Rysbek AI
-- ============================================================

-- ── Add admin columns to profiles ─────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role    TEXT NOT NULL DEFAULT 'user'
    CHECK (role IN ('user', 'admin')),
  ADD COLUMN IF NOT EXISTS blocked BOOLEAN NOT NULL DEFAULT FALSE;

-- Grant admin role to a specific user (run manually):
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@rysbekai.com';

-- ── Quiz Sets ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.quiz_sets (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT    NOT NULL,
  subject     TEXT    NOT NULL,
  difficulty  TEXT    NOT NULL DEFAULT 'Medium'
                CHECK (difficulty IN ('Easy', 'Medium', 'Hard', 'Advanced')),
  description TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Quiz Questions ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_set_id UUID    NOT NULL REFERENCES public.quiz_sets(id) ON DELETE CASCADE,
  question    TEXT    NOT NULL,
  options     JSONB   NOT NULL, -- array of 4 answer strings
  correct_index INTEGER NOT NULL CHECK (correct_index BETWEEN 0 AND 3),
  explanation TEXT,
  difficulty  TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS quiz_questions_set_idx ON public.quiz_questions (quiz_set_id);

-- ── Flashcard Sets ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.flashcard_sets (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT    NOT NULL,
  subject     TEXT    NOT NULL,
  description TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Flashcards ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.flashcards (
  id      UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  set_id  UUID  NOT NULL REFERENCES public.flashcard_sets(id) ON DELETE CASCADE,
  front   TEXT  NOT NULL,
  back    TEXT  NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS flashcards_set_idx ON public.flashcards (set_id);

-- ── Row-Level Security ─────────────────────────────────────
-- Quiz sets: anyone authenticated can read active sets
ALTER TABLE public.quiz_sets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quiz_sets_read_active" ON public.quiz_sets
  FOR SELECT USING (is_active = TRUE OR (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  ));
CREATE POLICY "quiz_sets_admin_all" ON public.quiz_sets
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Quiz questions: same as quiz sets
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quiz_questions_read" ON public.quiz_questions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.quiz_sets WHERE id = quiz_set_id AND is_active = TRUE)
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "quiz_questions_admin_all" ON public.quiz_questions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Flashcard sets
ALTER TABLE public.flashcard_sets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "flashcard_sets_read_active" ON public.flashcard_sets
  FOR SELECT USING (is_active = TRUE OR (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  ));
CREATE POLICY "flashcard_sets_admin_all" ON public.flashcard_sets
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Flashcards
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "flashcards_read" ON public.flashcards
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.flashcard_sets WHERE id = set_id AND is_active = TRUE)
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "flashcards_admin_all" ON public.flashcards
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ── updated_at triggers ────────────────────────────────────
CREATE TRIGGER quiz_sets_updated_at
  BEFORE UPDATE ON public.quiz_sets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER flashcard_sets_updated_at
  BEFORE UPDATE ON public.flashcard_sets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
