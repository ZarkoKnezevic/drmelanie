import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import StoryblokProvider from '@/components/StoryblokProvider';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { TooltipProvider } from '@/components/ui/tooltip';
import '@/lib/storyblok-init'; // Initialize Storyblok for server components
import { APP_CONFIG } from '@/constants';
import { cn } from '@/utils';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: APP_CONFIG.name,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: APP_CONFIG.description,
  keywords: ['Next.js', 'React', 'TypeScript', 'Storyblok', 'CMS'],
  authors: [{ name: 'Storyblok CMS' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_CONFIG.domain,
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
    siteName: APP_CONFIG.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={cn('min-h-screen bg-background font-sans antialiased')}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <StoryblokProvider>
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
              </div>
              <Toaster />
            </StoryblokProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

