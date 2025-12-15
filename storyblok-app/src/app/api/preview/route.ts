import { NextRequest, NextResponse } from 'next/server';

/**
 * Preview API Route for Storyblok
 * 
 * This endpoint enables/disables preview mode for Storyblok.
 * Used by Storyblok's Visual Editor to enable draft content preview.
 */

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug') || 'home';

  // Verify secret (optional but recommended)
  const expectedSecret = process.env.STORYBLOK_PREVIEW_SECRET;
  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json(
      { message: 'Invalid secret' },
      { status: 401 }
    );
  }

  // Enable preview mode
  // Note: In Next.js 13+ App Router, preview mode is handled differently
  // We use environment variables instead of cookies for preview mode

  const redirectUrl = slug === 'home' ? '/' : `/${slug}`;
  
  return NextResponse.redirect(new URL(redirectUrl, request.url));
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { secret, slug = 'home' } = body;

  // Verify secret (optional but recommended)
  const expectedSecret = process.env.STORYBLOK_PREVIEW_SECRET;
  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json(
      { message: 'Invalid secret' },
      { status: 401 }
    );
  }

  const redirectUrl = slug === 'home' ? '/' : `/${slug}`;
  
  return NextResponse.json({
    success: true,
    redirect: redirectUrl,
  });
}



