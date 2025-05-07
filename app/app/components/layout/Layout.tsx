import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

/**
 * Layout component that wraps page content with header and footer
 * Provides consistent page structure across the application
 */
interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
} 