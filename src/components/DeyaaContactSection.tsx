import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface DeyaaContactSectionProps {
  id?: string;
  downloadsId?: string;
  className?: string;
  sectionLabel?: string;
  sectionIndex?: string;
  headline?: string;
  downloadsTitle?: string;
  downloadsDescription?: string;
  downloadsCtaLabel?: string;
  downloadsHref?: string;
  privacyHref?: string;
}

interface ContactFormState {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone: string;
  country: string;
  city: string;
  message: string;
  marketingConsent: boolean;
  privacyAccepted: boolean;
}

const initialFormState: ContactFormState = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  phone: "",
  country: "Ελλάδα",
  city: "",
  message: "",
  marketingConsent: false,
  privacyAccepted: false,
};

/**
 * Palladio #contacts [05] + #go-to-downloads — contact form and documents CTA.
 */
export function DeyaaContactSection({
  id = "section-05",
  downloadsId = "section-05-downloads",
  className,
  sectionLabel = "Επικοινωνία",
  sectionIndex = "05",
  headline = "Μιλήστε μαζί μας",
  downloadsTitle = "Χρήσιμα υλικά για λήψη",
  downloadsDescription = "Καταστάσεις, τιμολόγια, έντυπα και τεχνικά στοιχεία. Ένας χώρος σχεδιασμένος για εύκολη και άμεση πρόσβαση στα έγγραφα που χρειάζεστε.",
  downloadsCtaLabel = "Μετάβαση στα έγγραφα",
  downloadsHref = "/services/documents",
  privacyHref = "/privacy",
}: DeyaaContactSectionProps) {
  const { toast } = useToast();
  const [form, setForm] = useState<ContactFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof ContactFormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.privacyAccepted) {
      toast({
        title: "Απαιτείται αποδοχή",
        description: "Παρακαλούμε διαβάστε και αποδεχτείτε την πολιτική απορρήτου.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    toast({
      title: "Το μήνυμά σας εστάλη",
      description: "Θα επικοινωνήσουμε μαζί σας το συντομότερο δυνατό.",
    });

    setForm(initialFormState);
    setIsSubmitting(false);
  };

  return (
    <>
      <section id={id} className={cn("palladio-contact", className)} aria-label={sectionLabel}>
        <div className="palladio-contact__shell">
          <div className="palladio-contact__anchor">
            <span className="palladio-contact__anchor-label">{sectionLabel}</span>
            <span className="palladio-contact__anchor-index">[{sectionIndex}]</span>
          </div>

          <div className="palladio-contact__grid">
            <div className="palladio-contact__headline-col">
              <h2 className="palladio-contact__headline">{headline}</h2>
            </div>

            <div className="palladio-contact__form-col">
              <form className="palladio-contact__form" onSubmit={handleSubmit} noValidate>
                <div className="palladio-contact__fields-row">
                  <label className="palladio-contact__field">
                    <span className="palladio-contact__label">Όνομα*</span>
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      placeholder="Όνομα"
                      required
                      autoComplete="given-name"
                    />
                  </label>

                  <label className="palladio-contact__field">
                    <span className="palladio-contact__label">Επώνυμο*</span>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      placeholder="Επώνυμο"
                      required
                      autoComplete="family-name"
                    />
                  </label>
                </div>

                <label className="palladio-contact__field">
                  <span className="palladio-contact__label">Email*</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="Email"
                    required
                    autoComplete="email"
                  />
                </label>

                <label className="palladio-contact__field">
                  <span className="palladio-contact__label">Επωνυμία*</span>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={(e) => updateField("company", e.target.value)}
                    placeholder="Επωνυμία"
                    required
                    autoComplete="organization"
                  />
                </label>

                <label className="palladio-contact__field palladio-contact__field--phone">
                  <span className="palladio-contact__label">Κινητό τηλέφωνο*</span>
                  <span className="palladio-contact__phone-wrap">
                    <span className="palladio-contact__phone-prefix" aria-hidden>
                      🇬🇷 +30
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="690 000 0000"
                      required
                      autoComplete="tel"
                    />
                  </span>
                </label>

                <div className="palladio-contact__fields-row">
                  <label className="palladio-contact__field">
                    <span className="palladio-contact__label">Χώρα*</span>
                    <input
                      type="text"
                      name="country"
                      value={form.country}
                      onChange={(e) => updateField("country", e.target.value)}
                      placeholder="Χώρα"
                      required
                      autoComplete="country-name"
                    />
                  </label>

                  <label className="palladio-contact__field">
                    <span className="palladio-contact__label">Πόλη*</span>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      placeholder="Πόλη"
                      required
                      autoComplete="address-level2"
                    />
                  </label>
                </div>

                <label className="palladio-contact__field">
                  <span className="palladio-contact__label">Μήνυμα*</span>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    placeholder="Γράψτε το μήνυμά σας"
                    rows={5}
                    required
                  />
                </label>

                <label className="palladio-contact__checkbox">
                  <input
                    type="checkbox"
                    checked={form.marketingConsent}
                    onChange={(e) => updateField("marketingConsent", e.target.checked)}
                  />
                  <span>
                    Συναινώ στην επεξεργασία των προσωπικών μου δεδομένων για εμπορικούς σκοπούς,
                    συμπεριλαμβανομένης της αποστολής promotional material με αυτοματοποιημένα και
                    μη αυτοματοποιημένα μέσα.
                  </span>
                </label>

                <label className="palladio-contact__checkbox">
                  <input
                    type="checkbox"
                    checked={form.privacyAccepted}
                    onChange={(e) => updateField("privacyAccepted", e.target.checked)}
                    required
                  />
                  <span>
                    Έχω διαβάσει και κατανοώ την{" "}
                    <Link to={privacyHref} className="palladio-contact__privacy-link">
                      πολιτική απορρήτου
                    </Link>
                    *
                  </span>
                </label>

                <div className="palladio-contact__submit-wrap">
                  <button type="submit" className="palladio-contact__submit" disabled={isSubmitting}>
                    {isSubmitting ? "Αποστολή…" : "Αποστολή"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section
        id={downloadsId}
        className="palladio-contact-downloads"
        aria-label={downloadsTitle}
      >
        <div className="palladio-contact-downloads__inner">
          <div className="palladio-contact-downloads__grid">
            <div className="palladio-contact-downloads__copy">
              <h2 className="palladio-contact-downloads__title">{downloadsTitle}</h2>
              <p className="palladio-contact-downloads__description">{downloadsDescription}</p>
            </div>

            <div className="palladio-contact-downloads__cta-col">
              <Link to={downloadsHref} className="palladio-button button outline white">
                {downloadsCtaLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
