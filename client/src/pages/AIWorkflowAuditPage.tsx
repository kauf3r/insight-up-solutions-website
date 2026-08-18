import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useSpamGuard } from "@/lib/spam-guard";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Map,
  ListOrdered,
  Zap,
  CheckCircle,
  Clock,
  DollarSign,
  ArrowRight,
  Wrench,
} from "lucide-react";

const auditInquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  phone: z.string().optional(),
  message: z.string().min(10, "Tell us a little more — at least 10 characters"),
});

type AuditInquiryData = z.infer<typeof auditInquirySchema>;

export default function AIWorkflowAuditPage() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { guardPayload, honeypotField } = useSpamGuard();

  const form = useForm<AuditInquiryData>({
    resolver: zodResolver(auditInquirySchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      message: "",
    },
  });

  const auditMutation = useMutation({
    mutationFn: async (data: AuditInquiryData) => {
      return await apiRequest("POST", "/api/contact", {
        ...data,
        subject: `AI Workflow Audit — ${data.company}`,
        inquiryType: "ai-workflow-audit",
        ...guardPayload(),
      });
    },
    onSuccess: () => {
      setIsSubmitted(true);
      form.reset();
      toast({
        title: "Request received!",
        description: "We'll reach out within one business day to schedule your kickoff call.",
      });
    },
    onError: () => {
      setIsSubmitted(false);
      toast({
        title: "Error",
        description: "Failed to send your request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AuditInquiryData) => {
    setIsSubmitted(false);
    auditMutation.mutate(data);
  };

  const deliverables = [
    {
      icon: Map,
      title: "Your Workflow Map",
      description:
        "Every recurring process in your business, documented: who does it, what tools it touches, how long it takes, and where the hours leak. Most owners have never seen their operation on one page. This is that page.",
    },
    {
      icon: ListOrdered,
      title: "Top-5 Automation Plan",
      description:
        "The five automations worth building first, ranked by hours saved per month. Each one specced with the approach, the tools, and the effort to build — clear enough to hand to any developer. Or have us build them.",
    },
    {
      icon: Zap,
      title: "One Quick Win, Implemented",
      description:
        "We don't just leave you a report. We pick one automation from the list and get it running before the week is out — so you walk away with hours already coming back.",
    },
  ];

  const weekSteps = [
    {
      day: "Day 1",
      title: "Kickoff working session",
      description:
        "A 90-minute call walking through how your business actually runs — the real version, not the org chart. We record it, map it, and get to work.",
    },
    {
      day: "Days 2–4",
      title: "Map, rank, build",
      description:
        "We document your workflows, score every automation opportunity by hours saved, and build your quick win. You keep running your business — we might send a couple of clarifying questions.",
    },
    {
      day: "Day 5",
      title: "Delivery walkthrough",
      description:
        "One call: your workflow map, your ranked automation plan, and your first automation running live. Everything is yours to keep — no lock-in, no subscription.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="AI Workflow Audit — $1,500 Fixed, 1-Week Turnaround | Insight Up Solutions"
        description="Find the hours your business is losing to manual busywork. A fixed-price AI Workflow Audit: complete workflow map, top-5 automation plan ranked by hours saved, and one automation implemented — in one week."
        ogTitle="AI Workflow Audit — Insight Up Solutions"
        ogDescription="A workflow map, a ranked automation plan, and one working automation. $1,500 fixed. One week."
      />
      <Header cartItemCount={0} />

      <main>
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <Badge variant="secondary" className="mb-4" data-testid="badge-audit-offer">
                Fixed Price · One Week
              </Badge>
              <h1
                className="text-4xl lg:text-5xl font-bold text-foreground"
                data-testid="text-audit-title"
              >
                AI Workflow Audit
              </h1>
              <p
                className="text-xl text-muted-foreground max-w-3xl mx-auto"
                data-testid="text-audit-subtitle"
              >
                Find the hours your business is losing to busywork — and get your first
                automation running in one week.
              </p>
              <div className="flex items-center justify-center gap-6 text-foreground font-semibold">
                <span className="flex items-center gap-2" data-testid="text-audit-price">
                  <DollarSign className="h-5 w-5 text-primary" />
                  $1,500 fixed
                </span>
                <span className="flex items-center gap-2" data-testid="text-audit-turnaround">
                  <Clock className="h-5 w-5 text-primary" />
                  1-week turnaround
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button size="lg" asChild data-testid="button-book-audit">
                  <a href="#book">
                    Book Your Audit
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* The Problem */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-10">
              <h2
                className="text-3xl lg:text-4xl font-bold text-foreground"
                data-testid="text-problem-title"
              >
                Your team is doing robot work
              </h2>
            </div>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p data-testid="text-problem-p1">
                If you run an ops-heavy business, you know the drill: copy this from one
                system, paste it into another. Rebuild the same report every Monday. Chase
                the same status updates. Re-type the booking into the calendar. Answer the
                same customer question for the hundredth time.
              </p>
              <p data-testid="text-problem-p2">
                None of it grows the business. All of it eats the week. And AI tools can do
                most of it today — the hard part isn't the technology, it's knowing which
                of your workflows to point it at first.
              </p>
              <p className="text-foreground font-semibold" data-testid="text-problem-p3">
                That's the audit. One week, one fixed price, and you know exactly where
                your hours are going and how to get them back — with the first automation
                already running.
              </p>
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2
                className="text-3xl lg:text-4xl font-bold text-foreground"
                data-testid="text-deliverables-title"
              >
                What you get
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Three deliverables. All yours to keep, whoever you build with.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {deliverables.map((item, index) => (
                <Card
                  key={item.title}
                  className="hover-elevate"
                  data-testid={`card-deliverable-${index}`}
                >
                  <CardHeader>
                    <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mb-4 flex items-center justify-center">
                      <item.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2
                className="text-3xl lg:text-4xl font-bold text-foreground"
                data-testid="text-week-title"
              >
                How the week runs
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Your total time commitment: about three hours.
              </p>
            </div>
            <div className="space-y-8">
              {weekSteps.map((step, index) => (
                <Card key={step.day} className="hover-elevate" data-testid={`card-week-step-${index}`}>
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-12 gap-6 items-start">
                      <div className="md:col-span-2">
                        <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-center font-bold">
                          {step.day}
                        </div>
                      </div>
                      <div className="md:col-span-10 space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Who It's For + Credibility */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h2
                  className="text-2xl lg:text-3xl font-bold text-foreground"
                  data-testid="text-fit-title"
                >
                  Built for ops-heavy small businesses
                </h2>
                <ul className="space-y-3">
                  {[
                    "Owner-operated, roughly 2–25 people",
                    "Field services, flex space and coworking, inspection and survey work, property operations",
                    "Running on some mix of spreadsheets, email, and point tools that don't talk to each other",
                    "You know there's waste — you just haven't had time to find it",
                  ].map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-2"
                      data-testid={`text-fit-item-${index}`}
                    >
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h2
                  className="text-2xl lg:text-3xl font-bold text-foreground"
                  data-testid="text-credibility-title"
                >
                  We run on this stuff ourselves
                </h2>
                <p className="text-muted-foreground" data-testid="text-credibility-p1">
                  This isn't theory. We build and run AI-backed operations systems every
                  day at an FAA-designated UAS test range on the California coast —
                  operations dashboards, automated booking and calendar workflows,
                  environmental monitoring with incident escalation. Real systems, in
                  daily use, saving real hours.
                </p>
                <p className="text-muted-foreground" data-testid="text-credibility-p2">
                  The audit applies the same playbook to your business: map the work, rank
                  the opportunities, ship the first win fast.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What Happens After */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <Wrench className="h-8 w-8 text-primary" />
            </div>
            <h2
              className="text-2xl lg:text-3xl font-bold text-foreground"
              data-testid="text-after-title"
            >
              And after the audit?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-after-description">
              Whatever you want. The map and plan are yours — build with your own people,
              another shop, or us. If you want the rest of the top five built, we scope
              that as a separate fixed-price project. No retainer required, ever.
            </p>
          </div>
        </section>

        {/* Booking Form */}
        <section id="book" className="py-20 bg-muted/30">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-10">
              <h2
                className="text-3xl lg:text-4xl font-bold text-foreground"
                data-testid="text-book-title"
              >
                Book your audit
              </h2>
              <p className="text-lg text-muted-foreground" data-testid="text-book-subtitle">
                Tell us what's eating your team's time. We'll reply within one business
                day to schedule the kickoff call.
              </p>
            </div>

            {isSubmitted && (
              <div
                className="mb-6 p-4 rounded-md bg-green-50 border border-green-200"
                data-testid="success-message"
              >
                <p className="text-green-800">
                  Got it — we'll be in touch within one business day to get your audit on
                  the calendar.
                </p>
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {honeypotField}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} data-testid="input-name" />
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
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your Company"
                          {...field}
                          data-testid="input-company"
                        />
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
                        <Input
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          {...field}
                          data-testid="input-phone"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What's eating your team's time? *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="The manual work you'd most like to make disappear — reports, scheduling, data entry, follow-ups..."
                          rows={5}
                          {...field}
                          data-testid="input-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={auditMutation.isPending}
                  data-testid="button-submit"
                >
                  {auditMutation.isPending ? "Sending..." : "Book My Audit — $1,500"}
                </Button>
              </form>
            </Form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
