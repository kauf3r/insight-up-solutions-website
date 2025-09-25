import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, CheckCircle, Award, Users } from "lucide-react";

export default function TrustSignals() {
  const certifications = [
    {
      icon: Shield,
      label: "NDAA Compliant",
      description: "Meets defense authorization standards"
    },
    {
      icon: CheckCircle,
      label: "Blue UAS Cleared",
      description: "Approved for government use"
    },
    {
      icon: Award,
      label: "ISO Certified",
      description: "Quality management systems"
    },
    {
      icon: Users,
      label: "500+ Customers",
      description: "Trusted worldwide"
    }
  ];

  return (
    <section className="py-16 bg-accent/5 border-y border-border" data-testid="section-trust-signals">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Industry Trusted & Certified
          </h2>
          <p className="text-muted-foreground">
            Meeting the highest standards for professional UAV operations
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert, index) => (
            <Card key={index} className="text-center hover-elevate transition-all" data-testid={`cert-card-${index}`}>
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <cert.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <Badge variant="secondary" className="text-xs">
                    {cert.label}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {cert.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}