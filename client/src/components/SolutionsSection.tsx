import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass, Sprout, Shield, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface Solution {
  icon: typeof Compass;
  title: string;
  description: string;
  applications: string[];
  href: string;
}

export default function SolutionsSection() {
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
      href: "/solutions/surveying"
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
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-accent/5 to-accent/15" data-testid="section-solutions">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Solutions</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            Industry-Leading
            <span className="block text-primary">Applications</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our UAV platforms are trusted by professionals across diverse industries, 
            delivering mission-critical data and insights that drive informed decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <Card key={index} className="group relative overflow-hidden hover-elevate transition-all duration-500 hover:shadow-2xl bg-background/50 backdrop-blur-sm border-border/50" data-testid={`card-solution-${index}`}>
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="space-y-6 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <solution.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors duration-300" data-testid={`text-solution-title-${index}`}>
                  {solution.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6 relative z-10">
                <p className="text-muted-foreground leading-relaxed" data-testid={`text-solution-description-${index}`}>
                  {solution.description}
                </p>

                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground uppercase tracking-wide text-sm">Key Applications</h4>
                  <div className="grid gap-3">
                    {solution.applications.map((app, appIndex) => (
                      <div key={appIndex} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="font-medium leading-relaxed">{app}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild 
                  className="w-full transition-all duration-300 group/btn"
                  data-testid={`button-learn-more-${index}`}
                >
                  <Link href={solution.href}>
                    <span className="group-hover/btn:translate-x-1 transition-transform duration-200">
                      Learn More
                    </span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-20">
          <div className="inline-flex flex-col items-center space-y-4">
            <p className="text-muted-foreground">Ready to explore all applications?</p>
            <Button size="lg" className="px-8 py-3 shadow-lg group" asChild data-testid="button-view-all-solutions">
              <Link href="/solutions">
                <span className="group-hover:translate-x-1 transition-transform duration-200">
                  View All Solutions
                </span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}