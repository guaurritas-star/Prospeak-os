import React from 'react';
import { playSound } from '../utils/audio';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWindow: (id: string) => void;
  onLogOff: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  isOpen,
  onClose,
  onOpenWindow,
  onLogOff,
}) => {
  if (!isOpen) return null;

  const handleItemClick = (id: string) => {
    playSound('click');
    onOpenWindow(id);
    onClose();
  };

  return (
    <div
      id="start-menu"
      data-purpose="prospeak-start-menu"
      className="absolute bottom-11 left-2 w-80 bg-white/95 backdrop-blur-md rounded-t-xl rounded-br-xl shadow-2xl border border-white/80 overflow-hidden z-50 transition-all duration-150 animate-in fade-in slide-in-from-bottom-2 select-none"
    >
      {/* User Card Header */}
      <div className="xp-titlebar-active p-3.5 flex items-center space-x-3 border-b border-[#BFD4E2]">
        <div className="w-10 h-10 rounded-full bg-[#1E3B46] text-white flex items-center justify-center font-bold text-sm shadow-md border-2 border-white">
          AR
        </div>
        <div>
          <h4 className="font-bold text-sm text-[#18343E]">Alex Rivera</h4>
          <span className="text-[11px] text-[#426473]">ProSpeak Scholar (Level 4)</span>
        </div>
      </div>

      {/* Program Shortcuts */}
      <div className="p-2 space-y-0.5 text-xs">
        <button
          onClick={() => handleItemClick('mission')}
          className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-[#EBF3F8] text-[#22414E] transition text-left group"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">🎯</span>
          <div>
            <span className="font-bold block">Today's Mission</span>
            <span className="text-[10px] text-gray-500">Business Communication & Kickoff</span>
          </div>
        </button>

        <button
          onClick={() => handleItemClick('messenger')}
          className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-[#EBF3F8] text-[#22414E] transition text-left group"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">💬</span>
          <div>
            <span className="font-bold block">Messenger with Maya</span>
            <span className="text-[10px] text-gray-500">Practice conversations anytime</span>
          </div>
        </button>

        <button
          onClick={() => handleItemClick('progress')}
          className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-[#EBF3F8] text-[#22414E] transition text-left group"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">📊</span>
          <div>
            <span className="font-bold block">Weekly Progress</span>
            <span className="text-[10px] text-gray-500">72% Confidence · 7-Day Streak</span>
          </div>
        </button>

        <button
          onClick={() => handleItemClick('speaking')}
          className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-[#EBF3F8] text-[#22414E] transition text-left group"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">🎙️</span>
          <div>
            <span className="font-bold block">Speaking Lab</span>
            <span className="text-[10px] text-gray-500">Pronunciation, cadence & microphone coach</span>
          </div>
        </button>

        <button
          onClick={() => handleItemClick('inbox')}
          className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-[#EBF3F8] text-[#22414E] transition text-left group"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">📥</span>
          <div>
            <span className="font-bold block">Workplace Inbox</span>
            <span className="text-[10px] text-gray-500">Real colleague emails & agendas</span>
          </div>
        </button>

        <button
          onClick={() => handleItemClick('career')}
          className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-[#EBF3F8] text-[#22414E] transition text-left group"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">💼</span>
          <div>
            <span className="font-bold block">Career Paths</span>
            <span className="text-[10px] text-gray-500">Leadership milestones & skill trees</span>
          </div>
        </button>

        <div className="border-t border-gray-100 my-1" />

        <button
          onClick={() => handleItemClick('settings')}
          className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-[#EBF3F8] text-[#3E5C68] transition text-left"
        >
          <span className="text-lg">⚙️</span>
          <span className="font-medium text-xs">Audio & Microphone Settings</span>
        </button>
      </div>

      {/* Footer / Log off */}
      <div className="bg-[#F0F5F8] p-2.5 border-t border-gray-200 flex items-center justify-between text-xs">
        <button
          onClick={() => {
            playSound('click');
            onLogOff();
            onClose();
          }}
          className="text-[#783D47] font-semibold flex items-center space-x-1.5 hover:underline"
        >
          <span>⏻</span>
          <span>Log Off ProSpeak</span>
        </button>
        <span className="text-[10px] text-gray-400">v2.4 Vista-XP</span>
      </div>
    </div>
  );
};
