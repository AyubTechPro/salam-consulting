-- SALAM OS: Telemetry Update
-- Run this in your Supabase SQL Editor

ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS utm_source TEXT,
ADD COLUMN IF NOT EXISTS utm_medium TEXT,
ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
ADD COLUMN IF NOT EXISTS device_type TEXT,
ADD COLUMN IF NOT EXISTS browser TEXT,
ADD COLUMN IF NOT EXISTS os TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS referrer TEXT,
ADD COLUMN IF NOT EXISTS notes JSONB DEFAULT '[]'::jsonb;

-- 2. CMS Tables
CREATE TABLE IF NOT EXISTS public.destinations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.partners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and create basic policies (assuming simple read/write for now)
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on destinations" ON public.destinations FOR SELECT USING (true);
CREATE POLICY "Allow all access for service role on destinations" ON public.destinations USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access on partners" ON public.partners FOR SELECT USING (true);
CREATE POLICY "Allow all access for service role on partners" ON public.partners USING (true) WITH CHECK (true);
