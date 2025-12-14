# DEYAA Dashboard - Οδηγός Χρήσης

## Επισκόπηση

Το Dashboard της DEYAA (Δημοτική Επιχείρηση Ύδρευσης Αποχέτευσης) είναι ένα ολοκληρωμένο σύστημα διαχείρισης περιεχομένου που επιτρέπει στους διαχειριστές να έχουν πλήρη έλεγχο του περιεχομένου της ιστοσελίδας.

## Χαρακτηριστικά

### 1. Διαχείριση Ανακοινώσεων (Posts)
- Δημιουργία, επεξεργασία και διαγραφή ανακοινώσεων
- Κατάσταση δημοσίευσης (Πρόχειρο/Δημοσιευμένο/Αρχειοθετημένο)
- Κατηγοριοποίηση (Ανακοίνωση, Συντήρηση, Νέα)
- Αυτόματη ειδοποίηση συνδρομητών κατά τη δημοσίευση

### 2. Διαχείριση Προβλημάτων (Problems)
- Καταγραφή και παρακολούθηση προβλημάτων
- Σταδιοποίηση (Αναφέρθηκε, Ερευνάται, Σε Εξέλιξη, Επιλύθηκε, Κλειστό)
- Προτεραιοποίηση (Χαμηλή, Μεσαία, Υψηλή, Κρίσιμη)
- Ενημέρωση συνδρομητών για αλλαγές κατάστασης
- Στοιχεία επικοινωνίας και τοποθεσία

### 3. Διαχείριση Συνδρομητών (Subscribers)
- Προβολή όλων των συνδρομητών
- Στατιστικά εγγραφών και ενεργών χρηστών
- Αποστολή στοχευμένων ειδοποιήσεων
- Διαχείριση προτιμήσεων ειδοποιήσεων

### 4. Διαχείριση Ειδοποιήσεων (Notifications)
- Ιστορικό όλων των απεσταλμένων ειδοποιήσεων
- Παρακολούθηση κατάστασης αποστολής
- Επαναποστολή αποτυχημένων ειδοποιήσεων
- Στατιστικά επιτυχίας

### 5. Ρυθμίσεις Συστήματος (Settings)
- Γενικές ρυθμίσεις ιστοσελίδας
- Ρυθμίσεις email (SMTP)
- Ρυθμίσεις αυτόματων ειδοποιήσεων
- Ρυθμίσεις συστήματος

## Πώς να χρησιμοποιήσετε το Dashboard

### Πρόσβαση στο Dashboard
1. Μεταβείτε στο `/dashboard` της ιστοσελίδας
2. Συνδεθείτε με τα διαπιστευτήρια διαχειριστή

### Δημιουργία Νέας Ανακοίνωσης
1. Μεταβείτε στην καρτέλα "Posts"
2. Κάντε κλικ στο "Νέα Ανακοίνωση"
3. Συμπληρώστε τα πεδία:
   - Τίτλος
   - Περίληψη
   - Περιεχόμενο
   - Κατηγορία
   - Κατάσταση
4. Αποθηκεύστε

### Καταγραφή Προβλήματος
1. Μεταβείτε στην καρτέλα "Problems"
2. Κάντε κλικ στο "Νέο Πρόβλημα"
3. Συμπληρώστε:
   - Τίτλος και περιγραφή
   - Τοποθεσία
   - Προτεραιότητα
   - Στοιχεία επικοινωνίας
4. Αποθηκεύστε

### Αποστολή Ειδοποίησης
1. Μεταβείτε στην καρτέλα "Subscribers"
2. Επιλέξτε τους συνδρομητές
3. Κάντε κλικ στο "Αποστολή Ειδοποίησης"
4. Συμπληρώστε θέμα και περιεχόμενο
5. Αποστολή

## Τεχνικές Λεπτομέρειες

### Τεχνολογίες
- **Frontend**: React 18, TypeScript, Vite
- **UI Library**: Shadcn/ui, Radix UI, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router

### Βάση Δεδομένων
Το σύστημα χρησιμοποιεί τις εξής πίνακες:

#### Posts
```sql
- id: UUID (Primary Key)
- title: TEXT (NOT NULL)
- content: TEXT (NOT NULL)
- excerpt: TEXT
- status: ENUM ('draft', 'published', 'archived')
- category: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- published_at: TIMESTAMP
- author_id: UUID (Foreign Key)
- featured_image: TEXT
- tags: TEXT[]
```

