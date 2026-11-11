import { Suspense } from "react";
import { connection } from "next/server";
import CategorySection from "../components/layout/CategorySection";
import HeroSlider from "../components/ui/HeroSlider";
import ProductSection from "../components/layout/ProdukSection";
import { createClient as createSupabaseClient } from "../utils/supabase/server";

async function CatalogSections() {
    await connection();
  let categories = [];
  let products = [];
  let categoriesError = false;
  let productsError = false;

  const supabase = await createSupabaseClient();

  if (supabase) {
    const [categoryResult, productResult] = await Promise.all([
      supabase.from("categories").select("*"),
      supabase.from("products").select("*"),
    ]);

    categories = categoryResult.data ?? [];
    products = productResult.data ?? [];
    categoriesError = Boolean(categoryResult.error);
    productsError = Boolean(productResult.error);
  }

  return (
    <>
      <CategorySection categories={categories} hasError={categoriesError} />
      <ProductSection
        categories={categories}
        products={products}
        hasError={productsError || !supabase}
      />
    </>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <HeroSlider />
      <Suspense
        fallback={
          <div className="px-5 py-16 text-center text-sm text-slate-600">
            Memuat katalog...
          </div>
        }
      >
        <CatalogSections />
      </Suspense>
    </main>
  );
}