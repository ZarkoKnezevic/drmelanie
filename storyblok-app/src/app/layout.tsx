import type { Metadata } from 'next';
import { Karla } from 'next/font/google';
import './globals.css';
import StoryblokProvider from '@/components/StoryblokProvider';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/components/toaster';
import { Suspense } from 'react';
import { ConditionalHeaderWrapper } from '@/components/layout/conditional-header-wrapper';
import { GlobalFooter } from '@/components/layout/global-footer';
import { InitialLoading } from '@/components/layout/initial-loading';
import { PageTransition } from '@/components/layout/page-transition';
import { LoadingProvider } from '@/contexts/loading-context';
import { TooltipProvider } from '@/components/ui/components/tooltip';
import '@/lib/storyblok-init'; // Initialize Storyblok for server components
import { APP_CONFIG } from '@/constants';
import { cn } from '@/utils';

const karla = Karla({
  subsets: ['latin'],
  variable: '--font-karla',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Dr. Melanie Kollmann Miletic - Frauenheilkunde & Geburtshilfe in Linz',
    template: `%s | Dr. Melanie Kollmann Miletic`,
  },
  description:
    'Willkommen in Ihrer Ordination für Frauenheilkunde & Geburtshilfe in Linz. Dr. Melanie Kollmann Miletic bietet umfassende gynäkologische Betreuung, Schwangerschaftsvorsorge und Geburtshilfe in moderner, vertrauensvoller Atmosphäre.',
  keywords: [
    'Gynäkologe Linz',
    'Frauenarzt Linz',
    'Geburtshilfe Linz',
    'Schwangerschaftsvorsorge Linz',
    'Frauenheilkunde Linz',
    'Dr. Melanie Kollmann Miletic',
    'Gynäkologie Oberösterreich',
    'Frauenarztpraxis Linz',
    'Gynäkologe Linz Zentrum',
    'Schwangerschaftsbetreuung Linz',
    'Geburtsvorbereitung Linz',
    'Vorsorgeuntersuchung Frauen',
  ],
  authors: [{ name: 'Dr. Melanie Kollmann Miletic' }],
  creator: 'Dr. Melanie Kollmann Miletic',
  publisher: 'Dr. Melanie Kollmann Miletic',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icons/favicons/favicon.ico' },
      { url: '/icons/favicons/icon1.png', type: 'image/png' },
      { url: '/icons/favicons/icon0.svg', type: 'image/svg+xml' },
    ],
    apple: '/icons/favicons/apple-icon.png',
  },
  manifest: '/icons/favicons/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'de_AT',
    url: APP_CONFIG.domain,
    title: 'Dr. Melanie Kollmann Miletic - Frauenheilkunde & Geburtshilfe in Linz',
    description:
      'Willkommen in Ihrer Ordination für Frauenheilkunde & Geburtshilfe in Linz. Umfassende gynäkologische Betreuung, Schwangerschaftsvorsorge und Geburtshilfe.',
    siteName: 'Dr. Melanie Kollmann Miletic',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Dr. Melanie Kollmann Miletic - Frauenheilkunde & Geburtshilfe Linz',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dr. Melanie Kollmann Miletic - Frauenheilkunde & Geburtshilfe in Linz',
    description: 'Willkommen in Ihrer Ordination für Frauenheilkunde & Geburtshilfe in Linz.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: APP_CONFIG.domain,
  },
  category: 'Medizin',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning className={`${karla.variable} font-sans`}>
      <body className={cn('min-h-screen bg-background font-karla antialiased')}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <StoryblokProvider>
              <LoadingProvider>
                <InitialLoading />
                <PageTransition>
                  <div className="relative flex min-h-screen flex-col">
                    <Suspense fallback={<div className="h-16 lg:h-24 xl:h-32" />}>
                      <ConditionalHeaderWrapper />
                    </Suspense>
                    <main className="flex-1">{children}</main>
                    <Suspense fallback={<footer className="h-24 border-t bg-background" />}>
                      <GlobalFooter />
                    </Suspense>
                  </div>
                </PageTransition>
                <Toaster />
              </LoadingProvider>
            </StoryblokProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
