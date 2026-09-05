import { aboutCatalog } from "@/i18n/catalog/about";
import { eServicesCatalog } from "@/i18n/catalog/eServices";
import { newsCatalog } from "@/i18n/catalog/news";
import { servicesCatalog } from "@/i18n/catalog/services";
import { uiCatalog } from "@/i18n/catalog/ui";

export const catalog = {
  ...uiCatalog,
  about: aboutCatalog,
  services: servicesCatalog,
  eServices: eServicesCatalog,
  news: newsCatalog,
};
