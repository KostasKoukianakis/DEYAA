import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { LegalDocument, LegalList, LegalSection } from "@/components/LegalDocument";
import { useI18n } from "@/i18n";

const TOC = [
  { id: "privacy-intro", key: "privacy.toc.intro" },
  { id: "privacy-controller", key: "privacy.toc.controller" },
  { id: "privacy-law", key: "privacy.toc.law" },
  { id: "privacy-data", key: "privacy.toc.data" },
  { id: "privacy-purposes", key: "privacy.toc.purposes" },
  { id: "cookies", key: "privacy.toc.cookies" },
  { id: "privacy-recipients", key: "privacy.toc.recipients" },
  { id: "privacy-retention", key: "privacy.toc.retention" },
  { id: "privacy-security", key: "privacy.toc.security" },
  { id: "privacy-rights", key: "privacy.toc.rights" },
  { id: "privacy-extras", key: "privacy.toc.extras" },
] as const;

const COOKIE_ROWS = [
  {
    name: "deyaa_cookie_consent",
    purposeKey: "cookies.table.consentPurpose",
    typeKey: "cookies.table.essentialType",
    durationKey: "cookies.table.consentDuration",
  },
  {
    nameKey: "privacy.s6.langName",
    purposeKey: "privacy.s6.langPurpose",
    typeKey: "privacy.s6.langType",
    durationKey: "privacy.s6.langDuration",
  },
  {
    name: "sb-*-auth-token",
    purposeKey: "cookies.table.authPurpose",
    typeKey: "cookies.table.essentialType",
    durationKey: "cookies.table.providerPolicy",
  },
  {
    name: "UserWay",
    purposeKey: "cookies.table.userwayPurpose",
    typeKey: "cookies.table.functionalType",
    durationKey: "cookies.table.providerPolicy",
  },
  {
    nameKey: "privacy.s6.recaptchaName",
    purposeKey: "privacy.s6.recaptchaPurpose",
    typeKey: "privacy.s6.recaptchaType",
    durationKey: "cookies.table.providerPolicy",
  },
  {
    nameKey: "privacy.s6.analyticsName",
    purposeKey: "privacy.s6.analyticsPurpose",
    typeKey: "privacy.s6.analyticsType",
    durationKey: "privacy.s6.analyticsDuration",
  },
] as const;

export default function Privacy() {
  const { t, tList } = useI18n();

  return (
    <Layout>
      <LegalDocument
        title={t("privacy.pageTitle")}
        updated={t("privacy.updated")}
        tocAria={t("privacy.tocAria")}
        toc={TOC.map((item) => ({ id: item.id, label: t(item.key) }))}
      >
        <LegalSection id="privacy-intro" title={t("privacy.s1.title")}>
          <p>{t("privacy.s1.p1")}</p>
          <p>{t("privacy.s1.p2")}</p>
        </LegalSection>

        <LegalSection id="privacy-controller" title={t("privacy.s2.title")}>
          <p>{t("privacy.s2.p1")}</p>
          <p>{t("privacy.s2.address")}</p>
          <p>
            <a href="tel:+302825340213">{t("privacy.s2.phone")}</a>
          </p>
          <p>
            <a href="mailto:info@deyaa.gr">{t("privacy.s2.email")}</a>
            {" · "}
            <Link to="/contact">{t("privacy.contactPage")}</Link>
          </p>
          <p>{t("privacy.s2.p2")}</p>
        </LegalSection>

        <LegalSection id="privacy-law" title={t("privacy.s3.title")}>
          <p>{t("privacy.s3.p1")}</p>
          <p>{t("privacy.s3.basesTitle")}</p>
          <LegalList items={tList("privacy.s3.bases")} />
        </LegalSection>

        <LegalSection id="privacy-data" title={t("privacy.s4.title")}>
          <p>{t("privacy.s4.p1")}</p>
          <LegalList items={tList("privacy.s4.items")} />
        </LegalSection>

        <LegalSection id="privacy-purposes" title={t("privacy.s5.title")}>
          <LegalList items={tList("privacy.s5.items")} />
        </LegalSection>

        <LegalSection id="cookies" title={t("privacy.s6.title")}>
          <p>{t("privacy.s6.p1")}</p>
          <p>{t("privacy.s6.p2")}</p>
          <p>{t("privacy.s6.listTitle")}</p>
          <dl className="legal-doc__cookies">
            {COOKIE_ROWS.map((row) => (
              <div key={"name" in row ? row.name : row.nameKey} className="legal-doc__cookie">
                <dt>
                  {"name" in row ? row.name : t(row.nameKey)}
                  <span>{t(row.typeKey)}</span>
                </dt>
                <dd>
                  {t(row.purposeKey)}
                  <em>{t(row.durationKey)}</em>
                </dd>
              </div>
            ))}
          </dl>
        </LegalSection>

        <LegalSection id="privacy-recipients" title={t("privacy.s7.title")}>
          <p>{t("privacy.s7.p1")}</p>
          <LegalList items={tList("privacy.s7.items")} />
          <p>{t("privacy.s7.p2")}</p>
        </LegalSection>

        <LegalSection id="privacy-retention" title={t("privacy.s8.title")}>
          <LegalList items={tList("privacy.s8.items")} />
        </LegalSection>

        <LegalSection id="privacy-security" title={t("privacy.s9.title")}>
          <p>{t("privacy.s9.p1")}</p>
        </LegalSection>

        <LegalSection id="privacy-rights" title={t("privacy.s10.title")}>
          <p>{t("privacy.s10.p1")}</p>
          <LegalList items={tList("privacy.s10.items")} />
          <p>{t("privacy.s10.p2")}</p>
          <p>
            {t("privacy.s10.p3")}{" "}
            <a href="https://www.dpa.gr" rel="noreferrer" target="_blank">
              www.dpa.gr
            </a>
          </p>
        </LegalSection>

        <LegalSection id="privacy-extras" title={t("privacy.s11.title")}>
          <p>{t("privacy.s11.children")}</p>
          <p>
            {t("privacy.s11.termsSee")}{" "}
            <Link to="/terms">{t("privacy.toc.termsSee")}</Link>.
          </p>
          <p>{t("privacy.s11.changes")}</p>
        </LegalSection>
      </LegalDocument>
    </Layout>
  );
}
