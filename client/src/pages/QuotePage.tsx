import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, Phone, Building, MessageSquare, CheckCircle } from "lucide-react";

const quoteSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  phone: z.string().optional(),
  industry: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

export default function QuotePage() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      industry: "",
      message: "",
    },
  });

  const submitQuoteMutation = useMutation({
    mutationFn: async (data: QuoteFormData) => {
      const payload = {
        ...data,
        inquiryType: "quote",
        // subject will be auto-populated by backend
      };
      return await apiRequest("POST", "/api/inquiries", payload);
    },
    onSuccess: () => {
      setSubmitted(true);
      form.reset();
    },
    onError: (error) => {
      console.error("Quote submission failed:", error);
    },
  });

  const handleSubmit = (data: QuoteFormData) => {
    submitQuoteMutation.mutate(data);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Quote Request Received!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Thank you for your interest in our UAV solutions. We've received your quote request 
                  and will respond within 24 hours with a detailed proposal.
                </p>
                <p className="text-sm text-muted-foreground">
                  Check your email for a confirmation message with your request details.
                </p>
                <Button onClick={() => setSubmitted(false)} data-testid="button-submit-another">
                  Submit Another Quote Request
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Request a Custom Quote
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get a tailored solution for your specific needs. Our experts will work with you 
              to configure the perfect UAV system for your mission requirements.
            </p>
          </div>
          
          <Card className="w-full max-w-2xl mx-auto" data-testid="card-inquiry-quote">
            <CardHeader className="space-y-4 text-center">
              <CardTitle className="text-2xl" data-testid="text-title-quote">
                Request a Quote
              </CardTitle>
              <p className="text-muted-foreground" data-testid="text-description-quote">
                Get a custom quote for your UAV solution needs
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="John Doe" 
                              {...field} 
                              data-testid="input-name-quote"
                            />
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
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                placeholder="john@company.com" 
                                className="pl-10"
                                {...field} 
                                data-testid="input-email-quote"
                              />
                            </div>
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
                            <div className="relative">
                              <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                placeholder="Your Company" 
                                className="pl-10"
                                {...field} 
                                data-testid="input-company-quote"
                              />
                            </div>
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
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                placeholder="+1 (555) 123-4567" 
                                className="pl-10"
                                {...field} 
                                data-testid="input-phone-quote"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-industry-quote">
                              <SelectValue placeholder="Select your industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="surveying">Surveying & Mapping</SelectItem>
                            <SelectItem value="agriculture">Agriculture</SelectItem>
                            <SelectItem value="construction">Construction</SelectItem>
                            <SelectItem value="mining">Mining</SelectItem>
                            <SelectItem value="public-safety">Public Safety</SelectItem>
                            <SelectItem value="energy">Energy & Utilities</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please describe your project requirements, expected timeline, and any specific UAV capabilities needed..."
                            className="min-h-[120px]"
                            {...field}
                            data-testid="textarea-message-quote"
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
                    disabled={submitQuoteMutation.isPending}
                    data-testid="button-submit-quote"
                  >
                    {submitQuoteMutation.isPending ? (
                      "Submitting..."
                    ) : (
                      <>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Request Quote
                      </>
                    )}
                  </Button>

                  {submitQuoteMutation.isError && (
                    <p className="text-sm text-destructive text-center">
                      Failed to submit quote request. Please try again.
                    </p>
                  )}
                </form>
              </Form>

              <div className="text-center text-sm text-muted-foreground">
                <p>
                  We'll respond within 24 hours. For urgent inquiries, call{" "}
                  <span className="font-medium text-foreground">+1 (831) 888-7172</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}