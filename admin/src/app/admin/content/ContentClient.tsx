
'use client';

import { useState, useTransition } from 'react';
import {
  createQuizSet, updateQuizSet, deleteQuizSet,
  createFlashcardSet, updateFlashcardSet, deleteFlashcardSet,
} from './actions';

// ── Types ─────────────────────────────────────────────────────────────────────

type QuizSet = {
  id: string; title: string; subject: string; difficulty: string;
  description: string; is_active: boolean; created_at: string;
  quiz_questions: { count: number }[];
};

type FlashcardSet = {
  id: string; title: string; subject: string;
  description: string; is_active: boolean; created_at: string;
  flashcards: { count: number }[];
};

type Tab = 'quiz' | 'flashcard';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Advanced'];
const SUBJECTS = ['Arithmetic', 'Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics', 'Linear Algebra', 'Number Theory'];
const DIFF_BADGE: Record<string, string> = {
  Easy:     'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Medium:   'bg-blue-500/15 text-blue-400 border-blue-500/20',
  Hard:     'bg-amber-500/15 text-amber-400 border-amber-500/20',
  Advanced: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
};

// ── Modal ─────────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg card p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Quiz Form ─────────────────────────────────────────────────────────────────

function QuizForm({
  initial, onSave, onClose,
}: {
  initial?: Partial<QuizSet>;
  onSave: (d: any) => Promise<void>;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [subject, setSubject] = useState(initial?.subject ?? SUBJECTS[0]);
  const [difficulty, setDifficulty] = useState(initial?.difficulty ?? DIFFICULTIES[0]);
  const [description, setDescription] = useState(initial?.description ?? '');
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [pending, startT] = useTransition();
  const [err, setErr] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setErr('Title is required.'); return; }
    startT(async () => {
      try {
        await onSave({ title, subject, difficulty, description, is_active: isActive });
        onClose();
      } catch (ex: any) { setErr(ex.message); }
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label">Title</label>
        <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Algebra Basics Quiz" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Subject</label>
          <select className="input" value={subject} onChange={e => setSubject(e.target.value)}>
            {SUBJECTS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Difficulty</label>
          <select className="input" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
            {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input resize-none" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description…" />
      </div>
      {initial?.id && (
        <div className="flex items-center gap-3">
          <label className="label mb-0">Active</label>
          <button
            type="button"
            onClick={() => setIsActive(v => !v)}
            className={`relative w-10 h-5 rounded-full transition-colors ${isActive ? 'bg-brand-500' : 'bg-gray-700'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow ${isActive ? 'left-5.5' : 'left-0.5'}`} style={{ left: isActive ? '1.375rem' : '0.125rem' }} />
          </button>
        </div>
      )}
      {err && <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{err}</p>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={pending} className="btn-primary flex-1 py-2.5">
          {pending ? 'Saving…' : initial?.id ? 'Save Changes' : 'Create Quiz Set'}
        </button>
        <button type="button" onClick={onClose} className="btn-ghost flex-1 py-2.5">Cancel</button>
      </div>
    </form>
  );
}

// ── Flashcard Form ────────────────────────────────────────────────────────────

function FlashcardForm({
  initial, onSave, onClose,
}: {
  initial?: Partial<FlashcardSet>;
  onSave: (d: any) => Promise<void>;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [subject, setSubject] = useState(initial?.subject ?? SUBJECTS[0]);
  const [description, setDescription] = useState(initial?.description ?? '');
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [pending, startT] = useTransition();
  const [err, setErr] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setErr('Title is required.'); return; }
    startT(async () => {
      try {
        await onSave({ title, subject, description, is_active: isActive });
        onClose();
      } catch (ex: any) { setErr(ex.message); }
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label">Title</label>
        <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Calculus Formulas" required />
      </div>
      <div>
        <label className="label">Subject</label>
        <select className="input" value={subject} onChange={e => setSubject(e.target.value)}>
          {SUBJECTS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input resize-none" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description…" />
      </div>
      {initial?.id && (
        <div className="flex items-center gap-3">
          <label className="label mb-0">Active</label>
          <button
            type="button"
            onClick={() => setIsActive(v => !v)}
            className={`relative w-10 h-5 rounded-full transition-colors ${isActive ? 'bg-brand-500' : 'bg-gray-700'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow`} style={{ left: isActive ? '1.375rem' : '0.125rem' }} />
          </button>
        </div>
      )}
      {err && <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{err}</p>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={pending} className="btn-primary flex-1 py-2.5">
          {pending ? 'Saving…' : initial?.id ? 'Save Changes' : 'Create Flashcard Set'}
        </button>
        <button type="button" onClick={onClose} className="btn-ghost flex-1 py-2.5">Cancel</button>
      </div>
    </form>
  );
}

// ── Delete Confirm ────────────────────────────────────────────────────────────

function DeleteConfirm({ name, onConfirm, onClose, pending }: {
  name: string; pending: boolean;
  onConfirm: () => void; onClose: () => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-gray-300 text-sm">
        Are you sure you want to delete <span className="text-white font-semibold">"{name}"</span>?
        This will also delete all associated questions/cards and cannot be undone.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onConfirm}
          disabled={pending}
          className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {pending ? 'Deleting…' : 'Delete'}
        </button>
        <button onClick={onClose} className="flex-1 btn-ghost py-2.5">Cancel</button>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ContentClient({
  initialQuizSets,
  initialFlashcardSets,
}: {
  initialQuizSets: QuizSet[];
  initialFlashcardSets: FlashcardSet[];
}) {
  const [tab, setTab] = useState<Tab>('quiz');
  const [quizSets, setQuizSets] = useState<QuizSet[]>(initialQuizSets);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>(initialFlashcardSets);
  const [search, setSearch] = useState('');

  // Modal state
  const [modal, setModal] = useState<null | 'create' | 'edit' | 'delete'>(null);
  const [target, setTarget] = useState<QuizSet | FlashcardSet | null>(null);
  const [deletePending, startDeleteT] = useTransition();

  function closeModal() { setModal(null); setTarget(null); }

  // ── Quiz actions ──
  async function handleCreateQuiz(data: any) {
    await createQuizSet(data);
    setQuizSets(prev => [{ ...data, id: Date.now().toString(), is_active: true, created_at: new Date().toISOString(), quiz_questions: [] }, ...prev]);
  }
  async function handleUpdateQuiz(data: any) {
    if (!target) return;
    await updateQuizSet(target.id, data);
    setQuizSets(prev => prev.map(q => q.id === target.id ? { ...q, ...data } : q));
  }
  function handleDeleteQuiz() {
    if (!target) return;
    startDeleteT(async () => {
      await deleteQuizSet(target.id);
      setQuizSets(prev => prev.filter(q => q.id !== target.id));
      closeModal();
    });
  }

  // ── Flashcard actions ──
  async function handleCreateFlashcard(data: any) {
    await createFlashcardSet(data);
    setFlashcardSets(prev => [{ ...data, id: Date.now().toString(), is_active: true, created_at: new Date().toISOString(), flashcards: [] }, ...prev]);
  }
  async function handleUpdateFlashcard(data: any) {
    if (!target) return;
    await updateFlashcardSet(target.id, data);
    setFlashcardSets(prev => prev.map(f => f.id === target.id ? { ...f, ...data } : f));
  }
  function handleDeleteFlashcard() {
    if (!target) return;
    startDeleteT(async () => {
      await deleteFlashcardSet(target.id);
      setFlashcardSets(prev => prev.filter(f => f.id !== target.id));
      closeModal();
    });
  }

  const filteredQuiz = quizSets.filter(q =>
    search === '' || q.title.toLowerCase().includes(search.toLowerCase()) || q.subject.toLowerCase().includes(search.toLowerCase())
  );
  const filteredFlash = flashcardSets.filter(f =>
    search === '' || f.title.toLowerCase().includes(search.toLowerCase()) || f.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Tabs + toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 gap-1">
          {(['quiz', 'flashcard'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setSearch(''); }}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all
                ${tab === t ? 'bg-brand-500 text-white shadow' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
            >
              {t === 'quiz' ? `Quiz Sets (${quizSets.length})` : `Flashcard Sets (${flashcardSets.length})`}
            </button>
          ))}
        </div>

        <div className="flex-1 relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input className="input pl-9 w-full sm:max-w-64" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <button
          onClick={() => { setTarget(null); setModal('create'); }}
          className="btn-primary flex items-center gap-2 whitespace-nowrap"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New {tab === 'quiz' ? 'Quiz Set' : 'Flashcard Set'}
        </button>
      </div>

      {/* Grid */}
      {tab === 'quiz' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
          {filteredQuiz.length === 0 && (
            <div className="col-span-full card p-12 text-center text-gray-500">No quiz sets found.</div>
          )}
          {filteredQuiz.map(qs => (
            <div key={qs.id} className="card p-5 flex flex-col gap-3 hover:border-gray-700 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{qs.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{qs.subject}</p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => { setTarget(qs); setModal('edit'); }}
                    className="p-1.5 text-gray-500 hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => { setTarget(qs); setModal('delete'); }}
                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14H6L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`badge border ${DIFF_BADGE[qs.difficulty] ?? DIFF_BADGE.Medium}`}>{qs.difficulty}</span>
                <span className={`badge ${qs.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-700 text-gray-500'}`}>
                  {qs.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs text-gray-600 ml-auto">
                  {(qs.quiz_questions?.[0] as any)?.count ?? 0} questions
                </span>
              </div>
              {qs.description && <p className="text-xs text-gray-500 line-clamp-2">{qs.description}</p>}
            </div>
          ))}
        </div>
      )}

      {tab === 'flashcard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
          {filteredFlash.length === 0 && (
            <div className="col-span-full card p-12 text-center text-gray-500">No flashcard sets found.</div>
          )}
          {filteredFlash.map(fs => (
            <div key={fs.id} className="card p-5 flex flex-col gap-3 hover:border-gray-700 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{fs.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{fs.subject}</p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => { setTarget(fs); setModal('edit'); }}
                    className="p-1.5 text-gray-500 hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => { setTarget(fs); setModal('delete'); }}
                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14H6L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 bg-gray-800 rounded-full px-2.5 py-0.5">{fs.subject}</span>
                <span className={`badge ${fs.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-700 text-gray-500'}`}>
                  {fs.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs text-gray-600 ml-auto">
                  {(fs.flashcards?.[0] as any)?.count ?? 0} cards
                </span>
              </div>
              {fs.description && <p className="text-xs text-gray-500 line-clamp-2">{fs.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* ── Modals ── */}
      {modal === 'create' && tab === 'quiz' && (
        <Modal title="New Quiz Set" onClose={closeModal}>
          <QuizForm onSave={async d => { await handleCreateQuiz(d); closeModal(); }} onClose={closeModal} />
        </Modal>
      )}
      {modal === 'create' && tab === 'flashcard' && (
        <Modal title="New Flashcard Set" onClose={closeModal}>
          <FlashcardForm onSave={async d => { await handleCreateFlashcard(d); closeModal(); }} onClose={closeModal} />
        </Modal>
      )}
      {modal === 'edit' && target && tab === 'quiz' && (
        <Modal title="Edit Quiz Set" onClose={closeModal}>
          <QuizForm initial={target as QuizSet} onSave={async d => { await handleUpdateQuiz(d); closeModal(); }} onClose={closeModal} />
        </Modal>
      )}
      {modal === 'edit' && target && tab === 'flashcard' && (
        <Modal title="Edit Flashcard Set" onClose={closeModal}>
          <FlashcardForm initial={target as FlashcardSet} onSave={async d => { await handleUpdateFlashcard(d); closeModal(); }} onClose={closeModal} />
        </Modal>
      )}
      {modal === 'delete' && target && (
        <Modal title="Delete Content" onClose={closeModal}>
          <DeleteConfirm
            name={target.title}
            pending={deletePending}
            onConfirm={tab === 'quiz' ? handleDeleteQuiz : handleDeleteFlashcard}
            onClose={closeModal}
          />
        </Modal>
      )}
    </>
  );
}
