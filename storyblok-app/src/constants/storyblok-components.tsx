/**
 * Storyblok component mapping
 * Register all Storyblok components here
 */

// Import Storyblok components
import Page from '@/components/storyblok/Page';
import Grid from '@/components/storyblok/Grid';
import Feature from '@/components/storyblok/Feature';
import Service from '@/components/storyblok/Service';
import Services from '@/components/storyblok/Services';
import Header from '@/components/storyblok/Header';
import Footer from '@/components/storyblok/Footer';
import Settings from '@/components/storyblok/Settings';
import Hero from '@/components/storyblok/Hero';
import Banner from '@/components/storyblok/Banner';
import Teaser from '@/components/storyblok/Teaser';
import TextImage from '@/components/storyblok/TextImage';
import ImageGallery from '@/components/storyblok/ImageGallery';
import TwoImagesText from '@/components/storyblok/TwoImagesText';
import HeroMedia from '@/components/storyblok/HeroMedia';

// Register components with multiple name variations to handle case differences
export const COMPONENTS = {
  // Lowercase (standard)
  page: Page,
  grid: Grid,
  feature: Feature,
  service: Service,
  services: Services,
  header: Header,
  footer: Footer,
  settings: Settings,
  hero: Hero,
  banner: Banner,
  teaser: Teaser,
  'text_image': TextImage,
  'image_gallery': ImageGallery,
  'image_galery': ImageGallery, // Handle typo variation
  'two_images_text': TwoImagesText,
  twoImagesText: TwoImagesText,
  'hero_media': HeroMedia,
  heroMedia: HeroMedia,
  imageGallery: ImageGallery,
  imageGalery: ImageGallery, // Handle typo variation
  // Capitalized (in case Storyblok sends it this way)
  Page: Page,
  Grid: Grid,
  Feature: Feature,
  Service: Service,
  Services: Services,
  Header: Header,
  Footer: Footer,
  Settings: Settings,
  Hero: Hero,
  Banner: Banner,
  Teaser: Teaser,
  TextImage: TextImage,
  ImageGallery: ImageGallery,
  ImageGalery: ImageGallery, // Handle typo variation
  TwoImagesText: TwoImagesText,
  HeroMedia: HeroMedia,
} as const;

