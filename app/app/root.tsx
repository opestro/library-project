import { useEffect } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import "./app.css";
import pb from "./lib/pocketbase";

/**
 * Root layout component
 * Handles global app setup and provides the base HTML structure
 */
export default function App() {
  // Initialize PocketBase connection
  useEffect(() => {
    // You can add any global PocketBase setup here
    // For example, handling authentication state changes
    pb.authStore.onChange(() => {
      console.log("Auth state changed:", pb.authStore.isValid);
    });
  }, []);

  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/**
 * Error boundary component
 */
export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>خطأ!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              عذراً! حدث خطأ غير متوقع
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              {error.message}
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              العودة إلى الصفحة الرئيسية
            </a>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
