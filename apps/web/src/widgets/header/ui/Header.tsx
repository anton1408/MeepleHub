import { cn } from '@meeplehub/ui-kit';
import { Logo } from '@/shared/ui/Logo';

type HeaderProps = {
  className?: string;
};

export default function Header({ className }: HeaderProps) {
  return (
    <div className={cn('bg-card h-18 w-full p-4', className)}>
      <Logo />
    </div>
  );
}
