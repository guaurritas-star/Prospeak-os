import React, { useState } from 'react';
import { OSWindow as OSWindowType } from './types/os';
import { OSWindow } from './components/OSWindow';
import { Taskbar } from './components/Taskbar';
import { StartMenu } from './components/StartMenu';
import { MissionWindow } from './components/MissionWindow';
import { MessengerWindow } from './components/MessengerWindow';
import { SpeakingLabWindow } from './components/SpeakingLabWindow';
import { InboxWindow } from './components/InboxWindow';
import { ProgressWindow } from './components/ProgressWindow';
import { CareerWindow } from './components/CareerWindow';
import { SettingsWindow } from './components/SettingsWindow';
import { AgendaModal } from './components/AgendaModal';
import { LogOffModal } from './components/LogOffModal';
import { playSound } from './utils/audio';

export default function App() {
  const [windows, setWindows] = useState<Record<string, OSWindowType>>({
    mission: {
      id: 'mission',
      title: "Today's Mission",
      icon: '🦎',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 30,
      x: 0,
      y: 0,
      width: 780,
      height: 700,
    },
    messenger: {
      id: 'messenger',
      title: 'Messenger',
      icon: '💬',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 20,
      x: 0,
      y: 0,
      width: 440,
      height: 385,
    },
    progress: {
      id: 'progress',
      title: 'My Progress',
      icon: '📊',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10,
      x: 0,
      y: 0,
      width: 440,
      height: 310,
    },
    speaking: {
      id: 'speaking',
      title: 'Speaking Lab',
      icon: '🎙️',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 35,
      x: 100,
      y: 40,
      width: 680,
      height: 620,
    },
    inbox: {
      id: 'inbox',
      title: 'Workplace Inbox',
      icon: '📥',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 35,
      x: 80,
      y: 50,
      width: 740,
      height: 600,
    },
    career: {
      id: 'career',
      title: 'Career Paths',
      icon: '💼',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 35,
      x: 120,
      y: 60,
      width: 740,
      height: 600,
    },
    settings: {
      id: 'settings',
      title: 'Audio & System Settings',
      icon: '⚙️',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 36,
      x: 140,
      y: 70,
      width: 580,
      height: 520,
    },
  });

  const [activeWindowId, setActiveWindowId] = useState<string | null>('mission');
  const [maxZIndex, setMaxZIndex] = useState(40);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isAgendaModalOpen, setIsAgendaModalOpen] = useState(false);
  const [isLogOffModalOpen, setIsLogOffModalOpen] = useState(false);
  const [isLoggedOff, setIsLoggedOff] = useState(false);
  const [initialMayaPrompt, setInitialMayaPrompt] = useState<string | undefined>(undefined);
  const [theme, setTheme] = useState('default');

  const focusWindow = (id: string) => {
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);
    setActiveWindowId(id);
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: true,
        isMinimized: false,
        zIndex: nextZ,
      },
    }));
  };

  const toggleWindow = (id: string) => {
    setWindows((prev) => {
      const win = prev[id];
      if (!win.isOpen) {
        const nextZ = maxZIndex + 1;
        setMaxZIndex(nextZ);
        setActiveWindowId(id);
        return {
          ...prev,
          [id]: { ...win, isOpen: true, isMinimized: false, zIndex: nextZ },
        };
      }

      if (win.isMinimized) {
        const nextZ = maxZIndex + 1;
        setMaxZIndex(nextZ);
        setActiveWindowId(id);
        return {
          ...prev,
          [id]: { ...win, isMinimized: false, zIndex: nextZ },
        };
      }

      if (activeWindowId === id) {
        return {
          ...prev,
          [id]: { ...win, isMinimized: true },
        };
      }

      const nextZ = maxZIndex + 1;
      setMaxZIndex(nextZ);
      setActiveWindowId(id);
      return {
        ...prev,
        [id]: { ...win, zIndex: nextZ },
      };
    });
  };

  const minimizeWindow = (id: string) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true },
    }));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const maximizeWindow = (id: string) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMaximized: !prev[id].isMaximized },
    }));
    focusWindow(id);
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false },
    }));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const moveWindow = (id: string, x: number, y: number) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], x, y },
    }));
  };

  // Lock Screen view
  if (isLoggedOff) {
    return (
      <div className={`h-screen w-screen overflow-hidden flex flex-col items-center justify-center relative select-none theme-${theme} bg-[#23424E]`}>
        <div aria-hidden="true" className="scenic-landscape-bg" />
        <div className="z-10 bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/80 flex flex-col items-center space-y-4 max-w-sm text-center">
          <div className="w-20 h-20 rounded-full bg-[#1A3844] text-white flex items-center justify-center font-bold text-2xl shadow-lg border-4 border-white">
            AR
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-[#1E3B46]">Guest Learner</h2>
            <p className="text-xs text-[#52707D]">ProSpeak Guest · Prototype</p>
          </div>
          <button
            onClick={() => {
              playSound('ding');
              setIsLoggedOff(false);
            }}
            className="w-full py-2.5 px-6 rounded-xl bg-[#2A4D5C] hover:bg-[#1C3742] text-white font-bold text-sm transition shadow-md flex items-center justify-center space-x-2 active:scale-95"
          >
            <span>🔓</span>
            <span>Resume Session</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (!target.closest('#start-menu') && !target.closest('.start-btn-gradient')) {
          setIsStartMenuOpen(false);
        }
      }}
      className={`h-screen w-screen overflow-hidden flex flex-col justify-between relative select-none theme-${theme}`}
    >
      {/* Background Scenic Landscape Shader */}
      <div aria-hidden="true" className="scenic-landscape-bg" />

      {/* Skyline Silhouette SVG */}
      <svg
        className="absolute bottom-10 left-0 w-full pointer-events-none opacity-20 h-52 z-0"
        fill="#203E4A"
        preserveAspectRatio="none"
        viewBox="0 0 1440 320"
      >
        <path d="M0,320 L0,220 L30,220 L30,240 L50,240 L50,190 L75,190 L75,240 L90,240 L90,160 L105,160 L105,240 L130,240 L130,210 L150,210 L150,250 L200,250 L200,180 L220,180 L220,250 L260,250 L260,220 L290,220 L290,260 L340,260 L340,170 L350,170 L350,150 L360,170 L380,170 L380,260 L420,260 L420,230 L450,230 L450,270 L510,270 L510,190 L530,190 L530,270 L580,270 L580,140 L595,140 L595,120 L605,140 L620,140 L620,270 L680,270 L680,210 L700,210 L700,280 L760,280 L760,220 L790,220 L790,280 L840,280 L840,160 L855,160 L855,130 L870,160 L890,160 L890,280 L940,280 L940,200 L970,200 L970,280 L1030,280 L1030,230 L1070,230 L1070,280 L1140,280 L1140,180 L1160,180 L1160,280 L1220,280 L1220,240 L1260,240 L1260,280 L1320,280 L1320,200 L1345,200 L1345,280 L1440,280 L1440,320 Z" />
      </svg>

      {/* Top Left ProSpeak OS Brand */}
      <div className="absolute top-5 sm:top-7 left-8 sm:left-12 z-0 pointer-events-none select-none">
        <div className="flex items-baseline space-x-2">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-[#25424D] drop-shadow-xs">
            ProSpeak
          </h1>
          <span className="text-4xl sm:text-5xl font-serif italic text-[#C9919B] font-semibold">
            OS
          </span>
        </div>
        <p className="text-xs sm:text-sm font-sans font-medium tracking-wide text-[#42616D] mt-0.5 ml-0.5 opacity-90">
          English for real conversations
        </p>
      </div>

      {/* Top Right Handwritten Tagline */}
      <div className="absolute top-6 sm:top-8 right-8 sm:right-12 z-0 pointer-events-none select-none text-right hidden md:block">
        <span className="font-handwriting text-3xl md:text-4xl text-[#7E575E] rotate-[-2deg] block tracking-wide leading-tight drop-shadow-xs">
          Better
          <br />
          <span className="ml-4">Conversations</span>
          <br />
          <span className="ml-8 text-[#614147]">Brighter</span>
          <br />
          <span className="ml-12 text-[#56363B]">Opportunities</span>
        </span>
      </div>

      {/* Desktop Workspace */}
      <main
        data-purpose="desktop-workspace"
        className="relative w-full h-[calc(100vh-42px)] p-2 sm:p-6 overflow-hidden flex"
      >
        {/* Desktop Shortcuts Sidebar */}
        <nav
          aria-label="Desktop Shortcuts"
          className={(Object.values(windows).some(w => w.isOpen && !w.isMinimized) ? 'hidden sm:flex ' : 'flex ') + 'w-20 sm:w-28 flex-col space-y-3 sm:space-y-4 pt-16 sm:pt-20 z-10 select-none flex-shrink-0'}
        >
          {/* Inbox Shortcut */}
          <button
            onClick={() => {
              playSound('click');
              focusWindow('inbox');
            }}
            className="group flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 hover:bg-white/40 active:scale-95 focus:outline-none"
          >
            <div className="w-11 h-11 sm:w-13 sm:h-13 p-2.5 rounded-2xl bg-gradient-to-b from-[#E7F3F8] to-[#BEDCE8] border border-white/80 shadow-md group-hover:shadow-lg transition-transform transform group-hover:-translate-y-0.5 flex items-center justify-center">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#264A57]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <span className="mt-1.5 text-xs font-semibold text-[#1C3640] tracking-tight text-center drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
              Inbox
            </span>
          </button>

          {/* Messenger Shortcut */}
          <button
            onClick={() => {
              playSound('click');
              toggleWindow('messenger');
            }}
            className="group flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 hover:bg-white/40 active:scale-95 focus:outline-none"
          >
            <div className="w-11 h-11 sm:w-13 sm:h-13 p-2.5 rounded-2xl bg-gradient-to-b from-[#7FB1CC] to-[#4887A8] border border-white/80 shadow-md group-hover:shadow-lg transition-transform transform group-hover:-translate-y-0.5 flex items-center justify-center">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-.874-.954l.794-2.58A7.83 7.83 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </div>
            <span className="mt-1.5 text-xs font-semibold text-[#1C3640] tracking-tight text-center drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
              Messenger
            </span>
          </button>

          {/* Speaking Lab Shortcut */}
          <button
            onClick={() => {
              playSound('click');
              focusWindow('speaking');
            }}
            className="group flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 hover:bg-white/40 active:scale-95 focus:outline-none"
          >
            <div className="w-11 h-11 sm:w-13 sm:h-13 p-2.5 rounded-2xl bg-gradient-to-b from-[#679AA8] to-[#3B6673] border border-white/80 shadow-md group-hover:shadow-lg transition-transform transform group-hover:-translate-y-0.5 flex items-center justify-center">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </div>
            <span className="mt-1.5 text-xs font-semibold text-[#1C3640] tracking-tight text-center drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
              Speaking Lab
            </span>
          </button>

          {/* Progress Shortcut */}
          <button
            onClick={() => {
              playSound('click');
              toggleWindow('progress');
            }}
            className="group flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 hover:bg-white/40 active:scale-95 focus:outline-none"
          >
            <div className="w-11 h-11 sm:w-13 sm:h-13 p-2.5 rounded-2xl bg-gradient-to-b from-[#EDACB6] to-[#C47D8A] border border-white/80 shadow-md group-hover:shadow-lg transition-transform transform group-hover:-translate-y-0.5 flex items-center justify-center">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <span className="mt-1.5 text-xs font-semibold text-[#1C3640] tracking-tight text-center drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
              My Progress
            </span>
          </button>

          {/* Career Shortcut */}
          <button
            onClick={() => {
              playSound('click');
              focusWindow('career');
            }}
            className="group flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 hover:bg-white/40 active:scale-95 focus:outline-none"
          >
            <div className="w-11 h-11 sm:w-13 sm:h-13 p-2.5 rounded-2xl bg-gradient-to-b from-[#8C6D68] to-[#59423E] border border-white/80 shadow-md group-hover:shadow-lg transition-transform transform group-hover:-translate-y-0.5 flex items-center justify-center">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#FAECEB]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v1.069m7.5 0c.98.056 1.948.134 2.899.233m-10.399 0A47.55 47.55 0 0112 6.75c1.01 0 2.007.039 2.999.116" />
              </svg>
            </div>
            <span className="mt-1.5 text-xs font-semibold text-[#1C3640] tracking-tight text-center drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
              Career Paths
            </span>
          </button>
        </nav>

        {/* Windows Container */}
        <div className="relative flex-1 min-w-0 h-full sm:ml-4 overflow-hidden" id="window-container">
          {/* Mission Window */}
          <OSWindow
            window={windows.mission}
            isActive={activeWindowId === 'mission'}
            onFocus={focusWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            onClose={closeWindow}
            onMove={moveWindow}
            defaultPositionClasses="absolute left-2 top-2 w-[calc(100%-16px)] h-[calc(100%-16px)]"
          >
            <MissionWindow
              onOpenAgendaModal={() => setIsAgendaModalOpen(true)}
              onMessageMaya={(prompt) => {
                setInitialMayaPrompt(prompt);
                focusWindow('messenger');
              }}
            />
          </OSWindow>

          {/* Messenger Window */}
          <OSWindow
            window={windows.messenger}
            isActive={activeWindowId === 'messenger'}
            onFocus={focusWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            onClose={closeWindow}
            onMove={moveWindow}
            defaultPositionClasses="absolute right-2 top-2 w-[min(440px,calc(100%-16px))] h-[385px] max-h-[calc(100%-16px)]"
          >
            <MessengerWindow
              initialPrompt={initialMayaPrompt}
              onClearInitialPrompt={() => setInitialMayaPrompt(undefined)}
            />
          </OSWindow>

          {/* Progress Window */}
          <OSWindow
            window={windows.progress}
            isActive={activeWindowId === 'progress'}
            onFocus={focusWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            onClose={closeWindow}
            onMove={moveWindow}
            defaultPositionClasses="absolute right-2 bottom-2 w-[min(440px,calc(100%-16px))] h-[360px] max-h-[calc(100%-16px)]"
          >
            <ProgressWindow />
          </OSWindow>

          {/* Workplace Inbox Window */}
          <OSWindow
            window={windows.inbox}
            isActive={activeWindowId === 'inbox'}
            onFocus={focusWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            onClose={closeWindow}
            onMove={moveWindow}
            defaultPositionClasses="absolute left-10 top-8 w-[740px] max-w-[90vw] h-[600px] max-h-[85vh]"
          >
            <InboxWindow
              onOpenAgendaModal={() => setIsAgendaModalOpen(true)}
              onOpenMission={() => focusWindow('mission')}
            />
          </OSWindow>

          {/* Speaking Lab Window */}
          <OSWindow
            window={windows.speaking}
            isActive={activeWindowId === 'speaking'}
            onFocus={focusWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            onClose={closeWindow}
            onMove={moveWindow}
            defaultPositionClasses="absolute left-16 top-6 w-[680px] max-w-[90vw] h-[620px] max-h-[85vh]"
          >
            <SpeakingLabWindow />
          </OSWindow>

          {/* Career Paths Window */}
          <OSWindow
            window={windows.career}
            isActive={activeWindowId === 'career'}
            onFocus={focusWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            onClose={closeWindow}
            onMove={moveWindow}
            defaultPositionClasses="absolute left-20 top-10 w-[740px] max-w-[90vw] h-[600px] max-h-[85vh]"
          >
            <CareerWindow onSelectMission={() => focusWindow('mission')} />
          </OSWindow>

          {/* Audio & System Settings Window */}
          <OSWindow
            window={windows.settings}
            isActive={activeWindowId === 'settings'}
            onFocus={focusWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            onClose={closeWindow}
            onMove={moveWindow}
            defaultPositionClasses="absolute left-24 top-14 w-[580px] max-w-[90vw] h-[520px] max-h-[85vh]"
          >
            <SettingsWindow
              onSelectTheme={(newTheme) => setTheme(newTheme)}
              currentTheme={theme}
            />
          </OSWindow>
        </div>
      </main>

      {/* Start Menu Dropdown */}
      <StartMenu
        isOpen={isStartMenuOpen}
        onClose={() => setIsStartMenuOpen(false)}
        onOpenWindow={(id) => focusWindow(id)}
        onLogOff={() => setIsLogOffModalOpen(true)}
      />

      {/* Taskbar / Dock at bottom */}
      <Taskbar
        windows={windows}
        activeWindowId={activeWindowId}
        onToggleWindow={toggleWindow}
        isStartMenuOpen={isStartMenuOpen}
        onToggleStartMenu={() => setIsStartMenuOpen(!isStartMenuOpen)}
      />

      {/* Agenda PDF Preview Modal */}
      <AgendaModal
        isOpen={isAgendaModalOpen}
        onClose={() => setIsAgendaModalOpen(false)}
      />

      {/* Log Off Confirmation Modal */}
      <LogOffModal
        isOpen={isLogOffModalOpen}
        onClose={() => setIsLogOffModalOpen(false)}
        onConfirmLogOff={() => {
          setIsLogOffModalOpen(false);
          setIsLoggedOff(true);
        }}
      />
    </div>
  );
}
