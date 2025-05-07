import { useState } from "react";
import Layout from "../../components/layout/Layout";
import AgesSection from "../../components/sections/AgesSection";

/**
 * Ages listing page
 * Shows all historical ages with filtering options
 */
export default function AgesPage() {
  return (
    <Layout>
      <div className="pt-12 pb-4">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              العصور التاريخية
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              استكشف مختلف العصور التاريخية وتعرف على أهم الأحداث والوثائق المرتبطة بكل عصر.
            </p>
          </div>
        </div>
      </div>

      <AgesSection showViewAll={false} limit={100} />
    </Layout>
  );
} 