-- Enable realtime for connections table
ALTER PUBLICATION supabase_realtime ADD TABLE public.connections;

-- Enable realtime for user_achievements table
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_achievements;