
'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase-server';

// ── Quiz Sets ────────────────────────────────────────────────

export async function createQuizSet(data: {
  title: string; subject: string; difficulty: string; description: string;
}) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('quiz_sets').insert({ ...data, is_active: true });
  if (error) throw new Error(error.message);
  revalidatePath('/admin/content');
}

export async function updateQuizSet(id: string, data: {
  title: string; subject: string; difficulty: string; description: string; is_active: boolean;
}) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('quiz_sets')
    .update({ ...data, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/content');
}

export async function deleteQuizSet(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('quiz_sets').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/content');
}

// ── Flashcard Sets ───────────────────────────────────────────

export async function createFlashcardSet(data: {
  title: string; subject: string; description: string;
}) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('flashcard_sets').insert({ ...data, is_active: true });
  if (error) throw new Error(error.message);
  revalidatePath('/admin/content');
}

export async function updateFlashcardSet(id: string, data: {
  title: string; subject: string; description: string; is_active: boolean;
}) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('flashcard_sets')
    .update({ ...data, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/content');
}

export async function deleteFlashcardSet(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('flashcard_sets').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/content');
}
