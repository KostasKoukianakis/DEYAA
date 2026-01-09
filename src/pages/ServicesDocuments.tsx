import { LayoutWithoutFooter } from "@/components/layout/LayoutWithoutFooter";
import { ServicesFooter } from "@/components/layout/ServicesFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, FileCheck, FileEdit, FileX, FileQuestion, Droplets, Waves, Gauge, DollarSign, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import dikaiologhtikaImage from "@/assets/DIKAIOLOGHTIKA.webp";

const documents = [
  {
    title: "Αίτηση Νέας Σύνδεσης Ύδρευσης",
    description: "Για νέες παροχές νερού σε οικίες και επιχειρήσεις.",
    category: "Ύδρευση",
    icon: Droplets,
  },
  {
    title: "Αίτηση Νέας Σύνδεσης Αποχέτευσης",
    description: "Για σύνδεση στο δίκτυο αποχέτευσης.",
    category: "Αποχέτευση",
    icon: Waves,
  },
  {
    title: "Αίτηση Αλλαγής Στοιχείων Καταναλωτή",
    description: "Για αλλαγή ονόματος ή στοιχείων παροχής.",
    category: "Γενικά",
    icon: FileEdit,
  },
  {
    title: "Αίτηση Διακοπής Υδροδότησης",
    description: "Για προσωρινή ή μόνιμη διακοπή παροχής.",
    category: "Ύδρευση",
    icon: FileX,
  },
  {
    title: "Αίτηση Ελέγχου Μετρητή",
    description: "Για έλεγχο ορθής λειτουργίας του υδρομέτρου.",
    category: "Ύδρευση",
    icon: Gauge,
  },
  {
    title: "Αίτηση Ρύθμισης Οφειλών",
    description: "Για διακανονισμό εξόφλησης οφειλών.",
    category: "Οικονομικά",
    icon: DollarSign,
  },
];

export default function ServicesDocuments() {
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
                <span className="text-gray-800 font-medium">Δικαιολογητικά</span>
              </nav>
              
              {/* Title with 3 words - One line, left aligned */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-left">
                <span className="text-black">ΥΠΗΡΕΣΙΕΣ</span>{" "}
                <span className="text-blue-600">ΔΙΚΑΙΟΛΟΓΗΤΙΚΩΝ</span>
              </h1>
              
              {/* Small paragraph - Left aligned, narrower width, more spacing */}
              <p className="text-base text-gray-600 mb-12 mt-8 leading-relaxed max-w-2xl">
                Κατεβάστε τα απαραίτητα έντυπα για τις υπηρεσίες της ΔΕΥΑΑ. Μπορείτε να τα 
                υποβάλετε αυτοπροσώπως στα γραφεία μας ή ηλεκτρονικά μέσω email.
              </p>
              
              {/* Cards Container - 2 columns grid, fills remaining height - Smaller cards for 6 items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              {documents.map((doc) => {
                const IconComponent = doc.icon;
                return (
                  <Card key={doc.title} className="shadow-md bg-gray-100 border-0 rounded-3xl flex flex-col relative">
                    <IconComponent className="absolute top-3 right-3 h-8 w-8 text-blue-600" />
                    <CardHeader className="flex-shrink-0 pb-2 pt-4 px-4">
                      <CardTitle className="text-lg font-bold text-gray-800 pr-10">{doc.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-between flex-1 px-4 pb-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                          {doc.description}
                        </p>
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                          {doc.category}
                        </span>
                      </div>
                      <Button variant="outline" size="sm" className="mt-3 w-fit text-xs h-8">
                        <Download className="h-3 w-3 mr-1.5" />
                        Κατεβάστε PDF
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
              </div>
            </div>

            {/* Right Section - Image - Takes 45vw, stuck to right edge */}
            <div className="hidden lg:block w-[45vw] flex-shrink-0 h-[80vh] -mr-4 md:-mr-6 lg:-mr-8 xl:-mr-12 2xl:-mr-16">
              <div className="h-full rounded-l-3xl overflow-hidden shadow-2xl">
                <img 
                  src={dikaiologhtikaImage} 
                  alt="Δικαιολογητικά" 
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
