'use client';

import { useEffect, useRef, useState } from 'react';
import { storyblokEditable, StoryblokServerComponent } from '@storyblok/react/rsc';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { prepareImageProps } from '@/lib/adapters/prepareImageProps';
import { cn, getBackgroundClass } from '@/utils';
import type { StoryblokBlok } from '@/types';
import Feature from './Feature';

interface StoryblokImageAsset {
  filename?: string;
  alt?: string;
  asset?: {
    filename?: string;
    alt?: string;
  };
}

interface GridProps {
  blok: StoryblokBlok & {
    title?: string;
    items?: StoryblokBlok[];
    columns?: StoryblokBlok[];
    columns_content?: StoryblokBlok[];
    content?: StoryblokBlok[];
    background?: string;
  };
}

export default function Grid({ blok }: GridProps) {
  const stickyRef = useRef<HTMLElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const backgroundClass = getBackgroundClass(blok.background);

  // Get items from various possible field names
  const items =
    blok.items ||
    (Array.isArray(blok.columns) ? blok.columns : []) ||
    blok.columns_content ||
    blok.content ||
    [];

  // Set mounted state to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if screen is desktop (1000px or above)
  useEffect(() => {
    if (!isMounted) return;

    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1000);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [isMounted]);

  // Initialize Lenis smooth scroll (only once, client-side only)
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;
    if (lenisRef.current) return; // Prevent multiple initializations

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Animation frame loop
    function raf(time: number) {
      lenis.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, [isMounted]);

  // Initialize GSAP ScrollTrigger animations
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;

    if (!isDesktop || items.length === 0) {
      // Cleanup if conditions not met
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
      return;
    }

    // Wait for DOM elements to be ready
    const initAnimation = () => {
      if (!stickyRef.current || !cardContainerRef.current) return;

      // Clean up existing ScrollTrigger
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }

      gsap.registerPlugin(ScrollTrigger);

      // Update ScrollTrigger when Lenis scrolls
      if (lenisRef.current) {
        lenisRef.current.on('scroll', ScrollTrigger.update);
      }

      let isGapAnimationCompleted = false;
      let isFlipAnimationCompleted = false;

      const cardElements = stickyRef.current.querySelectorAll('.feature-card');
      const headerElement = stickyHeaderRef.current;

      const scrollTrigger = ScrollTrigger.create({
        trigger: stickyRef.current,
        start: 'top top',
        end: `+=${window.innerHeight * 0.8}px`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          const progress = self.progress;

          // Header animation (fade in and slide up) - only if header exists
          if (headerElement) {
            if (progress >= 0.1 && progress <= 0.25) {
              const headerProgress = gsap.utils.mapRange(0.1, 0.25, 0, 1, progress);
              const yValue = gsap.utils.mapRange(0, 1, 40, 0, headerProgress);
              const opacityValue = gsap.utils.mapRange(0, 1, 0, 1, headerProgress);

              gsap.set(headerElement, {
                y: yValue,
                opacity: opacityValue,
              });
            } else if (progress < 0.1) {
              gsap.set(headerElement, {
                y: 40,
                opacity: 0,
              });
            } else if (progress > 0.25) {
              gsap.set(headerElement, {
                y: 0,
                opacity: 1,
              });
            }
          }

          // Card container width animation
          if (progress <= 0.25) {
            const widthPercentage = gsap.utils.mapRange(0, 0.25, 66.67, 50, progress);
            gsap.set(cardContainerRef.current, { width: `${widthPercentage}%` });
          } else {
            gsap.set(cardContainerRef.current, { width: '50%' });
          }

          // Gap animation (add spacing between cards)
          if (progress >= 0.35 && !isGapAnimationCompleted) {
            gsap.to(cardContainerRef.current, {
              gap: '20px',
              duration: 0.5,
              ease: 'power3.out',
            });

            isGapAnimationCompleted = true;
          } else if (progress < 0.35 && isGapAnimationCompleted) {
            gsap.to(cardContainerRef.current, {
              gap: '0px',
              duration: 0.5,
              ease: 'power3.out',
            });

            isGapAnimationCompleted = false;
          }

          // Card flip animation
          if (progress >= 0.7 && !isFlipAnimationCompleted) {
            gsap.to(cardElements, {
              rotationY: 180,
              duration: 0.75,
              ease: 'power3.inOut',
              stagger: 0.1,
            });

            if (cardElements.length >= 3) {
              gsap.to([cardElements[0], cardElements[2]], {
                y: 30,
                rotationZ: (i) => [-15, 15][i],
                duration: 0.75,
                ease: 'power3.inOut',
              });
            }

            isFlipAnimationCompleted = true;
          } else if (progress < 0.7 && isFlipAnimationCompleted) {
            gsap.to(cardElements, {
              rotationY: 0,
              duration: 0.75,
              ease: 'power3.inOut',
              stagger: -0.1,
            });

            if (cardElements.length >= 3) {
              gsap.to([cardElements[0], cardElements[2]], {
                y: 0,
                rotationZ: 0,
                duration: 0.75,
                ease: 'power3.inOut',
              });
            }

            isFlipAnimationCompleted = false;
          }
        },
      });

      scrollTriggerRef.current = scrollTrigger;
    };

    // Use requestAnimationFrame to ensure DOM is ready
    const rafId = requestAnimationFrame(() => {
      initAnimation();
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
  }, [isMounted, isDesktop, items.length]);

  // Reset animations on resize
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Kill existing scroll triggers
        if (scrollTriggerRef.current) {
          scrollTriggerRef.current.kill();
          scrollTriggerRef.current = null;
        }
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.vars.trigger === stickyRef.current) {
            trigger.kill();
          }
        });
        // Force re-render to reinitialize
        setIsDesktop(window.innerWidth >= 1000);
      }, 250);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [isMounted]);

  if (!items || items.length === 0) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <section {...storyblokEditable(blok)} className={cn('grid-section', backgroundClass)}>
          <div className="container mx-auto px-6 py-12">
            <div className="text-center text-gray-500">
              ⚠️ Grid component has no items to display. Add items in Storyblok.
            </div>
          </div>
        </section>
      );
    }
    return null;
  }

  return (
    <>
      {/* Sticky Animated Cards Section (Desktop) - Only render when mounted */}
      {isMounted ? (
        <section
          ref={stickyRef}
          {...storyblokEditable(blok)}
          className={cn('sticky-section relative hidden lg:block', backgroundClass)}
          style={{ minHeight: '80vh' }}
        >
          {/* Sticky Header */}
          {blok.title && (
            <div
              ref={stickyHeaderRef}
              className="sticky-header absolute left-1/2 top-24 z-10 -translate-x-1/2 transform opacity-0"
            >
              <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">{blok.title}</h1>
            </div>
          )}

          {/* Card Container */}
          <div
            ref={cardContainerRef}
            className="card-container absolute left-1/2 top-0 flex h-screen w-2/3 -translate-x-1/2 transform items-center justify-center gap-0"
            style={{ perspective: '500px' }}
          >
            {items.slice(0, 3).map((item: StoryblokBlok, index: number) => {
              const imageAsset = (item as any).image;
              const logoAsset = (item as any).logo;
              const imageProps = imageAsset ? prepareImageProps(imageAsset) : null;
              const logoProps = logoAsset ? prepareImageProps(logoAsset) : null;
              const name = (item as any).name || '';
              const description = (item as any).description || '';

              // Card backgrounds for back side
              const cardBackgrounds = ['#ffffff', '#7bcaca', '#d0b4c5'];
              const cardBackground = cardBackgrounds[index] || '#ffffff';

              return (
                <div
                  key={item._uid || index}
                  className="feature-card relative flex-1"
                  style={{
                    transformStyle: 'preserve-3d',
                    aspectRatio: '1',
                    width: '100%',
                  }}
                >
                  {/* Card Front */}
                  <div
                    className="card-front absolute h-full w-full overflow-hidden"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      borderRadius: '0',
                    }}
                  >
                    {imageProps?.src ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={imageProps.src}
                          alt={imageProps.alt || name}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1000px) 33vw, 100vw"
                          quality={100}
                        />
                      </div>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-200">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Card Back */}
                  <div
                    className="card-back absolute flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden p-8 text-center"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      backgroundColor: cardBackground,
                      borderRadius: '24px',
                      border: '4px solid',
                      borderColor:
                        index === 0
                          ? 'rgba(255, 255, 255, 0.9)'
                          : index === 1
                            ? 'rgba(123, 202, 202, 0.6)'
                            : 'rgba(208, 180, 197, 0.6)',
                      boxShadow:
                        index === 0
                          ? '0 8px 24px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                          : index === 1
                            ? '0 8px 24px rgba(123, 202, 202, 0.3), 0 4px 12px rgba(123, 202, 202, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
                            : '0 8px 24px rgba(208, 180, 197, 0.3), 0 4px 12px rgba(208, 180, 197, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                      transition:
                        'border-radius 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                    }}
                  >
                    <span
                      className="text-2xl font-bold"
                      style={{
                        color: index === 0 ? '#9ca3af' : 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      ({String(index + 1).padStart(2, '0')})
                    </span>
                    {logoProps?.src && (
                      <div className="relative h-16 w-16">
                        <Image
                          src={logoProps.src}
                          alt={logoProps.alt || name}
                          fill
                          className="object-contain"
                          sizes="64px"
                        />
                      </div>
                    )}
                    {name && (
                      <p
                        className="text-2xl font-semibold"
                        style={{
                          color: index === 0 ? '#111827' : '#ffffff',
                        }}
                      >
                        {name}
                      </p>
                    )}
                    {description && (
                      <p
                        style={{
                          color: index === 0 ? '#4b5563' : 'rgba(255, 255, 255, 0.9)',
                        }}
                      >
                        {description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        // SSR placeholder to prevent layout shift
        <section
          {...storyblokEditable(blok)}
          className={cn('sticky-section relative hidden min-h-[80vh] lg:block', backgroundClass)}
          aria-hidden="true"
        >
          <div className="card-container absolute left-1/2 top-0 flex h-screen w-2/3 -translate-x-1/2 transform items-center justify-center gap-0">
            {items.slice(0, 3).map((item: StoryblokBlok, index: number) => (
              <div
                key={item._uid || index}
                className="relative flex-1 bg-gray-200"
                style={{
                  aspectRatio: '1',
                  width: '100%',
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Mobile/Tablet Static Grid */}
      <section
        {...storyblokEditable(blok)}
        className={cn('grid-section-mobile block lg:hidden', backgroundClass)}
      >
        {blok.title && (
          <div className="container mx-auto px-6 pt-12 text-center">
            <h2 className="mb-12 text-3xl font-bold md:text-4xl">{blok.title}</h2>
          </div>
        )}
        <div className="container mx-auto px-6 pb-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item: StoryblokBlok) => {
              // Render Feature components directly since Grid is a client component
              if (item.component === 'feature' || item.component === 'Feature') {
                return <Feature key={item._uid} blok={item} />;
              }
              // Fallback to StoryblokServerComponent for other component types
              return <StoryblokServerComponent key={item._uid} blok={item} />;
            })}
          </div>
        </div>
      </section>

      {/* Nested Components After Animation (Desktop) */}
      {isMounted && items.length > 3 && (
        <section
          {...storyblokEditable(blok)}
          className={cn('nested-components-section hidden py-24 lg:block', backgroundClass)}
        >
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.slice(3).map((item: StoryblokBlok) => {
                if (item.component === 'feature' || item.component === 'Feature') {
                  return <Feature key={item._uid} blok={item} />;
                }
                return <StoryblokServerComponent key={item._uid} blok={item} />;
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
