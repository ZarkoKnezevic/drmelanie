# Live Preview Scroll Fix - Best Practices Solution

## ✅ Solution Implemented

I've implemented a **best practices solution** using Storyblok's recommended approach for live preview that:

1. **Uses `useStoryblokState` hook** - Storyblok's official hook for live preview
2. **Client-side updates** - No server re-fetching, preserves scroll position
3. **Performance optimized** - Only updates changed content, not entire page
4. **Follows Storyblok best practices** - Uses official Storyblok patterns

## 🏗️ Architecture

### Before (Problem)
```
Storyblok Input → Bridge Event → Server Component Re-fetch → Full Page Re-render → Scroll Resets
```

### After (Solution)
```
Storyblok Input → Bridge Event → useStoryblokState Hook → Client-side State Update → Scroll Preserved
```

## 📁 Files Changed

### 1. `src/components/LivePreviewWrapper.tsx` (NEW)
- **Client Component** that wraps Storyblok content for live preview
- Uses `useStoryblokState` hook to handle bridge updates
- Preserves scroll position during content updates
- Only used in preview mode

### 2. `src/app/live-preview/[[...slug]]/page.tsx` (UPDATED)
- Now uses `LivePreviewWrapper` instead of direct `StoryblokStory`
- Server Component fetches initial data once
- Client Component handles all subsequent updates

### 3. `src/components/StoryblokProvider.tsx` (SIMPLIFIED)
- Removed complex scroll preservation logic
- Now just initializes Storyblok API
- Scroll preservation handled by `LivePreviewWrapper`

## 🎯 How It Works

### Step 1: Initial Load (Server Component)
```typescript
// Server Component - fetches data once
const { data } = await fetchStory('draft', params.slug);
return <LivePreviewWrapper story={data.story} />;
```

### Step 2: Content Updates (Client Component)
```typescript
// Client Component - handles updates without re-fetching
const story = useStoryblokState(initialStory);
// Storyblok bridge automatically updates 'story' when content changes
// No server re-fetch, no page reload, scroll preserved!
```

### Step 3: Scroll Preservation
```typescript
// Save scroll before update
storyblok.on('input', saveScrollPosition);

// Restore scroll after React updates
storyblok.on('input', () => {
  setTimeout(restoreScrollPosition, 0);
});
```

## 🚀 Performance Benefits

1. **No Server Re-fetching** - Updates happen client-side only
2. **No Full Page Re-render** - Only affected components update
3. **Faster Updates** - No network latency for each keystroke
4. **Better UX** - Scroll position preserved, smooth editing

## 📊 Comparison

| Approach | Server Re-fetch | Scroll Preserved | Performance |
|----------|----------------|------------------|-------------|
| **Old (Server Component)** | ❌ Yes (every update) | ❌ No | ⚠️ Slow |
| **New (useStoryblokState)** | ✅ No | ✅ Yes | ✅ Fast |

## 🔧 Why This Works

### The Problem
- Server Components re-execute on every request
- Each Storyblok update triggered a server re-fetch
- Full page re-render reset scroll to top

### The Solution
- `useStoryblokState` updates content **client-side only**
- No server re-fetch, no full page re-render
- Scroll position naturally preserved
- This is Storyblok's **recommended approach** for live preview

## 📝 Usage

The fix is **automatic** - no changes needed in your code:

- **Production**: Uses Server Components (fast, cached)
- **Preview**: Uses `LivePreviewWrapper` with `useStoryblokState` (preserves scroll)

## ✅ Best Practices Followed

1. ✅ **Separation of Concerns** - Preview logic separate from production
2. ✅ **Performance** - Client-side updates, no unnecessary re-fetches
3. ✅ **Official API** - Uses Storyblok's recommended `useStoryblokState` hook
4. ✅ **Type Safety** - Proper TypeScript types
5. ✅ **Maintainability** - Clean, focused components

## 🎉 Result

- ✅ Scroll position preserved during live preview
- ✅ Fast, responsive content updates
- ✅ No page reloads or jumps
- ✅ Follows Storyblok best practices
- ✅ Optimized for performance


