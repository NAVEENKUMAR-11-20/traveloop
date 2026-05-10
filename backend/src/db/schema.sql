-- =============================================
-- Traveloop Database Schema (PostgreSQL)
-- =============================================

-- Users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(500),
  bio TEXT,
  role VARCHAR(20) DEFAULT 'user', -- 'user' | 'admin'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trips
CREATE TABLE IF NOT EXISTS trips (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  destination VARCHAR(200),
  start_date DATE,
  end_date DATE,
  cover_image VARCHAR(500),
  budget DECIMAL(12, 2) DEFAULT 0,
  spent DECIMAL(12, 2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'planning', -- 'planning' | 'upcoming' | 'active' | 'completed'
  is_public BOOLEAN DEFAULT FALSE,
  share_token VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trip Cities
CREATE TABLE IF NOT EXISTS trip_cities (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
  city_name VARCHAR(100) NOT NULL,
  country VARCHAR(100),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Itinerary Days
CREATE TABLE IF NOT EXISTS itinerary_days (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  date DATE,
  title VARCHAR(200),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Itinerary Activities
CREATE TABLE IF NOT EXISTS itinerary_activities (
  id SERIAL PRIMARY KEY,
  day_id INTEGER REFERENCES itinerary_days(id) ON DELETE CASCADE,
  trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  time TIME,
  duration_minutes INTEGER,
  cost DECIMAL(10, 2) DEFAULT 0,
  type VARCHAR(50) DEFAULT 'other', -- 'sightseeing' | 'food' | 'accommodation' | 'entertainment' | 'shopping' | 'transport' | 'other'
  location VARCHAR(200),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Budget Expenses
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL, -- 'flights' | 'accommodation' | 'food' | 'transport' | 'activities' | 'shopping' | 'other'
  description VARCHAR(200),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Packing Items
CREATE TABLE IF NOT EXISTS packing_items (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
  item VARCHAR(200) NOT NULL,
  category VARCHAR(50) DEFAULT 'other', -- 'documents' | 'electronics' | 'clothing' | 'toiletries' | 'medication' | 'other'
  is_checked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Journal Entries
CREATE TABLE IF NOT EXISTS journal_entries (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  mood VARCHAR(20), -- 'happy' | 'excited' | 'relaxed' | 'tired' | 'adventurous'
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cities (reference data)
CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  continent VARCHAR(50),
  description TEXT,
  image VARCHAR(500),
  rating DECIMAL(2, 1) DEFAULT 0,
  popular BOOLEAN DEFAULT FALSE
);

-- Activities (reference data)
CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  duration_hours DECIMAL(4, 1),
  cost DECIMAL(10, 2) DEFAULT 0,
  rating DECIMAL(2, 1) DEFAULT 0,
  image VARCHAR(500),
  city_id INTEGER REFERENCES cities(id)
);

-- Saved Destinations
CREATE TABLE IF NOT EXISTS saved_destinations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  city_id INTEGER REFERENCES cities(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, city_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_itinerary_days_trip_id ON itinerary_days(trip_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_activities_day_id ON itinerary_activities(day_id);
CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_packing_items_trip_id ON packing_items(trip_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_trip_id ON journal_entries(trip_id);
