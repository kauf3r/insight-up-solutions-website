import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import SolutionsSection from "@/components/SolutionsSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={0} />
      <main>
        <HeroSection />
        <ProductGrid 
          title="Featured Products"
          subtitle="Discover our flagship UAV platform and advanced payload systems trusted by professionals worldwide"
          maxProducts={3}
        />
        <SolutionsSection />
      </main>
      <Footer />
    </div>
  );
}