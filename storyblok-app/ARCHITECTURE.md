# Architecture Documentation

## Overview

This is a **Next.js 16** application using **React Server Components (RSC)** with **Storyblok CMS** for content management. The architecture follows modern Next.js patterns and Storyblok best practices.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - UI library with Server Components
- **TypeScript** - Type safety
- **Storyblok** - Headless CMS
- **Tailwind CSS** - Styling
- **ESLint & Prettier** - Code quality

## Architecture Layers

### 1. Presentation Layer (`src/app/`)
- Next.js App Router pages
- Server Components by default
- Route handlers and API routes

### 2. Component Layer (`src/components/`)
- Reusable React components
- Storyblok-specific components
- Client and Server components

### 3. Business Logic Layer (`src/lib/`)
- Storyblok API integration
- Data fetching utilities
- Business logic functions

### 4. Utility Layer (`src/utils/`)
- Environment variable management
- Logging utilities
- Helper functions

### 5. Type Layer (`src/types/`)
- TypeScript type definitions
- Interface definitions
- Type exports

## Data Flow

```
Storyblok CMS
    ↓
API Request (fetchStory/fetchStories)
    ↓
lib/storyblok/storyblok.ts
    ↓
app/page.tsx (Server Component)
    ↓
StoryblokRenderer
    ↓
StoryblokServerComponent
    ↓
Component Registry (COMPONENTS)
    ↓
Storyblok Components (Page, Grid, etc.)
    ↓
Nested Components (recursive)
    ↓
HTML Output
```

## Component Resolution

1. Storyblok returns JSON with `component` field
2. `StoryblokServerComponent` looks up component in registry
3. Registry maps component name to React component
4. Component renders with `blok` data
5. Nested components resolved recursively

## Server vs Client Components

### Server Components (Default)
- Data fetching
- Static content
- Better performance
- SEO-friendly
- Can use `StoryblokServerComponent`

### Client Components (`'use client'`)
- Interactivity
- Browser APIs
- React hooks
- Event handlers
- Cannot use `StoryblokServerComponent` directly

## Environment Management

All environment variables accessed through `utils/env.ts`:
- Type-safe access
- Validation
- Default values
- Development warnings

## Logging System

Centralized logging via `utils/logger.ts`:
- `logger.info()` - General information
- `logger.warn()` - Warnings
- `logger.error()` - Errors
- `logger.debug()` - Debug info (server-only)

## Caching Strategy

- **Published content**: Cached with Next.js cache
- **Draft content**: No cache (`no-store`)
- Cache tags for revalidation
- ISR support for static pages

## Error Handling

- Try-catch blocks for async operations
- Fallback components for missing Storyblok components
- Graceful degradation
- User-friendly error messages

## Performance Optimizations

- Server Components for better performance
- Image optimization with Next.js Image
- Code splitting
- Lazy loading
- Static generation where possible

## Security

- Environment variables for sensitive data
- No client-side token exposure
- Input validation
- XSS protection via React

## Deployment

- Optimized for Vercel
- Compatible with any Next.js hosting
- Environment variable configuration
- Build-time optimizations

