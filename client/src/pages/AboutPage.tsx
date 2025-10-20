import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="About Insight Up Solutions - Professional UAV Technology Leaders"
        description="Founded by Chris Bley in 2017, Insight Up Solutions partners with leading UAV manufacturers to deliver proven UAS solutions for automated inspections and data collection across industries."
        ogTitle="About Insight Up Solutions - UAV Technology Experts"
        ogDescription="Learn about our founder's vision and mission to advance drone adoption industry-wide through strategic partnerships and innovative UAS solutions."
      />
      <Header cartItemCount={0} />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground" data-testid="text-about-title">
                About Insight Up Solutions
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-about-subtitle">
                Advancing drone adoption industry-wide through strategic partnerships and innovative UAS solutions
              </p>
            </div>
          </div>
        </section>

        {/* Founder's Story */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-founder-title">
                  Our Founder's Vision
                </h2>
                <div className="space-y-4 text-lg text-muted-foreground">
                  <p data-testid="text-founder-story-1">
                    Chris Bley founded Insight Up Solutions in 2017 after his involvement in two previous 
                    startups, Rope Partner (wind energy specialized service company) and InspecTools 
                    (renewable energy and utility inspection/findings software company).
                  </p>
                  <p data-testid="text-founder-story-2">
                    These experiences provided a meaningful perspective into the future of automated 
                    inspections and information delivery to a variety of industries. The talented team 
                    at Insight Up Solutions™ joins forces with leading drone & sensor manufacturers 
                    to deliver an appropriate solution.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <Card className="hover-elevate" data-testid="card-founder-experience">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Target className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-foreground">Rope Partner</h3>
                        <p className="text-sm text-muted-foreground">
                          Wind energy specialized service company providing industry expertise
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover-elevate" data-testid="card-founder-background">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-foreground">InspecTools</h3>
                        <p className="text-sm text-muted-foreground">
                          Renewable energy and utility inspection/findings software company
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-mission-title">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-mission-description">
                We collaborate with leading UAV and sensor manufacturers to deploy systems that turn data into action
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center hover-elevate" data-testid="card-mission-partnerships">
                <CardContent className="p-8">
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Strategic Partnerships</h3>
                  <p className="text-muted-foreground">
                    Collaborating with leading drone and sensor manufacturers to deliver comprehensive solutions
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover-elevate" data-testid="card-mission-automation">
                <CardContent className="p-8">
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Automated Inspections</h3>
                  <p className="text-muted-foreground">
                    Pioneering the future of automated inspections and information delivery across industries
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover-elevate" data-testid="card-mission-innovation">
                <CardContent className="p-8">
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Industry Innovation</h3>
                  <p className="text-muted-foreground">
                    Advancing drone adoption industry-wide through innovative UAS solutions and expertise
                  </p>
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
                Ready to Advance Your Mission?
              </h2>
              <p className="text-lg text-muted-foreground" data-testid="text-cta-description">
                Discover how our proven UAS solutions can transform your operations and deliver actionable insights
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild data-testid="button-contact-sales">
                  <Link href="/demo">
                    Book a Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild data-testid="button-view-products">
                  <Link href="/products">
                    View Our Products
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