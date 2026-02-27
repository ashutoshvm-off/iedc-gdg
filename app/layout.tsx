import type { Metadata } from 'next';
import { Spline_Sans, Patrick_Hand } from 'next/font/google';
import './globals.css';

const splineSans = Spline_Sans({
  subsets: ['latin'],
  variable: '--font-display',
});

const patrickHand = Patrick_Hand({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-hand',
});

export const metadata: Metadata = {
  title: 'Vibe Coding Quest',
  description: 'Unleash your daily spark with vibe coding',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${splineSans.variable} ${patrickHand.variable}`}>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#FFFBF4] text-[#1a1a1a] transition-colors duration-300 font-display selection:bg-[#FFD93D] selection:text-[#2C3E50] antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
