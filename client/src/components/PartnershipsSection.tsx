import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface Partner {
  name: string;
  description: string;
  specialties: string[];
  compliance?: string[];
  logo?: string;
}

export default function PartnershipsSection() {
  // TODO: Replace with real partner data when available
  const partners: Partner[] = [
    {
      name: "Quantum Systems",
      description: "Multi-rotor drone that meets the aerodynamics of an airplane.",
      specialties: ["Trinity Pro Platform", "VTOL Technology", "Long Range"],
      compliance: ["NDAA Compliant"]
    },
    {
      name: "Sony Professional",
      description: "Advanced imaging sensors for professional aerial photography.",
      specialties: ["High-Resolution Imaging", "Low Light Performance", "Full Frame"],
      compliance: []
    },
    {
      name: "FLIR Systems",
      description: "Thermal imaging and infrared sensor technology.",
      specialties: ["Thermal Imaging", "Radiometric", "Multi-Spectral"],
      compliance: ["NDAA Compliant", "Blue UAS"]
    },
    {
      name: "Pix4D",
      description: "Professional drone mapping and photogrammetry software.",
      specialties: ["3D Mapping", "Survey Grade", "Cloud Processing"],
      compliance: []
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-accent/10" data-testid="section-partnerships">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Partners</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            Trusted Manufacturing
            <span className="block text-primary">Ecosystem</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We partner with industry-leading manufacturers to deliver the highest quality 
            UAV systems and sensors for professional applications.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {partners.map((partner, index) => (
            <Card key={index} className="group relative overflow-hidden hover-elevate transition-all duration-500 hover:shadow-xl bg-background/80 backdrop-blur-sm border-border/50" data-testid={`partner-card-${index}`}>
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="space-y-4 relative z-10">
                {/* Partner Logo Placeholder */}
                <div className="w-full h-16 bg-gradient-to-r from-accent/20 to-accent/10 rounded-lg flex items-center justify-center border border-border/30 group-hover:border-primary/20 transition-colors duration-300">
                  <span className="text-lg font-bold text-muted-foreground/70 group-hover:text-primary/70 transition-colors duration-300">
                    {partner.name.split(' ').map(word => word[0]).join('')}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors duration-300" data-testid={`partner-name-${index}`}>
                      {partner.name}
                    </CardTitle>
                    {partner.compliance && partner.compliance.length > 0 && (
                      <div className="flex flex-col gap-1">
                        {partner.compliance.map((cert, certIndex) => (
                          <Badge key={certIndex} variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 relative z-10">
                <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`partner-description-${index}`}>
                  {partner.description}
                </p>

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">Specialties</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {partner.specialties.map((specialty, specIndex) => (
                      <Badge key={specIndex} variant="secondary" className="text-xs bg-accent/50 hover:bg-accent transition-colors">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full transition-all duration-300 group/btn"
                  onClick={() => console.log(`Learn more about ${partner.name}`)}
                  data-testid={`button-partner-${index}`}
                >
                  <span className="group-hover/btn:translate-x-1 transition-transform duration-200">
                    Learn More
                  </span>
                  <ArrowRight className="ml-2 h-3 w-3 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-primary">50+</div>
            <div className="text-sm text-muted-foreground">Global Partners</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-primary">15+</div>
            <div className="text-sm text-muted-foreground">Years Experience</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-primary">100%</div>
            <div className="text-sm text-muted-foreground">NDAA Compliant</div>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex flex-col items-center space-y-6 p-8 bg-gradient-to-r from-accent/10 to-accent/5 rounded-2xl border border-border/50">
            <div className="space-y-2 text-center">
              <h3 className="text-xl font-semibold text-foreground">Ready to Partner With Us?</h3>
              <p className="text-muted-foreground">Join our ecosystem of trusted manufacturers and technology partners.</p>
            </div>
            <Button size="lg" className="px-8 py-3 shadow-lg group" asChild data-testid="button-partner-inquiry">
              <Link href="/partnerships">
                <span className="group-hover:translate-x-1 transition-transform duration-200">
                  Partner With Us
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