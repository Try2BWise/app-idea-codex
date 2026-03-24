import type { LocalState } from './types';

const STORAGE_KEY = 'brightbrush-poc-state';

export function loadState(): LocalState | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as LocalState;
  } catch {
    return null;
  }
}

export function saveState(state: LocalState): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
