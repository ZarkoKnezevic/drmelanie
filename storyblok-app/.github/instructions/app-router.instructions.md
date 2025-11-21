---
applyTo: 'app/**/*.{tsx,ts}'
---
# Next.js 14 App Router Guidelines

## CRITICAL APP ROUTER RULES

### NEVER:
- Mix Server and Client Component logic in the same file
- Use 'use client' unnecessarily - default to Server Components
- Forget to handle loading and error states
- Create API routes outside the app/api directory
- Use old pages directory patterns

### ALWAYS:
- Default to Server Components for better performance
- Use 'use client' only when you need interactivity
- Implement proper loading.tsx and error.tsx files
- Follow the file-system based routing conventions
- Use route groups for organization

## App Router File Conventions

### 1. Special Files
```
app/
├── layout.tsx          # Required root layout
├── page.tsx           # Page component (/)
├── loading.tsx        # Loading UI
├── error.tsx          # Error boundary (must be Client Component)
├── not-found.tsx      # 404 page
├── global-error.tsx   # Global error boundary
├── route.ts           # API route handler
├── template.tsx       # Re-rendered layout
└── default.tsx        # Parallel route fallback
```

### 2. Route Groups and Organization
```
app/
├── (marketing)/       # Route group (doesn't affect URL)
│   ├── layout.tsx     # Marketing layout
│   ├── page.tsx       # / (home page)
│   └── about/
│       └── page.tsx   # /about
├── (dashboard)/       # Another route group
│   ├── layout.tsx     # Dashboard layout
│   ├── dashboard/
│   │   └── page.tsx   # /dashboard
│   └── settings/
│       └── page.tsx   # /settings
└── api/              # API routes
    └── users/
        └── route.ts   # /api/users
```

## Server Components vs Client Components

### 1. Server Components (Default)
```tsx
// No 'use client' directive needed
export default async function UserProfile({ params }: { params: { id: string } }) {
  // Direct data fetching in Server Components
  const user = await fetch(`https://api.example.com/users/${params.id}`)
    .then(res => res.json())
  
  // Server Components can:
  // - Fetch data directly
  // - Access server-side resources
  // - Render on the server
  // - Automatically code split
  
  return (
    <div className="space-y-6">
      <UserHeader user={user} />
      <UserPosts userId={params.id} />
      <UserInteractions userId={params.id} /> {/* This can be a Client Component */}
    </div>
  )
}

// ✅ Server Component best practices
async function UserPosts({ userId }: { userId: string }) {
  const posts = await getUserPosts(userId)
  
  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
```

### 2. Client Components (When Needed)
```tsx
'use client' // Required directive

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

// Client Components when you need:
// - State (useState, useReducer)
// - Event handlers (onClick, onChange)
// - Browser APIs (localStorage, geolocation)
// - Custom hooks
// - Third-party libraries requiring client-side JS

export function UserInteractions({ userId }: { userId: string }) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const handleFollow = async () => {
    setIsLoading(true)
    try {
      await fetch(`/api/users/${userId}/follow`, { method: 'POST' })
      setIsFollowing(!isFollowing)
    } catch (error) {
      console.error('Failed to follow user:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Button 
      onClick={handleFollow} 
      disabled={isLoading}
      variant={isFollowing ? "outline" : "default"}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  )
}
```

## Layouts and Templates

### 1. Root Layout (Required)
```tsx
// app/layout.tsx - Must be present
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My App',
  description: 'App description',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <header>
            <Navigation />
          </header>
          <main>{children}</main>
          <footer>
            <Footer />
          </footer>
        </div>
      </body>
    </html>
  )
}
```

### 2. Nested Layouts
```tsx
// app/(dashboard)/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100">
        <DashboardSidebar />
      </aside>
      <div className="flex-1">
        <nav className="border-b">
          <DashboardHeader />
        </nav>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
```

### 3. Templates (Re-render on Navigation)
```tsx
// app/template.tsx - Re-renders on every route change
'use client'

import { useEffect } from 'react'

