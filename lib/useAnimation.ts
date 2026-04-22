import { useEffect, useState } from 'react';
import { prefersReducedMotion } from './animations';

/**
 * Hook to detect if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    // Check initial preference
    setPrefersReduced(prefersReducedMotion());

    // Listen for changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReduced(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReduced;
}

/**
 * Hook to measure animation performance (frame rate)
 */
export function useAnimationPerformance() {
  const [fps, setFps] = useState(60);
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const measureFPS = (currentTime: number) => {
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        const currentFps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setFps(currentFps);
        setIsLowPerformance(currentFps < 50);

        frameCount = 0;
        lastTime = currentTime;
      }

      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return { fps, isLowPerformance };
}

/**
 * Hook to detect cumulative layout shift
 */
export function useCumulativeLayoutShift() {
  const [cls, setCls] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if ((entry as any).hadRecentInput) continue;
          setCls((prev) => prev + (entry as any).value);
        }
      });

      observer.observe({ type: 'layout-shift', buffered: true });

      return () => observer.disconnect();
    } catch (e) {
      // PerformanceObserver not supported
    }
  }, []);

  return cls;
}
