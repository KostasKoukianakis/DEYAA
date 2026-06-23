import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const CREDENTIALS = [
  { email: "admin@deyaa.gr", password: "YourPassword123!" },
  { email: "admin@deyaa.gr", password: "Test123!" },
  { email: "test@deyaa.gr", password: "Test123!" },
];

const ANNOUNCEMENTS = [
  {
    title: "Μαζί για ένα μέλλος με λιγότερες εκπομπές: τα εργαστήριά μας",
    excerpt: "Ενημερωτικές δράσεις και εργαστήρια για τη βιώσιμη διαχείριση των πόρων.",
    content:
      "Η ΔΕΥΑΑ οργανώνει εργαστήρια ενημέρωσης για πολίτες και φορείς, με έμφαση στη μείωση εκπομπών και την οικολογική συνείδηση στον Αποκόρωνα.",
    category: "Βιωσιμότητα",
    featured_image: "/hero/sustain_water.webp",
    published_at: "2026-04-28T10:00:00.000Z",
  },
  {
    title: "Νέες ψηφιακές υπηρεσίες: πληρωμές και δηλώσεις online",
    excerpt: "Διευκολύνσεις για πληρωμές λογαριασμών και ηλεκτρονικές δηλώσεις.",
    content:
      "Διαθέσιμες νέες ηλεκτρονικές υπηρεσίες για πληρωμές και δηλώσεις. Οι πολίτες μπορούν να εξυπηρετούνται online μέσω της πλατφόρμας e-services της ΔΕΥΑΑ.",
    category: "Ανακοινώσεις",
    featured_image: "/hero/homepageimage.webp",
    published_at: "2026-04-13T10:00:00.000Z",
  },
  {
    title: "Αναβάθιση δικτύου ύδρευσης με έμφαση στον πολίτη",
    excerpt: "Συνεχίζονται οι εργασίες αναβάθισης του δικτύου ύδρευσης στην περιοχή.",
    content:
      "Προγραμματίζονται και υλοποιούνται έργα αναβάθισης του δικτύου ύδρευσης, με στόχο την αξιοπιστία της παροχής και τη βελτίωση της εξυπηρέτησης των πολιτών.",
    category: "Έργα",
    featured_image: "/hero/koyrnas.webp",
    published_at: "2026-01-23T10:00:00.000Z",
  },
  {
    title: "Ενημέρωση για προγραμματισμένη συντήρηση δικτύου στον Αποκόρωνα",
    excerpt: "Προγραμματισμένες εργασίες συντήρησης σε τμήματα του δικτύου ύδρευσης.",
    content:
      "Η ΔΕΥΑΑ ενημερώνει τους καταναλωτές για προγραμματισμένες εργασίες συντήρησης στο δίκτυο ύδρευσης του Αποκόρωνα. Σε περίπτωση προσωρινής διακοπής, θα ανακοινώνεται εκ των προτέρων.",
    category: "Ανακοινώσεις",
    featured_image: "/hero/deksameni.webp",
    published_at: "2026-01-15T10:00:00.000Z",
  },
  {
    title: "Οδηγίες οικονομίας νερού για το καλοκαίρι 2026",
    excerpt: "Πρακτικές συμβουλές για υπεύθυνη χρήση νερού τους θερινούς μήνες.",
    content:
      "Με την έναρξη της θερινής περιόδου, η ΔΕΥΑΑ δημοσιεύει οδηγίες οικονομίας νερού για νοικοκυριά και επιχειρήσεις, με στόχο τη βιώσιμη διαχείριση του πόρου.",
    category: "Βιωσιμότητα",
    featured_image: "/hero/03_c.webp",
    published_at: "2025-12-10T10:00:00.000Z",
  },
  {
    title: "Ανακοίνωση ωραρίου λειτουργίας ταμείου τις εορταστικές ημέρες",
    excerpt: "Τροποποιημένο ωράριο εξυπηρέτησης του κοινού κατά τις γιορτές.",
    content:
      "Το ταμείο της ΔΕΥΑΑ θα λειτουργεί με τροποποιημένο ωράριο κατά τις εορταστικές ημέρες. Για πληρωμές, οι πολίτες μπορούν να χρησιμοποιούν και τις ηλεκτρονικές υπηρεσίες.",
    category: "Ανακοινώσεις",
    featured_image: "/hero/03_d.webp",
    published_at: "2025-11-20T10:00:00.000Z",
  },
  {
    title: "Ολοκλήρωση φάσης αναβάθισης δικτύου αποχέτευσης στη Βρύση",
    excerpt: "Ολοκληρώθηκαν οι κύριες εργασίες αναβάθισης στο δίκτυο αποχέτευσης.",
    content:
      "Η ΔΕΥΑΑ ολοκλήρωσε τη φάση αναβάθισης του δικτύου αποχέτευσης στη Βρύση, βελτιώνοντας τη λειτουργική αξιοπιστία και την προστασία του περιβάλλοντος.",
    category: "Έργα",
    featured_image: "/hero/03_a.webp",
    published_at: "2025-10-05T10:00:00.000Z",
  },
];

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function signIn() {
  for (const cred of CREDENTIALS) {
    const { data, error } = await supabase.auth.signInWithPassword(cred);
    if (!error && data.session) {
      console.log(`Signed in as ${cred.email}`);
      return data.session;
    }
  }
  return null;
}

async function main() {
  const { data: existing, error: readError } = await supabase
    .from("posts")
    .select("id, title, status")
    .eq("status", "published");

  if (readError) {
    console.log("Published posts check:", readError.message);
  } else {
    console.log(`Existing published posts: ${existing?.length ?? 0}`);
  }

  const session = await signIn();
  if (!session) {
    console.error(
      "Could not sign in. Create an admin user in Supabase (admin@deyaa.gr) or set credentials in the script.",
    );
    process.exit(1);
  }

  const userId = session.user.id;

  for (const post of ANNOUNCEMENTS) {
    const { data: dup } = await supabase
      .from("posts")
      .select("id")
      .eq("title", post.title)
      .maybeSingle();

    if (dup?.id) {
      console.log(`Skip (exists): ${post.title}`);
      continue;
    }

    const { data, error } = await supabase
      .from("posts")
      .insert({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        category: post.category,
        status: "published",
        author_id: userId,
        published_at: post.published_at,
        featured_image: post.featured_image,
      })
      .select("id, title")
      .single();

    if (error) {
      console.error(`Failed: ${post.title}`, error.message);
    } else {
      console.log(`Created: ${data.title} (${data.id})`);
    }
  }

  const { data: published, error: finalError } = await supabase
    .from("posts")
    .select("id, title, category, published_at, status")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (finalError) {
    console.error("Final read error:", finalError.message);
  } else {
    console.log("\nPublished posts in Supabase:");
    published?.forEach((p) => console.log(`- ${p.title} [${p.category}]`));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
