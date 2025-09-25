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
    <section className="relative bg-gradient-to-br from-background to-accent/20 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit" data-testid="badge-new">
                New: Trinity Pro Platform
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Professional UAV Solutions for 
                <span className="text-primary"> Mission Success</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Trusted by professionals in surveying, agriculture, and public safety. 
                The Trinity Pro platform delivers enterprise-grade reliability with 
                cutting-edge payload integration.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <feature.icon className="h-4 w-4 text-primary" />
                  {feature.label}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
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

            <div className="pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Trusted by 500+ organizations worldwide
              </p>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-lg bg-card border border-border">
              <img
                src={heroImage}
                alt="Trinity Pro UAV System"
                className="w-full h-[500px] object-cover"
                data-testid="img-hero"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold text-foreground">Trinity Pro</h3>
                  <p className="text-sm text-muted-foreground">
                    Professional UAV platform with modular payload system
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}