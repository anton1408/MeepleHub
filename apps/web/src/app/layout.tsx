import type { Metadata } from "next";
import "./globals.css";
import { Header } from '@/widgets/header';

export const metadata: Metadata = {
  title: "MeepleHub",
  description: "MeepleHub web application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
