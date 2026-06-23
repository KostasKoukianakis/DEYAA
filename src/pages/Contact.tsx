import { Layout } from "@/components/layout/Layout";
import { ContactMapHero } from "@/components/ContactMapHero";
import { ContactMapRoadsLayer } from "@/components/ContactMapRoadsLayer";
import { DeyaaContactSection } from "@/components/DeyaaContactSection";

// Pin picker (disabled) — uncomment to re-enable dev coordinate picking on /contact
// import { ContactMapPinPickerToggle } from "@/components/ContactMapPinPickerPanel";
// import { cn } from "@/lib/utils";
// import { useContactMapPinPickerMode } from "@/hooks/useContactMapPinPicker";

export default function Contact() {
  // const pinPicker = useContactMapPinPickerMode();

  return (
    <Layout>
      {/* {!pinPicker.isActive && <ContactMapPinPickerToggle onEnable={pinPicker.enable} />} */}
      <main className="contact-page">
        <ContactMapRoadsLayer />
        <ContactMapHero />
        <DeyaaContactSection
          id="section-05"
          sectionIndex="05"
          className="relative"
          showDownloads={false}
          showSectionAnchor={false}
        />
      </main>
    </Layout>
  );
}
