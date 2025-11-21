---
applyTo: 'app/api/**/*.{ts,tsx}'
---
# Next.js 14 API Route Guidelines

## CRITICAL API RULES

### NEVER:
- Create API routes outside the app/api directory
- Mix route handlers with page components
- Forget error handling and validation
- Return sensitive data without proper authorization
- Use old pages/api patterns

### ALWAYS:
- Use proper HTTP status codes
- Validate input data with Zod schemas
- Handle errors gracefully
- Implement proper CORS when needed
- Use TypeScript for type safety

## Route Handler Conventions

### 1. Basic Route Structure
```tsx
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// HTTP Methods as named exports
export async function GET(request: NextRequest) {
  // Handle GET requests
}

export async function POST(request: NextRequest) {
  // Handle POST requests
}

export async function PUT(request: NextRequest) {
  // Handle PUT requests
}

export async function PATCH(request: NextRequest) {
  // Handle PATCH requests
}

export async function DELETE(request: NextRequest) {
  // Handle DELETE requests
}
```

### 2. Dynamic Routes
```tsx
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id
  
  try {
    const user = await getUserById(userId)
    
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
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    )
  }
}
```

### 3. Nested Dynamic Routes
```tsx
// app/api/users/[id]/posts/[postId]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; postId: string } }
) {
  const { id: userId, postId } = params
  
  try {
    const post = await getUserPost(userId, postId)
    
    return NextResponse.json({
      data: post,
      success: true,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch post', success: false },
      { status: 500 }
    )
  }
}
```

## Request Handling Patterns

### 1. Query Parameters
```tsx
// app/api/users/route.ts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  // Extract query parameters
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const search = searchParams.get('search') || ''
  const sort = searchParams.get('sort') || 'createdAt'
  const order = searchParams.get('order') || 'desc'
  
  try {
    const users = await getUsersWithPagination({
      page,
      limit,
      search,
      sort,
      order,
    })
    
    return NextResponse.json({
      data: users.items,
      pagination: {
        page,
        limit,
        total: users.total,
        totalPages: Math.ceil(users.total / limit),
      },
      success: true,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users', success: false },
      { status: 500 }
    )
  }
}
```

### 2. Request Body Validation
```tsx
// app/api/users/route.ts
import { z } from 'zod'

const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email format'),
  age: z.number().min(18, 'Must be at least 18').max(120),
  role: z.enum(['user', 'admin', 'moderator']).default('user'),
})

const UpdateUserSchema = CreateUserSchema.partial()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = CreateUserSchema.parse(body)
    
    const user = await createUser(validatedData)
    
    return NextResponse.json(
      { 
        data: user, 
        message: 'User created successfully',
        success: true 
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.errors,
          success: false 
        },
        { status: 400 }
      )
    }
    
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user', success: false },
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
    const validatedData = UpdateUserSchema.parse(body)
    
    const user = await updateUser(params.id, validatedData)
    
    return NextResponse.json({
      data: user,
      message: 'User updated successfully',
      success: true,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.errors,
          success: false 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update user', success: false },
      { status: 500 }
    )
  }
}
```

### 3. Headers and Cookies
```tsx
// app/api/auth/login/route.ts
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // Authenticate user
    const { user, token } = await authenticateUser(email, password)
    
    // Set HTTP-only cookie
    cookies().set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    
    return NextResponse.json({
      data: { user },
      message: 'Login successful',
      success: true,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid credentials', success: false },
      { status: 401 }
    )
  }
}

// Get headers
export async function GET(request: NextRequest) {
  const authorization = request.headers.get('authorization')
  const userAgent = request.headers.get('user-agent')
  
  // Use headers for authentication, logging, etc.
}
```

## Authentication and Authorization

### 1. Middleware for Auth
```tsx
// middleware.ts (root of project)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the path requires authentication
  const protectedPaths = ['/api/admin', '/api/users/me']
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )
  
  if (isProtectedPath) {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      )
    }
    
    // Validate token (implement your logic)
    if (!isValidToken(token)) {
      return NextResponse.json(
        { error: 'Invalid token', success: false },
        { status: 401 }
      )
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*'
}
```

### 2. Auth Helper Functions
```tsx
// lib/auth.ts
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

export async function getCurrentUser() {
  const token = cookies().get('auth-token')?.value
  
  if (!token) {
    return null
  }
  
  try {
    const user = await validateTokenAndGetUser(token)
    return user
  } catch (error) {
    return null
  }
}

export function getTokenFromRequest(request: NextRequest) {
  // Try cookie first
  const cookieToken = request.cookies.get('auth-token')?.value
  
  if (cookieToken) {
    return cookieToken
  }
  
  // Try Authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  return null
}

// Use in API routes
export async function requireAuth(request: NextRequest) {
  const token = getTokenFromRequest(request)
  
  if (!token) {
    throw new Error('No token provided')
  }
  
  const user = await validateTokenAndGetUser(token)
  
  if (!user) {
    throw new Error('Invalid token')
  }
  
  return user
}
```

### 3. Protected API Routes
```tsx
// app/api/users/me/route.ts
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    
    return NextResponse.json({
      data: user,
      success: true,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized', success: false },
      { status: 401 }
    )
  }
}

// app/api/admin/users/route.ts
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    
    // Check if user has admin role
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required', success: false },
        { status: 403 }
      )
    }
    
    const users = await getAllUsers()
    
    return NextResponse.json({
      data: users,
      success: true,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized', success: false },
      { status: 401 }
    )
  }
}
```

## Error Handling Patterns

