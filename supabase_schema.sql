-- TRAVELOOP DATABASE SCHEMA
-- Execute this in the Supabase SQL Editor

-- 1. PROFILES
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  name TEXT,
  email TEXT,
  picture TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. TRIPS
CREATE TABLE public.trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  destination TEXT,
  start_date DATE,
  end_date DATE,
  cover_image TEXT,
  description TEXT,
  status TEXT DEFAULT 'planning',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own trips." ON public.trips
  FOR ALL USING (auth.uid() = user_id);

-- 3. TRIP STOPS
CREATE TABLE public.trip_stops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  day INTEGER NOT NULL,
  title TEXT,
  date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.trip_stops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own trip stops." ON public.trip_stops
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.trips 
      WHERE trips.id = trip_stops.trip_id AND trips.user_id = auth.uid()
    )
  );

-- 4. ACTIVITIES
CREATE TABLE public.activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stop_id UUID REFERENCES public.trip_stops(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  time TEXT,
  type TEXT,
  cost NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own activities." ON public.activities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.trip_stops
      JOIN public.trips ON trips.id = trip_stops.trip_id
      WHERE trip_stops.id = activities.stop_id AND trips.user_id = auth.uid()
    )
  );

-- 5. BUDGETS
CREATE TABLE public.budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL UNIQUE,
  total_budget NUMERIC DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own budgets." ON public.budgets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.trips 
      WHERE trips.id = budgets.trip_id AND trips.user_id = auth.uid()
    )
  );

-- 6. PACKING LIST
CREATE TABLE public.packing_list (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  item TEXT NOT NULL,
  category TEXT,
  checked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.packing_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own packing list." ON public.packing_list
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.trips 
      WHERE trips.id = packing_list.trip_id AND trips.user_id = auth.uid()
    )
  );

-- 7. NOTES
CREATE TABLE public.notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  content TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notes." ON public.notes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.trips 
      WHERE trips.id = notes.trip_id AND trips.user_id = auth.uid()
    )
  );

-- TRIGGER FOR PROFILES ON AUTH SIGNUP
-- This automatically creates a profile when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, picture)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email, new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
