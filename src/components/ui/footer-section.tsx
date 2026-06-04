'use client';

import { useState, useRef } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useCreateSubscriber } from '@/hooks/useSubscribers';
import { sendEmail } from '@/lib/email';
import { Youtube, Facebook, Instagram, ChevronRight } from 'lucide-react';
import deyaLogo from '@/pages/images/deya_logo.png';

interface FooterLink {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSectionConfig {
  label: string;
  links: FooterLink[];
}

// Προσαρμοσμένοι σύνδεσμοι για τη ΔΕΥΑΑ Αποκορώνου
const footerLinks: FooterSectionConfig[] = [
  {
    label: 'Υπηρεσίες',
    links: [
      { title: 'Ύδρευση', href: '/services/water' },
      { title: 'Αποχέτευση', href: '/services/sewerage' },
      { title: 'Δικαιολογητικά', href: '/services/documents' },
      { title: 'Ηλεκτρονικές Υπηρεσίες', href: '/e-services' },
    ],
  },
  {
    label: 'Η ΔΕΥΑΑ',
    links: [
      { title: 'Αποστολή', href: '/about/mission' },
      { title: 'Διοίκηση', href: '/about/administration' },
      { title: 'Ανακοινώσεις', href: '/announcements' },
      { title: 'Διαγωνισμοί', href: '/tenders' },
    ],
  },
  {
    label: 'Πληροφορίες',
    links: [
      { title: 'Συχνές Ερωτήσεις', href: '/faqs' },
      { title: 'Επικοινωνία', href: '/contact' },
      { title: 'Πολιτική Απορρήτου', href: '/privacy' },
      { title: 'Όροι Χρήσης', href: '/terms' },
    ],
  },
];

export function FooterSection() {
  const { toast } = useToast();
  const createSubscriber = useCreateSubscriber();
  const [email, setEmail] = useState('');
  const location = useLocation();
  const isContactPage = location.pathname === '/contact';
  // Honeypot field for bot protection (hidden from users)
  const honeypotRef = useRef<HTMLInputElement>(null);

  const isSubmitting = createSubscriber.isPending;

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    
    // Bot protection: if honeypot field is filled, it's a bot
    if (honeypotRef.current?.value) {
      console.warn('Bot detected via honeypot');
      toast({
        title: 'Σφάλμα',
        description: 'Αδυναμία επεξεργασίας αιτήματος.',
        variant: 'destructive',
      });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      toast({
        title: 'Μη έγκυρο email',
        description: 'Παρακαλώ εισάγετε ένα έγκυρο email address.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Generate verification token
      const verificationToken = crypto.randomUUID();
      
      // Create subscriber (inactive until verified)
      const result = await createSubscriber.mutateAsync({
        email: cleanEmail,
        name: null,
        verificationToken,
      } as any);

      // Send verification email
      const frontendUrl = window.location.origin;
      const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;
      
      const emailSent = await sendEmail({
        to: cleanEmail,
        subject: 'Επιβεβαιώστε την εγγραφή σας στο Newsletter',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: hsl(190, 85%, 38%);">Επιβεβαίωση Εγγραφής</h2>
            <p>Γεια σας,</p>
            <p>Σας ευχαριστούμε για την εγγραφή σας στο Newsletter της ΔΕΥΑΑ Αποκορώνου.</p>
            <p>Για να ολοκληρώσετε την εγγραφή σας, παρακαλώ κάντε κλικ στον παρακάτω σύνδεσμο:</p>
            <p style="margin: 30px 0;">
              <a href="${verificationLink}" 
                 style="background-color: hsl(190, 85%, 38%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Επιβεβαιώστε την Εγγραφή
              </a>
            </p>
            <p>Αν δεν ζητήσατε αυτή την εγγραφή, μπορείτε να αγνοήσετε αυτό το email.</p>
            <p style="margin-top: 30px; color: #666; font-size: 12px;">
              ΔΕΥΑΑ Αποκορώνου<br/>
              Δημοτική Επιχείρηση Ύδρευσης Αποχέτευσης Αποκορώνου
            </p>
          </div>
        `,
      });

      if (!emailSent.success) {
        const errorMsg = emailSent.error || 'Unknown error';
        console.error('Email send failed:', errorMsg);
        throw new Error(`Αποτυχία αποστολής email επιβεβαίωσης: ${errorMsg}`);
      }

      toast({
        title: 'Ελέγξτε το email σας',
        description: 'Σας στείλαμε email επιβεβαίωσης. Παρακαλώ ελέγξτε το inbox σας και κάντε κλικ στον σύνδεσμο για να ολοκληρώσετε την εγγραφή.',
      });
      setEmail('');
    } catch (err: any) {
      const msg = err?.message ?? '';
      const isDuplicate = msg.toLowerCase().includes('duplicate') || msg.toLowerCase().includes('already');
      const isRls = msg.toLowerCase().includes('row level security');
      toast({
        title: 'Δεν ολοκληρώθηκε',
        description: isDuplicate
          ? 'Αυτό το email είναι ήδη εγγεγραμμένο.'
          : isRls
            ? 'Χρειάζεται Supabase policy για public εγγραφή συνδρομητών (RLS).'
            : msg || 'Κάτι πήγε στραβά.',
        variant: 'destructive',
      });
    }
  }

  return (
    <footer 
      className={cn(
        "relative flex w-full flex-col items-center justify-center rounded-t-3xl border-t border-primary-foreground/10 px-8 py-16 lg:px-12 lg:py-20 xl:px-16",
        isContactPage ? "!bg-transparent" : "bg-primary"
      )}
    >
      <div className="bg-foreground/20 absolute left-1/2 right-1/2 top-0 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

      <div className="container mx-auto max-w-[95%] xl:max-w-[90%] 2xl:max-w-[85%]">
        {/* Main Footer Content - Matching screenshot layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-14 pb-16">
          {/* Column 1: Logo and Social Media (lg:col-span-2) */}
          <AnimatedContainer className="lg:col-span-2">
            <div className="mb-8">
              <img 
                src={deyaLogo} 
                alt="ΔΕΥΑΑ Logo" 
                className="h-32 md:h-40 lg:h-48 w-auto object-contain mb-6"
              />
            </div>
            <p className={cn("text-lg font-semibold mb-4", !isContactPage ? "text-white" : "text-foreground")}>
              Βρείτε μας
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "p-3 rounded-lg transition-all duration-200 hover:scale-110",
                  !isContactPage 
                    ? "bg-white/10 hover:bg-white/20 text-white" 
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                )}
                aria-label="YouTube"
              >
                <Youtube className="h-7 w-7" />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "p-3 rounded-lg transition-all duration-200 hover:scale-110",
                  !isContactPage 
                    ? "bg-white/10 hover:bg-white/20 text-white" 
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                )}
                aria-label="Facebook"
              >
                <Facebook className="h-7 w-7" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "p-3 rounded-lg transition-all duration-200 hover:scale-110",
                  !isContactPage 
                    ? "bg-white/10 hover:bg-white/20 text-white" 
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                )}
                aria-label="Instagram"
              >
                <Instagram className="h-7 w-7" />
              </a>
            </div>
          </AnimatedContainer>

          {/* Column 2: Σημεία Εξυπηρέτησης (lg:col-span-3) */}
          <AnimatedContainer delay={0.1} className="lg:col-span-3">
            <h3 className={cn("text-xl lg:text-2xl font-bold mb-6", !isContactPage && "text-white")}>
              Σημεία Εξυπηρέτησης
            </h3>
            <div className={cn("space-y-4 text-base leading-relaxed", !isContactPage ? "text-white/90" : "text-muted-foreground")}>
              <div>
                <p className="font-bold mb-2 text-lg">Κεντρικά Γραφεία</p>
                <p>Επαρ. Οδ. Καλυβών–Γεωργιούπολης 159</p>
                <p>Βάμος, 73008 — Χανιά, Κρήτη, Ελλάδα</p>
              </div>
              <hr className={cn("my-4", !isContactPage ? "border-white/20" : "border-gray-200")} />
              <div>
                <p className="font-bold mb-2 text-lg">Ταμεία ΔΕΥΑΑ</p>
                <p>Επαρ. Οδ. Καλυβών–Γεωργιούπολης 159</p>
                <p>Βάμος, 73008 — Χανιά, Κρήτη, Ελλάδα</p>
              </div>
            </div>
          </AnimatedContainer>

          {/* Column 3: Επικοινωνία (lg:col-span-3) */}
          <AnimatedContainer delay={0.2} className="lg:col-span-3">
            <h3 className={cn("text-xl lg:text-2xl font-bold mb-6", !isContactPage && "text-white")}>
              Επικοινωνία
            </h3>
            <div className={cn("space-y-4 text-base", !isContactPage ? "text-white/90" : "text-muted-foreground")}>
              <div>
                <p className="font-bold mb-3 text-lg">Εξυπηρέτηση Πελατών</p>
                <p className={cn("text-3xl lg:text-4xl font-bold", !isContactPage ? "text-white" : "text-foreground")}>
                  <a href="tel:+302825340213" className="hover:underline">28253-40213</a>
                </p>
              </div>
              <hr className={cn("my-4", !isContactPage ? "border-white/20" : "border-gray-200")} />
              <div>
                <p className="font-bold mb-3 text-lg">Τηλέφωνα Βλαβών</p>
                <p className="mb-2">Ύδρευση - <a href="tel:+302825340208" className="hover:underline font-semibold">28253-40208</a></p>
                <p>Αποχέτευση - <a href="tel:+302825340208" className="hover:underline font-semibold">28253-40208</a></p>
              </div>
              <hr className={cn("my-4", !isContactPage ? "border-white/20" : "border-gray-200")} />
              <div>
                <p className="email text-lg">
                  <a href="mailto:info@deyaa.gr" className="hover:underline font-semibold">info@deyaa.gr</a>
                </p>
              </div>
            </div>
          </AnimatedContainer>

          {/* Column 4: Χρήσιμα Links (lg:col-span-2) */}
          <AnimatedContainer delay={0.3} className="lg:col-span-2">
            <h3 className={cn("text-xl lg:text-2xl font-bold mb-6", !isContactPage && "text-white")}>
              Χρήσιμα Links
            </h3>
            <ul className={cn("space-y-3 text-base", !isContactPage ? "text-white/90" : "text-muted-foreground")}>
              <li>
                <a
                  href="/announcements"
                  className={cn(
                    "inline-flex items-center transition-all duration-200 hover:translate-x-1",
                    !isContactPage ? "text-white/90 hover:text-white" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Διακοπές Υδροδότησης
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className={cn(
                    "inline-flex items-center transition-all duration-200 hover:translate-x-1",
                    !isContactPage ? "text-white/90 hover:text-white" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Έργα
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className={cn(
                    "inline-flex items-center transition-all duration-200 hover:translate-x-1",
                    !isContactPage ? "text-white/90 hover:text-white" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Επικοινωνία
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className={cn(
                    "inline-flex items-center transition-all duration-200 hover:translate-x-1",
                    !isContactPage ? "text-white/90 hover:text-white" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Όροι Χρήσης & Πολιτική Απορρήτου
                </a>
              </li>
            </ul>
          </AnimatedContainer>

          {/* Column 5: Ηλεκτρονικές Υπηρεσίες (lg:col-span-2) */}
          <AnimatedContainer delay={0.4} className="lg:col-span-2">
            <h3 className={cn("text-xl lg:text-2xl font-bold mb-6", !isContactPage && "text-white")}>
              Ηλεκτρονικές Υπηρεσίες
            </h3>
            <div className="space-y-6">
              <a 
                href="https://services.deyaa.gr/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-3 px-6 py-4 rounded-lg text-base font-semibold transition-all duration-200 hover:gap-4 hover:scale-105",
                  !isContactPage 
                    ? "bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 hover:bg-white/20 hover:border-white/40" 
                    : "bg-gray-100/50 backdrop-blur-sm text-gray-800 border-2 border-gray-300 hover:bg-gray-200/70 hover:border-gray-400"
                )}
              >
                <span>Μεταβαση στις Ηλεκτρονικές Υπηρεσίες</span>
                <ChevronRight className="h-6 w-6 flex-shrink-0" />
              </a>
              
              {/* Newsletter Subscription */}
              <div className="pt-6 border-t border-white/20">
                <h4 className={cn("text-lg font-semibold mb-3", !isContactPage && "text-white")}>
                  Newsletter
                </h4>
                <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                  {/* Honeypot field for bot protection - hidden from users */}
                  <input
                    ref={honeypotRef}
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    style={{ position: 'absolute', left: '-9999px' }}
                    aria-hidden="true"
                  />
                  <Input
                    type="email"
                    placeholder="Email σας"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    required
                    className={cn(
                      "text-sm",
                      !isContactPage 
                        ? "bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20" 
                        : "bg-white border-gray-300"
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="sm"
                    className={cn(
                      "w-full",
                      !isContactPage 
                        ? "bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20" 
                        : "bg-accent text-accent-foreground hover:bg-accent/90"
                    )}
                  >
                    {isSubmitting ? 'Εγγραφή...' : 'Εγγραφή'}
                  </Button>
                  <p className={cn("text-xs mt-1", !isContactPage ? "text-white/60" : "text-gray-500")}>
                    Θα λάβετε email επιβεβαίωσης
                  </p>
                </form>
              </div>
            </div>
          </AnimatedContainer>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="pt-8 border-t border-white/20">
          <AnimatedContainer delay={0.5}>
            <p className={cn("text-base text-center", !isContactPage ? "text-white/70" : "text-muted-foreground")}>
              © {new Date().getFullYear()} ΔΕΥΑΑ Αποκορώνου. Όλα τα δικαιώματα διατηρούνται.
            </p>
          </AnimatedContainer>
        </div>
      </div>
    </footer>
  );
}

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>['className'];
  children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

