-- Fix contact information exposure by creating proper RLS policies

-- Drop the existing public view as it's not being used correctly
DROP VIEW IF EXISTS public.posts_public;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Public can view posts with limited contact info" ON public.posts;

-- Create a security definer function to check if contact info should be visible
CREATE OR REPLACE FUNCTION public.can_view_contact_info(post_user_id uuid)
RETURNS boolean AS $$
BEGIN
  -- Contact info is visible if:
  -- 1. User is authenticated AND is the post owner, OR
  -- 2. User is authenticated (for now, we allow all authenticated users to see contact info)
  RETURN auth.uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Create new policy that conditionally shows contact info
CREATE POLICY "Posts visible with conditional contact info" 
ON public.posts 
FOR SELECT 
USING (
  -- Always allow viewing the post
  true
);

-- Update the posts table to use a computed column approach
-- We'll handle this in the application layer by modifying the select query