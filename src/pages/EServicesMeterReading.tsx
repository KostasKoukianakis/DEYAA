import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gauge, CheckCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EServicesMeterReading() {
  const [formData, setFormData] = useState({
    supplyNumber: "",
    meterReading: "",
    name: "",
    phone: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Επιτυχής Υποβολή",
      description: "Η ένδειξη του μετρητή σας καταχωρήθηκε επιτυχώς.",
    });

    setFormData({
      supplyNumber: "",
      meterReading: "",
      name: "",
      phone: "",
      email: "",
    });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Layout>
      <div className="bg-primary py-16">
        <div className="container">
          <div className="flex items-center gap-4">
            <Gauge className="h-10 w-10 text-primary-foreground" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">Δήλωση Ένδειξης</h1>
              <p className="text-primary-foreground/80 mt-1">Καταχώρηση ένδειξης υδρομέτρου</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="mb-6 border-primary/20 bg-secondary/30">
            <CardContent className="p-4 flex items-start gap-3">
              <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-foreground">Οδηγίες</p>
                <p className="text-muted-foreground mt-1">
                  Ο αριθμός παροχής βρίσκεται στον λογαριασμό νερού. Η ένδειξη του μετρητή 
                  είναι ο αριθμός που εμφανίζεται στο υδρόμετρο (μόνο τα μαύρα ψηφία).
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Φόρμα Δήλωσης Ένδειξης</CardTitle>
              <CardDescription>
                Συμπληρώστε τα παρακάτω στοιχεία για να καταχωρήσετε την ένδειξη του μετρητή σας.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplyNumber">Αριθμός Παροχής *</Label>
                    <Input
                      id="supplyNumber"
                      name="supplyNumber"
                      placeholder="π.χ. 123456789"
                      value={formData.supplyNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meterReading">Ένδειξη Μετρητή (m³) *</Label>
                    <Input
                      id="meterReading"
                      name="meterReading"
                      type="number"
                      placeholder="π.χ. 12345"
                      value={formData.meterReading}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Ονοματεπώνυμο *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Ονοματεπώνυμο καταναλωτή"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Τηλέφωνο Επικοινωνίας *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="π.χ. 6912345678"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    "Υποβολή..."
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Υποβολή Ένδειξης
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
