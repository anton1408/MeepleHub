import { cn } from '@meeplehub/ui-kit';
import { Logo } from '@/shared/ui/Logo';
import { UiInput } from '@meeplehub/ui-kit/ui/UiInput';
import { UiButton } from '@meeplehub/ui-kit/ui/UiButton';

type HeaderProps = {
  className?: string;
};

export default function Header({ className }: HeaderProps) {
  return (
    <div className={cn('bg-card flex h-18 w-full items-center p-4', className)}>
      <Logo />
      <UiInput border-radius="full" type="search" placeholder="Search..." className="ml-8 max-w-xs" />
      <div className="ml-auto flex items-center gap-2">
        <UiButton variant={'secondary'}>Login</UiButton>
        <UiButton>Sign Up</UiButton>
      </div>
    </div>
  );
}
