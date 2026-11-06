import { aboutCatalog } from "@/i18n/catalog/about";
import { eServicesCatalog } from "@/i18n/catalog/eServices";
import { newsCatalog } from "@/i18n/catalog/news";
import { privacyCatalog } from "@/i18n/catalog/privacy";
import { servicesCatalog } from "@/i18n/catalog/services";
import { termsCatalog } from "@/i18n/catalog/terms";
import { uiCatalog } from "@/i18n/catalog/ui";
import { waterQualityCatalog } from "@/i18n/catalog/waterQuality";

export const catalog = {
  ...uiCatalog,
  about: aboutCatalog,
  privacy: privacyCatalog,
  terms: termsCatalog,
  services: servicesCatalog,
  eServices: eServicesCatalog,
  news: newsCatalog,
  waterQuality: waterQualityCatalog,
};
