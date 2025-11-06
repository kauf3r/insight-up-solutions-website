import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Q4BundleBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    // Check if banner was dismissed
    const dismissed = localStorage.getItem('q4-bundle-banner-dismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
      return;
    }

    // Calculate days left
    const calculateDaysLeft = () => {
      const deadline = new Date('2025-12-31T23:59:59');
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      setDaysLeft(days > 0 ? days : 0);
    };
    
    calculateDaysLeft();
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('q4-bundle-banner-dismissed', 'true');
  };

  if (!isVisible || daysLeft === 0) return null;

  return (
    <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground" data-testid="banner-q4-special">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Sparkles className="h-5 w-5 flex-shrink-0 hidden sm:block" />
            <p className="text-sm sm:text-base font-medium truncate">
              <span className="hidden sm:inline">🎉 Q4 Special: </span>
              <span className="font-semibold">Save up to 10%</span> on Trinity Pro + LR1 Bundle
              <span className="hidden md:inline"> • Only {daysLeft} days left!</span>
            </p>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button 
              variant="secondary" 
              size="sm" 
              asChild
              data-testid="button-banner-cta"
            >
              <Link href="/trinity-lr1-special">
                Learn More
              </Link>
            </Button>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              aria-label="Dismiss banner"
              data-testid="button-dismiss-banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
