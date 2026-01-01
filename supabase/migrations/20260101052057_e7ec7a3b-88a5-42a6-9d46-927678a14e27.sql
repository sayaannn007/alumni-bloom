-- Fix: Restrict event_registrations visibility to owners and event organizers only

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view event registrations" ON public.event_registrations;

-- Create a properly scoped policy that allows:
-- 1. Users to see their own registrations
-- 2. Event organizers to see registrations for their events
CREATE POLICY "Users can view relevant registrations" ON public.event_registrations
  FOR SELECT TO authenticated
  USING (
    profile_id = get_profile_id(auth.uid()) OR 
    event_id IN (SELECT id FROM events WHERE organizer_id = get_profile_id(auth.uid()))
  );