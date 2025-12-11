'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import Image from 'next/image';

// Custom event to signal animation is ready
const ANIMATION_READY_EVENT = 'hero-animation-ready';

interface HeroMediaVideoProps {
  src?: string;
  frameCount?: number;
}

export function HeroMediaVideo({ frameCount = 207 }: HeroMediaVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoFramesRef = useRef({ frame: 0 });
  const imagesLoadingRef = useRef(false); // Prevent multiple loads
  const imagesRef = useRef<HTMLImageElement[]>([]); // Store images in ref to avoid re-renders

  useEffect(() => {
    setIsMounted(true);
    // Detect mobile and tablet (treat tablets same as mobile)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1025); // lg breakpoint (1025px) - includes tablets
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize Lenis smooth scroll (only on desktop, not mobile/tablet) - deferred for performance
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined' || isMobile) return;
    if (lenisRef.current) return;

    // Defer Lenis initialization until after first paint
    const initLenis = () => {
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

      function raf(time: number) {
        lenis.raf(time);
        ScrollTrigger.update();
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
      gsap.ticker.lagSmoothing(0);
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(initLenis, { timeout: 100 });
    } else {
      setTimeout(initLenis, 0);
    }

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, [isMounted, isMobile]);

  // Load frame images (optimized: mobile = last frame only, desktop = progressive loading)
  useEffect(() => {
    if (!isMounted || imagesLoadingRef.current) return;
    imagesLoadingRef.current = true;

    const currentIsMobile = window.innerWidth < 1025; // lg breakpoint (1025px) - includes tablets
    const currentFrame = (index: number) =>
      `/frames/frame_${(index + 1).toString().padStart(4, '0')}.png`;

    // MOBILE: Signal ready immediately (Next.js Image handles loading)
    if (currentIsMobile) {
      setImagesLoaded(true);
      // Signal animation is ready immediately for mobile
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(ANIMATION_READY_EVENT));
      }
      return;
    }

    // DESKTOP: Progressive loading strategy
    const loadedImages: HTMLImageElement[] = new Array(frameCount).fill(null);
    let loadedCount = 0;
    let firstFrameRendered = false;
    let allFramesRequested = false;

    const renderFirstFrame = () => {
      if (firstFrameRendered || !canvasRef.current) return;
      firstFrameRendered = true;

      const tryRender = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const img = loadedImages[0];

        if (!ctx || !img || !img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
          setTimeout(tryRender, 50);
          return;
        }

        const pixelRatio = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        canvas.style.margin = '0';
        canvas.style.padding = '0';
        canvas.style.display = 'block';
        ctx.scale(pixelRatio, pixelRatio);

        // Cover strategy: scale to fill entire canvas completely (no gaps)
        const scaleX = window.innerWidth / img.naturalWidth;
        const scaleY = window.innerHeight / img.naturalHeight;
        const scale = Math.max(scaleX, scaleY); // Use larger scale to ensure full coverage

        const drawWidth = img.naturalWidth * scale;
        const drawHeight = img.naturalHeight * scale;
        // Center the image - it will overflow on one axis to ensure full coverage
        const drawX = (window.innerWidth - drawWidth) / 2;
        const drawY = (window.innerHeight - drawHeight) / 2;

        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

        try {
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
          videoFramesRef.current.frame = 0;
        } catch (error) {
          console.error('Error drawing first frame:', error);
        }
      };

      setTimeout(tryRender, 50);
    };

    const onLoad = (event: Event, index: number) => {
      const img = event.target as HTMLImageElement;

      if (img.naturalWidth === 0 || img.naturalHeight === 0) {
        console.warn(`Image failed to load: ${img.src}`);
        loadedCount++;
        if (loadedCount === frameCount) {
          imagesRef.current = [...loadedImages];
          setImages([...loadedImages]);
          setImagesLoaded(true);
        }
        return;
      }

      loadedImages[index] = img;
      loadedCount++;

      // Show first frame immediately when it loads
      if (index === 0 && !firstFrameRendered) {
        imagesRef.current = [...loadedImages];
        renderFirstFrame();
        // Don't signal here - setupAfterFirstFrame will signal when ScrollTrigger is ready
      }

      // When all requested frames are loaded (for smooth scrolling)
      if (loadedCount === frameCount) {
        imagesRef.current = [...loadedImages];
        setImages([...loadedImages]);
        setImagesLoaded(true);
      }
    };

    const onError = (event: Event | string, index: number) => {
      console.error(`Failed to load frame ${index + 1}`);
      loadedCount++;
      if (loadedCount === frameCount) {
        imagesRef.current = [...loadedImages];
        setImages([...loadedImages]);
        setImagesLoaded(true);
      }
    };

    // Load first frame immediately (critical for initial render)
    const loadFirstFrame = () => {
      const img = document.createElement('img');
      img.onload = (e) => onLoad(e, 0);
      img.onerror = (e) => onError(e, 0);
      img.src = currentFrame(0);
      loadedImages[0] = img;
    };

    // Load remaining frames progressively in batches (optimized for performance)
    const loadRemainingFrames = () => {
      if (allFramesRequested) return;
      allFramesRequested = true;

      // Load frames 1-30 immediately (critical for initial scroll)
      for (let i = 1; i <= Math.min(30, frameCount - 1); i++) {
        const img = document.createElement('img');
        img.onload = (e) => onLoad(e, i);
        img.onerror = (e) => onError(e, i);
        img.src = currentFrame(i);
        loadedImages[i] = img;
      }

      // Use requestIdleCallback for non-critical frame loading
      const loadBatch = (start: number, end: number, delay: number) => {
        const load = () => {
          for (let i = start; i <= Math.min(end, frameCount - 1); i++) {
            const img = document.createElement('img');
            img.onload = (e) => onLoad(e, i);
            img.onerror = (e) => onError(e, i);
            img.src = currentFrame(i);
            loadedImages[i] = img;
          }
        };

        if ('requestIdleCallback' in window && delay > 500) {
          requestIdleCallback(load, { timeout: delay });
        } else {
          setTimeout(load, delay);
        }
      };

      // Load frames 31-60 after initial paint
      loadBatch(31, 60, 100);

      // Load frames 61-100 after user interaction or idle
      loadBatch(61, 100, 500);

      // Load frames 101-150 after longer delay
      loadBatch(101, 150, 1000);

      // Load remaining frames (151-end) lazily
      loadBatch(151, frameCount - 1, 2000);
    };

    // Start loading
    loadFirstFrame();
    loadRemainingFrames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, frameCount]);

  // Set canvas size and render (only for desktop)
  useEffect(() => {
    // Skip this effect on mobile - mobile has its own rendering logic
    if (!isMounted || !canvasRef.current || !imagesLoaded || isMobile) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const setCanvasSize = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      canvas.style.margin = '0';
      canvas.style.padding = '0';
      canvas.style.display = 'block';
      context.scale(pixelRatio, pixelRatio);
    };

    setCanvasSize();

    const render = () => {
      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;

      // Clear canvas
      context.clearRect(0, 0, canvasWidth, canvasHeight);

      // Use imagesRef first, fallback to images state
      const frameIndex = videoFramesRef.current.frame;
      const img = imagesRef.current[frameIndex] || images[frameIndex];

      // Check if image exists, is complete, and not broken
      if (img && img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
        // Cover strategy: scale to fill entire canvas completely (edge to edge, no gaps)
        const scaleX = canvasWidth / img.naturalWidth;
        const scaleY = canvasHeight / img.naturalHeight;
        // Add small buffer (1%) to ensure image covers entire canvas with no gaps
        const scale = Math.max(scaleX, scaleY) * 1.2;

        const drawWidth = img.naturalWidth * scale;
        const drawHeight = img.naturalHeight * scale;
        // Center the image - it will overflow on both axes to ensure full coverage
        const drawX = (canvasWidth - drawWidth) / 2;
        const drawY = (canvasHeight - drawHeight) / 2;

        try {
          context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        } catch (error) {
          console.error('Error drawing frame:', frameIndex, error);
        }
      }
    };

    // Setup ScrollTrigger - matches original example exactly
    const setupScrollTrigger = () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }

      if (!heroRef.current) return;

      const nav = document.querySelector('header');
      const header = heroRef.current.querySelector('.header') as HTMLElement;
      const heroImg = heroImgRef.current;

      const trigger = ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: `+=${window.innerHeight * 7}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
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

          // Header 3D transform (0-25%)
          if (header) {
            if (progress <= 0.25) {
              const zProgress = progress / 0.25;
              const translateZ = zProgress * -500;

              let opacity = 1;
              if (progress >= 0.2) {
                const fadeProgress = Math.min((progress - 0.2) / (0.25 - 0.2), 1);
                opacity = 1 - fadeProgress;
              }

              gsap.set(header, {
                transform: `translate(-50%, -50%) translateZ(${translateZ}px)`,
                opacity,
              });
            } else {
              gsap.set(header, { opacity: 0 });
            }
          }

          // Frame animation (0-90%)
          const animationProgress = Math.min(progress / 0.9, 1);
          const targetFrame = Math.round(animationProgress * (frameCount - 1));
          videoFramesRef.current.frame = targetFrame;
          render();

          // Hero image (dashboard) animation (60-100%)
          if (heroImg) {
            if (progress < 0.6) {
              gsap.set(heroImg, {
                transform: 'translateZ(1000px)',
                opacity: 0,
              });
            } else if (progress >= 0.6 && progress <= 0.9) {
              const imgProgress = (progress - 0.6) / (0.9 - 0.6);
              const translateZ = 1000 - imgProgress * 1000;

              let opacity = 0;
              if (progress <= 0.8) {
                const opacityProgress = (progress - 0.6) / (0.8 - 0.6);
                opacity = opacityProgress;
              } else {
                opacity = 1;
              }

              gsap.set(heroImg, {
                transform: `translateZ(${translateZ}px)`,
                opacity,
              });
            } else {
              gsap.set(heroImg, {
                transform: 'translateZ(0px)',
                opacity: 1,
              });
            }
          }
        },
      });

      scrollTriggerRef.current = trigger;
    };

    // Initial render
    render();

    // Setup ScrollTrigger immediately after first frame is ready (don't wait for all frames)
    const setupAfterFirstFrame = () => {
      if (imagesRef.current[0] && imagesRef.current[0].complete) {
        setupScrollTrigger();
        ScrollTrigger.refresh();
        // Signal animation is fully ready (first frame rendered + ScrollTrigger initialized)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent(ANIMATION_READY_EVENT));
        }
      } else {
        // Retry if first frame not ready yet (max 5 retries = 250ms)
        setTimeout(setupAfterFirstFrame, 50);
      }
    };

    // Start setup immediately - first frame should already be loading
    setupAfterFirstFrame();

    const handleResize = () => {
      setCanvasSize();
      render();
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, imagesLoaded]); // Only run when images are loaded, don't depend on isMobile or frameCount

  // Mobile doesn't need canvas rendering - using Next.js Image component for better quality

  // On mobile, show baby image with heading on top (use Next.js Image for better quality)
  if (isMobile) {
    return (
      <div
        ref={heroRef}
        className="hero relative h-screen w-screen overflow-hidden bg-background"
        style={{ margin: 0, padding: 0, left: 0, right: 0, width: '100vw', height: '100vh' }}
      >
        {/* Mobile baby image - use Next.js Image for better quality */}
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

  return (
    <div
      ref={heroRef}
      className="hero relative h-screen w-screen overflow-hidden bg-background"
      style={{ margin: 0, padding: 0, left: 0, right: 0, width: '100vw', height: '100vh' }}
    >
      {/* Header element for 3D transform */}
      {/* <div className="header absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
        <h1 className="h1 text-center font-bold text-white">Three pillars with one purpose</h1>
      </div> */}

      {/* Canvas for frame animation - full screen */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{
          margin: 0,
          padding: 0,
          display: 'block',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
        }}
      />

      {/* Dashboard image that appears at the end */}
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
