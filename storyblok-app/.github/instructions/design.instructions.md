---
applyTo: '{app,components}/**/*.{tsx,css}'
---
# Next.js 14 Design System Guidelines

## CRITICAL DESIGN RULES

### NEVER CREATE:
- **Poor accessibility** - must maintain 4.5:1 contrast ratio minimum
- **Generic designs** - always adapt to target industry/audience  
- **Template-like layouts** - create unique, custom-crafted interfaces
- **Static interfaces** - include sophisticated micro-interactions
- **Default grays** (slate-400, gray-500) - use rich, intentional color palettes
- **Heavy client-side animations** - leverage CSS for performance

### ALWAYS CREATE:
- **Industry-appropriate design** - adapt colors/typography to target audience
- **Premium visual hierarchy** - sophisticated use of scale, contrast, spacing
- **Accessible interfaces** - WCAG 2.1 AA compliant (4.5:1 text contrast)
- **Mobile-first responsive** - progressive enhancement approach
- **Purposeful animations** - enhance usability, not just decoration
- **Performance-optimized visuals** - use Next.js Image and CSS animations

## Core Design Philosophy

**Every interface must feel like it was crafted by a top-tier design agency.**
- **Emotional Impact First**: Ask "Does this make users stop and say 'wow'?"
- **Sophisticated Hierarchy**: Use contrast, scale, and spacing strategically
- **Purposeful Motion**: Every animation should enhance usability
- **Breathing Room**: Generous whitespace creates luxury feel
- **Cohesive Visual Story**: Design choices should work together harmoniously
- **Unique Visual Identity**: Design should feel custom-crafted, never template-like
- **Industry-Appropriate Design**: Visual language should match the target audience and use case
- **Color Psychology**: Use colors intentionally to evoke the right emotions and associations

## Visual Quality Standards

**NEVER CREATE**:
- Generic card grids with default shadows
- Plain white backgrounds with black text
- Basic hover states (simple color changes)
- Template-like layouts
- Uniform spacing everywhere
- Overuse of default Tailwind grays without intention
- Static, lifeless interfaces
- Color choices without consideration for brand or industry context

**ALWAYS CREATE**:
- Dynamic, engaging compositions with visual flow
- Rich, intentional color palettes that serve the design purpose
- Sophisticated micro-interactions
- Asymmetrical layouts that guide the eye
- Varied spacing that creates rhythm
- High contrast, accessible text combinations
- Interactive, responsive designs with personality
- Color schemes that enhance the user experience and brand message

## INDUSTRY-SPECIFIC DESIGN ADAPTATION

### Design Philosophy by Industry
**Always adapt visual identity, aesthetic tone, and emotional impact to match the target industry or niche:**

### Technology & SaaS
- **Color Psychology**: Modern, innovative, forward-thinking palettes with high-tech feeling
- **Typography**: Clean geometric sans-serif with futuristic character
- **Visual Style**: Minimal, data-driven, sophisticated gradients and depth
- **Animation**: Smooth, precise micro-interactions that feel cutting-edge
- **Emotional Tone**: Innovation, efficiency, technological advancement

### Finance & Banking
- **Color Psychology**: Trustworthy, stable, premium tones that convey security
- **Typography**: Professional typography mixing authority with approachability
- **Visual Style**: Clean, sophisticated, confidence-building with subtle luxury
- **Animation**: Subtle, professional interactions that reinforce reliability
- **Emotional Tone**: Trust, stability, professional competence

### Healthcare & Medical
- **Color Psychology**: Calming, clean, trustworthy palette promoting wellness
- **Typography**: Highly readable, accessible fonts prioritizing clarity
- **Visual Style**: Clean, sterile-feeling but warm, emphasizing care and precision
- **Animation**: Gentle, non-distracting transitions that don't overwhelm
- **Emotional Tone**: Care, trust, healing, accessibility

### Creative & Design
- **Color Psychology**: Bold, artistic, expressive palettes showcasing creativity
- **Typography**: Creative font combinations demonstrating design expertise
- **Visual Style**: Portfolio-focused, visually striking, artistic expression
- **Animation**: Playful, engaging interactions that showcase creativity
- **Emotional Tone**: Inspiration, creativity, artistic vision

