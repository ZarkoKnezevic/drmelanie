---
applyTo: 'lib/**/*.{ts,tsx}'
---
# Next.js 14 Library & Utilities Guidelines

## CRITICAL LIBRARY RULES

### NEVER:
- Put client-side code in server-side utilities
- Create utilities over 200 lines - break into smaller modules
- Duplicate utility functions across files
- Use `any` types in utility functions
- Mix server and client utilities in the same file

### ALWAYS:
- Separate server and client utilities clearly
- Use comprehensive TypeScript interfaces
- Create focused, single-purpose utilities
- Handle edge cases and errors appropriately
- Document utility functions with examples

## File Organization Structure

```
lib/
├── server/              # Server-side utilities
│   ├── auth.ts         # Authentication helpers
│   ├── database.ts     # Database utilities
│   ├── email.ts        # Email utilities
│   └── api.ts          # Server API helpers
├── client/             # Client-side utilities
│   ├── api.ts          # Client API helpers
│   ├── storage.ts      # Browser storage utilities
│   └── analytics.ts    # Analytics utilities
├── shared/             # Universal utilities
│   ├── utils.ts        # General utilities (cn function)
│   ├── types.ts        # Shared types
│   ├── constants.ts    # Application constants
│   └── validations.ts  # Zod schemas
└── hooks/              # Custom hooks (separate from lib)
```

## Shared Utilities

### 1. Core Utilities (lib/shared/utils.ts)
```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ✅ Essential cn function for Tailwind CSS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ✅ Format utilities
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {}
): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }).format(new Date(date))
}

export function formatCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatNumber(number: number): string {
  return new Intl.NumberFormat('en-US').format(number)
}

// ✅ String utilities
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length).trim() + '...'
}

// ✅ Array utilities
export function groupBy<T, K extends keyof any>(
  array: T[],
  key: (item: T) => K
): Record<K, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = key(item)
    groups[groupKey] = groups[groupKey] || []
    groups[groupKey].push(item)
    return groups
  }, {} as Record<K, T[]>)
}

export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// ✅ Object utilities
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result
}

export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}

// ✅ Async utilities
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function timeout<T>(
  promise: Promise<T>,
  ms: number
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Operation timed out')), ms)
  )
  return Promise.race([promise, timeoutPromise])
}

// ✅ Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), wait)
  }
}

// ✅ Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}
```

### 2. Type Definitions (lib/shared/types.ts)
```typescript
// ✅ User types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 'admin' | 'user' | 'guest'

// ✅ API response types
export interface ApiResponse<T = any> {
  data?: T
  message?: string
  error?: string
  success: boolean
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ✅ Next.js specific types
export interface PageProps {
  params: { [key: string]: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export interface LayoutProps {
  children: React.ReactNode
  params: { [key: string]: string }
}

// ✅ Form types
export interface FormState {
  isSubmitting: boolean
  isValid: boolean
  isDirty: boolean
  errors: Record<string, string>
}

// ✅ Component variant types
export type Size = 'sm' | 'md' | 'lg' | 'xl'
export type Variant = 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost'
export type Status = 'idle' | 'loading' | 'success' | 'error'

// ✅ Database types
export interface DatabaseError {
  message: string
  code: string
  details?: any
}

// ✅ File upload types
export interface UploadedFile {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  uploadedAt: Date
}
```

### 3. Constants (lib/shared/constants.ts)
```typescript
// ✅ API endpoints
export const API_ENDPOINTS = {
  USERS: '/api/users',
  POSTS: '/api/posts',
  AUTH: '/api/auth',
  UPLOAD: '/api/upload',
  SEARCH: '/api/search',
} as const

// ✅ Query keys for TanStack Query
export const QUERY_KEYS = {
  USERS: 'users',
  USER: 'user',
  POSTS: 'posts',
  POST: 'post',
  SEARCH: 'search',
  PROFILE: 'profile',
} as const

// ✅ Application limits
export const LIMITS = {
  FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES: 5,
  USERNAME_MIN: 3,
  USERNAME_MAX: 20,
  PASSWORD_MIN: 8,
  BIO_MAX: 500,
} as const

// ✅ Default values
export const DEFAULTS = {
  PAGINATION: {
    PAGE: 1,
    LIMIT: 10,
  },
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
} as const

// ✅ Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const

// ✅ Error messages
export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: `Password must be at least ${LIMITS.PASSWORD_MIN} characters`,
  FILE_TOO_LARGE: `File size must be less than ${LIMITS.FILE_SIZE / 1024 / 1024}MB`,
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  SERVER_ERROR: 'An unexpected error occurred. Please try again.',
} as const
```

