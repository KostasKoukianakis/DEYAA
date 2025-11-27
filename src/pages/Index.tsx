import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CreditCard, 
  Gauge, 
  Droplets, 
  AlertCircle,
  FileText,
  ChevronRight,
  Calendar
} from "lucide-react";
import heroImage from "@/assets/hero-water.jpg";

const announcements = [
  {
    id: 1,
    title: "Διακοπή υδροδότησης στην περιοχή Κέντρου",
    date: "2024-01-15",
    category: "Διακοπές",
    excerpt: "Λόγω εργασιών συντήρησης, θα υπάρξει διακοπή υδροδότησης την Τετάρτη 17/01 από τις 08:00 έως τις 14:00.",
  },
  {
    id: 2,
    title: "Νέα ηλεκτρονική υπηρεσία δήλωσης ένδειξης",
    date: "2024-01-10",
    category: "Ενημέρωση",
    excerpt: "Πλέον μπορείτε να δηλώνετε την ένδειξη του μετρητή σας ηλεκτρονικά μέσω της ιστοσελίδας μας.",
  },
  {
    id: 3,
    title: "Συμβουλές εξοικονόμησης νερού",
    date: "2024-01-05",
    category: "Δελτίο Τύπου",
    excerpt: "Απλοί τρόποι για να μειώσετε την κατανάλωση νερού στο σπίτι σας και να προστατεύσετε το περιβάλλον.",
  },
];

const quickLinks = [
  {
    title: "Πληρωμή Λογαριασμού",
    description: "Εξοφλήστε τον λογαριασμό σας online",
    icon: CreditCard,
    href: "/e-services/payment",
    color: "bg-primary",
  },
  {
    title: "Δήλωση Ένδειξης",
    description: "Καταχωρήστε την ένδειξη του μετρητή",
    icon: Gauge,
    href: "/e-services/meter-reading",
    color: "bg-accent",
  },
  {
    title: "Διακοπές Νερού",
    description: "Δείτε προγραμματισμένες διακοπές",
    icon: AlertCircle,
    href: "/announcements",
    color: "bg-destructive",
  },
  {
    title: "Δικαιολογητικά",
    description: "Κατεβάστε έντυπα και αιτήσεις",
    icon: FileText,
    href: "/services/documents",
    color: "bg-success",
  },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 hero-gradient opacity-85" />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <div className="max-w-2xl animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                Δημοτική Επιχείρηση Ύδρευσης Αποχέτευσης
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/90 mb-8">
                Παροχή υψηλής ποιότητας υπηρεσιών νερού και αποχέτευσης στους πολίτες της Αττικής
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="hero" size="xl">
                  <Link to="/e-services/payment">
                    <CreditCard className="h-5 w-5" />
                    Πληρωμή Λογαριασμού
                  </Link>
                </Button>
                <Button asChild variant="heroOutline" size="xl">
                  <Link to="/e-services/meter-reading">
                    <Gauge className="h-5 w-5" />
                    Δήλωση Ένδειξης
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-12 md:py-16 water-pattern">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link) => (
              <Link key={link.title} to={link.href}>
                <Card className="h-full card-hover border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg ${link.color} text-primary-foreground flex items-center justify-center mb-4`}>
                      <link.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{link.title}</h3>
                    <p className="text-sm text-muted-foreground">{link.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Ανακοινώσεις</h2>
              <p className="text-muted-foreground mt-2">Τελευταίες ειδήσεις και ενημερώσεις</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/announcements">
                Όλες οι ανακοινώσεις
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className="card-hover">
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(announcement.date).toLocaleDateString('el-GR')}</span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs">
                      {announcement.category}
                    </span>
                  </div>
                  <CardTitle className="text-lg leading-tight">{announcement.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-3">{announcement.excerpt}</CardDescription>
                  <Link 
                    to={`/announcements/${announcement.id}`} 
                    className="inline-flex items-center text-sm text-primary mt-4 link-underline"
                  >
                    Περισσότερα
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-12 md:py-16 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Οι Υπηρεσίες μας</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Η ΔΕΥΑΑ παρέχει ολοκληρωμένες υπηρεσίες ύδρευσης και αποχέτευσης
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Droplets className="h-20 w-20 text-primary-foreground opacity-50" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Ύδρευση</CardTitle>
                <CardDescription>
                  Παροχή καθαρού πόσιμου νερού υψηλής ποιότητας σε όλα τα νοικοκυριά και επιχειρήσεις της περιοχής μας.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline">
                  <Link to="/services/water">
                    Μάθετε περισσότερα
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-accent to-success flex items-center justify-center">
                <Droplets className="h-20 w-20 text-primary-foreground opacity-50 rotate-180" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Αποχέτευση</CardTitle>
                <CardDescription>
                  Συλλογή και επεξεργασία λυμάτων με σύγχρονες μεθόδους για την προστασία του περιβάλλοντος.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline">
                  <Link to="/services/sewerage">
                    Μάθετε περισσότερα
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
