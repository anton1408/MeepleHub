import { cn } from '@meeplehub/ui-kit';

type HeaderProps = {
  className?: string;
};

export default function Header({ className }: HeaderProps) {
  return <div className={cn('bg-card h-18 w-full', className)}></div>;
}
