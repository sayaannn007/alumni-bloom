-- Create a secure view with field-level privacy enforcement for profiles
-- This view respects email_privacy, phone_privacy, and location_privacy settings

CREATE OR REPLACE VIEW public.profiles_secure
WITH (security_invoker=on) AS
SELECT 
  id,
  user_id,
  full_name,
  avatar_url,
  bio,
  batch_year,
  job_title,
  company,
  industry,
  linkedin_url,
  notification_preferences,
  profile_privacy,
  email_privacy,
  phone_privacy,
  location_privacy,
  created_at,
  updated_at,
  -- Field-level security for email
  CASE 
    WHEN user_id = auth.uid() THEN email
    WHEN email_privacy = 'public' THEN email
    WHEN email_privacy = 'alumni_only' AND auth.uid() IS NOT NULL THEN email
    WHEN email_privacy = 'connections_only' AND are_connected(id, get_profile_id(auth.uid())) THEN email
    ELSE NULL
  END as email,
  -- Field-level security for phone
  CASE
    WHEN user_id = auth.uid() THEN phone
    WHEN phone_privacy = 'public' THEN phone
    WHEN phone_privacy = 'alumni_only' AND auth.uid() IS NOT NULL THEN phone
    WHEN phone_privacy = 'connections_only' AND are_connected(id, get_profile_id(auth.uid())) THEN phone
    ELSE NULL
  END as phone,
  -- Field-level security for location
  CASE
    WHEN user_id = auth.uid() THEN location
    WHEN location_privacy = 'public' THEN location
    WHEN location_privacy = 'alumni_only' AND auth.uid() IS NOT NULL THEN location
    WHEN location_privacy = 'connections_only' AND are_connected(id, get_profile_id(auth.uid())) THEN location
    ELSE NULL
  END as location
FROM public.profiles;

-- Drop and recreate the profiles SELECT policy to require authentication
DROP POLICY IF EXISTS "Users can view public profiles" ON public.profiles;

CREATE POLICY "Users can view public profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  (profile_privacy = 'public'::privacy_level) 
  OR (profile_privacy = 'alumni_only'::privacy_level) 
  OR (user_id = auth.uid()) 
  OR are_connected(id, get_profile_id(auth.uid()))
);

-- Also fix the jobs table - add back a SELECT policy for authenticated users to view active jobs
CREATE POLICY "Authenticated users can view active jobs"
ON public.jobs
FOR SELECT
TO authenticated
USING (is_active = true OR posted_by = get_profile_id(auth.uid()));