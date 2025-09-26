import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Settings, 
  Map, 
  Plane, 
  BarChart3, 
  CheckCircle, 
  Clock,
  Users,
  BookOpen,
  ArrowRight,
  PlayCircle
} from "lucide-react";

export default function TrainingPage() {
  const trainingSteps = [
    {
      number: "01",
      title: "System Setup & Configuration",
      description: "Complete hardware assembly, software installation, and system calibration",
      icon: Settings,
      duration: "2-3 hours",
      topics: [
        "Trinity Pro platform assembly and inspection",
        "Payload integration and calibration",
        "Ground control station setup",
        "Communication systems testing",
        "Safety protocols and pre-flight checklists"
      ]
    },
    {
      number: "02", 
      title: "Mission Planning & Design",
      description: "Learn to create efficient flight plans tailored to your specific objectives",
      icon: Map,
      duration: "1-2 hours",
      topics: [
        "QBase 3D mission planning software training",
        "Flight pattern optimization for data collection",
        "Weather and environmental considerations",
        "Regulatory compliance and airspace coordination",
        "Risk assessment and contingency planning"
      ]
    },
    {
      number: "03",
      title: "Flight Operations & Safety",
      description: "Hands-on flight training with emphasis on safety and operational excellence", 
      icon: Plane,
      duration: "4-6 hours",
      topics: [
        "Pre-flight inspection procedures",
        "Manual and automated flight operations",
        "Real-time monitoring and control",
        "Emergency procedures and troubleshooting",
        "Data quality assessment during flight"
      ]
    },
    {
      number: "04",
      title: "Data Processing & Analysis",
      description: "Transform raw data into actionable insights and professional deliverables",
      icon: BarChart3,
      duration: "3-4 hours", 
      topics: [
        "PIX4D software suite training",
        "Correlator3D advanced processing",
        "Quality control and validation procedures",
        "Output format optimization",
        "Report generation and presentation"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Professional UAV Training - Comprehensive UAS Operations | Insight Up Solutions"
        description="Master professional UAV operations through our step-by-step training program covering system setup, mission planning, flight operations, and data processing for Trinity Pro and payload systems."
        ogTitle="Professional UAV Training Programs - Insight Up Solutions"
        ogDescription="Comprehensive UAS training from setup to final deliverables. Learn mission planning, flight operations, and data processing with expert instruction and hands-on experience."
      />
      <Header cartItemCount={0} />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <Badge variant="secondary" className="mb-4" data-testid="badge-training-program">
                Professional Training Program
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground" data-testid="text-training-title">
                Comprehensive UAS Training
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-training-subtitle">
                Master every aspect of professional UAV operations through our structured, step-by-step training program
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button size="lg" asChild data-testid="button-schedule-training">
                  <Link href="/demo">
                    Schedule Training
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild data-testid="button-view-curriculum">
                  <Link href="/products">
                    <PlayCircle className="mr-2 h-4 w-4" />
                    View Our Equipment
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Training Process Overview */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-process-title">
                Complete Training Process
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-process-description">
                Our comprehensive curriculum takes you from setup to final deliverables with hands-on expertise
              </p>
            </div>

            <div className="space-y-12">
              {trainingSteps.map((step, index) => (
                <div key={step.number} className="relative" data-testid={`training-step-${step.number}`}>
                  {/* Connection Line */}
                  {index < trainingSteps.length - 1 && (
                    <div className="absolute left-6 top-24 w-0.5 h-16 bg-border hidden lg:block"></div>
                  )}
                  
                  <Card className="hover-elevate">
                    <CardContent className="p-8">
                      <div className="grid lg:grid-cols-12 gap-8 items-start">
                        {/* Step Number & Icon */}
                        <div className="lg:col-span-2 flex lg:flex-col items-center lg:items-start space-x-4 lg:space-x-0 lg:space-y-4">
                          <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                            {step.number}
                          </div>
                          <div className="bg-primary/10 p-3 rounded-lg">
                            <step.icon className="h-6 w-6 text-primary" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="lg:col-span-6 space-y-4">
                          <div className="space-y-2">
                            <h3 className="text-2xl font-semibold text-foreground">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                          </div>
                          
                          <ul className="space-y-2">
                            {step.topics.map((topic, topicIndex) => (
                              <li key={topicIndex} className="flex items-start space-x-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground" data-testid={`text-topic-${step.number}-${topicIndex}`}>{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Duration */}
                        <div className="lg:col-span-4 space-y-4">
                          <div className="bg-muted/50 p-4 rounded-lg text-center">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                              <Clock className="h-4 w-4 text-primary" />
                              <span className="font-semibold text-foreground">Duration</span>
                            </div>
                            <p className="text-2xl font-bold text-primary">{step.duration}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Training Benefits */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-benefits-title">
                Training Program Benefits
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-benefits-description">
                Gain the expertise and confidence to maximize your UAS investment
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center hover-elevate" data-testid="card-benefit-expert">
                <CardHeader>
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Expert Instruction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Learn from industry professionals with extensive UAV operations experience
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover-elevate" data-testid="card-benefit-hands-on">
                <CardHeader>
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Settings className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Hands-On Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Practical training with your actual equipment in real-world scenarios
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover-elevate" data-testid="card-benefit-support">
                <CardHeader>
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Ongoing Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Continued access to training materials and technical support post-training
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
                Ready to Master Professional UAS Operations?
              </h2>
              <p className="text-lg text-muted-foreground" data-testid="text-cta-description">
                Join our comprehensive training program and unlock the full potential of your UAV systems
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild data-testid="button-start-training">
                  <Link href="/demo">
                    Schedule Your Training
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild data-testid="button-learn-more">
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