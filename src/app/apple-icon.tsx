// src/app/apple-icon.tsx
import { ImageResponse } from 'next/og';
import { BrandEmblem } from '@/components/ui/brand-emblem';

export const size = { width: 180, height: 180 } as const;
export const contentType = 'image/png';

/**
 * 180x180 Apple touch icon: compass-rose emblem on a navy gradient. iOS clips
 * the asset to a rounded square, so we ship it edge-to-edge with no internal
 * border — the silhouette comes from the OS chrome.
 */
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(140deg, #0e1422 0%, #080d18 100%)',
        color: '#fafaf7'
      }}
    >
      <BrandEmblem width={132} height={132} />
    </div>,
    { ...size }
  );
}
