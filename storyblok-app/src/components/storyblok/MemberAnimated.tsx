'use client';

import * as motion from 'motion/react-client';

interface MemberAnimatedProps {
  children: React.ReactNode;
  delay?: number;
}

export function MemberImage({ children, delay = 0 }: MemberAnimatedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, delay: delay + 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export function MemberText({ children, delay = 0 }: MemberAnimatedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
