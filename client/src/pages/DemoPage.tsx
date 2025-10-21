import Header from "@/components/Header";
import DemoBookingForm from "@/components/DemoBookingForm";
import Footer from "@/components/Footer";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="text-demo-page-title">
              Book a Call
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-demo-page-description">
              Learn more about our UAV systems first-hand. Connect with our experts to discuss 
              the Trinity Pro platform, advanced payloads, and how they can serve your mission.
            </p>
          </div>
          
          <DemoBookingForm 
            title="Schedule Your Call"
            description="Learn more about our UAV systems first-hand"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}