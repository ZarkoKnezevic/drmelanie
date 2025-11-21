---
applyTo: 'hooks/**/*.{ts,tsx}'
---
# Next.js 14 Custom Hooks Guidelines

## CRITICAL HOOK RULES

### NEVER:
- Create hooks in Server Components - hooks are Client Component only
- Use hooks for server-side data fetching - use direct async/await
- Duplicate hook logic across components
- Mix client and server concerns in the same hook
- Create hooks over 100 lines - break into smaller hooks

### ALWAYS:
- Use hooks only in Client Components ('use client')
- Create focused, single-purpose hooks
- Use proper TypeScript interfaces for hook returns
- Handle loading and error states appropriately
- Follow React hooks rules (top level, not in loops/conditions)

## Client Component Hook Patterns

### 1. Data Fetching Hooks (Client Side)
```tsx
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from './use-toast'

// ✅ Client-side data fetching hook
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// ✅ User-specific data hook
export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await fetch(`/api/users/${id}`)
      if (!response.ok) throw new Error('Failed to fetch user')
      return response.json()
    },
    enabled: !!id, // Only run if id exists
  })
}

// ✅ Mutation hook with optimistic updates
export function useUpdateUser() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to update user')
      return response.json()
    },
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['user', id] })
      
      // Snapshot previous value
      const previousUser = queryClient.getQueryData(['user', id])
      
      // Optimistically update
      queryClient.setQueryData(['user', id], (old: any) => ({
        ...old,
        ...data,
      }))
      
      return { previousUser }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(['user', variables.id], context.previousUser)
      }
      toast({
        title: 'Error',
        description: 'Failed to update user',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'User updated successfully',
      })
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] })
    },
  })
}
```

### 2. Form Hooks
```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'

const userSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  email: z.string().email('Invalid email format'),
  role: z.enum(['admin', 'user', 'guest']).default('user'),
  bio: z.string().max(500).optional(),
})

type UserFormData = z.infer<typeof userSchema>

// ✅ Comprehensive form hook
export function useUserForm(initialData?: Partial<User>) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      role: initialData?.role || 'user',
      bio: initialData?.bio || '',
    },
  })

  const { mutate: updateUser } = useUpdateUser()

  const onSubmit = async (data: UserFormData) => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    try {
      if (initialData?.id) {
        updateUser({ id: initialData.id, data })
      } else {
        // Create new user
        await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        toast({
          title: 'Success',
          description: 'User created successfully',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save user',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
    isDirty: form.formState.isDirty,
    isValid: form.formState.isValid,
    errors: form.formState.errors,
  }
}

// ✅ Search form hook with debouncing
export function useSearchForm() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [query])

  const { data: results, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return []
      const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      return response.json()
    },
    enabled: debouncedQuery.length > 2,
  })

  return {
    query,
    setQuery,
    results: results || [],
    isLoading: isLoading && debouncedQuery.length > 2,
    hasQuery: debouncedQuery.length > 0,
  }
}
```

### 3. UI State Hooks
```tsx
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ✅ Modal state management hook
export function useModal() {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(prev => !prev), [])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, close])

  return { isOpen, open, close, toggle }
}

// ✅ Disclosure/Accordion hook
export function useDisclosure(defaultOpen = false) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(prev => !prev), [])

  return {
    isOpen,
    open,
    close,
    toggle,
    getDisclosureProps: () => ({
      'aria-expanded': isOpen,
    }),
    getToggleProps: () => ({
      onClick: toggle,
      'aria-expanded': isOpen,
    }),
  }
}

// ✅ Pagination hook
export function usePagination({
  totalItems,
  itemsPerPage = 10,
  initialPage = 1,
}: {
  totalItems: number
  itemsPerPage?: number
  initialPage?: number
}) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }, [totalPages])

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1)
  }, [currentPage, goToPage])

  const previousPage = useCallback(() => {
    goToPage(currentPage - 1)
  }, [currentPage, goToPage])

  const goToFirst = useCallback(() => goToPage(1), [goToPage])
  const goToLast = useCallback(() => goToPage(totalPages), [goToPage, totalPages])

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    previousPage,
    goToFirst,
    goToLast,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages,
  }
}
```

