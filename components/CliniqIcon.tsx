'use client';

import React from 'react';

/* ============================================
   CliniqIcon — the ORIGINAL icon glyphs from herlonmoura.com.br
   The source site is WordPress on the "cliniq" medical theme, which
   ships its icons as a set of custom @font-face families. We vendor
   those exact .woff files (public/fonts/cliniq/) and render the same
   codepoints the theme uses, so each procedure carries its genuine
   original icon rather than a lookalike.

   Codepoints below were extracted from the live page markup
   (data-ico-<family>="&#xNNNN;") and verified present in each font.
   ============================================ */

export type CliniqFont =
  | 'CliniqDentistry'
  | 'CliniqHealth'
  | 'CliniqMedic'
  | 'CliniqNursing'
  | 'CliniqOrthopedics'
  | 'CliniqRemixHealth';

/** Icon key -> [font family, codepoint]. Mirrors the source site 1:1. */
export const CLINIQ_GLYPHS = {
  /** Doppler vascular — Dentistry U+F124 (toothbrush) */
  doppler: ['CliniqDentistry', 0xf124],
  /** Tratamento de varizes com laser — Dentistry U+F118 (tooth drill) */
  laser: ['CliniqDentistry', 0xf118],
  /** Escleroterapia com espuma densa — RemixIconsHealth U+E932 */
  foam: ['CliniqRemixHealth', 0xe932],
  /** Microcirurgia de varizes — Medic U+E912 */
  microsurgery: ['CliniqMedic', 0xe912],
  /** Port-o-Cath — Medic U+E901 */
  portocath: ['CliniqMedic', 0xe901],
  /** Permcath — Health U+F102 */
  permcath: ['CliniqHealth', 0xf102],
  /** Fístula arteriovenosa — Nursing U+F11C */
  fistula: ['CliniqNursing', 0xf11c],
  /** Trombose venosa — Medic U+E912 */
  thrombosisVenous: ['CliniqMedic', 0xe912],
  /** Trombose arterial — Medic U+E912 */
  thrombosisArterial: ['CliniqMedic', 0xe912],
  /** Obstrução arterial crônica — Dentistry U+F12F (suction) */
  chronicObstruction: ['CliniqDentistry', 0xf12f],
  /** Angioplastia de membros inferiores — Orthopedics U+E902 */
  angioplasty: ['CliniqOrthopedics', 0xe902],
  /** Obstruções das carótidas — Dentistry U+F125 (toothbrush 2) */
  carotid: ['CliniqDentistry', 0xf125],
  /** Aneurisma de aorta — Medic U+E90F */
  aorticAneurysm: ['CliniqMedic', 0xe90f],
  /** Dissecção de aorta — Medic U+E911 */
  aorticDissection: ['CliniqMedic', 0xe911],
  /** Aneurismas viscerais — Medic U+E924 */
  visceralAneurysm: ['CliniqMedic', 0xe924],
} as const;

export type CliniqIconName = keyof typeof CLINIQ_GLYPHS;

interface CliniqIconProps {
  name: CliniqIconName;
  /** Rendered glyph size in px. */
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  /**
   * Wrap the glyph in an animated glow: a pulsing halo plus an expanding
   * ring. Adds the `glow-ring` utility which needs `position: relative`.
   */
  glow?: boolean;
  /** Colour of the glyph and its glow. Defaults to the brand action colour. */
  color?: string;
  /** Continuous gentle float animation. */
  float?: boolean;
  title?: string;
}

export function CliniqIcon({
  name,
  size = 24,
  className = '',
  style,
  glow = false,
  color = 'var(--s-color-action-primary)',
  float = false,
  title,
}: CliniqIconProps) {
  const [font, codepoint] = CLINIQ_GLYPHS[name];
  const glyph = String.fromCodePoint(codepoint as number);

  return (
    <span
      className={`cliniq-icon ${glow ? 'glow-ring relative' : ''} ${float ? 'icon-float' : ''} ${className}`}
      style={{
        fontFamily: font,
        fontSize: `${size}px`,
        color,
        ...style,
      }}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      aria-label={title}
    >
      {glyph}
    </span>
  );
}
