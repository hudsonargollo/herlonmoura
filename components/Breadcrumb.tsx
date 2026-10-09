import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav
      className={`flex items-center gap-md ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-md">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-md">
            {item.href ? (
              <Link
                href={item.href}
                className="text-body-small text-primary transition-colors hover:text-primary-hover"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-body-small text-muted-foreground">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
