-- Create push subscriptions table
CREATE TABLE public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(profile_id, endpoint)
);

-- Enable RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can manage their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.push_subscriptions
  FOR SELECT USING (profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create own subscriptions" ON public.push_subscriptions
  FOR INSERT WITH CHECK (profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own subscriptions" ON public.push_subscriptions
  FOR DELETE USING (profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.push_subscriptions;