-- ==============================================================================
-- SUPABASE DATABASE SETUP SCRIPT — SEJAL SONI PORTFOLIO
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Paste & Run
-- ==============================================================================

-- 1. Create the `contacts` table (for Homepage contact form)
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the `services_inquiries` table (for Freelancing & Services project form)
CREATE TABLE IF NOT EXISTS public.services_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    service TEXT NOT NULL,
    budget TEXT,
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS) on both tables
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_inquiries ENABLE ROW LEVEL SECURITY;

-- 4. Create insert policies allowing visitors to submit inquiries
DROP POLICY IF EXISTS "Allow public insert to contacts" ON public.contacts;
CREATE POLICY "Allow public insert to contacts"
    ON public.contacts
    FOR INSERT
    TO public
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert to services_inquiries" ON public.services_inquiries;
CREATE POLICY "Allow public insert to services_inquiries"
    ON public.services_inquiries
    FOR INSERT
    TO public
    WITH CHECK (true);

-- 5. Create select policies so only you (authenticated) can view submitted data
DROP POLICY IF EXISTS "Allow authenticated read on contacts" ON public.contacts;
CREATE POLICY "Allow authenticated read on contacts"
    ON public.contacts
    FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Allow authenticated read on services_inquiries" ON public.services_inquiries;
CREATE POLICY "Allow authenticated read on services_inquiries"
    ON public.services_inquiries
    FOR SELECT
    TO authenticated
    USING (true);
