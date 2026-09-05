import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(resolve(process.cwd(), ".env"));

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const DOCUMENTS = [
  {
    fileName: "prosklisi-mpe-georgioupolis-26PROC019720398.pdf",
    storagePath: "forms/prosklisi-mpe-georgioupolis-26PROC019720398.pdf",
    publicPath: "/documents/prosklisi-mpe-georgioupolis-26PROC019720398.pdf",
    title: "Πρόσκληση ΜΠΕ Γεωργιούπολης (26PROC019720398)",
    description:
      "Ανανέωση περιβαλλοντικών όρων με τροποποίηση του έργου αποχέτευσης και εγκατάστασης επεξεργασίας λυμάτων Γεωργιούπολης και ευρύτερης περιοχής των Π.Ε. Χανίων και Ρεθύμνου.",
    category: "Αποχέτευση",
    icon_name: "Waves",
    display_order: 1,
  },
  {
    fileName: "prosklisi-epeigonta-erga-ydrefsis-armenon-orhi.pdf",
    storagePath: "forms/prosklisi-epeigonta-erga-ydrefsis-armenon-orhi.pdf",
    publicPath: "/documents/prosklisi-epeigonta-erga-ydrefsis-armenon-orhi.pdf",
    title: "Πρόσκληση — Επείγοντα έργα ύδρευσης Δ.Ε. Αρμένων (ορθή επανάληψη)",
    description:
      "Πρόσκληση ενδιαφέροντος για την επιλογή αναδόχου κατασκευής του έργου «Επείγοντα έργα ύδρευσης Δ.Ε. Αρμένων». Ορθή επανάληψη, 22.12.2025.",
    category: "Ύδρευση",
    icon_name: "Droplets",
    display_order: 2,
  },
  {
    fileName: "prosklisi-apokatastaseis-tomon-odostromatos-25PROC018188246.pdf",
    storagePath: "forms/prosklisi-apokatastaseis-tomon-odostromatos-25PROC018188246.pdf",
    publicPath: "/documents/prosklisi-apokatastaseis-tomon-odostromatos-25PROC018188246.pdf",
    title: "Πρόσκληση αποκαταστάσεις τομών οδοστρώματος (25PROC018188246)",
    description:
      "Πρόσκληση ενδιαφέροντος για αποκαταστάσεις τομών οδοστρώματος, όπως δημοσιεύθηκε στα συνοδευτικά έγγραφα της ΔΕΥΑΑ.",
    category: "Γενικά",
    icon_name: "FileText",
    display_order: 3,
  },
  {
    fileName: "prosklisi-me-kimdis-armenon-orhi.pdf",
    storagePath: "forms/prosklisi-me-kimdis-armenon-orhi.pdf",
    publicPath: "/documents/prosklisi-me-kimdis-armenon-orhi.pdf",
    title: "Πρόσκληση με ΚΗΜΔΗΣ — Έργα ύδρευσης Δ.Ε. Αρμένων (ορθή επανάληψη)",
    description:
      "Συνοδευτική πρόσκληση με ανάρτηση ΚΗΜΔΗΣ για τα επείγοντα έργα ύδρευσης Δ.Ε. Αρμένων (ορθή επανάληψη).",
    category: "Ύδρευση",
    icon_name: "FileCheck",
    display_order: 4,
  },
  {
    fileName: "prosklisi-me-kimdis-armenon.pdf",
    storagePath: "forms/prosklisi-me-kimdis-armenon.pdf",
    publicPath: "/documents/prosklisi-me-kimdis-armenon.pdf",
    title: "Πρόσκληση με ΚΗΜΔΗΣ — Επείγοντα έργα ύδρευσης Δ.Ε. Αρμένων",
    description:
      "Πρόσκληση ενδιαφέροντος με ΚΗΜΔΗΣ για την επιλογή αναδόχου κατασκευής του έργου «Επείγοντα έργα ύδρευσης Δ.Ε. Αρμένων», 18.12.2025.",
    category: "Ύδρευση",
    icon_name: "FileCheck",
    display_order: 5,
  },
  {
    fileName: "prosklisi-me-kidmis-armenon.pdf",
    storagePath: "forms/prosklisi-me-kidmis-armenon.pdf",
    publicPath: "/documents/prosklisi-me-kidmis-armenon.pdf",
    title: "Πρόσκληση με ΚΗΜΔΗΣ — Επείγοντα έργα ύδρευσης Δ.Ε. Αρμένων (συνοδευτικό)",
    description:
      "Δεύτερο συνοδευτικό έντυπο πρόσκλησης με ΚΗΜΔΗΣ για τα επείγοντα έργα ύδρευσης Δ.Ε. Αρμένων.",
    category: "Ύδρευση",
    icon_name: "FileText",
    display_order: 6,
  },
];

