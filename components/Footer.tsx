import React from 'react';
import Link from 'next/link';

interface FooterSection {
  title: string;
  links: Array<{ label: string; href: string }>;
}

interface FooterProps {
  sections?: FooterSection[];
  socialLinks?: Array<{ label: string; href: string; icon?: React.ReactNode }>;
  copyright?: string;
}

export function Footer({
  sections = [],
  socialLinks = [],
  copyright = `© ${new Date().getFullYear()} Dr. Herlon Moura. All rights reserved.`,
}: FooterProps) {
  return (
    <footer className="border-t border-glass bg-dark-elevated">
      <div className="container mx-auto px-lg py-5xl">
        {/* Footer Sections */}
        {sections.length > 0 && (
          <div className="mb-5xl grid grid-cols-1 gap-3xl md:grid-cols-2 lg:grid-cols-4">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-lg text-heading-3 text-neutral-light">{section.title}</h3>
                <ul className="space-y-md">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-body-regular text-neutral-medium transition-colors hover:text-surgical-teal"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="mb-5xl flex gap-lg">
            {socialLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-neutral-medium transition-colors hover:text-surgical-teal"
                aria-label={link.label}
              >
                {link.icon || link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Copyright */}
        <div className="border-t border-glass pt-lg text-center">
          <p className="text-body-small text-neutral-medium">{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
