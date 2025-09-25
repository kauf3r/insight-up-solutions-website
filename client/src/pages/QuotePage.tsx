import Header from "@/components/Header";
import InquiryForm from "@/components/InquiryForm";
import Footer from "@/components/Footer";

export default function QuotePage() {
  const handleQuoteSubmit = (data: any) => {
    console.log('Quote request submitted:', data);
    // TODO: Implement actual quote submission logic
    alert('Quote request submitted successfully! We will contact you within 24 hours.');
  };

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
          
          <InquiryForm 
            type="quote"
            onSubmit={handleQuoteSubmit}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}