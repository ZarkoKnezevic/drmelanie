# Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Deploy to Vercel

**Option A: Using Vercel Dashboard (Recommended)**

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Click **"Deploy"**

**Option B: Using Vercel CLI**

```bash
npm i -g vercel
vercel
```

### Step 3: Set Environment Variables

After the first deployment, Vercel will show you a URL like `your-project-name.vercel.app`.

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings → Environment Variables**
3. Add the following variables for **Production**, **Preview**, and **Development**:

#### Required Environment Variables

```env
# Storyblok Configuration (REQUIRED)
NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN=your_preview_or_public_token_here
NEXT_PUBLIC_STORYBLOK_API_GATE=https://api.storyblok.com/v2/cdn
STORYBLOK_VERSION=published

# App URLs (Update after first deployment)
NEXT_PUBLIC_APP_URL=https://your-project-name.vercel.app
NEXT_PUBLIC_DOMAIN=https://your-project-name.vercel.app
```

#### Optional Environment Variables

```env
# Webhook Secret (for Storyblok webhooks)
SB_WEBHOOK_REVALIDATE_SECRET=your_webhook_secret_here

# Vercel Redeploy Hook (optional, only if using component webhooks)
VERCEL_REDEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/your-hook-id

# Live Preview (only if using Storyblok live preview)
NEXT_PUBLIC_IS_PREVIEW=false

# Skip Storyblok CLI tasks during build (optional - prevents pull-components errors)
STORYBLOK_SKIP_PULL=true
```

### Step 4: Update Domain in Environment Variables

After your first deployment completes:

1. Copy your Vercel deployment URL (e.g., `https://your-project-name.vercel.app`)
2. Go to **Settings → Environment Variables**
3. Update `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_DOMAIN` with your actual Vercel URL
4. Click **"Save"**
5. Trigger a new deployment (or wait for the next push)

### Step 5: Redeploy

After updating environment variables, trigger a new deployment:

**Option A: Via Dashboard**

- Go to **Deployments** tab
- Click the **"..."** menu on the latest deployment
- Select **"Redeploy"**

**Option B: Via Git Push**

```bash
git commit --allow-empty -m "Trigger redeploy with updated env vars"
git push
```

## 📝 Notes

### Environment Variable Priorities

Vercel uses different environment variables for different environments:

- **Production**: Used for production deployments
- **Preview**: Used for preview deployments (PR previews)
- **Development**: Used when running `vercel dev` locally

You can set different values for each environment, or use the same values for all.

### Storyblok Token

- Use **Preview token** for development/preview environments
- Use **Public token** for production environment (recommended)
- Or use Preview token for all environments if you want to see draft content

### Custom Domain

If you add a custom domain later:

1. Add the domain in Vercel Dashboard → **Settings → Domains**
2. Update `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_DOMAIN` to your custom domain
3. Redeploy

### Vercel Auto-Environment Variables

Vercel automatically provides these (you don't need to set them):

- `VERCEL_URL` - The deployment URL
- `VERCEL_ENV` - The environment (production, preview, development)
- `NODE_ENV` - Automatically set to `production` in production

You can use `VERCEL_URL` if you want to avoid hardcoding the domain, but note that it's only available at build/runtime, not as a `NEXT_PUBLIC_` variable.

## 🔍 Troubleshooting

### Build Fails

- Check that all required environment variables are set
- Ensure `NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN` is valid
- Check build logs in Vercel Dashboard

### Domain Not Working

- Ensure `NEXT_PUBLIC_APP_URL` matches your Vercel deployment URL
- Wait a few minutes after updating environment variables
- Trigger a new deployment after updating env vars

### Storyblok Content Not Loading

- Verify your access token is correct
- Check `STORYBLOK_VERSION` (use `published` for production)
- Ensure Storyblok space is public or token has proper permissions

### Storyblok CLI pull-components Error

If you see an error like "An error occurred when executing the pull-components task":

- This is a non-critical error from the Storyblok CLI dev tool
- The `pull-components` task is not needed for production builds
- You can safely ignore this error, or set `STORYBLOK_SKIP_PULL=true` environment variable
- This tool is only used locally for generating TypeScript types from Storyblok components

## ✅ Checklist

- [ ] Code pushed to GitHub
- [ ] Project deployed to Vercel
- [ ] Environment variables set in Vercel Dashboard
- [ ] `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_DOMAIN` updated with actual Vercel URL
- [ ] Redeployed after setting environment variables
- [ ] Site is accessible and working
- [ ] Storyblok content is loading correctly
