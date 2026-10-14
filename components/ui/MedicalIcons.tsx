'use client';
import React from 'react';

export function LungsSvg({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round'>
      <path d='M12 3v9m0 0c-2.5-3-6-2-6 2 0 4 3 7 6 9m0-11c2.5-3 6-2 6 2 0 4-3 7-6 9' />
    </svg>
  );
}

export function ActivitySvg({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round'>
      <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
    </svg>
  );
}

export function HeartPulseSvg({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round'>
      <path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' />
      <path d='M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27' />
    </svg>
  );
}

export function StethoscopeSvg({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round'>
      <path d='M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3' />
      <path d='M8 15v1a6 6 0 0 0 6 6a6 6 0 0 0 6-6v-4' />
      <circle cx='20' cy='10' r='2' />
    </svg>
  );
}

export function CalendarSvg({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round'>
      <rect x='3' y='4' width='18' height='18' rx='2' />
      <path d='M16 2v4M8 2v4M3 10h18' />
    </svg>
  );
}

export function ClipboardSvg({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round'>
      <rect x='8' y='2' width='8' height='4' rx='1' />
      <path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2' />
      <path d='M9 12h6M9 16h6' />
    </svg>
  );
}
