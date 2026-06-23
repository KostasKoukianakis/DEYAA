import { useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ShaderGradientHero } from "@/components/ShaderGradientHero";
import { useReportStudioEntrance } from "@/hooks/useReportStudioEntrance";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  ChevronRight,
  MapPin,
  Phone,
  Upload,
} from "lucide-react";
import { useCreateProblem } from "@/hooks/useProblems";
import { cn } from "@/lib/utils";
import { problemReportValidationMessages } from "@/data/deyaaFormValidationMessages";
import type { FormValidationIssue } from "@/data/deyaaFormValidationMessages";
import { FormValidationNotice } from "@/components/FormValidationNotice";
import {
  applyProblemFormValidationFocus,
  getFirstProblemFormIssue,
} from "@/lib/problemFormValidation";
import { MapPicker } from "@/components/MapPicker";
import { NotARobotCheckbox } from "@/components/NotARobotCheckbox";
import { apokoronasMunicipality } from "@/data/apokoronasMunicipality";

const PANEL_TAGLINE = "Σημειώστε το σημείο στον χάρτη και υποβάλετε την αναφορά online.";

const breadcrumbs = [
  { label: "Αρχική", href: "/" },
  { label: "Ηλεκτρονικές Υπηρεσίες", href: "/e-services" },
  { label: "Αναφορά" },
];

const PROBLEM_TYPES = [
  { value: "water_interruption", label: "Διακοπή ύδρευσης" },
  { value: "sewer_issue", label: "Πρόβλημα αποχέτευσης" },
  { value: "water_quality", label: "Ποιότητα νερού" },
  { value: "meter_issue", label: "Πρόβλημα μετρητή" },
  { value: "billing_issue", label: "Πρόβλημα χρέωσης" },
  { value: "other", label: "Άλλο πρόβλημα" },
] as const;

const URGENCY_LEVELS = [
  { value: "low", label: "Χαμηλή", description: "Μπορεί να περιμένει" },
  { value: "medium", label: "Μεσαία", description: "Χρειάζεται προσοχή" },
  { value: "high", label: "Υψηλή", description: "Επείγον" },
  { value: "critical", label: "Κρίσιμη", description: "Άμεση παρέμβαση" },
] as const;

const METRICS = [
  { label: "Κρίσιμα", value: "2 ώρες" },
  { label: "Υψηλή", value: "24 ώρες" },
  { label: "Μεσαία", value: "48 ώρες" },
] as const;

const SUPPORT_STATS = [
  { label: "Βλάβες 24/7", value: "28253-40208", href: "tel:2825340208" },
  { label: "Εξυπηρέτηση", value: "28253-40213", href: "tel:2825340213" },
  { label: "Email", value: "info@deyaa.gr", href: "mailto:info@deyaa.gr" },
] as const;

const EMPTY_FORM = {
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
};

function ReportSupportCard() {
  return (
    <aside className="pe-report-studio__support pe-report-studio__support--prominent">
      <div className="pe-report-studio__support-head">
        <div className="pe-report-studio__support-avatar" aria-hidden>
          <Phone />
        </div>
        <div>
          <p className="pe-report-studio__support-name">Εξυπηρέτηση ΔΕΥΑΑ</p>
          <p className="pe-report-studio__support-handle">24/7 online υποβολή</p>
        </div>
      </div>

      <div className="pe-report-studio__support-stats">
        {SUPPORT_STATS.map(({ label, value, href }) => (
          <div key={label} className="pe-report-studio__support-stat">
            <span>{label}</span>
            <a href={href}>{value}</a>
          </div>
        ))}
      </div>

      <div className="pe-report-studio__support-foot">
        <span className="pe-report-studio__support-note">Χωρίς Taxisnet</span>
      </div>
    </aside>
  );
}

