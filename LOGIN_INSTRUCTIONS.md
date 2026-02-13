# Οδηγίες Σύνδεσης στο Dashboard

## Βήμα 1: Δημιουργία User στο Supabase

### Μέθοδος 1: Μέσω Supabase Dashboard (Προτεινόμενη)

1. Πηγαίνετε στο [Supabase Dashboard](https://app.supabase.com)
2. Επιλέξτε το project σας
3. Πηγαίνετε στο **Authentication** → **Users**
4. Κάντε κλικ στο **"Add user"** ή **"Create new user"**
5. Συμπληρώστε:
   - **Email**: `admin@deyaa.gr` (ή οποιοδήποτε email θέλετε)
   - **Password**: Εισάγετε έναν ισχυρό κωδικό (τουλάχιστον 6 χαρακτήρες)
   - **Auto Confirm User**: ✅ Ενεργοποιήστε αυτό για να μην χρειάζεται email verification
6. Κάντε κλικ **"Create user"**

### Μέθοδος 2: Μέσω SQL (Γρήγορη)

1. Πηγαίνετε στο Supabase Dashboard → **SQL Editor**
2. Εκτελέστε το παρακάτω SQL (αλλάξτε το email και password):

```sql
-- Δημιουργία admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@deyaa.gr',  -- Αλλάξτε το email εδώ
  crypt('YourPassword123!', gen_salt('bf')),  -- Αλλάξτε το password εδώ
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  FALSE,
  '',
  ''
);

-- Δημιουργία profile για τον user
INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, 'Admin User', 'admin'
FROM auth.users
WHERE email = 'admin@deyaa.gr';
```

**Σημείωση**: Η μέθοδος SQL είναι πιο πολύπλοκη. Προτείνεται η Μέθοδος 1.

## Βήμα 2: Σύνδεση στο Dashboard

1. Εκκινήστε το development server:
   ```bash
   npm run dev
   ```

2. Πηγαίνετε στο browser:
   ```
   http://localhost:5173/dashboard
   ```
   (ή το port που χρησιμοποιεί το Vite)

3. Θα σας ανακατευθύνει αυτόματα στο `/dashboard/login`

4. Συμπληρώστε:
   - **Email**: Το email που δημιουργήσατε (π.χ. `admin@deyaa.gr`)
   - **Password**: Το password που ορίσατε

5. Κάντε κλικ **"Σύνδεση"**

## Troubleshooting

### "Invalid login credentials"
- Ελέγξτε ότι το email και password είναι σωστά
- Βεβαιωθείτε ότι ο user έχει δημιουργηθεί στο Supabase
- Αν χρησιμοποιήσατε email verification, ελέγξτε το email σας

### "User not found"
- Βεβαιωθείτε ότι έχετε δημιουργήσει τον user στο Supabase
- Ελέγξτε ότι το email είναι ακριβώς το ίδιο (case-sensitive)

### "Email not confirmed"
- Αν έχετε email confirmation enabled:
  1. Ελέγξτε το inbox σας για confirmation email
  2. Ή απενεργοποιήστε το email confirmation στο Supabase:
     - Authentication → Settings → Email Auth
     - Απενεργοποιήστε "Enable email confirmations"

### Environment Variables Missing
Αν βλέπετε σφάλματα σχετικά με Supabase:
- Ελέγξτε ότι έχετε `.env` file με:
  ```env
  VITE_SUPABASE_URL=your_supabase_url
  VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
  ```

## Quick Test Credentials (Development Only)

Για γρήγορο testing, μπορείτε να δημιουργήσετε έναν test user:

**Email**: `test@deyaa.gr`  
**Password**: `Test123!` (ή οποιοδήποτε password θέλετε)

**⚠️ Προσοχή**: Μην χρησιμοποιήσετε αυτά τα credentials σε production!

## Security Notes

- Χρησιμοποιήστε ισχυρό password (τουλάχιστον 8 χαρακτήρες, με κεφαλαία, πεζά, αριθμούς)
- Σε production, ενεργοποιήστε email verification
- Περιορίστε τον αριθμό των admin users
- Χρησιμοποιήστε 2FA αν είναι διαθέσιμο
