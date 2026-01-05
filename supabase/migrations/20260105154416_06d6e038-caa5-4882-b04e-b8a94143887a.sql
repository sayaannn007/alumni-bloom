-- Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  badge_color TEXT NOT NULL DEFAULT 'from-primary to-secondary',
  category TEXT NOT NULL DEFAULT 'general',
  points INTEGER NOT NULL DEFAULT 10,
  requirement_type TEXT NOT NULL,
  requirement_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_achievements table to track which achievements users have earned
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  progress INTEGER NOT NULL DEFAULT 0,
  UNIQUE(profile_id, achievement_id)
);

-- Enable RLS on achievements (readable by all authenticated users)
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Achievements are viewable by authenticated users"
ON public.achievements
FOR SELECT
TO authenticated
USING (true);

-- Enable RLS on user_achievements
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements"
ON public.user_achievements
FOR SELECT
TO authenticated
USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own achievements"
ON public.user_achievements
FOR INSERT
TO authenticated
WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own achievements"
ON public.user_achievements
FOR UPDATE
TO authenticated
USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Insert default achievements
INSERT INTO public.achievements (name, description, icon, badge_color, category, requirement_type, requirement_count, points) VALUES
('First Steps', 'Complete your profile setup', 'User', 'from-green-500 to-emerald-500', 'profile', 'profile_complete', 1, 10),
('Social Butterfly', 'Connect with 5 alumni', 'Users', 'from-blue-500 to-cyan-500', 'networking', 'connections', 5, 25),
('Networking Pro', 'Connect with 25 alumni', 'Network', 'from-purple-500 to-pink-500', 'networking', 'connections', 25, 100),
('Event Enthusiast', 'Attend your first event', 'Calendar', 'from-orange-500 to-red-500', 'events', 'events_attended', 1, 15),
('Event Regular', 'Attend 5 events', 'CalendarCheck', 'from-amber-500 to-yellow-500', 'events', 'events_attended', 5, 50),
('Conversation Starter', 'Send your first message', 'MessageCircle', 'from-teal-500 to-green-500', 'messaging', 'messages_sent', 1, 10),
('Engaged Member', 'Send 50 messages', 'MessageSquare', 'from-indigo-500 to-violet-500', 'messaging', 'messages_sent', 50, 75),
('Job Seeker', 'Apply to your first job', 'Briefcase', 'from-rose-500 to-pink-500', 'jobs', 'jobs_applied', 1, 20),
('Career Explorer', 'Apply to 10 jobs', 'Building', 'from-cyan-500 to-blue-500', 'jobs', 'jobs_applied', 10, 60),
('Early Adopter', 'Join within the first year', 'Sparkles', 'from-yellow-400 to-orange-500', 'special', 'early_adopter', 1, 50);