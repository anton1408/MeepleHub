'use client';

import { cn } from '@meeplehub/ui-kit';
import { ChessKnight } from '@meeplehub/ui-kit/icons';
import { useRouter } from 'next/navigation';

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  const router = useRouter();

  return (
    <div className={cn('flex cursor-pointer items-center gap-1', className)} onClick={() => router.push('/')}>
      <ChessKnight />
      <span className="text-xl font-bold">MeepleHub</span>
    </div>
  );
}
