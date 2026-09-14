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
ADD COLUMN IF NOT EXISTS referrer TEXT;

-- Create Newsroom table for B2B Press Releases
CREATE TABLE IF NOT EXISTS public.news (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  content text not null,
  published_at timestamp with time zone default timezone('utc'::text, now()) not null,
  image_url text,
  author text,
  locale text default 'en'
);
