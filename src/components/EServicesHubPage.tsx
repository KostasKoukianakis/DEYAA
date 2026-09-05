import { PalladioServicesListingPage } from "@/components/PalladioServicesListingPage";
import { useI18n } from "@/i18n";
import { getLocalizedEServiceSections } from "@/i18n/localized";

export function EServicesHubPage() {
  const { t } = useI18n();
  return (
    <PalladioServicesListingPage
      copy={{
        headline: t("eServices.hub.headline"),
        bannerLead: t("eServices.hub.bannerLead"),
        bannerBody: t("eServices.hub.bannerBody"),
        statementTitleLines: [t("eServices.hub.statementTitle0"), t("eServices.hub.statementTitle1")],
        statementBody: [t("eServices.hub.statementBody0"), t("eServices.hub.statementBody1")],
        catalogCtaLabel: t("eServices.hub.catalogCta"),
        catalogCtaHref: "/contact",
      }}
      sections={getLocalizedEServiceSections()}
      headingId="eservices-heading"
      listId="eservices-list"
    />
  );
}
