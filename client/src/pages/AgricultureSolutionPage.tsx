import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sprout, 
  ArrowRight, 
  CheckCircle, 
  Leaf, 
  Droplets, 
  TrendingUp,
  Eye
} from "lucide-react";
import { Link } from "wouter";

export default function AgricultureSolutionPage() {
  const benefits = [
    {
      icon: Leaf,
      title: "Crop Health Monitoring",
      description: "Early detection of plant stress, disease, and nutrient deficiencies using multispectral imaging"
    },
    {
      icon: Droplets,
      title: "Precision Irrigation",
      description: "Optimize water usage with detailed moisture mapping and irrigation zone analysis"
    },
    {
      icon: TrendingUp,
      title: "Yield Optimization",
      description: "Maximize crop yields through data-driven insights and variable rate application mapping"
    },
    {
      icon: Eye,
      title: "Livestock Monitoring",
      description: "Monitor animal health, count livestock, and assess pasture conditions efficiently"
    }
  ];

  const applications = [
    "Crop Health Assessment",
    "Variable Rate Application Mapping", 
    "Irrigation Management",
    "Livestock Monitoring",
    "Pasture Analysis",
    "Pest & Disease Detection",
    "Yield Estimation",
    "Soil Analysis & Mapping"
  ];

  const features = [
    {
      title: "Multispectral Analysis",
      description: "Advanced sensor technology captures data beyond visible spectrum for comprehensive crop analysis"
    },
    {
      title: "NDVI Mapping",
      description: "Normalized Difference Vegetation Index provides precise vegetation health insights"
    },
    {
      title: "Prescription Maps",
      description: "Generate variable rate application maps for fertilizer, seed, and chemical applications"
    },
    {
      title: "Real-time Processing",
      description: "Cloud-based processing delivers actionable insights within hours of flight completion"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Precision Agriculture UAV Solutions - Crop Monitoring & Analysis | Insight Up Solutions"
        description="Advanced UAV precision agriculture solutions with Trinity Pro platform. Multispectral crop monitoring, irrigation optimization, and livestock management for modern farming operations."
        ogTitle="Precision Agriculture UAV Solutions"
        ogDescription="Transform your farming operations with UAV-based crop monitoring, irrigation optimization, and precision agriculture solutions using Trinity Pro technology."
      />
      <Header cartItemCount={0} />
      
      <main>
        {/* Breadcrumb */}
        <section className="py-6 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/solutions" className="hover:text-primary transition-colors">Solutions</Link>
              <span>/</span>
              <span className="text-foreground">Precision Agriculture</span>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-green-500/10 to-green-600/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500/10 p-3 rounded-lg">
                    <Sprout className="h-8 w-8 text-green-600" />
                  </div>
                  <Badge variant="secondary" data-testid="badge-solution-category">
                    Precision Agriculture
                  </Badge>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground" data-testid="text-solution-title">
                  Advanced Crop Monitoring & Agricultural Analytics
                </h1>
                <p className="text-xl text-muted-foreground" data-testid="text-solution-subtitle">
                  Revolutionize your farming operations with precision agriculture technology that delivers real-time crop health insights, optimizes resource usage, and maximizes yields through data-driven decision making.
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
                Transform Your Agricultural Operations
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-benefits-description">
                Leverage cutting-edge UAV technology to optimize crop yields, reduce costs, and make data-driven farming decisions
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={benefit.title} className="text-center hover-elevate" data-testid={`card-benefit-${index}`}>
                  <CardHeader>
                    <div className="bg-green-500/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <benefit.icon className="h-8 w-8 text-green-600" />
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

        {/* Applications & Features */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-applications-title">
                  Agricultural Applications
                </h2>
                <p className="text-lg text-muted-foreground" data-testid="text-applications-description">
                  Comprehensive solutions for modern farming challenges across crops and livestock operations.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {applications.map((app, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-foreground" data-testid={`text-application-${index}`}>
                        {app}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-features-title">
                  Advanced Features
                </h2>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <Card key={index} className="hover-elevate" data-testid={`card-feature-${index}`}>
                      <CardContent className="p-6">
                        <h4 className="font-semibold text-foreground mb-2" data-testid={`text-feature-title-${index}`}>
                          {feature.title}
                        </h4>
                        <p className="text-sm text-muted-foreground" data-testid={`text-feature-description-${index}`}>
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ROI Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-roi-title">
                Proven Return on Investment
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-roi-description">
                Our precision agriculture solutions deliver measurable results for farming operations
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center hover-elevate" data-testid="card-roi-yield">
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-green-600 mb-4">15-20%</div>
                  <h4 className="text-xl font-semibold text-foreground mb-2">Yield Increase</h4>
                  <p className="text-muted-foreground">
                    Average yield improvement through precision application and early problem detection
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover-elevate" data-testid="card-roi-input">
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-green-600 mb-4">25-30%</div>
                  <h4 className="text-xl font-semibold text-foreground mb-2">Input Reduction</h4>
                  <p className="text-muted-foreground">
                    Savings on fertilizers, pesticides, and water through targeted application
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover-elevate" data-testid="card-roi-time">
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-green-600 mb-4">75%</div>
                  <h4 className="text-xl font-semibold text-foreground mb-2">Time Savings</h4>
                  <p className="text-muted-foreground">
                    Faster field assessment compared to traditional ground-based methods
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-br from-green-500/10 to-green-600/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-cta-title">
                Ready to Optimize Your Farm Operations?
              </h2>
              <p className="text-lg text-muted-foreground" data-testid="text-cta-description">
                Discover how precision agriculture technology can increase yields, reduce costs, and improve sustainability on your farm.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild data-testid="button-contact-sales">
                  <Link href="/quote">
                    Request Farm Assessment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild data-testid="button-view-case-studies">
                  <Link href="/training">
                    Learn More
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