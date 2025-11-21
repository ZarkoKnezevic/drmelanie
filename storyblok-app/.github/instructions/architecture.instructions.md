---
applyTo: '{app,components,lib,hooks}/**/*.{tsx,ts}'
---
# Next.js 14 App Router Architecture & Reusability Guidelines

## CRITICAL ARCHITECTURE RULES

### NEVER CREATE:
- Components over 300 lines
- Duplicate logic across components
- Inline API calls in UI components
- Mixed concerns (UI + business logic + API)
- Copy-pasted code blocks
- Unnecessary Client Components

### ALWAYS CREATE:
- Single-responsibility components (20-100 lines)
- Custom hooks for reusable client-side logic
- Service layer for API calls
- Shared types in `lib/types.ts`
- Composition patterns from smaller components
- Server Components by default

## Next.js 14 App Router Architecture

### 1. App Router File Structure
```
app/
├── layout.tsx          # Root layout (Server Component)
├── page.tsx           # Home page (Server Component)
├── loading.tsx        # Loading UI (Server Component)
├── error.tsx          # Error boundaries (Client Component)
├── not-found.tsx      # 404 page (Server Component)
├── globals.css        # Global styles
├── (dashboard)/       # Route groups
│   ├── layout.tsx     # Dashboard layout
│   ├── page.tsx       # /dashboard
│   └── settings/
│       └── page.tsx   # /dashboard/settings
└── api/              # Route handlers
    └── users/
        └── route.ts   # /api/users endpoint
```

### 2. Server vs Client Component Strategy
```tsx
// ✅ Server Component (default) - No 'use client' needed
export default async function UserProfile({ userId }: { userId: string }) {
  // Direct data fetching in Server Components
  const user = await getUserById(userId)
  
  return (
    <div className="space-y-6">
      <UserHeader user={user} />
      <UserStats userId={userId} />
      <UserInteractiveSection userId={userId} />
    </div>
  )
}

// ✅ Client Component - Only when needed for interactivity
'use client'
export function UserInteractiveSection({ userId }: { userId: string }) {
  const [isEditing, setIsEditing] = useState(false)
  
  return (
    <Card>
      <Button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Save' : 'Edit'}
      </Button>
      {isEditing && <UserEditForm userId={userId} />}
    </Card>
  )
}
```

### 3. Data Fetching Patterns
```tsx
// ✅ Server Component data fetching
export default async function PostsPage() {
  // Direct async/await in Server Components
  const posts = await fetch('https://api.example.com/posts').then(res => res.json())
  
  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

// ✅ Client Component data fetching with TanStack Query
'use client'
export function PostsList() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => postService.getPosts()
  })
  
  if (isLoading) return <PostsSkeleton />
  
  return (
    <div>
      {posts?.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
```

## Component Composition Over Monoliths

### NEVER create large, monolithic components:
```tsx
// ❌ Wrong: Monolithic page component
export default function Dashboard() {
  // 300+ lines mixing Server and Client logic
  return <div>{/* massive JSX with mixed concerns */}</div>
}
```

### ALWAYS break down into focused components:
```tsx
// ✅ Correct: Composed from focused components
export default async function Dashboard() {
  const stats = await getDashboardStats()
  
  return (
    <DashboardLayout>
      <DashboardHeader />
      <DashboardStats stats={stats} />
      <DashboardCharts />
      <DashboardActivity />
    </DashboardLayout>
  )
}

// ✅ Server Component for static data
export function DashboardStats({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map(stat => (
        <StatsCard key={stat.id} {...stat} />
      ))}
    </div>
  )
}

// ✅ Client Component only for interactivity
'use client'
export function DashboardCharts() {
  const [timeRange, setTimeRange] = useState('7d')
  
  return (
    <Card>
      <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      <Chart timeRange={timeRange} />
    </Card>
  )
}
```

## Layout and Route Organization

### 1. Nested Layouts Pattern
```tsx
// app/layout.tsx - Root layout
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  )
}

// app/(dashboard)/layout.tsx - Dashboard layout
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <DashboardHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
```

### 2. Loading and Error Boundaries
```tsx
// app/loading.tsx - Loading UI
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
    </div>
  )
}

// app/error.tsx - Error boundary (must be Client Component)
'use client'
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <Button onClick={reset} className="mt-4">
          Try again
        </Button>
      </div>
    </div>
  )
}
```

## Custom Hook Patterns for Client Components

### 1. Data Fetching Hooks
```tsx
// hooks/useUsers.ts
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUser(id),
    enabled: !!id,
  })
}
```

### 2. Form Hooks
```tsx
// hooks/useUserForm.ts
export function useUserForm(initialData?: Partial<User>) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData || {
      name: '',
      email: '',
      role: 'user',
    },
  })

  const { mutate: updateUser, isPending } = useMutation({
    mutationFn: userService.updateUser,
    onSuccess: () => {
      toast({ title: "User updated successfully" })
    },
  })

  return {
    form,
    onSubmit: form.handleSubmit((data) => updateUser(data)),
    isPending,
  }
}
```

## Service Layer for API Calls

### 1. Server-Side Services
```tsx
// lib/services/userService.ts
export const userService = {
  // Server-side API calls (for Server Components)
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${process.env.API_URL}/users`, {
      headers: { 
        'Authorization': `Bearer ${process.env.API_TOKEN}` 
      },
    })
    if (!response.ok) throw new Error('Failed to fetch users')
    return response.json()
  },

  // Client-side API calls (for Client Components)
  async getUsersClient(): Promise<User[]> {
    const response = await fetch('/api/users')
    if (!response.ok) throw new Error('Failed to fetch users')
    return response.json()
  },
}
```

### 2. Route Handlers (API Routes)
```tsx
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const users = await userService.getUsers()
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()
    const user = await userService.createUser(userData)
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
```

## Shared Type Definitions

```tsx
// lib/types.ts - Shared application types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export type UserRole = 'admin' | 'user' | 'guest'
export type Theme = 'light' | 'dark' | 'system'

// Next.js specific types
export interface PageProps {
  params: { [key: string]: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export interface LayoutProps {
  children: React.ReactNode
  params: { [key: string]: string }
}
```

## Performance Optimization Patterns

### 1. Dynamic Imports for Code Splitting
```tsx
// Dynamic import for heavy components
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // Disable SSR if needed
})

export default function Dashboard() {
  return (
    <div>
      <DashboardHeader />
      <HeavyChart />
    </div>
  )
}
```

### 2. Image Optimization
```tsx
import Image from 'next/image'

export function UserAvatar({ user }: { user: User }) {
  return (
    <Image
      src={user.avatar || '/default-avatar.png'}
      alt={`${user.name}'s avatar`}
      width={40}
      height={40}
      className="rounded-full"
      priority={false} // Only true for above-the-fold images
    />
  )
}
```

### 3. Metadata Generation
```tsx
// app/users/[id]/page.tsx
import type { Metadata } from 'next'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await getUserById(params.id)
  
  return {
    title: `${user.name} - User Profile`,
    description: `View ${user.name}'s profile and information`,
    openGraph: {
      title: `${user.name} - User Profile`,
      description: `View ${user.name}'s profile and information`,
      images: [user.avatar],
    },
  }
}
```

## Component Organization Rules

1. **Maximum 300 lines per component**
2. **Single responsibility principle**
3. **Extract reusable logic to hooks**
4. **Use composition over inheritance**
5. **Default to Server Components**
6. **Use Client Components only when needed**
7. **Implement proper error boundaries**
8. **Add loading states for async operations**
