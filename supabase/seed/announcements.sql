-- Run in Supabase Dashboard → SQL Editor
-- Inserts 3 published announcements for /announcements (skips if title exists)

INSERT INTO public.posts (title, content, excerpt, category, status, published_at, featured_image)
SELECT v.title, v.content, v.excerpt, v.category, 'published', v.published_at::timestamptz, v.featured_image
FROM (VALUES
  (
    'Μαζί για ένα μέλλος με λιγότερες εκπομπές: τα εργαστήριά μας',
    'Η ΔΕΥΑΑ οργανώνει εργαστήρια ενημέρωσης για πολίτες και φορείς, με έμφαση στη μείωση εκπομπών και την οικολογική συνείδηση στον Αποκόρωνα.',
    'Ενημερωτικές δράσεις και εργαστήρια για τη βιώσιμη διαχείριση των πόρων.',
    'Βιωσιμότητα',
    '2026-04-28T10:00:00Z',
    '/hero/sustain_water.webp'
  ),
  (
    'Νέες ψηφιακές υπηρεσίες: πληρωμές και δηλώσεις online',
    'Διαθέσιμες νέες ηλεκτρονικές υπηρεσίες για πληρωμές και δηλώσεις. Οι πολίτες μπορούν να εξυπηρετούνται online μέσω της πλατφόρμας e-services της ΔΕΥΑΑ.',
    'Διευκολύνσεις για πληρωμές λογαριασμών και ηλεκτρονικές δηλώσεις.',
    'Ανακοινώσεις',
    '2026-04-13T10:00:00Z',
    '/hero/homepageimage.webp'
  ),
  (
    'Αναβάθιση δικτύου ύδρευσης με έμφαση στον πολίτη',
    'Προγραμματίζονται και υλοποιούνται έργα αναβάθισης του δικτύου ύδρευσης, με στόχο την αξιοπιστία της παροχής και τη βελτίωση της εξυπηρέτησης των πολιτών.',
    'Συνεχίζονται οι εργασίες αναβάθισης του δικτύου ύδρευσης στην περιοχή.',
    'Έργα',
    '2026-01-23T10:00:00Z',
    '/hero/koyrnas.webp'
  )
) AS v(title, content, excerpt, category, published_at, featured_image)
WHERE NOT EXISTS (
  SELECT 1 FROM public.posts p WHERE p.title = v.title
);
