import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Droplets, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Αρχική", href: "/" },
  { name: "Για Πολίτες", href: "/for-citizens" },
  {
    name: "Η ΔΕΥΑΑ",
    href: "/about",
    children: [
      { name: "Αποστολή", href: "/about/mission" },
      { name: "Διοίκηση", href: "/about/administration" },
    ],
  },
  {
    name: "Υπηρεσίες",
    href: "/services",
    children: [
      { name: "Ύδρευση", href: "/services/water" },
      { name: "Αποχέτευση", href: "/services/sewerage" },
      { name: "Δικαιολογητικά", href: "/services/documents" },
    ],
  },
  {
    name: "Ηλεκτρονικές Υπηρεσίες",
    href: "/e-services",
    children: [
      { name: "Πληρωμή Λογαριασμών", href: "/e-services/payment" },
      { name: "Δήλωση Ένδειξης", href: "/e-services/meter-reading" },
      { name: "Αναφορά Προβλήματος", href: "/problem-reporting" },
      { name: "Υπολογισμός Λογαριασμού", href: "/bill-calculator" },
    ],
  },
  { name: "Ανακοινώσεις", href: "/announcements" },
  { name: "Διαγωνισμοί", href: "/tenders" },
  { name: "Επικοινωνία", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled ? "bg-card/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      )}
    >
      {/* Top bar */}
      <div>
        <div className="w-full px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 flex items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-4">
            <a href="tel:+302100000000" className="flex items-center gap-1 hover:underline text-foreground">
              <Phone className="h-3 w-3" />
              <span>210 000 0000</span>
            </a>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/e-services/payment" className="hover:underline text-foreground">
              Πληρωμή Λογαριασμού
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/e-services/meter-reading" className="hover:underline text-foreground">
              Δήλωση Ένδειξης
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/bill-calculator" className="hover:underline text-foreground">
              Υπολογισμός Λογαριασμού
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="w-full px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Droplets className="h-7 w-7" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary">ΔΕΥΑΑ</span>
              <span className="text-xs text-muted-foreground">
                Δημοτική Επιχείρηση Ύδρευσης Αποχέτευσης
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center flex-1 justify-end gap-2 xl:gap-4">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  to={item.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive(item.href)
                      ? "text-primary bg-secondary"
                      : "text-foreground hover:text-primary hover:bg-muted"
                  )}
                >
                  {item.name}
                </Link>
                {item.children && openDropdown === item.name && (
                  <div className="absolute left-0 top-full pt-1 z-50">
                    <div className="bg-card rounded-lg shadow-lg border py-2 min-w-48">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Μενού"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t py-4">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "block px-4 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive(item.href)
                        ? "text-primary bg-secondary"
                        : "text-foreground hover:text-primary hover:bg-muted"
                    )}
                    onClick={() => !item.children && setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.children && (
                    <div className="ml-4 mt-1 flex flex-col gap-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
