import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, Phone, Building, MessageSquare } from "lucide-react";

const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  phone: z.string().optional(),
  inquiryType: z.string().min(1, "Please select an inquiry type"),
  industry: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

interface InquiryFormProps {
  type: "quote" | "demo";
  title?: string;
  description?: string;
  onSubmit?: (data: InquiryFormData) => void;
}

export default function InquiryForm({ 
  type, 
  title, 
  description,
  onSubmit 
}: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultTitle = type === "quote" ? "Request a Quote" : "Book a Demo";
  const defaultDescription = type === "quote" 
    ? "Get a custom quote for your UAV solution needs"
    : "Schedule a live demonstration of our UAV systems";

  const form = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      inquiryType: type === "quote" ? "quote" : "demo",
      industry: "",
      message: "",
    },
  });

  const handleSubmit = async (data: InquiryFormData) => {
    setIsSubmitting(true);
    console.log(`${type} form submitted:`, data);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit?.(data);
    setIsSubmitting(false);
    form.reset();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto" data-testid={`card-inquiry-${type}`}>
      <CardHeader className="space-y-4 text-center">
        <CardTitle className="text-2xl" data-testid={`text-title-${type}`}>
          {title || defaultTitle}
        </CardTitle>
        <p className="text-muted-foreground" data-testid={`text-description-${type}`}>
          {description || defaultDescription}
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
                        data-testid={`input-name-${type}`}
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
                          data-testid={`input-email-${type}`}
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
                          data-testid={`input-company-${type}`}
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
                          data-testid={`input-phone-${type}`}
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
                      <SelectTrigger data-testid={`select-industry-${type}`}>
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
                      placeholder={type === "quote" 
                        ? "Please describe your project requirements, expected timeline, and any specific UAV capabilities needed..."
                        : "Tell us about your use case and what you'd like to see during the demonstration..."
                      }
                      className="min-h-[120px]"
                      {...field}
                      data-testid={`textarea-message-${type}`}
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
              disabled={isSubmitting}
              data-testid={`button-submit-${type}`}
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {type === "quote" ? "Request Quote" : "Book Demo"}
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            We'll respond within 24 hours. For urgent inquiries, call{" "}
            <span className="font-medium text-foreground">+1 (831) 888-7172
</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}