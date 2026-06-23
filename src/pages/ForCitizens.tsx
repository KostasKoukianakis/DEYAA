import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import {
  Users,
  FileText,
  Calculator,
  AlertTriangle,
  CreditCard,
  Phone,
  MapPin,
  Clock,
  Download,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const services = [
  {
    title: "Τέλη Σύνδεσης",
    description: "Πληροφορίες για τα τέλη σύνδεσης με το δίκτυο ύδρευσης και αποχέτευσης",
    icon: CreditCard,
    href: "/services#item-documents",
    color: "bg-blue-500",
  },
  {
    title: "Σύνδεση με Δίκτυο Ύδρευσης",
    description: "Διαδικασία και απαιτούμενα για σύνδεση με το δίκτυο ύδρευσης",
    icon: MapPin,
    href: "/services#item-water",
    color: "bg-green-500",
  },
  {
    title: "Σύνδεση με Δίκτυο Αποχέτευσης",
    description: "Πληροφορίες για σύνδεση με το δίκτυο αποχέτευσης",
    icon: MapPin,
    href: "/services#item-sewerage",
    color: "bg-orange-500",
  },
  {
    title: "Υπολογισμός Λογαριασμού",
    description: "Υπολογίστε εκτιμώμενο λογαριασμό βάσει κατανάλωσης",
    icon: Calculator,
    href: "/e-services/bill-calculator",
    color: "bg-purple-500",
    badge: "Νέο",
  },
];

const emergencyServices = [
  {
    title: "Βλάβες Ύδρευσης",
    description: "Αναφορά βλάβης στο δίκτυο ύδρευσης",
    phone: "28253-40208",
    hours: "24/7",
  },
  {
    title: "Βλάβες Αποχέτευσης",
    description: "Αναφορά προβλήματος στο δίκτυο αποχέτευσης",
    phone: "28253-40208",
    hours: "24/7",
  },
  {
    title: "Διακοπές Νερού",
    description: "Πληροφορίες για προγραμματισμένες διακοπές",
    phone: "28253-40213",
    hours: "Δευ-Παρ 07:30-15:30",
  },
];

const documents = [
  {
    title: "Κανονισμός Λειτουργίας",
    description: "Ο κανονισμός λειτουργίας της ΔΕΥΑΑ",
    type: "PDF",
    size: "2.5 MB",
  },
  {
    title: "Τιμολογιακή Πολιτική",
    description: "Τρέχουσα τιμολογιακή πολιτική",
    type: "PDF",
    size: "1.8 MB",
  },
  {
    title: "Δικαιολογητικά Σύνδεσης",
    description: "Λίστα απαιτούμενων δικαιολογητικών",
    type: "PDF",
    size: "890 KB",
  },
  {
    title: "Συχνές Ερωτήσεις",
    description: "Απαντήσεις σε συνηθισμένα ερωτήματα",
    type: "PDF",
    size: "1.2 MB",
  },
];

export default function ForCitizens() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-blue-50">
        {/* Hero Section */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-blue-600" />
              <h1 className="text-4xl font-bold mb-4 text-gray-900">Για Πολίτες</h1>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                Όλες οι πληροφορίες και υπηρεσίες που χρειάζεστε για την εξυπηρέτησή σας
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Αναφορά Προβλήματος</h3>
              <p className="text-gray-600 mb-4">Αναφέρετε βλάβες ή προβλήματα στο δίκτυο</p>
              <Button asChild>
                <Link to="/e-services/problem-reporting">Αναφορά Τώρα</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Calculator className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Υπολογισμός Λογαριασμού</h3>
              <p className="text-gray-600 mb-4">Εκτιμήστε το κόστος του λογαριασμού σας</p>
              <Button asChild variant="outline">
                <Link to="/e-services/bill-calculator">Υπολογισμός</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Phone className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Επικοινωνία</h3>
              <p className="text-gray-600 mb-4">Τρόποι επικοινωνίας με την υπηρεσία</p>
              <Button asChild variant="outline">
                <Link to="/contact">Επικοινωνήστε</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Services */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Υπηρεσίες</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg ${service.color} flex items-center justify-center mb-3`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    {service.badge && (
                      <Badge className="bg-green-100 text-green-800">{service.badge}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to={service.href}>
                      Περισσότερα
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Services */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Επείγοντα</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {emergencyServices.map((service, index) => (
              <Card key={index} className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-700 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 mr-2 text-red-600" />
                      <span className="font-medium">{service.phone}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2 text-gray-600" />
                      <span>{service.hours}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Έγγραφα & Κανονισμοί</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documents.map((doc, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium mb-2">{doc.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{doc.type}</span>
                        <span>{doc.size}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Λήψη
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Office Information */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <MapPin className="w-5 h-5 mr-2" />
              Γραφεία Εξυπηρέτησης
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Διεύθυνση</h4>
                <p className="text-gray-600">
                  Επαρ. Οδ. Καλυβών–Γεωργιούπολης 159<br />
                  Βάμος, 73008 – Χανιά, Κρήτη, Ελλάδα
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Ωράριο Λειτουργίας</h4>
                <div className="text-gray-600 space-y-1">
                  <p><strong>Δευτέρα - Παρασκευή:</strong> 07:30–15:30</p>
                  <p><strong>Ταμείο (μετρητά):</strong> 07:30–13:00</p>
                  <p><strong>Ταμείο (κάρτες):</strong> 07:30–15:30</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="font-medium mb-2">Τρόποι Πληρωμής</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Μετρητά</Badge>
                <Badge variant="outline">Κάρτα</Badge>
                <Badge variant="outline">Επί πιστώσει</Badge>
                <Badge variant="outline">e-banking</Badge>
                <Badge variant="outline">ΚΕΠ</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </Layout>
  );
}

