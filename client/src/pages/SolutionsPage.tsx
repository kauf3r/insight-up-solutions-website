import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Compass, Sprout, Shield, Settings, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "wouter";

interface Solution {
  icon: typeof Compass;
  title: string;
  description: string;
  applications: string[];
  href: string;
  featured?: boolean;
}

export default function SolutionsPage() {
  const solutions: Solution[] = [
    {
      icon: Compass,
      title: "Surveying & Mapping",
      description: "High-precision mapping and surveying solutions for construction, mining, and infrastructure projects.",
      applications: [
        "Topographic surveys",
        "Volume calculations", 
        "3D modeling",
        "Progress monitoring"
      ],
      href: "/solutions/surveying",
      featured: true
    },
    {
      icon: Sprout,
      title: "Precision Agriculture",
      description: "Advanced crop monitoring and agricultural analytics for optimized farming operations.",
      applications: [
        "Crop health monitoring with multispectral analysis",
        "Variable rate application mapping",
        "Livestock monitoring and management", 
        "Precision irrigation optimization"
      ],
      href: "/solutions/agriculture"
    },
    {
      icon: Shield,
      title: "Public Safety",
      description: "Emergency response and security applications for first responders and law enforcement.",
      applications: [
        "Search & rescue",
        "Disaster assessment",
        "Perimeter security",
        "Traffic monitoring"
      ],
      href: "/solutions/public-safety"
    },
    {
      icon: Settings,
      title: "Custom Solutions",
      description: "Tailored UAV systems engineered for specialized applications and unique operational requirements.",
      applications: [
        "Custom payload integration",
        "Mission-specific software development",
        "Specialized sensor configurations",
        "Bespoke workflow solutions"
      ],
      href: "/solutions/custom"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="UAV Solutions for Every Industry - Insight Up Solutions"
        description="Professional UAV solutions for surveying & mapping, precision agriculture, public safety, and custom applications. Proven Trinity Pro platform technology for diverse industry needs."
        ogTitle="Professional UAV Solutions - Insight Up Solutions"
        ogDescription="Discover UAV solutions tailored for your industry: surveying, agriculture, public safety, and custom applications with proven Trinity Pro technology."
      />
      <Header cartItemCount={0} />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <Badge variant="secondary" className="mb-4" data-testid="badge-solutions">
                Industry Solutions
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground" data-testid="text-solutions-title">
                UAV Solutions for Every Industry
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-solutions-subtitle">
                From surveying and agriculture to public safety and custom applications, discover how our proven Trinity Pro platform delivers results across industries
              </p>
            </div>
          </div>
        </section>

        {/* Solutions Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {solutions.map((solution, index) => (
                <Card 
                  key={solution.title} 
                  className={`group hover-elevate transition-all duration-300 ${solution.featured ? 'ring-2 ring-primary' : ''}`}
                  data-testid={`card-solution-${index}`}
                >
                  {solution.featured && (
                    <div className="absolute top-4 left-4 z-10">
                      <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg" data-testid="badge-featured-solution">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <solution.icon className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors" data-testid={`text-solution-title-${index}`}>
                          {solution.title}
                        </CardTitle>
                        <p className="text-muted-foreground" data-testid={`text-solution-description-${index}`}>
                          {solution.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Key Applications</h4>
                      <div className="grid gap-3">
                        {solution.applications.map((app, appIndex) => (
                          <div key={appIndex} className="flex items-start gap-3 text-sm">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground leading-relaxed" data-testid={`text-application-${index}-${appIndex}`}>
                              {app}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button 
                      size="lg" 
                      asChild 
                      className="w-full group/btn"
                      data-testid={`button-explore-solution-${index}`}
                    >
                      <Link href={solution.href}>
                        <span className="group-hover/btn:translate-x-1 transition-transform duration-200">
                          Explore Solution
                        </span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-cta-title">
                Need a Custom Solution?
              </h2>
              <p className="text-lg text-muted-foreground" data-testid="text-cta-description">
                Every industry has unique challenges. Let us design a UAV solution tailored specifically for your requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild data-testid="button-contact-custom">
                  <Link href="/solutions/custom">
                    Explore Custom Solutions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild data-testid="button-book-consultation">
                  <Link href="/demo">
                    Book Consultation
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}