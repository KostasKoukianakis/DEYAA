import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, MapPin, Phone, Mail, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCreateProblem } from "@/hooks/useProblems";
import { useToast } from "@/hooks/use-toast";
import { MapPicker } from "@/components/MapPicker";

const PROBLEM_TYPES = [
  { value: "water_interruption", label: "Διακοπή Ύδρευσης" },
  { value: "sewer_issue", label: "Πρόβλημα Αποχέτευσης" },
  { value: "water_quality", label: "Ποιότητα Νερού" },
  { value: "meter_issue", label: "Πρόβλημα Μετρητή" },
  { value: "billing_issue", label: "Πρόβλημα Χρέωσης" },
  { value: "other", label: "Άλλο Πρόβλημα" },
];

const URGENCY_LEVELS = [
  { value: "low", label: "Χαμηλή", description: "Μπορεί να περιμένει" },
  { value: "medium", label: "Μεσαία", description: "Χρειάζεται προσοχή" },
  { value: "high", label: "Υψηλή", description: "Επείγον" },
  { value: "critical", label: "Κρίσιμη", description: "Άμεση παρέμβαση" },
];

export default function ProblemReporting() {
  const { toast } = useToast();
  const createProblem = useCreateProblem();

  const [formData, setFormData] = useState({
    problemType: "",
    urgency: "",
    location: "",
    latitude: null as number | null,
    longitude: null as number | null,
    description: "",
    name: "",
    phone: "",
    email: "",
    photos: [] as File[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, photos: files }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const typeLabel = PROBLEM_TYPES.find((t) => t.value === formData.problemType)?.label ?? "Άλλο Πρόβλημα";

      const descriptionLines = [
        `Τύπος: ${typeLabel}`,
        `Επείγον: ${formData.urgency || "-"}`,
        formData.name ? `Αναφέρθηκε από: ${formData.name}` : null,
        "",
        formData.description,
      ].filter((x): x is string => x !== null);

      const created = await createProblem.mutateAsync({
        title: typeLabel,
        description: descriptionLines.join("\n"),
        location: formData.location || null,
        latitude: formData.latitude,
        longitude: formData.longitude,
        status: "reported",
        priority: (formData.urgency as any) || "medium",
        category:
          formData.problemType === "meter_issue"
            ? "meter"
            : formData.problemType === "billing_issue"
              ? "billing"
              : "maintenance",
        reported_by: null,
        assigned_to: null,
        images: [],
        contact_phone: formData.phone || null,
        contact_email: formData.email || null,
      } as any);

      setSubmittedId(created?.id ?? null);
      setIsSubmitted(true);
    } catch (e: any) {
      toast({
        title: "Σφάλμα υποβολής",
        description:
          e?.message ??
          "Δεν ήταν δυνατή η καταχώρηση. Αν δεν είστε συνδεδεμένος στο dashboard, χρειάζεται policy για anonymous reports στο Supabase.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Layout>
        <div className="py-12">
          <div className="max-w-2xl mx-auto px-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Ευχαριστούμε για την αναφορά!
              </h2>
              <p className="text-gray-600 mb-4">
                Η αναφορά προβλήματος καταχωρήθηκε επιτυχώς με αριθμό πρωτοκόλλου{" "}
                <span className="font-medium">#{submittedId ? submittedId.slice(0, 8).toUpperCase() : "—"}</span>
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-800">
                  Θα ενημερωθείτε για την εξέλιξη του προβλήματος μέσω SMS και email.
                  Ο εκτιμώμενος χρόνος ανταπόκρισης είναι 24-48 ώρες για επείγοντα προβλήματα.
                </p>
              </div>
              <Button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    problemType: "",
                    urgency: "",
                    location: "",
                    latitude: null,
                    longitude: null,
                    description: "",
                    name: "",
                    phone: "",
                    email: "",
                    photos: [],
                  });
                }}
                variant="outline"
              >
                Νέα Αναφορά
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Αναφορά Προβλήματος
          </h1>
          <p className="text-gray-600">
            Αναφέρετε προβλήματα με την ύδρευση, αποχέτευση ή άλλες υπηρεσίες
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Στοιχεία Προβλήματος</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Problem Type */}
                  <div>
                    <Label htmlFor="problemType">Τύπος Προβλήματος *</Label>
                    <Select
                      value={formData.problemType}
                      onValueChange={(value) => handleInputChange("problemType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Επιλέξτε τύπο προβλήματος" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROBLEM_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Urgency Level */}
                  <div>
                    <Label htmlFor="urgency">Βαθμός Επείγοντος *</Label>
                    <Select
                      value={formData.urgency}
                      onValueChange={(value) => handleInputChange("urgency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Επιλέξτε βαθμό επείγοντος" />
                      </SelectTrigger>
                      <SelectContent>
                        {URGENCY_LEVELS.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            <div>
                              <div className="font-medium">{level.label}</div>
                              <div className="text-xs text-gray-500">{level.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location with MapPicker */}
                  <div>
                    <MapPicker
                      location={formData.location}
                      latitude={formData.latitude}
                      longitude={formData.longitude}
                      onLocationChange={(location, lat, lng) => {
                        setFormData({ ...formData, location, latitude: lat, longitude: lng });
                      }}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description">Περιγραφή Προβλήματος *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Περιγράψτε λεπτομερώς το πρόβλημα..."
                      rows={4}
                      required
                    />
                  </div>

                  {/* Photos */}
                  <div>
                    <Label htmlFor="photos">Φωτογραφίες (προαιρετικό)</Label>
                    <div className="mt-1">
                      <input
                        type="file"
                        id="photos"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="photos"
                        className="cursor-pointer flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors"
                      >
                        <div className="text-center">
                          <Upload className="mx-auto h-8 w-8 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-600">
                            Κάντε κλικ για να επιλέξετε φωτογραφίες
                          </p>
                          <p className="text-xs text-gray-500">
                            {formData.photos.length} φωτογραφίες επιλέχθηκαν
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Στοιχεία Επικοινωνίας</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Όνομα *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Τηλέφωνο *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="2310-123456"
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                    size="lg"
                  >
                    {isSubmitting ? "Υποβολή..." : "Υποβολή Αναφοράς"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Information Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Πληροφορίες
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Χρόνοι Ανταπόκρισης</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><strong>Κρίσιμα:</strong> Μέσα σε 2 ώρες</li>
                    <li><strong>Υψηλής προτεραιότητας:</strong> Μέσα σε 24 ώρες</li>
                    <li><strong>Μεσαίας προτεραιότητας:</strong> Μέσα σε 48 ώρες</li>
                    <li><strong>Χαμηλής προτεραιότητας:</strong> Μέσα σε 72 ώρες</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Εναλλακτικοί Τρόποι Επικοινωνίας</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 mr-2 text-blue-600" />
                      <span>Βλάβες: 28253-40208</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 mr-2 text-blue-600" />
                      <span>Βάμος: 28253-40213</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-2 text-green-600" />
                      <span>support@deyaa.gr</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Γραφεία Εξυπηρέτησης
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Διεύθυνση:</p>
                  <p>Επαρ. Οδ. Καλυβών–Γεωργιούπολης 159<br />Βάμος, 73008 – Χανιά, Κρήτη</p>
                  <p className="mt-2 font-medium">Ωράριο:</p>
                  <p>Δευτέρα - Παρασκευή: 07:30–15:30<br />Ταμείο: 07:30–13:00 (μετρητά) • 07:30–15:30 (κάρτες)</p>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Όλες οι αναφορές καταγράφονται και παρακολουθούνται. Θα ενημερώνεστε για την πρόοδο μέσω SMS και email.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
}

