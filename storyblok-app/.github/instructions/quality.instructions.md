---
applyTo: '**'
---
# Next.js 14 Quality Checklist & Standards

## NEVER SHIP WITHOUT ✅

### Code Quality (MANDATORY)
- [ ] `npm run lint` passes with **0 errors** (blocking requirement)
- [ ] `npm run type-check` passes with **0 TypeScript errors**
- [ ] `npm run build` completes successfully
- [ ] All components under 300 lines
- [ ] No `any` types used (TypeScript strict mode)
- [ ] Proper error boundaries implemented

### Performance (MANDATORY)
- [ ] Images optimized with Next.js Image component
- [ ] Fonts optimized with Next.js Font
- [ ] Bundle size analyzed and optimized
- [ ] Core Web Vitals tested (LCP, FID, CLS)
- [ ] Loading states implemented for async operations
- [ ] Proper caching strategies applied

### Accessibility (MANDATORY - WCAG 2.1 AA)
- [ ] **4.5:1 contrast ratio minimum** for all text
- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader compatibility tested
- [ ] Alt text provided for all images
- [ ] Proper semantic HTML used
- [ ] Focus indicators visible and accessible

### Responsive Design (MANDATORY)
- [ ] **Tested on mobile devices** (actual devices, not just browser resize)
- [ ] **Tested on tablet devices**
- [ ] **Tested on desktop screens**
- [ ] Works in both portrait and landscape orientations
- [ ] Touch targets minimum 44px × 44px
- [ ] Text remains readable at all screen sizes

### App Router Compliance (MANDATORY)
- [ ] Server Components used by default
- [ ] Client Components only when necessary ('use client')
- [ ] Proper loading.tsx and error.tsx files
- [ ] Route handlers follow Next.js 14 patterns
- [ ] Metadata properly configured for SEO

## DESIGN QUALITY STANDARDS

### Visual Excellence (NEVER SHIP WITHOUT)
- [ ] **Industry-appropriate design** - colors/typography match target audience
- [ ] **Premium visual hierarchy** - sophisticated use of scale, contrast, spacing
- [ ] **Generous spacing** - py-16 lg:py-24 for sections, space-y-4 lg:space-y-6 for content
- [ ] **Sophisticated interactions** - not just basic hover states
- [ ] **Unique visual identity** - feels custom-crafted, not template-like
- [ ] **Purposeful animations** - enhance usability, not just decoration

### Color Psychology Compliance
- [ ] **Technology/SaaS**: Modern, innovative palettes (blues, purples, cyans)
- [ ] **Finance/Banking**: Trustworthy, stable tones (deep blues, navy, gold accents)
- [ ] **Healthcare**: Calming, clean colors (teals, soft blues, gentle greens)
- [ ] **Creative/Design**: Bold, artistic palettes showcasing creativity
- [ ] **E-commerce**: Warm, inviting tones encouraging purchases
- [ ] **Education**: Fresh, energetic colors motivating learning

### NEVER SHIP DESIGNS WITH:
- [ ] ❌ Default grays (slate-400, gray-500) without purposeful intent
- [ ] ❌ Plain white backgrounds with black text (add visual interest)
- [ ] ❌ Uniform spacing everywhere (create rhythm and hierarchy)
- [ ] ❌ Basic card grids with default shadows (add sophistication)
- [ ] ❌ Template-like layouts (create unique compositions)
- [ ] ❌ Static interfaces without micro-interactions

## COMPONENT ARCHITECTURE QUALITY

### Component Composition (MANDATORY)
- [ ] **No monolithic components** over 300 lines
- [ ] **Single responsibility** - each component has one clear purpose
- [ ] **Composition over complexity** - build from smaller, focused components
- [ ] **Reusable logic extracted** to custom hooks
- [ ] **Proper TypeScript interfaces** for all props
- [ ] **Consistent error handling** across components

