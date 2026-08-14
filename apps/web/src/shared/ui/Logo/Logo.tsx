import { cn } from '@meeplehub/ui-kit';
import { ChessKnight } from '@meeplehub/ui-kit/icons';

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <ChessKnight />
      <span className="text-xl font-bold">MeepleHub</span>
    </div>
  );
}
