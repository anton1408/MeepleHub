import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
