import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";

const logoImage = '/InsightUpSolutions_BlackLogo_(1)_1758828020872.png';

interface HeaderProps {
  cartItemCount?: number;
}

export default function Header({ cartItemCount = 0 }: HeaderProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Solutions", href: "/solutions" },
    { label: "Products", href: "https://insightupsolutions.com/products", external: true },
    { label: "Training", href: "/training" },
  ];

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" data-testid="link-home" className="flex items-center">
              <img
                src={logoImage}
                alt="Insight Up Solutions"
                className="h-12 w-auto"
                data-testid="logo-image"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.external ? (
                <a 
                  key={item.href} 
                  href={item.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  data-testid={`link-${item.label.toLowerCase()}`}
                >
                  <span className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground">
                    {item.label}
                  </span>
                </a>
              ) : (
                <Link key={item.href} href={item.href} data-testid={`link-${item.label.toLowerCase()}`}>
                  <span
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      location === item.href ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              )
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild data-testid="button-request-quote">
                <Link href="/quote">Request Quote</Link>
              </Button>
              <Button size="sm" asChild data-testid="button-book-call">
                <Link href="/demo">Book a Call</Link>
              </Button>
              <Button variant="ghost" size="icon" className="relative" data-testid="button-cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon-xl"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col">
              {navItems.map((item) => (
                item.external ? (
                  <a 
                    key={item.href} 
                    href={item.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-testid={`mobile-link-${item.label.toLowerCase()}`}
                  >
                    <span className="block py-3 px-2 text-sm font-medium text-muted-foreground">
                      {item.label}
                    </span>
                  </a>
                ) : (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-testid={`mobile-link-${item.label.toLowerCase()}`}
                  >
                    <span
                      className={`block py-3 px-2 text-sm font-medium ${
                        location === item.href ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                )
              ))}
              
              {/* Mobile Action Buttons */}
              <div className="pt-4 space-y-3 border-t border-border">
                <Button variant="outline" size="xl" className="w-full" asChild data-testid="button-mobile-request-quote">
                  <Link href="/quote" onClick={() => setIsMobileMenuOpen(false)}>Request Quote</Link>
                </Button>
                <Button size="xl" className="w-full" asChild data-testid="button-mobile-book-call">
                  <Link href="/demo" onClick={() => setIsMobileMenuOpen(false)}>Book a Call</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}