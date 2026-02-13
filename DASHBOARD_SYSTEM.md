# Dashboard System - Ολοκληρωμένη Διαχείριση Περιεχομένου

## Επισκόπηση

Το dashboard system επιτρέπει στον υπεύθυνο της σελίδας να διαχειρίζεται δυναμικά όλο το περιεχόμενο της ιστοσελίδας μέσω ενός πλήρους admin panel.

## Διαθέσιμες Λειτουργίες

### 1. Διαχείριση Ανακοινώσεων (`/dashboard/posts`)
- Δημιουργία, επεξεργασία, διαγραφή ανακοινώσεων
- Κατηγοριοποίηση (Ανακοίνωση, Συντήρηση, κτλ)
- Status management (Draft, Published, Archived)
- Featured images support

### 2. Διαχείριση Διαγωνισμών (`/dashboard/tenders`)
- Δημιουργία νέων διαγωνισμών
- Upload PDF files (Διακήρυξη, Τεύχη Δημοπράτησης)
- Κατάσταση διαγωνισμού (Τρέχων, Παλαιότερος, Ακυρωμένος)
- Ημερομηνίες δημοσίευσης και λήξης
- Προϋπολογισμός

### 3. Διαχείριση Δικαιολογητικών (`/dashboard/documents`)
- Upload PDF forms
- Κατηγοριοποίηση (Ύδρευση, Αποχέτευση, Γενικά, Οικονομικά)
- Επιλογή εικονιδίου (lucide-react icons)
- Display order για custom sorting
- Enable/Disable documents
- Download counter

### 4. Διαχείριση Προβλημάτων (`/dashboard/problems`)
- Προβολή αναφορών προβλημάτων από χρήστες
- Status tracking
- Priority management

### 5. Διαχείριση Συνδρομητών (`/dashboard/subscribers`)
- Προβολή email subscribers
- Subscription preferences

### 6. Διαχείριση Ειδοποιήσεων (`/dashboard/notifications`)
- Προβολή αποστολών email notifications

### 7. Analytics (`/dashboard/analytics`)
- Προβολή στατιστικών views, downloads, clicks
- Top 5 rankings για posts, tenders, documents
- 7-day statistics

### 8. Email Notifications (`/dashboard/email-notifications`)
- Σύνθεση και αποστολή emails
- Επιλογή παραληπτών (όλοι ή επιλεγμένοι)
- HTML email support

### 9. Ρυθμίσεις (`/dashboard/settings`)
- Site configuration

## Αρχιτεκτονική

### Backend (Supabase)
- **Database**: PostgreSQL με RLS (Row Level Security)
- **Storage**: Supabase Storage για αρχεία (PDFs, images)
- **Authentication**: Supabase Auth

### Frontend
- **Framework**: React + TypeScript
- **State Management**: TanStack Query (React Query)
- **UI Components**: shadcn/ui
- **Routing**: React Router

### Database Schema

#### Tables:
- `posts` - Ανακοινώσεις
- `tenders` - Διαγωνισμοί
- `documents` - Δικαιολογητικά/Έντυπα
- `problems` - Αναφορές προβλημάτων
- `subscribers` - Email συνδρομητές
- `notifications` - Email notifications
- `profiles` - User profiles

#### Storage Buckets:
- `tenders` - PDF files για διαγωνισμούς
- `documents` - PDF forms για download

## File Structure

```
src/
├── hooks/
│   ├── usePosts.ts          # Hooks για ανακοινώσεις
│   ├── useTenders.ts         # Hooks για διαγωνισμούς
│   ├── useDocuments.ts       # Hooks για έγγραφα
│   ├── useAnalytics.ts       # Analytics tracking hooks
│   └── ...
├── contexts/
│   └── AuthContext.tsx      # Authentication context
├── components/
│   ├── ProtectedRoute.tsx    # Protected route wrapper
│   └── BulkActions.tsx       # Bulk operations component
├── pages/
│   ├── dashboard/
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx                 # Authentication
│   │   ├── PostsManagement.tsx
│   │   ├── TendersManagement.tsx
│   │   ├── DocumentsManagement.tsx
│   │   ├── Analytics.tsx             # Analytics dashboard
│   │   ├── EmailNotifications.tsx    # Email sending
│   │   └── ...
│   ├── Announcements.tsx     # Ενημερωμένο - διαβάζει από Supabase
│   ├── Tenders.tsx           # Ενημερωμένο - διαβάζει από Supabase
│   └── ServicesDocuments.tsx # Ενημερωμένο - διαβάζει από Supabase
├── lib/
│   ├── storage.ts            # Utilities για file upload/download
│   ├── export.ts             # CSV/Excel export utilities
│   └── email.ts              # Email notification utilities
└── integrations/
    └── supabase/
        ├── client.ts
        └── types.ts           # TypeScript types
```

