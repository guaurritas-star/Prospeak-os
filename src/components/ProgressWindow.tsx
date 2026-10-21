import React, { useEffect, useState } from 'react';
import { emptyProgress, loadProgress, PROGRESS_EVENT, type MissionProgress } from '../utils/progress';

export const ProgressWindow: React.FC = () => {
  const [progress, setProgress] = useState<MissionProgress>(emptyProgress);
  useEffect(() => {
    const refresh = () => setProgress(loadProgress());
    refresh();
    window.addEventListener(PROGRESS_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const completedSteps = [progress.read, progress.reply, progress.speak].filter(Boolean).length;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-4 bg-[#F7FAFB] text-[#244552] space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-serif text-xl font-bold">My Progress</h3>
          <p className="text-xs text-[#58747E]">Guest progress · stored on this device only</p>
        </div>
        <span className="text-xs bg-[#F7E9ED] text-[#855362] py-1.5 px-2.5 rounded-full">Mission 01</span>
      </div>
      <div className="grid grid-cols-3 gap-2" aria-label="Recorded activity">
        <div className="rounded-xl border border-[#DCE9EE] bg-white p-3 text-center">
          <p className="text-xs text-[#55727E]">Steps done</p>
          <p className="font-serif text-2xl font-bold mt-1">{completedSteps}/3</p>
        </div>
        <div className="rounded-xl border border-[#DCE9EE] bg-white p-3 text-center">
          <p className="text-xs text-[#55727E]">Writing words</p>
          <p className="font-serif text-2xl font-bold mt-1">{progress.writtenWords}</p>
        </div>
        <div className="rounded-xl border border-[#DCE9EE] bg-white p-3 text-center">
          <p className="text-xs text-[#55727E]">Speaking words</p>
          <p className="font-serif text-2xl font-bold mt-1">{progress.spokenWords}</p>
        </div>
      </div>
      <div className="p-3 bg-white border border-[#DFE9ED] rounded-xl space-y-2">
        <div className="flex justify-between text-sm font-semibold"><span>First Professional Meeting</span><span>{progress.completed ? 'Completed ✓' : 'In progress'}</span></div>
        <div className="h-2 bg-[#E9F0F3] rounded-full overflow-hidden">
          <div style={{width: String(Math.round(completedSteps / 3 * 100)) + '%'}} className="h-full bg-[#709889] rounded-full transition-all" />
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-[#496670]">
          <span>{progress.read ? '✓' : '○'} Read</span><span>{progress.reply ? '✓' : '○'} Reply</span><span>{progress.speak ? '✓' : '○'} Speak</span>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-[#617A83]">
        These are activity counts, not a measure of English proficiency or speaking confidence.
        {progress.lastPracticed ? ' Last practice: ' + new Date(progress.lastPracticed).toLocaleDateString() + '.' : ' Start a mission to see your progress here.'}
      </p>
    </div>
  );
};
