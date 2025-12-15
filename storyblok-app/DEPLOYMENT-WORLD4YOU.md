# Deployment Guide for world4you

This guide explains how to deploy your Next.js application to world4you hosting and set up a Storyblok webhook for automatic deployments.

## 📋 Prerequisites

- FTP access to world4you (from your support document)
- Node.js installed locally (for building)
- Git repository (optional, but recommended)

## 🚀 Deployment Options

### Option 1: Static Export (Recommended for world4you)

If world4you doesn't support Node.js, you'll need to export your Next.js app as a static site.

#### Step 1: Configure Next.js for Static Export

Update `next.config.ts`:

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Enable static export
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'a.storyblok.com',
      },
      {
        protocol: 'https',
        hostname: '**.storyblok.com',
      },
    ],
  },
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
};

export default nextConfig;
```

#### Step 2: Build and Export

```bash
npm run build
```

This will create a `out/` directory with all static files.

#### Step 3: Upload to world4you via FTP

Using your FTP credentials:

- **Server:** `ftp.world4you.com`
- **Username:** `ftp5826521`
- **Password:** (from your support document)

Upload all files from the `out/` directory to your webspace root (usually `htdocs/` or `www/`).

### Option 2: Node.js Hosting (If Supported)

If world4you supports Node.js:

1. Upload your entire project (excluding `node_modules`)
2. SSH into your server
3. Run:
   ```bash
   npm install --production
   npm run build
   npm start
   ```
4. Set up a process manager (PM2) to keep the app running

## 🔗 Setting Up Storyblok Webhook

### Step 1: Create Webhook Endpoint

The webhook endpoint is already created at `/api/storyblok-webhook`. Make sure it's accessible from the internet.

### Step 2: Configure Storyblok Webhook

1. Go to your Storyblok space
2. Navigate to **Settings → Webhooks**
3. Click **Add webhook**
4. Configure:
   - **Name:** `Deploy on Publish`
   - **URL:** `https://yourdomain.com/api/storyblok-webhook`
   - **Events:** Select **Story published** and **Story unpublished**
   - **Secret:** (optional, but recommended - use a strong random string)
5. Save the webhook

### Step 3: Set Webhook Secret (Optional but Recommended)

Add to your `.env.local` (and production environment):

```env
STORYBLOK_WEBHOOK_SECRET=your_strong_random_secret_here
```

## 🔄 Automatic Deployment Flow

When content is published in Storyblok:

1. Storyblok sends webhook to `/api/storyblok-webhook`
2. Webhook triggers deployment script
3. Script builds and deploys to world4you

## 📝 Manual Deployment Script

Create a deployment script for manual deployments:

```bash
# deploy.sh
#!/bin/bash

echo "Building Next.js app..."
npm run build

echo "Uploading to world4you..."
# Use FTP client or rsync
# Example with lftp:
lftp -c "
open -u ftp5826521,8q*w*8q ftp.world4you.com
mirror -R out/ /htdocs/
quit
"
```

## 🔒 Security Notes

- Never commit FTP credentials to Git
- Use environment variables for sensitive data
- Enable webhook secret verification
- Use HTTPS for webhook endpoint

## 🐛 Troubleshooting

### Webhook Not Working

1. Check webhook URL is accessible (test with curl)
2. Verify webhook secret matches
3. Check Storyblok webhook logs
4. Check server logs for errors

### Build Fails

1. Ensure all dependencies are installed
2. Check Node.js version (18+ required)
3. Verify environment variables are set
4. Check for TypeScript errors: `npm run type-check`

### FTP Upload Issues

1. Verify FTP credentials
2. Check file permissions
3. Ensure correct directory path
4. Try passive FTP mode if active fails


