# Storyblok CMS Setup Guide

This project is configured to work with Storyblok headless CMS using dynamic components.

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root of the `my-app` directory with your Storyblok access token:

```env
NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN=your_preview_token_here
STORYBLOK_VERSION=draft
```

To get your access token:
1. Go to your Storyblok space
2. Navigate to Settings → Access tokens
3. Copy your Preview token

### 2. Storyblok Space Configuration

In your Storyblok space, create the following components:

#### Page Component
- **Name**: `page`
- **Fields**:
  - `body` (Blocks field) - allows nested components

#### Hero Component
- **Name**: `hero`
- **Fields**:
  - `headline` (Text)
  - `subheadline` (Text, optional)
  - `background_image` (Asset, optional)
  - `cta_text` (Text, optional)
  - `cta_link` (Link, optional)

#### Teaser Component
- **Name**: `teaser`
- **Fields**:
  - `headline` (Text)
  - `description` (Textarea, optional)
  - `image` (Asset, optional)
  - `link` (Link, optional)

#### Grid Component
- **Name**: `grid`
- **Fields**:
  - `columns` (Number, default: 3)
  - `gap` (Text, default: "6")
  - `items` (Blocks field) - allows nested components

#### Feature Component
- **Name**: `feature`
- **Fields**:
  - `name` (Text)
  - `description` (Textarea, optional)
  - `icon` (Text, optional)

### 3. Create Your First Story

1. In Storyblok, create a new story with the slug `home`
2. Set the content type to `page`
3. Add components to the `body` field (Hero, Grid, Teaser, etc.)
4. Publish or save as draft

### 4. Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your Storyblok content rendered.

## Adding New Components

To add a new Storyblok component:

1. Create a new component file in `components/storyblok/YourComponent.tsx`:

```tsx
'use client';

import { storyblokEditable } from '@storyblok/react/rsc';

interface YourComponentProps {
  blok: {
    _uid: string;
    component: string;
    // Add your fields here
  };
}

export default function YourComponent({ blok }: YourComponentProps) {
  return (
    <div {...storyblokEditable(blok)}>
      {/* Your component JSX */}
    </div>
  );
}
```

2. Register it in `lib/storyblok-components.ts`:

```ts
import YourComponent from '@/components/storyblok/YourComponent';

export const components = {
  // ... existing components
  your_component: YourComponent,
};
```

3. Create the component in Storyblok with the same name (`your_component`)

## Dynamic Routing

To create dynamic routes for different stories, create a `[slug]` folder in `app`:

```
app/
  [slug]/
    page.tsx
```

Then fetch the story by slug in the page component.

## Resources

- [Storyblok Documentation](https://www.storyblok.com/docs)
- [Storyblok React SDK](https://github.com/storyblok/storyblok-react)
- [Next.js App Router](https://nextjs.org/docs/app)

