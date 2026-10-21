// Guest progress is stored only in this browser. Do not store transcripts or email drafts.
export type MissionProgress = {
  read: boolean;
  reply: boolean;
  speak: boolean;
  completed: boolean;
  writtenWords: number;
  spokenWords: number;
  lastPracticed: string | null;
  completedAt: string | null;
};

export const PROGRESS_EVENT = 'prospeak:progress-changed';
const KEY = 'prospeak:guest-mission-v1';

export const emptyProgress: MissionProgress = {
  read: false, reply: false, speak: false, completed: false,
  writtenWords: 0, spokenWords: 0, lastPracticed: null, completedAt: null,
};

export function loadProgress(): MissionProgress {
  if (typeof window === 'undefined') return { ...emptyProgress };
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? { ...emptyProgress, ...JSON.parse(saved) } : { ...emptyProgress };
  } catch {
    return { ...emptyProgress };
  }
}

export function saveProgress(patch: Partial<MissionProgress>): MissionProgress {
  const updated = { ...loadProgress(), ...patch, lastPracticed: new Date().toISOString() };
  try {
    localStorage.setItem(KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(PROGRESS_EVENT));
  } catch {
    // Private browsing may disable storage; keep the current exercise usable.
  }
  return updated;
}