### 4. Validation Schemas (lib/shared/validations.ts)
```typescript
import { z } from 'zod'
import { LIMITS, ERROR_MESSAGES } from './constants'

// ✅ User validation schemas
export const userSchema = z.object({
  name: z.string()
    .min(1, ERROR_MESSAGES.REQUIRED)
    .max(50, 'Name must be less than 50 characters'),
  email: z.string()
    .min(1, ERROR_MESSAGES.REQUIRED)
    .email(ERROR_MESSAGES.INVALID_EMAIL),
  password: z.string()
    .min(LIMITS.PASSWORD_MIN, ERROR_MESSAGES.PASSWORD_TOO_SHORT)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
})

export const updateUserSchema = userSchema.partial().omit({ password: true })

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, ERROR_MESSAGES.REQUIRED),
  newPassword: z.string().min(LIMITS.PASSWORD_MIN, ERROR_MESSAGES.PASSWORD_TOO_SHORT),
  confirmPassword: z.string().min(1, ERROR_MESSAGES.REQUIRED),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// ✅ Post validation schemas
export const postSchema = z.object({
  title: z.string()
    .min(1, ERROR_MESSAGES.REQUIRED)
    .max(100, 'Title must be less than 100 characters'),
  content: z.string()
    .min(1, ERROR_MESSAGES.REQUIRED)
    .max(5000, 'Content must be less than 5000 characters'),
  tags: z.array(z.string()).max(5, 'Maximum 5 tags allowed').optional(),
  published: z.boolean().default(false),
})

// ✅ File upload validation
export const fileSchema = z.object({
  file: z.any()
    .refine(file => file?.size <= LIMITS.FILE_SIZE, ERROR_MESSAGES.FILE_TOO_LARGE)
    .refine(
      file => ['image/jpeg', 'image/png', 'image/webp'].includes(file?.type),
      'Only JPEG, PNG, and WebP files are allowed'
    ),
})

// ✅ Search validation
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100),
  filters: z.object({
    category: z.string().optional(),
    dateRange: z.object({
      from: z.date().optional(),
      to: z.date().optional(),
    }).optional(),
  }).optional(),
})

// ✅ Pagination validation
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(DEFAULTS.PAGINATION.PAGE),
  limit: z.coerce.number().min(1).max(100).default(DEFAULTS.PAGINATION.LIMIT),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
})
```

## Server-Side Utilities

### 1. Server API Helpers (lib/server/api.ts)
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// ✅ API response helpers
export function successResponse<T>(
  data: T,
  message?: string,
  status = 200
): NextResponse {
  return NextResponse.json({
    data,
    message,
    success: true,
  }, { status })
}

export function errorResponse(
  error: string,
  status = 500,
  details?: any
): NextResponse {
  return NextResponse.json({
    error,
    details,
    success: false,
  }, { status })
}

// ✅ Request validation helper
export async function validateRequest<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  try {
    const body = await request.json()
    const data = schema.parse(body)
    return { data, error: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        data: null,
        error: errorResponse('Validation failed', 400, error.errors),
      }
    }
    return {
      data: null,
      error: errorResponse('Invalid request body', 400),
    }
  }
}

// ✅ Query parameter helper
export function getQueryParams(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  return {
    get: (key: string) => searchParams.get(key),
    getNumber: (key: string, defaultValue = 0) => {
      const value = searchParams.get(key)
      return value ? parseInt(value, 10) : defaultValue
    },
    getBoolean: (key: string, defaultValue = false) => {
      const value = searchParams.get(key)
      return value ? value === 'true' : defaultValue
    },
    getArray: (key: string) => {
      return searchParams.getAll(key)
    },
  }
}

// ✅ Error handling wrapper
export function withErrorHandling(
  handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: any[]): Promise<NextResponse> => {
    try {
      return await handler(request, ...args)
    } catch (error) {
      console.error('API Error:', error)
      
      if (error instanceof z.ZodError) {
        return errorResponse('Validation failed', 400, error.errors)
      }
      
      return errorResponse('Internal server error', 500)
    }
  }
}
```

### 2. Authentication Utilities (lib/server/auth.ts)
```typescript
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

