'use client';

import { useRef, useEffect, useState } from 'react';
import { storyblokEditable } from '@storyblok/react/rsc';
import Image from 'next/image';
import * as motion from 'motion/react-client';
import { useScroll, useTransform } from 'motion/react';
import { prepareImageProps } from '@/lib/adapters/prepareImageProps';
import { cn, getBackgroundClass } from '@/utils';
import type { StoryblokBlok } from '@/types';

interface StoryblokImageAsset {
  filename?: string;
  alt?: string;
  asset?: {
    filename?: string;
    alt?: string;
  };
}

interface ImageGalleryProps {
  blok: StoryblokBlok & {
    center_image: StoryblokImageAsset;
    top_image: StoryblokImageAsset;
    top_left_image: StoryblokImageAsset;
    top_right_image: StoryblokImageAsset;
    bottom_image: StoryblokImageAsset;
    bottom_left_image: StoryblokImageAsset;
    bottom_right_image: StoryblokImageAsset;
    background_color?: string | { slug?: string };
  };
}

export default function ImageGallery({ blok }: ImageGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const backgroundClass = getBackgroundClass(blok.background_color);

  // Check if screen is md or above (600px)
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 600); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Map Storyblok fields to display order
  // Mobile order: center, top, top_left, top_right, bottom_left, bottom, bottom_right
  const displayImages = [
    blok.center_image, // index 0
    blok.top_image, // index 1
    blok.top_left_image, // index 2
    blok.top_right_image, // index 3
    blok.bottom_left_image, // index 4
    blok.bottom_image, // index 5
    blok.bottom_right_image, // index 6
  ];

  // Always call hooks - but only use scroll when desktop
  const { scrollYProgress } = useScroll({
    target: isDesktop ? containerRef : undefined,
    offset: ['start start', 'end end'],
  });

  // Create different scale transforms for desktop animation
  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  // Scale assignments for each image
  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  // Mobile positioning data
  const mobilePositions = [
    {
      width: '45.8666666667vw',
      height: '31.4666666667vw',
      left: '50.6666666667vw',
      top: '42.9333333333vw',
    }, // center_image
    { width: '58.4vw', height: '39.2vw', left: '50.6666666667vw', top: '0' }, // top_image
    {
      width: '33.8666666667vw',
      height: '51.4666666667vw',
      left: '12.2666666667vw',
      top: '22.9333333333vw',
    }, // top_left_image
    {
      width: '46.4vw',
      height: '31.4666666667vw',
      left: '100.5333333333vw',
      top: '42.9333333333vw',
    }, // top_right_image
    { width: '33.6vw', height: '50.9333333333vw', left: '62.6666666667vw', top: '77.8666666667vw' }, // bottom_left_image
    { width: '58.6666666667vw', height: '39.4666666667vw', left: '0', top: '77.8666666667vw' }, // bottom_image
    {
      width: '34.1333333333vw',
      height: '22.6666666667vw',
      left: '100.5333333333vw',
      top: '77.8666666667vw',
    }, // bottom_right_image
  ];

  return (
    <>
      {/* MOBILE: Static Gallery (below md) */}
      {!isDesktop && (
        <section
          id="bildergalerie-ansehen"
          {...storyblokEditable(blok)}
          className={cn('image-gallery relative md:hidden', backgroundClass || 'bg-background')}
        >
          <div className="spacing overflow-x-hidden">
            <div className="relative -ml-[25.6vw] w-full" style={{ minHeight: '128.5333333334vw' }}>
              {displayImages.map((image, index) => {
                const imageProps = prepareImageProps(image);
                if (!imageProps.src) return null;

                const position = mobilePositions[index];

                return (
                  <div
                    key={index}
                    className={cn('absolute overflow-hidden', `image-index-${index}`)}
                    style={{
                      width: position.width,
                      height: position.height,
                      left: position.left,
                      top: position.top,
                    }}
                  >
                    <Image
                      src={imageProps.src}
                      alt={imageProps.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 600px) 60vw, 25vw"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* DESKTOP: Animated Parallax Gallery (md and above) */}
      <section
        id="bildergalerie-ansehen"
        {...storyblokEditable(blok)}
        ref={containerRef}
        className={cn(
          'image-gallery relative hidden h-[300vh] md:block',
          backgroundClass || 'bg-background'
        )}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {displayImages.map((image, index) => {
            const imageProps = prepareImageProps(image);
            if (!imageProps.src) return null;

            const scale = scales[index] || scale4;

            return (
              <motion.div
                key={index}
                style={{ scale }}
                className="absolute left-0 top-0 flex h-full w-full items-center justify-center"
              >
                <div
                  className={cn(
                    'relative',
                    `image-index-${index}`,
                    // Desktop: original positioning
                    index === 0 && 'h-[25vh] w-[25vw]',
                    index === 1 && 'left-[5vw] top-[-30vh] h-[30vh] w-[35vw]',
                    index === 2 && 'left-[-25vw] top-[-10vh] h-[45vh] w-[20vw]',
                    index === 3 && 'left-[27.5vw] h-[25vh] w-[25vw]',
                    index === 4 && 'left-[5vw] top-[27.5vh] h-[25vh] w-[20vw]',
                    index === 5 && 'left-[-22.5vw] top-[27.5vh] h-[25vh] w-[30vw]',
                    index === 6 && 'left-[25vw] top-[22.5vh] h-[15vh] w-[15vw]'
                  )}
                >
                  <Image
                    src={imageProps.src}
                    alt={imageProps.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 50vw, 25vw"
                    quality={100}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </>
  );
}
