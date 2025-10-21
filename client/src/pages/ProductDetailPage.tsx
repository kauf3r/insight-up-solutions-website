import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, CheckCircle, Phone, Mail } from "lucide-react";
import { Link } from "wouter";
import type { Product } from "@shared/schema";
import InquiryForm from "@/components/InquiryForm";

// Image mapping for products
const productImage1 = '/Trinity_Pro_1758836912459.jpg';
const productImage2 = '/QS_Site_Cameras_Overview_LR1_1758835586515.jpg';
const productImage3 = '/QS_Site_Cameras_Overview_P5_1758835926986.jpg';
const productImage4 = '/QS_Qube640_Feature_Image_Product_Page_1758836005589.jpg';
const productImage5 = '/qbase_3d_software.jpg';
const productImage6 = '/pix4dcatch_app.png';
const productImage7 = '/pix4dcloud_platform.jpg';
const productImage8 = '/correlator3d_software.png';
const emlidReachRX = '/emlid_reach_rx.png';
const emlidReachRS3 = '/emlid_reach_rs3.webp';
const emlidScanningKit = '/emlid_scanning_kit.webp';
const dragonfishStandard = '/stock_images/autel_dragonfish_uav_43757464.jpg';
const dragonfishPro = '/stock_images/autel_dragonfish_uav_49fa43f2.jpg';

const imageMap: Record<string, string> = {
  "Quantum Systems Trinity Pro UAV Platform": productImage1,
  "Sony ILX-LR1 for Trinity Pro": productImage2,
  "Phase One P5 for Trinity Pro": productImage3,
  "Qube 640 LiDAR for Trinity Pro": productImage4,
  "Oblique D2M for Trinity Pro": productImage4,
  "QBase 3D Mission Planning Software": productImage5,
  "Pix4DCatch Mobile 3D Scanner": productImage6,
  "PIX4Dcloud Processing Platform": productImage7,
  "SimActive Correlator3D Photogrammetry Suite": productImage8,
  "Pix4D & Emlid Scanning Kit": emlidScanningKit,
  "Emlid Reach RS3": emlidReachRS3,
  "Emlid Reach RX": emlidReachRX,
  "Autel Dragonfish Standard": dragonfishStandard,
  "Autel Dragonfish Pro": dragonfishPro,
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["/api/products", id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        throw new Error("Product not found");
      }
      return response.json();
    },
    enabled: !!id,
  });

  const handleQuoteSubmit = (data: any) => {
    console.log('Product quote request submitted:', data);
    alert('Quote request submitted successfully! We will contact you within 24 hours.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-64 mb-8"></div>
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="h-96 bg-muted rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-20 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Product Not Found</h1>
            <p className="text-lg text-muted-foreground mb-8">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  let specifications: string[] = [];
  if (product.specifications) {
    try {
      const parsed = typeof product.specifications === 'string' ? 
        JSON.parse(product.specifications) : 
        product.specifications;
      
      // Handle both array format and object format
      if (Array.isArray(parsed)) {
        specifications = parsed;
      } else if (typeof parsed === 'object' && parsed !== null) {
        // Convert object to array of "key: value" strings
        specifications = Object.entries(parsed).map(([key, value]) => {
          // Format key names nicely (camelCase to Title Case)
          const formattedKey = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
          return `${formattedKey}: ${value}`;
        });
      }
    } catch {
      specifications = [];
    }
  }

  const productImage = imageMap[product.name] || productImage1;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-6 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 sm:mb-8">
            <Button variant="ghost" size="sm" asChild data-testid="button-back">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-16">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={productImage}
                  alt={product.name}
                  className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
                  data-testid="img-product-detail"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-foreground shadow-sm">
                    {product.category}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-product-name">
                  {product.name}
                </h1>
                
                <div className="text-xl sm:text-2xl font-bold text-primary" data-testid="text-product-price">
                  {product.price || "Contact for Pricing"}
                </div>

                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed" data-testid="text-product-description">
                  {product.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button size="xl" onClick={() => document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' })} data-testid="button-request-quote">
                  Request Quote
                </Button>
                <Button variant="outline" size="xl" data-testid="button-download-specs">
                  <Download className="h-4 w-4 mr-2" />
                  Download Specs
                </Button>
              </div>

            </div>
          </div>

          {/* Specifications */}
          {specifications.length > 0 && (
            <Card className="mb-12 sm:mb-16">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">Technical Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {specifications.map((spec: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground" data-testid={`spec-item-${index}`}>
                        {spec}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features & Benefits */}
          <Card className="mb-12 sm:mb-16">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Why Choose This Solution?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">Professional Grade</h4>
                  <p className="text-sm text-muted-foreground">
                    Built to meet the demands of professional UAV operations
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">Trinity Integration</h4>
                  <p className="text-sm text-muted-foreground">
                    Seamlessly integrates with the Trinity Pro platform
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">Expert Support</h4>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive support from our technical experts
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quote Request Form */}
          <div id="quote-form" className="scroll-mt-20">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
                Get a Custom Quote
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                Interested in {product.name}? Get a personalized quote tailored to your specific requirements.
              </p>
            </div>
            
            <InquiryForm 
              type="quote"
              title={`Request Quote: ${product.name}`}
              description="Tell us about your project requirements and we'll provide a custom solution."
              onSubmit={handleQuoteSubmit}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}