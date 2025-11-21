# Storyblok Live Preview Setup Guide

This guide will help you set up Storyblok's live preview feature, which allows you to see draft content changes in real-time within the Storyblok visual editor.

## 📋 Prerequisites

- Node.js 18+ installed
- A Storyblok account and space
- Preview token from your Storyblok space
- HTTPS enabled (required by Storyblok for live preview)

## 🔑 Step 1: Get Your Preview Token

1. Go to your Storyblok space
2. Navigate to **Settings → Access tokens**
3. Copy your **Preview token** (not the Public token)
4. Keep it handy for the next steps

## ⚙️ Step 2: Configure Environment Variables

Update your `.env.local` file with the following variables:

```env
# Storyblok Configuration
NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN=your_preview_token_here
NEXT_PUBLIC_STORYBLOK_API_GATE=https://api.storyblok.com/v2/cdn
STORYBLOK_VERSION=draft

# Preview Configuration (REQUIRED for live preview)
NEXT_PUBLIC_IS_PREVIEW=true
NEXT_PUBLIC_DOMAIN=https://localhost:3010

# App Configuration
NEXT_PUBLIC_APP_URL=https://localhost:3010

# Node Environment
NODE_ENV=development
```

**Important:** 
- `NEXT_PUBLIC_IS_PREVIEW=true` is required to enable the live preview route
- `NEXT_PUBLIC_DOMAIN` must use HTTPS (e.g., `https://localhost:3010`)

## 🔒 Step 3: Set Up HTTPS (Required for Live Preview)

Storyblok requires HTTPS for live preview. Choose one of the methods below:

### Method 1: Using mkcert + local-ssl-proxy (Recommended for Mac/Linux)

This method creates a valid SSL certificate for localhost.

#### For macOS:

```bash
# Install mkcert
brew install mkcert

# Install the local CA
mkcert -install

# Generate certificate for localhost
mkcert localhost

# Install local-ssl-proxy globally
npm install -g local-ssl-proxy

# Run the proxy (HTTPS on port 3010, forwarding to HTTP 3000)
local-ssl-proxy --source 3010 --target 3000 --cert localhost.pem --key localhost-key.pem
```

#### For Linux:

```bash
# Install mkcert (using npx or install via package manager)
# Option 1: Using npx (no installation needed)
npx mkcert@latest -install
npx mkcert@latest localhost

# Option 2: Install via package manager (Ubuntu/Debian)
# sudo apt install libnss3-tools
# wget -O mkcert https://github.com/FiloSottile/mkcert/releases/latest/download/mkcert-v1.4.4-linux-amd64
# chmod +x mkcert
# sudo mv mkcert /usr/local/bin/
# mkcert -install
# mkcert localhost

# Install local-ssl-proxy
npm install -g local-ssl-proxy

# Run the proxy
local-ssl-proxy --source 3010 --target 3000 --cert localhost.pem --key localhost-key.pem
```

#### For Windows:

```powershell
# Install mkcert using Chocolatey
choco install mkcert

# Or download from: https://github.com/FiloSottile/mkcert/releases
# Then add to PATH

# Install the local CA
mkcert -install

# Generate certificate for localhost
mkcert localhost

# Install local-ssl-proxy globally
npm install -g local-ssl-proxy

# Run the proxy
local-ssl-proxy --source 3010 --target 3000 --cert localhost.pem --key localhost-key.pem
```

### Method 2: Using ngrok (Alternative)

If you prefer not to set up local certificates, you can use ngrok:

```bash
# Install ngrok
# Download from https://ngrok.com/download or use package manager

# Start your Next.js dev server
npm run dev

# In another terminal, create HTTPS tunnel
ngrok http 3000

# Use the HTTPS URL provided by ngrok in your .env.local
# NEXT_PUBLIC_DOMAIN=https://your-ngrok-url.ngrok.io
```

### Method 3: Using Next.js with Custom Server (Advanced)

You can configure Next.js to run with HTTPS directly, but this requires more setup. Refer to Next.js documentation for custom server configuration.

## 🚀 Step 4: Start Your Development Server

1. **Start the Next.js dev server** (in one terminal):

```bash
cd storyblok-app
npm run dev
```

Your app should be running on `http://localhost:3000`

2. **Start the HTTPS proxy** (in another terminal, if using Method 1):

```bash
local-ssl-proxy --source 3010 --target 3000 --cert localhost.pem --key localhost-key.pem
```

Your app should now be accessible at `https://localhost:3010`

## 🔗 Step 5: Configure Storyblok Space Settings

1. Go to your Storyblok space
2. Navigate to **Settings → Visual Editor**
3. Set the **Location (URL)** to your HTTPS URL:
   - If using Method 1: `https://localhost:3010`
   - If using ngrok: `https://your-ngrok-url.ngrok.io`
4. Click **Save**

## ✅ Step 6: Test Live Preview

1. Open your Storyblok space
2. Go to **Content** and open any story
3. Click the **Visual Editor** button (or press `Ctrl/Cmd + E`)
4. You should see your Next.js app loaded in the preview panel
5. Make changes to your content - they should appear in real-time!

## 🎯 Using the Live Preview Route

The app includes a dedicated live preview route at `/live-preview/[[...slug]]` that:
- Always uses draft content
- Only works when `NEXT_PUBLIC_IS_PREVIEW=true`
- Provides the best preview experience

You can access it directly at:
- `https://localhost:3010/live-preview`
- `https://localhost:3010/live-preview/your-story-slug`

## 🐛 Troubleshooting

### Issue: Preview not loading in Storyblok

**Solutions:**
- Verify `NEXT_PUBLIC_IS_PREVIEW=true` is set in `.env.local`
- Ensure you're using HTTPS (not HTTP)
- Check that `NEXT_PUBLIC_DOMAIN` matches your HTTPS URL exactly
- Restart your dev server after changing environment variables
- Check browser console for errors

### Issue: Certificate errors in browser

**Solutions:**
- Make sure you ran `mkcert -install` to install the local CA
- Try clearing browser cache
- Accept the certificate warning (it's safe for localhost)

### Issue: Proxy not working

**Solutions:**
- Ensure port 3000 is not already in use
- Check that the certificate files (`localhost.pem` and `localhost-key.pem`) exist
- Verify the proxy command syntax is correct
- Try using a different source port (e.g., 3011)

### Issue: "Story not found" in preview

**Solutions:**
- Ensure you're using a Preview token (not Public token)
- Check that `STORYBLOK_VERSION=draft` is set
- Verify the story exists in your Storyblok space
- Make sure the story is not archived

## 📝 Quick Reference

### Environment Variables for Preview

```env
NEXT_PUBLIC_IS_PREVIEW=true
NEXT_PUBLIC_DOMAIN=https://localhost:3010
NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN=your_preview_token
STORYBLOK_VERSION=draft
```

### Common Commands

```bash
# Start dev server
npm run dev

# Start HTTPS proxy (Method 1)
local-ssl-proxy --source 3010 --target 3000 --cert localhost.pem --key localhost-key.pem

# Generate new certificate
mkcert localhost
```

## 🎉 You're All Set!

Once configured, you can:
- Edit content in Storyblok and see changes instantly
- Use the Visual Editor to see your components in context
- Preview draft content before publishing
- Test responsive designs in the preview panel

Happy previewing! 🚀

