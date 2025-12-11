# Debugging 500 Internal Server Error on Vercel

## ✅ FIXED: Dynamic Server Usage Error

**If you see this error:**

```
Dynamic server usage: Route /[[...slug]] couldn't be rendered statically because it used revalidate: 0 fetch / no-store fetch
```

**Solution Applied:**

- Added `export const dynamic = 'force-dynamic'` to the page component
- Added `export const revalidate = 0` to explicitly mark the route as dynamic
- Improved static asset filtering to prevent favicon.png and other static files from being treated as Storyblok stories

This fix ensures the route is properly configured for dynamic rendering, which is required when using `no-store` cache (for draft content) or `revalidate: 0`.

## Quick Checklist

### 1. Check Environment Variables in Vercel

The most common cause of 500 errors is missing or incorrect environment variables.

**Required Environment Variables:**

- `NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN` - Your Storyblok preview or public token
- `NEXT_PUBLIC_STORYBLOK_API_GATE` - Should be `https://api.storyblok.com/v2/cdn`
- `STORYBLOK_VERSION` - Should be `published` for production or `draft` for preview
- `NEXT_PUBLIC_APP_URL` - Your Vercel deployment URL (e.g., `https://drmelanie.vercel.app`)
- `NEXT_PUBLIC_DOMAIN` - Same as `NEXT_PUBLIC_APP_URL`

**How to Check:**

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify all required variables are set for **Production** environment
3. Make sure there are no typos in variable names
4. Ensure values don't have extra spaces or quotes

### 2. Check Vercel Deployment Logs

**Steps:**

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Click on "Build Logs" tab
4. Look for any errors during build
5. Click on "Function Logs" or "Runtime Logs" to see runtime errors

**What to Look For:**

- Missing environment variables warnings
- Storyblok API errors
- Network timeout errors
- TypeScript/build errors

### 3. Check Storyblok Token Validity

**Verify your token:**

1. Go to your Storyblok space
2. Navigate to Settings → Access tokens
3. Verify your token is active and has correct permissions
4. For production, use **Public token** (for published content)
5. For preview, use **Preview token** (for draft content)

**Test your token:**

```bash
curl "https://api.storyblok.com/v2/cdn/stories/home?token=YOUR_TOKEN&version=published"
```

### 4. Common Error Scenarios

#### Scenario A: Missing Access Token

**Symptoms:** 500 error, logs show "Access Token Missing"
**Solution:** Add `NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN` to Vercel environment variables

#### Scenario B: Invalid Token

**Symptoms:** 500 error, Storyblok API returns 401/403
**Solution:** Verify token is correct and has proper permissions

#### Scenario C: Wrong STORYBLOK_VERSION

**Symptoms:** 500 error when trying to access draft content with published version
**Solution:** Set `STORYBLOK_VERSION=published` for production, `draft` for preview

#### Scenario D: Network/API Errors

**Symptoms:** Timeout or connection errors in logs
**Solution:** Check Storyblok API status, verify API gate URL is correct

### 5. Test Locally First

Before deploying, test your build locally:

```bash
# Set environment variables locally
export NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN="your_token"
export STORYBLOK_VERSION="published"
export NEXT_PUBLIC_APP_URL="http://localhost:3000"
export NEXT_PUBLIC_DOMAIN="http://localhost:3000"

# Build and test
npm run build
npm run start
```

If it works locally but fails on Vercel, it's likely an environment variable issue.

### 6. Enable Debug Logging

The application now has improved error handling that logs errors to the console. Check Vercel function logs for:

- "Error fetching story:"
- "Error fetching global components:"
- "Error generating metadata:"

### 7. Verify Build Configuration

Check `next.config.ts` is correct and doesn't have any issues.

### 8. Check Recent Changes

If the error started after a recent deployment:

1. Check what changed in the latest commit
2. Review the deployment logs for that specific deployment
3. Consider rolling back to a previous working deployment

## Quick Fix Steps

1. **Verify Environment Variables:**

   ```
   NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN=your_token_here
   NEXT_PUBLIC_STORYBLOK_API_GATE=https://api.storyblok.com/v2/cdn
   STORYBLOK_VERSION=published
   NEXT_PUBLIC_APP_URL=https://drmelanie.vercel.app
   NEXT_PUBLIC_DOMAIN=https://drmelanie.vercel.app
   ```

2. **Redeploy:**
   - After updating environment variables, trigger a new deployment
   - Go to Deployments → Click "..." → Redeploy

3. **Check Logs:**
   - Monitor the new deployment logs
   - Check function logs for runtime errors

## Still Having Issues?

If the error persists after checking all above:

1. **Check Vercel Status:** https://www.vercel-status.com/
2. **Check Storyblok Status:** https://status.storyblok.com/
3. **Review Error Details:** Check the exact error message in Vercel logs
4. **Test API Directly:** Use curl or Postman to test Storyblok API with your token

## Recent Improvements

The following error handling improvements have been made:

- ✅ Added try-catch in `CoreLayout` to prevent crashes from global components fetch
- ✅ Added error handling in `generateMetadata` to prevent metadata generation failures
- ✅ Added comprehensive error handling in page component for story fetching
- ✅ Better error messages for missing tokens and API failures

These improvements should prevent most 500 errors and provide better error messages when issues occur.
