import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrinityPlatformSection from "@/components/TrinityPlatformSection";
import ProductGrid from "@/components/ProductGrid";
import SolutionsSection from "@/components/SolutionsSection";
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
          categoryFilter={["Trinity Payload"]}
          maxProducts={6}
          showViewAll={false}
          dataTestIdPrefix="hardware"
        />
        <ProductGrid 
          title="Software Solutions"
          subtitle="Advanced processing and mission planning software to maximize your UAS platform capabilities and streamline your UAV operations"
          excludeTrinityPro={true}
          categoryFilter={["Trinity Software", "Software"]}
          maxProducts={6}
          showViewAll={false}
          dataTestIdPrefix="software"
        />
        <SolutionsSection />
      </main>
      <Footer />
    </div>
  );
}