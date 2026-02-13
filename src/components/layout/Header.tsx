import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import deyaLogo from "@/pages/images/deya_logo.png";

const navigation = [
  { name: "Αρχική", href: "/" },
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

const languages = [
  { code: "EL", name: "Ελληνικά", nativeName: "Ελληνικά" },
  { code: "EN", name: "English", nativeName: "English" },
  { code: "DE", name: "Deutsch", nativeName: "Deutsch" },
  { code: "FR", name: "Français", nativeName: "Français" },
];

const phoneNumbers = [
  { label: "Κεντρικό", number: "+30 28210 12345", hours: "08:00 - 16:00" },
  { label: "Επείγοντα", number: "+30 28210 12346", hours: "24/7" },
  { label: "Γραφείο", number: "+30 28210 12347", hours: "09:00 - 15:00" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [selectedPhone, setSelectedPhone] = useState(phoneNumbers[0]);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const isHomePage = location.pathname === "/";
  const isContactPage = location.pathname === "/contact";

  return (
    // Κρατάμε το header στην κορυφή του stack, αλλά ΔΕΝ είναι sticky.
    <header
      className={cn(
        "relative z-50 w-full transition-colors duration-200",
        isHomePage || isContactPage ? "navbar-transparent !bg-transparent" : "bg-background"
      )}
      style={isContactPage ? { background: 'transparent', backgroundColor: 'transparent' } : undefined}
    >
      {/* Main header */}
      <div 
        className={cn(
          "w-full px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16",
          (isHomePage || isContactPage) && "navbar-transparent-children !bg-transparent"
        )}
        style={isContactPage ? { background: 'transparent', backgroundColor: 'transparent' } : undefined}
      >
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img 
              src={deyaLogo} 
              alt="ΔΕΥΑΑ Logo" 
              className="h-16 md:h-20 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center flex-1 justify-center gap-1 xl:gap-2">
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
                    "px-4 py-2.5 text-sm font-semibold tracking-wide rounded-lg transition-all duration-200 relative group",
                    isActive(item.href)
                      ? isContactPage 
                        ? "text-[#2161ab] !bg-transparent" 
                        : "text-[#2161ab] bg-blue-50"
                      : "text-gray-700 hover:text-[#2161ab] hover:bg-gray-50"
                  )}
                >
                  {item.name}
                  {item.children && (
                    <span className="ml-1 inline-block text-[10px] text-gray-400">▼</span>
                  )}
                  {/* Underline effect on hover */}
                  <span className={cn(
                    "absolute bottom-1 left-4 right-4 h-0.5 bg-[#2161ab] transform scale-x-0 transition-transform duration-200",
                    isActive(item.href) ? "scale-x-100" : "group-hover:scale-x-100"
                  )}></span>
                </Link>
                {item.children && openDropdown === item.name && (
                  <div className="absolute left-0 top-full pt-2 z-[100]">
                    <div className="dropdown-solid rounded-xl shadow-2xl border border-gray-200 py-2 min-w-[200px] overflow-hidden" style={{ backgroundColor: '#ffffff', opacity: 1 }}>
                      {item.children.map((child, index) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          className="block px-5 py-3 text-sm font-medium text-gray-700 hover:text-[#2161ab] hover:bg-blue-50 transition-all duration-150 relative group/item"
                        >
                          <span className="relative z-10">{child.name}</span>
                          <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#2161ab] transform scale-y-0 group-hover/item:scale-y-100 transition-transform duration-150"></span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side - Language & Phone */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Selector */}
            <div 
              className="relative"
              onMouseEnter={() => setLanguageDropdownOpen(true)}
              onMouseLeave={() => setLanguageDropdownOpen(false)}
            >
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-[#2161ab] hover:bg-gray-50 transition-all duration-200"
              >
                <Globe className="h-4 w-4" />
                <span>{selectedLanguage.code}</span>
                <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", languageDropdownOpen && "rotate-180")} />
              </button>
              {languageDropdownOpen && (
                <div className="absolute right-0 top-full pt-2 z-[100]">
                  <div className="dropdown-solid rounded-xl shadow-2xl border border-gray-200 py-2 min-w-[180px] overflow-hidden" style={{ backgroundColor: '#ffffff', opacity: 1 }}>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLanguage(lang);
                          setLanguageDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-5 py-2.5 text-sm font-medium transition-all duration-150 relative group/item",
                          selectedLanguage.code === lang.code
                            ? "text-[#2161ab] bg-blue-50"
                            : "text-gray-700 hover:text-[#2161ab] hover:bg-gray-50"
                        )}
                      >
                        <span className="relative z-10">{lang.nativeName}</span>
                        {selectedLanguage.code === lang.code && (
                          <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#2161ab]"></span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Phone Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setPhoneDropdownOpen(true)}
              onMouseLeave={() => setPhoneDropdownOpen(false)}
            >
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-[#2161ab] hover:bg-gray-50 transition-all duration-200"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden xl:inline">{selectedPhone.number}</span>
                <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", phoneDropdownOpen && "rotate-180")} />
              </button>
              {phoneDropdownOpen && (
                <div className="absolute right-0 top-full pt-2 z-[100]">
                  <div className="dropdown-solid rounded-xl shadow-2xl border border-gray-200 py-2 min-w-[280px] overflow-hidden" style={{ backgroundColor: '#ffffff', opacity: 1 }}>
                    {phoneNumbers.map((phone) => (
                      <div
                        key={phone.label}
                        onClick={() => {
                          setSelectedPhone(phone);
                          setPhoneDropdownOpen(false);
                        }}
                        className={cn(
                          "px-5 py-3 text-sm transition-all duration-150 cursor-pointer relative group/item",
                          selectedPhone.label === phone.label
                            ? "bg-blue-50"
                            : "hover:bg-gray-50"
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 mb-1">{phone.label}</div>
                            <a 
                              href={`tel:${phone.number.replace(/\s/g, '')}`}
                              className="text-[#2161ab] hover:underline font-medium"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {phone.number}
                            </a>
                            <div className="text-xs text-gray-500 mt-1">{phone.hours}</div>
                          </div>
                        </div>
                        {selectedPhone.label === phone.label && (
                          <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#2161ab]"></span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2 lg:hidden">
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
          <div className={cn(
            "lg:hidden border-t py-4",
            isContactPage && "!bg-transparent"
          )}>
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "block px-4 py-2 text-base font-medium rounded-md transition-colors",
                      isActive(item.href)
                        ? isContactPage ? "text-primary !bg-transparent" : "text-primary bg-secondary"
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
                          className="block px-4 py-2 text-base text-muted-foreground hover:text-primary transition-colors"
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