### 4. Browser API Hooks
```tsx
'use client'

import { useState, useEffect, useCallback } from 'react'

// ✅ Local storage hook with SSR safety
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue]
}

// ✅ Media query hook
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

// ✅ Mobile detection hook
export function useMobile() {
  return useMediaQuery('(max-width: 768px)')
}

// ✅ Online status hook
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return

    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

// ✅ Copy to clipboard hook
export function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
      return true
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      setIsCopied(false)
      return false
    }
  }, [])

  return { isCopied, copyToClipboard }
}
```

### 5. Performance Hooks
```tsx
'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

// ✅ Debounce hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// ✅ Throttle hook
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastRan = useRef(Date.now())

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value)
        lastRan.current = Date.now()
      }
    }, limit - (Date.now() - lastRan.current))

    return () => {
      clearTimeout(handler)
    }
  }, [value, limit])

  return throttledValue
}

// ✅ Intersection Observer hook
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options?: IntersectionObserverInit
) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting)
    }, options)

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [elementRef, options])

  return isVisible
}

// ✅ Previous value hook
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()
  
  useEffect(() => {
    ref.current = value
  })
  
  return ref.current
}
```

### 6. Animation Hooks
```tsx
'use client'

import { useState, useEffect, useRef } from 'react'

// ✅ Animation state hook
export function useAnimation() {
  const [isAnimating, setIsAnimating] = useState(false)

  const startAnimation = useCallback(() => {
    setIsAnimating(true)
  }, [])

  const stopAnimation = useCallback(() => {
    setIsAnimating(false)
  }, [])

  return {
    isAnimating,
    startAnimation,
    stopAnimation,
  }
}

// ✅ Mount animation hook
export function useMountAnimation(duration = 300) {
  const [isMounted, setIsMounted] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  const mount = useCallback(() => {
    setShouldRender(true)
    // Delay to trigger CSS animation
    setTimeout(() => setIsMounted(true), 10)
  }, [])

  const unmount = useCallback(() => {
    setIsMounted(false)
    // Wait for animation to complete
    setTimeout(() => setShouldRender(false), duration)
  }, [duration])

  return {
    isMounted,
    shouldRender,
    mount,
    unmount,
  }
}
```

## Hook Testing Patterns

### 1. Hook Test Setup
```tsx
// __tests__/hooks/useUsers.test.tsx
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useUsers } from '@/hooks/useUsers'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useUsers', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should fetch users successfully', async () => {
    const mockUsers = [{ id: 1, name: 'John' }]
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    })

    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockUsers)
  })
})
```

## Hook Organization Rules

1. **Single Responsibility** - Each hook should have one clear purpose
2. **Client Component Only** - Hooks only work in Client Components
3. **Proper TypeScript** - Use comprehensive interfaces for return types
4. **Error Handling** - Handle loading and error states appropriately
5. **Performance** - Use debouncing, throttling, and memoization when needed
6. **Testing** - Write tests for custom hooks
7. **Reusability** - Design hooks to be reusable across components
8. **Dependencies** - Minimize external dependencies
9. **Documentation** - Include clear examples and use cases
10. **Size Limit** - Keep hooks under 100 lines, break into smaller hooks if needed

## Best Practices Summary

- **Server vs Client**: Use hooks only in Client Components
- **Data Fetching**: Use TanStack Query for client-side data fetching
- **Form Handling**: Combine React Hook Form with Zod validation
- **State Management**: Use focused hooks for specific state concerns
- **Performance**: Implement debouncing and throttling where appropriate
- **Browser APIs**: Handle SSR safely with proper checks
- **Error Handling**: Always handle loading and error states
- **Testing**: Write comprehensive tests for custom hooks
- **TypeScript**: Use proper typing for better developer experience
- **Composition**: Build complex functionality from smaller, focused hooks
