---
applyTo: '**'
---
# Next.js 14 + App Router + shadcn/ui Template - Premium Design System

## CRITICAL RULES - READ FIRST

### NEVER CREATE:
- **Monolithic components** over 300 lines
- **Copy-pasted code** - extract to reusable functions/hooks
- **Inline API calls** in components - use service layer
- **Poor accessibility** - maintain WCAG 2.1 AA contrast (4.5:1 minimum)
- **Generic designs** - always adapt to target industry/audience
- **Unnecessary Client Components** - default to Server Components

### ALWAYS CREATE:
- **Focused components** (20-100 lines, single responsibility)
- **Custom hooks** for reusable logic
- **Composition patterns** - build complex UI from smaller parts
- **Shared types** in `lib/types.ts` 
- **Premium designs** with sophisticated animations and visual hierarchy
- **Server Components by default** - use 'use client' only when necessary

## Essential Commands
```bash
npm run dev          # Start development server (port 3000)
npm run build        # Production build  
npm run start        # Start production server
npm run lint         # Run ESLint - MUST pass before shipping
npm run lint:fix     # Run ESLint with auto-fix
```

## DETAILED GUIDELINES

This project uses a modular instruction system. For comprehensive guidance, see:

- **[Architecture Guidelines](./architecture.instructions.md)** - App Router structure, component organization, Server vs Client components
- **[Design Guidelines](./design.instructions.md)** - Visual design system, industry-specific styling, accessibility, and premium UI patterns
- **[Development Workflow](./development.instructions.md)** - Commands, configuration, testing, and quality standards
- **[Component Guidelines](./components.instructions.md)** - UI, common, and feature component patterns
- **[Hooks Guidelines](./hooks.instructions.md)** - Custom hook patterns for data, forms, and UI state
- **[App Router Guidelines](./app-router.instructions.md)** - App Router patterns, routing, layouts, and data fetching
- **[API Guidelines](./api.instructions.md)** - Route handlers, data fetching, and API patterns
- **[Library Guidelines](./lib.instructions.md)** - Utilities, types, constants, and service layer patterns
- **[Quality Checklist](./quality.instructions.md)** - Code quality, design standards, and never-ship rules

## Tech Stack Overview

### Project Overview
- **Framework**: Next.js 14.2.x with App Router and TypeScript
- **UI Library**: React 18.3.x
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS with custom theme
- **State Management**: TanStack Query for client-side state
- **Form Handling**: React Hook Form + Zod validation
- **Image Optimization**: Next.js Image component
- **Font Optimization**: Next.js Font optimization

### Key Next.js 14 Features
- **App Router**: File-system based routing with layouts
- **Server Components**: Default server-side rendering
- **Streaming**: Progressive page loading with Suspense
- **Route Handlers**: API routes in app/api directory
- **Metadata API**: Built-in SEO and social sharing support
- **Performance**: Automatic code splitting and optimization

## Architecture Fundamentals

### App Router Structure
```
app/
├── layout.tsx          # Root layout (required)
├── page.tsx           # Home page (/)
├── loading.tsx        # Loading UI
├── error.tsx          # Error boundaries
├── not-found.tsx      # 404 page
├── globals.css        # Global styles
├── (dashboard)/       # Route groups
│   ├── layout.tsx     # Dashboard layout
│   └── page.tsx       # /dashboard
└── api/              # API routes
    └── route.ts       # /api endpoint
```

### Server vs Client Components
- **Server Components** (default): Better performance, SEO, no JavaScript bundle
- **Client Components**: Interactive features requiring 'use client' directive
- **Decision Rule**: Use Server Components unless you need browser APIs, state, or event handlers

### Import Aliases
```typescript
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { User } from '@/lib/types'
```

## Quality Standards

### NEVER SHIP WITHOUT:
1. **ESLint passes** - `npm run lint` must show 0 errors
2. **TypeScript strict mode** - No `any` types
3. **Accessibility tested** - Screen reader and keyboard navigation
4. **Mobile responsive** - Test on multiple screen sizes
5. **Performance optimized** - Use Next.js Image, Font, and code splitting

### Code Organization Rules
1. **Component size limit**: Maximum 300 lines
2. **Single responsibility**: One component, one purpose
3. **Extract reusable logic**: Custom hooks over duplication
4. **Composition over complexity**: Build from smaller components
5. **Type safety**: Use TypeScript interfaces and Zod schemas

## Development Workflow

### Getting Started
1. Install dependencies: `npm install`
2. Start development: `npm run dev`
3. Open browser: `http://localhost:3000`

### Before Committing
1. Run linter: `npm run lint`
2. Fix any errors: `npm run lint:fix`
3. Build test: `npm run build`
4. Check TypeScript: Ensure no type errors
