import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/widgets/header';
import { Inter } from 'next/font/google';
import { cn } from '@meeplehub/ui-kit';
import { UiCard } from '@meeplehub/ui-kit/ui/UiCard';

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
        <Providers>
          <UiCard>
            <Header className="border-b" />
            {children}
          </UiCard>
        </Providers>
      </body>
    </html>
  );
}
