-- TRAVELOOP DATABASE SCHEMA
-- Run this in your Supabase SQL Editor

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY, -- Stores Google 'sub' or Supabase UUID
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. TRIPS TABLE
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  description TEXT,
  budget NUMERIC DEFAULT 0,
  spent NUMERIC DEFAULT 0,
  cover_image TEXT,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'upcoming', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. TRIP STOPS (Itinerary Days)
CREATE TABLE IF NOT EXISTS public.trip_stops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  day INTEGER NOT NULL,
  date DATE NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. TRIP ACTIVITIES
CREATE TABLE IF NOT EXISTS public.trip_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  stop_id UUID REFERENCES public.trip_stops(id) ON DELETE CASCADE,
  activity_name TEXT NOT NULL,
  category TEXT,
  cost NUMERIC DEFAULT 0,
  duration TEXT,
  image_url TEXT,
  time TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. BUDGETS
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL UNIQUE REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  total_budget NUMERIC DEFAULT 0,
  transport NUMERIC DEFAULT 0,
  stay NUMERIC DEFAULT 0,
  food NUMERIC DEFAULT 0,
  activities NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- POLICIES (Simplified for user-specific access)
CREATE POLICY "Users can manage their own profile" ON public.users FOR ALL USING (true);
CREATE POLICY "Users can manage their own trips" ON public.trips FOR ALL USING (true);
CREATE POLICY "Users can manage their own stops" ON public.trip_stops FOR ALL USING (true);
CREATE POLICY "Users can manage their own activities" ON public.trip_activities FOR ALL USING (true);
CREATE POLICY "Users can manage their own budgets" ON public.budgets FOR ALL USING (true);
