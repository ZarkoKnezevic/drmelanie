/**
 * Common Storyblok field types that can be reused across components
 * These correspond to Storyblok Field Groups for reusability
 */

export interface CommonBackgroundFields {
  background?: string;
}

export interface CommonContentFields {
  topline?: string;
  headline?: string;
  background?: string;
}

// Combine common fields for convenience
export type StoryblokCommonFields = CommonBackgroundFields & Partial<CommonContentFields>;

