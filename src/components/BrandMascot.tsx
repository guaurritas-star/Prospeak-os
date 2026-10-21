import React from 'react';

/** Exact ProSpeak mascot artwork supplied by the brand, optimized for small UI uses. */
export function BrandMascot({ size = 40, className = '' }: { size?: number; className?: string }) {
  return <img
    src={import.meta.env.BASE_URL + 'brand/prospeak-mascot.webp'}
    width={size} height={size} className={'object-contain shrink-0 ' + className}
    alt="ProSpeak chameleon mascot" draggable={false}
  />;
}
