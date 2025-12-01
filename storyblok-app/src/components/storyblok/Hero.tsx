'use client';

import { storyblokEditable } from '@storyblok/react/rsc';
import Image from 'next/image';
import { motion } from 'motion/react';
import { cn, getBackgroundClass } from '@/utils';
import type { StoryblokBlok } from '@/types';

interface HeroProps {
  blok: StoryblokBlok & {
    logo?: {
      filename: string;
      alt?: string;
    };
    headline: string;
    image?: {
      filename: string;
      alt?: string;
    };
    cta_text?: string;
    cta_link?: string;
    background?: string;
  };
}

export default function Hero({ blok }: HeroProps) {
  const backgroundClass = getBackgroundClass(blok.background);

  return (
    <section
      {...storyblokEditable(blok)}
      className={cn(
        'hero relative flex flex-col overflow-hidden md:min-h-[80vh] md:flex-row',
        backgroundClass || 'bg-background'
      )}
    >
      {/* Mobile: Image first (flex-column) */}
      {blok.image?.filename && (
        <div className="relative h-[50vh] w-full md:hidden">
          <Image
            src={blok.image.filename}
            alt={blok.image.alt || blok.headline}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Mobile Logo - Top Left on Image */}
          {blok.logo?.filename && (
            <div className="absolute top-10 left-4 z-20">
              <div className="relative h-48 w-48">
                {/* Background blob image with grow-in animation */}
                <motion.div
                  className="blob absolute inset-0"
                  style={{
                    backgroundImage: 'url(/blob.png)',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right top',
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
                {/* Logo at full opacity, appears slightly after blob */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
                >
                  <Image
                    src={blok.logo.filename}
                    alt={blok.logo.alt || 'Logo'}
                    fill
                    className="object-contain relative z-10"
                    priority
                  />
                </motion.div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Left Section - Logo and Headline (with container) */}
      <div className={cn(
        'relative z-10 flex flex-1 flex-col items-center justify-center py-12 md:py-0',
        'torn-edge torn-edge-top md:torn-edge-top-none',
        backgroundClass || 'bg-background'
      )}>
        <div className="container">
          <div className="w-full md:w-1/2 lg:w-[40%] space-y-0 md:space-y-16 lg:space-y-20">
            {/* Logo - Desktop only, animated */}
            {blok.logo?.filename && (
              <motion.div
                className="relative hidden md:block h-24 w-full md:h-40 lg:h-48 xxl:h-64"
                initial={{ opacity: 0, x: -24, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              >
                <Image
                  src={blok.logo.filename}
                  alt={blok.logo.alt || 'Logo'}
                  fill
                  className="object-contain object-left"
                  priority
                />
              </motion.div>
            )}

            {/* Headline with slide-down animation */}
            <motion.h1
              className="h1 sm:mt-0"
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
            >
              {blok.headline}
            </motion.h1>
          </div>
        </div>
      </div>

      {/* Right Section - Image (extends to edge, desktop only - flex-row) */}
      {blok.image?.filename && (
        <div className="absolute right-0 top-0 hidden h-full w-[50%] md:block z-10">
          <div className="relative h-full w-full torn-edge torn-edge-right-reverse">
            <Image
              src={blok.image.filename}
              alt={blok.image.alt || blok.headline}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 0vw, 50vw"
            />
          </div>
        </div>
      )}
    </section>
  );
}

