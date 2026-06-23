import { PalladioServicesPage } from "@/components/PalladioServicesPage";
import { deyaaServicesHubCopy, deyaaServicesHubSections } from "@/data/deyaaServicesHub";

export function ServicesHubPage() {
  return (
    <PalladioServicesPage
      headline={deyaaServicesHubCopy.headline}
      intro={deyaaServicesHubCopy.heroIntro}
      sections={deyaaServicesHubSections}
    />
  );
}
