import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Target, Zap } from "lucide-react";
import { Link } from "wouter";
import trinityVideo from '@assets/0925 Trinity launch _1758826468109.mp4';

export default function HeroSection() {
  const features = [
    { icon: Shield, label: "Enterprise Grade" },
    { icon: Target, label: "Precision Ready" },
    { icon: Zap, label: "Mission Critical" }
  ];

  return (
    <>
      {/* Full Width Hero Video */}
      <section className="relative w-full">
        <div className="relative w-full h-[440px] lg:h-[550px] overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            data-testid="video-hero"
          >
            <source src={trinityVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute top-8 right-8 w-1/3">
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground">Insight Up Solutions</h3>
              <h4 className="text-md font-medium text-foreground mt-1">Professional UAV Solutions for Mission Success</h4>
              <p className="text-sm text-muted-foreground mt-2">
                We're advancing drone adoption industry-wide, partnering with leading UAV and sensor manufacturers to deploy integrated systems that transform data into actionable intelligence. From precision agriculture to critical infrastructure monitoring, our solutions deliver enterprise-grade reliability and proven results.
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
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight max-w-4xl mx-auto">
                Why Industry Leaders Choose <span className="text-primary">Insight Up Solutions</span>
              </h1>
              <h2 className="text-2xl lg:text-3xl font-semibold text-muted-foreground max-w-3xl mx-auto">
                Integrated. Reliable. Mission-Critical.
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                While others sell components, we deliver complete mission solutions. Our Trinity Pro platform integrates seamlessly with premium Sony, Phase One, and Qube sensors—giving you unmatched versatility and reliability in a single system. Experience the difference integrated engineering makes.
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
                  Book Your Demo Call
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild data-testid="button-view-solutions">
                <Link href="/solutions">Compare Solutions</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}