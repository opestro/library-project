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
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#007AFF" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={`${amiri.className} font-sans`}>
      <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
} 