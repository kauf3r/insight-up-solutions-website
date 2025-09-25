import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Target, Zap } from "lucide-react";
import { Link } from "wouter";
import heroImage from '@assets/stock_images/high-tech_industrial_62ae4ce6.jpg';

export default function HeroSection() {
  const features = [
    { icon: Shield, label: "Enterprise Grade" },
    { icon: Target, label: "Precision Ready" },
    { icon: Zap, label: "Mission Critical" }
  ];

  return (
    <>
      {/* Full Width Hero Image */}
      <section className="relative w-full">
        <div className="relative w-full h-[400px] lg:h-[500px] overflow-hidden">
          <img
            src={heroImage}
            alt="Trinity Pro UAV System"
            className="w-full h-full object-cover"
            data-testid="img-hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 max-w-md">
              <h3 className="text-lg font-semibold text-foreground">Trinity Pro</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Professional UAV platform with modular payload system
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative bg-gradient-to-br from-background to-accent/20 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit mx-auto" data-testid="badge-new">
                New: Trinity Pro Platform
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight max-w-4xl mx-auto">
                Professional UAV Solutions for 
                <span className="text-primary"> Mission Success</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Trusted by professionals in surveying, agriculture, and public safety. 
                The Trinity Pro platform delivers enterprise-grade reliability with 
                cutting-edge payload integration.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <feature.icon className="h-4 w-4 text-primary" />
                  {feature.label}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild data-testid="button-explore-trinity">
                <Link href="/products/trinity-pro">
                  Explore Trinity Pro
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild data-testid="button-view-solutions">
                <Link href="/solutions">View Solutions</Link>
              </Button>
            </div>

            <div className="pt-8 border-t border-border max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <p className="text-sm text-muted-foreground">
                  Trusted by 500+ organizations worldwide
                </p>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    NDAA Compliant
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Blue UAS Cleared
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}