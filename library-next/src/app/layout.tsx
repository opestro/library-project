import type { Metadata } from "next";
import { Amiri } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

// Configure Arabic font
const amiriFont = Amiri({
  weight: ['400', '700'],
  subsets: ['arabic'],
  variable: '--font-amiri',
});

export const metadata: Metadata = {
  title: "المكتبة التاريخية الرقمية",
  description: "منصة رقمية للوثائق والمخطوطات التاريخية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${amiriFont.variable}`}>
      <body className="min-h-screen bg-gray-50 font-sans dark:bg-gray-900 dark:text-white">
        {children}
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  );
}
