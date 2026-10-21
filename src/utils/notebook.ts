export interface NotebookEntry {
  id: string;
  phrase: string;
  note: string;
  savedAt: string;
}
const KEY = 'prospeak:notebook:v1';
export const NOTEBOOK_CHANGED = 'prospeak:notebook-changed';
export function getEntries(): NotebookEntry[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((e): e is NotebookEntry =>
      !!e && typeof e.id === 'string' && typeof e.phrase === 'string' &&
      typeof e.note === 'string' && typeof e.savedAt === 'string').slice(0,100);
  } catch { return []; }
}
function save(entries: NotebookEntry[]) {
  try { localStorage.setItem(KEY, JSON.stringify(entries.slice(0,100))); } catch { /* browser may disable storage */ }
  window.dispatchEvent(new Event(NOTEBOOK_CHANGED));
}
export function addPhrase(phrase: string, note = '') {
  const text = phrase.trim().slice(0,180);
  if (!text) return;
  const existing = getEntries();
  if (existing.some(e => e.phrase.toLowerCase() === text.toLowerCase())) return;
  save([{ id: crypto.randomUUID?.() || String(Date.now()), phrase: text, note: note.slice(0,300), savedAt: new Date().toISOString() }, ...existing]);
}
export function deletePhrase(id: string) { save(getEntries().filter(e => e.id !== id)); }
export function hasPhrase(phrase: string) { return getEntries().some(e => e.phrase.toLowerCase() === phrase.toLowerCase()); }
