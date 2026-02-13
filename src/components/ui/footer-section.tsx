'use client';

import { useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useCreateSubscriber } from '@/hooks/useSubscribers';
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

  const isSubmitting = createSubscriber.isPending;

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) return;

    try {
      await createSubscriber.mutateAsync({
        email: cleanEmail,
        name: null,
        is_active: true,
      } as any);

      toast({
        title: 'Επιτυχής εγγραφή',
        description: 'Έγινες συνδρομητής. Θα λαμβάνεις ενημερώσεις στο email σου.',
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
        "md:rounded-t-6xl relative flex w-full flex-col items-center justify-center rounded-t-4xl border-t px-6 py-12 lg:py-16",
        isContactPage ? "!bg-transparent" : ""
      )}
      style={isContactPage ? { background: 'transparent', backgroundColor: 'transparent' } : { backgroundColor: '#2161ab' }}
    >
      <div className="bg-foreground/20 absolute left-1/2 right-1/2 top-0 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

      <div className="container mx-auto max-w-7xl">
        {/* Top Section: Logo and Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-12 border-b border-white/10">
          <AnimatedContainer className="space-y-4">
            <img 
              src={deyaLogo} 
              alt="ΔΕΥΑΑ Logo" 
              className="h-14 md:h-18 w-auto object-contain"
            />
            <p className={cn("text-sm leading-relaxed max-w-md", !isContactPage ? "text-white/70" : "text-muted-foreground")}>
              Η ΔΕΥΑΑ Αποκορώνου παρέχει ολοκληρωμένες υπηρεσίες ύδρευσης και αποχέτευσης για την περιοχή μας.
            </p>
          </AnimatedContainer>

          <AnimatedContainer delay={0.1} className="space-y-4">
            <div>
              <p className={cn("text-lg font-semibold mb-3", !isContactPage && "text-white")}>
                Εγγραφή για ενημερώσεις
              </p>
              <p className={cn("text-sm mb-4", !isContactPage ? "text-white/70" : "text-muted-foreground")}>
                Λάβετε τα τελευταία νέα και ανακοινώσεις στο email σας
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Το email σας"
                  type="email"
                  required
                  className={cn(
                    "flex-1", 
                    !isContactPage && "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-white/30"
                  )}
                />
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className={cn("shrink-0", !isContactPage && "bg-white text-[#2161ab] hover:bg-white/90")}
                >
                  {isSubmitting ? '...' : 'Εγγραφή'}
                </Button>
              </div>
            </form>
          </AnimatedContainer>
        </div>

        {/* Middle Section: Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 py-12">
          {footerLinks.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.2 + index * 0.1}>
              <div>
                <h3 className={cn("text-sm font-semibold uppercase tracking-wider mb-4", !isContactPage && "text-white")}>
                  {section.label}
                </h3>
                <ul className={cn("space-y-3", !isContactPage ? "text-white/80" : "text-muted-foreground")}>
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <a
                        href={link.href}
                        className={cn(
                          "inline-flex items-center text-sm transition-all duration-300 hover:translate-x-1",
                          !isContactPage ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {link.icon && (
                          <link.icon className={cn("me-2 size-4 shrink-0", !isContactPage && "text-white/80")} />
                        )}
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedContainer>
          ))}
        </div>

        {/* Bottom Section: Copyright */}
        <div className="pt-8 border-t border-white/10">
          <AnimatedContainer delay={0.5}>
            <p className={cn("text-sm text-center", !isContactPage ? "text-white/60" : "text-muted-foreground")}>
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

