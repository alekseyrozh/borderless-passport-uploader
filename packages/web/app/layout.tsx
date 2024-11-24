import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Image from 'next/image';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});
const playfairDisplay = localFont({
  src: './fonts/PlayfairDisplay.ttf',
  variable: '--font-playfair-display',
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
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}

const Header = () => {
  return (
    <header className="bg-dark-brand py-7 px-10 rounded-b-xl max-w-[80rem] mx-auto">
      <Image
        src="./borderless.svg"
        className="w-[120px] h-[18px]"
        width={120}
        height={18}
        alt="borderless logo"
      />
    </header>
  );
};
