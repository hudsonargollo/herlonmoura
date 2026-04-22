import { Variants } from 'framer-motion';

/**
 * Animation presets for common patterns
 * All animations are optimized for 60 FPS performance
 */

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: 'easeInOut',
    },
  },
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: 'easeInOut',
    },
  },
};

export const slideDownVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: 'easeInOut',
    },
  },
};

export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1,
      ease: 'easeInOut',
    },
  },
};

export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1,
      ease: 'easeInOut',
    },
  },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
};

export const pulseVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: [1, 0.5, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Parallax effect for background images
 * Responds to scroll position
 */
export const parallaxVariants: Variants = {
  hidden: { y: 0 },
  visible: {
    y: -50,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/**
 * Hover effect for interactive elements
 */
export const hoverScaleVariants: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

/**
 * Tap effect for buttons and clickable elements
 */
export const tapVariants: Variants = {
  rest: { scale: 1 },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: 'easeInOut',
    },
  },
};

/**
 * Stagger container for animating multiple children
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Stagger item for use with stagger container
 */
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
};

/**
 * Animation configuration for optimal performance
 */
export const animationConfig = {
  // Reduce motion for accessibility
  reduceMotion: 'user' as const,
  // GPU acceleration
  acceleratedAnimation: true,
  // Target 60 FPS
  targetFPS: 60,
};

/**
 * Utility function to get animation variants based on user preferences
 */
export function getAnimationVariants(
  variants: Variants,
  prefersReducedMotion: boolean
): Variants {
  if (prefersReducedMotion) {
    return {
      hidden: variants.hidden,
      visible: {
        ...variants.visible,
        transition: {
          duration: 0.01,
        },
      },
    };
  }
  return variants;
}

/**
 * Utility function to check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