#### Problems
```sql
- id: UUID (Primary Key)
- title: TEXT (NOT NULL)
- description: TEXT (NOT NULL)
- location: TEXT
- latitude: NUMERIC
- longitude: NUMERIC
- status: ENUM ('reported', 'investigating', 'in_progress', 'resolved', 'closed')
- priority: ENUM ('low', 'medium', 'high', 'critical')
- category: TEXT
- reported_by: UUID
- assigned_to: UUID
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- resolved_at: TIMESTAMP
- estimated_resolution: TIMESTAMP
- images: TEXT[]
- contact_phone: TEXT
- contact_email: TEXT
```

#### Subscribers
```sql
- id: UUID (Primary Key)
- email: TEXT (NOT NULL, UNIQUE)
- name: TEXT
- phone: TEXT
- preferences: JSONB
- subscribed_at: TIMESTAMP
- unsubscribed_at: TIMESTAMP
- is_active: BOOLEAN
- verification_token: TEXT
- verified_at: TIMESTAMP
```

#### Notifications
```sql
- id: UUID (Primary Key)
- type: ENUM ('post_published', 'problem_update', 'maintenance_alert')
- subject: TEXT (NOT NULL)
- content: TEXT (NOT NULL)
- recipient_email: TEXT (NOT NULL)
- recipient_name: TEXT
- sent_at: TIMESTAMP
- status: ENUM ('pending', 'sent', 'failed')
- error_message: TEXT
- reference_id: UUID
- created_at: TIMESTAMP
```

### API Endpoints
Το σύστημα χρησιμοποιεί RESTful API endpoints μέσω Supabase:

- `GET /posts` - Ανάκτηση ανακοινώσεων
- `POST /posts` - Δημιουργία ανακοίνωσης
- `PUT /posts/{id}` - Ενημέρωση ανακοίνωσης
- `DELETE /posts/{id}` - Διαγραφή ανακοίνωσης

- `GET /problems` - Ανάκτηση προβλημάτων
- `POST /problems` - Δημιουργία προβλήματος
- `PUT /problems/{id}` - Ενημέρωση προβλήματος
- `DELETE /problems/{id}` - Διαγραφή προβλήματος

- `GET /subscribers` - Ανάκτηση συνδρομητών
- `POST /subscribers` - Δημιουργία συνδρομητή
- `PUT /subscribers/{id}` - Ενημέρωση συνδρομητή

- `GET /notifications` - Ανάκτηση ειδοποιήσεων
- `POST /notifications` - Δημιουργία ειδοποίησης
- `PUT /notifications/{id}` - Ενημέρωση ειδοποίησης

## Ασφάλεια

### Row Level Security (RLS)
Όλοι οι πίνακες χρησιμοποιούν RLS policies για ασφαλή πρόσβαση:

- **Posts**: Δημόσια ανάγνωση δημοσιευμένων posts, μόνο authors/admins μπορούν να επεξεργάζονται
- **Problems**: Δημόσια ανάγνωση, authenticated χρήστες μπορούν να δημιουργούν
- **Subscribers**: Χρήστες μπορούν να δουν μόνο τα δικά τους δεδομένα
- **Notifications**: Μόνο admins έχουν πρόσβαση

### Authentication
Το σύστημα χρησιμοποιεί Supabase Authentication με:
- JWT tokens
- Role-based access control
- Secure password hashing

## Ανάπτυξη

### Εγκατάσταση Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build για Production
```bash
npm run build
```

### Database Migration
Για να εφαρμόσετε τις migrations στη βάση δεδομένων:
```bash
# Από τον φάκελο supabase
supabase db push
```

## Υποστήριξη

Για τεχνική υποστήριξη ή ερωτήσεις σχετικά με το Dashboard, επικοινωνήστε με την ομάδα ανάπτυξης.

---

**Σημείωση**: Αυτό είναι ένα πλήρες CMS σύστημα ειδικά σχεδιασμένο για τις ανάγκες της DEYAA με έμφαση στην ευκολία χρήσης και την αυτοματοποίηση των διαδικασιών επικοινωνίας με τους πολίτες.
