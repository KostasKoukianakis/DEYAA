import { PalladioServicesPage } from "@/components/PalladioServicesPage";
import { useI18n } from "@/i18n";
import { getLocalizedServicesHubSections } from "@/i18n/localized";

export function ServicesHubPage() {
  const { t } = useI18n();
  return (
    <PalladioServicesPage
      headline={t("services.page.headline")}
      intro={t("services.page.heroIntro")}
      sections={getLocalizedServicesHubSections()}
    />
  );
}
