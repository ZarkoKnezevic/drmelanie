'use client';

import { Button } from '@/components/ui/components/button';
import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4 p-8">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h2 className="text-2xl font-bold">Application Error</h2>
          <p className="text-muted-foreground text-center max-w-md">
            {error.message || 'An unexpected error occurred.'}
          </p>
          <Button onClick={reset} variant="primary">
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
}

