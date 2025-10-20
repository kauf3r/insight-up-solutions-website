import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  ArrowRight, 
  CheckCircle, 
  Search, 
  AlertTriangle, 
  Camera,
  Radio
} from "lucide-react";
import { Link } from "wouter";

export default function PublicSafetySolutionPage() {
  const benefits = [
    {
      icon: Search,
      title: "Search & Rescue",
      description: "Rapid deployment for missing person searches with thermal and optical sensors"
    },
    {
      icon: AlertTriangle,
      title: "Emergency Response",
      description: "Real-time situational awareness for disaster assessment and emergency coordination"
    },
    {
      icon: Camera,
      title: "Surveillance & Security",
      description: "Persistent monitoring of critical infrastructure and event security"
    },
    {
      icon: Radio,
      title: "Communications Relay",
      description: "Temporary communication networks in disaster zones or remote operations"
    }
  ];

  const applications = [
    "Search & Rescue Operations",
    "Disaster Assessment", 
    "Perimeter Security",
    "Traffic Monitoring",
    "Fire Detection & Monitoring",
    "Border Patrol",
    "Event Security",
    "Critical Infrastructure Protection"
  ];

  const capabilities = [
    {
      title: "Thermal Imaging",
      description: "Day/night thermal imaging for person detection and heat signature analysis",
      specs: "FLIR thermal sensors with temperature measurement capabilities"
    },
    {
      title: "Real-time Video",
      description: "HD video streaming with zoom capabilities for live operational support",
      specs: "1080p+ video streaming with digital zoom and stabilization"
    },
    {
      title: "Extended Flight Time",
      description: "90-minute flight endurance for extended operations and wide area coverage",
      specs: "Up to 90 minutes flight time with 700ha area coverage"
    },
    {
      title: "All-Weather Operation",
      description: "IP55 rated platform capable of operating in challenging weather conditions",
      specs: "Wind tolerance up to 11 m/s (21.4 kn) with weather protection"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Public Safety UAV Solutions - Emergency Response & Security | Insight Up Solutions"
        description="Professional UAV solutions for public safety, emergency response, and security operations. Search & rescue, disaster assessment, and surveillance with Trinity Pro platform technology."
        ogTitle="Public Safety UAV Solutions"
        ogDescription="Enhance public safety operations with UAV technology for search & rescue, emergency response, security, and disaster assessment using Trinity Pro platform."
      />
      <Header cartItemCount={0} />
      
      <main>
        {/* Breadcrumb */}
        <section className="py-6 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/solutions" className="hover:text-primary transition-colors">Solutions</Link>
              <span>/</span>
              <span className="text-foreground">Public Safety</span>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-red-500/10 to-red-600/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-red-500/10 p-3 rounded-lg">
                    <Shield className="h-8 w-8 text-red-600" />
                  </div>
                  <Badge variant="secondary" data-testid="badge-solution-category">
                    Public Safety
                  </Badge>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground" data-testid="text-solution-title">
                  Emergency Response & Security Solutions
                </h1>
                <p className="text-xl text-muted-foreground" data-testid="text-solution-subtitle">
                  Enhance public safety operations with advanced UAV technology for search & rescue, disaster response, security surveillance, and emergency coordination when every second counts.
                </p>
                <div className="flex gap-4">
                  <Button size="lg" asChild data-testid="button-get-quote">
                    <Link href="/quote">
                      Get Custom Quote
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild data-testid="button-book-demo">
                    <Link href="/demo">
                      Book Call
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
                Critical Capabilities for Public Safety
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-benefits-description">
                Deploy rapidly, gather real-time intelligence, and coordinate emergency response with professional-grade UAV technology
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={benefit.title} className="text-center hover-elevate" data-testid={`card-benefit-${index}`}>
                  <CardHeader>
                    <div className="bg-red-500/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <benefit.icon className="h-8 w-8 text-red-600" />
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

        {/* Applications & Capabilities */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-applications-title">
                  Mission-Critical Applications
                </h2>
                <p className="text-lg text-muted-foreground" data-testid="text-applications-description">
                  Proven solutions for law enforcement, fire departments, and emergency response teams.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {applications.map((app, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                      <span className="text-foreground" data-testid={`text-application-${index}`}>
                        {app}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-capabilities-title">
                  Technical Capabilities
                </h2>
                <div className="space-y-4">
                  {capabilities.map((capability, index) => (
                    <Card key={index} className="hover-elevate" data-testid={`card-capability-${index}`}>
                      <CardContent className="p-6">
                        <h4 className="font-semibold text-foreground mb-2" data-testid={`text-capability-title-${index}`}>
                          {capability.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2" data-testid={`text-capability-description-${index}`}>
                          {capability.description}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono" data-testid={`text-capability-specs-${index}`}>
                          {capability.specs}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Response Time Benefits */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-response-title">
                Rapid Response Capabilities
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-response-description">
                Deploy faster and gather intelligence more effectively than traditional methods
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center hover-elevate" data-testid="card-response-deployment">
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-red-600 mb-4">&lt;5 min</div>
                  <h4 className="text-xl font-semibold text-foreground mb-2">Deployment Time</h4>
                  <p className="text-muted-foreground">
                    From call to airborne in under 5 minutes for emergency response situations
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover-elevate" data-testid="card-response-coverage">
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-red-600 mb-4">700ha</div>
                  <h4 className="text-xl font-semibold text-foreground mb-2">Search Coverage</h4>
                  <p className="text-muted-foreground">
                    Cover up to 700 hectares per flight for large-scale search operations
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover-elevate" data-testid="card-response-endurance">
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-red-600 mb-4">90 min</div>
                  <h4 className="text-xl font-semibold text-foreground mb-2">Flight Endurance</h4>
                  <p className="text-muted-foreground">
                    Extended flight time for persistent surveillance and monitoring missions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-br from-red-500/10 to-red-600/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-cta-title">
                Enhance Your Public Safety Operations
              </h2>
              <p className="text-lg text-muted-foreground" data-testid="text-cta-description">
                Discover how UAV technology can improve response times, enhance situational awareness, and save lives in critical situations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild data-testid="button-contact-sales">
                  <Link href="/quote">
                    Request Consultation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild data-testid="button-view-training">
                  <Link href="/training">
                    Training Programs
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