### 1. Centralized Error Handler
```tsx
// lib/api-error-handler.ts
import { NextResponse } from 'next/server'
import { z } from 'zod'

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error)
  
  if (error instanceof ApiError) {
    return NextResponse.json(
      { 
        error: error.message, 
        code: error.code,
        success: false 
      },
      { status: error.statusCode }
    )
  }
  
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { 
        error: 'Validation failed', 
        details: error.errors,
        success: false 
      },
      { status: 400 }
    )
  }
  
  // Database errors
  if (error instanceof Error && error.message.includes('duplicate key')) {
    return NextResponse.json(
      { error: 'Resource already exists', success: false },
      { status: 409 }
    )
  }
  
  // Default error
  return NextResponse.json(
    { error: 'Internal server error', success: false },
    { status: 500 }
  )
}

// Usage in API routes
export async function POST(request: NextRequest) {
  try {
    // Your API logic here
    const result = await createUser(userData)
    
    return NextResponse.json({
      data: result,
      success: true,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
```

### 2. Custom Error Classes
```tsx
// lib/errors.ts
export class ValidationError extends ApiError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR')
    this.details = details
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND')
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED')
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN')
  }
}

// Usage
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserById(params.id)
    
    if (!user) {
      throw new NotFoundError('User')
    }
    
    return NextResponse.json({
      data: user,
      success: true,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
```

## File Upload Handling

### 1. File Upload Route
```tsx
// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided', success: false },
        { status: 400 }
      )
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type', success: false },
        { status: 400 }
      )
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large', success: false },
        { status: 400 }
      )
    }
    
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Generate unique filename
    const filename = `${Date.now()}-${file.name}`
    const uploadDir = path.join(process.cwd(), 'public/uploads')
    const filePath = path.join(uploadDir, filename)
    
    await writeFile(filePath, buffer)
    
    return NextResponse.json({
      data: {
        filename,
        url: `/uploads/${filename}`,
        size: file.size,
        type: file.type,
      },
      message: 'File uploaded successfully',
      success: true,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file', success: false },
      { status: 500 }
    )
  }
}
```

## CORS Configuration

### 1. CORS Headers
```tsx
// lib/cors.ts
import { NextResponse } from 'next/server'

export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  }
}

// app/api/users/route.ts
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  })
}

export async function GET(request: NextRequest) {
  try {
    const users = await getUsers()
    
    return NextResponse.json(
      { data: users, success: true },
      { headers: corsHeaders() }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users', success: false },
      { status: 500, headers: corsHeaders() }
    )
  }
}
```

## Response Format Standards

### 1. Consistent Response Structure
```tsx
// lib/api-response.ts
export interface ApiResponse<T = any> {
  data?: T
  message?: string
  error?: string
  success: boolean
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

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

// Usage
export async function GET() {
  try {
    const users = await getUsers()
    return successResponse(users, 'Users fetched successfully')
  } catch (error) {
    return errorResponse('Failed to fetch users', 500)
  }
}
```

## Performance Optimization

### 1. Response Caching
```tsx
// app/api/posts/route.ts
export async function GET() {
  try {
    const posts = await getPosts()
    
    return NextResponse.json(
      { data: posts, success: true },
      {
        headers: {
          'Cache-Control': 's-maxage=60, stale-while-revalidate',
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch posts', success: false },
      { status: 500 }
    )
  }
}
```

### 2. Request Rate Limiting
```tsx
// lib/rate-limit.ts
import { NextRequest } from 'next/server'

const requestCounts = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(request: NextRequest, limit = 100, windowMs = 60000) {
  const ip = request.ip || 'unknown'
  const now = Date.now()
  const windowStart = now - windowMs
  
  const current = requestCounts.get(ip)
  
  if (!current || current.resetTime < windowStart) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }
  
  if (current.count >= limit) {
    return { allowed: false, remaining: 0 }
  }
  
  current.count++
  return { allowed: true, remaining: limit - current.count }
}

// Usage in API route
export async function GET(request: NextRequest) {
  const { allowed, remaining } = rateLimit(request, 100, 60000)
  
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded', success: false },
      { status: 429 }
    )
  }
  
  // Continue with API logic
}
```

## API Documentation

### 1. API Route Comments
```tsx
/**
 * GET /api/users
 * 
 * Retrieves a paginated list of users with optional filtering
 * 
 * Query Parameters:
 * - page (number): Page number (default: 1)
 * - limit (number): Items per page (default: 10, max: 100)
 * - search (string): Search term for name/email
 * - role (string): Filter by user role
 * - sort (string): Sort field (default: createdAt)
 * - order (string): Sort order - asc/desc (default: desc)
 * 
 * Response:
 * - data: User[] - Array of user objects
 * - pagination: Object with pagination info
 * - success: boolean
 * 
 * Status Codes:
 * - 200: Success
 * - 400: Bad request (invalid parameters)
 * - 500: Internal server error
 */
export async function GET(request: NextRequest) {
  // Implementation
}
```

## Best Practices Summary

1. **Use proper HTTP status codes** - 200, 201, 400, 401, 403, 404, 500
2. **Validate all inputs** - Use Zod schemas for validation
3. **Handle errors consistently** - Centralized error handling
4. **Implement authentication** - Secure protected routes
5. **Use TypeScript** - Type your request/response objects
6. **Add rate limiting** - Prevent abuse
7. **Document your APIs** - Clear comments and examples
8. **Follow REST conventions** - Consistent naming and methods
9. **Implement proper CORS** - Secure cross-origin requests
10. **Cache when appropriate** - Improve performance
