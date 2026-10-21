import React from 'react';

/** High-resolution transparent vector adaptation of the ProSpeak chameleon mascot. */
export function BrandMascot({ size = 40, className = '' }: { size?: number; className?: string }) {
  return <img
    src={import.meta.env.BASE_URL + 'brand/prospeak-mascot-hd.svg'}
    width={size} height={size} className={'object-contain shrink-0 ' + className}
    alt="ProSpeak chameleon mascot" draggable={false}
  />;
}