export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // This runs on every route change
    console.log('Route changed')
  }, [])

  return <div className="template-wrapper">{children}</div>
}
```

## Data Fetching Patterns

### 1. Server Component Data Fetching
```tsx
// Fetch data directly in Server Components
export default async function PostsPage() {
  // Sequential fetching
  const posts = await fetch('https://api.example.com/posts')
    .then(res => res.json())
  
  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

// Parallel fetching
export default async function UserDashboard({ params }: { params: { id: string } }) {
  // Fetch multiple data sources in parallel
  const [user, posts, stats] = await Promise.all([
    getUserById(params.id),
    getUserPosts(params.id),
    getUserStats(params.id),
  ])
  
  return (
    <div>
      <UserHeader user={user} />
      <UserStats stats={stats} />
      <UserPosts posts={posts} />
    </div>
  )
}
```

### 2. Streaming with Suspense
```tsx
import { Suspense } from 'react'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      
      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards />
      </Suspense>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<ChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        
        <Suspense fallback={<ActivitySkeleton />}>
          <RecentActivity />
        </Suspense>
      </div>
    </div>
  )
}

// These components can fetch data independently
async function StatsCards() {
  const stats = await getStats()
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map(stat => (
        <StatsCard key={stat.id} {...stat} />
      ))}
    </div>
  )
}
```

## Loading and Error States

### 1. Loading UI
```tsx
// app/loading.tsx - Shows while page is loading
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="space-y-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

// app/dashboard/loading.tsx - Dashboard-specific loading
export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-gray-200 rounded animate-pulse" />
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    </div>
  )
}
```

### 2. Error Boundaries
```tsx
// app/error.tsx - Must be a Client Component
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
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-muted-foreground">
          {error.message || 'An unexpected error occurred'}
        </p>
        <Button onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  )
}

// app/global-error.tsx - Global error boundary
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Application Error</h2>
            <Button onClick={reset}>Try again</Button>
          </div>
        </div>
      </body>
    </html>
  )
}
```

## API Routes (Route Handlers)

### 1. Basic Route Handlers
```tsx
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    
    const users = await getUsersFromDatabase(parseInt(page))
    
    return NextResponse.json({
      data: users,
      success: true,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = CreateUserSchema.parse(body)
    
    const user = await createUserInDatabase(validatedData)
    
    return NextResponse.json(
      { data: user, success: true },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors, success: false },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create user', success: false },
      { status: 500 }
    )
  }
}
```

### 2. Dynamic Route Handlers
```tsx
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserById(params.id)
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found', success: false },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      data: user,
      success: true,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user', success: false },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const user = await updateUserInDatabase(params.id, body)
    
    return NextResponse.json({
      data: user,
      success: true,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update user', success: false },
      { status: 500 }
    )
  }
}
```

## Metadata and SEO

### 1. Static Metadata
```tsx
// app/about/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about our company and mission',
  openGraph: {
    title: 'About Us',
    description: 'Learn more about our company and mission',
    images: ['/about-og-image.jpg'],
  },
}

export default function AboutPage() {
  return <div>About content</div>
}
```

### 2. Dynamic Metadata
```tsx
// app/posts/[id]/page.tsx
import type { Metadata } from 'next'

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostById(params.id)
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
  }
}

export default async function PostPage({ params }: Props) {
  const post = await getPostById(params.id)
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
```

## Best Practices Summary

1. **Default to Server Components** - Better performance and SEO
2. **Use Client Components sparingly** - Only when you need interactivity
3. **Implement proper loading states** - loading.tsx for each route
4. **Handle errors gracefully** - error.tsx boundaries
5. **Optimize data fetching** - Use parallel fetching and streaming
6. **Follow file conventions** - Use standard file names and locations
7. **Organize with route groups** - Keep related routes together
8. **Generate metadata properly** - For SEO and social sharing
9. **Use TypeScript strictly** - Type your props and API responses
10. **Test different loading scenarios** - Ensure good UX at all network speeds
