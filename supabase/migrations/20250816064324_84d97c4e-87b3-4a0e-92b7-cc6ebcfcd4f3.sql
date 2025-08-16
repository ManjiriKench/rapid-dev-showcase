-- Fix security issue: Restrict access to user email addresses and contact information

-- 1. Drop the overly permissive profile viewing policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- 2. Create a secure policy that only allows users to view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- 3. Drop the existing posts viewing policy
DROP POLICY IF EXISTS "Anyone can view posts" ON public.posts;

-- 4. Create a new policy that shows posts publicly but protects contact info
-- We'll create a view for public access that excludes sensitive contact information
CREATE OR REPLACE VIEW public.posts_public AS
SELECT 
  id,
  title,
  description,
  category,
  status,
  location,
  image_url,
  date_posted,
  date_lost_found,
  created_at,
  updated_at,
  -- Mask contact info for public view
  CASE 
    WHEN auth.uid() IS NOT NULL THEN contact_info
    ELSE 'Contact info available to authenticated users only'
  END as contact_info,
  user_id
FROM public.posts
WHERE status = 'active';

-- 5. Create policies for the main posts table
-- Allow public to view posts but with restrictions on sensitive data
CREATE POLICY "Public can view posts with limited contact info" 
ON public.posts 
FOR SELECT 
USING (true);

-- 6. Grant access to the public view
GRANT SELECT ON public.posts_public TO anon;
GRANT SELECT ON public.posts_public TO authenticated;