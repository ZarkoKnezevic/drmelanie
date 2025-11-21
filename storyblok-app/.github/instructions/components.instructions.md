---
applyTo: 'components/**/*.{tsx,ts}'
---
# Next.js 14 Component Guidelines

## COMPONENT ARCHITECTURE RULES

### UI Components (`components/ui/`)
- **READ-ONLY**: Never modify shadcn/ui components directly
- **EXTEND**: Create wrapper components in `components/common/`
- **COMPOSE**: Build complex UI by combining multiple ui components

### Common Components (`components/common/`)
- **REUSABLE**: Components used across multiple features
- **GENERIC**: Should accept flexible props for different use cases
- **DOCUMENTED**: Include clear prop interfaces and examples
- **DEFAULT SERVER**: Use Server Components unless interactivity required

### Feature Components (`components/features/`)
- **SPECIFIC**: Components tied to particular business features
- **COMPOSED**: Build from smaller ui and common components
- **SINGLE PURPOSE**: One feature concern per component
- **SMART MIXING**: Combine Server and Client Components strategically

### Layout Components (`components/layout/`)
- **STRUCTURAL**: Header, Footer, Sidebar, Navigation components
- **MOSTLY SERVER**: Server Components for static layouts
- **CLIENT WHEN NEEDED**: Use 'use client' for interactive navigation

## Server vs Client Component Guidelines

### 1. Server Components (Default)
```tsx
// ✅ Server Component - No 'use client' needed
interface UserProfileProps {
  userId: string
}

export async function UserProfile({ userId }: UserProfileProps) {
  // Direct data fetching in Server Components
  const user = await getUserById(userId)
  const posts = await getUserPosts(userId)
  
  return (
    <div className="space-y-6">
      <UserHeader user={user} />
      <UserStats stats={user.stats} />
      <UserPosts posts={posts} />
      <UserActions userId={userId} /> {/* This can be Client Component */}
    </div>
  )
}

// ✅ Server Component for static content
export function UserHeader({ user }: { user: User }) {
  return (
    <div className="flex items-center space-x-4">
      <Image
        src={user.avatar || '/default-avatar.png'}
        alt={`${user.name}'s avatar`}
        width={64}
        height={64}
        className="rounded-full"
      />
      <div>
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>
    </div>
  )
}
```

### 2. Client Components (When Needed)
```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

