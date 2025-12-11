import { HeaderButton } from './header-button';

interface SiteHeaderProps {
  ctaText?: string;
  ctaLink?: string;
}

export function SiteHeader({ ctaText, ctaLink }: SiteHeaderProps) {
  return (
    <header className="absolute top-0 z-50 w-full bg-transparent">
      <div className="container flex h-16 items-center justify-end lg:h-24 xl:h-32">
        <HeaderButton ctaText="Termin Buchen" ctaLink="/termin_buchen" />
      </div>
    </header>
  );
}
