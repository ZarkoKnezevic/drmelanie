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
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const images = blok.images || [];
  const backgroundClass = getBackgroundClass(blok.background);

  // Detect touch device
  useEffect(() => {
    const checkTouchDevice = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore
        (navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 0)
      );
    };
    setIsTouchDevice(checkTouchDevice());
  }, []);

  // Dummy data - 7 images from public/gallery
  const dummyImages = Array.from({ length: 7 }, (_, i) => ({
    filename: `/gallery/img${i + 1}.jpg`,
    alt: `Gallery image ${i + 1}`,
  }));

  const displayImages = images.length > 0 ? images : dummyImages;

  // Use scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Create different scale transforms - small zoom on mobile, full zoom on desktop
  const scale4 = useTransform(scrollYProgress, [0, 1], [1, isTouchDevice ? 1.5 : 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, isTouchDevice ? 1.8 : 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, isTouchDevice ? 2 : 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, isTouchDevice ? 2.5 : 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, isTouchDevice ? 3 : 9]);

  // Scale assignments for each image
  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  if (displayImages.length === 0) {
    return null;
  }

  return (
    <section
      {...storyblokEditable(blok)}
      ref={containerRef}
      className={cn(
        'image-gallery relative h-[300vh]',
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
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
