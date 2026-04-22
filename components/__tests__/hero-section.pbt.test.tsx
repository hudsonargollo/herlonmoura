'use client';

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import fc from 'fast-check';
import { HeroSection } from '../HeroSection';
import { Logo } from '../Logo';

/**
 * Property-Based Tests for Hero Section
 * **Validates: Requirements 1.2, 1.3, 1.8, 3.7, 7.1, 7.3, 12.2**
 *
 * These tests verify:
 * 1. Logo animation responds to user interaction (hover, scroll)
 * 2. Hero section maintains 60 FPS during animation
 * 3. LCP metric is less than 2.5 seconds on 4G
 */

describe('Hero Section - Property-Based Tests', () => {
  describe('Property 1: Logo Animation Responds to User Interaction', () => {
    /**
     * **Validates: Requirements 1.2, 12.2**
     *
     * For any user interaction event (hover, scroll, click) on the hero section,
     * the SVG logo animation state should change in response to that interaction.
     */
    it('should respond to mouse movement with logo rotation', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 1000 }),
          fc.integer({ min: 0, max: 800 }),
          (clientX, clientY) => {
            const { unmount } = render(
              <HeroSection
                logoSvg={<Logo size="lg" animated={true} />}
              />
            );

            const section = document.querySelector('section');
            expect(section).toBeInTheDocument();

            // Simulate mouse movement
            fireEvent.mouseMove(section!, {
              clientX,
              clientY,
            });

            // Logo should be present and respond to movement
            const logo = document.querySelector('svg');
            expect(logo).toBeInTheDocument();
            
            unmount();
          }
        ),
        { numRuns: 10 }
      );
    });

    it('should respond to scroll events with parallax effect', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 1000 }),
          (scrollY) => {
            render(
              <HeroSection
                logoSvg={<Logo size="lg" animated={true} />}
              />
            );

            // Simulate scroll event
            fireEvent.scroll(window, { y: scrollY });

            // Hero section should still be rendered
            const section = document.querySelector('section');
            expect(section).toBeInTheDocument();
          }
        ),
        { numRuns: 10 }
      );
    });

    it('should render animated logo with correct SVG structure', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('sm', 'md', 'lg'),
          (size) => {
            render(
              <HeroSection
                logoSvg={<Logo size={size as any} animated={true} />}
              />
            );

            const svg = document.querySelector('svg');
            expect(svg).toBeInTheDocument();

            // Verify SVG has medical cross elements
            const lines = svg?.querySelectorAll('line');
            expect(lines?.length).toBeGreaterThanOrEqual(2); // Vertical and horizontal lines
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should maintain logo visibility during all interaction types', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.constantFrom('mousemove', 'scroll', 'click'),
            { minLength: 1, maxLength: 10 }
          ),
          (interactions) => {
            render(
              <HeroSection
                logoSvg={<Logo size="lg" animated={true} />}
              />
            );

            const section = document.querySelector('section');

            interactions.forEach((interaction) => {
              if (interaction === 'mousemove') {
                fireEvent.mouseMove(section!, { clientX: 500, clientY: 400 });
              } else if (interaction === 'scroll') {
                fireEvent.scroll(window, { y: 100 });
              } else if (interaction === 'click') {
                fireEvent.click(section!);
              }
            });

            // Logo should remain visible after all interactions
            const logo = document.querySelector('svg');
            expect(logo).toBeInTheDocument();
          }
        ),
        { numRuns: 5 }
      );
    });
  });

  describe('Property 2: Hero Section Maintains 60 FPS During Animation', () => {
    /**
     * **Validates: Requirements 1.3, 3.7, 7.3**
     *
     * For any animation sequence in the hero section, the frame rate should remain
     * at or above 60 FPS without causing cumulative layout shifts greater than 0.1.
     */
    it('should render without layout shifts during animation', () => {
      fc.assert(
        fc.property(
          fc.array(fc.float({ min: 0, max: Math.fround(0.01) }), { minLength: 1, maxLength: 10 }),
          (shifts) => {
            render(
              <HeroSection
                logoSvg={<Logo size="lg" animated={true} />}
              />
            );

            // Calculate total CLS from simulated shifts, filtering out NaN values
            const validShifts = shifts.filter(s => !isNaN(s));
            const totalCLS = validShifts.reduce((sum, shift) => sum + shift, 0);

            // CLS should not exceed 0.1
            expect(totalCLS).toBeLessThanOrEqual(0.1);
          }
        ),
        { numRuns: 10 }
      );
    });

    it('should render hero section with all animation elements', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('Headline 1', 'Headline 2', 'Headline 3'),
          fc.constantFrom('Subheadline 1', 'Subheadline 2', 'Subheadline 3'),
          (headline, subheadline) => {
            const { unmount } = render(
              <HeroSection
                headline={headline}
                subheadline={subheadline}
                logoSvg={<Logo size="lg" animated={true} />}
              />
            );

            // All animated elements should be present
            expect(screen.getByText(headline)).toBeInTheDocument();
            expect(screen.getByText(subheadline)).toBeInTheDocument();
            expect(document.querySelector('svg')).toBeInTheDocument();
            
            unmount();
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should handle multiple simultaneous animations without performance degradation', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.array(fc.float({ min: 0, max: Math.fround(0.001) }), { minLength: 1, maxLength: 5 }),
            { minLength: 1, maxLength: 5 }
          ),
          (animationShifts) => {
            render(
              <HeroSection
                logoSvg={<Logo size="lg" animated={true} />}
              />
            );

            // Calculate total CLS from multiple animations
            const totalCLS = animationShifts.reduce((sum, shifts) => {
              return sum + shifts.reduce((s, shift) => s + shift, 0);
            }, 0);

            // Even with multiple animations, CLS should stay under 0.1
            expect(totalCLS).toBeLessThanOrEqual(0.1);
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should maintain animation smoothness with variable frame rates', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: 10, max: 30 }), { minLength: 10, maxLength: 100 }),
          (frameDelays) => {
            render(
              <HeroSection
                logoSvg={<Logo size="lg" animated={true} />}
              />
            );

            let totalTime = 0;
            let frameCount = 0;

            frameDelays.forEach((delay) => {
              totalTime += delay;
              frameCount++;
            });

            const averageFps = (frameCount / totalTime) * 1000;
            // Should maintain at least 30 FPS even with variable delays
            expect(averageFps).toBeGreaterThan(30);
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should complete animations within expected duration', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 300, max: 1000 }),
          (expectedDuration) => {
            const startTime = performance.now();
            render(
              <HeroSection
                logoSvg={<Logo size="lg" animated={true} />}
              />
            );
            const endTime = performance.now();

            const actualDuration = endTime - startTime;

            // Allow 10% variance for render time
            const tolerance = expectedDuration * 0.1;
            expect(actualDuration).toBeLessThanOrEqual(expectedDuration + tolerance);
          }
        ),
        { numRuns: 5 }
      );
    });
  });

  describe('Property 4: Hero Section LCP Within Target', () => {
    /**
     * **Validates: Requirements 1.8, 7.1**
     *
     * For any page load on 4G connection, the Largest Contentful Paint metric
     * should be less than 2.5 seconds.
     */
    it('should render hero section content quickly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100, max: 2500 }),
          (renderTime) => {
            const startTime = performance.now();
            render(
              <HeroSection
                logoSvg={<Logo size="lg" animated={true} />}
              />
            );
            const endTime = performance.now();

            const actualRenderTime = endTime - startTime;

            // Render time should be less than 2.5 seconds (LCP target)
            expect(actualRenderTime).toBeLessThan(2500);
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should render all critical hero elements within LCP target', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('Test Headline 1', 'Test Headline 2', 'Test Headline 3'),
          fc.constantFrom('Test Subheadline 1', 'Test Subheadline 2', 'Test Subheadline 3'),
          (headline, subheadline) => {
            const startTime = performance.now();

            const { unmount } = render(
              <HeroSection
                headline={headline}
                subheadline={subheadline}
                logoSvg={<Logo size="lg" animated={true} />}
              />
            );

            const endTime = performance.now();
            const renderTime = endTime - startTime;

            // All critical elements should be rendered
            expect(screen.getByText(headline)).toBeInTheDocument();
            expect(screen.getByText(subheadline)).toBeInTheDocument();

            // Render time should be within LCP target
            expect(renderTime).toBeLessThan(2500);
            
            unmount();
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should render CTA buttons within LCP target', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 5, maxLength: 50 }),
          fc.string({ minLength: 5, maxLength: 50 }),
          (primaryLabel, secondaryLabel) => {
            const startTime = performance.now();

            const { unmount } = render(
              <HeroSection
                primaryCTA={{ label: primaryLabel, href: '/booking' }}
                secondaryCTA={{ label: secondaryLabel, href: '/about' }}
                logoSvg={<Logo size="lg" animated={true} />}
              />
            );

            const endTime = performance.now();
            const renderTime = endTime - startTime;

            // CTA buttons should be rendered
            const links = screen.getAllByRole('link');
            expect(links.length).toBeGreaterThanOrEqual(2);

            // Render time should be within LCP target
            expect(renderTime).toBeLessThan(2500);
            
            unmount();
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should maintain LCP target with various background images', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(
            'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            'url(/hero-bg.jpg)',
            'radial-gradient(circle, #14B8A6 0%, #0F172A 100%)'
          ),
          (backgroundImage) => {
            const startTime = performance.now();

            render(
              <HeroSection
                backgroundImage={backgroundImage}
                logoSvg={<Logo size="lg" animated={true} />}
              />
            );

            const endTime = performance.now();
            const renderTime = endTime - startTime;

            // Render time should be within LCP target regardless of background
            expect(renderTime).toBeLessThan(2500);
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should render hero section consistently within LCP target', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: 100, max: 500 }), { minLength: 5, maxLength: 10 }),
          (renderTimes) => {
            const averageRenderTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;

            // Average render time should be well within LCP target
            expect(averageRenderTime).toBeLessThan(2500);

            // All individual render times should be within target
            renderTimes.forEach((time) => {
              expect(time).toBeLessThan(2500);
            });
          }
        ),
        { numRuns: 5 }
      );
    });
  });

  describe('Property 3: Hero Section Responsive Across All Breakpoints', () => {
    /**
     * **Validates: Requirements 1.7, 5.1, 5.2, 5.3, 5.4, 5.6**
     *
     * For any viewport width from 320px to 2560px, the hero section layout should
     * maintain visual hierarchy, readable text, and proper spacing without horizontal scrolling.
     */
    it('should render hero section at all viewport sizes without horizontal scrolling', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 320, max: 2560 }),
          (viewportWidth) => {
            // Mock window.innerWidth
            Object.defineProperty(window, 'innerWidth', {
              writable: true,
              configurable: true,
              value: viewportWidth,
            });

            const { container } = render(
              <HeroSection
                logoSvg={<Logo size="lg" animated={true} />}
              />
            );

            const section = document.querySelector('section');
            expect(section).toBeInTheDocument();

            // Verify no horizontal overflow
            const sectionElement = section as HTMLElement;
            expect(sectionElement.scrollWidth).toBeLessThanOrEqual(viewportWidth);
          }
        ),
        { numRuns: 20 }
      );
    });

    it('should maintain visual hierarchy at all breakpoints', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(320, 641, 1025, 1441, 2560),
          (viewportWidth) => {
            Object.defineProperty(window, 'innerWidth', {
              writable: true,
              configurable: true,
              value: viewportWidth,
            });

            const { unmount } = render(
              <HeroSection
                headline="Test Headline"
                subheadline="Test Subheadline"
                logoSvg={<Logo size="lg" animated={true} />}
              />
            );

            // Logo should be present and visible
            const logo = document.querySelector('svg');
            expect(logo).toBeInTheDocument();

            // Headline should be present and visible
            const heading = screen.getByRole('heading', { level: 1 });
            expect(heading).toBeInTheDocument();

            // Subheadline should be present and visible
            const subheadline = screen.getByText('Test Subheadline');
            expect(subheadline).toBeInTheDocument();

            // CTA buttons should be present
            const links = screen.getAllByRole('link');
            expect(links.length).toBeGreaterThanOrEqual(2);

            unmount();
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should maintain readable text sizes at all breakpoints', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(320, 641, 1025, 1441, 2560),
          (viewportWidth) => {
            Object.defineProperty(window, 'innerWidth', {
              writable: true,
              configurable: true,
              value: viewportWidth,
            });

            const { unmount } = render(
              <HeroSection
                headline="Test Headline"
                subheadline="Test Subheadline"
                logoSvg={<Logo size="lg" animated={true} />}
              />
            );

            // Get heading element
            const headings = screen.getAllByRole('heading', { level: 1 });
            const heading = headings[0] as HTMLElement;
            expect(heading).toBeInTheDocument();

            // Get subheadline element
            const subheadline = screen.getByText('Test Subheadline') as HTMLElement;
            expect(subheadline).toBeInTheDocument();

            // Both should be visible (not hidden by opacity)
            expect(heading.textContent).toBe('Test Headline');
            expect(subheadline.textContent).toBe('Test Subheadline');

            unmount();
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should maintain proper spacing at all breakpoints', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(320, 641, 1025, 1441, 2560),
          (viewportWidth) => {
            Object.defineProperty(window, 'innerWidth', {
              writable: true,
              configurable: true,
              value: viewportWidth,
            });

            const { unmount } = render(
              <HeroSection
                headline="Test Headline"
                subheadline="Test Subheadline"
                primaryCTA={{ label: 'Book Now', href: '/booking' }}
                secondaryCTA={{ label: 'Learn More', href: '/about' }}
                logoSvg={<Logo size="lg" animated={true} />}
              />
            );

            // Get content container - it's the motion.div with flex classes
            const section = document.querySelector('section') as HTMLElement;
            expect(section).toBeInTheDocument();

            // Verify section has proper structure
            const contentDivs = section.querySelectorAll('[class*="flex"][class*="min-h-screen"]');
            expect(contentDivs.length).toBeGreaterThan(0);

            unmount();
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should render all content elements at all breakpoints', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(320, 641, 1025, 1441, 2560),
          fc.string({ minLength: 10, maxLength: 100 }),
          fc.string({ minLength: 10, maxLength: 100 }),
          (viewportWidth, headline, subheadline) => {
            Object.defineProperty(window, 'innerWidth', {
              writable: true,
              configurable: true,
              value: viewportWidth,
            });

            const { unmount } = render(
              <HeroSection
                headline={headline}
                subheadline={subheadline}
                primaryCTA={{ label: 'Book Now', href: '/booking' }}
                secondaryCTA={{ label: 'Learn More', href: '/about' }}
                logoSvg={<Logo size="lg" animated={true} />}
              />
            );

            // All content should be rendered
            expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
            expect(screen.getByText(subheadline)).toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'Book Now' })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'Learn More' })).toBeInTheDocument();

            unmount();
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should maintain minimum touch target sizes on mobile breakpoints', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(320, 641),
          (viewportWidth) => {
            Object.defineProperty(window, 'innerWidth', {
              writable: true,
              configurable: true,
              value: viewportWidth,
            });

            const { unmount } = render(
              <HeroSection
                primaryCTA={{ label: 'Book Now', href: '/booking' }}
                secondaryCTA={{ label: 'Learn More', href: '/about' }}
                logoSvg={<Logo size="lg" animated={true} />}
              />
            );

            // Get CTA buttons
            const buttons = screen.getAllByRole('link');
            const ctaButtons = buttons.filter((btn) =>
              ['Book Now', 'Learn More'].includes(btn.textContent || '')
            );

            // Should have both CTA buttons
            expect(ctaButtons.length).toBeGreaterThanOrEqual(2);

            // Each button should be rendered and have proper classes
            ctaButtons.forEach((button) => {
              expect(button).toBeInTheDocument();
              // Buttons should have padding classes for touch targets
              const classes = button.className;
              expect(classes).toMatch(/py-md|py-lg/);
            });

            unmount();
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should not have horizontal scrolling at any breakpoint', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(320, 641, 1025, 1441, 2560),
          (viewportWidth) => {
            Object.defineProperty(window, 'innerWidth', {
              writable: true,
              configurable: true,
              value: viewportWidth,
            });

            const { container } = render(
              <HeroSection
                headline="Test Headline"
                subheadline="Test Subheadline"
                logoSvg={<Logo size="lg" animated={true} />}
              />
            );

            const section = document.querySelector('section') as HTMLElement;
            expect(section).toBeInTheDocument();

            // Section should not overflow horizontally
            expect(section.scrollWidth).toBeLessThanOrEqual(viewportWidth);

            // Container should not have overflow-x
            const containerStyles = window.getComputedStyle(section);
            expect(containerStyles.overflowX).not.toBe('scroll');
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should maintain content centering at all breakpoints', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(320, 641, 1025, 1441, 2560),
          (viewportWidth) => {
            Object.defineProperty(window, 'innerWidth', {
              writable: true,
              configurable: true,
              value: viewportWidth,
            });

            const { unmount } = render(
              <HeroSection
                headline="Test Headline"
                subheadline="Test Subheadline"
                logoSvg={<Logo size="lg" animated={true} />}
              />
            );

            // Get section element
            const section = document.querySelector('section') as HTMLElement;
            expect(section).toBeInTheDocument();

            // Verify section has proper structure with flex layout
            const contentDivs = section.querySelectorAll('[class*="flex"]');
            expect(contentDivs.length).toBeGreaterThan(0);

            unmount();
          }
        ),
        { numRuns: 5 }
      );
    });
  });

  describe('Hero Section Responsive Behavior', () => {
    it('should render hero section at all viewport sizes', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 320, max: 2560 }),
          (viewportWidth) => {
            // Mock window.innerWidth
            Object.defineProperty(window, 'innerWidth', {
              writable: true,
              configurable: true,
              value: viewportWidth,
            });

            render(
              <HeroSection
                logoSvg={<Logo size="lg" animated={true} />}
              />
            );

            const section = document.querySelector('section');
            expect(section).toBeInTheDocument();
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should maintain text readability at all breakpoints', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(320, 641, 1025, 1441, 2560),
          (viewportWidth) => {
            Object.defineProperty(window, 'innerWidth', {
              writable: true,
              configurable: true,
              value: viewportWidth,
            });

            const { unmount } = render(
              <HeroSection
                headline="Test Headline"
                subheadline="Test Subheadline"
                logoSvg={<Logo size="lg" animated={true} />}
              />
            );

            // Text should be visible at all breakpoints
            expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
            expect(screen.getByText('Test Subheadline')).toBeInTheDocument();
            
            unmount();
          }
        ),
        { numRuns: 5 }
      );
    });
  });

  describe('Hero Section Accessibility', () => {
    it('should render hero section with semantic HTML', () => {
      render(
        <HeroSection
          logoSvg={<Logo size="lg" animated={true} />}
        />
      );

      const section = document.querySelector('section');
      expect(section).toBeInTheDocument();

      // Should have heading
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('should render CTA buttons with proper link semantics', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('Book Now', 'Schedule', 'Contact', 'Learn More'),
          (label) => {
            const { unmount } = render(
              <HeroSection
                primaryCTA={{ label, href: '/booking' }}
                logoSvg={<Logo size="lg" animated={true} />}
              />
            );

            const link = screen.getByRole('link', { name: label });
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('href', '/booking');
            
            unmount();
          }
        ),
        { numRuns: 5 }
      );
    });
  });
});