const TENDERS = [
  {
    title: "Πρόσκληση ενδιαφέροντος για εκπόνηση μελέτης — ΜΠΕ Γεωργιούπολης",
    description:
      "Ανανέωση περιβαλλοντικών όρων με τροποποίηση του έργου αποχέτευσης και ΕΕΛ Γεωργιούπολης και ευρύτερης περιοχής των Π.Ε. Χανίων και Ρεθύμνου (26PROC019720398).",
    date: "2026-09-04",
    deadline: "2026-09-30",
    status: "current",
    announcementFile: "prosklisi-mpe-georgioupolis-26PROC019720398.pdf",
  },
  {
    title: "Επείγοντα έργα ύδρευσης Δ.Ε. Αρμένων (ορθή επανάληψη)",
    description:
      "Πρόσκληση ενδιαφέροντος για την επιλογή αναδόχου κατασκευής του έργου «Επείγοντα έργα ύδρευσης Δ.Ε. Αρμένων». Ορθή επανάληψη.",
    date: "2025-12-22",
    deadline: "2026-01-20",
    status: "past",
    announcementFile: "prosklisi-epeigonta-erga-ydrefsis-armenon-orhi.pdf",
    documentsFile: "prosklisi-me-kimdis-armenon-orhi.pdf",
  },
  {
    title: "Επείγοντα έργα ύδρευσης Δ.Ε. Αρμένων",
    description:
      "Πρόσκληση ενδιαφέροντος για την επιλογή αναδόχου κατασκευής του έργου «Επείγοντα έργα ύδρευσης Δ.Ε. Αρμένων».",
    date: "2025-12-18",
    deadline: "2026-01-15",
    status: "past",
    announcementFile: "prosklisi-me-kimdis-armenon.pdf",
    documentsFile: "prosklisi-me-kidmis-armenon.pdf",
  },
];

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing VITE_SUPABASE_URL or API key");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function uploadPdf(localName, storagePath, bucket) {
  const localPath = resolve(process.cwd(), "public/documents", localName);
  const bytes = readFileSync(localPath);
  const { error } = await supabase.storage.from(bucket).upload(storagePath, bytes, {
    contentType: "application/pdf",
    upsert: true,
  });
  if (error) {
    console.error(`Upload failed ${bucket}/${storagePath}:`, error.message);
    return false;
  }
  console.log(`Uploaded ${bucket}/${storagePath} (${bytes.length} bytes)`);
  return true;
}

async function main() {
  const uploaded = new Map();

  for (const doc of DOCUMENTS) {
    const ok = await uploadPdf(doc.fileName, doc.storagePath, "documents");
    uploaded.set(doc.fileName, ok);
    if (ok) {
      await uploadPdf(doc.fileName, `announcements/${doc.fileName}`, "tenders");
    }
  }

  for (const doc of DOCUMENTS) {
    const { data: existing } = await supabase
      .from("documents")
      .select("id")
      .eq("file_name", doc.fileName)
      .maybeSingle();

    if (existing?.id) {
      console.log(`Skip document (exists): ${doc.title}`);
      continue;
    }

    const usedStorage = uploaded.get(doc.fileName);
    const { error } = await supabase.from("documents").insert({
      title: doc.title,
      description: doc.description,
      category: doc.category,
      icon_name: doc.icon_name,
      file_path: usedStorage ? doc.storagePath : doc.publicPath,
      file_name: doc.fileName,
      file_size: readFileSync(resolve(process.cwd(), "public/documents", doc.fileName)).length,
      file_type: "application/pdf",
      is_active: true,
      display_order: doc.display_order,
    });

    if (error) {
      console.error(`Insert document failed: ${doc.title}`, error.message);
    } else {
      console.log(`Created document: ${doc.title}`);
    }
  }

  for (const tender of TENDERS) {
    const { data: existing } = await supabase
      .from("tenders")
      .select("id")
      .eq("title", tender.title)
      .maybeSingle();

    if (existing?.id) {
      console.log(`Skip tender (exists): ${tender.title}`);
      continue;
    }

    const announcementOk = uploaded.get(tender.announcementFile);
    const documentsOk = tender.documentsFile ? uploaded.get(tender.documentsFile) : false;

    const { error } = await supabase.from("tenders").insert({
      title: tender.title,
      description: tender.description,
      date: tender.date,
      deadline: tender.deadline,
      status: tender.status,
      announcement_pdf_path: announcementOk
        ? `announcements/${tender.announcementFile}`
        : `/documents/${tender.announcementFile}`,
      tender_documents_path: tender.documentsFile
        ? documentsOk
          ? `announcements/${tender.documentsFile}`
          : `/documents/${tender.documentsFile}`
        : null,
    });

    if (error) {
      console.error(`Insert tender failed: ${tender.title}`, error.message);
    } else {
      console.log(`Created tender: ${tender.title}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
