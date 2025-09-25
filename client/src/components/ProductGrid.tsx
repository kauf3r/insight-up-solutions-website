import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import productImage1 from '@assets/stock_images/high-tech_industrial_62ae4ce6.jpg';
import productImage2 from '@assets/stock_images/high-tech_industrial_0d5a74ba.jpg';
import productImage3 from '@assets/stock_images/high-tech_industrial_23684b9f.jpg';

interface ProductGridProps {
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  maxProducts?: number;
}

export default function ProductGrid({ 
  title = "Our Products",
  subtitle = "Professional UAV solutions for every mission",
  showViewAll = true,
  maxProducts = 3 
}: ProductGridProps) {
  // TODO: Remove mock data when implementing real product data
  const products = [
    {
      id: "trinity-pro",
      name: "Trinity Pro UAV Platform",
      category: "UAV Platform", 
      description: "Quantum Systems Trinity Pro - The foundation platform designed for seamless payload integration and mission-critical applications.",
      image: productImage1,
      price: "Contact for Pricing",
      specifications: [
        "Flight time: Up to 45 minutes",
        "Max payload: 2.5kg", 
        "Wind resistance: 15 m/s",
        "Operating temp: -10°C to +50°C",
        "GPS accuracy: ±2cm RTK"
      ],
      featured: true
    },
    {
      id: "ilx-lr1",
      name: "Sony ILX-LR1 for Trinity Pro",
      category: "Trinity Payload",
      description: "High-resolution 61MP imaging sensor specifically integrated for Trinity Pro platform. Perfect for surveying and mapping missions.",
      image: productImage2,
      price: "$8,500",
      specifications: [
        "Trinity Pro compatible mount",
        "Resolution: 61MP full-frame", 
        "ISO range: 50-102,400",
        "Video: 4K 60fps",
        "Weight: 647g optimized for Trinity"
      ],
      featured: false
    },
    {
      id: "qube-640",
      name: "Qube 640 for Trinity Pro",
      category: "Trinity Payload",
      description: "Advanced thermal imaging camera engineered for Trinity Pro integration. Ideal for agriculture monitoring and search & rescue operations.",
      image: productImage3,
      price: "$12,200",
      specifications: [
        "Trinity Pro gimbal integration",
        "Resolution: 640x512 thermal",
        "Temperature range: -40°C to +550°C", 
        "Accuracy: ±2°C or ±2%",
        "Real-time data to Trinity Pro"
      ],
      featured: false
    }
  ];

  const displayProducts = products.slice(0, maxProducts);

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