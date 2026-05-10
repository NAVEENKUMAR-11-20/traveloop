import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const STORAGE_KEY = 'traveloop_trips';

export const tripService = {
  getTrips: async (userId) => {
    if (!isSupabaseConfigured()) {
      const local = localStorage.getItem(STORAGE_KEY);
      return local ? JSON.parse(local) : [];
    }

    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        itinerary:trip_stops(
          *,
          activities(*)
        )
      `)
      .eq('user_id', userId)
      .order('start_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  createTrip: async (tripData, userId) => {
    if (!isSupabaseConfigured()) {
      const local = localStorage.getItem(STORAGE_KEY);
      const trips = local ? JSON.parse(local) : [];
      const newTrip = { ...tripData, id: crypto.randomUUID(), user_id: userId, itinerary: [] };
      trips.push(newTrip);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
      return newTrip;
    }

    const { data, error } = await supabase
      .from('trips')
      .insert([{ ...tripData, user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateTrip: async (tripId, tripData) => {
    if (!isSupabaseConfigured()) {
      const local = localStorage.getItem(STORAGE_KEY);
      let trips = local ? JSON.parse(local) : [];
      trips = trips.map(t => t.id === tripId ? { ...t, ...tripData } : t);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
      return trips.find(t => t.id === tripId);
    }

    const { data, error } = await supabase
      .from('trips')
      .update(tripData)
      .eq('id', tripId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  deleteTrip: async (tripId) => {
    if (!isSupabaseConfigured()) {
      const local = localStorage.getItem(STORAGE_KEY);
      let trips = local ? JSON.parse(local) : [];
      trips = trips.filter(t => t.id !== tripId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
      return true;
    }

    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', tripId);

    if (error) throw error;
    return true;
  },

  // Granular relational methods
  addTripStop: async (tripId, stopData) => {
    if (!isSupabaseConfigured()) return stopData;
    const { data, error } = await supabase
      .from('trip_stops')
      .insert([{ trip_id: tripId, ...stopData }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  getTripStops: async (tripId) => {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase
      .from('trip_stops')
      .select('*, activities(*)')
      .eq('trip_id', tripId)
      .order('day', { ascending: true });
    if (error) throw error;
    return data;
  },

  addActivity: async (stopId, activityData) => {
    if (!isSupabaseConfigured()) return activityData;
    const { data, error } = await supabase
      .from('activities')
      .insert([{ stop_id: stopId, ...activityData }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  getActivities: async (stopId) => {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('stop_id', stopId);
    if (error) throw error;
    return data;
  }
};
