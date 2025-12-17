import Image from 'next/image';
import { cn } from '@/utils';

interface CornerImageProps {
  position?: 'left_top' | 'left_bottom' | 'right_top' | 'right_bottom' | 'pattern';
  className?: string;
}

export function CornerImage({ position, className }: CornerImageProps) {
  // If no position is selected, don't show anything
  if (!position) {
    return null;
  }

  // If "pattern" is selected, show background pattern
  if (position === 'pattern') {
    return (
      <div
        className={cn('pointer-events-none absolute inset-0 z-[1]', className)}
        style={{
          backgroundImage: 'url(/pattern/hummingbirds.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '150px auto',
          opacity: 0.2,
        }}
      />
    );
  }

  // If corner position is selected, show hummingbirds image at that corner
  const positionClasses = {
    left_top: 'left-0 top-0',
    left_bottom: 'left-0 bottom-0',
    right_top: 'right-0 top-0',
    right_bottom: 'right-0 bottom-0',
  };

  return (
    <div
      className={cn(
        'pointer-events-none absolute z-[1] h-[150px] w-auto md:h-[200px] lg:h-[200px] xl:h-[250px]',
        positionClasses[position],
        className
      )}
      style={{ opacity: 0.2 }}
    >
      <Image
        src="/pattern/hummingbirds.png"
        alt="Hummingbirds decoration"
        width={300}
        height={300}
        className="h-full w-auto object-contain"
      />
    </div>
  );
}
