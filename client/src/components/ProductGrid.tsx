import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import productImage1 from '@assets/Trinity Pro_1758836912459.jpg';
import productImage2 from '@assets/QS_Site_Cameras_Overview_LR1_1758835586515.jpg';
import productImage3 from '@assets/QS_Site_Cameras_Overview_P5_1758835926986.jpg';
import productImage4 from '@assets/QS_Qube640_Feature_Image_Product_Page_1758836005589.jpg';
import productImage5 from '@assets/qbase_3d_software.jpg';

interface ProductGridProps {
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  maxProducts?: number;
  excludeTrinityPro?: boolean;
}

export default function ProductGrid({ 
  title = "Our Products",
  subtitle = "Professional UAV solutions for every mission",
  showViewAll = true,
  maxProducts = 4,
  excludeTrinityPro = false 
}: ProductGridProps) {
  // TODO: Remove mock data when implementing real product data
  const products = [
    {
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
    },
    {
      id: "ilx-lr1",
      name: "Sony ILX-LR1 for Trinity Pro",
      category: "Trinity Payload",
      description: "Professional 61MP RGB camera with cutting-edge high-accuracy capabilities. Seamlessly integrates with Trinity Pro for exceptional image quality and streamlined workflows.",
      image: productImage2,
      price: "Contact for Pricing",
      specifications: [
        "Sensor: 61.0 MP (9504 × 6336 px)",
        "GSD @100m AGL: 1.57 cm/px", 
        "Coverage @120m AGL: 491 ha",
        "Ultra-compact Trinity Pro integration",
        "Direct camera control capability",
        "Advanced sensor technology"
      ],
      featured: false
    },
    {
      id: "phase-one-p5",
      name: "Phase One P5 for Trinity Pro",
      category: "Trinity Payload",
      description: "Revolutionary 128MP medium format survey-grade camera. Delivers 0.5 cm RMS accuracy with electronic global shutter for unparalleled precision mapping.",
      image: productImage3,
      price: "Contact for Pricing",
      specifications: [
        "Sensor: 128MP medium format CMOS",
        "Electronic global shutter",
        "GSD @60m: 0.26 cm/px (80mm lens)",
        "Coverage @120m: 135 ha (80mm lens)",
        "Survey-grade 0.5 cm RMS XY/Z accuracy",
        "Metrically calibrated lens & sensor"
      ],
      featured: false
    },
    {
      id: "qube-640",
      name: "Qube 640 LiDAR for Trinity Pro",
      category: "Trinity Payload",
      description: "Specialized LiDAR scanner co-developed with YellowScan. Features selectable 176° FOV and enables 32km corridor scanning in a single flight.",
      image: productImage4,
      price: "Contact for Pricing",
      specifications: [
        "Scanner: Hesai XT32M2X",
        "GNSS: SBG Quanta Micro",
        "Integrated 8MP RGB camera",
        "Laser range: 300m",
        "Precision: 3cm, Accuracy: 2.5cm",
        "Selectable FOV up to 176°",
        "50% productivity improvement vs Qube 240"
      ],
      featured: false
    },
    {
      id: "oblique-d2m",
      name: "Oblique D2M for Trinity Pro",
      category: "Trinity Payload",
      description: "Advanced five-lens RGB camera system for large-scale 3D photogrammetry. Combines 4 oblique and 1 NADIR camera for complex geometry capture and high-rise 3D mesh generation.",
      image: productImage2,
      price: "Contact for Pricing",
      specifications: [
        "5-camera system: 1 NADIR + 4 oblique",
        "Total resolution: 130 MP",
        "Individual sensors: 26 MP (6252 × 4168 px)",
        "GSD @100m AGL: 1.50 cm/px",
        "Trigger interval: ≥ 0.8 seconds",
        "CMOS sensor technology",
        "Optimized for 3D mesh generation"
      ],
      featured: false
    },
    {
      id: "qbase-3d",
      name: "QBase 3D Mission Planning Software",
      category: "Trinity Software",
      description: "All-in-one mission planning and monitoring software for Trinity Pro. Plan, execute and monitor aerial surveying missions with confidence using integrated 3D mission viewing and automated flight path generation.",
      image: productImage5,
      price: "Included with Trinity Pro",
      specifications: [
        "Integrated imagery and Digital Terrain Modeling",
        "3D mission viewing and planning interface",
        "Live monitoring of mission progress",
        "Automated safe flight path generation",
        "Advanced Terrain Following capability",
        "Integrated data post-processing tools",
        "Mission synchronization across devices"
      ],
      featured: false
    }
  ];

  const filteredProducts = excludeTrinityPro 
    ? products.filter(product => product.id !== "trinity-pro")
    : products;
  
  const displayProducts = filteredProducts.slice(0, maxProducts);

  return (
    <section className="py-20" data-testid="section-products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-products-title">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-products-subtitle">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onQuoteRequest={() => console.log(`Quote requested for ${product.name}`)}
            />
          ))}
        </div>

        {showViewAll && (
          <div className="text-center">
            <Button size="lg" asChild data-testid="button-view-all-products">
              <Link href="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}