## Χρήση

### 1. Setup Supabase
Ακολουθήστε τις οδηγίες στο `SUPABASE_SETUP.md`

### 2. Access Dashboard
- Πηγαίνετε στο `/dashboard`
- Κάντε login με admin credentials
- Επιλέξτε την ενότητα που θέλετε να διαχειριστείτε

### 3. Δημιουργία Νέου Περιεχομένου

#### Ανακοίνωση:
1. `/dashboard/posts` → "Νέα Ανακοίνωση"
2. Συμπληρώστε τίτλο, περιεχόμενο, category
3. Επιλέξτε status (Draft/Published)
4. Save

#### Διαγωνισμός:
1. `/dashboard/tenders` → "Νέος Διαγωνισμός"
2. Συμπληρώστε όλα τα πεδία
3. Upload PDF files (αν χρειάζεται)
4. Save

#### Έγγραφο:
1. `/dashboard/documents` → "Νέο Έγγραφο"
2. Συμπληρώστε τίτλο, περιγραφή
3. Επιλέξτε κατηγορία και εικονίδιο
4. Upload PDF file
5. Set display order
6. Save

## Features

### ✅ File Management
- Upload PDF files μέσω Supabase Storage
- Public URLs για downloads
- Automatic file cleanup on delete

### ✅ Dynamic Content
- Όλο το περιεχόμενο διαβάζεται από database
- Real-time updates με React Query
- No hardcoded data

### ✅ Security
- Row Level Security (RLS) policies
- Authenticated-only admin access
- Public read access για published content

### ✅ User Experience
- Intuitive UI με shadcn/ui components
- Search functionality
- Status badges
- Loading states
- Error handling

### ✅ Authentication & Security
- Secure login με Supabase Auth
- Protected routes
- Session management
- Automatic logout

### ✅ Analytics & Tracking
- View tracking για posts και tenders
- Download tracking για documents
- Click tracking
- Analytics dashboard με statistics

### ✅ Bulk Operations
- Multi-select με checkboxes
- Bulk delete
- Bulk export
- Selection management

### ✅ Export Functionality
- CSV export
- Excel export support
- Formatted dates
- Custom headers support

### ✅ Email Notifications
- Email composition interface
- Subscriber selection
- HTML email support
- Email templates

## ✅ Completed Features

### 1. **Authentication** ✅
- Login page για το dashboard (`/dashboard/login`)
- AuthContext για state management
- Protected routes με `ProtectedRoute` component
- Automatic redirect αν δεν είστε logged in
- Logout functionality

### 2. **Email Notifications** ✅
- Email notifications page (`/dashboard/email-notifications`)
- Send emails σε όλους τους συνδρομητές ή επιλεγμένους
- HTML email support
- Email templates utilities

### 3. **Analytics** ✅
- Analytics dashboard (`/dashboard/analytics`)
- Tracking για views, downloads, clicks
- Top content rankings (posts, tenders, documents)
- 7-day statistics
- View count tracking για posts και tenders

### 4. **Bulk Operations** ✅
- BulkActions component για bulk operations
- Checkbox selection σε tables
- Bulk delete functionality
- Bulk export functionality

### 5. **Export** ✅
- Export utilities (`src/lib/export.ts`)
- CSV export functionality
- Excel export support
- Date formatting για exports

## Support

Για ερωτήσεις ή προβλήματα, ανατρέξτε στο `SUPABASE_SETUP.md` ή επικοινωνήστε με την ομάδα ανάπτυξης.