function ReportStudioShell({
  pageRef,
  panelContent,
  mapSlot,
}: {
  pageRef: React.RefObject<HTMLElement | null>;
  panelContent: ReactNode;
  mapSlot: ReactNode;
}) {
  return (
    <Layout>
      <article
        ref={pageRef}
        className="palladio-eservices palladio-eservices--subpage palladio-eservices--dash-hero pe-report-studio pe-report-studio--shader pe-report-studio-entrance pe-report-studio-entrance-pending"
      >
        <ShaderGradientHero
          className="pe-report-studio__shader-bg"
          bottomGrain
          organicSpot
        />
        <div className="palladio-eservices__stage palladio-eservices__stage--subpage">
          <div className="pe-report-studio__frame">
            <nav aria-label="Breadcrumb" className="pe-report-studio__crumbs palladio-eservices__subpage-breadcrumbs">
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.label} className="palladio-eservices__subpage-crumb">
                  {index > 0 && (
                    <ChevronRight className="palladio-eservices__subpage-crumb-sep" aria-hidden />
                  )}
                  {crumb.href ? (
                    <Link to={crumb.href}>{crumb.label}</Link>
                  ) : (
                    <span className="palladio-eservices__subpage-crumb-current">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>

            <div className="pe-report-studio__glass">
              <div className="pe-report-studio__grid">
                <div className="pe-report-studio__aside-col">
                  <div className="pe-report-studio__map-section">{mapSlot}</div>
                  <ReportSupportCard />
                </div>

                <div className="pe-report-studio__panel">
                  <header className="pe-report-studio__panel-head">
                    <h1 className="pe-report-studio__title">Αναφορά Προβλήματος</h1>
                    <div className="pe-report-studio__panel-actions">
                      <a
                        href="tel:2825340208"
                        className="pe-report-studio__icon-btn"
                        aria-label="Βλάβες 24/7"
                      >
                        <Phone aria-hidden />
                      </a>
                    </div>
                  </header>

                  <div className="pe-report-studio__panel-intro">
                    <p className="pe-report-studio__panel-tagline">{PANEL_TAGLINE}</p>
                    <ul className="pe-report-studio__sla-chips" aria-label="Χρόνοι ανταπόκρισης">
                      {METRICS.map(({ label, value }) => (
                        <li key={label} className="pe-report-studio__sla-chip">
                          <span>{label}</span>
                          <strong>{value}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {panelContent}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="palladio-eservices__subpage-spacer" aria-hidden />
      </article>
    </Layout>
  );
}

export default function ProblemReporting() {
  const pageRef = useRef<HTMLElement>(null);
  useReportStudioEntrance(pageRef);

  const createProblem = useCreateProblem();

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaResetKey, setCaptchaResetKey] = useState(0);
  const [validationIssue, setValidationIssue] = useState<FormValidationIssue | null>(null);
  const [validationIssueKey, setValidationIssueKey] = useState<string | null>(null);
  const captchaRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const mapSectionRef = useRef<HTMLDivElement>(null);

  const clearValidation = () => {
    if (validationIssue) {
      setValidationIssue(null);
      setValidationIssueKey(null);
    }
  };

  const handleCaptchaVerify = (token: string | null) => {
    setCaptchaToken(token);
    if (token) clearValidation();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearValidation();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({ ...prev, photos: files }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formEl = formRef.current;
    if (!formEl) return;

    const firstIssue = getFirstProblemFormIssue(
      formEl,
      {
        problemType: formData.problemType,
        urgency: formData.urgency,
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
        description: formData.description,
        name: formData.name,
        phone: formData.phone,
        captchaToken,
      },
      captchaRef.current,
      mapSectionRef.current,
    );

    if (firstIssue) {
      setValidationIssueKey(firstIssue.key);
      setValidationIssue(firstIssue.issue);
      applyProblemFormValidationFocus(firstIssue);
      return;
    }

    setValidationIssue(null);
    setValidationIssueKey(null);
    setIsSubmitting(true);

    try {
      const typeLabel =
        PROBLEM_TYPES.find((t) => t.value === formData.problemType)?.label ?? "Άλλο πρόβλημα";

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
        priority: (formData.urgency as "low" | "medium" | "high" | "critical") || "medium",
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
      } as Parameters<typeof createProblem.mutateAsync>[0]);

      setSubmittedId(created?.id ?? null);
      setIsSubmitted(true);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : problemReportValidationMessages.submitError.description;
      setValidationIssueKey("submitError");
      setValidationIssue({
        ...problemReportValidationMessages.submitError,
        description: message,
      });
      setCaptchaToken(null);
      setCaptchaResetKey((key) => key + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const mapSlot = (
    <div
      ref={mapSectionRef}
      id="problem-report-map"
      tabIndex={-1}
      className={cn(
        "pe-report-studio__map-focus",
        validationIssueKey === "location" && "pe-report-studio__map-focus--invalid",
      )}
    >
      {validationIssueKey === "location" && validationIssue ? (
        <FormValidationNotice
          {...validationIssue}
          className="pe-report-studio__map-validation-notice"
        />
      ) : null}
      <div className="pe-report-studio__map-head">
        <div className="pe-report-studio__map-badge">
          <MapPin aria-hidden />
          <span>{apokoronasMunicipality.name}</span>
        </div>
        <span className="pe-report-studio__map-hint">Περιοχή εξυπηρέτησης ΔΕΥΑΑ</span>
      </div>
      <p className="pe-report-studio__map-lead">{apokoronasMunicipality.serviceNote}</p>
      <MapPicker
        compact
        hideLabel
        fitBoundaryOnLoad
        municipalityBoundary={apokoronasMunicipality.geoJson}
        defaultCenter={apokoronasMunicipality.center}
        defaultZoom={apokoronasMunicipality.defaultZoom}
        location={formData.location}
        latitude={formData.latitude}
        longitude={formData.longitude}
        onLocationChange={(location, lat, lng) => {
          setFormData({ ...formData, location, latitude: lat, longitude: lng });
          clearValidation();
        }}
      />
    </div>
  );

  if (isSubmitted) {
    return (
      <ReportStudioShell
        pageRef={pageRef}
        mapSlot={mapSlot}
        panelContent={
          <div className="pe-report-studio__success">
            <div className="pe-report-studio__success-icon" aria-hidden>
              <CheckCircle />
            </div>
            <h2 className="pe-report-studio__success-title">Ευχαριστούμε για την αναφορά</h2>
            <p className="pe-report-studio__success-text">
              Αριθμός πρωτοκόλλου
            </p>
            <p className="pe-report-studio__success-protocol">
              #{submittedId ? submittedId.slice(0, 8).toUpperCase() : "—"}
            </p>
            <p className="pe-report-studio__success-note">
              Θα ενημερωθείτε για την εξέλιξη μέσω SMS και email. Για επείγοντα καλέστε{" "}
              <a href="tel:2825340208">28253-40208</a>.
            </p>
            <div className="pe-report-studio__actions">
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setSubmittedId(null);
                  setFormData(EMPTY_FORM);
                }}
                className="pe-report-studio__cta pe-report-studio__cta--primary"
              >
                Νέα αναφορά
              </button>
            </div>
          </div>
        }
      />
    );
  }

  return (
    <ReportStudioShell
      pageRef={pageRef}
      mapSlot={mapSlot}
      panelContent={
        <form ref={formRef} onSubmit={handleSubmit} className="pe-report-studio__form">
          <div className="pe-report-studio__fields pe-report-studio__fields--duo">
            <div className="pe-report-studio__field">
              <Label htmlFor="problemType">Τύπος *</Label>
              <Select
                value={formData.problemType}
                onValueChange={(value) => handleInputChange("problemType", value)}
                required
              >
                <SelectTrigger id="problemType" className="pe-report-studio__select">
                  <SelectValue placeholder="Επιλέξτε τύπο" />
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

            <div className="pe-report-studio__field">
              <Label htmlFor="urgency">Επείγον *</Label>
              <Select
                value={formData.urgency}
                onValueChange={(value) => handleInputChange("urgency", value)}
                required
              >
                <SelectTrigger id="urgency" className="pe-report-studio__select">
                  <SelectValue placeholder="Επιλέξτε επείγον" />
                </SelectTrigger>
                <SelectContent>
                  {URGENCY_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pe-report-studio__field">
            <Label htmlFor="description">Περιγραφή *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Τι συμβαίνει και πού ακριβώς;"
              rows={3}
              className="pe-report-studio__textarea"
              required
            />
          </div>

          <div className="pe-report-studio__field">
            <Label htmlFor="photos">Φωτογραφίες</Label>
            <input
              type="file"
              id="photos"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
            />
            <label htmlFor="photos" className="pe-report-studio__upload">
              <Upload aria-hidden />
              <span>
                <strong>
                  {formData.photos.length > 0
                    ? `${formData.photos.length} επιλεγμένες`
                    : "Προσθήκη φωτογραφιών"}
                </strong>
                <small>PNG, JPG · έως 10MB</small>
              </span>
            </label>
          </div>

          <div className="pe-report-studio__form-divider" aria-hidden />

          <div className="pe-report-studio__contact pe-report-studio__contact--compact">
            <div className="pe-report-studio__fields pe-report-studio__fields--duo">
              <div className="pe-report-studio__field">
                <Label htmlFor="name">Όνομα *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="pe-report-studio__input"
                  required
                />
              </div>
              <div className="pe-report-studio__field">
                <Label htmlFor="phone">Τηλέφωνο *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="28253-40213"
                  className="pe-report-studio__input"
                  required
                />
              </div>
            </div>
            <div className="pe-report-studio__field">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="email@example.com"
                className="pe-report-studio__input"
              />
            </div>
          </div>

          <div ref={captchaRef}>
            <NotARobotCheckbox
              resetKey={captchaResetKey}
              onVerify={handleCaptchaVerify}
              invalid={validationIssueKey === "captcha"}
              className="pe-report-studio__captcha"
            />
          </div>

          {validationIssue && validationIssueKey !== "location" ? (
            <FormValidationNotice
              {...validationIssue}
              className="pe-report-studio__validation-notice"
            />
          ) : null}

          <div className="pe-report-studio__actions">
            <button
              type="submit"
              disabled={isSubmitting}
              className="pe-report-studio__cta pe-report-studio__cta--primary"
            >
              {isSubmitting ? "Υποβολή..." : "Υποβολή αναφοράς"}
            </button>
          </div>
        </form>
      }
    />
  );
}
