import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrustSignals from "@/components/TrustSignals";
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
        <TrustSignals />
        <ProductGrid 
          title="Professional UAV Systems"
          subtitle="Precision-engineered platforms and sensors for mission-critical applications across surveying, agriculture, and public safety"
          maxProducts={3}
        />
        <SolutionsSection />
        <PartnershipsSection />
      </main>
      <Footer />
    </div>
  );
}