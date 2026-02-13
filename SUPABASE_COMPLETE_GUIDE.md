# Πλήρης Οδηγός Supabase Setup για DEYAA Project

## 📋 Επισκόπηση

Έχετε ήδη:
- ✅ Supabase account (kostastkoukianakis72@gmail.com)
- ✅ Ένα project: "cretedivepark-revamp-project"

**Ερώτηση**: Μπορώ να χρησιμοποιήσω το ίδιο project;

**Απάντηση**: 
- ✅ **ΝΑΙ**, μπορείτε να χρησιμοποιήσετε το ίδιο project
- ⚠️ **ΑΛΛΑ** προτείνεται να φτιάξετε **ΝΕΟ project** για καλύτερη οργάνωση
- Το free tier επιτρέπει **πολλά projects**, οπότε δεν υπάρχει πρόβλημα

## 🎯 Προτεινόμενη Προσέγγιση

### Επιλογή 1: Νέο Project (Προτεινόμενη) ⭐

**Πλεονεκτήματα**:
- Καθαρή οργάνωση
- Ξεχωριστές βάσεις δεδομένων
- Εύκολη διαχείριση
- Δεν επηρεάζει το άλλο project

**Βήματα**:
1. Πηγαίνετε στο [Supabase Dashboard](https://app.supabase.com)
2. Κάντε login με `kostastkoukianakis72@gmail.com`
3. Κάντε κλικ **"New Project"** (πάνω δεξιά)
4. Συμπληρώστε:
   - **Name**: `deyaa-apokoronou` (ή `deyaa-project`)
   - **Database Password**: Δημιουργήστε έναν ισχυρό password (γράψτε τον κάπου!)
   - **Region**: Επιλέξτε την πλησιέστερη (π.χ. `West Europe`)
   - **Pricing Plan**: Free (αυτόματα επιλεγμένο)
5. Κάντε κλικ **"Create new project"**
6. Περιμένετε 2-3 λεπτά να ολοκληρωθεί η προετοιμασία

### Επιλογή 2: Χρήση Υπάρχοντος Project

Αν θέλετε να χρησιμοποιήσετε το "cretedivepark-revamp-project":
- ✅ Δεν υπάρχει πρόβλημα
- ⚠️ Θα μοιράζεστε την ίδια βάση δεδομένων
- ⚠️ Πρέπει να προσέχετε τα table names να μην συγκρούονται

---

## 📝 Βήμα-Βήμα Setup (Μετά τη δημιουργία project)

### ΒΗΜΑ 1: Αντιγραφή Credentials

1. Στο Supabase Dashboard, επιλέξτε το project σας
2. Πηγαίνετε στο **Settings** (αριστερό menu) → **API**
3. Βρείτε τα παρακάτω:
   - **Project URL**: Κάντε copy (π.χ. `https://xxxxx.supabase.co`)
   - **anon public key**: Κάντε copy (αρχίζει με `eyJ...`)

4. Στο project folder σας (`C:\Users\Kouki\Documents\GitHub\DEYAA`), δημιουργήστε αρχείο `.env`:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ ΣΗΜΑΝΤΙΚΟ**: Αντικαταστήστε τα `xxxxx` με τα πραγματικά values σας!

### ΒΗΜΑ 2: Database Migrations

1. Στο Supabase Dashboard, πηγαίνετε στο **SQL Editor** (αριστερό menu)
2. Κάντε κλικ **"New query"**
3. Ανοίξτε το αρχείο: `supabase/migrations/20241214230000_initial_schema.sql`
4. Copy-paste **ΟΛΟ** το περιεχόμενο στο SQL Editor
5. Κάντε κλικ **"Run"** (ή F5)
6. Περιμένετε να ολοκληρωθεί (θα δείτε "Success")

7. **Επαναλάβετε** για το δεύτερο migration:
   - Ανοίξτε: `supabase/migrations/20250126000000_add_tenders_and_documents.sql`
   - Copy-paste στο SQL Editor
   - Run

8. **Επαναλάβετε** για το τρίτο migration:
   - Ανοίξτε: `supabase/migrations/20250126000001_add_analytics.sql`
   - Copy-paste στο SQL Editor
   - Run

**✅ Έλεγχος**: Μετά από κάθε migration, πηγαίνετε στο **Table Editor** και βεβαιωθείτε ότι δημιουργήθηκαν οι πίνακες:
- `posts`
- `tenders`
- `documents`
- `analytics`
- `problems`
- `subscribers`
- `notifications`
- `profiles`

### ΒΗΜΑ 3: Storage Buckets

1. Πηγαίνετε στο **Storage** (αριστερό menu)
2. Κάντε κλικ **"New bucket"**
3. Δημιουργήστε το πρώτο bucket:
   - **Name**: `tenders`
   - **Public bucket**: ✅ **ΕΝΕΡΓΟΠΟΙΗΣΤΕ** (Public: Yes)
   - Κάντε κλικ **"Create bucket"**

4. Δημιουργήστε το δεύτερο bucket:
   - **Name**: `documents`
   - **Public bucket**: ✅ **ΕΝΕΡΓΟΠΟΙΗΣΤΕ** (Public: Yes)
   - Κάντε κλικ **"Create bucket"**

### ΒΗΜΑ 4: Storage Policies

1. Πηγαίνετε στο **SQL Editor** → **New query**
2. Copy-paste το παρακάτω SQL (αυτό διαγράφει τις υπάρχουσες policies αν υπάρχουν και τις δημιουργεί ξανά):

```sql
-- Διαγραφή υπαρχόντων policies (αν υπάρχουν) για tenders bucket
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;

-- Policies for tenders bucket
CREATE POLICY "Public Access Tenders" ON storage.objects
FOR SELECT USING (bucket_id = 'tenders');

CREATE POLICY "Authenticated users can upload tenders" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'tenders' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update tenders" ON storage.objects
FOR UPDATE USING (bucket_id = 'tenders' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete tenders" ON storage.objects
FOR DELETE USING (bucket_id = 'tenders' AND auth.role() = 'authenticated');

-- Policies for documents bucket
CREATE POLICY "Public Access Documents" ON storage.objects
FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Authenticated users can upload documents" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update documents" ON storage.objects
FOR UPDATE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete documents" ON storage.objects
FOR DELETE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');
```

**Σημείωση**: Άλλαξα τα policy names για να αποφύγουμε conflicts. Τώρα κάθε policy έχει unique name.

3. Κάντε κλικ **"Run"**

**Εναλλακτική (αν ακόμα έχετε error)**: Αν το παραπάνω δεν λειτουργεί, τρέξτε πρώτα αυτό για να δείτε ποιες policies υπάρχουν:

```sql
-- Δείτε όλες τις policies για storage.objects
SELECT * FROM pg_policies WHERE tablename = 'objects';
```

Μετά διαγράψτε manually τις policies που θέλετε από το Supabase Dashboard → Storage → Policies.

### ΒΗΜΑ 5: Authentication Setup

1. Πηγαίνετε στο **Authentication** (αριστερό menu) → **Providers**
2. Βεβαιωθείτε ότι το **Email** provider είναι **ΕΝΕΡΓΟΠΟΙΗΜΕΝΟ**
3. (Προαιρετικά) Κάντε κλικ στο **Email** provider και:
   - Απενεργοποιήστε **"Confirm email"** για development (για να μην χρειάζεται email verification)
   - Αποθηκεύστε

### ΒΗΜΑ 6: Δημιουργία Admin User

1. Πηγαίνετε στο **Authentication** → **Users**
2. Κάντε κλικ **"Add user"** (ή **"Invite user"**)
3. Συμπληρώστε:
   - **Email**: `admin@deyaa.gr` (ή οποιοδήποτε email θέλετε)
   - **Password**: Εισάγετε έναν ισχυρό password (τουλάχιστον 8 χαρακτήρες)
   - **Auto Confirm User**: ✅ **ΕΝΕΡΓΟΠΟΙΗΣΤΕ** αυτό
4. Κάντε κλικ **"Create user"**

**✅ Έλεγχος**: Θα πρέπει να δείτε τον user στη λίστα με status "Confirmed"

### ΒΗΜΑ 7: Έλεγχος RLS Policies

1. Πηγαίνετε στο **Table Editor**
2. Επιλέξτε οποιονδήποτε πίνακα (π.χ. `posts`)
3. Κάντε κλικ στο tab **"Policies"**
4. Βεβαιωθείτε ότι υπάρχουν policies (θα πρέπει να βλέπετε 2-3 policies ανά πίνακα)

Αν δεν υπάρχουν policies, τρέξτε ξανά τα migrations.

---

## 🧪 Testing

### Test 1: Environment Variables

1. Εκκινήστε το development server:
   ```bash
   npm run dev
   ```

2. Ανάμεσα στο browser console (F12), ελέγξτε ότι δεν υπάρχουν errors για Supabase

### Test 2: Login

1. Πηγαίνετε στο `http://localhost:5173/dashboard`
2. Θα σας ανακατευθύνει στο `/dashboard/login`
3. Συμπληρώστε:
   - Email: `admin@deyaa.gr` (ή το email που δημιουργήσατε)
   - Password: Το password που ορίσατε
4. Κάντε κλικ **"Σύνδεση"**
5. Αν όλα είναι σωστά, θα μπείτε στο dashboard

### Test 3: Database Connection

1. Μετά το login, πηγαίνετε στο `/dashboard/posts`
2. Αν δεν βλέπετε errors, η σύνδεση με τη βάση λειτουργεί

---

## 📊 Free Tier Limits

Το Supabase Free Tier προσφέρει:
- ✅ **500 MB Database** (αρκετό για αρχή)
- ✅ **1 GB File Storage** (αρκετό για PDFs)
- ✅ **2 GB Bandwidth** (αρκετό για development)
- ✅ **Unlimited API requests**
- ✅ **Unlimited projects**

**⚠️ Σημείωση**: Αν φτάσετε τα limits, θα λάβετε email notification. Μέχρι τότε, είστε OK!

---

## 🔍 Troubleshooting

### Πρόβλημα: "Invalid API key"
**Λύση**: 
- Ελέγξτε ότι το `.env` file έχει τα σωστά credentials
- Ελέγξτε ότι τα credentials είναι από το **σωστό project**
- Restart το development server μετά την αλλαγή `.env`

### Πρόβλημα: "Table does not exist"
**Λύση**:
- Εκτελέστε ξανά τα migrations
- Ελέγξτε στο Table Editor ότι οι πίνακες υπάρχουν

### Πρόβλημα: "Permission denied"
**Λύση**:
- Ελέγξτε ότι οι RLS policies είναι ενεργές
- Ελέγξτε ότι είστε logged in
- Ελέγξτε στο SQL Editor ότι οι policies υπάρχουν

### Πρόβλημα: "Cannot upload files"
**Λύση**:
- Ελέγξτε ότι τα buckets `tenders` και `documents` υπάρχουν
- Ελέγξτε ότι τα buckets είναι **Public**
- Ελέγξτε ότι οι storage policies έχουν τρέξει

---

## ✅ Checklist

Πριν ξεκινήσετε να χρησιμοποιείτε το dashboard, βεβαιωθείτε ότι:

- [ ] Έχετε δημιουργήσει project στο Supabase
- [ ] Έχετε `.env` file με τα credentials
- [ ] Έχετε τρέξει όλα τα migrations (3 αρχεία)
- [ ] Έχετε δημιουργήσει τα storage buckets (`tenders`, `documents`)
- [ ] Έχετε τρέξει τις storage policies
- [ ] Έχετε δημιουργήσει admin user
- [ ] Μπορείτε να κάνετε login στο dashboard

---

## 🆘 Αν Χρειάζεστε Βοήθεια

Αν συναντήσετε πρόβλημα:
1. Ελέγξτε τα error messages στο browser console (F12)
2. Ελέγξτε τα logs στο Supabase Dashboard → Logs
3. Βεβαιωθείτε ότι ακολουθήσατε όλα τα βήματα

**Σημαντικό**: Δεν χρειάζεται να διαγράψετε τίποτα από το υπάρχον project σας. Μπορείτε να έχετε και τα δύο projects ταυτόχρονα!
