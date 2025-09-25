import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Download } from "lucide-react";
import { Link } from "wouter";

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  price?: string;
  specifications: string[];
  featured?: boolean;
  onQuoteRequest?: () => void;
}

export default function ProductCard({
  id,
  name,
  category,
  description,
  image,
  price,
  specifications,
  featured = false,
  onQuoteRequest
}: ProductCardProps) {
  return (
    <Card className={`group hover-elevate transition-all duration-300 ${featured ? 'ring-2 ring-primary' : ''}`} data-testid={`card-product-${id}`}>
      {featured && (
        <div className="absolute -top-3 left-4 z-10">
          <Badge className="bg-primary text-primary-foreground" data-testid="badge-featured">
            Featured
          </Badge>
        </div>
      )}
      
      {/* Add compliance badges for certain products */}
      {(id === 'trinity-pro' || id === 'qube-640') && (
        <div className="absolute -top-3 right-4 z-10">
          <Badge variant="outline" className="bg-background text-xs" data-testid={`badge-compliance-${id}`}>
            NDAA Compliant
          </Badge>
        </div>
      )}
      
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            data-testid={`img-product-${id}`}
          />
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" data-testid={`badge-category-${id}`}>
              {category}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground" data-testid={`text-name-${id}`}>
            {name}
          </h3>
          <p className="text-muted-foreground text-sm" data-testid={`text-description-${id}`}>
            {description}
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Key Specifications:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {specifications.slice(0, 3).map((spec, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-1 h-1 bg-primary rounded-full" />
                {spec}
              </li>
            ))}
          </ul>
        </div>

        {price && (
          <div className="pt-2 border-t border-border">
            <p className="text-lg font-semibold text-foreground" data-testid={`text-price-${id}`}>
              {price}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2 pt-4">
          <Button asChild size="sm" data-testid={`button-learn-more-${id}`}>
            <Link href={`/products/${id}`}>
              Learn More
              <ArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                console.log(`Quote requested for ${name}`);
                onQuoteRequest?.();
              }}
              className="flex-1"
              data-testid={`button-quote-${id}`}
            >
              Request Quote
            </Button>
            <Button variant="ghost" size="sm" data-testid={`button-download-${id}`}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}