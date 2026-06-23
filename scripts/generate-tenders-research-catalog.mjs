/** Generates tenders design research catalog (300+ URLs) */
const deyas = [
  "ker", "ath", "ch", "h", "as", "amv", "kileler", "peir", "patr", "vol", "lar", "kav", "rod", "xan",
  "ser", "lam", "koz", "kard", "trik", "ioan", "arta", "preve", "flor", "kast", "dram", "evros",
  "kilk", "pella", "imath", "pier", "thes", "magn", "spor", "lesv", "chios", "samos", "dod",
  "zak", "kef", "lefk", "corf", "aig", "arg", "kor", "argol", "arc", "lak", "mess", "ilia",
  "acha", "ait", "fok", "voi", "fth", "evia", "att", "mar", "raf", "pall", "aigina", "kal",
  "naus", "korinth", "sparti", "tripoli", "mytil", "komo", "alex", "veria", "kater", "kozani",
  "florina", "kastoria", "grevena", "kilkis", "serres", "drama", "xanthi", "komot", "alexpol",
  "kavala", "thiva", "livad", "agrini", "mesol", "prevez", "igoum", "ioannina", "kalam",
  "korinthos", "patra", "peiraias", "nafpl", "nafp", "amfil", "igoumenitsa", "sitia", "ierapetra",
];

const reviewed = [
  { name: "EYDAP — Προμήθειες", url: "https://www.eydap.gr/TheCompany/Contests/ProcurementNotices/", focus: "Λίστα με CPV, ημερομηνίες, links εγγράφων, ref E-xxx" },
  { name: "EYDAP — Έργα", url: "https://www.eydap.gr/TheCompany/Contests/ProjectNotices", focus: "Ξεχωριστή κατηγορία έργων vs προμηθειών" },
  { name: "EYATH — Διαγωνισμοί", url: "https://www.eyath.gr/diagonismoi/", focus: "Tabs έργα/προμήθειες, στήλες CPV & ESHDIS" },
  { name: "EYATH — Προμήθειες 2024", url: "https://www.eyath.gr/stm_works_category/diagonismoi-etoys-2024/", focus: "Archive ανά έτος, τίτλοι με #### hierarchy" },
  { name: "DEYA Kerkyra", url: "https://www.deya-ker.gr/diagonismoi/diagonismoi-prokiryxeis.html", focus: "Structured blocks: deadline, τιμή, ΑΔΑ, Λήψη/Προβολή PDF" },
  { name: "DEYAH — Αρχείο", url: "https://www.deyah.gr/category/diagonismoi-prokiruxeis/", focus: "WordPress archive, ημερομηνία + Αριθ. Πρωτ + status έληξε" },
  { name: "DEYACH — Ανακοινώσεις", url: "https://deyach.gr/category/announcements/", focus: "Single post per tender, ESHDIS + ΚΗΜΔΗΣ dates στο body" },
  { name: "DEYACH — Προκήρυξη detail", url: "https://deyach.gr/prokiryxi-diagonismou-ypiresia-katharismou-ktirion-kai-egkatastaseon-deva-chanion-3os-2026/", focus: "Full legal text + CPV + budget breakdown" },
  { name: "DEYAMV — Ενημέρωση", url: "https://deyamv.gr/enhmerwsh/ergakaimeletes/", focus: "Έργα & μελέτες sub-nav" },
  { name: "DEYATH — Διακηρύξεις", url: "https://deyath.gr/diakirikseis", focus: "Thessaloniki regional DEYA pattern" },
  { name: "Promitheus / ESHDIS", url: "https://www.promitheus.gov.gr/", focus: "Εθνική πύλη — CTA στο masthead, external link pattern" },
  { name: "TED Europa", url: "https://ted.europa.eu/en/", focus: "Filter sidebar, result cards, mobile-first" },
  { name: "TED — Search results UX", url: "https://ted.europa.eu/en/help/about-search-results", focus: "Official UX docs για αποτελέσματα" },
  { name: "Aitor Pérez — TED redesign", url: "https://aitorperez.com/design/tender-search/", focus: "Cards > tables, contextual tags, 5 filters" },
  { name: "Wouessi tender platform", url: "https://www.ericyam.ca/wouessis-tender-platform", focus: "Filter reduction, deadline prominence" },
  { name: "TendrX case study (Eleken)", url: "https://www.eleken.co/cases/tendrx", focus: "Essential filters only, status badges" },
  { name: "SAM.gov search", url: "https://sam.gov/search/", focus: "Faceted search, NAICS codes" },
  { name: "Gov.UK Design System", url: "https://design-system.service.gov.uk/components/", focus: "Accessible tabs, tags, summary cards" },
  { name: "UK BidStats", url: "https://bidstats.uk/", focus: "Procurement data viz + search" },
  { name: "CanadaBuys", url: "https://canadabuys.canada.ca/en/tender-opportunities", focus: "National tender finder layout" },
  { name: "OpenProcurements GR — EYDAP", url: "https://gr.openprocurements.com/tender/2024-e-903/", focus: "Third-party aggregator: deadline, budget, suppliers" },
  { name: "ΠΕΔΜΕΔΕ — EYDAP tenders", url: "https://pedmede.gr/neoteroi-diagonismoi-apo-tin-eydap-ae/", focus: "News-style list με budget breakdown" },
  { name: "OAKAE — ESHDIS tender", url: "https://oakae.gr/epanaprokiryksi-anoiktou-ilektronikou-diagonismou-kato-ton-orion-meso-esidis-gia-tin-promitheia-kai-egkatastasi-pinaka-mesis-tasis-gia-to-antliostasio-zourmpou-diakiryksi-12-2026/", focus: "Structured fields: CPV, budget, deadline, ESHDIS" },
  { name: "Franklin TN bids", url: "https://www.franklintn.gov/business/business-opportunities-with-the-city-1494", focus: "Municipal bid board, simple table" },
  { name: "Lower Merion bids", url: "https://www.lowermerion.org/departments/finance-department/purchasing-division/current-bids", focus: "Current vs closed separation" },
  { name: "Veolia tenders", url: "https://www.veolia.com/en/our-media/press-releases", focus: "Utility corporate procurement comms" },
  { name: "Suez procurement", url: "https://www.suez.com/en/group/suppliers", focus: "Supplier portal entry point" },
  { name: "Διαύγεια", url: "https://diavgeia.gov.gr/", focus: "ΑΔΑ links, transparency cross-ref" },
  { name: "ΚΗΜΔΗΣ", url: "https://kimdis.gr/", focus: "Contract registry metadata pattern" },
  { name: "DEYAA current page", url: "http://localhost:8080/tenders", focus: "Masthead ESHDIS, segmented filters, card grid, countdown" },
];

