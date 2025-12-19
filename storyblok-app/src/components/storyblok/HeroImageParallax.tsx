'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import * as motion from 'motion/react-client';
import { useScroll, useTransform } from 'motion/react';

interface HeroImageParallaxProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  sizes?: string;
  sectionRef?: React.RefObject<HTMLElement | null>;
}

export function HeroImageParallax({
  src,
  alt,
  className,
  containerClassName,
  priority = false,
  sizes,
  sectionRef,
}: HeroImageParallaxProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Use section ref if provided and desktop, otherwise use viewport scroll
  const { scrollYProgress } = useScroll({
    target: isDesktop && sectionRef ? sectionRef : undefined,
    offset: ['start start', 'end start'],
  });

  // Parallax effect: move image slower than scroll (negative value moves up) - only on desktop
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);

  // On mobile, render without parallax
  if (!isDesktop) {
    return (
      <div className={containerClassName}>
        <div className="relative h-full w-full">
          <Image
            src={src}
            alt={alt}
            fill
            className={className}
            priority={priority}
            sizes={sizes}
          />
        </div>
      </div>
    );
  }

  // On desktop, render with parallax
  return (
    <div className={containerClassName}>
      <motion.div
        style={{ y }}
        className="relative h-full w-full"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={className}
          priority={priority}
          sizes={sizes}
        />
      </motion.div>
    </div>
  );
}

