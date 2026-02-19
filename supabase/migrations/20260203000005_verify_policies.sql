-- Verification script: Check if RLS policies are correctly set up
-- Run this AFTER applying the fix migration to verify everything is correct

-- Check 1: Verify anon has UPDATE privilege
SELECT 
  grantee, 
  privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'subscribers' 
  AND grantee = 'anon' 
  AND privilege_type = 'UPDATE';

-- Check 2: List all policies on subscribers table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'subscribers'
ORDER BY policyname;

-- Check 3: Verify RLS is enabled
SELECT 
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'subscribers';

-- Expected results:
-- 1. Should show 1 row with grantee='anon' and privilege_type='UPDATE'
-- 2. Should show policy "Anon can verify subscription with token" with cmd='UPDATE' and roles='{anon}'
-- 3. Should show rowsecurity='true'
