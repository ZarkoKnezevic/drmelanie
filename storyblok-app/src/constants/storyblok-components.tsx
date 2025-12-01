/**
 * Storyblok component mapping
 * Register all Storyblok components here
 */

// Import Storyblok components
import Page from '@/components/storyblok/Page';
import Grid from '@/components/storyblok/Grid';
import Feature from '@/components/storyblok/Feature';
import Hero from '@/components/storyblok/Hero';
import Banner from '@/components/storyblok/Banner';
import Teaser from '@/components/storyblok/Teaser';
import TextImage from '@/components/storyblok/TextImage';

// Register components with multiple name variations to handle case differences
export const COMPONENTS = {
  // Lowercase (standard)
  page: Page,
  grid: Grid,
  feature: Feature,
  hero: Hero,
  banner: Banner,
  teaser: Teaser,
  'text_image': TextImage,
  // Capitalized (in case Storyblok sends it this way)
  Page: Page,
  Grid: Grid,
  Feature: Feature,
  Hero: Hero,
  Banner: Banner,
  Teaser: Teaser,
  TextImage: TextImage,
} as const;

