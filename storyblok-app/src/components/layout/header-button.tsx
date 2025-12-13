'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/components/button';

interface HeaderButtonProps {
  ctaText?: string;
  ctaLink?: string;
}

export function HeaderButton({ ctaText, ctaLink }: HeaderButtonProps) {
  if (!ctaText || !ctaLink) return null;

  return (
    <div className="flex items-center justify-end">
      <Button asChild variant="quaternary">
        <Link href={ctaLink}>{ctaText}</Link>
      </Button>
    </div>
  );
}