// ✅ Client Component for interactivity
export function UserActions({ userId }: { userId: string }) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  
  const handleFollow = async () => {
    setIsLoading(true)
    try {
      await fetch(`/api/users/${userId}/follow`, { method: 'POST' })
      setIsFollowing(!isFollowing)
      toast({
        title: isFollowing ? 'Unfollowed' : 'Following',
        description: `You are now ${isFollowing ? 'not following' : 'following'} this user.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update follow status.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="flex gap-2">
      <Button 
        onClick={handleFollow} 
        disabled={isLoading}
        variant={isFollowing ? "outline" : "default"}
      >
        {isFollowing ? 'Unfollow' : 'Follow'}
      </Button>
      <Button variant="outline">
        Message
      </Button>
    </div>
  )
}
```

## Component Size Limits

### NEVER Create Monolithic Components
```tsx
// ❌ BAD: Monolithic component over 300 lines
'use client'
export function UserDashboard({ userId }: { userId: string }) {
  // 300+ lines mixing multiple concerns
  // - User profile display
  // - Posts management
  // - Settings forms
  // - Chat functionality
  // etc.
}
```

### ALWAYS Create Focused Components
```tsx
// ✅ GOOD: Focused, single-purpose components (20-100 lines)
export async function UserDashboard({ userId }: { userId: string }) {
  return (
    <DashboardLayout>
      <UserProfileSection userId={userId} />
      <UserPostsSection userId={userId} />
      <UserSettingsSection userId={userId} />
      <UserChatSection userId={userId} />
    </DashboardLayout>
  )
}

// Each section is a focused component
export async function UserProfileSection({ userId }: { userId: string }) {
  const user = await getUserById(userId)
  
  return (
    <Card className="p-6">
      <UserAvatar user={user} />
      <UserInfo user={user} />
      <UserActions userId={userId} />
    </Card>
  )
}
```

## Composition Patterns

### 1. Layout Composition
```tsx
// ✅ Server Component layout
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

// ✅ Client Component for interactive navigation
'use client'
export function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  return (
    <aside className={cn(
      "border-r bg-background transition-all",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <ChevronLeft className={cn(
          "h-4 w-4 transition-transform",
          isCollapsed && "rotate-180"
        )} />
      </Button>
      <SidebarContent isCollapsed={isCollapsed} />
    </aside>
  )
}
```

### 2. Data Display Patterns
```tsx
// ✅ Server Component for data fetching and display
export async function PostsList({ userId }: { userId: string }) {
  const posts = await getUserPosts(userId)
  
  if (posts.length === 0) {
    return <EmptyState message="No posts yet" />
  }
  
  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
      <LoadMorePosts userId={userId} />
    </div>
  )
}

// ✅ Server Component for static post display
export function PostCard({ post }: { post: Post }) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold">{post.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {post.excerpt}
          </p>
          <PostMeta post={post} />
        </div>
        <PostActions postId={post.id} />
      </div>
    </Card>
  )
}

// ✅ Client Component for interactive actions
'use client'
export function PostActions({ postId }: { postId: string }) {
  const [isLiked, setIsLiked] = useState(false)
  
  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsLiked(!isLiked)}
      >
        <Heart className={cn(
          "h-4 w-4",
          isLiked && "fill-red-500 text-red-500"
        )} />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Share</DropdownMenuItem>
          <DropdownMenuItem>Report</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
```

## Form Components

### 1. Form Structure
```tsx
// ✅ Client Component for forms (interactive)
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  bio: z.string().optional(),
})

type UserFormData = z.infer<typeof userSchema>

export function UserEditForm({ user }: { user: User }) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      bio: user.bio,
    },
  })
  
  const onSubmit = async (data: UserFormData) => {
    try {
      await updateUser(user.id, data)
      toast({ title: 'Profile updated successfully' })
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to update profile',
        variant: 'destructive' 
      })
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Save Changes
        </Button>
      </form>
    </Form>
  )
}
```

## Loading and Error Components

### 1. Loading Components
```tsx
// ✅ Server Component loading skeletons
export function PostCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </Card>
  )
}

export function PostsListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  )
}
```

### 2. Error Components
```tsx
'use client'

import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorDisplayProps {
  error: Error
  reset?: () => void
  title?: string
}

export function ErrorDisplay({ 
  error, 
  reset, 
  title = 'Something went wrong' 
}: ErrorDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-4 max-w-md">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      {reset && (
        <Button onClick={reset} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  )
}
```

## Image Optimization Components

### 1. Optimized Image Components
```tsx
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
}

export function OptimizedImage({
  src,
  alt,
  width = 400,
  height = 300,
  className,
  priority = false,
  fill = false,
}: OptimizedImageProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        className={cn(
          "object-cover transition-transform hover:scale-105",
          fill && "absolute inset-0"
        )}
        sizes={fill ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : undefined}
      />
    </div>
  )
}

// ✅ Avatar component with fallback
export function UserAvatar({ 
  user, 
  size = 40 
}: { 
  user: { avatar?: string; name: string }
  size?: number 
}) {
  return (
    <div className="relative">
      {user.avatar ? (
        <Image
          src={user.avatar}
          alt={`${user.name}'s avatar`}
          width={size}
          height={size}
          className="rounded-full object-cover"
        />
      ) : (
        <div 
          className="rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium"
          style={{ width: size, height: size }}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  )
}
```

## TypeScript Component Patterns

### 1. Proper Type Definitions
```tsx
// ✅ Comprehensive prop interfaces
interface UserCardProps {
  user: {
    id: string
    name: string
    email: string
    avatar?: string
    role: 'admin' | 'user' | 'guest'
  }
  onEdit?: (userId: string) => void
  onDelete?: (userId: string) => void
  className?: string
  variant?: 'default' | 'compact' | 'detailed'
}

// ✅ Generic component types
interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  onRowClick?: (item: T) => void
  loading?: boolean
  emptyMessage?: string
}

export function DataTable<T>({
  data,
  columns,
  onRowClick,
  loading,
  emptyMessage = 'No data available'
}: DataTableProps<T>) {
  // Implementation
}
```

### 2. Component Variants with Types
```tsx
import { cva, type VariantProps } from 'class-variance-authority'

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "border-border",
        outlined: "border-2",
        elevated: "shadow-lg",
      },
      size: {
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

interface CustomCardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode
}

export function CustomCard({ 
  className, 
  variant, 
  size, 
  children,
  ...props 
}: CustomCardProps) {
  return (
    <div 
      className={cn(cardVariants({ variant, size }), className)} 
      {...props}
    >
      {children}
    </div>
  )
}
```

## Component Organization Rules

1. **Maximum 300 lines per component**
2. **Single responsibility principle**
3. **Default to Server Components**
4. **Use Client Components only when needed**
5. **Compose complex UI from smaller components**
6. **Extract reusable logic to hooks**
7. **Use proper TypeScript interfaces**
8. **Implement loading and error states**
9. **Optimize images with Next.js Image**
10. **Follow consistent naming conventions**

## Best Practices Summary

- **Server First**: Default to Server Components for better performance
- **Client When Needed**: Use 'use client' only for interactivity
- **Composition**: Build complex UI from smaller, focused components
- **Type Safety**: Use comprehensive TypeScript interfaces
- **Performance**: Leverage Next.js optimizations (Image, Font, etc.)
- **Accessibility**: Include proper ARIA labels and keyboard navigation
- **Error Handling**: Implement proper error boundaries and loading states
- **Consistency**: Follow established patterns and naming conventions
