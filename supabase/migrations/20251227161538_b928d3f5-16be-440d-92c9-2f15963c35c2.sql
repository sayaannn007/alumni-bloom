-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create enum for privacy levels
CREATE TYPE public.privacy_level AS ENUM ('public', 'alumni_only', 'connections_only', 'private');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  batch_year INTEGER,
  location TEXT,
  job_title TEXT,
  company TEXT,
  industry TEXT,
  linkedin_url TEXT,
  phone TEXT,
  -- Privacy settings
  profile_privacy privacy_level DEFAULT 'alumni_only',
  email_privacy privacy_level DEFAULT 'connections_only',
  phone_privacy privacy_level DEFAULT 'private',
  location_privacy privacy_level DEFAULT 'alumni_only',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Create connections table for alumni networking
CREATE TABLE public.connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'declined')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (requester_id, recipient_id)
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  venue TEXT,
  is_virtual BOOLEAN DEFAULT false,
  meeting_link TEXT,
  image_url TEXT,
  max_attendees INTEGER,
  organizer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create event registrations table
CREATE TABLE public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('registered', 'attended', 'cancelled')) DEFAULT 'registered',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (event_id, profile_id)
);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  job_type TEXT CHECK (job_type IN ('full-time', 'part-time', 'contract', 'internship', 'remote')) DEFAULT 'full-time',
  description TEXT,
  requirements TEXT,
  salary_range TEXT,
  application_url TEXT,
  contact_email TEXT,
  posted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create job applications table
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  applicant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  cover_letter TEXT,
  resume_url TEXT,
  status TEXT CHECK (status IN ('pending', 'reviewed', 'interviewed', 'accepted', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (job_id, applicant_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user's profile id
CREATE OR REPLACE FUNCTION public.get_profile_id(_user_id UUID)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.profiles WHERE user_id = _user_id LIMIT 1
$$;

-- Create function to check if users are connected
CREATE OR REPLACE FUNCTION public.are_connected(_profile1 UUID, _profile2 UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.connections
    WHERE status = 'accepted'
    AND ((requester_id = _profile1 AND recipient_id = _profile2)
      OR (requester_id = _profile2 AND recipient_id = _profile1))
  )
$$;

-- Profiles RLS policies
CREATE POLICY "Users can view public profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (profile_privacy = 'public' OR profile_privacy = 'alumni_only' OR user_id = auth.uid() OR public.are_connected(id, public.get_profile_id(auth.uid())));

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- User roles RLS policies
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Connections RLS policies
CREATE POLICY "Users can view their connections" ON public.connections
  FOR SELECT TO authenticated
  USING (requester_id = public.get_profile_id(auth.uid()) OR recipient_id = public.get_profile_id(auth.uid()));

CREATE POLICY "Users can create connection requests" ON public.connections
  FOR INSERT TO authenticated
  WITH CHECK (requester_id = public.get_profile_id(auth.uid()));

CREATE POLICY "Users can update connections they're part of" ON public.connections
  FOR UPDATE TO authenticated
  USING (recipient_id = public.get_profile_id(auth.uid()) OR requester_id = public.get_profile_id(auth.uid()));

CREATE POLICY "Users can delete their own connection requests" ON public.connections
  FOR DELETE TO authenticated
  USING (requester_id = public.get_profile_id(auth.uid()));

-- Events RLS policies (all authenticated users can view)
CREATE POLICY "Authenticated users can view events" ON public.events
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create events" ON public.events
  FOR INSERT TO authenticated
  WITH CHECK (organizer_id = public.get_profile_id(auth.uid()));

CREATE POLICY "Organizers can update their events" ON public.events
  FOR UPDATE TO authenticated
  USING (organizer_id = public.get_profile_id(auth.uid()));

CREATE POLICY "Organizers can delete their events" ON public.events
  FOR DELETE TO authenticated
  USING (organizer_id = public.get_profile_id(auth.uid()));

-- Event registrations RLS policies
CREATE POLICY "Users can view event registrations" ON public.event_registrations
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can register for events" ON public.event_registrations
  FOR INSERT TO authenticated
  WITH CHECK (profile_id = public.get_profile_id(auth.uid()));

CREATE POLICY "Users can update their registrations" ON public.event_registrations
  FOR UPDATE TO authenticated
  USING (profile_id = public.get_profile_id(auth.uid()));

CREATE POLICY "Users can cancel their registrations" ON public.event_registrations
  FOR DELETE TO authenticated
  USING (profile_id = public.get_profile_id(auth.uid()));

-- Jobs RLS policies (all authenticated can view active jobs)
CREATE POLICY "Authenticated users can view active jobs" ON public.jobs
  FOR SELECT TO authenticated
  USING (is_active = true OR posted_by = public.get_profile_id(auth.uid()));

CREATE POLICY "Users can post jobs" ON public.jobs
  FOR INSERT TO authenticated
  WITH CHECK (posted_by = public.get_profile_id(auth.uid()));

CREATE POLICY "Posters can update their jobs" ON public.jobs
  FOR UPDATE TO authenticated
  USING (posted_by = public.get_profile_id(auth.uid()));

CREATE POLICY "Posters can delete their jobs" ON public.jobs
  FOR DELETE TO authenticated
  USING (posted_by = public.get_profile_id(auth.uid()));

-- Job applications RLS policies
CREATE POLICY "Applicants can view their applications" ON public.job_applications
  FOR SELECT TO authenticated
  USING (applicant_id = public.get_profile_id(auth.uid()));

CREATE POLICY "Job posters can view applications" ON public.job_applications
  FOR SELECT TO authenticated
  USING (job_id IN (SELECT id FROM public.jobs WHERE posted_by = public.get_profile_id(auth.uid())));

CREATE POLICY "Users can apply for jobs" ON public.job_applications
  FOR INSERT TO authenticated
  WITH CHECK (applicant_id = public.get_profile_id(auth.uid()));

CREATE POLICY "Applicants can update their applications" ON public.job_applications
  FOR UPDATE TO authenticated
  USING (applicant_id = public.get_profile_id(auth.uid()));

CREATE POLICY "Job posters can update application status" ON public.job_applications
  FOR UPDATE TO authenticated
  USING (job_id IN (SELECT id FROM public.jobs WHERE posted_by = public.get_profile_id(auth.uid())));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_connections_updated_at BEFORE UPDATE ON public.connections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();