### E-commerce & Retail
- **Color Psychology**: Warm, inviting tones that encourage purchasing decisions
- **Typography**: Friendly, approachable fonts that build customer connection
- **Visual Style**: Product-focused, conversion-optimized, shopping-friendly
- **Animation**: Shopping-focused interactions (product previews, cart actions)
- **Emotional Tone**: Desire, comfort, value, satisfaction

### Education & Learning
- **Color Psychology**: Fresh, energetic palettes that motivate and inspire learning
- **Typography**: Clear, student-friendly fonts optimized for extended reading
- **Visual Style**: Approachable, encouraging, progress-focused design patterns
- **Animation**: Learning-focused progressions and achievement celebrations
- **Emotional Tone**: Growth, discovery, achievement, empowerment

## Next.js 14 Design Implementation

### 1. Optimized Images and Media
```tsx
import Image from 'next/image'

// ✅ Optimized hero images with Next.js Image
export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <Image
        src="/hero-background.jpg"
        alt="Hero background"
        fill
        priority
        className="absolute inset-0 object-cover z-0"
        sizes="100vw"
      />
      <div className="relative z-10 text-center text-white">
        <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
          Revolutionary SaaS Platform
        </h1>
        <p className="text-xl lg:text-2xl mb-8 text-blue-100">
          Transform your workflow with cutting-edge technology
        </p>
      </div>
    </section>
  )
}

// ✅ Optimized product images with blur placeholder
export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,..."
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-2xl font-bold text-primary">${product.price}</p>
      </div>
    </Card>
  )
}
```

### 2. Font Optimization with Next.js Font
```tsx
// app/layout.tsx
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
```

### 3. Performance-Optimized Animations
```tsx
// ✅ CSS-based animations for better performance
export function AnimatedCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
      <div className="relative p-6">
        {children}
      </div>
    </div>
  )
}

// ✅ Client Component for complex interactions
'use client'
export function InteractiveButton({ children }: { children: React.ReactNode }) {
  const [isPressed, setIsPressed] = useState(false)
  
  return (
    <button
      className={cn(
        "relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold transition-all duration-200",
        "hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5",
        "active:translate-y-0 active:shadow-md",
        isPressed && "scale-95"
      )}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-white opacity-0 rounded-lg transition-opacity duration-200 hover:opacity-10" />
    </button>
  )
}
```

## Responsive Design Patterns

### 1. Mobile-First Approach
```tsx
// ✅ Mobile-first responsive design
export function ResponsiveGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 xl:gap-8">
      {/* Content */}
    </div>
  )
}

// ✅ Typography scaling
export function ResponsiveTypography() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
        Responsive Headline
      </h1>
      <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl">
        Body text that scales appropriately across devices
      </p>
    </div>
  )
}

// ✅ Responsive spacing
export function ResponsiveSection() {
  return (
    <section className="py-12 md:py-16 lg:py-24 xl:py-32">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Content */}
      </div>
    </section>
  )
}
```

### 2. Dark Mode Support
```tsx
// ✅ Dark mode aware components
export function DarkModeCard() {
  return (
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h3 className="text-gray-900 dark:text-gray-100 font-semibold">
          Dark mode ready
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Automatically adapts to user preference
        </p>
      </div>
    </Card>
  )
}
```

## Advanced Layout Patterns

### 1. Complex Grid Layouts
```tsx
// ✅ CSS Grid for complex layouts
export function DashboardGrid() {
  return (
    <div className="grid grid-cols-12 gap-6 h-screen">
      {/* Sidebar */}
      <aside className="col-span-12 lg:col-span-3 xl:col-span-2">
        <DashboardSidebar />
      </aside>
      
      {/* Main content */}
      <main className="col-span-12 lg:col-span-9 xl:col-span-10 grid grid-rows-[auto_1fr] gap-6">
        {/* Header */}
        <header className="bg-white rounded-lg shadow-sm p-6">
          <DashboardHeader />
        </header>
        
        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <MetricsCards />
            <ChartSection />
          </div>
          <div className="space-y-6">
            <ActivityFeed />
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  )
}
```

### 2. Masonry Layouts
```tsx
// ✅ CSS-based masonry layout
export function MasonryGallery({ images }: { images: Image[] }) {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
      {images.map((image) => (
        <div key={image.id} className="break-inside-avoid">
          <Card className="overflow-hidden">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="w-full h-auto"
            />
            <div className="p-4">
              <h3 className="font-medium">{image.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {image.description}
              </p>
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}
```

