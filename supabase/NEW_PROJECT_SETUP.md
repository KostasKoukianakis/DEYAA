# New Supabase Project Setup (lzgchpvwviggeblicmjm)

## 1. `.env` (already updated)

```env
VITE_SUPABASE_URL=https://lzgchpvwviggeblicmjm.supabase.co
VITE_SUPABASE_PROJECT_ID=lzgchpvwviggeblicmjm
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Restart dev server after any `.env` change: `Ctrl+C` → `npm run dev`

## 2. Run database schema

1. Open [Supabase SQL Editor](https://supabase.com/dashboard/project/lzgchpvwviggeblicmjm/sql/new)
2. Open `supabase/setup-new-project.sql` in this repo
3. Copy **all** contents → paste → **Run**

(Or run each file in `supabase/migrations/` in filename order.)

## 3. Create admin user (Dashboard login)

1. [Authentication → Users](https://supabase.com/dashboard/project/lzgchpvwviggeblicmjm/auth/users)
2. **Add user** → Create new user
3. Email: `admin@deyaa.gr`
4. Password: `Test123!` (or your choice)
5. **Auto Confirm User**: ON → Create

Optional — set admin role in SQL Editor:

```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@deyaa.gr';
```

## 4. Seed announcements

1. Login: http://localhost:5173/dashboard/login  
   (`admin@deyaa.gr` / your password)
2. Go to **Ανακοινώσεις** → click **Εισαγωγή 3 ανακοινώσεων**

Or run `supabase/seed/announcements.sql` in SQL Editor.

## 5. Verify

- `/announcements` — posts from Supabase (not fallback)
- `/dashboard/posts` — 3 published items

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `relation "posts" does not exist` | Run step 2 (migrations) |
| Invalid login | Create user in step 3 |
| Still shows fallback data | Posts must be `published`; restart dev server |
| Key errors | Use **Publishable key** from Settings → API (same as in `.env`) |
| Image upload fails | Run `supabase/migrations/20250605120000_announcements_storage.sql` in SQL Editor (creates `announcements` bucket) |
