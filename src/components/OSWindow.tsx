import React, { useState, useEffect, useRef } from 'react';
import { OSWindow as OSWindowType } from '../types/os';
import { playSound } from '../utils/audio';

interface OSWindowProps {
  window: OSWindowType;
  isActive: boolean;
  onFocus: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onClose: (id: string) => void;
  onMove?: (id: string, x: number, y: number) => void;
  children: React.ReactNode;
  defaultPositionClasses?: string;
  className?: string;
}

export const OSWindow: React.FC<OSWindowProps> = ({
  window: win,
  isActive,
  onFocus,
  onMinimize,
  onMaximize,
  onClose,
  onMove,
  children,
  defaultPositionClasses = '',
  className = '',
}) => {
  const [pos, setPos] = useState({ x: win.x, y: win.y });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });

  useEffect(() => {
    setPos({ x: win.x, y: win.y });
  }, [win.x, win.y]);

  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus(win.id);
    if (win.isMaximized) return;

    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('select')) return;

    setIsDragging(true);
    dragRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: pos.x,
      posY: pos.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - dragRef.current.mouseX;
      const dy = moveEvent.clientY - dragRef.current.mouseY;
      const newX = Math.max(-200, Math.min(window.innerWidth - 150, dragRef.current.posX + dx));
      const newY = Math.max(0, Math.min(window.innerHeight - 100, dragRef.current.posY + dy));
      setPos({ x: newX, y: newY });
      onMove?.(win.id, newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  if (!win.isOpen || win.isMinimized) return null;

  const style: React.CSSProperties = win.isMaximized
    ? {
        position: 'absolute',
        top: '8px',
        left: '10px',
        right: '10px',
        bottom: '48px',
        width: 'calc(100% - 20px)',
        height: 'calc(100% - 56px)',
        zIndex: win.zIndex,
      }
    : pos.x !== 0 || pos.y !== 0
    ? {
        position: 'absolute',
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        zIndex: win.zIndex,
      }
    : {
        zIndex: win.zIndex,
      };

  return (
    <section
      id={`window-${win.id}`}
      style={style}
      onClick={() => onFocus(win.id)}
      className={`bg-[#FCFCFD]/95 backdrop-blur-md rounded-2xl border border-white/90 overflow-hidden flex flex-col transition-shadow duration-150 shadow-2xl ${
        isActive ? 'ring-1 ring-white/90 shadow-[0_12px_36px_rgba(30,60,80,0.18)]' : 'shadow-[0_8px_24px_rgba(0,0,0,0.08)] opacity-95'
      } ${!win.isMaximized && pos.x === 0 && pos.y === 0 ? defaultPositionClasses : ''} ${className}`}
    >
      {/* XP/Modern Hybrid Titlebar */}
      <header
        onMouseDown={handleMouseDown}
        onDoubleClick={() => {
          playSound('click');
          onMaximize(win.id);
        }}
        className={`${
          isActive ? 'xp-titlebar-active' : 'xp-titlebar-gradient'
        } px-4 py-2 flex items-center justify-between cursor-move select-none rounded-t-2xl flex-shrink-0 transition-colors border-b border-[#BFD4E2]`}
      >
        <div className="flex items-center space-x-2.5 pointer-events-none">
          <span className="text-sm filter drop-shadow-xs">{win.icon}</span>
          <span className="text-xs sm:text-sm font-bold tracking-tight text-[#233F49] font-sans">{win.title}</span>
        </div>

        {/* Window controls */}
        <div className="flex items-center space-x-1.5 z-10">
          <button
            type="button"
            className="w-5 h-4.5 sm:w-6 sm:h-5 rounded-[4px] bg-[#E3EEF4] border border-[#ABC1CE] hover:bg-[#D5E5EE] active:scale-95 flex items-center justify-center text-[#2A4B59] transition"
            onClick={(e) => {
              e.stopPropagation();
              playSound('click');
              onMinimize(win.id);
            }}
            title="Minimize"
          >
            <span className="block w-2.5 h-[2px] bg-[#2A4B59] rounded-sm mb-1" />
          </button>

          <button
            type="button"
            className="w-5 h-4.5 sm:w-6 sm:h-5 rounded-[4px] bg-[#E3EEF4] border border-[#ABC1CE] hover:bg-[#D5E5EE] active:scale-95 flex items-center justify-center text-[#2A4B59] transition"
            onClick={(e) => {
              e.stopPropagation();
              playSound('click');
              onMaximize(win.id);
            }}
            title={win.isMaximized ? 'Restore' : 'Maximize'}
          >
            {win.isMaximized ? (
              <span className="relative block w-2.5 h-2.5">
                <span className="absolute top-0 right-0 w-2 h-2 border-[1.2px] border-[#2A4B59] bg-[#E3EEF4]" />
                <span className="absolute bottom-0 left-0 w-2 h-2 border-[1.2px] border-[#2A4B59] bg-white" />
              </span>
            ) : (
              <span className="block w-2.5 h-2.5 border-[1.5px] border-[#2A4B59] rounded-[1px]" />
            )}
          </button>

          <button
            type="button"
            className="w-5 h-4.5 sm:w-6 sm:h-5 rounded-[4px] bg-gradient-to-b from-[#E78794] to-[#C85162] border border-[#9A303F] hover:brightness-110 active:scale-95 flex items-center justify-center text-white font-bold text-xs transition"
            onClick={(e) => {
              e.stopPropagation();
              playSound('click');
              onClose(win.id);
            }}
            title="Close"
          >
            ✕
          </button>
        </div>
      </header>

      {/* Window Body */}
      <div className="flex-1 flex flex-col overflow-hidden relative">{children}</div>
    </section>
  );
};
