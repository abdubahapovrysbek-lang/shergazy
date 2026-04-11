
import { createAdminClient } from '@/lib/supabase-server';
import ContentClient from './ContentClient';

export default async function ContentPage() {
  const supabase = createAdminClient();

  const [
    { data: quizSets },
    { data: flashcardSets },
  ] = await Promise.all([
    supabase
      .from('quiz_sets')
      .select('id, title, subject, difficulty, description, is_active, created_at, quiz_questions(count)')
      .order('created_at', { ascending: false }),
    supabase
      .from('flashcard_sets')
      .select('id, title, subject, description, is_active, created_at, flashcards(count)')
      .order('created_at', { ascending: false }),
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Content Management</h1>
        <p className="text-gray-400 text-sm mt-0.5">Create, edit and delete quiz sets and flashcard sets.</p>
      </div>
      <ContentClient
        initialQuizSets={quizSets ?? []}
        initialFlashcardSets={flashcardSets ?? []}
      />
    </div>
  );
}
