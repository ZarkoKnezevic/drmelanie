'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/components/button';
import { X } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'cookie-consent-accepted';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    // Save consent to localStorage
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="container mx-auto px-4 pb-4">
        <div className="rounded-lg border bg-background p-4 shadow-lg md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <p className="text-sm text-foreground md:text-base">
                Diese Website verwendet Cookies, um Ihnen die bestmögliche Erfahrung zu bieten.
                Durch die Nutzung unserer Website stimmen Sie der Verwendung von Cookies zu. Weitere
                Informationen finden Sie in unserer{' '}
                <a
                  href="/datenschutz"
                  className="underline hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Datenschutzerklärung
                </a>
                .
              </p>
            </div>
            <div className="flex items-center gap-2 md:ml-4">
              <Button
                onClick={handleAccept}
                className="whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90"
              >
                OK, ALLE COOKIES
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

