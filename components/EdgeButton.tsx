'use client';

import React from 'react';

/* ============================================
   EdgeButton — the site's primary action element.

   Replaces the previous rounded, soft-shadow buttons. Angular by design:
   a squared block with a notched bottom-right corner, uppercase letterspaced
   label, hard offset shadow, and a fill that sweeps up from the bottom on
   hover. Reads as deliberate rather than generic.

   Renders as <a> when `href` is given, otherwise <button>.
   ============================================ */

export type EdgeButtonVariant =
  | 'primary'
  | 'gold'
  | 'outline'
  | 'ghost'
  | 'whatsapp';

export interface EdgeButtonProps {
  variant?: EdgeButtonVariant;
  /** Compact sizing for in-card actions. */
  size?: 'md' | 'sm';
  /** Stretch to the container width. */
  block?: boolean;
  href?: string;
  /** Open href in a new tab (adds rel="noopener noreferrer"). */
  external?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  'aria-label'?: string;
}

export function EdgeButton({
  variant = 'primary',
  size = 'md',
  block = false,
  href,
  external = false,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  style,
  children,
  'aria-label': ariaLabel,
}: EdgeButtonProps) {
  const classes = [
    'btn-edge',
    `btn-edge-${variant}`,
    size === 'sm' ? 'btn-edge-sm' : '',
    block ? 'btn-edge-block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (href && !disabled) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={classes}
        style={style}
        aria-label={ariaLabel}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      style={style}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
