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
          <div className="absolute top-8 right-4 w-1/3 min-w-80 max-w-md">
            <div className="bg-black/70 backdrop-blur-md rounded-lg p-6 shadow-xl ring-1 ring-white/10">
              {/* Overline brand badge */}
              <div className="text-xs uppercase tracking-wide text-white/60 mb-2">Insight Up Solutions</div>
              
              {/* Main headline - larger and more prominent */}
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
                Advance Your Mission with Proven UAS Solutions
              </h3>
              
              {/* Performance metrics as highlighted pill */}
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-sm text-white/90 mb-4">
                <span className="font-semibold text-[#ffffffe6] bg-[transparent]">Multi-industry</span>
                <span className="text-white/60">•</span>
                <span className="font-semibold">Scalable solutions</span>
              </div>
              
              {/* Concise body text */}
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                Professional UAS systems deliver precision data collection, enhanced safety, and operational efficiency across industries.
              </p>
              
              {/* Inline CTA */}
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20" asChild data-testid="button-hero-demo">
                <Link href="/demo">Book Demo</Link>
              </Button>
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
              <h2 className="text-2xl lg:text-3xl font-semibold text-muted-foreground max-w-3xl mx-auto">Integrated. Reliable. Mission Critical. Collaboration.</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">While others sell components, we deliver complete mission solutions. Our offerings include the Quantum Systems Trinity Pro platform, which integrates seamlessly with premium Sony, Phase One, and Qube sensors; giving you unmatched versatility and reliability in a single system. Experience the difference integrated engineering makes.</p>
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
              <Button size="lg" asChild data-testid="button-book-demo-call">
                <Link href="/demo">
                  Book Your Demo Call
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild data-testid="button-view-solutions">
                <Link href="/solutions">Compare Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}