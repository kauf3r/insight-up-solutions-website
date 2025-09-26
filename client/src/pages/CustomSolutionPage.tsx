import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  ArrowRight, 
  CheckCircle, 
  Cog, 
  Wrench, 
  Code,
  Lightbulb
} from "lucide-react";
import { Link } from "wouter";

export default function CustomSolutionPage() {
  const services = [
    {
      icon: Cog,
      title: "Custom Payload Integration",
      description: "Seamlessly integrate specialized sensors and equipment with Trinity Pro platform"
    },
    {
      icon: Code,
      title: "Software Development",
      description: "Mission-specific software solutions and custom workflow automation"
    },
    {
      icon: Wrench,
      title: "System Configuration",
      description: "Tailored UAV system setup optimized for your unique operational requirements"
    },
    {
      icon: Lightbulb,
      title: "Innovation Consulting",
      description: "Explore new applications and push the boundaries of UAV technology"
    }
  ];

  const industries = [
    "Energy & Utilities",
    "Oil & Gas", 
    "Mining & Extraction",
    "Environmental Monitoring",
    "Research & Development",
    "Telecommunications",
    "Maritime Operations",
    "Industrial Inspection"
  ];

  const process = [
    {
      step: "01",
      title: "Requirements Analysis",
      description: "Deep dive into your operational challenges and technical requirements"
    },
    {
      step: "02", 
      title: "Solution Design",
      description: "Custom system architecture and integration planning with our engineering team"
    },
    {
      step: "03",
      title: "Development & Testing",
      description: "Prototype development, rigorous testing, and iterative refinement"
    },
    {
      step: "04",
      title: "Deployment & Training",
      description: "On-site deployment, comprehensive training, and ongoing support"
    }
  ];

  const examples = [
    {
      title: "Offshore Wind Inspection",
      description: "Custom long-range UAV system with specialized sensors for offshore wind turbine inspection and maintenance",
      challenge: "Remote offshore operations requiring extended flight range and specialized inspection payloads",
      solution: "Modified Trinity Pro with extended battery system and custom inspection sensor suite"
    },
    {
      title: "Pipeline Monitoring",
      description: "Automated pipeline inspection system with gas leak detection and thermal monitoring capabilities",
      challenge: "Continuous monitoring of extensive pipeline networks for safety and environmental compliance", 
      solution: "Custom software integration with specialized gas sensors and automated flight planning"
    },
    {
      title: "Research Platform",
      description: "Multi-sensor research platform for environmental monitoring and data collection",
      challenge: "Academic research requiring simultaneous data collection from multiple sensor types",
      solution: "Custom payload bay design with modular sensor integration and research-grade data logging"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Custom UAV Solutions - Specialized Applications & Integration | Insight Up Solutions"
        description="Custom UAV solutions and specialized applications with Trinity Pro platform. Tailored payload integration, mission-specific software development, and bespoke workflow solutions."
        ogTitle="Custom UAV Solutions & Specialized Applications"
        ogDescription="Design custom UAV solutions for specialized applications. Payload integration, software development, and tailored systems for unique operational requirements."
      />
      <Header cartItemCount={0} />
      
      <main>
        {/* Breadcrumb */}
        <section className="py-6 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/solutions" className="hover:text-primary transition-colors">Solutions</Link>
              <span>/</span>
              <span className="text-foreground">Custom Solutions</span>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-purple-500/10 to-purple-600/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500/10 p-3 rounded-lg">
                    <Settings className="h-8 w-8 text-purple-600" />
                  </div>
                  <Badge variant="secondary" data-testid="badge-solution-category">
                    Custom Solutions
                  </Badge>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground" data-testid="text-solution-title">
                  Tailored UAV Systems for Specialized Applications
                </h1>
                <p className="text-xl text-muted-foreground" data-testid="text-solution-subtitle">
                  When standard solutions don't meet your unique requirements, our engineering team designs custom UAV systems with specialized payloads, mission-specific software, and bespoke workflows.
                </p>
                <div className="flex gap-4">
                  <Button size="lg" asChild data-testid="button-get-quote">
                    <Link href="/quote">
                      Discuss Your Project
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild data-testid="button-book-demo">
                    <Link href="/demo">
                      Schedule Consultation
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Custom Services */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-services-title">
                Custom Engineering Services
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-services-description">
                Our engineering team specializes in creating innovative UAV solutions for unique challenges
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <Card key={service.title} className="text-center hover-elevate" data-testid={`card-service-${index}`}>
                  <CardHeader>
                    <div className="bg-purple-500/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <service.icon className="h-8 w-8 text-purple-600" />
                    </div>
                    <CardTitle className="text-xl" data-testid={`text-service-title-${index}`}>
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground" data-testid={`text-service-description-${index}`}>
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Development Process */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-process-title">
                Custom Development Process
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-process-description">
                From concept to deployment, we guide you through every step of custom solution development
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((step, index) => (
                <div key={step.step} className="relative" data-testid={`process-step-${index}`}>
                  {index < process.length - 1 && (
                    <div className="hidden lg:block absolute top-6 left-16 w-full h-0.5 bg-border"></div>
                  )}
                  <Card className="relative z-10 hover-elevate">
                    <CardContent className="p-6 text-center">
                      <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mx-auto mb-4">
                        {step.step}
                      </div>
                      <h4 className="font-semibold text-foreground mb-2" data-testid={`text-process-title-${index}`}>
                        {step.title}
                      </h4>
                      <p className="text-sm text-muted-foreground" data-testid={`text-process-description-${index}`}>
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industry Applications */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-industries-title">
                  Specialized Industries
                </h2>
                <p className="text-lg text-muted-foreground" data-testid="text-industries-description">
                  We've developed custom solutions across diverse industries with unique operational challenges.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {industries.map((industry, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0" />
                      <span className="text-foreground" data-testid={`text-industry-${index}`}>
                        {industry}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-examples-title">
                  Success Stories
                </h2>
                <div className="space-y-4">
                  {examples.map((example, index) => (
                    <Card key={index} className="hover-elevate" data-testid={`card-example-${index}`}>
                      <CardContent className="p-6">
                        <h4 className="font-semibold text-foreground mb-2" data-testid={`text-example-title-${index}`}>
                          {example.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3" data-testid={`text-example-description-${index}`}>
                          {example.description}
                        </p>
                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="font-medium text-foreground">Challenge: </span>
                            <span className="text-muted-foreground" data-testid={`text-example-challenge-${index}`}>
                              {example.challenge}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Solution: </span>
                            <span className="text-muted-foreground" data-testid={`text-example-solution-${index}`}>
                              {example.solution}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-br from-purple-500/10 to-purple-600/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-cta-title">
                Ready to Innovate with Custom UAV Solutions?
              </h2>
              <p className="text-lg text-muted-foreground" data-testid="text-cta-description">
                Let's discuss your unique challenges and explore how we can create a tailored UAV solution that meets your specific requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild data-testid="button-contact-sales">
                  <Link href="/quote">
                    Start Your Project
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild data-testid="button-view-portfolio">
                  <Link href="/about">
                    Learn About Our Team
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