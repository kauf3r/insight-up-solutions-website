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
    <Card className={`group relative overflow-hidden hover-elevate transition-all duration-500 hover:shadow-2xl ${featured ? 'ring-2 ring-primary' : ''}`} data-testid={`card-product-${id}`}>
      {featured && (
        <div className="absolute -top-3 left-4 z-20">
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg" data-testid="badge-featured">
            Featured
          </Badge>
        </div>
      )}
      
      {/* Add compliance badges for certain products */}
      {(id === 'trinity-pro' || id === 'qube-640') && (
        <div className="absolute -top-3 right-4 z-20">
          <Badge variant="outline" className="bg-background/95 text-xs border-primary/20 shadow-sm" data-testid={`badge-compliance-${id}`}>
            NDAA Compliant
          </Badge>
        </div>
      )}
      
      <CardHeader className="p-0">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
          <img
            src={image}
            alt={name}
            className="w-full h-56 object-cover group-hover:scale-110 transition-all duration-700 ease-out"
            data-testid={`img-product-${id}`}
          />
          <div className="absolute top-4 right-4 z-10">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-foreground shadow-sm" data-testid={`badge-category-${id}`}>
              {category}
            </Badge>
          </div>
          
          {/* Quick action overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <Button size="sm" className="bg-white/90 text-foreground hover:bg-white shadow-lg backdrop-blur-sm">
              Quick View
              <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-300" data-testid={`text-name-${id}`}>
              {name}
            </h3>
            {price && (
              <div className="text-right">
                <p className="text-lg font-bold text-foreground" data-testid={`text-price-${id}`}>
                  {price}
                </p>
              </div>
            )}
          </div>
          <p className="text-muted-foreground leading-relaxed" data-testid={`text-description-${id}`}>
            {description}
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">Technical Specs</h4>
          <div className="grid gap-2">
            {specifications.slice(0, 3).map((spec, index) => (
              <div key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                <span className="font-medium">{spec}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Button asChild className="w-full group/btn" data-testid={`button-learn-more-${id}`}>
            <Link href={`/products/${id}`}>
              <span className="group-hover/btn:translate-x-1 transition-transform duration-200">
                Learn More
              </span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
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
              className="flex-1 transition-all duration-200"
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