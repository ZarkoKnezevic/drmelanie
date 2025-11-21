# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies

```bash
cd storyblok-app
npm install
```

### Step 2: Configure Environment

Create `.env.local` file:

```env
NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN=your_preview_token_here
STORYBLOK_VERSION=draft
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DOMAIN=http://localhost:3000
```

### Step 3: Start Development Server

```bash
npm run dev
```

### Step 4: Set Up Storyblok

1. Create a story with slug "home" in your Storyblok space
2. Set content type to "page"
3. Add components (Hero, Grid, Feature, Teaser)
4. Visit `http://localhost:3000`

## 📦 What's Included

✅ **Complete Next.js 16 setup** with App Router
✅ **Storyblok CMS integration** with RSC support
✅ **TypeScript** with strict mode
✅ **Tailwind CSS** for styling
✅ **ESLint & Prettier** configured
✅ **Utility functions** (logger, env, etc.)
✅ **Component examples** (Page, Grid, Hero, Feature, Teaser)
✅ **Error handling** and fallbacks
✅ **SEO support** (sitemap, robots.txt)

## 🎯 Next Steps

1. **Customize components** in `src/components/storyblok/`
2. **Add new components** and register them in `src/constants/storyblok-components.tsx`
3. **Configure your Storyblok space** with matching component schemas
4. **Deploy** to Vercel or your preferred platform

## 📚 Documentation

- See `README.md` for full documentation
- See `BOILERPLATE-RULES.md` for coding conventions
- See `ARCHITECTURE.md` for architecture details

