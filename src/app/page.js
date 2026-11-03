import CategorySection from "../components/layout/CategorySection";

import HeroSlider from "../components/ui/HeroSlider";
import ProductSection from "../components/layout/ProdukSection";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <HeroSlider/>
      <CategorySection/>
      <ProductSection />
    </main>
  );
}