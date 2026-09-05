import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { LegalDocument, LegalList, LegalSection } from "@/components/LegalDocument";
import { useI18n } from "@/i18n";

const TOC = [
  { id: "terms-accept", key: "terms.toc.accept" },
  { id: "terms-purpose", key: "terms.toc.purpose" },
  { id: "terms-content", key: "terms.toc.content" },
  { id: "terms-use", key: "terms.toc.use" },
  { id: "terms-ip", key: "terms.toc.ip" },
  { id: "terms-services", key: "terms.toc.services" },
  { id: "terms-liability", key: "terms.toc.liability" },
  { id: "terms-data", key: "terms.toc.data" },
  { id: "terms-law", key: "terms.toc.law" },
] as const;

export default function Terms() {
  const { t, tList } = useI18n();

  return (
    <Layout>
      <LegalDocument
        title={t("terms.pageTitle")}
        updated={t("terms.updated")}
        tocAria={t("terms.tocAria")}
        toc={TOC.map((item) => ({ id: item.id, label: t(item.key) }))}
      >
        <LegalSection id="terms-accept" title={t("terms.s1.title")}>
          <p>{t("terms.s1.p1")}</p>
          <p>{t("terms.s1.p2")}</p>
        </LegalSection>

        <LegalSection id="terms-purpose" title={t("terms.s2.title")}>
          <p>{t("terms.s2.p1")}</p>
          <p>{t("terms.s2.address")}</p>
        </LegalSection>

        <LegalSection id="terms-content" title={t("terms.s3.title")}>
          <p>{t("terms.s3.p1")}</p>
          <p>{t("terms.s3.p2")}</p>
        </LegalSection>

        <LegalSection id="terms-use" title={t("terms.s4.title")}>
          <p>{t("terms.s4.p1")}</p>
          <LegalList items={tList("terms.s4.items")} />
        </LegalSection>

        <LegalSection id="terms-ip" title={t("terms.s5.title")}>
          <p>{t("terms.s5.p1")}</p>
          <p>{t("terms.s5.p2")}</p>
        </LegalSection>

        <LegalSection id="terms-services" title={t("terms.s6.title")}>
          <p>{t("terms.s6.p1")}</p>
          <p>{t("terms.s6.p2")}</p>
        </LegalSection>

        <LegalSection id="terms-liability" title={t("terms.s7.title")}>
          <p>{t("terms.s7.p1")}</p>
          <p>{t("terms.s7.p2")}</p>
        </LegalSection>

        <LegalSection id="terms-data" title={t("terms.s8.title")}>
          <p>
            {t("terms.s8.p1")}{" "}
            <Link to="/privacy">{t("terms.privacyLink")}</Link>.
          </p>
        </LegalSection>

        <LegalSection id="terms-law" title={t("terms.s9.title")}>
          <p>{t("terms.s9.p1")}</p>
          <p>{t("terms.s9.p2")}</p>
          <p>
            {t("terms.s9.p3")}{" "}
            <Link to="/contact">{t("terms.contactPage")}</Link>
          </p>
        </LegalSection>
      </LegalDocument>
    </Layout>
  );
}
