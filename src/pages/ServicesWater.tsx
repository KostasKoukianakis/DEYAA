import { LayoutWithoutFooter } from "@/components/layout/LayoutWithoutFooter";
import { ServicesFooter } from "@/components/layout/ServicesFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, CheckCircle, Link2, FileEdit, FlaskConical, Wrench, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import ydreyshImage from "@/assets/YDREYSH.webp";

export default function ServicesWater() {
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
                <span className="text-gray-800 font-medium">Ύδρευση</span>
              </nav>
              
              {/* Title with 3 words - One line, left aligned */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-left">
                <span className="text-black">ΥΠΗΡΕΣΙΕΣ</span>{" "}
                <span className="text-blue-600">ΠΟΣΙΜΟΥ ΝΕΡΟΥ</span>
              </h1>
              
              {/* Small paragraph - Left aligned, narrower width, more spacing */}
              <p className="text-base text-gray-600 mb-12 mt-8 leading-relaxed max-w-2xl">
                Η ΔΕΥΑΑ είναι υπεύθυνη για την παροχή καθαρού πόσιμου νερού σε όλους τους κατοίκους 
                της περιοχής. Το δίκτυο ύδρευσης καλύπτει το σύνολο της περιοχής ευθύνης μας και 
                παρέχει νερό υψηλής ποιότητας που ελέγχεται καθημερινά.
              </p>
              
              {/* Cards Container - 2 columns grid, fills remaining height */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              {/* Νέα Σύνδεση Ύδρευσης */}
              <Card className="shadow-md bg-gray-100 border-0 h-full rounded-3xl flex flex-col relative">
                <Link2 className="absolute top-4 right-4 h-12 w-12 text-blue-600" />
                <div className="flex-1"></div>
                <CardHeader className="flex-shrink-0 pb-2">
                  <CardTitle className="text-2xl font-bold text-gray-800">Νέα Σύνδεση Ύδρευσης</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <span>Αίτηση στα γραφεία της ΔΕΥΑΑ</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <span>Τίτλος ιδιοκτησίας ή μισθωτήριο</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <span>Άδεια οικοδομής (για νέες κατασκευές)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <span>Δελτίο αστυνομικής ταυτότητας</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Αλλαγή Στοιχείων */}
              <Card className="shadow-md bg-gray-100 border-0 h-full rounded-3xl flex flex-col relative">
                <FileEdit className="absolute top-4 right-4 h-12 w-12 text-blue-600" />
                <div className="flex-1"></div>
                <CardHeader className="flex-shrink-0 pb-2">
                  <CardTitle className="text-2xl font-bold text-gray-800">Αλλαγή Στοιχείων</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <span>Αίτηση αλλαγής στοιχείων</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <span>Αποδεικτικό νέας ιδιοκτησίας/μίσθωσης</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <span>Εξόφληση τυχόν οφειλών</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Ποιότητα Νερού - Card 3 */}
              <Card className="shadow-md bg-gray-100 border-0 h-full rounded-3xl flex flex-col relative">
                <FlaskConical className="absolute top-4 right-4 h-12 w-12 text-blue-600" />
                <div className="flex-1"></div>
                <CardHeader className="flex-shrink-0 pb-2">
                  <CardTitle className="text-2xl font-bold text-gray-800">Ποιότητα Νερού</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Το νερό που παρέχει η ΔΕΥΑΑ ελέγχεται καθημερινά σε διαπιστευμένα εργαστήρια 
                    για να διασφαλιστεί η τήρηση όλων των προτύπων ποιότητας.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-600" />
                      <span className="text-gray-600">Μικροβιολογικοί δείκτες</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-600" />
                      <span className="text-gray-600">Χημικές παράμετροι</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-600" />
                      <span className="text-gray-600">pH και αγωγιμότητα</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-600" />
                      <span className="text-gray-600">Υπολειμματικό χλώριο</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 4 - Επιπλέον Υπηρεσίες */}
              <Card className="shadow-md bg-gray-100 border-0 h-full rounded-3xl flex flex-col relative">
                <Wrench className="absolute top-4 right-4 h-12 w-12 text-blue-600" />
                <div className="flex-1"></div>
                <CardHeader className="flex-shrink-0 pb-2">
                  <CardTitle className="text-2xl font-bold text-gray-800">Συντήρηση & Επισκευές</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <span>Συντήρηση δικτύου ύδρευσης</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <span>Επισκευή διαρροών</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <span>Αντικατάσταση υδρομέτρων</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <span>Επείγουσες επεμβάσεις 24/7</span>
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
                  src={ydreyshImage} 
                  alt="Ύδρευση" 
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
