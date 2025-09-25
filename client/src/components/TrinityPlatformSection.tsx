import ProductCard from "./ProductCard";
import productImage1 from '@assets/stock_images/high-tech_industrial_62ae4ce6.jpg';

export default function TrinityPlatformSection() {
  const trinityPro = {
    id: "trinity-pro",
    name: "Quantum Systems Trinity Pro UAV Platform",
    category: "UAV Platform", 
    description: "Next-generation eVTOL fixed-wing mapping drone with Quantum-Skynode autopilot. Future-proof platform with 75,000+ proven flight hours globally.",
    image: productImage1,
    price: "Contact for Pricing",
    specifications: [
      "Flight time: 90 minutes maximum",
      "Max take-off weight: 5.75kg (12.68 lbs)", 
      "Wind tolerance: 11 m/s (21.4 kn)",
      "Max altitude: 5,500m (18,045 ft)",
      "Area coverage: 700 ha per flight",
      "IP 55 rated for harsh environments",
      "PPK included with iBase GNSS station"
    ],
    featured: true
  };

  return (
    <section className="py-20" data-testid="section-trinity-platform">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-trinity-platform-title">
            Trinity UAV Platform
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-trinity-platform-subtitle">
            The industry-leading Trinity Pro UAV platform engineered by Quantum Systems for professional mapping and surveying missions
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <ProductCard
            {...trinityPro}
            onQuoteRequest={() => console.log(`Quote requested for ${trinityPro.name}`)}
          />
        </div>
      </div>
    </section>
  );
}