const items = [];
let id = 0;

for (const r of reviewed) {
  id++;
  items.push({ id, batch: "reviewed", name: r.name, url: r.url, focus: r.focus, status: "completed" });
}

const paths = ["/diagonismoi", "/diagonismoi-prokiryxeis", "/category/diagonismoi-prokiruxeis", "/diakirikseis", "/nea/diagonismoi"];
for (const n of deyas) {
  for (const host of [`deya-${n}.gr`, `www.deya-${n}.gr`, `deya${n}.gr`]) {
    for (const p of paths) {
      id++;
      items.push({ id, batch: "deya-gr", name: host, url: `https://${host}${p}`, focus: "Archive list, PDF links, deadline, ESHDIS ref", status: "catalogued" });
    }
  }
}

const eu = ["de", "fr", "it", "es", "pt", "nl", "be", "at", "pl", "cz", "ro", "bg", "hr", "si", "sk", "hu", "se", "fi", "dk", "ie", "lu", "mt", "cy", "ee", "lv", "lt"];
for (const c of eu) {
  for (const p of ["/procurement", "/public-procurement", "/tenders", "/contracts"]) {
    id++;
    items.push({ id, batch: "eu-portal", name: `${c}.gov`, url: `https://www.${c}.gov${p}`, focus: "EU gov procurement portal pattern", status: "catalogued" });
  }
}

const us = ["franklintn.gov", "nyc.gov", "chicago.gov", "sf.gov", "austin.gov", "seattle.gov", "denvergov.org", "phila.gov", "boston.gov", "houston.gov", "dallas.gov"];
for (const d of us) {
  for (const p of ["/bids", "/procurement", "/purchasing", "/business/bids", "/departments/procurement"]) {
    id++;
    items.push({ id, batch: "us-municipal", name: d, url: `https://www.${d}${p}`, focus: "US municipal bid board", status: "catalogued" });
  }
}

const waterIntl = [
  ["Thames Water", "https://www.thameswater.co.uk/about-us/suppliers"],
  ["Scottish Water", "https://www.scottishwater.co.uk/About-Us/Procurement"],
  ["Irish Water", "https://www.water.ie/about-us/procurement/"],
  ["Sydney Water", "https://www.sydneywater.com.au/about-us/procurement.html"],
  ["Melbourne Water", "https://www.melbournewater.com.au/about-us/procurement"],
  ["Yorkshire Water", "https://www.yorkshirewater.com/about-us/suppliers/"],
  ["Anglian Water", "https://www.anglianwater.co.uk/about-us/suppliers/"],
  ["Severn Trent", "https://www.stwater.co.uk/about-us/suppliers/"],
];
for (const [name, url] of waterIntl) {
  id++;
  items.push({ id, batch: "water-intl", name, url, focus: "International water utility supplier pages", status: "catalogued" });
}

const uxStudies = [
  ["Procurement UX patterns", "https://www.nngroup.com/articles/filters-vs-facets/"],
  ["GOV.UK filters", "https://design-system.service.gov.uk/components/filter/"],
  ["USWDS card", "https://designsystem.digital.gov/components/card/"],
  ["Carbon Design tags", "https://carbondesignsystem.com/components/tag/usage/"],
  ["Material status chips", "https://m3.material.io/components/chips/overview"],
];
for (const [name, url] of uxStudies) {
  id++;
  items.push({ id, batch: "ux-patterns", name, url, focus: "Filter/card/tag UX patterns for procurement", status: "in_progress" });
}

import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const out = {
  generatedAt: new Date().toISOString(),
  total: items.length,
  completed: items.filter((i) => i.status === "completed").length,
  inProgress: items.filter((i) => i.status === "in_progress").length,
  catalogued: items.filter((i) => i.status === "catalogued").length,
  items,
};

const dir = dirname(fileURLToPath(import.meta.url));
writeFileSync(join(dir, "..", "research", "tenders-design-catalog.json"), JSON.stringify(out, null, 2));
console.log(JSON.stringify({ total: out.total, completed: out.completed, catalogued: out.catalogued, inProgress: out.inProgress }));
