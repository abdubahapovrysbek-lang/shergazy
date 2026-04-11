import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rysbek AI — Admin',
  description: 'Admin dashboard for Rysbek AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