## Color Psychology Implementation

### 1. Industry-Specific Color Schemes
```tsx
// ✅ Technology/SaaS color scheme
const techColors = {
  primary: 'hsl(220, 90%, 56%)', // Vibrant blue
  secondary: 'hsl(270, 80%, 60%)', // Purple accent
  accent: 'hsl(190, 100%, 50%)', // Cyan highlight
  background: 'hsl(220, 15%, 8%)', // Dark background
  foreground: 'hsl(0, 0%, 98%)', // Light text
}

// ✅ Finance/Banking color scheme
const financeColors = {
  primary: 'hsl(210, 100%, 30%)', // Deep blue
  secondary: 'hsl(210, 30%, 20%)', // Navy accent
  accent: 'hsl(50, 100%, 60%)', // Gold highlight
  background: 'hsl(0, 0%, 98%)', // Light background
  foreground: 'hsl(210, 30%, 15%)', // Dark text
}

// ✅ Healthcare color scheme
const healthcareColors = {
  primary: 'hsl(160, 60%, 45%)', // Calming teal
  secondary: 'hsl(200, 80%, 50%)', // Soft blue
  accent: 'hsl(120, 40%, 60%)', // Gentle green
  background: 'hsl(0, 0%, 99%)', // Clean white
  foreground: 'hsl(160, 30%, 20%)', // Dark teal text
}
```

### 2. Dynamic Color Application
```tsx
// ✅ Context-aware color usage
export function StatusBadge({ status }: { status: 'success' | 'warning' | 'error' }) {
  const variants = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
  }
  
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      variants[status]
    )}>
      {status}
    </span>
  )
}
```

## Accessibility Implementation

### 1. WCAG 2.1 AA Compliance
```tsx
// ✅ High contrast text combinations
export function AccessibleText() {
  return (
    <div className="space-y-4">
      {/* 4.5:1 contrast ratio minimum */}
      <h2 className="text-gray-900 dark:text-gray-100 text-2xl font-bold">
        High Contrast Heading
      </h2>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Body text with sufficient contrast for readability
      </p>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        Accessible Button
      </button>
    </div>
  )
}
```

### 2. Keyboard Navigation
```tsx
'use client'

// ✅ Keyboard accessible components
export function AccessibleDropdown({ items }: { items: string[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'Escape':
        setIsOpen(false)
        break
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, items.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
        break
      case 'Enter':
        if (selectedIndex >= 0) {
          // Handle selection
          setIsOpen(false)
        }
        break
    }
  }
  
  return (
    <div className="relative" onKeyDown={handleKeyDown}>
      <button
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        Select option
      </button>
      
      {isOpen && (
        <ul
          className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-50"
          role="listbox"
        >
          {items.map((item, index) => (
            <li
              key={item}
              className={cn(
                'p-2 cursor-pointer hover:bg-gray-100',
                selectedIndex === index && 'bg-blue-100'
              )}
              role="option"
              aria-selected={selectedIndex === index}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

## Performance-Optimized Design

### 1. CSS-First Animations
```css
/* app/globals.css */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-slide-in-up {
  animation: slideInUp 0.6s ease-out forwards;
}

.animate-pulse-gentle {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### 2. Optimized Component Patterns
```tsx
// ✅ Performance-optimized card with CSS animations
export function OptimizedCard({ children, delay = 0 }: { 
  children: React.ReactNode
  delay?: number 
}) {
  return (
    <div 
      className="opacity-0 animate-slide-in-up"
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards'
      }}
    >
      <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        {children}
      </Card>
    </div>
  )
}
```

## Design System Best Practices

1. **Mobile-First Responsive Design** - Start with mobile, enhance for larger screens
2. **Accessibility First** - 4.5:1 contrast ratio minimum, keyboard navigation
3. **Performance-Optimized** - Use Next.js Image, CSS animations, minimal JavaScript
4. **Industry-Appropriate** - Adapt colors, typography, and tone to target audience
5. **Consistent Visual Hierarchy** - Use scale, contrast, and spacing strategically
6. **Purposeful Animations** - Enhance usability, not just decoration
7. **Dark Mode Support** - Design for both light and dark themes
8. **Semantic HTML** - Use proper HTML elements for accessibility
9. **Progressive Enhancement** - Core functionality works without JavaScript
10. **Testing Across Devices** - Ensure consistent experience on all screen sizes
