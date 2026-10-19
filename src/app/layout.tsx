import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Klub Sports | Premium Sports Footwear Manufacturer',
  description:
    'Official corporate website for Klub Sports. Sports footwear engineered for performance, comfort and institutional supply.',
  icons: {
    icon: '/brand/logo-icon.png',
    apple: '/brand/logo-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="min-h-screen bg-white font-sans text-stone-900 antialiased selection:bg-brand-orange-light selection:text-brand-orange-dark">
        {children}
      </body>
    </html>
  );
}
