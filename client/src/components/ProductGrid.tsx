import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import productImage1 from '@assets/Trinity Pro_1758836912459.jpg';
import productImage2 from '@assets/QS_Site_Cameras_Overview_LR1_1758835586515.jpg';
import productImage3 from '@assets/QS_Site_Cameras_Overview_P5_1758835926986.jpg';
import productImage4 from '@assets/QS_Qube640_Feature_Image_Product_Page_1758836005589.jpg';
import productImage5 from '@assets/qbase_3d_software.jpg';
import productImage6 from '@assets/pix4dcatch_app.png';
import productImage7 from '@assets/pix4dcloud_platform.jpg';
import productImage8 from '@assets/correlator3d_software.png';

// Image mapping for products
const imageMap: Record<string, string> = {
  "Quantum Systems Trinity Pro UAV Platform": productImage1,
  "Sony ILX-LR1 for Trinity Pro": productImage2,
  "Phase One P5 for Trinity Pro": productImage3,
  "Qube 640 LiDAR for Trinity Pro": productImage4,
  "Oblique D2M for Trinity Pro": productImage4, // Reusing LiDAR image for now
  "QBase 3D Mission Planning Software": productImage5,
  "Pix4DCatch Mobile 3D Scanner": productImage6,
  "PIX4Dcloud Processing Platform": productImage7,
  "SimActive Correlator3D Photogrammetry Suite": productImage8,
};

interface ProductGridProps {
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  maxProducts?: number;
  excludeTrinityPro?: boolean;
  categoryFilter?: string[];
  dataTestIdPrefix?: string;
}

export default function ProductGrid({ 
  title = "Our Products",
  subtitle = "Professional UAV solutions for every mission",
  showViewAll = true,
  maxProducts = 4,
  excludeTrinityPro = false,
  categoryFilter = [],
  dataTestIdPrefix = "products"
}: ProductGridProps) {
  const { data: apiProducts = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Transform API products to match component interface
  const products = apiProducts.map(product => {
    let specifications: string[] = [];
    if (product.specifications) {
      try {
        specifications = JSON.parse(product.specifications);
      } catch {
        specifications = [];
      }
    }

    return {
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description,
      image: imageMap[product.name] || productImage1,
      price: product.price || "Contact for Pricing",
      specifications,
      featured: product.name.includes("Trinity Pro")
    };
  });

  if (isLoading) {
    return (
      <section className="py-20" data-testid={`section-${dataTestIdPrefix}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">{title}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(maxProducts || 4)].map((_, index) => (
              <div key={index} className="bg-card rounded-lg p-6 animate-pulse">
                <div className="w-full h-48 bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20" data-testid={`section-${dataTestIdPrefix}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">{title}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Unable to load products at this time. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  let filteredProducts = products;
  
  // Filter out Trinity Pro UAV Platform if requested
  if (excludeTrinityPro) {
    filteredProducts = filteredProducts.filter(product => 
      product.category !== "UAV Platform" || !product.name.includes("Trinity Pro")
    );
  }
  
  // Filter by category if specified
  if (categoryFilter.length > 0) {
    filteredProducts = filteredProducts.filter(product => 
      categoryFilter.includes(product.category)
    );
  }
  
  const displayProducts = filteredProducts.slice(0, maxProducts);

  return (
    <section className="py-20 pt-[50px] pb-[50px]" data-testid={`section-${dataTestIdPrefix}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground" data-testid={`text-${dataTestIdPrefix}-title`}>
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid={`text-${dataTestIdPrefix}-subtitle`}>
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
            <Button size="lg" asChild data-testid={`button-view-all-${dataTestIdPrefix}`}>
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