# Storyblok + Next.js Boilerplate

A production-ready Next.js 16 boilerplate with Storyblok CMS integration, combining best practices from modern Next.js development and comprehensive Storyblok CMS patterns.

## 🚀 Features

- **Next.js 16** with App Router and React Server Components
- **Storyblok CMS** integration with RSC support
- **TypeScript** with strict type checking
- **Tailwind CSS** for styling
- **ESLint & Prettier** for code quality
- **Comprehensive utilities** (logger, env, etc.)
- **Production-ready** structure and patterns

## 📋 Prerequisites

- Node.js 18+ or Bun
- A Storyblok account and space
- Git

## 🛠️ Installation

```bash
# Navigate to the project
cd storyblok-app

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your Storyblok access token to .env.local
# NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN=your_preview_token_here
```

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Storyblok Configuration
NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN=your_preview_token_here
NEXT_PUBLIC_STORYBLOK_API_GATE=https://api.storyblok.com/v2/cdn
STORYBLOK_VERSION=draft

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DOMAIN=http://localhost:3000

# Node Environment
NODE_ENV=development
```

### Getting Your Storyblok Token

1. Go to your Storyblok space
2. Navigate to **Settings → Access tokens**
3. Copy your **Preview token** (for draft content) or **Public token** (for published content)
4. Paste it in your `.env.local` file

## 🚀 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Type check
npm run type-check
```

Your app will be running at `http://localhost:3000`

## 👁️ Live Preview Setup

To enable Storyblok's live preview feature (real-time content editing), see the comprehensive guide:

📖 **[PREVIEW-SETUP.md](./PREVIEW-SETUP.md)**

Quick setup:
1. Set `NEXT_PUBLIC_IS_PREVIEW=true` in `.env.local`
2. Set up HTTPS (required by Storyblok)
3. Configure your Storyblok space's Visual Editor URL

## 📁 Project Structure

```
storyblok-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Global styles
│   │   └── not-found.tsx       # 404 page
│   ├── components/
│   │   ├── storyblok/          # Storyblok components
│   │   │   ├── Page.tsx
│   │   │   ├── Grid.tsx
│   │   │   ├── Feature.tsx
│   │   │   ├── Hero.tsx
│   │   │   └── Teaser.tsx
│   │   ├── StoryblokProvider.tsx
│   │   └── StoryblokRenderer.tsx
│   ├── lib/
│   │   ├── storyblok/          # Storyblok API utilities
│   │   │   ├── storyblok.ts
│   │   │   └── utils.ts
│   │   └── storyblok-init.tsx  # Storyblok initialization
│   ├── hooks/                  # Custom React hooks
│   ├── utils/                  # Utility functions
│   │   ├── env.ts
│   │   ├── logger.ts
│   │   └── cn.ts
│   ├── types/                  # TypeScript types
│   └── constants/              # Application constants
├── public/                     # Static assets
├── .prettierrc                 # Prettier config
├── eslint.config.mjs           # ESLint config
├── tailwind.config.ts          # Tailwind config
├── tsconfig.json               # TypeScript config
└── next.config.ts              # Next.js config
```

## 🎯 Key Concepts

### Component Registration

All Storyblok components must be registered in `src/constants/storyblok-components.tsx`:

```typescript
import MyComponent from '@/components/storyblok/MyComponent';

export const COMPONENTS = {
  mycomponent: MyComponent,
  MyComponent: MyComponent, // Case-insensitive support
};
```

### Server vs Client Components

- **Server Components** (default): Use for data fetching and static content
- **Client Components** (`'use client'`): Use for interactivity, hooks, browser APIs

### Environment Variables

Use the `env` utility for type-safe access:

```typescript
import { env } from '@/utils';

const token = env.storyblok.accessToken;
```

### Logging

Use the `logger` utility instead of `console.log`:

```typescript
import { logger } from '@/utils';

logger.info('Info message');
logger.error('Error message');
logger.debug('Debug message'); // Server-only
```

## 📚 Storyblok Setup

1. **Create a story** in your Storyblok space with slug "home"
2. **Set content type** to "page"
3. **Add components** to your page (Hero, Grid, Feature, Teaser, etc.)
4. **Use Preview token** for draft content or Public token for published content
5. **Set up live preview** - See [PREVIEW-SETUP.md](./PREVIEW-SETUP.md) for detailed instructions

## 🔧 Adding New Components

1. **Create component file** in `src/components/storyblok/`:

```typescript
// src/components/storyblok/MyComponent.tsx
import { storyblokEditable } from '@storyblok/react/rsc';

export default function MyComponent({ blok }: MyComponentProps) {
  return <div {...storyblokEditable(blok)}>{blok.content}</div>;
}
```

2. **Register in** `src/constants/storyblok-components.tsx`
3. **Create component schema** in Storyblok
4. **Use in your content** - it will automatically render!

## 📖 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Storyblok React SDK](https://www.storyblok.com/docs/guide/getting-started/quick-setup)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🎨 Styling

This project uses Tailwind CSS with a custom design system. Colors, spacing, and typography are configured in `tailwind.config.ts`.

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 📝 Code Style

- **TypeScript**: Strict mode enabled
- **Prettier**: Auto-formatting on save
- **ESLint**: Next.js recommended rules
- **Imports**: Organized by external → internal → components

## 🤝 Contributing

1. Follow the code style guidelines
2. Use TypeScript for all new files
3. Add proper types and interfaces
4. Use the logger utility instead of console.log
5. Test your changes thoroughly

## 📄 License

MIT

---

**Happy coding!** 🎉

