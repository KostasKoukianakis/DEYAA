import { LayoutWithoutFooter } from "@/components/layout/LayoutWithoutFooter";
import { ServicesFooter } from "@/components/layout/ServicesFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Waves, CheckCircle, AlertTriangle, Link2, Wrench, ShieldAlert, FileWarning, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import apoxetefshImage from "@/assets/APOXETEFSH.webp";

export default function ServicesSewerage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <LayoutWithoutFooter>
      <div className="flex-1 bg-gray-50">
        <div className="w-full py-12 px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex lg:items-stretch">
            {/* Left Section - Cards - Takes 55vw (remaining space) */}
            <div className="w-full lg:w-[55vw] pr-8 flex flex-col lg:h-[80vh]">
              {/* Breadcrumb Navigation */}
              <nav className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                <Link to="/services" className="hover:text-blue-600 transition-colors">
                  Υπηρεσίες
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-800 font-medium">Αποχέτευση</span>
              </nav>
              
              {/* Title with 3 words - One line, left aligned */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-left">
                <span className="text-black">ΥΠΗΡΕΣΙΕΣ</span>{" "}
                <span className="text-blue-600">ΑΠΟΧΕΤΕΥΣΗΣ</span>
              </h1>
              
              {/* Small paragraph - Left aligned, narrower width, more spacing */}
              <p className="text-base text-gray-600 mb-12 mt-8 leading-relaxed max-w-2xl">
                Η ΔΕΥΑΑ διαχειρίζεται το δίκτυο αποχέτευσης της περιοχής, συμπεριλαμβανομένης 
                της συλλογής, μεταφοράς και επεξεργασίας των λυμάτων σε σύγχρονες εγκαταστάσεις 
                επεξεργασίας για την προστασία του περιβάλλοντος.
              </p>
              
              {/* Cards Container - 2 columns grid, fills remaining height */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              {/* Νέα Σύνδεση Αποχέτευσης */}
              <Card className="shadow-md bg-gray-100 border-0 h-full rounded-3xl flex flex-col relative">
                <Link2 className="absolute top-4 right-4 h-12 w-12 text-blue-600" />
                <div className="flex-1"></div>
                <CardHeader className="flex-shrink-0 pb-2">
                  <CardTitle className="text-2xl font-bold text-gray-800">Νέα Σύνδεση Αποχέτευσης</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <span>Αίτηση σύνδεσης</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <span>Τοπογραφικό διάγραμμα</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <span>Άδεια οικοδομής</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <span>Κατάθεση εγγύησης</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Βλάβες & Αποφράξεις */}
              <Card className="shadow-md bg-gray-100 border-0 h-full rounded-3xl flex flex-col relative">
                <Wrench className="absolute top-4 right-4 h-12 w-12 text-blue-600" />
                <div className="flex-1"></div>
                <CardHeader className="flex-shrink-0 pb-2">
                  <CardTitle className="text-2xl font-bold text-gray-800">Βλάβες & Αποφράξεις</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Σε περίπτωση βλάβης στο δίκτυο αποχέτευσης:
                  </p>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <span>Τηλεφωνήστε στο 210 000 0000</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <span>Εξυπηρέτηση 24/7 για επείγοντα</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <span>Γρήγορη επίλυση προβλημάτων</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <span>Επισκευές και συντήρηση</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Επεξεργασία Λυμάτων - Card 3 */}
              <Card className="shadow-md bg-gray-100 border-0 h-full rounded-3xl flex flex-col relative">
                <Waves className="absolute top-4 right-4 h-12 w-12 text-blue-600" />
                <div className="flex-1"></div>
                <CardHeader className="flex-shrink-0 pb-2">
                  <CardTitle className="text-2xl font-bold text-gray-800">Επεξεργασία Λυμάτων</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Το σύστημα επεξεργασίας λυμάτων της ΔΕΥΑΑ διασφαλίζει την προστασία του περιβάλλοντος 
                    μέσω σύγχρονων τεχνολογιών.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-600" />
                      <span className="text-gray-600">Βιολογική επεξεργασία</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-600" />
                      <span className="text-gray-600">Χημική επεξεργασία</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-600" />
                      <span className="text-gray-600">Ελέγχους ποιότητας</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-600" />
                      <span className="text-gray-600">Σύγχρονη τεχνολογία</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Απαγορεύσεις - Card 4 */}
              <Card className="shadow-md bg-gray-100 border-0 h-full rounded-3xl flex flex-col relative">
                <ShieldAlert className="absolute top-4 right-4 h-12 w-12 text-blue-600" />
                <div className="flex-1"></div>
                <CardHeader className="flex-shrink-0 pb-2">
                  <CardTitle className="text-2xl font-bold text-gray-800">Απαγορεύσεις</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Απαγορεύεται η απόρριψη στο δίκτυο αποχέτευσης:
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <span>Λιπών και ελαίων</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <span>Χημικών ουσιών</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <span>Μπαταριών</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <span>Πλαστικών αντικειμένων</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <span>Φαρμάκων</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <span>Οικοδομικών υλικών</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              </div>
            </div>

            {/* Right Section - Image - Takes 45vw, stuck to right edge */}
            <div className="hidden lg:block w-[45vw] flex-shrink-0 h-[80vh] -mr-4 md:-mr-6 lg:-mr-8 xl:-mr-12 2xl:-mr-16">
              <div className="h-full rounded-l-3xl overflow-hidden shadow-2xl">
                <img 
                  src={apoxetefshImage} 
                  alt="Αποχέτευση" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      </LayoutWithoutFooter>
      <ServicesFooter />
    </div>
  );
}
