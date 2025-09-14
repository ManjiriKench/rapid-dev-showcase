-- Fix the search path issue in the security function
CREATE OR REPLACE FUNCTION public.can_view_contact_info(post_user_id uuid)
RETURNS boolean AS $$
BEGIN
  -- Contact info is visible if user is authenticated
  RETURN auth.uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = 'public', 'auth';