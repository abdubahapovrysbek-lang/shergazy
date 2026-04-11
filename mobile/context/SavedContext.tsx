import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  loadSavedProblems,
  saveProblem,
  deleteProblem,
  clearAllProblems,
  type SavedProblem,
} from '../services/storage';
import type { MathAnalysis } from '../services/openai';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SavedContextValue {
  problems: SavedProblem[];
  loading: boolean;
  /** Returns the new entry's id */
  save: (imageUri: string, analysis: MathAnalysis) => Promise<string>;
  remove: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  isSaved: (imageUri: string) => boolean;
  refresh: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const SavedContext = createContext<SavedContextValue | null>(null);

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const [problems, setProblems] = useState<SavedProblem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await loadSavedProblems();
      setProblems(data);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on mount
  useEffect(() => { refresh(); }, [refresh]);

  const save = useCallback(async (imageUri: string, analysis: MathAnalysis) => {
    const entry = await saveProblem(imageUri, analysis);
    setProblems((prev) => [entry, ...prev]);
    return entry.id;
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteProblem(id);
    setProblems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearAll = useCallback(async () => {
    await clearAllProblems();
    setProblems([]);
  }, []);

  const isSaved = useCallback(
    (imageUri: string) => problems.some((p) => p.imageUri === imageUri),
    [problems],
  );

  return (
    <SavedContext.Provider value={{ problems, loading, save, remove, clearAll, isSaved, refresh }}>
      {children}
    </SavedContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error('useSaved must be used inside <SavedProvider>');
  return ctx;
}