### Server vs Client Components
- [ ] **Server Components by default** for better performance
- [ ] **Client Components only when needed** for interactivity
- [ ] **Proper 'use client' placement** - not unnecessarily broad
- [ ] **Data fetching in Server Components** when possible
- [ ] **State management in Client Components** only
- [ ] **Proper separation of concerns**

### Component Quality Checklist
- [ ] Component has clear, descriptive name
- [ ] Props interface is comprehensive and typed
- [ ] Component handles loading and error states
- [ ] Responsive design implemented
- [ ] Accessibility features included
- [ ] Performance optimized (memoization if needed)

## API QUALITY STANDARDS

### Route Handler Quality (MANDATORY)
- [ ] **Proper HTTP status codes** (200, 201, 400, 401, 403, 404, 500)
- [ ] **Input validation** with Zod schemas
- [ ] **Error handling** with consistent error responses
- [ ] **TypeScript interfaces** for request/response objects
- [ ] **Authentication/authorization** implemented where needed
- [ ] **Rate limiting** for public endpoints

### API Response Standards
- [ ] **Consistent response format** across all endpoints
- [ ] **Proper error messages** that help developers debug
- [ ] **Pagination** implemented for list endpoints
- [ ] **CORS headers** configured appropriately
- [ ] **Documentation** in code comments
- [ ] **Testing** with proper test cases

### Data Fetching Quality
- [ ] **Server Components** for initial data fetching
- [ ] **TanStack Query** for client-side data fetching
- [ ] **Proper error boundaries** for failed requests
- [ ] **Loading states** for all async operations
- [ ] **Optimistic updates** where appropriate
- [ ] **Cache invalidation** strategies implemented

## PERFORMANCE OPTIMIZATION

### Next.js 14 Performance (MANDATORY)
- [ ] **Next.js Image** used for all images
- [ ] **Next.js Font** used for web fonts
- [ ] **Dynamic imports** for code splitting
- [ ] **Proper caching headers** on API routes
- [ ] **Bundle analysis** completed and optimized
- [ ] **Core Web Vitals** meet Google's standards

### Performance Metrics Targets
- [ ] **Largest Contentful Paint (LCP)** < 2.5 seconds
- [ ] **First Input Delay (FID)** < 100 milliseconds
- [ ] **Cumulative Layout Shift (CLS)** < 0.1
- [ ] **Time to First Byte (TTFB)** < 600 milliseconds
- [ ] **Bundle size** optimized and analyzed
- [ ] **JavaScript execution time** minimized

### Optimization Techniques Applied
- [ ] Images optimized with proper formats (WebP, AVIF)
- [ ] Fonts preloaded and optimized
- [ ] CSS-based animations for better performance
- [ ] Minimal JavaScript for interactions
- [ ] Proper lazy loading implemented
- [ ] Code splitting at route level

## SECURITY & PRIVACY

### Security Checklist (MANDATORY)
- [ ] **Environment variables** properly configured
- [ ] **API endpoints** secured with authentication
- [ ] **Input validation** on all user inputs
- [ ] **SQL injection** prevention (parameterized queries)
- [ ] **XSS protection** implemented
- [ ] **CSRF protection** for forms

### Privacy Compliance
- [ ] **No sensitive data** in client-side code
- [ ] **Proper cookie handling** (httpOnly, secure, sameSite)
- [ ] **Data minimization** - only collect necessary data
- [ ] **User consent** for tracking/analytics
- [ ] **Privacy policy** links where required
- [ ] **GDPR compliance** if applicable

## TESTING & VALIDATION

### Manual Testing (MANDATORY)
- [ ] **Keyboard navigation** tested on all pages
- [ ] **Screen reader** tested (NVDA, VoiceOver, or JAWS)
- [ ] **Mobile device testing** on actual devices
- [ ] **Different browsers** tested (Chrome, Firefox, Safari, Edge)
- [ ] **Network conditions** tested (slow 3G, offline)
- [ ] **Error scenarios** tested (network failures, invalid data)

### Automated Testing
- [ ] **Unit tests** for utility functions
- [ ] **Component tests** for critical components
- [ ] **Integration tests** for user flows
- [ ] **API tests** for all endpoints
- [ ] **E2E tests** for critical user journeys
- [ ] **Accessibility tests** automated where possible

