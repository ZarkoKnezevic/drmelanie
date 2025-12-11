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
    // Detect mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize Lenis smooth scroll (only on desktop)
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined' || isMobile) return;
    if (lenisRef.current) return;

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

    const currentIsMobile = window.innerWidth < 768;
    const currentFrame = (index: number) =>
      `/frames/frame_${(index + 1).toString().padStart(4, '0')}.png`;

    // MOBILE: Only load the first frame
    if (currentIsMobile) {
      const loadedImages: HTMLImageElement[] = new Array(frameCount).fill(null);

      const img = document.createElement('img');
      img.onload = () => {
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          loadedImages[0] = img;
          imagesRef.current = loadedImages;
          setImages(loadedImages);
          setImagesLoaded(true);
          // Signal animation is ready (first frame loaded)
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent(ANIMATION_READY_EVENT));
          }
        }
      };
      img.onerror = () => {
        console.error(`Failed to load first frame: ${currentFrame(0)}`);
        setImagesLoaded(true); // Still mark as loaded to avoid infinite waiting
        // Signal animation is ready even on error (to prevent stuck loading)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent(ANIMATION_READY_EVENT));
        }
      };
      img.src = currentFrame(0);
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
        canvas.width = window.innerWidth * pixelRatio;
        canvas.height = window.innerHeight * pixelRatio;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.scale(pixelRatio, pixelRatio);

        const imageAspect = img.naturalWidth / img.naturalHeight;
        const canvasAspect = window.innerWidth / window.innerHeight;

        let drawWidth: number, drawHeight: number, drawX: number, drawY: number;
        // Fill entire canvas - scale to cover (no black bars)
        if (imageAspect > canvasAspect) {
          // Image is wider - scale to height, crop sides
          drawHeight = window.innerHeight;
          drawWidth = drawHeight * imageAspect;
          drawX = (window.innerWidth - drawWidth) / 2;
          drawY = 0;
        } else {
          // Image is taller - scale to width, crop top/bottom
          drawWidth = window.innerWidth;
          drawHeight = drawWidth / imageAspect;
          drawX = 0;
          drawY = (window.innerHeight - drawHeight) / 2;
        }

        try {
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
          videoFramesRef.current.frame = 0;
          // Don't signal here - wait for ScrollTrigger to be ready on desktop
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
        // Don't signal ready here - wait for renderFirstFrame to complete
      }

      // When all requested frames are loaded
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

    // Load remaining frames progressively in batches
    const loadRemainingFrames = () => {
      if (allFramesRequested) return;
      allFramesRequested = true;

      // Load frames 1-20 immediately (near the start, likely to be scrolled to)
      for (let i = 1; i <= Math.min(20, frameCount - 1); i++) {
        const img = document.createElement('img');
        img.onload = (e) => onLoad(e, i);
        img.onerror = (e) => onError(e, i);
        img.src = currentFrame(i);
        loadedImages[i] = img;
      }

      // Load frames 21-50 after a short delay
      setTimeout(() => {
        for (let i = 21; i <= Math.min(50, frameCount - 1); i++) {
          const img = document.createElement('img');
          img.onload = (e) => onLoad(e, i);
          img.onerror = (e) => onError(e, i);
          img.src = currentFrame(i);
          loadedImages[i] = img;
        }
      }, 200);

      // Load frames 51-100 after another delay
      setTimeout(() => {
        for (let i = 51; i <= Math.min(100, frameCount - 1); i++) {
          const img = document.createElement('img');
          img.onload = (e) => onLoad(e, i);
          img.onerror = (e) => onError(e, i);
          img.src = currentFrame(i);
          loadedImages[i] = img;
        }
      }, 500);

      // Load remaining frames (101-end) after another delay
      setTimeout(() => {
        for (let i = 101; i < frameCount; i++) {
          const img = document.createElement('img');
          img.onload = (e) => onLoad(e, i);
          img.onerror = (e) => onError(e, i);
          img.src = currentFrame(i);
          loadedImages[i] = img;
        }
      }, 1000);
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
      canvas.width = window.innerWidth * pixelRatio;
      canvas.height = window.innerHeight * pixelRatio;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      context.scale(pixelRatio, pixelRatio);
    };

    setCanvasSize();

    const render = () => {
      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;

      context.clearRect(0, 0, canvasWidth, canvasHeight);

      // Use imagesRef first, fallback to images state
      const frameIndex = videoFramesRef.current.frame;
      const img = imagesRef.current[frameIndex] || images[frameIndex];

      // Check if image exists, is complete, and not broken
      if (img && img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
        const imageAspect = img.naturalWidth / img.naturalHeight;
        const canvasAspect = canvasWidth / canvasHeight;

        let drawWidth: number, drawHeight: number, drawX: number, drawY: number;
        // Fill entire canvas - scale to cover (no black bars)
        if (imageAspect > canvasAspect) {
          // Image is wider - scale to height, crop sides
          drawHeight = canvasHeight;
          drawWidth = drawHeight * imageAspect;
          drawX = (canvasWidth - drawWidth) / 2;
          drawY = 0;
        } else {
          // Image is taller - scale to width, crop top/bottom
          drawWidth = canvasWidth;
          drawHeight = drawWidth / imageAspect;
          drawX = 0;
          drawY = (canvasHeight - drawHeight) / 2;
        }

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

    // Setup ScrollTrigger after a short delay to ensure everything is ready
    setTimeout(() => {
      setupScrollTrigger();
      ScrollTrigger.refresh();
      // Signal animation is fully ready (first frame rendered + ScrollTrigger initialized)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(ANIMATION_READY_EVENT));
      }
    }, 150); // Slightly longer delay to ensure ScrollTrigger is fully initialized

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

  // Render first frame on mobile when images are loaded
  useEffect(() => {
    if (!imagesLoaded || !isMobile || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imagesRef.current[0] || images[0];

    if (ctx && img && img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * pixelRatio;
      canvas.height = window.innerHeight * pixelRatio;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(pixelRatio, pixelRatio);

      const imageAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = window.innerWidth / window.innerHeight;

      let drawWidth: number, drawHeight: number, drawX: number, drawY: number;
      // Fill entire canvas - scale to cover (no black bars)
      if (imageAspect > canvasAspect) {
        // Image is wider - scale to height, crop sides
        drawHeight = window.innerHeight;
        drawWidth = drawHeight * imageAspect;
        drawX = (window.innerWidth - drawWidth) / 2;
        drawY = 0;
      } else {
        // Image is taller - scale to width, crop top/bottom
        drawWidth = window.innerWidth;
        drawHeight = drawWidth / imageAspect;
        drawX = 0;
        drawY = (window.innerHeight - drawHeight) / 2;
      }

      try {
        videoFramesRef.current.frame = 0;
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      } catch (error) {
        console.error('Error rendering first frame on mobile:', error);
      }
    }
  }, [imagesLoaded, isMobile, frameCount, images]);

  // On mobile, show first frame with heading on top
  if (isMobile) {
    return (
      <div ref={heroRef} className="hero relative h-screen w-full bg-background">
        {/* Canvas with first frame */}
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

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
    <div ref={heroRef} className="hero relative h-screen w-full bg-background">
      {/* Header element for 3D transform */}
      {/* <div className="header absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
        <h1 className="h1 text-center font-bold text-white">Three pillars with one purpose</h1>
      </div> */}

      {/* Canvas for frame animation - full screen */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

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
