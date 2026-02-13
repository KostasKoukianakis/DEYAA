import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import deyaLogo from "@/pages/images/deya_logo.png";

export function ServicesFooter() {
  return (
    <footer className="relative w-full mt-auto overflow-hidden bg-gray-50">
      {/* Water Drop Shape Container */}
      <div className="relative w-full" style={{ paddingTop: '50%', marginTop: '-5%' }}>
        {/* Water Drop Shape using clip-path */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-700"
          style={{
            clipPath: 'polygon(50% 0%, 48% 8%, 45% 15%, 42% 22%, 38% 30%, 33% 40%, 28% 50%, 23% 60%, 20% 68%, 18% 75%, 16.5% 80%, 16% 85%, 15.5% 90%, 16% 95%, 16.5% 98%, 17.5% 100%, 82.5% 100%, 83.5% 98%, 84% 95%, 84.5% 90%, 84% 85%, 83.5% 80%, 82% 75%, 80% 68%, 77% 60%, 72% 50%, 67% 40%, 62% 30%, 58% 22%, 55% 15%, 52% 8%)',
            filter: 'drop-shadow(0 -10px 20px rgba(37, 99, 235, 0.3))'
          }}
        >
          {/* Content inside the drop */}
          <div className="absolute inset-0 px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 md:py-12 lg:py-16" style={{ marginTop: '10%', overflowY: 'auto', maxHeight: '90%' }}>
            <div className="w-full max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
                {/* Logo & Description */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <img 
                      src={deyaLogo} 
                      alt="ΔΕΥΑΑ Logo" 
                      className="h-12 md:h-16 w-auto object-contain"
                    />
                  </div>
                  <p className="text-xs md:text-sm text-white/90 leading-relaxed">
                    Δημοτική Επιχείρηση Ύδρευσης Αποχέτευσης Αποκορώνου. Παροχή υπηρεσιών νερού και αποχέτευσης στους πολίτες του Αποκόρωνα.
                  </p>
                </div>

                {/* Quick Links */}
                <div>
                  <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base text-white">Γρήγοροι Σύνδεσμοι</h3>
                  <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-white/90">
                    <li>
                      <Link to="/about/mission" className="hover:text-white transition-colors">
                        Αποστολή
                      </Link>
                    </li>
                    <li>
                      <Link to="/services" className="hover:text-white transition-colors">
                        Υπηρεσίες
                      </Link>
                    </li>
                    <li>
                      <Link to="/announcements" className="hover:text-white transition-colors">
                        Ανακοινώσεις
                      </Link>
                    </li>
                    <li>
                      <Link to="/tenders" className="hover:text-white transition-colors">
                        Διαγωνισμοί
                      </Link>
                    </li>
                    <li>
                      <Link to="/contact" className="hover:text-white transition-colors">
                        Επικοινωνία
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* E-Services */}
                <div>
                  <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base text-white">Ηλεκτρονικές Υπηρεσίες</h3>
                  <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-white/90">
                    <li>
                      <Link to="/e-services/payment" className="hover:text-white transition-colors">
                        Πληρωμή Λογαριασμών
                      </Link>
                    </li>
                    <li>
                      <Link to="/e-services/meter-reading" className="hover:text-white transition-colors">
                        Δήλωση Ένδειξης Μετρητή
                      </Link>
                    </li>
                    <li>
                      <Link to="/services/documents" className="hover:text-white transition-colors">
                        Δικαιολογητικά
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Contact Info */}
                <div>
                  <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base text-white">Επικοινωνία</h3>
                  <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-white/90">
                    <li className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>Λεωφόρος Παραδείγματος 123, 10000 Αθήνα</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0" />
                      <a href="tel:+302100000000" className="hover:text-white transition-colors">
                        210 000 0000
                      </a>
                    </li>
                    <li className="flex items-center gap-2">
                      <Mail className="h-4 w-4 shrink-0" />
                      <a href="mailto:info@deyaa.gr" className="hover:text-white transition-colors">
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
              <div className="border-t border-white/20 pt-4 md:pt-6 lg:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-xs md:text-sm text-white/80">
                <p className="text-center md:text-left">© {new Date().getFullYear()} ΔΕΥΑΑ. Όλα τα δικαιώματα διατηρούνται.</p>
                <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                  <Link to="/privacy" className="hover:text-white transition-colors">
                    Πολιτική Απορρήτου
                  </Link>
                  <Link to="/terms" className="hover:text-white transition-colors">
                    Όροι Χρήσης
                  </Link>
                  <Link to="/sitemap" className="hover:text-white transition-colors">
                    Χάρτης Ιστοτόπου
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative waves/ripples inside the drop */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Wave 1 */}
              <path
                d="M 0 40 Q 25 35, 50 40 T 100 40 L 100 50 L 0 50 Z"
                fill="url(#waveGradient)"
              />
              {/* Wave 2 */}
              <path
                d="M 0 60 Q 25 55, 50 60 T 100 60 L 100 70 L 0 70 Z"
                fill="url(#waveGradient)"
              />
              {/* Wave 3 */}
              <path
                d="M 0 80 Q 25 75, 50 80 T 100 80 L 100 90 L 0 90 Z"
                fill="url(#waveGradient)"
              />
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}

