'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import Image from 'next/image';

interface HeroMediaVideoProps {
  src?: string;
  frameCount?: number;
}

export function HeroMediaVideo({ frameCount = 207 }: HeroMediaVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);
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

  // Load all frame images (only once)
  useEffect(() => {
    if (!isMounted || imagesLoadingRef.current) return;
    imagesLoadingRef.current = true;

    const loadImages = async () => {
      const loadedImages: HTMLImageElement[] = [];
      let loadedCount = 0;
      let firstFrameRendered = false;
      const currentIsMobile = window.innerWidth < 768;

      const currentFrame = (index: number) =>
        `/frames/frame_${(index + 1).toString().padStart(4, '0')}.png`;

      const renderFirstFrame = () => {
        if (firstFrameRendered || !canvasRef.current) return;
        firstFrameRendered = true;

        const tryRender = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          const img = loadedImages[0];

          // Check if image exists, is complete, and not broken
          if (!ctx || !img || !img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
            // Retry after a short delay if image isn't ready
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
          if (imageAspect > canvasAspect) {
            drawHeight = window.innerHeight;
            drawWidth = drawHeight * imageAspect;
            drawX = (window.innerWidth - drawWidth) / 2;
            drawY = 0;
          } else {
            drawWidth = window.innerWidth;
            drawHeight = drawWidth / imageAspect;
            drawX = 0;
            drawY = (window.innerHeight - drawHeight) / 2;
          }

          try {
            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
            videoFramesRef.current.frame = 0;
          } catch (error) {
            console.error('Error drawing first frame:', error);
          }
        };

        setTimeout(tryRender, 50);
      };

      const renderLastFrame = () => {
        if (!canvasRef.current) return;

        const tryRender = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          const lastFrameIndex = frameCount - 1;
          const img = loadedImages[lastFrameIndex];

          // Check if image exists, is complete, and not broken
          if (!ctx || !img || !img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
            // Retry after a short delay if image isn't ready
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
          if (imageAspect > canvasAspect) {
            drawHeight = window.innerHeight;
            drawWidth = drawHeight * imageAspect;
            drawX = (window.innerWidth - drawWidth) / 2;
            drawY = 0;
          } else {
            drawWidth = window.innerWidth;
            drawHeight = drawWidth / imageAspect;
            drawX = 0;
            drawY = (window.innerHeight - drawHeight) / 2;
          }

          try {
            // Set the frame index to last frame so it doesn't get overwritten
            videoFramesRef.current.frame = lastFrameIndex;
            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
          } catch (error) {
            console.error('Error drawing last frame:', error);
          }
        };

        setTimeout(tryRender, 50);
      };

      const onLoad = (event: Event) => {
        const img = event.target as HTMLImageElement;

        // Check if image loaded successfully (not broken)
        if (img.naturalWidth === 0 || img.naturalHeight === 0) {
          console.warn(`Image failed to load: ${img.src}`);
          // Still count it to avoid infinite waiting
          loadedCount++;
          if (loadedCount === frameCount) {
            imagesRef.current = [...loadedImages];
            setImages([...loadedImages]);
            setImagesLoaded(true);
          }
          return;
        }

        loadedCount++;

        // Show first frame immediately (desktop only) - only if image is valid
        if (loadedCount === 1 && !currentIsMobile && img.naturalWidth > 0) {
          imagesRef.current = [...loadedImages];
          renderFirstFrame();
        }

        // When all images are loaded, set state ONCE
        if (loadedCount === frameCount) {
          imagesRef.current = [...loadedImages];
          setImages([...loadedImages]);
          setImagesLoaded(true);

          // On mobile, render last frame
          if (currentIsMobile) {
            renderLastFrame();
          }
        }
      };

      const onError = (event: Event | string) => {
        const img =
          (typeof event === 'string' ? null : (event.target as HTMLImageElement)) ||
          loadedImages[loadedCount];
        const src = img?.src || 'unknown';
        console.error(`Failed to load image: ${src}`);
        loadedCount++;
        // Still mark as loaded to avoid infinite waiting
        if (loadedCount === frameCount) {
          imagesRef.current = [...loadedImages];
          setImages([...loadedImages]);
          setImagesLoaded(true);
        }
      };

      for (let i = 0; i < frameCount; i++) {
        const img = document.createElement('img');
        img.onload = onLoad;
        img.onerror = onError;
        img.src = currentFrame(i);
        loadedImages.push(img);
      }
    };

    loadImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, frameCount]); // Only run once when mounted, don't depend on imagesLoaded

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

        if (imageAspect > canvasAspect) {
          drawHeight = canvasHeight;
          drawWidth = drawHeight * imageAspect;
          drawX = (canvasWidth - drawWidth) / 2;
          drawY = 0;
        } else {
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
    }, 100);

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

  // Render last frame on mobile when images are loaded
  useEffect(() => {
    if (!imagesLoaded || !isMobile || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const lastFrameIndex = frameCount - 1;
    const img = imagesRef.current[lastFrameIndex] || images[lastFrameIndex];

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
      if (imageAspect > canvasAspect) {
        drawHeight = window.innerHeight;
        drawWidth = drawHeight * imageAspect;
        drawX = (window.innerWidth - drawWidth) / 2;
        drawY = 0;
      } else {
        drawWidth = window.innerWidth;
        drawHeight = drawWidth / imageAspect;
        drawX = 0;
        drawY = (window.innerHeight - drawHeight) / 2;
      }

      try {
        videoFramesRef.current.frame = lastFrameIndex;
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      } catch (error) {
        console.error('Error rendering last frame on mobile:', error);
      }
    }
  }, [imagesLoaded, isMobile, frameCount, images]);

  // On mobile, show last frame with dashboard on top
  if (isMobile) {
    return (
      <section ref={heroRef} className="hero relative h-screen w-full bg-background">
        {/* Canvas with last frame */}
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* Dashboard image on top */}
        <div className="spacing container relative z-10 h-full w-full py-12 md:py-16 lg:py-20">
          <Image
            src="/dashboard.png"
            alt="Dashboard"
            width={1920}
            height={1080}
            className="h-full w-full object-contain"
            priority
            unoptimized
          />
        </div>
      </section>
    );
  }

  return (
    <section ref={heroRef} className="hero relative h-screen w-full bg-background">
      {/* Header element for 3D transform */}
      <div className="header absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
        <h1 className="h1 text-center">Three pillars with one purpose</h1>
      </div>

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
            src="/dashboard.png"
            alt="Dashboard"
            width={1920}
            height={1080}
            className="h-full w-full object-contain"
            priority
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
