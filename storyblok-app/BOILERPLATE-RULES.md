# Next.js + Storyblok Boilerplate Rules & Conventions

This document outlines the coding standards, folder structure, and best practices for this Next.js + Storyblok project.

## 📁 Folder Structure

```
storyblok-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # React components
│   │   ├── storyblok/         # Storyblok-specific components
│   │   └── ...                # Shared components
│   ├── lib/                   # Library code (API clients, configs)
│   │   └── storyblok/         # Storyblok API utilities
│   ├── hooks/                 # Custom React hooks
│   ├── utils/                 # Utility functions
│   ├── types/                 # TypeScript type definitions
│   └── constants/             # Application constants
└── public/                    # Static assets
```

## 🎯 Naming Conventions

### Files & Folders
- **Components**: PascalCase (e.g., `StoryblokRenderer.tsx`)
- **Utilities**: camelCase (e.g., `env.ts`, `logger.ts`)
- **Hooks**: camelCase with `use` prefix (e.g., `useStoryblok.ts`)
- **Types**: camelCase (e.g., `index.ts`)
- **Constants**: camelCase (e.g., `index.ts`)

### Code
- **Components**: PascalCase
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE (for true constants) or camelCase (for config objects)
- **Types/Interfaces**: PascalCase

## 📝 Code Style Rules

### TypeScript
- ✅ Always use TypeScript (`.ts` or `.tsx`)
- ✅ Use strict mode
- ✅ Define types/interfaces in `types/` folder
- ✅ Use interfaces for object shapes, types for unions/primitives
- ✅ Avoid `any` - use `unknown` or proper types

### Imports
```typescript
// 1. External libraries
import { NextConfig } from 'next';
import { StoryblokClient } from '@storyblok/js';

// 2. Internal utilities/types
import { env } from '@/utils/env';
import { logger } from '@/utils/logger';
import type { StoryblokBlok } from '@/types';

// 3. Components
import StoryblokRenderer from '@/components/StoryblokRenderer';
```

### Components
- ✅ Use functional components with TypeScript
- ✅ Define props interfaces
- ✅ Use server components by default
- ✅ Only use `'use client'` when necessary (hooks, browser APIs, interactivity)

### Error Handling
- ✅ Use try-catch for async operations
- ✅ Use logger utility instead of console.log
- ✅ Provide helpful error messages
- ✅ Handle edge cases gracefully

## 🔧 Configuration Files

### ESLint
- Located in `eslint.config.mjs`
- Uses Next.js recommended rules
- Extends `eslint-config-next`

### Prettier
- Located in `.prettierrc`
- Enforces consistent code formatting
- Run `npm run format` before committing

### TypeScript
- Located in `tsconfig.json`
- Uses strict mode
- Path aliases: `@/*` maps to `src/*`

## 🚀 Best Practices

### 1. Environment Variables
- Use `utils/env.ts` for type-safe access
- Never access `process.env` directly
- Validate required variables

### 2. Logging
- Use `logger` utility from `utils/logger.ts`
- Different log levels: `info`, `warn`, `error`, `debug`
- Server-only logs when needed

### 3. Component Organization
- Keep components small and focused
- Extract reusable logic to hooks
- Use barrel exports (`index.ts`) for clean imports

### 4. Type Safety
- Define types in `types/` folder
- Export types from `types/index.ts`
- Use type imports: `import type { ... }`

### 5. Constants
- Store constants in `constants/` folder
- Use `as const` for immutable values
- Group related constants together

## 📦 Package Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run format:check # Check formatting
npm run type-check   # TypeScript type checking
```

## 🔍 Code Review Checklist

- [ ] Types are properly defined
- [ ] No `any` types (unless absolutely necessary)
- [ ] Error handling is in place
- [ ] Uses logger instead of console.log
- [ ] Follows naming conventions
- [ ] Imports are organized correctly
- [ ] Code is formatted with Prettier
- [ ] No ESLint errors
- [ ] Server/client component boundaries are correct
- [ ] Environment variables use `env` utility

## 🎨 Storyblok-Specific Rules

### Component Registration
- All Storyblok components must be registered in `src/constants/storyblok-components.tsx`
- Register both lowercase and capitalized versions for case-insensitivity
- Components should be in `src/components/storyblok/` folder

### Component Structure
- Server components by default (no `'use client'`)
- Use `StoryblokServerComponent` for nested rendering
- Use `storyblokEditable` for visual editor support
- Handle missing components gracefully

### Data Fetching
- Use `lib/storyblok/storyblok.ts` functions for API calls
- Always handle errors
- Use proper TypeScript types for Storyblok data
- Use `fetchStory` for single stories, `fetchStories` for multiple

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Storyblok React SDK](https://www.storyblok.com/docs/guide/getting-started/quick-setup)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

