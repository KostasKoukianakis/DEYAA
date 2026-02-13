import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import contactImage from "@/pages/images/contact.png";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Το μήνυμά σας εστάλη",
      description: "Θα επικοινωνήσουμε μαζί σας το συντομότερο δυνατό.",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Layout>
      {/* Background color layer - fully opaque */}
      <div className="fixed inset-0 z-0" style={{ backgroundColor: '#e2eef3', opacity: 1 }}></div>

      {/* Split Layout: Image 50% αριστερά, Form 50% δεξιά (< 1921px) ή 60%/40% (>= 1921px) */}
      <div className="relative z-10 min-h-screen flex w-full">
        {/* Contact image with opacity - positioned on the right, only within main content */}
        {/* Image layer - opacity only affects the image, not content */}
        <div 
          className="absolute inset-0 z-[5] overflow-hidden pointer-events-none"
          style={{
            backgroundImage: `url(${contactImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'right',
            backgroundRepeat: 'no-repeat',
            // opacity: 0.7,
          }}
        >
          {/* Gradient overlay that fades the right side to 30% opacity (0.7 * 0.43 ≈ 0.3) */}
          {/* <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, transparent 0%, rgba(226, 238, 243, 0.57) 100%)',
            }}
          ></div> */}
        </div>
        {/* Left Column - Empty space για την εικόνα */}
        <div className="hidden lg:block lg:w-[50%] xl:w-[60%] relative">
          {/* Αυτό το div είναι άδειο, η εικόνα είναι στο fixed background */}
        </div>

        {/* Right Column - Form Only */}
        <div className="w-full lg:w-[50%] xl:w-[40%] flex items-center justify-center p-8 lg:p-12 relative z-20">
          <div className="w-full max-w-md">
            <Card className="bg-white/95 backdrop-blur-xl border-gray-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-900">Φόρμα Επικοινωνίας</CardTitle>
                <CardDescription className="text-gray-600">
                  Συμπληρώστε τη φόρμα και θα επικοινωνήσουμε μαζί σας σύντομα.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-900">Ονοματεπώνυμο *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-900">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-900">Τηλέφωνο</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-gray-900">Θέμα *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-900">Μήνυμα *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      "Αποστολή..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Αποστολή Μηνύματος
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
