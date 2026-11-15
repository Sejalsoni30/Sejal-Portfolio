-- ==============================================================================
-- SUPABASE DATABASE SETUP SCRIPT — SEJAL SONI PORTFOLIO
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Paste & Run
-- ==============================================================================

-- 1. Create the `contacts` table with the exact requested schema
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    service_required TEXT,
    budget TEXT,
    project_details TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- In case the table already existed with older column names, add any missing columns safely:
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS service_required TEXT;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS budget TEXT;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS project_details TEXT;

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow public/anonymous visitors to insert form inquiries
DROP POLICY IF EXISTS "Allow public insert to contacts" ON public.contacts;
CREATE POLICY "Allow public insert to contacts"
    ON public.contacts
    FOR INSERT
    TO public
    WITH CHECK (true);

-- 4. Policy: Allow only authenticated user (you, the dashboard owner) to view submitted contacts
DROP POLICY IF EXISTS "Allow authenticated read on contacts" ON public.contacts;
CREATE POLICY "Allow authenticated read on contacts"
    ON public.contacts
    FOR SELECT
    TO authenticated
    USING (true);
