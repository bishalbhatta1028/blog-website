-- Add image and category columns to posts table
ALTER TABLE public.posts
ADD COLUMN IF NOT EXISTS image TEXT,
ADD COLUMN IF NOT EXISTS category TEXT;

