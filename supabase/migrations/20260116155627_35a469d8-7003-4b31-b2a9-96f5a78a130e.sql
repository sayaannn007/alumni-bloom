-- Create a secure view for jobs that excludes contact_email
CREATE VIEW public.jobs_public
WITH (security_invoker=on) AS
  SELECT id, title, company, location, job_type, description, 
         requirements, salary_range, application_url, posted_by,
         is_active, expires_at, created_at, updated_at
  FROM public.jobs;

-- Drop the existing SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view active jobs" ON public.jobs;

-- Create restrictive SELECT policy - only job poster can see full details
CREATE POLICY "Job posters can view their own jobs with full details" 
ON public.jobs 
FOR SELECT 
USING (posted_by = get_profile_id(auth.uid()));