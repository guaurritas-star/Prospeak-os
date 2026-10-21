import React from 'react';

/**
 * ProSpeak's custom pastel 3D icon family. One optimized transparent sprite
 * provides the matching icons across desktop, titlebars, start menu and apps.
 * Cells are ordered left-to-right: mission, inbox, messenger, speaking;
 * progress, career, settings, challenge.
 */
export type ProSpeakIconName = 'mission' | 'inbox' | 'messenger' | 'speaking' | 'progress' | 'career' | 'settings' | 'challenge';

const cells: Record<ProSpeakIconName, [number, number]> = {
  mission: [0, 0], inbox: [1, 0], messenger: [2, 0], speaking: [3, 0],
  progress: [0, 1], career: [1, 1], settings: [2, 1], challenge: [3, 1],
};

const labels: Record<ProSpeakIconName, string> = {
  mission: 'Mission', inbox: 'Inbox', messenger: 'Messenger',
  speaking: 'Speaking Lab', progress: 'My Progress',
  career: 'Career Paths', settings: 'Settings', challenge: 'Challenges',
};

export const iconForWindow = (id: string): ProSpeakIconName => {
  if (id === 'mission' || id === 'inbox' || id === 'messenger' || id === 'speaking' ||
      id === 'progress' || id === 'career' || id === 'settings') return id;
  return 'challenge';
};

export function ProSpeakIcon({ name, size = 28, decorative = true, className = '' }: {
  name: ProSpeakIconName; size?: number; decorative?: boolean; className?: string;
}) {
  const [x, y] = cells[name];
  return (
    <span
      className={`inline-block flex-shrink-0 align-middle ${className}`}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : labels[name]}
      aria-hidden={decorative ? true : undefined}
      style={{
        width: size, height: size,
        backgroundImage: `url("${import.meta.env.BASE_URL}icons/prospeak-sprite.webp")`,
        backgroundPosition: `${(x / 3) * 100}% ${y * 100}%`,
        backgroundSize: '400% 200%',
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
}
