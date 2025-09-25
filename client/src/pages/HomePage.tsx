import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrinityPlatformSection from "@/components/TrinityPlatformSection";
import ProductGrid from "@/components/ProductGrid";
import SolutionsSection from "@/components/SolutionsSection";
import PartnershipsSection from "@/components/PartnershipsSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={0} />
      <main>
        <HeroSection />
        <TrinityPlatformSection />
        <ProductGrid 
          title="Trinity Platform Payloads"
          subtitle="Professional payload systems engineered for the Quantum Systems Trinity Pro platform, delivering mission-critical data capture capabilities"
          excludeTrinityPro={true}
          maxProducts={3}
        />
        <SolutionsSection />
        <PartnershipsSection />
      </main>
      <Footer />
    </div>
  );
}