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
import { ProSpeakIcon } from './components/ProSpeakIcon';
import { BrandMascot } from './components/BrandMascot';
import { WelcomePanel } from './components/WelcomePanel';
import { NotebookWindow } from './components/NotebookWindow';
import { HelpWindow } from './components/HelpWindow';
import { BookOpen, CircleHelp } from 'lucide-react';

export default function App() {
  const [windows, setWindows] = useState<Record<string, OSWindowType>>({
    mission: {
      id: 'mission',
      title: "Today's Mission",
      icon: 'mission',
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
      icon: 'messenger',
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
      icon: 'progress',
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
      icon: 'speaking',
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
      icon: 'inbox',
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
      icon: 'career',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 35,
      x: 120,
      y: 60,
      width: 740,
      height: 600,
    },
    notebook: {
      id: 'notebook', title: 'My Notebook', icon: 'notebook', isOpen: false,
      isMinimized: false, isMaximized: false, zIndex: 35, x: 75, y: 35,
      width: 620, height: 590,
    },
    help: {
      id: 'help', title: 'Help & Guide', icon: 'help', isOpen: false,
      isMinimized: false, isMaximized: false, zIndex: 36, x: 95, y: 55,
      width: 560, height: 570,
    },
    settings: {
      id: 'settings',
      title: 'Audio & System Settings',
      icon: 'settings',
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
          <div className="w-20 h-20 rounded-full bg-[#EAF2F5] flex items-center justify-center shadow-lg border-4 border-white"><BrandMascot size={70}/></div>
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
            <span></span>
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
        <div className="flex items-center gap-2 sm:gap-3"><BrandMascot size={54} className="hidden sm:block" /><div className="flex items-baseline space-x-2">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-[#25424D] drop-shadow-xs">
            ProSpeak
          </h1>
          <span className="text-4xl sm:text-5xl font-serif italic text-[#C9919B] font-semibold">
            OS
          </span>
        </div></div>
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
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/60 border border-white/80 shadow-md group-hover:shadow-lg transition-transform group-hover:-translate-y-0.5 flex items-center justify-center">
              <ProSpeakIcon name="inbox" size={40} />
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
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/60 border border-white/80 shadow-md group-hover:shadow-lg transition-transform group-hover:-translate-y-0.5 flex items-center justify-center">
              <ProSpeakIcon name="messenger" size={40} />
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
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/60 border border-white/80 shadow-md group-hover:shadow-lg transition-transform group-hover:-translate-y-0.5 flex items-center justify-center">
              <ProSpeakIcon name="speaking" size={40} />
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
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/60 border border-white/80 shadow-md group-hover:shadow-lg transition-transform group-hover:-translate-y-0.5 flex items-center justify-center">
              <ProSpeakIcon name="progress" size={40} />
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
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/60 border border-white/80 shadow-md group-hover:shadow-lg transition-transform group-hover:-translate-y-0.5 flex items-center justify-center">
              <ProSpeakIcon name="career" size={40} />
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
              onOpenNotebook={() => focusWindow('notebook')}
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

          {/* My Notebook Window */}
          <OSWindow
            window={windows.notebook} isActive={activeWindowId === 'notebook'}
            onFocus={focusWindow} onMinimize={minimizeWindow}
            onMaximize={maximizeWindow} onClose={closeWindow} onMove={moveWindow}
            defaultPositionClasses="absolute left-12 top-5 w-[620px] max-w-[90vw] h-[590px] max-h-[85vh]"
          ><NotebookWindow /></OSWindow>

          {/* Quick Help Window */}
          <OSWindow
            window={windows.help} isActive={activeWindowId === 'help'}
            onFocus={focusWindow} onMinimize={minimizeWindow}
            onMaximize={maximizeWindow} onClose={closeWindow} onMove={moveWindow}
            defaultPositionClasses="absolute left-16 top-6 w-[560px] max-w-[90vw] h-[570px] max-h-[85vh]"
          ><HelpWindow /></OSWindow>
          
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
        onOpenHelp={() => focusWindow('help')}
        windows={windows}
        activeWindowId={activeWindowId}
        onToggleWindow={toggleWindow}
        isStartMenuOpen={isStartMenuOpen}
        onToggleStartMenu={() => setIsStartMenuOpen(!isStartMenuOpen)}
      />

      <WelcomePanel onStart={() => focusWindow('mission')} onHelp={() => focusWindow('help')} />

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
