'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  logo?: React.ReactNode;
  navItems?: Array<{ label: string; href: string }>;
  ctaButton?: { label: string; href: string };
}

export function Header({ logo, navItems = [], ctaButton }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-sticky glass-card border-b border-glass">
      <div className="container mx-auto flex items-center justify-between px-lg py-lg">
        {/* Logo */}
        <div className="flex-shrink-0">
          {logo ? (
            logo
          ) : (
            <Link href="/" className="text-heading-2 font-bold text-surgical-teal">
              Logo
            </Link>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-xl md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-body-regular text-neutral-light transition-colors hover:text-surgical-teal"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        {ctaButton && (
          <div className="hidden md:block">
            <Link
              href={ctaButton.href}
              className="inline-flex items-center justify-center rounded-lg bg-surgical-teal px-lg py-md font-medium text-white transition-all hover:bg-surgical-teal-dark"
            >
              {ctaButton.label}
            </Link>
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-neutral-light" />
          ) : (
            <Menu className="h-6 w-6 text-neutral-light" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="border-t border-glass bg-dark-elevated px-lg py-lg md:hidden">
          <div className="flex flex-col gap-md">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-body-regular text-neutral-light transition-colors hover:text-surgical-teal"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {ctaButton && (
              <Link
                href={ctaButton.href}
                className="inline-flex items-center justify-center rounded-lg bg-surgical-teal px-lg py-md font-medium text-white transition-all hover:bg-surgical-teal-dark"
                onClick={() => setIsMenuOpen(false)}
              >
                {ctaButton.label}
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
