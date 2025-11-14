// Component mapping for Storyblok
import Teaser from '@/components/storyblok/Teaser';
import Hero from '@/components/storyblok/Hero';
import Grid from '@/components/storyblok/Grid';
import Feature from '@/components/storyblok/Feature';
import Page from '@/components/storyblok/Page';

// Register components with multiple name variations to handle case differences
export const components = {
  // Lowercase (standard)
  teaser: Teaser,
  hero: Hero,
  grid: Grid,
  feature: Feature,
  page: Page,
  // Capitalized (in case Storyblok sends it this way)
  Teaser: Teaser,
  Hero: Hero,
  Grid: Grid,
  Feature: Feature,
  Page: Page,
};

