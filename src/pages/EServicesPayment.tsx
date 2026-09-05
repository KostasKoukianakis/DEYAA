import { useRef } from "react";
import { EServiceSubpageLayout } from "@/components/EServiceSubpageLayout";
import { usePaymentDashEntrance } from "@/hooks/usePaymentDashEntrance";
import {
  ArrowUpRight,
  Building2,
  CheckCircle,
  ChevronRight,
  Info,
  Landmark,
  Phone,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";
import { deyaaEServiceSections } from "@/data/deyaaEServicesHub";
import { useI18n } from "@/i18n";
import { getLocalizedEServiceSections, getLocalizedPortalHandoff } from "@/i18n/localized";

const section = deyaaEServiceSections.find((s) => s.id === "payment")!;

function PaymentSideCards() {
  const { t } = useI18n();
  const requirements = [t("eServices.paymentPage.req0"), t("eServices.paymentPage.req1"), t("eServices.paymentPage.req2")];
  const altPayment = [
    {
      icon: Building2,
      title: t("eServices.paymentPage.altCashierTitle"),
      text: t("eServices.paymentPage.altCashierText"),
    },
    {
      icon: Landmark,
      title: t("eServices.paymentPage.altBankTitle"),
      text: t("eServices.paymentPage.altBankText"),
    },
    {
      icon: Phone,
      title: t("eServices.paymentPage.altPhoneTitle"),
      text: t("eServices.paymentPage.altPhoneText"),
      href: "tel:2825340213",
    },
  ];
  const info = [t("eServices.paymentPage.info0"), t("eServices.paymentPage.info1")];

  return (
    <div className="pe-payment-dash__side-cards">
      <div className="pe-payment-dash__card">
        <div className="pe-payment-dash__card-head">
          <h2 className="pe-payment-dash__card-title">{t("eServices.paymentPage.needTitle")}</h2>
          <ChevronRight className="pe-payment-dash__card-corner" aria-hidden />
        </div>
        <ul className="pe-payment-dash__checklist pe-payment-dash__checklist--compact pe-payment-dash__checklist--oneline">
          {requirements.map((item) => (
            <li key={item}>
              <CheckCircle aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pe-payment-dash__card">
        <div className="pe-payment-dash__card-head">
          <h2 className="pe-payment-dash__card-title">{t("eServices.paymentPage.altTitle")}</h2>
          <ChevronRight className="pe-payment-dash__card-corner" aria-hidden />
        </div>
        <ul className="pe-payment-dash__line-list">
          {altPayment.map(({ icon: Icon, title, text, href }) => (
            <li key={title}>
              <Icon aria-hidden />
              {href ? (
                <a href={href} className="pe-payment-dash__line-link">
                  <strong>{title}</strong> · {text}
                </a>
              ) : (
                <span>
                  <strong>{title}</strong> · {text}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="pe-payment-dash__card">
        <div className="pe-payment-dash__card-head">
          <h2 className="pe-payment-dash__card-title">{t("eServices.paymentPage.infoTitle")}</h2>
          <Info className="pe-payment-dash__card-corner" aria-hidden />
        </div>
        <ul className="pe-payment-dash__infolist pe-payment-dash__infolist--compact pe-payment-dash__infolist--oneline">
          {info.map((item) => (
            <li key={item}>{item}</li>
          ))}
          <li>
            <Link to="/contact" className="pe-payment-dash__infolist-link">
              {t("eServices.paymentPage.contactInstallments")}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function EServicesPayment() {
  const { t } = useI18n();
  const pageRef = useRef<HTMLElement>(null);
  usePaymentDashEntrance(pageRef);
  const localizedSection = getLocalizedEServiceSections().find((s) => s.id === "payment");
  const handoff = getLocalizedPortalHandoff("payment");

  const breadcrumbs = [
    { label: t("nav.home"), href: "/" },
    { label: t("footer.eServices"), href: "/e-services" },
    { label: t("eServices.paymentPage.breadcrumb") },
  ];

  const centerArt = (
    <div
      className="pe-payment-dash__col pe-payment-dash__col--center dash-board__center-art"
      aria-hidden
      style={{ backgroundImage: `url(${section.image})` }}
    />
  );

  return (
    <EServiceSubpageLayout
      pageRef={pageRef}
      className="pe-payment-entrance pe-payment-entrance-pending"
      title={t("eServices.paymentPage.title")}
      description={localizedSection?.lead ?? section.lead}
      heroMode="minimal"
      breadcrumbs={breadcrumbs}
      heroAside={<PaymentSideCards />}
      heroCenter={centerArt}
    >
      <div className="pe-payment-dash pe-payment-dash--board">
        <div className="pe-payment-dash__grid">
          <div className="pe-payment-dash__col pe-payment-dash__col--left">
            <div className="pe-payment-dash__card pe-payment-dash__card--action">
              <div className="pe-payment-dash__card-row">
                <span className="pe-payment-dash__pill">{t("eServices.paymentPage.readyPill")}</span>
                <ArrowUpRight className="pe-payment-dash__card-corner" aria-hidden />
              </div>
              <div className="pe-payment-dash__action-wrap">
                <a
                  href={handoff?.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="palladio-button button outline white"
                >
                  {handoff?.ctaLabel ?? t("eServices.paymentPage.cta")}
                </a>
                <p className="pe-payment-dash__card-note">
                  {t("eServices.paymentPage.chooseNote", { label: handoff?.portalMenuLabel ?? "" })}
                </p>
              </div>
            </div>

            <div className="pe-payment-dash__card pe-payment-dash__card--stat">
              <div className="pe-payment-dash__card-row">
                <span className="pe-payment-dash__card-label">{t("eServices.paymentPage.platformLabel")}</span>
                <Shield className="pe-payment-dash__card-corner" aria-hidden />
              </div>
              <p className="pe-payment-dash__stat-value">services.deyaa.gr</p>
              <p className="pe-payment-dash__stat-meta">{t("eServices.paymentPage.platformMeta")}</p>
            </div>
          </div>
        </div>
      </div>
    </EServiceSubpageLayout>
  );
}
