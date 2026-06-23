import { PalladioServicesListingPage } from "@/components/PalladioServicesListingPage";
import { deyaaEServiceHubCopy, deyaaEServiceSections } from "@/data/deyaaEServicesHub";

export function EServicesHubPage() {
  return (
    <PalladioServicesListingPage
      copy={deyaaEServiceHubCopy}
      sections={deyaaEServiceSections}
      headingId="eservices-heading"
      listId="eservices-list"
    />
  );
}
