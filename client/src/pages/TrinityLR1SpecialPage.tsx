import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Clock, Shield, TrendingUp, DollarSign, Calendar } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertBundleLeadSchema, type InsertBundleLead } from "@shared/schema";

// ============================================
// TEMPLATE DATA - EASILY REPLACEABLE
// Update these values with your Chile or Seascape Golf Club mission data
// ============================================
const CASE_STUDY_TEMPLATE = {
  title: "City Infrastructure Inspection",
  location: "Municipal District, USA",
  client: "Metropolitan Public Works",
  projectType: "Infrastructure Mapping & Inspection",
  
  // Mission Stats - REPLACE THESE
  stats: {
    areaCovered: "500 acres",
    flightTime: "3 hours",
    accuracy: "2cm GSD",
    imagesCaptured: "1,200+",
    deliverableType: "Orthomosaic & 3D Point Cloud"
  },
  
  // Project Details - REPLACE THESE
  challenge: "The city needed detailed infrastructure assessment for aging roadways, bridges, and drainage systems before budget planning for the fiscal year. Traditional surveying methods would take weeks and disrupt traffic.",
  
  solution: "Using the Trinity Pro platform with the Sony ILX-LR1 61MP sensor, our team completed the entire survey in a single day. The VTOL capability allowed us to cover large areas quickly while maintaining centimeter-level accuracy.",
  
  results: [
    "Completed full survey in 1 day vs. 2 weeks traditional methods",
    "Achieved 2cm ground sampling distance across entire area",
    "Delivered actionable data 48 hours after flight",
    "Saved the city $75,000 in surveying costs"
  ],
  
  clientQuote: "The Trinity Pro system gave us data quality we never thought possible from a UAV. The speed and accuracy completely changed our infrastructure planning process.",
  clientName: "Director of Public Works",
  
  // Image paths - REPLACE WITH YOUR ACTUAL IMAGE PATHS
  images: {
    hero: "/placeholder-trinity-mission.jpg", // Replace with your Chile or golf course aerial
    results: "/placeholder-orthomosaic.jpg"  // Replace with your actual data output
  }
};

