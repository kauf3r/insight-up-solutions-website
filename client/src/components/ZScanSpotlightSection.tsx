import ProductCard from "./ProductCard";

const zingZScan = '/zing-z-scan.png';

export default function ZScanSpotlightSection() {
  const zScan = {
    id: "1b36406e-6195-420b-8806-5b70cbab9067",
    slug: "zing-z-scan",
    name: "Zing Z-SCAN Drone Detection System",
    category: "AirSpace Management",
    description: "Real-time drone detection and airspace intelligence system for law enforcement, corrections, and critical infrastructure. Identifies, tracks, and logs drone activity via Remote ID and RF sensing, delivering continuous low-altitude airspace awareness.",
    image: zingZScan,
    price: "Contact for Pricing",
    specifications: [
      "Detection Range: Up to 2 miles (environment-dependent)",
      "Detection Modes: Passive RF + active scanning",
      "Supported Protocols: Wi-Fi, Bluetooth, DJI, Parrot Remote ID",
      "Real-time Remote ID detection (Bluetooth + Wi-Fi)",
      "Cloud-based command center with live map",
      "Multi-sensor network, scalable single-site to statewide"
    ],
    featured: true
  };

  return (
    <section className="py-20" data-testid="section-zscan-spotlight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-zscan-spotlight-title">
            Airspace Security & Drone Detection
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-zscan-spotlight-subtitle">Now featuring the Zing Z-SCAN detection system — real-time drone detection and low-altitude airspace awareness for law enforcement, corrections, and critical infrastructure</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <ProductCard
            {...zScan}
            onQuoteRequest={() => console.log(`Quote requested for ${zScan.name}`)}
          />
        </div>
      </div>
    </section>
  );
}
