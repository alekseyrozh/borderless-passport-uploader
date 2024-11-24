import { Header } from '@/components/header';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Toaster } from 'sonner';
import './globals.css';
import { Providers } from '@/components/providers';

const playfairDisplay = localFont({
  src: './fonts/PlayfairDisplay.ttf',
  variable: '--font-playfair-display',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Borderless Passport Uploader',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfairDisplay.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Header />
          {children}
          <Toaster richColors expand />
        </Providers>
      </body>
    </html>
  );
}
