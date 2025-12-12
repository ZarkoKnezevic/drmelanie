# Vercel Live Preview Setup for Storyblok

This guide will help you set up Storyblok's live preview feature with Vercel deployments, allowing content editors to preview draft content changes in real-time within the Storyblok visual editor.

## 📋 Prerequisites

- Vercel account and project
- Storyblok account and space
- Preview token from your Storyblok space
- Next.js app deployed to Vercel

## 🔑 Step 1: Get Your Preview Token

1. Go to your Storyblok space
2. Navigate to **Settings → Access tokens**
3. Copy your **Preview token** (not the Public token)
4. Keep it handy for the next steps

## ⚙️ Step 2: Configure Vercel Environment Variables

In your Vercel project dashboard:

1. Go to **Settings → Environment Variables**
2. Add the following variables:

### For Preview Deployments (Development/Preview)

```env
NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN=your_preview_token_here
NEXT_PUBLIC_STORYBLOK_API_GATE=https://api.storyblok.com/v2/cdn
STORYBLOK_VERSION=draft
NEXT_PUBLIC_IS_PREVIEW=true
```

**Important:** Set these to apply to:
- ✅ **Preview** (for pull requests and preview deployments)
- ✅ **Development** (optional, for local development)

### For Production Deployments

```env
NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN=your_public_token_here
NEXT_PUBLIC_STORYBLOK_API_GATE=https://api.storyblok.com/v2/cdn
STORYBLOK_VERSION=published
NEXT_PUBLIC_IS_PREVIEW=false
```

**Important:** Set these to apply to:
- ✅ **Production** only

### App URLs (Auto-configured by Vercel)

Vercel automatically provides these, but you can override if needed:

```env
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
NEXT_PUBLIC_DOMAIN=https://your-project.vercel.app
```

## 🔗 Step 3: Configure Storyblok Visual Editor

1. Go to your Storyblok space
2. Navigate to **Settings → Visual Editor**
3. Set the **Location (URL)** to your Vercel preview URL:
   - **For Preview Deployments:** `https://your-project-git-branch-your-team.vercel.app`
   - **For Production:** `https://your-project.vercel.app`
4. Click **Save**

### Using Vercel Preview URLs

Vercel creates unique preview URLs for each deployment:
- **Preview deployments:** `https://your-project-git-branch-your-team.vercel.app`
- **Production:** `https://your-project.vercel.app`

**Recommended:** Use your production URL for the Visual Editor, as it will work with both preview and production content.

## 🎯 Step 4: Configure Storyblok Preview URLs (Advanced)

For better preview experience, you can configure Storyblok to use different URLs for different environments:

### Option 1: Use Production URL (Simplest)

- Set Visual Editor URL to your production Vercel URL
- Works for both draft and published content
- Preview token will fetch draft content automatically

### Option 2: Use Preview Deployment URL (More Control)

1. In Storyblok, go to **Settings → Visual Editor**
2. Set URL to: `https://your-project-git-main-your-team.vercel.app`
3. This uses your preview deployment which always uses draft content

## ✅ Step 5: Test Live Preview

1. Open your Storyblok space
2. Go to **Content** and open any story
3. Click the **Visual Editor** button (or press `Ctrl/Cmd + E`)
4. You should see your Vercel-deployed Next.js app loaded in the preview panel
5. Make changes to your content - they should appear in real-time!

## 🔄 How It Works

### Preview Flow

1. **Content Editor opens Visual Editor** in Storyblok
2. **Storyblok loads** your Vercel preview URL
3. **Next.js app detects** `NEXT_PUBLIC_IS_PREVIEW=true` environment variable
4. **App uses Preview token** to fetch draft content from Storyblok
5. **Changes appear in real-time** via Storyblok's bridge

### Environment Detection

The app automatically detects the environment:
- **Preview deployments:** Uses draft content with preview token
- **Production:** Uses published content with public token

## 🎨 Using the Live Preview Route

The app includes a dedicated live preview route at `/live-preview/[[...slug]]` that:
- Always uses draft content
- Only works when `NEXT_PUBLIC_IS_PREVIEW=true`
- Provides the best preview experience

You can access it directly at:
- `https://your-project.vercel.app/live-preview`
- `https://your-project.vercel.app/live-preview/your-story-slug`

## 🔐 Security Best Practices

1. **Never commit tokens** to your repository
2. **Use different tokens** for preview and production
3. **Restrict preview token** access if possible
4. **Use environment variables** in Vercel (not in code)

## 🐛 Troubleshooting

### Issue: Preview not loading in Storyblok

**Solutions:**
- Verify `NEXT_PUBLIC_IS_PREVIEW=true` is set in Vercel environment variables
- Check that Preview token is set for Preview deployments
- Ensure Visual Editor URL in Storyblok matches your Vercel URL
- Check Vercel deployment logs for errors
- Verify the preview URL is accessible (try opening it directly)

### Issue: Preview shows published content instead of draft

**Solutions:**
- Verify `STORYBLOK_VERSION=draft` is set for Preview deployments
- Check that Preview token (not Public token) is used
- Ensure `NEXT_PUBLIC_IS_PREVIEW=true` is set

### Issue: CORS errors in browser console

**Solutions:**
- Storyblok bridge requires HTTPS (Vercel provides this automatically)
- Check that your Vercel URL uses HTTPS
- Verify Storyblok Visual Editor URL matches exactly

### Issue: Changes not appearing in real-time

**Solutions:**
- Check browser console for errors
- Verify Storyblok bridge is loaded (check Network tab)
- Ensure preview token has correct permissions
- Try refreshing the preview iframe

## 📝 Vercel Deployment Configuration

### Automatic Preview Deployments

Vercel automatically creates preview deployments for:
- Pull requests
- Commits to branches
- Manual deployments

Each preview deployment gets a unique URL that can be used for Storyblok preview.

### Production Deployments

Production deployments use:
- Published content (with public token)
- Production URL
- Optimized builds

## 🚀 Next Steps

1. ✅ Set up environment variables in Vercel
2. ✅ Configure Storyblok Visual Editor URL
3. ✅ Test preview functionality
4. ✅ Train content editors on using Visual Editor

## 📚 Additional Resources

- [Storyblok Visual Editor Documentation](https://www.storyblok.com/docs/guide/essentials/visual-editor)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Deployment on Vercel](https://nextjs.org/docs/deployment)

