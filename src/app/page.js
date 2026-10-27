import CategorySection from "@/components/CategorySection";
import Footer from "@/components/Footer";
import HeroSlider from "@/components/HeroSlider";
import Navbar from "@/components/Navbar";
import ProductSection from "@/components/ProdukSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <HeroSlider />

      <CategorySection />

      <ProductSection />

      <Footer />

    </main>
  );
}
