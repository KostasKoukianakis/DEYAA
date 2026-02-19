-- Temporary migration to clear all subscribers for testing
-- WARNING: This will delete ALL subscribers from the database
-- Use only for development/testing purposes

DELETE FROM public.subscribers;

-- Reset the sequence if needed (optional)
-- ALTER SEQUENCE IF EXISTS subscribers_id_seq RESTART WITH 1;
