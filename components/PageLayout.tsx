import React from 'react';
import { Header, Footer, Container } from './index';

interface PageLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  headerProps?: React.ComponentProps<typeof Header>;
  footerProps?: React.ComponentProps<typeof Footer>;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function PageLayout({
  children,
  header,
  footer,
  headerProps,
  footerProps,
  showHeader = true,
  showFooter = true,
}: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-dark-elevated">
      {/* Header */}
      {showHeader && (header || <Header {...headerProps} />)}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      {showFooter && (footer || <Footer {...footerProps} />)}
    </div>
  );
}

/**
 * Hero Page Layout - Full width hero section with content below
 */
interface HeroPageLayoutProps extends PageLayoutProps {
  heroContent: React.ReactNode;
  heroHeight?: 'screen' | '3/4' | '1/2';
}

export function HeroPageLayout({
  heroContent,
  heroHeight = 'screen',
  children,
  ...props
}: HeroPageLayoutProps) {
  const heightClass = {
    screen: 'min-h-screen',
    '3/4': 'min-h-3/4',
    '1/2': 'min-h-1/2',
  }[heroHeight];

  return (
    <PageLayout {...props}>
      {/* Hero Section */}
      <section className={`${heightClass} flex items-center justify-center`}>
        {heroContent}
      </section>

      {/* Content Section */}
      <section>{children}</section>
    </PageLayout>
  );
}

/**
 * Content Page Layout - Standard page with container
 */
interface ContentPageLayoutProps extends PageLayoutProps {
  title?: string;
  subtitle?: string;
  breadcrumbs?: React.ReactNode;
}

export function ContentPageLayout({
  title,
  subtitle,
  breadcrumbs,
  children,
  ...props
}: ContentPageLayoutProps) {
  return (
    <PageLayout {...props}>
      <Container className="py-5xl">
        {/* Breadcrumbs */}
        {breadcrumbs && <div className="mb-xl">{breadcrumbs}</div>}

        {/* Page Header */}
        {(title || subtitle) && (
          <div className="mb-3xl">
            {title && <h1 className="text-display-lg text-neutral-light">{title}</h1>}
            {subtitle && <p className="mt-md text-body-lg text-neutral-medium">{subtitle}</p>}
          </div>
        )}

        {/* Page Content */}
        {children}
      </Container>
    </PageLayout>
  );
}

/**
 * Grid Page Layout - Page with grid of items
 */
interface GridPageLayoutProps extends ContentPageLayoutProps {
  gridCols?: number;
  gridGap?: 'sm' | 'md' | 'lg' | 'xl';
}

export function GridPageLayout({
  gridCols = 3,
  gridGap = 'lg',
  children,
  ...props
}: GridPageLayoutProps) {
  const gapClass = {
    sm: 'gap-md',
    md: 'gap-lg',
    lg: 'gap-xl',
    xl: 'gap-2xl',
  }[gridGap];

  return (
    <ContentPageLayout {...props}>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${gridCols} ${gapClass}`}>
        {children}
      </div>
    </ContentPageLayout>
  );
}
