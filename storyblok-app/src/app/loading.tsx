import { LottieAnimation } from '@/components/ui/components/lottie-animation';
import { getLottiePath } from '@/lib/lottie/animations';

export default function Loading() {
  return (
    <div
      data-loading
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-300 ease-in-out opacity-100"
    >
      <div className="w-64 h-64">
        <LottieAnimation
          src={getLottiePath('stork')}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}

