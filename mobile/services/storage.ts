import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MathAnalysis } from './openai';

const STORAGE_KEY = '@mathhelper/saved_problems';

export interface SavedProblem {
  id: string;
  savedAt: number;       // Unix ms timestamp
  imageUri: string;      // local file URI (from expo-image-picker)
  analysis: MathAnalysis;
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function loadSavedProblems(): Promise<SavedProblem[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedProblem[]) : [];
  } catch (err) {
    console.error('[storage] loadSavedProblems failed:', err);
    return [];
  }
}

// ─── Write ────────────────────────────────────────────────────────────────────

export async function saveProblem(
  imageUri: string,
  analysis: MathAnalysis,
): Promise<SavedProblem> {
  const existing = await loadSavedProblems();
  const entry: SavedProblem = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    savedAt: Date.now(),
    imageUri,
    analysis,
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...existing]));
  return entry;
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteProblem(id: string): Promise<void> {
  const existing = await loadSavedProblems();
  const updated = existing.filter((p) => p.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

// ─── Clear all ────────────────────────────────────────────────────────────────

export async function clearAllProblems(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
