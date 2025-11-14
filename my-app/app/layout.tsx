import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoryblokProvider from "@/components/StoryblokProvider";
import "@/lib/storyblok-init"; // Initialize Storyblok for server components

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Storyblok CMS Website",
  description: "Website powered by Storyblok headless CMS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoryblokProvider>{children}</StoryblokProvider>
      </body>
    </html>
  );
}
