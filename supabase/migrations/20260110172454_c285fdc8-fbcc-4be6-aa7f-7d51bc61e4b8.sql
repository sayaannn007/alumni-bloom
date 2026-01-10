-- Add notification preferences to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{"achievements": true, "messages": true, "connections": true, "events": true, "jobs": true}'::jsonb;