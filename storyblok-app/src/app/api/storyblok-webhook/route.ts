import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Storyblok Webhook Handler
 * 
 * This endpoint receives webhooks from Storyblok when content is published/unpublished.
 * It triggers a deployment to world4you.
 * 
 * Webhook events:
 * - story.published: Triggered when a story is published
 * - story.unpublished: Triggered when a story is unpublished
 */

// Verify webhook signature (optional but recommended)
function verifyWebhookSignature(
  body: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature || !secret) {
    return false; // Skip verification if secret not configured
  }

  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(body).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('webhook-signature');
    const webhookSecret = process.env.STORYBLOK_WEBHOOK_SECRET;

    // Verify webhook signature if secret is configured
    if (webhookSecret && !verifyWebhookSignature(body, signature, webhookSecret)) {
      console.error('[Webhook] Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const payload = JSON.parse(body);

    // Log webhook event
    console.log('[Webhook] Received event:', payload.action, payload.story?.id);

    // Only trigger deployment on publish/unpublish events
    const shouldDeploy = 
      payload.action === 'published' || 
      payload.action === 'unpublished';

    if (shouldDeploy) {
      // Trigger deployment
      // Option 1: Call external deployment service (e.g., GitHub Actions, CI/CD)
      // Option 2: Trigger local deployment script
      // Option 3: Send notification to deployment queue

      console.log('[Webhook] Triggering deployment...');
      
      // Example: Trigger GitHub Actions workflow (if using GitHub)
      if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
        try {
          const response = await fetch(
            `https://api.github.com/repos/${process.env.GITHUB_REPO}/dispatches`,
            {
              method: 'POST',
              headers: {
                'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                event_type: 'storyblok-publish',
                client_payload: {
                  story_id: payload.story?.id,
                  action: payload.action,
                },
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`GitHub API error: ${response.statusText}`);
          }

          console.log('[Webhook] Deployment triggered via GitHub Actions');
        } catch (error) {
          console.error('[Webhook] Failed to trigger GitHub Actions:', error);
        }
      }

      // Alternative: Call deployment script directly (if on same server)
      // This requires the deployment script to be accessible
      if (process.env.DEPLOYMENT_SCRIPT_URL) {
        try {
          const deployResponse = await fetch(process.env.DEPLOYMENT_SCRIPT_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.DEPLOYMENT_SCRIPT_SECRET}`,
            },
            body: JSON.stringify({
              trigger: 'storyblok-webhook',
              story_id: payload.story?.id,
              action: payload.action,
            }),
          });

          if (!deployResponse.ok) {
            throw new Error(`Deployment script error: ${deployResponse.statusText}`);
          }

          console.log('[Webhook] Deployment triggered via script');
        } catch (error) {
          console.error('[Webhook] Failed to trigger deployment script:', error);
        }
      }

      // If no deployment method is configured, just log
      if (!process.env.GITHUB_TOKEN && !process.env.DEPLOYMENT_SCRIPT_URL) {
        console.warn('[Webhook] No deployment method configured. Set GITHUB_TOKEN or DEPLOYMENT_SCRIPT_URL');
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook received',
      action: payload.action,
      story_id: payload.story?.id,
    });
  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Allow GET for webhook testing/verification
export async function GET() {
  return NextResponse.json({
    message: 'Storyblok webhook endpoint is active',
    timestamp: new Date().toISOString(),
  });
}



