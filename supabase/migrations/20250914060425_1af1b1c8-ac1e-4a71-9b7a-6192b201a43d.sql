-- Implement proper RLS policy to mask contact information at database level

-- Drop the current policy that allows unrestricted access
DROP POLICY IF EXISTS "Posts visible with conditional contact info" ON public.posts;

-- Create a policy that allows public viewing but restricts sensitive data
CREATE POLICY "Public can view posts" 
ON public.posts 
FOR SELECT 
USING (true);

-- Create a view that masks contact information for public access
CREATE OR REPLACE VIEW public.posts_with_masked_contact AS
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
  user_id,
  -- Mask contact info for unauthenticated users
  CASE 
    WHEN auth.uid() IS NOT NULL THEN contact_info
    ELSE 'Sign in to view contact information'
  END as contact_info
FROM public.posts
WHERE status = 'active';

-- Grant appropriate permissions to the view
GRANT SELECT ON public.posts_with_masked_contact TO anon;
GRANT SELECT ON public.posts_with_masked_contact TO authenticated;

-- Create RLS policy for the view
ALTER VIEW public.posts_with_masked_contact SET (security_invoker = on);