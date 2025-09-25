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
    <section className="py-20 bg-card" data-testid="section-partnerships">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Trusted Manufacturing Partners
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We partner with industry-leading manufacturers to deliver the highest quality 
            UAV systems and sensors for professional applications.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {partners.map((partner, index) => (
            <Card key={index} className="group hover-elevate transition-all" data-testid={`partner-card-${index}`}>
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg" data-testid={`partner-name-${index}`}>
                    {partner.name}
                  </CardTitle>
                  {partner.compliance && partner.compliance.length > 0 && (
                    <div className="flex flex-col gap-1">
                      {partner.compliance.map((cert, certIndex) => (
                        <Badge key={certIndex} variant="outline" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground" data-testid={`partner-description-${index}`}>
                  {partner.description}
                </p>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Specialties:</h4>
                  <div className="flex flex-wrap gap-1">
                    {partner.specialties.map((specialty, specIndex) => (
                      <Badge key={specIndex} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full group-hover:bg-primary/10 transition-all"
                  onClick={() => console.log(`Learn more about ${partner.name}`)}
                  data-testid={`button-partner-${index}`}
                >
                  Learn More
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-4 p-6 bg-accent/10 rounded-lg">
            <div className="text-sm text-muted-foreground">
              Interested in becoming a partner?
            </div>
            <Button variant="outline" asChild data-testid="button-partner-inquiry">
              <Link href="/partnerships">
                Partner With Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}