import Link from 'next/link';
import { LottieAnimation } from '@/components/ui/components/lottie-animation';
import { Button } from '@/components/ui/components/button';
import { getLottiePath } from '@/lib/lottie/animations';

export default function NotFound() {
  return (
    <div
      data-not-found
      className="relative z-[51] flex min-h-screen flex-col items-center justify-center bg-background"
    >
      <div className="mb-8 h-64 w-64">
        <LottieAnimation src={getLottiePath('baby')} className="h-full w-full" />
      </div>
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">Seite nicht gefunden</p>
      <Button asChild variant="quaternary" className="mt-6">
        <Link href="/">Zur Startseite</Link>
      </Button>
    </div>
  );
}
