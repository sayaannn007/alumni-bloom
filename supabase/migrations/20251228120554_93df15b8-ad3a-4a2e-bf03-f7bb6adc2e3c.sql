-- Create messages table for alumni chat
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages they sent or received
CREATE POLICY "Users can view their messages" 
ON public.messages 
FOR SELECT 
USING (
  sender_id = get_profile_id(auth.uid()) OR 
  recipient_id = get_profile_id(auth.uid())
);

-- Users can send messages only to connected users
CREATE POLICY "Users can send messages to connections" 
ON public.messages 
FOR INSERT 
WITH CHECK (
  sender_id = get_profile_id(auth.uid()) AND 
  are_connected(sender_id, recipient_id)
);

-- Users can update their received messages (mark as read)
CREATE POLICY "Users can mark messages as read" 
ON public.messages 
FOR UPDATE 
USING (recipient_id = get_profile_id(auth.uid()));

-- Users can delete their own sent messages
CREATE POLICY "Users can delete their sent messages" 
ON public.messages 
FOR DELETE 
USING (sender_id = get_profile_id(auth.uid()));

-- Enable realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;