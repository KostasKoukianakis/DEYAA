import { useRef } from "react";
import { EServiceSubpageLayout } from "@/components/EServiceSubpageLayout";
import { usePaymentDashEntrance } from "@/hooks/usePaymentDashEntrance";
import {
  ArrowUpRight,
  CheckCircle,
  ChevronRight,
  Gauge,
  Hash,
  Info,
  Phone,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";
import { deyaaEServiceSections } from "@/data/deyaaEServicesHub";
import { useI18n } from "@/i18n";
import { getLocalizedEServiceSections, getLocalizedPortalHandoff } from "@/i18n/localized";

const section = deyaaEServiceSections.find((s) => s.id === "meter-reading")!;

function MeterReadingSideCards() {
  const { t } = useI18n();
  const requirements = [t("eServices.meterPage.req0"), t("eServices.meterPage.req1"), t("eServices.meterPage.req2")];
  const howToDeclare = [
    {
      icon: Hash,
      title: t("eServices.meterPage.howSupplyTitle"),
      text: t("eServices.meterPage.howSupplyText"),
    },
    {
      icon: Gauge,
      title: t("eServices.meterPage.howReadingTitle"),
      text: t("eServices.meterPage.howReadingText"),
    },
    {
      icon: Phone,
      title: t("eServices.meterPage.howPhoneTitle"),
      text: t("eServices.meterPage.howPhoneText"),
      href: "tel:2825340213",
    },
  ];
  const info = [t("eServices.meterPage.info0"), t("eServices.meterPage.info1")];

  return (
    <div className="pe-payment-dash__side-cards">
      <div className="pe-payment-dash__card">
        <div className="pe-payment-dash__card-head">
          <h2 className="pe-payment-dash__card-title">{t("eServices.meterPage.needTitle")}</h2>
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
          <h2 className="pe-payment-dash__card-title">{t("eServices.meterPage.howTitle")}</h2>
          <ChevronRight className="pe-payment-dash__card-corner" aria-hidden />
        </div>
        <ul className="pe-payment-dash__line-list">
          {howToDeclare.map(({ icon: Icon, title, text, href }) => (
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
          <h2 className="pe-payment-dash__card-title">{t("eServices.meterPage.infoTitle")}</h2>
          <Info className="pe-payment-dash__card-corner" aria-hidden />
        </div>
        <ul className="pe-payment-dash__infolist pe-payment-dash__infolist--compact pe-payment-dash__infolist--oneline">
          {info.map((item) => (
            <li key={item}>{item}</li>
          ))}
          <li>
            <Link to="/e-services/problem-reporting" className="pe-payment-dash__infolist-link">
              {t("eServices.meterPage.faultLink")}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function EServicesMeterReading() {
  const { t } = useI18n();
  const pageRef = useRef<HTMLElement>(null);
  usePaymentDashEntrance(pageRef);
  const localizedSection = getLocalizedEServiceSections().find((s) => s.id === "meter-reading");
  const handoff = getLocalizedPortalHandoff("meter-reading");

  const breadcrumbs = [
    { label: t("nav.home"), href: "/" },
    { label: t("footer.eServices"), href: "/e-services" },
    { label: t("eServices.meterPage.breadcrumb") },
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
      title={t("eServices.meterPage.title")}
      description={localizedSection?.lead ?? section.lead}
      heroMode="minimal"
      breadcrumbs={breadcrumbs}
      heroAside={<MeterReadingSideCards />}
      heroCenter={centerArt}
    >
      <div className="pe-payment-dash pe-payment-dash--board">
        <div className="pe-payment-dash__grid">
          <div className="pe-payment-dash__col pe-payment-dash__col--left">
            <div className="pe-payment-dash__card pe-payment-dash__card--action">
              <div className="pe-payment-dash__card-row">
                <span className="pe-payment-dash__pill">{t("eServices.meterPage.readyPill")}</span>
                <ArrowUpRight className="pe-payment-dash__card-corner" aria-hidden />
              </div>
              <div className="pe-payment-dash__action-wrap">
                <a
                  href={handoff?.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="palladio-button button outline white"
                >
                  {handoff?.ctaLabel ?? t("eServices.meterPage.cta")}
                </a>
                <p className="pe-payment-dash__card-note">
                  {t("eServices.meterPage.chooseNote", { label: handoff?.portalMenuLabel ?? "" })}
                </p>
              </div>
            </div>

            <div className="pe-payment-dash__card pe-payment-dash__card--stat">
              <div className="pe-payment-dash__card-row">
                <span className="pe-payment-dash__card-label">{t("eServices.meterPage.platformLabel")}</span>
                <Shield className="pe-payment-dash__card-corner" aria-hidden />
              </div>
              <p className="pe-payment-dash__stat-value">services.deyaa.gr</p>
              <p className="pe-payment-dash__stat-meta">{t("eServices.meterPage.platformMeta")}</p>
            </div>
          </div>
        </div>
      </div>
    </EServiceSubpageLayout>
  );
}
