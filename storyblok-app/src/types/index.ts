// Global type definitions

export interface BaseComponent {
  _uid: string;
  component: string;
  [key: string]: any;
}

export interface StoryblokBlok extends BaseComponent {
  body?: StoryblokBlok[];
  items?: StoryblokBlok[];
  columns?: StoryblokBlok[] | number;
  columns_content?: StoryblokBlok[];
  content?: StoryblokBlok[];
}

export interface StoryblokStory {
  content: StoryblokBlok;
  name: string;
  created_at: string;
  published_at: string | null;
  id: number;
  uuid: string;
  slug: string;
  full_slug: string;
}

export interface StoryblokLink {
  id: number;
  slug: string;
  name: string;
  is_folder: boolean;
  parent_id: number | null;
  published: boolean;
  position: number;
  uuid: string;
  is_startpage: boolean;
  real_path: string;
  url?: string;
}

export interface StoryblokApiResponse {
  story: StoryblokStory | null;
  links?: StoryblokLink[];
}

export interface StoryblokStoriesResponse {
  stories: StoryblokStory[];
}

export interface StoryblokApiInit {
  accessToken: string;
  use: unknown[];
  components: Record<string, React.ComponentType<unknown>>;
}

// Environment variables
export interface Env {
  NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN: string;
  NEXT_PUBLIC_STORYBLOK_API_GATE: string;
  STORYBLOK_VERSION?: 'draft' | 'published';
  NEXT_PUBLIC_APP_URL: string;
  NEXT_PUBLIC_DOMAIN: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

