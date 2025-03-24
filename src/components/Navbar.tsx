
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { Menu, X, PlaneTakeoff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm py-2" : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors"
          >
            <PlaneTakeoff className="w-6 h-6" />
            <span className="text-xl font-semibold">SkyBooker</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive('/') ? "text-primary" : "text-foreground/70"
              )}
            >
              Home
            </Link>
            <Link 
              to="/dashboard" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive('/dashboard') ? "text-primary" : "text-foreground/70"
              )}
            >
              My Bookings
            </Link>
            <a 
              href="#" 
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              Offers
            </a>
            <a 
              href="#" 
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              Support
            </a>
            
            {/* Auth buttons for desktop */}
            <div className="flex items-center space-x-4">
              <SignedIn>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-9 h-9"
                    }
                  }}
                />
              </SignedIn>
              
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="ghost" className="text-sm font-medium">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="text-sm font-medium">
                    Sign Up
                  </Button>
                </SignUpButton>
              </SignedOut>
            </div>
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-foreground p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile navigation menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md shadow-md animate-fade-in">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={cn(
                  "px-4 py-2 rounded-md transition-colors",
                  isActive('/') ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-primary/5 hover:text-primary"
                )}
              >
                Home
              </Link>
              <Link 
                to="/dashboard" 
                className={cn(
                  "px-4 py-2 rounded-md transition-colors",
                  isActive('/dashboard') ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-primary/5 hover:text-primary"
                )}
              >
                My Bookings
              </Link>
              <a 
                href="#" 
                className="px-4 py-2 rounded-md text-foreground/70 hover:bg-primary/5 hover:text-primary transition-colors"
              >
                Offers
              </a>
              <a 
                href="#" 
                className="px-4 py-2 rounded-md text-foreground/70 hover:bg-primary/5 hover:text-primary transition-colors"
              >
                Support
              </a>
              
              {/* Auth buttons for mobile */}
              <div className="border-t border-border mt-2 pt-4 flex flex-col space-y-3">
                <SignedIn>
                  <div className="flex items-center px-4 py-2">
                    <UserButton 
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          userButtonAvatarBox: "w-9 h-9"
                        }
                      }}
                    />
                    <span className="ml-3 text-sm">Account</span>
                  </div>
                </SignedIn>
                
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="ghost" className="justify-start w-full">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button className="justify-start w-full">
                      Sign Up
                    </Button>
                  </SignUpButton>
                </SignedOut>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
