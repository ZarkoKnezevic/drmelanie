'use client';

import { useRef, useEffect, useState } from 'react';
import { storyblokEditable } from '@storyblok/react/rsc';
import Image from 'next/image';
import * as motion from 'motion/react-client';
import { useScroll, useTransform } from 'motion/react';
import { prepareImageProps } from '@/lib/adapters/prepareImageProps';
import { cn, getBackgroundClass } from '@/utils';
import type { StoryblokBlok } from '@/types';

interface ImageGalleryProps {
  blok: StoryblokBlok & {
    images?: Array<{
      filename?: string;
      alt?: string;
      asset?: {
        filename?: string;
        alt?: string;
      };
    }>;
    background?: string;
  };
}

export default function ImageGallery({ blok }: ImageGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const images = blok.images || [];
  const backgroundClass = getBackgroundClass(blok.background);

  // Check if screen is md or above (600px)
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 600); // md breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Dummy data - 7 images from public/gallery
  const dummyImages = Array.from({ length: 7 }, (_, i) => ({
    filename: `/gallery/img${i + 1}.jpg`,
    alt: `Gallery image ${i + 1}`,
  }));

  const displayImages = images.length > 0 ? images : dummyImages;

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

  if (displayImages.length === 0) {
    return null;
  }

  // Mobile positioning data
  const mobilePositions = [
    { width: '45.8666666667vw', height: '31.4666666667vw', left: '50.6666666667vw', top: '42.9333333333vw' }, // top left image
    { width: '58.4vw', height: '39.2vw', left: '50.6666666667vw', top: '0' }, // top image
    { width: '33.8666666667vw', height: '51.4666666667vw', left: '12.2666666667vw', top: '22.9333333333vw' },  // top left image
    { width: '46.4vw', height: '31.4666666667vw', left: '100.5333333333vw', top: '42.9333333333vw' }, // top right image
    { width: '33.6vw', height: '50.9333333333vw', left: '62.6666666667vw', top: '77.8666666667vw' }, // bottom left image
    { width: '58.6666666667vw', height: '39.4666666667vw', left: '0', top: '77.8666666667vw' }, // bottom right image
    { width: '34.1333333333vw', height: '22.6666666667vw', left: '100.5333333333vw', top: '77.8666666667vw' },// bottom left image
  ];

  return (
    <>
      {/* MOBILE: Static Gallery (below md) */}
      {!isDesktop && (
        <section
          {...storyblokEditable(blok)}
          className={cn(
            'image-gallery relative md:hidden',
            backgroundClass || 'bg-background'
          )}
        >
          <div className="spacing overflow-x-hidden">
            <div className="relative w-full -ml-[25.6vw]" style={{ minHeight: '128.5333333334vw' }}>
              {displayImages.slice(0, 7).map((image, index) => {
                const imageProps = prepareImageProps(image);
                if (!imageProps.src) return null;

                const position = mobilePositions[index];

                return (
                  <div
                    key={index}
                    className={cn(
                      'absolute overflow-hidden',
                      `image-index-${index}`
                    )}
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
        {...storyblokEditable(blok)}
        ref={containerRef}
        className={cn(
          'image-gallery relative hidden md:block h-[300vh]',
          backgroundClass || 'bg-background'
        )}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {displayImages.slice(0, 7).map((image, index) => {
            const imageProps = prepareImageProps(image);
            if (!imageProps.src) return null;

            const scale = scales[index] || scale4;

            return (
              <motion.div
                key={index}
                style={{ scale }}
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
              >
                <div
                  className={cn(
                    'relative',
                    `image-index-${index}`,
                    // Desktop: original positioning
                    index === 0 && 'w-[25vw] h-[25vh]',
                    index === 1 && 'top-[-30vh] left-[5vw] w-[35vw] h-[30vh]',
                    index === 2 && 'top-[-10vh] left-[-25vw] w-[20vw] h-[45vh]',
                    index === 3 && 'left-[27.5vw] w-[25vw] h-[25vh]',
                    index === 4 && 'top-[27.5vh] left-[5vw] w-[20vw] h-[25vh]',
                    index === 5 && 'top-[27.5vh] left-[-22.5vw] w-[30vw] h-[25vh]',
                    index === 6 && 'top-[22.5vh] left-[25vw] w-[15vw] h-[15vh]'
                  )}
                >
                  <Image
                    src={imageProps.src}
                    alt={imageProps.alt}
                    fill
                    className="object-cover"
                    sizes="25vw"
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
