import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/widgets/header';
import { Inter } from 'next/font/google';
import { cn } from '@repo/ui-kit';
import { UiCard } from '@repo/ui-kit/ui/UiCard';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'MeepleHub',
  description: 'MeepleHub web application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={cn('font-sans', inter.variable)}>
      <body className="bg-background p-4">
        <UiCard>
          <Header className="border-b" />
          <h2>Lorem ipsum dolor sit amet.</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus asperiores commodi illo inventore ipsa
            nobis quae vitae.
          </p>
          {children}
        </UiCard>
      </body>
    </html>
  );
}
