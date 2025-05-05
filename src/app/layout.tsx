import type { Metadata } from 'next';
import { Amiri } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

// Define Arabic font
const amiri = Amiri({
  weight: ['400', '700'],
  subsets: ['arabic'],
  variable: '--font-amiri',
});

export const metadata: Metadata = {
  title: 'المكتبة التاريخية الرقمية',
  description: 'منصة للوثائق التاريخية الرقمية',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${amiri.className} font-sans`}>
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
} 