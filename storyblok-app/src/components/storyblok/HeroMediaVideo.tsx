'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import Image from 'next/image';

// Custom event to signal animation is ready
const ANIMATION_READY_EVENT = 'hero-animation-ready';

interface HeroMediaVideoProps {
  videoSrc?: string; // Video file path (optional, can use images instead)
  frameCount?: number; // Not used anymore, but keeping for backwards compatibility
  // Image-based approach (RECOMMENDED - much smoother!)
  backgroundImage?: string; // Background image path
  babyImages?: string[]; // Array of baby images (e.g., ['/babies/baby1.png', '/babies/baby2.png', '/babies/baby3.png'])
  // Fine-tuning parameters
  scrubSmoothness?: number; // Lower = smoother (0.1-1.0, default: 0.3)
  lenisDuration?: number; // Scroll duration (0.8-2.0, default: 1.2)
  wheelMultiplier?: number; // Scroll sensitivity (0.5-1.5, default: 1.0)
}

export function HeroMediaVideo({
  videoSrc = '/videos/babies.mp4', // Default video path (optional if using images)
  backgroundImage = '/babies/background.png', // Background image
  babyImages = ['/babies/embrio.png', '/babies/24_weeks.png', '/babies/36_weeks.png'], // Baby images sequence
  scrubSmoothness = 0.3, // Fine-tune: Lower = smoother (0.1-1.0)
  lenisDuration = 1.2, // Fine-tune: Scroll duration (0.8-2.0)
  wheelMultiplier = 1.0, // Fine-tune: Scroll sensitivity (0.5-1.5)
}: HeroMediaVideoProps) {
  // Use images if provided, otherwise fall back to video
  const useImages = babyImages && babyImages.length > 0;

  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const babyImageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lenisRef = useRef<Lenis | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);
  const [animationReady, setAnimationReady] = useState(false);

  useEffect(() => {
    // Detect mobile and tablet (treat tablets same as mobile)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1025); // lg breakpoint (1025px) - includes tablets
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize Lenis smooth scroll (only on desktop, not mobile/tablet)
  useEffect(() => {
    if (typeof window === 'undefined' || isMobile) return;
    if (lenisRef.current) return;

    const initLenis = () => {
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: lenisDuration, // Fine-tunable scroll duration
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easing
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: wheelMultiplier, // Fine-tunable scroll sensitivity
        touchMultiplier: 2.0, // Increased for better touch response
        infinite: false,
        syncTouch: true, // Enable for smoother touch
        lerp: 0.1, // Lower = smoother interpolation (0.05-0.2)
      });

      lenisRef.current = lenis;
      // Store Lenis instance globally for PageTransition to access
      if (typeof window !== 'undefined') {
        (window as Window & { __lenis__?: Lenis }).__lenis__ = lenis;
      }

      function raf(time: number) {
        lenis.raf(time);
        ScrollTrigger.update();
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
      // Fine-tuned lag smoothing for smoother performance
      gsap.ticker.lagSmoothing(500, 33); // Increased threshold for smoother feel
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(initLenis, { timeout: 100 });
    } else {
      setTimeout(initLenis, 0);
    }

    return () => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
        lenisRef.current.destroy();
        lenisRef.current = null;
        if (typeof window !== 'undefined') {
          delete (window as Window & { __lenis__?: Lenis }).__lenis__;
        }
      }
    };
  }, [isMobile, lenisDuration, wheelMultiplier]);

  // Handle image loading (for image-based approach)
  useEffect(() => {
    if (!useImages || isMobile || typeof window === 'undefined') return;

    const loadImages = async () => {
      const promises = babyImages.map((src) => {
        return new Promise<void>((resolve, reject) => {
          const img = new window.Image();
          img.src = src;
          img.onload = () => resolve();
          img.onerror = () => {
            console.error(`[HeroMediaVideo] Failed to load baby image: ${src}`);
            reject();
          };
        });
      });

      // Also load background image if provided
      if (backgroundImage) {
        const bgPromise = new Promise<void>((resolve, reject) => {
          const img = new window.Image();
          img.src = backgroundImage;
          img.onload = () => resolve();
          img.onerror = () => {
            console.error(`[HeroMediaVideo] Failed to load background image: ${backgroundImage}`);
            reject();
          };
        });
        promises.push(bgPromise);
      }

      try {
        await Promise.all(promises);
        setImagesReady(true);
        setAnimationReady(true);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent(ANIMATION_READY_EVENT));
        }
      } catch (error) {
        console.error('[HeroMediaVideo] Error loading one or more images:', error);
        // Still set ready to prevent infinite loading
        setImagesReady(true);
        setAnimationReady(true);
      }
    };

    loadImages();
  }, [useImages, isMobile, babyImages, backgroundImage]);

  // Handle video ready state (for video-based approach)
  useEffect(() => {
    if (useImages || !videoRef.current || isMobile || typeof window === 'undefined') return;

    const video = videoRef.current;

    const handleLoadedMetadata = () => {
      console.log('[HeroMediaVideo] Video metadata loaded, duration:', video.duration);
      video.currentTime = 0;
    };

    const handleCanPlay = () => {
      console.log('[HeroMediaVideo] Video can play');
      setVideoReady(true);
      setAnimationReady(true);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(ANIMATION_READY_EVENT));
      }
    };

    const handleError = (e: Event) => {
      console.error('[HeroMediaVideo] Video error:', e);
      console.error('[HeroMediaVideo] Video src:', videoSrc);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    // Try to load the video
    video.load();

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [isMobile, videoSrc, useImages]);

  // Setup ScrollTrigger for IMAGE-BASED animation (much smoother!)
  useEffect(() => {
    if (!useImages || !heroRef.current || !imagesReady || isMobile) return;

    const nav = document.querySelector('header');
    const heroImg = heroImgRef.current;
    const babyImages = babyImageRefs.current.filter(Boolean);

    // Longer scroll distance for smoother, more dramatic animation
    const viewportHeight = window.innerHeight;
    const pinDuration = viewportHeight * 4; // 4x viewport for longer, smoother transitions

    // Kill existing trigger if any
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
    }

    const trigger = ScrollTrigger.create({
      trigger: heroRef.current,
      start: 'top top',
      end: `+=${pinDuration}px`,
      pin: true,
      pinSpacing: true,
      scrub: 0.05, // Ultra-smooth for images (lower = smoother)
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;

        // Nav fade out (0-10%)
        if (nav) {
          if (progress <= 0.1) {
            const navProgress = progress / 0.1;
            const opacity = 1 - navProgress;
            gsap.set(nav, { opacity });
          } else {
            gsap.set(nav, { opacity: 0 });
          }
        }

        // Baby images sequence (0-70%) - each baby appears one after another with smooth overlap
        const numBabies = babyImages.length;
        const babyProgressRange = 0.7; // Use 70% of scroll for baby images sequence
        const progressPerBaby = babyProgressRange / numBabies;
        const transitionOverlap = 0.3; // 30% overlap for longer, smoother fade transitions
        const finalLayoutStart = 0.7; // Start final layout at 70% progress

        babyImages.forEach((babyRef, index) => {
          if (!babyRef) return;

          // Calculate ranges with longer overlap for smoother fade in/out
          const babyStart = index * progressPerBaby;
          const babyEnd = (index + 1) * progressPerBaby;
          const fadeInDuration = progressPerBaby * transitionOverlap; // Longer fade in duration
          const fadeOutDuration = progressPerBaby * transitionOverlap; // Longer fade out duration
          const visibleStart = babyStart + fadeInDuration;
          const visibleEnd = babyEnd - fadeOutDuration;

          // Final layout: baby1 left, baby3 center, baby2 right
          if (progress >= finalLayoutStart) {
            const finalLayoutProgress = (progress - finalLayoutStart) / (1 - finalLayoutStart);
            const easedFinalProgress =
              finalLayoutProgress * finalLayoutProgress * (3 - 2 * finalLayoutProgress);

            if (index === 0) {
              // First baby (embrio) - move to left, smaller size
              const leftOffset = -window.innerWidth * 0.3 * easedFinalProgress;
              gsap.set(babyRef, {
                opacity: 1, // Always visible
                scale: 0.7, // Smaller so all fit
                x: leftOffset,
                y: 0,
                transform: `translateX(${leftOffset}px) scale(0.7)`,
              });
            } else if (index === 2) {
              // Third baby (36 weeks) - stay in center, smaller size
              gsap.set(babyRef, {
                opacity: 1, // Always visible
                scale: 0.8, // Smaller so all fit (was 1.0)
                x: 0,
                y: 0,
                transform: 'translateX(0px) scale(0.8)',
              });
            } else if (index === 1) {
              // Second baby (24 weeks) - move to right, smaller size
              const rightOffset = window.innerWidth * 0.3 * easedFinalProgress;
              gsap.set(babyRef, {
                opacity: 1, // Always visible
                scale: 0.7, // Smaller so all fit
                x: rightOffset,
                y: 0,
                transform: `translateX(${rightOffset}px) scale(0.7)`,
              });
            }
          } else if (progress < babyStart) {
            // Before this baby - completely hidden (EXCEPT first baby which starts visible)
            if (index === 0) {
              // First baby (embrio) - visible from the start
              gsap.set(babyRef, {
                opacity: 1,
                scale: 1,
                y: 0,
                x: 0,
              });
            } else {
              // Other babies - hidden
              gsap.set(babyRef, {
                opacity: 0,
                scale: 0.85,
                y: 60,
                x: 0,
              });
            }
          } else if (progress >= babyStart && progress < visibleStart) {
            // Fade in phase - longer, smoother ease-in
            const fadeInProgress = (progress - babyStart) / fadeInDuration;
            // Very smooth easing function (smoothstep) for gentle fade in
            const easedProgress = fadeInProgress * fadeInProgress * (3 - 2 * fadeInProgress);

            gsap.set(babyRef, {
              opacity: easedProgress,
              scale: 0.9 + easedProgress * 0.1, // Scale from 0.9 to 1.0 (gentler)
              y: 40 - easedProgress * 40, // Move up from 40px to 0 (gentler)
              x: 0,
            });
          } else if (progress >= visibleStart && progress <= visibleEnd) {
            // Fully visible phase - hold steady for longer viewing
            gsap.set(babyRef, {
              opacity: 1,
              scale: 1,
              y: 0,
              x: 0,
            });
          } else if (progress > visibleEnd && progress < finalLayoutStart) {
            // Transition phase - first two babies fade out, only last baby stays visible
            if (index === 2) {
              // Third baby (36 weeks) - stays visible, scale down smoothly
              const transitionProgress = (progress - visibleEnd) / (finalLayoutStart - visibleEnd);
              const easedTransition =
                transitionProgress * transitionProgress * (3 - 2 * transitionProgress);
              gsap.set(babyRef, {
                opacity: 1, // Always visible - never fade out
                scale: 0.8 + (1 - easedTransition) * 0.2, // Scale down from 1.0 to 0.8
                x: 0,
                y: 0,
              });
            } else {
              // First two babies (embrio and 24 weeks) - fade out completely
              const fadeOutProgress = (progress - visibleEnd) / (finalLayoutStart - visibleEnd);
              const easedOutProgress =
                fadeOutProgress * fadeOutProgress * (3 - 2 * fadeOutProgress);
              gsap.set(babyRef, {
                opacity: 1 - easedOutProgress, // Fade out completely
                scale: 1 - easedOutProgress * 0.15, // Scale down slightly
                y: -(easedOutProgress * 20), // Move up slightly
                x: 0,
              });
            }
          }
        });

        // Hero image (heading) animation (70-100%) - appears at the end
        if (heroImg) {
          if (progress < 0.7) {
            gsap.set(heroImg, {
              transform: 'translateZ(1000px)',
              opacity: 0,
            });
          } else if (progress >= 0.7 && progress <= 1) {
            const imgProgress = (progress - 0.7) / 0.3;
            const translateZ = 1000 - imgProgress * 1000;

            let opacity = 0;
            if (progress <= 0.85) {
              const opacityProgress = (progress - 0.7) / 0.15;
              opacity = opacityProgress;
            } else {
              opacity = 1;
            }

            gsap.set(heroImg, {
              transform: `translateZ(${translateZ}px)`,
              opacity,
            });
          }
        }
      },
      onEnter: () => {
        // Reset all babies to initial state
        babyImages.forEach((babyRef) => {
          if (babyRef) {
            gsap.set(babyRef, { opacity: 0, scale: 0.8, y: 50 });
          }
        });
      },
    });

    scrollTriggerRef.current = trigger;
    ScrollTrigger.refresh();

    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
  }, [imagesReady, isMobile, useImages, babyImages.length]);

  // Setup ScrollTrigger for VIDEO playback (fallback)
  useEffect(() => {
    if (useImages || !heroRef.current || !videoRef.current || !videoReady || isMobile) return;

    const video = videoRef.current;
    const nav = document.querySelector('header');
    const heroImg = heroImgRef.current;

    // Check if video has valid duration
    if (!video.duration || isNaN(video.duration)) {
      console.warn('[HeroMediaVideo] Video duration not available, waiting...');
      const checkDuration = setInterval(() => {
        if (video.duration && !isNaN(video.duration)) {
          clearInterval(checkDuration);
          console.log('[HeroMediaVideo] Video duration available:', video.duration);
          setVideoReady(true);
        }
      }, 100);
      return () => clearInterval(checkDuration);
    }

    console.log('[HeroMediaVideo] Setting up ScrollTrigger, video duration:', video.duration);

    // Calculate optimal pin duration - shorter for smoother feel
    const vidDuration = video.duration || 10;
    const viewportHeight = window.innerHeight;
    const optimalScrollDistance = vidDuration * 50;
    const pinDuration = Math.max(optimalScrollDistance, viewportHeight * 1.5);

    // Kill existing trigger if any
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
    }

    // Add smooth interpolation for even smoother video scrubbing
    let targetVideoTime = 0;
    let currentVideoTime = 0;
    const vidDur = video.duration || 10;
    const lerpFactor = vidDur <= 10 ? 0.05 : 0.15;

    // Safe video time setter with comprehensive validation
    const setVideoTime = (time: number) => {
      if (!video || !video.duration || !isFinite(video.duration) || video.duration <= 0) {
        return;
      }

      if (!isFinite(time) || isNaN(time) || time < 0 || time > video.duration) {
        return;
      }

      try {
        video.currentTime = time;
      } catch {
        // Silently ignore
      }
    };

    // Initialize currentVideoTime when video is ready
    if (video.readyState >= 2 && video.duration && isFinite(video.duration) && video.duration > 0) {
      currentVideoTime = 0;
      targetVideoTime = 0;
      setVideoTime(0);
    }

    const trigger = ScrollTrigger.create({
      trigger: heroRef.current,
      start: 'top top',
      end: `+=${pinDuration}px`,
      pin: true,
      pinSpacing: true,
      scrub: vidDur <= 10 ? 0.1 : scrubSmoothness,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;

        // Nav fade out (0-10%)
        if (nav) {
          if (progress <= 0.1) {
            const navProgress = progress / 0.1;
            const opacity = 1 - navProgress;
            gsap.set(nav, { opacity });
          } else {
            gsap.set(nav, { opacity: 0 });
          }
        }

        // Video playback (0-90%) - ultra-smooth scrubbing with interpolation
        if (
          video.readyState >= 2 &&
          video.duration &&
          isFinite(video.duration) &&
          video.duration > 0
        ) {
          const videoProgress = Math.min(Math.max(progress / 0.9, 0), 1);
          targetVideoTime = videoProgress * video.duration;

          if (
            isFinite(targetVideoTime) &&
            !isNaN(targetVideoTime) &&
            targetVideoTime >= 0 &&
            targetVideoTime <= video.duration
          ) {
            const newTime = currentVideoTime + (targetVideoTime - currentVideoTime) * lerpFactor;

            if (isFinite(newTime) && !isNaN(newTime) && newTime >= 0 && newTime <= video.duration) {
              currentVideoTime = newTime;
              setVideoTime(currentVideoTime);
            } else {
              if (isFinite(targetVideoTime) && !isNaN(targetVideoTime)) {
                currentVideoTime = targetVideoTime;
                setVideoTime(targetVideoTime);
              }
            }
          }
        }

        // Hero image (heading) animation (70-100%) - appears at the end
        if (heroImg) {
          if (progress < 0.7) {
            gsap.set(heroImg, {
              transform: 'translateZ(1000px)',
              opacity: 0,
            });
          } else if (progress >= 0.7 && progress <= 1) {
            const imgProgress = (progress - 0.7) / 0.3;
            const translateZ = 1000 - imgProgress * 1000;

            let opacity = 0;
            if (progress <= 0.85) {
              const opacityProgress = (progress - 0.7) / 0.15;
              opacity = opacityProgress;
            } else {
              opacity = 1;
            }

            gsap.set(heroImg, {
              transform: `translateZ(${translateZ}px)`,
              opacity,
            });
          }
        }
      },
      onEnter: () => {
        if (video && video.duration && isFinite(video.duration)) {
          currentVideoTime = 0;
          targetVideoTime = 0;
          setVideoTime(0);
        }
      },
    });

    scrollTriggerRef.current = trigger;
    ScrollTrigger.refresh();

    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
  }, [videoReady, isMobile, scrubSmoothness, useImages]);

  // Show loading state until animation is ready (desktop only)
  if (!isMobile && !animationReady) {
    return (
      <div
        className="hero relative h-screen w-screen overflow-hidden bg-background"
        style={{ margin: 0, padding: 0, left: 0, right: 0, width: '100vw', height: '100vh' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  // On mobile, show baby image with heading on top
  if (isMobile) {
    return (
      <div
        ref={heroRef}
        className="hero relative h-screen w-screen overflow-hidden bg-background"
        style={{ margin: 0, padding: 0, left: 0, right: 0, width: '100vw', height: '100vh' }}
      >
        {/* Mobile baby image */}
        <div className="absolute inset-0 h-full w-full">
          <Image
            src="/mobile_baby.png"
            alt="Baby"
            fill
            className="object-cover"
            quality={100}
            priority
            unoptimized
            sizes="100vw"
          />
        </div>

        {/* Heading image on top */}
        <div className="spacing container relative z-10 h-full w-full py-12 md:py-16 lg:py-20">
          <Image
            src="/heading.png"
            alt="Ursprung des Lebens"
            width={1920}
            height={1080}
            className="h-full w-full object-contain"
            priority
            unoptimized
          />
        </div>
      </div>
    );
  }

  // IMAGE-BASED APPROACH (RECOMMENDED - much smoother!)
  if (useImages) {
    return (
      <div
        ref={heroRef}
        className="hero relative h-screen w-screen overflow-hidden bg-background"
        style={{
          margin: 0,
          padding: 0,
          left: 0,
          right: 0,
          width: '100vw',
          height: '100vh',
        }}
      >
        {/* Background image */}
        {backgroundImage && (
          <div className="absolute inset-0 h-full w-full">
            <Image
              src={backgroundImage}
              alt="Background"
              fill
              className="object-cover"
              priority
              quality={90}
              sizes="100vw"
            />
          </div>
        )}

        {/* Baby images that appear sequentially */}
        {babyImages.map((babySrc, index) => (
          <div
            key={index}
            ref={(el) => {
              babyImageRefs.current[index] = el;
            }}
            className="z-5 absolute inset-0 flex items-center justify-center"
            style={{
              opacity: index === 0 ? 1 : 0, // First baby (embrio) visible from start
              transform: index === 0 ? 'scale(1) translateY(0px)' : 'scale(0.8) translateY(50px)',
              willChange: 'transform, opacity',
            }}
          >
            <div className="relative h-full w-full max-w-4xl">
              <Image
                src={babySrc}
                alt={`Baby ${index + 1}`}
                fill
                className="object-contain"
                priority={index === 0}
                quality={90}
                sizes="100vw"
              />
            </div>
          </div>
        ))}

        {/* Heading image that appears at the end - on top of babies (z-20) */}
        <div
          ref={heroImgRef}
          className="hero-img absolute inset-0 z-20 flex items-center justify-center opacity-0"
          style={{ transform: 'translateZ(1000px)' }}
        >
          <div className="container relative h-full w-full">
            <Image
              src="/heading.png"
              alt="Ursprung des Lebens"
              width={1920}
              height={1080}
              className="h-full w-full object-contain"
              priority
              unoptimized
            />
          </div>
        </div>
      </div>
    );
  }

  // VIDEO-BASED APPROACH (fallback)
  return (
    <div
      ref={heroRef}
      className="hero relative h-screen w-screen overflow-hidden bg-background"
      style={{ margin: 0, padding: 0, left: 0, right: 0, width: '100vw', height: '100vh' }}
    >
      {/* Video element - full screen */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          margin: 0,
          padding: 0,
          display: 'block',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
        playsInline
        muted
        preload="auto"
        loop={false}
        crossOrigin="anonymous"
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Heading image that appears at the end */}
      <div
        ref={heroImgRef}
        className="hero-img absolute inset-0 z-10 flex items-center justify-center opacity-0"
        style={{ transform: 'translateZ(1000px)' }}
      >
        <div className="container relative h-full w-full">
          <Image
            src="/heading.png"
            alt="Ursprung des Lebens"
            width={1920}
            height={1080}
            className="h-full w-full object-contain"
            priority
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
