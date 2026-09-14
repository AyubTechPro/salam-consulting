-- SALAM OS DATABASE SCHEMA UPGRADE
-- Run this in your Supabase SQL Editor

-- 1. Lead Notes (for deep CRM history)
CREATE TABLE IF NOT EXISTS public.lead_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    note_text TEXT NOT NULL,
    created_by TEXT DEFAULT 'Admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Lead Tasks (for CRM task management)
CREATE TABLE IF NOT EXISTS public.lead_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    task_description TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Destinations (for CMS)
CREATE TABLE IF NOT EXISTS public.destinations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title_en TEXT NOT NULL,
    title_tg TEXT NOT NULL,
    description_en TEXT NOT NULL,
    description_tg TEXT NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Partners (for CMS)
CREATE TABLE IF NOT EXISTS public.partners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security) but allow anon to READ content (for frontend) and anon to READ/WRITE CRM (since we don't have a complex auth setup yet, we rely on middleware for admin protection)
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Policies for public reading of destinations and partners
CREATE POLICY "Allow public read destinations" ON public.destinations FOR SELECT USING (true);
CREATE POLICY "Allow public read partners" ON public.partners FOR SELECT USING (true);

-- Policies for anon full access (protected by Next.js Admin Middleware in our app)
CREATE POLICY "Allow anon all lead_notes" ON public.lead_notes FOR ALL USING (true);
CREATE POLICY "Allow anon all lead_tasks" ON public.lead_tasks FOR ALL USING (true);
CREATE POLICY "Allow anon all destinations" ON public.destinations FOR ALL USING (true);
CREATE POLICY "Allow anon all partners" ON public.partners FOR ALL USING (true);
