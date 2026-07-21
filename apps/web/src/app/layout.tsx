import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/widgets/header';
import { Inter } from 'next/font/google';
import { cn } from '@repo/ui-kit';

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
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
