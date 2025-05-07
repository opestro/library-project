import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import Layout from "../components/layout/Layout";
import HeroSection from "../components/sections/HeroSection";
import AgesSection from "../components/sections/AgesSection";
import CategoriesSection from "../components/sections/CategoriesSection";
import DocumentsSection from "../components/sections/DocumentsSection";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

/**
 * Home page component
 * Displays hero section, featured ages, categories, and recent documents
 */
export default function HomePage() {
  return (
    <Layout>
      <HeroSection />
      <AgesSection limit={4} />
      <CategoriesSection limit={6} />
      <DocumentsSection limit={6} title="أحدث الوثائق" />
    </Layout>
  );
}
