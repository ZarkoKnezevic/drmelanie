---
applyTo: '**'
---
# Next.js 14 Development Workflow Guidelines

## CRITICAL DEVELOPMENT RULES

### NEVER:
- Ship without running `npm run lint` - must pass with 0 errors
- Use `any` types in TypeScript - maintain strict type safety
- Skip accessibility testing - always check keyboard navigation and screen readers
- Ignore bundle size - monitor and optimize performance regularly
- Deploy without testing on mobile devices
- Use old patterns from pages directory - embrace App Router

### ALWAYS:
- Run `npm run lint` before committing any code
- Test responsive design on multiple screen sizes
- Implement proper error boundaries and loading states
- Use TypeScript strict mode with comprehensive interfaces
- Optimize images with Next.js Image component
- Follow App Router patterns and conventions

## Essential Commands

### Development Commands
```bash
# Start development server
npm run dev              # Port 3000 (default)

# Production build and test
npm run build           # Create optimized production build
npm run start           # Start production server
npm run preview         # Preview production build locally

# Code quality
npm run lint            # Run ESLint - MUST pass before shipping
npm run lint:fix        # Auto-fix ESLint issues
npm run type-check      # Run TypeScript type checking

# Package management
npm install             # Install dependencies
bun install            # Faster alternative with Bun
```

### Build Analysis
```bash
# Bundle analysis (add to package.json)
npm run analyze         # Analyze bundle size
npm run build:analyze   # Build with bundle analyzer
```

## Next.js 14 Configuration

### 1. next.config.js Setup
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable App Router (default in Next.js 14)
  experimental: {
    // Enable if needed for specific features
  },
  
  // Image optimization
  images: {
    domains: ['example.com', 'cdn.example.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // TypeScript configuration
  typescript: {
    // Only enable during development for faster builds
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  
  // ESLint configuration
  eslint: {
    // Only run ESLint on these directories
    dirs: ['app', 'components', 'lib', 'hooks'],
  },
}

module.exports = nextConfig
```

### 2. TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/app/*": ["./app/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

### 3. Package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "analyze": "cross-env ANALYZE=true next build",
    "build:analyze": "npm run build && npx @next/bundle-analyzer .next",
    "test": "jest",
    "test:watch": "jest --watch",
    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui"
  }
}
```

## Environment Configuration

### 1. Environment Variables
```bash
# .env.local (local development)
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# External APIs
STRIPE_SECRET_KEY="sk_..."
OPENAI_API_KEY="sk-..."

# Public variables (accessible in browser)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
```

```bash
# .env.example (committed to git)
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/database"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# External Services
STRIPE_SECRET_KEY="sk_test_..."
OPENAI_API_KEY="sk-..."

# Public Environment Variables
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### 2. Environment Type Safety
```typescript
// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_'),
})

export const env = envSchema.parse(process.env)
```

## Code Quality Standards

### 1. ESLint Configuration
```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/prefer-const": "error",
    "react/no-unescaped-entities": "off",
    "react/display-name": "off",
    "@next/next/no-img-element": "error",
    "prefer-const": "error",
    "no-var": "error"
  },
  "ignorePatterns": [
    "node_modules/",
    ".next/",
    "dist/",
    "build/"
  ]
}
```

### 2. Prettier Configuration
```json
// .prettierrc
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 80,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid"
}
```

## Testing Setup

### 1. Jest Configuration
```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    // Handle module aliases (this will match tsconfig.json paths)
    '^@/(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
```

### 2. Testing Library Setup
```javascript
// jest.setup.js
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return ''
  },
}))
```

## Performance Optimization

### 1. Bundle Analysis
```javascript
// next.config.js with bundle analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // Your Next.js config
})
```

### 2. Image Optimization
```tsx
// components/OptimizedImage.tsx
import Image from 'next/image'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
  className?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0eH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/2gAMAwEAAhEDEQA/AKrQjF0c/9k="
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}
```

### 3. Font Optimization
```tsx
// app/layout.tsx
import { Inter, Playfair_Display } from 'next/font/google'

// Optimize font loading
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  preload: false, // Only preload primary font
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
```

## Development Best Practices

### 1. Component Development
```tsx
// Always include proper TypeScript interfaces
interface ComponentProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  onAction?: () => void
}

// Use Server Components by default
export function ServerComponent({ title, description, children }: ComponentProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      {description && <p className="text-muted-foreground">{description}</p>}
      {children}
    </div>
  )
}

// Use Client Components only when needed
'use client'
export function ClientComponent({ onAction }: { onAction: () => void }) {
  const [state, setState] = useState(false)
  
  return (
    <button onClick={onAction}>
      Interactive Button
    </button>
  )
}
```

### 2. API Route Development
```tsx
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = CreateUserSchema.parse(body)
    
    // Process the request
    const user = await createUser(validatedData)
    
    return NextResponse.json({
      data: user,
      success: true,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 3. Error Handling
```tsx
// app/error.tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="text-muted-foreground text-center max-w-md">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
```

## Deployment Checklist

### Pre-Deployment Steps
1. **Code Quality**
   - [ ] `npm run lint` passes with 0 errors
   - [ ] `npm run type-check` passes
   - [ ] All tests pass
   - [ ] Code review completed

2. **Performance**
   - [ ] Bundle size analyzed and optimized
   - [ ] Images optimized with Next.js Image
   - [ ] Fonts optimized with Next.js Font
   - [ ] Core Web Vitals tested

3. **Accessibility**
   - [ ] Keyboard navigation tested
   - [ ] Screen reader compatibility checked
   - [ ] Color contrast ratios verified (4.5:1 minimum)
   - [ ] Alt text added to all images

4. **Responsive Design**
   - [ ] Tested on mobile devices
   - [ ] Tested on tablet devices
   - [ ] Tested on desktop
   - [ ] Works in portrait and landscape

5. **Environment**
   - [ ] Environment variables configured
   - [ ] Database migrations completed
   - [ ] API endpoints tested
   - [ ] Error handling verified

### Production Configuration
```javascript
// next.config.js for production
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable compression
  compress: true,
  
  // Security headers
  poweredByHeader: false,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
  },
  
  // Performance optimizations
  experimental: {
    optimizeCss: true,
  },
  
  // Error handling
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
```

## Monitoring and Analytics

### 1. Performance Monitoring
```tsx
// lib/analytics.ts
export function reportWebVitals(metric: any) {
  // Log to analytics service
  console.log(metric)
  
  // Send to external service
  if (typeof window !== 'undefined') {
    // Analytics implementation
  }
}
```

### 2. Error Tracking
```tsx
// lib/error-tracking.ts
export function logError(error: Error, context?: any) {
  console.error('Error:', error)
  
  // Send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Sentry, LogRocket, etc.
  }
}
```

## Development Workflow Summary

1. **Setup** - Configure Next.js 14, TypeScript, ESLint, Prettier
2. **Development** - Use App Router, Server Components first, proper TypeScript
3. **Testing** - Unit tests, integration tests, accessibility testing
4. **Quality** - Linting, type checking, performance optimization
5. **Deployment** - Pre-deployment checklist, monitoring setup
6. **Maintenance** - Regular updates, performance monitoring, error tracking

Remember: **Never ship without passing `npm run lint`** and testing on multiple devices!
