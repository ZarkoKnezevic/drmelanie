import { storyblokEditable } from '@storyblok/react/rsc';
import Image from 'next/image';
import * as motion from 'motion/react-client';
import { BannerAnimated } from './banner-animated';
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
        'hero relative flex flex-col overflow-hidden md:min-h-[60vh] md:flex-row lg:min-h-[80vh]',
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
            className="object-cover object-left md:object-center"
            priority
            sizes="100vw"
          />
          {/* Mobile Logo - Top Left on Image */}
          {blok.logo?.filename && (
            <BannerAnimated delay={0} animationType="scale" immediate>
              <div className="absolute left-4 top-10 z-20">
                <div className="relative h-40 w-40">
                  {/* Background blob image */}
                  <div
                    className="blob absolute inset-0"
                    style={{
                      backgroundImage: 'url(/blob.png)',
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right top',
                    }}
                  />
                  {/* Logo */}
                  <div className="absolute inset-0">
                    <Image
                      src={blok.logo.filename}
                      alt={blok.logo.alt || 'Logo'}
                      fill
                      className="relative z-10 object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
            </BannerAnimated>
          )}
        </div>
      )}

      {/* Left Section - Logo and Headline (with container) */}
      <div
        className={cn(
          'relative z-10 flex flex-1 flex-col items-center justify-center pb-12 pt-8 md:pb-0 md:pt-0',
          'torn-edge torn-edge-top md:torn-edge-top-none',
          backgroundClass || 'bg-background'
        )}
      >
        <div className="container md:py-12 lg:py-20">
          <div className="w-full space-y-0 md:w-1/2 md:space-y-16 lg:w-[40%] lg:space-y-20">
            {/* Logo - Desktop only, animated */}
            {blok.logo?.filename && (
              <BannerAnimated delay={100} animationType="fade-up" immediate>
                <div className="relative hidden h-24 w-full md:block md:h-40 lg:h-48 xxl:h-64">
                  <Image
                    src={blok.logo.filename}
                    alt={blok.logo.alt || 'Logo'}
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </div>
              </BannerAnimated>
            )}

            {/* Headline with slide-down animation */}
            <BannerAnimated delay={250} animationType="fade-up" immediate>
              <h1 className="h1 sm:mt-0">{blok.headline}</h1>
            </BannerAnimated>
          </div>
        </div>
      </div>

      {/* Right Section - Image (extends to edge, desktop only - flex-row) */}
      {blok.image?.filename && (
        <div className="absolute right-0 top-0 z-10 hidden h-full w-[50%] md:block">
          <div className="torn-edge torn-edge-right-reverse relative h-full w-full">
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