export default function TrinityLR1SpecialPage() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);

  // Countdown to Dec 31, 2025
  useEffect(() => {
    const calculateDaysLeft = () => {
      const deadline = new Date('2025-12-31T23:59:59');
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      setDaysLeft(days > 0 ? days : 0);
    };
    
    calculateDaysLeft();
    const interval = setInterval(calculateDaysLeft, 1000 * 60 * 60); // Update every hour
    return () => clearInterval(interval);
  }, []);

  const form = useForm<InsertBundleLead>({
    resolver: zodResolver(insertBundleLeadSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      interestArea: "",
      source: "trinity-lr1-special",
    },
  });

  const bundleLeadMutation = useMutation({
    mutationFn: async (data: InsertBundleLead) => {
      return await apiRequest("/api/bundle-leads", "POST", data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      form.reset();
      toast({
        title: "Thank you for your interest!",
        description: "Check your email for the case study and our team will contact you within 24 hours.",
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit your information. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBundleLead) => {
    bundleLeadMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={0} />
      
      <main>
        {/* Hero Section with Countdown */}
        <section className="relative bg-gradient-to-br from-primary/5 to-primary/10 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <Badge variant="default" className="mb-4" data-testid="badge-limited-time">
                <Clock className="h-3 w-3 mr-1" />
                Limited Time Q4 Special
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground" data-testid="text-hero-title">
                Trinity Pro + LR1 Bundle
              </h1>
              
              <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-hero-subtitle">
                Save up to 10% on the industry's most versatile VTOL platform with professional-grade 61MP imaging
              </p>

              {/* Countdown */}
              <div className="flex flex-col items-center gap-4 pt-4">
                <div className="bg-primary/10 rounded-lg p-6 inline-block">
                  <div className="text-5xl font-bold text-primary" data-testid="text-countdown">
                    {daysLeft}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Days Until Offer Ends</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Offer valid through December 31, 2025
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bundle Breakdown Cards */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12" data-testid="text-bundle-title">
              What's Included in This Bundle
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Trinity Pro Card */}
              <Card className="hover-elevate" data-testid="card-trinity-pro">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">10% OFF</Badge>
                  <CardTitle>Trinity Pro Platform</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    VTOL fixed-wing with 90-minute flight time and survey-grade accuracy
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>90+ minute flight endurance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>NDAA compliant</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Fully autonomous operations</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* LR1 Card */}
              <Card className="hover-elevate border-primary" data-testid="card-lr1">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">5% OFF</Badge>
                  <CardTitle>Sony ILX-LR1</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Professional 61MP full-frame sensor for ultimate image quality
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>61MP full-frame sensor</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Survey-grade accuracy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Seamless Trinity integration</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* TPT Backpack Card */}
              <Card className="hover-elevate" data-testid="card-tpt-backpack">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">8% OFF</Badge>
                  <CardTitle>TPT Backpack</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Professional transport case for complete system protection
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Military-grade protection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Airline carry-on approved</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Complete system storage</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Button size="xl" asChild data-testid="button-get-bundle">
                <a href="#lead-form">Get Your Quote</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Case Study Section */}
        <section className="py-16 bg-accent/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4" data-testid="text-case-study-title">
                Real-World Results
              </h2>
              <p className="text-lg text-muted-foreground">
                See how the Trinity Pro + LR1 delivers mission-critical data
              </p>
            </div>

            <Card className="max-w-5xl mx-auto" data-testid="card-case-study">
              <CardHeader>
                <div className="space-y-2">
                  <Badge variant="outline">{CASE_STUDY_TEMPLATE.projectType}</Badge>
                  <CardTitle className="text-2xl">{CASE_STUDY_TEMPLATE.title}</CardTitle>
                  <p className="text-muted-foreground">
                    {CASE_STUDY_TEMPLATE.location} • {CASE_STUDY_TEMPLATE.client}
                  </p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-6 border-y">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{CASE_STUDY_TEMPLATE.stats.areaCovered}</div>
                    <div className="text-xs text-muted-foreground mt-1">Area Covered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{CASE_STUDY_TEMPLATE.stats.flightTime}</div>
                    <div className="text-xs text-muted-foreground mt-1">Flight Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{CASE_STUDY_TEMPLATE.stats.accuracy}</div>
                    <div className="text-xs text-muted-foreground mt-1">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{CASE_STUDY_TEMPLATE.stats.imagesCaptured}</div>
                    <div className="text-xs text-muted-foreground mt-1">Images</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">48hrs</div>
                    <div className="text-xs text-muted-foreground mt-1">Turnaround</div>
                  </div>
                </div>

                {/* Challenge */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">The Challenge</h3>
                  <p className="text-muted-foreground">{CASE_STUDY_TEMPLATE.challenge}</p>
                </div>

                {/* Solution */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">The Solution</h3>
                  <p className="text-muted-foreground">{CASE_STUDY_TEMPLATE.solution}</p>
                </div>

                {/* Results */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Results Delivered</h3>
                  <ul className="space-y-2">
                    {CASE_STUDY_TEMPLATE.results.map((result, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Client Quote */}
                <div className="bg-primary/5 rounded-lg p-6 border-l-4 border-primary">
                  <p className="italic text-foreground mb-3">"{CASE_STUDY_TEMPLATE.clientQuote}"</p>
                  <p className="text-sm text-muted-foreground">
                    — {CASE_STUDY_TEMPLATE.clientName}, {CASE_STUDY_TEMPLATE.client}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Trust Indicators Section */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12" data-testid="text-trust-title">
              Why Buy Now?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">NDAA Compliant</h3>
                <p className="text-muted-foreground text-sm">
                  Trinity Pro meets all NDAA requirements, qualifying for government contracts and critical infrastructure projects that competitors can't access.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">2025 Tax Benefits</h3>
                <p className="text-muted-foreground text-sm">
                  Purchase before Dec 31 to take advantage of Section 179 deductions and bonus depreciation for the 2025 tax year.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Year-End Budgets</h3>
                <p className="text-muted-foreground text-sm">
                  Use remaining 2025 capital budgets before they expire. Many organizations have "use it or lose it" funds available now.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Email Capture Form */}
        <section id="lead-form" className="py-16 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card data-testid="card-lead-form">
              <CardHeader className="text-center space-y-4">
                <CardTitle className="text-2xl sm:text-3xl">
                  Get Your Custom Quote + Free Case Study
                </CardTitle>
                <p className="text-muted-foreground">
                  Download our complete case study and receive a personalized quote for the Trinity Pro + LR1 bundle with Q4 special pricing.
                </p>
              </CardHeader>

              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8 space-y-4" data-testid="success-message">
                    <CheckCircle2 className="h-16 w-16 text-primary mx-auto" />
                    <h3 className="text-xl font-semibold">Thank You!</h3>
                    <p className="text-muted-foreground">
                      Check your email for the case study. Our team will contact you within 24 hours with your custom quote.
                    </p>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="John Smith" {...field} data-testid="input-name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="john@company.com" {...field} data-testid="input-email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company</FormLabel>
                              <FormControl>
                                <Input placeholder="Your Company" {...field} value={field.value || ""} data-testid="input-company" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input type="tel" placeholder="+1 (555) 123-4567" {...field} value={field.value || ""} data-testid="input-phone" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="interestArea"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Application</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., Surveying, Agriculture, Infrastructure Inspection" 
                                {...field} 
                                value={field.value || ""} 
                                data-testid="input-interest-area"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        size="xl" 
                        className="w-full"
                        disabled={bundleLeadMutation.isPending}
                        data-testid="button-submit-lead"
                      >
                        {bundleLeadMutation.isPending ? "Submitting..." : "Get My Quote + Case Study"}
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        By submitting, you agree to receive product information and quotes from Insight Up Solutions. 
                        We respect your privacy and will never share your information.
                      </p>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>

            <div className="text-center mt-8 text-sm text-muted-foreground">
              <p>Questions? Contact us at <a href="mailto:info@insightupsolutions.com" className="text-primary hover:underline">info@insightupsolutions.com</a> or call <a href="tel:+18318887172" className="text-primary hover:underline">+1 (831) 888-7172</a></p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
