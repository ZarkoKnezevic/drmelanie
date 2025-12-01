'use client';

import { useEffect, useState } from 'react';
import * as motion from 'motion/react-client';
import { useLoading } from '@/contexts/loading-context';

interface BannerAnimatedProps {
  children: React.ReactNode;
  delay?: number;
  animationType?: 'fade-up' | 'fade-down' | 'scale';
  className?: string;
  immediate?: boolean; // If true, animate immediately instead of waiting for scroll
}

export function BannerAnimated({ 
  children, 
  delay = 0,
  animationType = 'fade-up',
  className,
  immediate = false
}: BannerAnimatedProps) {
  const { isInitialLoading } = useLoading();
  const [canAnimate, setCanAnimate] = useState(false);

  useEffect(() => {
    if (!isInitialLoading) {
      // Wait for loading to complete, then allow animations
      const timer = setTimeout(() => {
        setCanAnimate(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isInitialLoading, delay]);

  const getInitialProps = () => {
    switch (animationType) {
      case 'fade-down':
        return { opacity: 0, y: 16 };
      case 'scale':
        return { opacity: 0, scale: 0.8 };
      case 'fade-up':
      default:
        return { opacity: 0, y: -24 };
    }
  };

  // If still loading, show content but hidden
  if (isInitialLoading || !canAnimate) {
    return (
      <div className={className} style={{ opacity: 0 }}>
        {children}
      </div>
    );
  }

  // Once loading is complete, animate based on mode
  if (immediate) {
    // Animate immediately (for Hero at top of page)
    return (
      <motion.div
        className={className}
        initial={getInitialProps()}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    );
  }

  // Use scroll-triggered animation (for Banner and other components)
  return (
    <motion.div
      className={className}
      initial={getInitialProps()}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

