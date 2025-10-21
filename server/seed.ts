import { storage } from "./storage";
import type { InsertProduct } from "@shared/schema";

const seedProducts: InsertProduct[] = [
  {
    name: "Quantum Systems Trinity Pro UAV Platform",
    description: "Next-generation eVTOL fixed-wing mapping drone with Quantum-Skynode autopilot. Future-proof platform with 75,000+ proven flight hours globally.",
    category: "UAV Platform",
    price: null,
    imageUrl: null,
    specifications: JSON.stringify([
      "Flight time: 90 minutes maximum",
      "Max take-off weight: 5.75kg (12.68 lbs)", 
      "Wind tolerance: 11 m/s (21.4 kn)",
      "Max altitude: 5,500m (18,045 ft)",
      "Area coverage: 700 ha per flight",
      "IP 55 rated for harsh environments",
      "PPK included with iBase GNSS station"
    ]),
    features: [
      "eVTOL fixed-wing design",
      "Quantum-Skynode autopilot",
      "75,000+ proven flight hours",
      "Future-proof platform"
    ],
    isAvailable: "true"
  },
  {
    name: "Sony ILX-LR1 for Trinity Pro",
    description: "Professional 61MP RGB camera with cutting-edge high-accuracy capabilities. Seamlessly integrates with Trinity Pro for exceptional image quality and streamlined workflows.",
    category: "Trinity Payload",
    price: null,
    imageUrl: null,
    specifications: JSON.stringify([
      "Sensor: 61.0 MP (9504 × 6336 px)",
      "GSD @100m AGL: 1.57 cm/px", 
      "Coverage @120m AGL: 491 ha",
      "Ultra-compact Trinity Pro integration",
      "Direct camera control capability",
      "Advanced sensor technology"
    ]),
    features: [
      "61MP RGB camera",
      "High-accuracy capabilities",
      "Trinity Pro integration",
      "Direct camera control"
    ],
    isAvailable: "true"
  },
  {
    name: "Phase One P5 for Trinity Pro",
    description: "Revolutionary 128MP medium format survey-grade camera. Delivers 0.5 cm RMS accuracy with electronic global shutter for unparalleled precision mapping.",
    category: "Trinity Payload",
    price: null,
    imageUrl: null,
    specifications: JSON.stringify([
      "Sensor: 128MP medium format CMOS",
      "Electronic global shutter",
      "GSD @60m: 0.26 cm/px (80mm lens)",
      "Coverage @120m: 135 ha (80mm lens)",
      "Survey-grade 0.5 cm RMS XY/Z accuracy",
      "Metrically calibrated lens & sensor"
    ]),
    features: [
      "128MP medium format",
      "Electronic global shutter",
      "Survey-grade accuracy",
      "Metrically calibrated"
    ],
    isAvailable: "true"
  },
  {
    name: "Qube 640 LiDAR for Trinity Pro",
    description: "Specialized LiDAR scanner co-developed with YellowScan. Features selectable 176° FOV and enables 32km corridor scanning in a single flight.",
    category: "Trinity Payload", 
    price: null,
    imageUrl: null,
    specifications: JSON.stringify([
      "Scanner: Hesai XT32M2X",
      "GNSS: SBG Quanta Micro",
      "Integrated 8MP RGB camera",
      "Laser range: 300m",
      "Point rate: Up to 320,000 pts/sec",
      "176° selectable FOV",
      "32km corridor scanning capability"
    ]),
    features: [
      "LiDAR scanner",
      "YellowScan co-development",
      "176° FOV",
      "32km corridor scanning"
    ],
    isAvailable: "true"
  },
  {
    name: "Oblique D2M for Trinity Pro",
    description: "High-precision oblique camera system designed for comprehensive 3D mapping and urban modeling applications.",
    category: "Trinity Payload",
    price: null,
    imageUrl: null,
    specifications: JSON.stringify([
      "Multi-angle capture capability",
      "High-resolution imaging",
      "Trinity Pro integration",
      "Urban modeling optimized",
      "3D mapping precision",
      "Professional oblique photography"
    ]),
    features: [
      "Oblique camera system",
      "3D mapping capability",
      "Urban modeling",
      "Multi-angle capture"
    ],
    isAvailable: "true"
  },
  {
    name: "QBase 3D Mission Planning Software",
    description: "Professional mission planning software for optimized UAV operations. Plan, execute, and monitor flights with precision and efficiency.",
    category: "Trinity Software",
    price: null,
    imageUrl: null,
    specifications: JSON.stringify([
      "Advanced flight planning algorithms",
      "Real-time mission monitoring",
      "Trinity Pro integration",
      "Automated mission execution",
      "Comprehensive flight analytics",
      "Professional workflow optimization"
    ]),
    features: [
      "Mission planning",
      "Real-time monitoring", 
      "Trinity integration",
      "Flight analytics"
    ],
    isAvailable: "true"
  },
  {
    name: "Pix4DCatch Mobile 3D Scanner",
    description: "Mobile photogrammetry application for quick and easy 3D scanning using smartphones and tablets.",
    category: "Software",
    price: null,
    imageUrl: null,
    specifications: JSON.stringify([
      "Mobile device compatibility",
      "Real-time 3D reconstruction",
      "Professional photogrammetry",
      "Cloud processing integration",
      "Easy data sharing",
      "Cross-platform support"
    ]),
    features: [
      "Mobile 3D scanning",
      "Real-time reconstruction",
      "Cloud integration",
      "Cross-platform"
    ],
    isAvailable: "true"
  },
  {
    name: "PIX4Dcloud Processing Platform",
    description: "Cloud-based photogrammetry processing platform for professional mapping and surveying applications.",
    category: "Software", 
    price: null,
    imageUrl: null,
    specifications: JSON.stringify([
      "Cloud-based processing",
      "Professional photogrammetry",
      "Scalable computing power",
      "Automated workflows",
      "High-quality outputs",
      "Enterprise collaboration"
    ]),
    features: [
      "Cloud processing",
      "Professional photogrammetry",
      "Scalable computing",
      "Enterprise collaboration"
    ],
    isAvailable: "true"
  },
  {
    name: "SimActive Correlator3D Photogrammetry Suite",
    description: "Advanced photogrammetry software suite for high-precision mapping and 3D modeling applications.",
    category: "Software",
    price: null,
    imageUrl: null,
    specifications: JSON.stringify([
      "High-precision photogrammetry",
      "Advanced 3D modeling",
      "Professional mapping tools",
      "Precision workflow automation",
      "Enterprise-grade processing",
      "Comprehensive analytics"
    ]),
    features: [
      "Advanced photogrammetry",
      "3D modeling",
      "Professional mapping",
      "Enterprise processing"
    ],
    isAvailable: "true"
  },
  {
    name: "Emlid Reach RS3",
    description: "Multi-band RTK GNSS receiver with IMU tilt compensation. Survey grade precision even in hard-to-reach spots. Acts as a base or rover. Professional-grade receiver for demanding applications.",
    category: "GNSS Equipment",
    price: null,
    imageUrl: null,
    specifications: JSON.stringify([
      "RTK Accuracy: H: 7mm + 1ppm | V: 14mm + 1ppm",
      "PPK Accuracy: H: 5mm + 0.5ppm | V: 10mm + 1ppm",
      "Tilt compensation: RTK + 2mm + 0.3mm/°",
      "Battery: 18hrs with tilt, 22hrs logging",
      "GNSS: GPS/QZSS L1C/A, L2C, GLONASS, BeiDou, Galileo",
      "Dual-band radio: 868/915 MHz LoRa",
      "UHF radio 410-470 MHz",
      "LTE and Wi-Fi connectivity",
      "IP67 rated, 950g weight"
    ]),
    features: [
      "IMU tilt compensation",
      "Multi-band RTK/PPK",
      "Base and rover modes",
      "Calibration-free operation",
      "LTE & Wi-Fi connectivity"
    ],
    isAvailable: "true"
  },
  {
    name: "Emlid Reach RX",
    description: "Lightweight and easy-to-use multi-band RTK GNSS receiver designed specifically for work with NTRIP corrections. Compact 250g rover perfect for GIS data collection and surveying.",
    category: "GNSS Equipment",
    price: null,
    imageUrl: null,
    specifications: JSON.stringify([
      "RTK Accuracy: H: 7mm + 1ppm | V: 14mm + 1ppm",
      "Weight: 250g (8.81 oz)",
      "Battery: Up to 16 hours",
      "GNSS: GPS/QZSS L1C/A, L2C, GLONASS, BeiDou, Galileo",
      "Connectivity: Bluetooth 4.2, MFi-certified",
      "IP68 rated",
      "Update rate: 5 Hz",
      "USB Type-C charging",
      "NTRIP corrections via smartphone"
    ]),
    features: [
      "Ultra-lightweight 250g",
      "Multi-band RTK",
      "NTRIP corrections",
      "16 hour battery",
      "Bluetooth connectivity",
      "IP68 waterproof"
    ],
    isAvailable: "true"
  },
  {
    name: "Pix4D & Emlid Scanning Kit",
    description: "Mobile terrestrial scanning solution with RTK accuracy. Integrated Emlid and Pix4D solution to get digital model in minutes with survey-grade accuracy. Scan your assets with your mobile phone, store online, annotate, measure and share with your stakeholders.",
    category: "GNSS Equipment",
    price: null,
    imageUrl: null,
    specifications: JSON.stringify([
      "Reach RX2 multi-band RTK receiver",
      "PIX4Dcatch software (1 year license)",
      "500 credits cloud processing",
      "Emlid Scanning handle & case",
      "Less than 5cm absolute accuracy",
      "RTK-enabled photogrammetry",
      "iPhone LiDAR integration",
      "Survey-grade precision"
    ]),
    features: [
      "RTK scanning solution",
      "PIX4Dcatch software included",
      "Survey-grade accuracy",
      "Mobile 3D reconstruction"
    ],
    isAvailable: "true"
  },
  {
    name: "Autel Dragonfish Standard",
    description: "Next-generation multi-mission eVTOL UAV platform delivering up to 179 minutes of flight time with vertical takeoff and landing capability. Runway independent, ultraportable, and assembles within 5 minutes from case to takeoff. Perfect for ISR, surveillance, and reconnaissance missions with class-leading endurance and silent flight operations.",
    category: "UAV Platform",
    price: null,
    imageUrl: null,
    specifications: JSON.stringify({
      flightTime: "Up to 179 minutes",
      range: "45km (extendable with repeaters)",
      maxSpeed: "108 km/h",
      weight: "7.5 kg (16.53 lb)",
      wingspan: "2.49 m",
      assemblyTime: "5 minutes",
      payload: "DG-L20T Multi-Sensor (12MP wide-angle, 8MP 20x zoom, thermal 640x512, laser rangefinder)",
      windResistance: "Level 6 (fixed-wing mode)",
      operatingTemp: "-20°C to 40°C",
      transmission: "45km with superior anti-interference",
      portability: "1-2 person portable with IP-rated case"
    }),
    features: [
      "eVTOL - Vertical Takeoff and Landing",
      "5-minute rapid deployment from case to flight",
      "Silent flight - barely audible above 120m",
      "DG-L20T multi-sensor payload with thermal imaging",
      "20x optical zoom camera with laser rangefinder",
      "Superior anti-interference transmission",
      "Single operator capable with minimal training",
      "AI target recognition and intelligent tracking",
      "Terrain avoidance and mobile platform landing",
      "Multiple redundancies for mission safety",
      "Automatic return-to-home and emergency override"
    ],
    isAvailable: "true"
  },
  {
    name: "Autel Dragonfish Pro",
    description: "Professional-grade eVTOL UAV platform with extended capabilities, delivering up to 179 minutes of flight time with enhanced payload capacity. Features larger wingspan for improved stability and endurance. Ideal for demanding ISR operations, long-range surveillance, and complex reconnaissance missions requiring maximum performance.",
    category: "UAV Platform",
    price: null,
    imageUrl: null,
    specifications: JSON.stringify({
      flightTime: "Up to 179 minutes",
      range: "45km (extendable with repeaters)",
      maxSpeed: "108 km/h",
      weight: "14.5 kg (31.97 lb)",
      wingspan: "3.29 m",
      assemblyTime: "5 minutes",
      payload: "DG-L20T Multi-Sensor (12MP wide-angle, 8MP 20x zoom, thermal 640x512, laser rangefinder)",
      windResistance: "Level 6 (fixed-wing mode)",
      operatingTemp: "-20°C to 40°C",
      transmission: "45km with superior anti-interference",
      portability: "1-2 person portable with IP-rated case"
    }),
    features: [
      "eVTOL - Vertical Takeoff and Landing",
      "Enhanced payload capacity and stability",
      "Extended 3.29m wingspan for superior performance",
      "5-minute rapid deployment from case to flight",
      "Silent flight - barely audible above 120m",
      "DG-L20T multi-sensor payload with thermal imaging",
      "20x optical zoom camera with laser rangefinder",
      "Superior anti-interference transmission",
      "Single operator capable with minimal training",
      "AI target recognition and intelligent tracking",
      "Terrain avoidance and mobile platform landing",
      "Multiple redundancies for mission safety"
    ],
    isAvailable: "true"
  }
];

async function seedDatabase() {
  console.log("Starting database seeding...");
  
  try {
    // Check if products already exist
    const existingProducts = await storage.getAllProducts();
    if (existingProducts.length > 0) {
      console.log("Products already exist in database. Skipping seed.");
      return;
    }

    // Create all products
    for (const productData of seedProducts) {
      const product = await storage.createProduct(productData);
      console.log(`Created product: ${product.name}`);
    }

    console.log("Database seeding completed successfully!");
    
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export { seedDatabase };