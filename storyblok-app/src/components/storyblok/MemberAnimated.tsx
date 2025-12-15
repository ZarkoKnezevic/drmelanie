'use client';

import * as motion from 'motion/react-client';

interface MemberAnimatedProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'left' | 'right';
}

export function MemberImage({ children, delay = 0 }: MemberAnimatedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, x: -40 }}
      whileInView={{ opacity: 1, scale: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1], // Smooth, elegant easing curve
      }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}

export function MemberText({ children, delay = 0, direction = 'right' }: MemberAnimatedProps) {
  const xOffset = direction === 'left' ? -50 : 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, x: xOffset }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.85,
        delay: delay + 0.15, // Staggered delay after image for cascading effect
        ease: [0.16, 1, 0.3, 1],
      }}
      className="will-change-transform md:col-span-1 lg:col-span-2"
    >
      {children}
    </motion.div>
  );
}
