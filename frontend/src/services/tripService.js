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
      // 1. Fetch main trips
      const { data: trips, error: tripsError } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', String(userId))
        .order('created_at', { ascending: false });

      if (tripsError) throw tripsError;
      if (!trips || trips.length === 0) return [];

      const tripIds = trips.map(t => t.id);

      // 2. Fetch all stops for these trips
      const { data: stops, error: stopsError } = await supabase
        .from('trip_stops')
        .select('*')
        .in('trip_id', tripIds)
        .order('day', { ascending: true });

      // 3. Fetch all activities for these trips
      const { data: allActivities, error: activitiesError } = await supabase
        .from('trip_activities')
        .select('*')
        .in('trip_id', tripIds);

      // 4. Assemble the data structure in JS (much more stable than SQL joins)
      const formattedTrips = trips.map(trip => {
        // Find activities belonging directly to this trip (global)
        const tripActivities = (allActivities || []).filter(a => a.trip_id === trip.id);
        
        // Find and format stops for this trip
        const itinerary = (stops || [])
          .filter(s => s.trip_id === trip.id)
          .map(stop => ({
            ...stop,
            // Link activities to this specific stop
            activities: tripActivities.filter(a => a.stop_id === stop.id)
          }));

        return {
          ...trip,
          itinerary,
          trip_activities: tripActivities // All activities for easy access
        };
      });

      console.log(`SUPABASE: Successfully assembled ${formattedTrips.length} trips.`);
      return formattedTrips;
    } catch (err) {
      console.error('SUPABASE: Critical fetch error:', err);
      throw new Error(err.message || 'Database connection error');
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
      .from('trip_activities')
      .insert([{ stop_id: stopId, ...activityData }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  getActivities: async (stopId) => {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase
      .from('trip_activities')
      .select('*')
      .eq('stop_id', stopId);
    if (error) throw error;
    return data;
  }
};
