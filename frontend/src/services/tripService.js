import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const STORAGE_KEY = 'traveloop_trips';

export const tripService = {
  getTrips: async (userId) => {
    console.log('SUPABASE: Fetching trips for user:', userId);
    
    if (!isSupabaseConfigured()) {
      console.warn('SUPABASE: Using local storage fallback for fetch.');
      const local = localStorage.getItem(STORAGE_KEY);
      return local ? JSON.parse(local) : [];
    }

    try {
      const { data, error } = await supabase
        .from('trips')
        .select(`
          *,
          itinerary:trip_stops(
            *,
            activities:trip_activities(*)
          )
        `)
        .eq('user_id', String(userId))
        .order('created_at', { ascending: false });

      if (error) {
        console.error('SUPABASE FETCH ERROR:', error);
        // Try a simpler fetch to see if it's a relational error
        const { data: simpleData, error: simpleError } = await supabase
          .from('trips')
          .select('*')
          .eq('user_id', String(userId));
        
        if (simpleError) {
          throw new Error(`Database error: ${simpleError.message}`);
        }
        
        console.log('SUPABASE: Falling back to simple trip data (itinerary join failed)');
        return simpleData.map(t => ({ ...t, itinerary: [] }));
      }

      console.log(`SUPABASE: Found ${data?.length || 0} trips.`);
      return data;
    } catch (err) {
      console.error('SUPABASE: Error fetching trips:', err);
      throw new Error(err.message || 'Unknown database error');
    }
  },

  createTrip: async (tripData, userId) => {
    console.log('SUPABASE: Attempting to create trip for user:', userId);
    console.log('SUPABASE: Trip Data:', tripData);

    if (!isSupabaseConfigured()) {
      console.warn('SUPABASE: Using local storage fallback.');
      const local = localStorage.getItem(STORAGE_KEY);
      const trips = local ? JSON.parse(local) : [];
      const newTrip = { ...tripData, id: crypto.randomUUID(), user_id: userId, itinerary: [] };
      trips.push(newTrip);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
      return newTrip;
    }

    try {
      const { data, error } = await supabase
        .from('trips')
        .insert([{ 
          title: tripData.title,
          destination: tripData.destination,
          start_date: tripData.start_date,
          end_date: tripData.end_date,
          description: tripData.description,
          budget: Number(tripData.budget) || 0,
          cover_image: tripData.cover_image,
          user_id: String(userId) 
        }])
        .select()
        .single();

      if (error) {
        console.error('SUPABASE INSERT ERROR:', error);
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
        console.error('Error Details:', error.details);
        throw error;
      }

      console.log('SUPABASE: Trip created successfully:', data);
      return data;
    } catch (err) {
      console.error('SUPABASE: Unexpected error during trip creation:', err);
      throw err;
    }
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