## DEPLOYMENT READINESS

### Pre-Deployment Checklist (MANDATORY)
- [ ] **All tests passing** in CI/CD pipeline
- [ ] **Environment variables** configured for production
- [ ] **Database migrations** completed
- [ ] **Error monitoring** set up (Sentry, LogRocket, etc.)
- [ ] **Analytics** configured and tested
- [ ] **Performance monitoring** enabled

### Production Configuration
- [ ] **Error boundaries** catching and reporting errors
- [ ] **Logging** configured for debugging
- [ ] **Monitoring** dashboards set up
- [ ] **Backup strategies** in place
- [ ] **Rollback plan** documented
- [ ] **Performance budgets** defined and monitored

### SEO & Metadata
- [ ] **Page titles** optimized for each route
- [ ] **Meta descriptions** written for key pages
- [ ] **Open Graph tags** configured
- [ ] **Twitter Card tags** configured
- [ ] **Structured data** implemented where appropriate
- [ ] **Sitemap** generated and submitted

## CODE REVIEW CHECKLIST

### Architecture Review
- [ ] **Component composition** follows best practices
- [ ] **Server/Client component** split is appropriate
- [ ] **Hook usage** is correct and necessary
- [ ] **API design** follows RESTful principles
- [ ] **Type safety** maintained throughout
- [ ] **Error handling** is comprehensive

### Code Quality Review
- [ ] **Naming conventions** are consistent and clear
- [ ] **Code duplication** has been eliminated
- [ ] **Comments** explain complex business logic
- [ ] **Performance** considerations addressed
- [ ] **Security** vulnerabilities identified and fixed
- [ ] **Accessibility** requirements met

### Design Review
- [ ] **Visual hierarchy** is clear and intentional
- [ ] **Color choices** serve the design purpose
- [ ] **Typography** enhances readability
- [ ] **Spacing** creates proper rhythm
- [ ] **Interactions** feel smooth and purposeful
- [ ] **Responsive behavior** works across all devices

## INDUSTRY-SPECIFIC QUALITY GATES

### Technology/SaaS Products
- [ ] **Innovation feel** - cutting-edge, forward-thinking design
- [ ] **Data visualization** is clear and actionable
- [ ] **Dashboard performance** is optimized
- [ ] **API documentation** is comprehensive
- [ ] **Developer experience** is prioritized

### Finance/Banking Applications
- [ ] **Security measures** are visibly communicated
- [ ] **Trust indicators** are prominently displayed
- [ ] **Compliance requirements** are met
- [ ] **Transaction flows** are clear and secure
- [ ] **Error messages** are helpful but not revealing

### Healthcare Applications
- [ ] **HIPAA compliance** considerations addressed
- [ ] **Accessibility** exceeds minimum requirements
- [ ] **Data privacy** is prioritized
- [ ] **User interface** reduces cognitive load
- [ ] **Emergency scenarios** are well-handled

### E-commerce Applications
- [ ] **Conversion optimization** applied throughout
- [ ] **Product imagery** is optimized
- [ ] **Checkout flow** is streamlined
- [ ] **Payment security** is clearly communicated
- [ ] **Mobile commerce** experience is excellent

## FINAL QUALITY GATE ⚠️

**DO NOT DEPLOY until ALL mandatory items are checked.**

**Critical blockers (any of these failing = DO NOT SHIP):**
1. `npm run lint` has ANY errors
2. Accessibility contrast ratio below 4.5:1
3. Mobile experience is broken
4. Performance budget exceeded
5. Security vulnerabilities present
6. TypeScript errors exist

**Quality standards that define professional work:**
- Visual design feels premium and industry-appropriate
- Component architecture is clean and maintainable
- Performance meets or exceeds web standards
- Accessibility supports all users
- Code quality enables future development

Remember: **Quality is not optional. These standards ensure we ship professional, accessible, performant applications that users love and developers can maintain.**
