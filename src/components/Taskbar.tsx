import React, { useState, useEffect } from 'react';
import { OSWindow } from '../types/os';
import { playSound } from '../utils/audio';
import { ProSpeakIcon, iconForWindow } from './ProSpeakIcon';

interface TaskbarProps {
  windows: Record<string, OSWindow>;
  activeWindowId: string | null;
  onToggleWindow: (id: string) => void;
  isStartMenuOpen: boolean;
  onToggleStartMenu: () => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  activeWindowId,
  onToggleWindow,
  isStartMenuOpen,
  onToggleStartMenu,
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const [volume, setVolume] = useState(85);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      };
      setCurrentTime(now.toLocaleDateString('en-US', options).replace(',', ''));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const openWindowsList = Object.values(windows).filter((w) => w.isOpen);

  return (
    <footer
      data-purpose="os-taskbar"
      className="fixed bottom-0 left-0 right-0 h-10 sm:h-11 bg-[#D3E4ED]/90 backdrop-blur-md border-t border-[#BACED9] px-2 sm:px-3 flex items-center justify-between z-40 select-none shadow-[0_-2px_10px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center space-x-2 h-full py-1">
        {/* Start Button */}
        <button
          onClick={() => {
            playSound('click');
            onToggleStartMenu();
          }}
          className={`start-btn-gradient h-full px-3.5 sm:px-4 rounded-xl flex items-center space-x-1.5 text-white font-sans font-bold text-xs tracking-wide shadow-sm hover:brightness-105 active:scale-98 transition focus:outline-none flex-shrink-0 ${
            isStartMenuOpen ? 'brightness-110 ring-1 ring-white/50' : ''
          }`}
          title="ProSpeak OS Start Menu"
        >
          <ProSpeakIcon name="mission" size={23} />
          <span className="drop-shadow-sm font-semibold text-[13px] hidden xs:inline">ProSpeak</span>
        </button>

        {/* Running Window Tabs */}
        <div className="flex items-center space-x-1.5 h-full overflow-x-auto no-scrollbar">
          {openWindowsList.map((win) => {
            const isActive = activeWindowId === win.id && !win.isMinimized;
            return (
              <button
                key={win.id}
                onClick={() => {
                  playSound('click');
                  onToggleWindow(win.id);
                }}
                className={`h-full px-2.5 sm:px-3.5 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 transition whitespace-nowrap shadow-xs ${
                  isActive
                    ? 'bg-white/95 border-white text-[#183642] shadow-sm font-bold ring-1 ring-white/80'
                    : win.isMinimized
                    ? 'bg-white/40 border-white/40 text-[#305361] hover:bg-white/60'
                    : 'bg-white/70 hover:bg-white/90 border-white/80 text-[#20404C]'
                }`}
                title={win.title}
              >
                <ProSpeakIcon name={iconForWindow(win.id)} size={22} />
                <span className="hidden md:inline text-[11.5px] truncate max-w-[120px]">{win.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* System Tray */}
      <div className="flex items-center space-x-2.5 sm:space-x-3.5 bg-white/30 backdrop-blur-sm px-2.5 sm:px-3.5 py-1 rounded-lg border border-white/40 text-[#1E3B46] text-xs font-medium relative flex-shrink-0">
        {/* Network Icon */}
        <div title="Network Connected · 100 Mbps" className="cursor-pointer hover:text-black">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2B4E5D]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM2.879 7.879a10 10 0 0114.242 0 .75.75 0 101.06-1.06 11.5 11.5 0 00-16.363 0 .75.75 0 101.06 1.06zm2.828 2.828a6 6 0 018.486 0 .75.75 0 001.06-1.06 7.5 7.5 0 00-10.606 0 .75.75 0 001.06 1.06zm2.829 2.829a2 2 0 012.828 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.949 0 .75.75 0 001.06 1.06z" />
          </svg>
        </div>

        {/* Volume Icon & Popover */}
        <div className="relative">
          <button
            onClick={() => setIsVolumeOpen(!isVolumeOpen)}
            className="hover:text-black flex items-center focus:outline-none"
            title="Volume & Audio Settings"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2B4E5D]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.25A2.25 2.25 0 001 9.25v1.5A2.25 2.25 0 003.25 13h1.453l4.033 3.796A.75.75 0 0010 16.25V3.75zM14.78 4.22a.75.75 0 011.06 0 9.5 9.5 0 010 11.56.75.75 0 11-1.06-1.06 8 8 0 000-9.44.75.75 0 010-1.06zm-2.12 2.12a.75.75 0 011.06 0 6.5 6.5 0 010 7.32.75.75 0 11-1.06-1.06 5 5 0 000-5.2.75.75 0 010-1.06z" />
            </svg>
          </button>

          {isVolumeOpen && (
            <div className="absolute bottom-9 right-0 w-36 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200 p-3 flex flex-col items-center space-y-2 z-50 animate-in fade-in zoom-in-95">
              <span className="font-bold text-[10px] text-gray-500 uppercase">
                Volume: {isMuted ? 'Muted' : `${volume}%`}
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseInt(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-full accent-[#26424D] cursor-pointer"
              />
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-[10px] font-semibold text-gray-600 hover:text-black"
              >
                {isMuted ? 'Unmute' : 'Mute'}
              </button>
            </div>
          )}
        </div>

        {/* Live Clock */}
        <time id="os-clock" className="text-[11px] sm:text-xs font-semibold text-[#183642] tracking-tight whitespace-nowrap">
          {currentTime || 'Wed Oct 21 11:00 AM'}
        </time>
      </div>
    </footer>
  );
};
