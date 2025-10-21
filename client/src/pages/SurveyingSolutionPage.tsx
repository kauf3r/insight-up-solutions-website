import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Compass, 
  ArrowRight, 
  CheckCircle, 
  MapPin, 
  Ruler, 
  Mountain,
  Building,
  ArrowLeft
} from "lucide-react";
import { Link } from "wouter";

export default function SurveyingSolutionPage() {
  const benefits = [
    {
      icon: MapPin,
      title: "Precision Mapping",
      description: "Sub-centimeter accuracy with advanced photogrammetry and LiDAR technology"
    },
    {
      icon: Ruler,
      title: "Volume Calculations",
      description: "Automated stockpile and earthwork volume measurements with verified accuracy"
    },
    {
      icon: Mountain,
      title: "Terrain Analysis",
      description: "Detailed topographic surveys and digital elevation models for any terrain"
    },
    {
      icon: Building,
      title: "Progress Monitoring",
      description: "Time-series analysis to track construction and development progress"
    }
  ];

  const applications = [
    "Topographic Surveys",
    "Construction Site Monitoring", 
    "Mining & Quarry Operations",
    "Infrastructure Inspection",
    "Land Development Planning",
    "Environmental Assessment",
    "Corridor Mapping",
    "Volume & Stockpile Analysis"
  ];

  const equipment = [
    {
      name: "Trinity Pro UAV Platform",
      description: "90-minute flight time, 700ha coverage per flight"
    },
    {
      name: "Sony ILX-LR1 Camera",
      description: "61MP RGB camera with 1.57cm/px GSD at 100m"
    },
    {
      name: "Phase One P5 Camera", 
      description: "128MP medium format with 0.5cm RMS accuracy"
    },
    {
      name: "Qube 640 LiDAR",
      description: "320,000 pts/sec with 176° FOV, 32km corridor capability"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Surveying & Mapping UAV Solutions - Precision Aerial Surveys | Insight Up Solutions"
        description="Professional UAV surveying and mapping solutions with Trinity Pro platform. Sub-centimeter accuracy for construction, mining, and infrastructure projects using advanced LiDAR and photogrammetry."
        ogTitle="Precision UAV Surveying & Mapping Solutions"
        ogDescription="High-accuracy aerial surveys with Trinity Pro UAV platform. LiDAR, photogrammetry, and mapping solutions for construction, mining, and infrastructure projects."
      />
      <Header cartItemCount={0} />
      
      <main>
        {/* Breadcrumb */}
        <section className="py-6 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/solutions" className="hover:text-primary transition-colors">Solutions</Link>
              <span>/</span>
              <span className="text-foreground">Surveying & Mapping</span>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Compass className="h-8 w-8 text-primary" />
                  </div>
                  <Badge variant="secondary" data-testid="badge-solution-category">
                    Surveying & Mapping
                  </Badge>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground" data-testid="text-solution-title">
                  Precision Aerial Surveys & Mapping
                </h1>
                <p className="text-xl text-muted-foreground" data-testid="text-solution-subtitle">
                  Transform your surveying operations with sub-centimeter accuracy mapping, automated volume calculations, and real-time progress monitoring using our advanced Trinity Pro UAV platform.
                </p>
                <div className="flex gap-4">
                  <Button size="lg" asChild data-testid="button-get-quote">
                    <Link href="/quote">
                      Get Custom Quote
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild data-testid="button-book-call">
                    <Link href="/demo">
                      Book a Call
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-benefits-title">
                Why Choose UAV Surveying?
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-benefits-description">
                Achieve faster data collection, improved safety, and higher accuracy compared to traditional surveying methods
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={benefit.title} className="text-center hover-elevate" data-testid={`card-benefit-${index}`}>
                  <CardHeader>
                    <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <benefit.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl" data-testid={`text-benefit-title-${index}`}>
                      {benefit.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground" data-testid={`text-benefit-description-${index}`}>
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Applications */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-applications-title">
                  Surveying Applications
                </h2>
                <p className="text-lg text-muted-foreground" data-testid="text-applications-description">
                  Our UAV surveying solutions serve diverse industries with precision mapping and data collection capabilities.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {applications.map((app, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-foreground" data-testid={`text-application-${index}`}>
                        {app}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Card data-testid="card-equipment-specs">
                <CardHeader>
                  <CardTitle className="text-2xl">Equipment Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {equipment.map((item, index) => (
                    <div key={index} className="space-y-2 p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold text-foreground" data-testid={`text-equipment-name-${index}`}>
                        {item.name}
                      </h4>
                      <p className="text-sm text-muted-foreground" data-testid={`text-equipment-description-${index}`}>
                        {item.description}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-cta-title">
                Ready to Transform Your Surveying Operations?
              </h2>
              <p className="text-lg text-muted-foreground" data-testid="text-cta-description">
                Discover how our precision UAV surveying solutions can improve accuracy, reduce costs, and accelerate your project timelines.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild data-testid="button-contact-sales">
                  <Link href="/quote">
                    Request Custom Quote
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild data-testid="button-view-equipment">
                  <Link href="/products">
                    View Equipment
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