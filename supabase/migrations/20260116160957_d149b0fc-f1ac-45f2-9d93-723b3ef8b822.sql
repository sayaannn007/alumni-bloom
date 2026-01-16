-- Create a secure function to register for events with capacity validation
CREATE OR REPLACE FUNCTION public.register_for_event(
  event_id_param UUID,
  profile_id_param UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  max_attendees_count INTEGER;
  current_attendees_count INTEGER;
  event_exists BOOLEAN;
BEGIN
  -- Verify the event exists
  SELECT EXISTS (
    SELECT 1 FROM events WHERE id = event_id_param
  ) INTO event_exists;
  
  IF NOT event_exists THEN
    RAISE EXCEPTION 'Event not found';
  END IF;
  
  -- Check if user is already registered
  IF EXISTS (
    SELECT 1 FROM event_registrations 
    WHERE event_id = event_id_param 
      AND profile_id = profile_id_param 
      AND status = 'registered'
  ) THEN
    RAISE EXCEPTION 'Already registered for this event';
  END IF;
  
  -- Get max attendees for event
  SELECT max_attendees INTO max_attendees_count
  FROM events
  WHERE id = event_id_param;
  
  -- If null, unlimited capacity - proceed with registration
  IF max_attendees_count IS NULL THEN
    INSERT INTO event_registrations (event_id, profile_id, status)
    VALUES (event_id_param, profile_id_param, 'registered');
    RETURN TRUE;
  END IF;
  
  -- Count current registrations (use FOR UPDATE to lock rows and prevent race conditions)
  SELECT COUNT(*) INTO current_attendees_count
  FROM event_registrations
  WHERE event_id = event_id_param
    AND status = 'registered'
  FOR UPDATE;
  
  -- Check if at capacity
  IF current_attendees_count >= max_attendees_count THEN
    RAISE EXCEPTION 'Event is at full capacity';
  END IF;
  
  -- Register user
  INSERT INTO event_registrations (event_id, profile_id, status)
  VALUES (event_id_param, profile_id_param, 'registered');
  
  RETURN TRUE;
END;
$$;