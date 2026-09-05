import { Layout } from "@/components/layout/Layout";
import { useI18n } from "@/i18n";

export default function Privacy() {
  const { t } = useI18n();

  return (
    <Layout>
      <section className="page-section">
        <div className="container max-w-3xl">
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            {t("privacy.title")}
          </h1>
          <p className="mt-4 text-muted-foreground">
            {t("privacy.org")}
          </p>

          <div className="prose prose-slate mt-10 max-w-none space-y-8 text-foreground/90">
            <section>
              <h2 className="font-display text-xl font-bold">{t("privacy.h1")}</h2>
              <p>
                {t("privacy.p1")}{" "}
                <a href="/contact" className="text-primary underline-offset-2 hover:underline">
                  {t("privacy.contactLink")}
                </a>
                .
              </p>
            </section>

            <section id="cookies">
              <h2 className="font-display text-xl font-bold">{t("privacy.h2")}</h2>
              <p>
                {t("privacy.p2a")}
              </p>
              <p>
                {t("privacy.p2b")}
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold">{t("privacy.h3")}</h2>
              <p>
                {t("privacy.p3")}
              </p>
            </section>
          </div>
        </div>
      </section>
    </Layout>
  );
}
