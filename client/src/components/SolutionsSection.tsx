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
        "Crop health analysis",
        "Yield prediction",
        "Irrigation planning",
        "Pest detection"
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
    <section className="py-20 bg-accent/10" data-testid="section-solutions">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Industry Solutions
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our UAV platforms are trusted by professionals across diverse industries, 
            delivering mission-critical data and insights that drive informed decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <Card key={index} className="group hover-elevate transition-all duration-300" data-testid={`card-solution-${index}`}>
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <solution.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl" data-testid={`text-solution-title-${index}`}>
                  {solution.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <p className="text-muted-foreground" data-testid={`text-solution-description-${index}`}>
                  {solution.description}
                </p>

                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Key Applications:</h4>
                  <ul className="space-y-2">
                    {solution.applications.map((app, appIndex) => (
                      <li key={appIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {app}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                  data-testid={`button-learn-more-${index}`}
                >
                  <Link href={solution.href}>
                    Learn More
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button size="lg" asChild data-testid="button-view-all-solutions">
            <Link href="/solutions">
              View All Solutions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}