// ✅ JWT utilities
export function createToken(payload: any, expiresIn = '7d'): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn })
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!)
  } catch (error) {
    throw new Error('Invalid token')
  }
}

// ✅ Session management
export function setAuthCookie(token: string) {
  cookies().set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export function removeAuthCookie() {
  cookies().delete('auth-token')
}

export function getAuthToken(): string | null {
  return cookies().get('auth-token')?.value || null
}

// ✅ Request authentication
export function getTokenFromRequest(request: NextRequest): string | null {
  // Try cookie first
  const cookieToken = request.cookies.get('auth-token')?.value
  if (cookieToken) return cookieToken

  // Try Authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  return null
}

export async function requireAuth(request: NextRequest): Promise<any> {
  const token = getTokenFromRequest(request)
  
  if (!token) {
    throw new Error('Authentication required')
  }

  try {
    const payload = verifyToken(token)
    return payload
  } catch (error) {
    throw new Error('Invalid authentication token')
  }
}

// ✅ Password utilities
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcrypt')
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const bcrypt = await import('bcrypt')
  return bcrypt.compare(password, hashedPassword)
}
```

## Client-Side Utilities

### 1. Client API Helpers (lib/client/api.ts)
```typescript
// ✅ API client
class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || 'API request failed')
    }

    return response.json()
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', ...options })
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', ...options })
  }
}

export const api = new ApiClient()

// ✅ Specific API functions
export const userApi = {
  getUsers: (params?: any) => api.get('/api/users', { body: params }),
  getUser: (id: string) => api.get(`/api/users/${id}`),
  createUser: (data: any) => api.post('/api/users', data),
  updateUser: (id: string, data: any) => api.patch(`/api/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/api/users/${id}`),
}

export const postApi = {
  getPosts: (params?: any) => api.get('/api/posts', { body: params }),
  getPost: (id: string) => api.get(`/api/posts/${id}`),
  createPost: (data: any) => api.post('/api/posts', data),
  updatePost: (id: string, data: any) => api.patch(`/api/posts/${id}`, data),
  deletePost: (id: string) => api.delete(`/api/posts/${id}`),
}
```

### 2. Browser Storage Utilities (lib/client/storage.ts)
```typescript
// ✅ Local storage utilities
export const localStorage = {
  get<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === 'undefined') return defaultValue || null
    
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return defaultValue || null
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return
    
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return
    
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  },

  clear(): void {
    if (typeof window === 'undefined') return
    
    try {
      window.localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  },
}

// ✅ Session storage utilities
export const sessionStorage = {
  get<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === 'undefined') return defaultValue || null
    
    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch (error) {
      console.error('Error reading from sessionStorage:', error)
      return defaultValue || null
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return
    
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error writing to sessionStorage:', error)
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return
    
    try {
      window.sessionStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from sessionStorage:', error)
    }
  },

  clear(): void {
    if (typeof window === 'undefined') return
    
    try {
      window.sessionStorage.clear()
    } catch (error) {
      console.error('Error clearing sessionStorage:', error)
    }
  },
}
```

## Library Organization Rules

1. **Separation of Concerns** - Keep server and client utilities separate
2. **Single Responsibility** - Each utility should have one clear purpose
3. **Type Safety** - Use comprehensive TypeScript interfaces
4. **Error Handling** - Handle edge cases and errors gracefully
5. **Documentation** - Include clear examples and use cases
6. **Testing** - Write tests for utility functions
7. **Performance** - Optimize for performance and bundle size
8. **Reusability** - Design utilities to be reusable across the application
9. **Consistency** - Follow consistent naming and structure patterns
10. **Size Limit** - Keep utility files under 200 lines

## Best Practices Summary

- **Server vs Client**: Clearly separate server and client utilities
- **Type Safety**: Use TypeScript interfaces for all utilities
- **Error Handling**: Always handle errors gracefully
- **Performance**: Optimize for performance and bundle size
- **Validation**: Use Zod schemas for data validation
- **Constants**: Centralize constants and configuration
- **Testing**: Write comprehensive tests for utilities
- **Documentation**: Include clear examples and use cases
- **Consistency**: Follow established patterns and conventions
- **Modularity**: Break large utilities into smaller, focused modules
