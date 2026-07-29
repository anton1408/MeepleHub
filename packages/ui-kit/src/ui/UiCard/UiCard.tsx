import * as React from 'react';
import { cn } from '../../temp/utils';
import { cardStyles } from './UiCard.style';

function UiCard({ className, size = 'default', ...props }: React.ComponentProps<'div'> & { size?: 'default' | 'sm' }) {
  return <div data-slot="card" data-size={size} className={cn(cardStyles.card, className)} {...props} />;
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-header" className={cn(cardStyles.header, className)} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-title" className={cn(cardStyles.title, className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-description" className={cn(cardStyles.description, className)} {...props} />;
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-action" className={cn(cardStyles.action, className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn(cardStyles.content, className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-footer" className={cn(cardStyles.footer, className)} {...props} />;
}

export { UiCard, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
