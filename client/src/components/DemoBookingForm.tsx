import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { insertDemoBookingSchema, type InsertDemoBooking } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface DemoBookingFormProps {
  title?: string;
  description?: string;
}

export default function DemoBookingForm({ 
  title = "Schedule Your Call",
  description = "Connect with our team to discuss your specific requirements and learn how our UAV systems can meet your needs"
}: DemoBookingFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertDemoBooking>({
    resolver: zodResolver(insertDemoBookingSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      message: "",
      preferredDate: "",
    },
  });

  const createDemoBookingMutation = useMutation({
    mutationFn: async (data: InsertDemoBooking) => {
      return await apiRequest("POST", "/api/demo-bookings", data);
    },
    onSuccess: () => {
      toast({
        title: "Demo Booking Submitted",
        description: "Thank you for your interest! We'll contact you within 24 hours to schedule your demonstration.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/demo-bookings"] });
    },
    onError: (error) => {
      console.error("Demo booking submission failed:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your demo request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: InsertDemoBooking) => {
    createDemoBookingMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto" data-testid="card-demo-booking">
      <CardHeader className="space-y-4 text-center">
        <CardTitle className="text-2xl" data-testid="text-demo-title">
          {title}
        </CardTitle>
        <p className="text-muted-foreground" data-testid="text-demo-description">
          {description}
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
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John Smith" 
                        data-testid="input-demo-name"
                        {...field} 
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
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="john@company.com" 
                        data-testid="input-demo-email"
                        {...field} 
                      />
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
                    <FormLabel>Company (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your Company" 
                        data-testid="input-demo-company"
                        {...field}
                        value={field.value || ""} 
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
                    <FormLabel>Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel" 
                        placeholder="+1 (555) 123-4567" 
                        data-testid="input-demo-phone"
                        {...field}
                        value={field.value || ""} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="preferredDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Date/Time (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Next week Tuesday afternoon, or specific date/time" 
                      data-testid="input-demo-preferred-date"
                      {...field}
                      value={field.value || ""} 
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
                  <FormLabel>Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about your specific use case, industry, or any particular UAV systems you'd like to see demonstrated..."
                      className="min-h-[120px]"
                      data-testid="textarea-demo-message"
                      {...field}
                      value={field.value || ""} 
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
              disabled={createDemoBookingMutation.isPending}
              data-testid="button-submit-demo"
            >
              {createDemoBookingMutation.isPending ? "Submitting..." : "Schedule Call"}
            </Button>
          </form>
        </Form>

        <div className="border-t pt-6 text-center text-sm text-muted-foreground">
          <p className="mb-2">
            <strong>Visit our test facility:</strong>
          </p>
          <p>450 McQuaide Dr, La Selva Beach, CA 95076</p>
          <p className="mt-2">
            <span className="font-medium text-foreground">info@insightupsolutions.com</span> | 
            <span className="font-medium text-foreground"> +1 (831) 888-7172</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}