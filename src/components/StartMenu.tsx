import React from 'react';
import { playSound } from '../utils/audio';
import { ProSpeakIcon } from './ProSpeakIcon';
import { BrandMascot } from './BrandMascot';
import { NotebookPen, CircleHelp } from 'lucide-react';

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
        <div className="w-10 h-10 rounded-full bg-white/65 flex items-center justify-center border-2 border-white"><BrandMascot size={38}/></div>
        <div>
          <h4 className="font-bold text-sm text-[#18343E]">Guest Learner</h4>
          <span className="text-[11px] text-[#426473]">ProSpeak guest · Pilot</span>
        </div>
      </div>

      {/* Program Shortcuts */}
      <div className="p-2 space-y-0.5 text-xs">
        <button
          onClick={() => handleItemClick('mission')}
          className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-[#EBF3F8] text-[#22414E] transition text-left group"
        >
          <ProSpeakIcon name="mission" size={32} className="group-hover:scale-110 transition-transform" />
          <div>
            <span className="font-bold block">Today's Mission</span>
            <span className="text-[10px] text-gray-500">Business Communication & Kickoff</span>
          </div>
        </button>

        <button
          onClick={() => handleItemClick('messenger')}
          className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-[#EBF3F8] text-[#22414E] transition text-left group"
        >
          <ProSpeakIcon name="messenger" size={32} className="group-hover:scale-110 transition-transform" />
          <div>
            <span className="font-bold block">Messenger with Maya</span>
            <span className="text-[10px] text-gray-500">Practice conversations anytime</span>
          </div>
        </button>

        <button
          onClick={() => handleItemClick('progress')}
          className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-[#EBF3F8] text-[#22414E] transition text-left group"
        >
          <ProSpeakIcon name="progress" size={32} className="group-hover:scale-110 transition-transform" />
          <div>
            <span className="font-bold block">Weekly Progress</span>
            <span className="text-[10px] text-gray-500">View your actual practice activity</span>
          </div>
        </button>

        <button
          onClick={() => handleItemClick('speaking')}
          className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-[#EBF3F8] text-[#22414E] transition text-left group"
        >
          <ProSpeakIcon name="speaking" size={32} className="group-hover:scale-110 transition-transform" />
          <div>
            <span className="font-bold block">Speaking Lab</span>
            <span className="text-[10px] text-gray-500">Pronunciation, cadence & microphone coach</span>
          </div>
        </button>

        <button
          onClick={() => handleItemClick('inbox')}
          className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-[#EBF3F8] text-[#22414E] transition text-left group"
        >
          <ProSpeakIcon name="inbox" size={32} className="group-hover:scale-110 transition-transform" />
          <div>
            <span className="font-bold block">Workplace Inbox</span>
            <span className="text-[10px] text-gray-500">Real colleague emails & agendas</span>
          </div>
        </button>

        <button
          onClick={() => handleItemClick('career')}
          className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-[#EBF3F8] text-[#22414E] transition text-left group"
        >
          <ProSpeakIcon name="career" size={32} className="group-hover:scale-110 transition-transform" />
          <div>
            <span className="font-bold block">Career Paths</span>
            <span className="text-[10px] text-gray-500">Leadership milestones & skill trees</span>
          </div>
        </button>

        <button onClick={() => handleItemClick('notebook')} className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-[#EBF3F8] text-[#22414E] text-left group">
          <span className="w-8 flex items-center justify-center text-[#A6748D]"><NotebookPen size={26}/></span>
          <div><span className="font-bold block">My Notebook</span><span className="text-[10px] text-gray-500">Your saved English expressions</span></div>
        </button>
        <button onClick={() => handleItemClick('help')} className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-[#EBF3F8] text-[#22414E] text-left group">
          <span className="w-8 flex items-center justify-center text-[#6995AB]"><CircleHelp size={26}/></span>
          <div><span className="font-bold block">Help & Guide</span><span className="text-[10px] text-gray-500">How ProSpeak OS works</span></div>
        </button>
        <div className="border-t border-gray-100 my-1" />

        <button
          onClick={() => handleItemClick('settings')}
          className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-[#EBF3F8] text-[#3E5C68] transition text-left"
        >
          <ProSpeakIcon name="settings" size={26} />
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
