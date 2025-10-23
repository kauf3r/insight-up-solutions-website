import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Products",
      links: [
        { label: "Trinity Pro Platform", href: "/products/trinity-pro" },
        { label: "Sony ILX-LR1", href: "/products/sony-ilx-lr1" },
        { label: "Qube 640", href: "/products/qube-640-lidar" },
      ]
    },
    {
      title: "Software Solutions",
      links: [
        { label: "QBase 3D", href: "/products/qbase-3d" },
        { label: "Pix4DCatch", href: "/products/pix4dcatch" },
        { label: "PIX4Dcloud", href: "/products/pix4dcloud" },
        { label: "Correlator3D", href: "/products/correlator3d" },
      ]
    },
    {
      title: "Solutions",
      links: [
        { label: "Surveying & Mapping", href: "/solutions/surveying" },
        { label: "Precision Agriculture", href: "/solutions/agriculture" },
        { label: "Public Safety", href: "/solutions/public-safety" },
        { label: "Custom Solutions", href: "/solutions/custom" },
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Training", href: "https://9eb54bfc-10d0-41ab-8050-7b8ff1f7c5b8-00-308d0snza2pv9.janeway.replit.dev/training", external: true },
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
      ]
    }
  ];

  return (
    <footer className="bg-card border-t border-border" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground" data-testid="text-company-name">
                Insight Up Solutions
              </h3>
              <p className="mt-2 text-muted-foreground">
                Professional UAV solutions for mission-critical applications. 
                Trusted by industry leaders worldwide.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a 
                  href="mailto:info@insightupsolutions.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-email"
                >
                  info@insightupsolutions.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a 
                  href="tel:+18318887172"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-phone"
                >
                  +1 (831) 888-7172
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <a 
                  href="https://maps.app.goo.gl/Fofgx3SXEasvamEZ8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-address"
                >
                  681 Beach Dr. La Selva Beach, CA 95076
                </a>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h4 className="font-semibold text-foreground" data-testid={`text-section-${index}`}>
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {'external' in link && link.external ? (
                      <a 
                        href={link.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        data-testid={`link-${section.title.toLowerCase()}-${linkIndex}`}
                      >
                        <span className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                          {link.label}
                        </span>
                      </a>
                    ) : (
                      <Link href={link.href} data-testid={`link-${section.title.toLowerCase()}-${linkIndex}`}>
                        <span className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                          {link.label}
                        </span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator />

        {/* Bottom Footer */}
        <div className="py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground" data-testid="text-copyright">
            © {currentYear} Insight Up Solutions. All rights reserved.
          </p>
          
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" data-testid="link-privacy">
              <span className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </span>
            </Link>
            <Link href="/terms" data-testid="link-terms">
              <span className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </span>
            </Link>
            <Link href="/cookies" data-testid="link-cookies">
              <span className="text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}