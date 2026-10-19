'use client';

import React, { useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  /** WebM source (smaller; preferred by browsers that support it). */
  webmSrc: string;
  /** MP4 fallback source. */
  mp4Src: string;
  /** Poster frame shown before the video buffers (WebP, ~8KB). */
  posterSrc: string;
  /** object-position for the video, e.g. 'center' or '60% 40%'. */
  objectPosition?: string;
  className?: string;
}

/**
 * Full-bleed, muted, looping background video.
 *
 * - The audio track is stripped from the encoded assets; `muted` + `playsInline`
 *   are what actually allow autoplay, and we also force muted/volume=0 in JS so
 *   a source that regains an audio track can never make noise.
 * - Respects `prefers-reduced-motion`: pauses the loop and leaves the poster.
 * - `aria-hidden` + `tabIndex={-1}` keep it out of the a11y tree and tab order.
 *
 * Position it as the first child of a `relative` container; the caller owns the
 * scrim and the content overlay on top.
 */
export function VideoBackground({
  webmSrc,
  mp4Src,
  posterSrc,
  objectPosition = 'center',
  className = '',
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.volume = 0;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      if (mq.matches) {
        video.pause();
      } else {
        void video.play().catch(() => {
          /* autoplay blocked — the poster frame remains */
        });
      }
    };

    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={posterSrc}
      aria-hidden
      tabIndex={-1}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
      style={{ objectPosition }}
    >
      <source src={webmSrc} type="video/webm" />
      <source src={mp4Src} type="video/mp4" />
    </video>
  );
}

/** Shared asset paths for the Dr. Herlon hero/background loop. */
export const VASCULAR_VIDEO = {
  webmSrc: '/images/videos/herlonmoura-hero-muted.webm',
  mp4Src: '/images/videos/herlonmoura-hero-muted.mp4',
  posterSrc: '/images/videos/herlonmoura-hero-poster.webp',
} as const;
