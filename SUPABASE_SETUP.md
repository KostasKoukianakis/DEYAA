# Supabase Setup Guide

## 1. Δημιουργία Supabase Project

1. Πηγαίνετε στο [Supabase Dashboard](https://app.supabase.com)
2. Δημιουργήστε ένα νέο project
3. Αναμένετε να ολοκληρωθεί η προετοιμασία

## 2. Environment Variables

Δημιουργήστε ένα `.env` file στη ρίζα του project με:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

Μπορείτε να βρείτε αυτές τις τιμές στο Supabase Dashboard → Settings → API

## 3. Database Migrations

Εκτελέστε τις migrations για να δημιουργήσετε τους πίνακες:

```bash
# Αν έχετε Supabase CLI εγκατεστημένο
supabase db push

# Ή ανάμεσα από το Supabase Dashboard:
# SQL Editor → New Query → Copy/Paste το περιεχόμενο από:
# supabase/migrations/20241214230000_initial_schema.sql
# supabase/migrations/20250126000000_add_tenders_and_documents.sql
```

## 4. Storage Buckets

Δημιουργήστε τα storage buckets για αρχεία:

### Μέσω Supabase Dashboard:

1. Πηγαίνετε στο **Storage** → **Buckets**
2. Δημιουργήστε δύο buckets:
   - **tenders** (Public: Yes)
   - **documents** (Public: Yes)

### Storage Policies

Εκτελέστε τα παρακάτω SQL queries στο **SQL Editor**:

```sql
-- Policies for tenders bucket
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'tenders');

CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'tenders' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update" ON storage.objects
FOR UPDATE USING (bucket_id = 'tenders' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete" ON storage.objects
FOR DELETE USING (bucket_id = 'tenders' AND auth.role() = 'authenticated');

-- Policies for documents bucket
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update" ON storage.objects
FOR UPDATE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete" ON storage.objects
FOR DELETE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');
```

## 5. Authentication Setup

Για να χρησιμοποιήσετε το dashboard, χρειάζεται authentication:

1. Πηγαίνετε στο **Authentication** → **Providers**
2. Ενεργοποιήστε το **Email** provider
3. (Προαιρετικά) Ρυθμίστε email templates

## 6. Row Level Security (RLS)

Οι RLS policies έχουν ήδη οριστεί στις migrations. Βεβαιωθείτε ότι είναι ενεργές:

- **Posts**: Δημόσια ανάγνωση δημοσιευμένων, authenticated users μπορούν να δημιουργούν/επεξεργάζονται
- **Tenders**: Δημόσια ανάγνωση, authenticated users μπορούν να διαχειρίζονται
- **Documents**: Δημόσια ανάγνωση ενεργών, authenticated users μπορούν να διαχειρίζονται
- **Problems**: Δημόσια ανάγνωση, authenticated users μπορούν να δημιουργούν

## 7. Testing

Μετά την εγκατάσταση:

1. Εκκινήστε το development server: `npm run dev`
2. Πηγαίνετε στο `/dashboard`
3. Κάντε login με έναν admin user
4. Δοκιμάστε να δημιουργήσετε:
   - Νέα ανακοίνωση
   - Νέο διαγωνισμό με PDF
   - Νέο έγγραφο

## Troubleshooting

### Σφάλματα RLS
Αν βλέπετε σφάλματα "permission denied", ελέγξτε:
- Αν οι RLS policies είναι ενεργές
- Αν ο χρήστης είναι authenticated
- Αν το role του χρήστη είναι 'admin' (για admin operations)

### Σφάλματα Storage
Αν δεν μπορείτε να ανεβάσετε αρχεία:
- Ελέγξτε αν τα buckets υπάρχουν
- Ελέγξτε αν οι storage policies είναι σωστές
- Ελέγξτε αν το bucket είναι public

### Type Errors
Αν βλέπετε type errors:
- Εκτελέστε: `npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/integrations/supabase/types.ts`
- Ή ενημερώστε manually τα types στο `src/integrations/supabase/types.ts`
