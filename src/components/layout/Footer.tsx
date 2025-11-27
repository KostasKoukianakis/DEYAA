import { Link } from "react-router-dom";
import { Droplets, MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Droplets className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">ΔΕΥΑΑ</span>
            </div>
            <p className="text-sm text-background/70">
              Δημοτική Επιχείρηση Ύδρευσης Αποχέτευσης Αττικής. 
              Παροχή υπηρεσιών νερού και αποχέτευσης στους πολίτες.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Γρήγοροι Σύνδεσμοι</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <Link to="/about/mission" className="hover:text-background transition-colors">
                  Αποστολή
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-background transition-colors">
                  Υπηρεσίες
                </Link>
              </li>
              <li>
                <Link to="/announcements" className="hover:text-background transition-colors">
                  Ανακοινώσεις
                </Link>
              </li>
              <li>
                <Link to="/tenders" className="hover:text-background transition-colors">
                  Διαγωνισμοί
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-background transition-colors">
                  Επικοινωνία
                </Link>
              </li>
            </ul>
          </div>

          {/* E-Services */}
          <div>
            <h3 className="font-semibold mb-4">Ηλεκτρονικές Υπηρεσίες</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <Link to="/e-services/payment" className="hover:text-background transition-colors">
                  Πληρωμή Λογαριασμών
                </Link>
              </li>
              <li>
                <Link to="/e-services/meter-reading" className="hover:text-background transition-colors">
                  Δήλωση Ένδειξης Μετρητή
                </Link>
              </li>
              <li>
                <Link to="/services/documents" className="hover:text-background transition-colors">
                  Δικαιολογητικά
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Επικοινωνία</h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Λεωφόρος Παραδείγματος 123, 10000 Αθήνα</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <a href="tel:+302100000000" className="hover:text-background transition-colors">
                  210 000 0000
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <a href="mailto:info@deyaa.gr" className="hover:text-background transition-colors">
                  info@deyaa.gr
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Δευ - Παρ: 08:00 - 15:00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/60">
          <p>© 2024 ΔΕΥΑΑ. Όλα τα δικαιώματα διατηρούνται.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-background transition-colors">
              Πολιτική Απορρήτου
            </Link>
            <Link to="/terms" className="hover:text-background transition-colors">
              Όροι Χρήσης
            </Link>
            <Link to="/sitemap" className="hover:text-background transition-colors">
              Χάρτης Ιστοτόπου
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
