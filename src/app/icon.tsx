// src/app/icon.tsx
import { ImageResponse } from 'next/og';
import { BrandEmblem } from '@/components/ui/brand-emblem';

export const size = { width: 32, height: 32 } as const;
export const contentType = 'image/png';

/**
 * 32x32 favicon: compass-rose emblem rasterised on a navy gradient. The SVG
 * is shared with the in-app `BrandMark` so the favicon and the header logo
 * stay byte-for-byte identical in shape.
 */
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0e1422 0%, #080d18 100%)',
        color: '#fafaf7'
      }}
    >
      <BrandEmblem width={26} height={26} />
    </div>,
    { ...size }
  );
}
