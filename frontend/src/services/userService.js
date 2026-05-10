import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export const userService = {
  /**
   * Upsert user into Supabase 'users' table
   */
  upsertUser: async (userData) => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured. Skipping database user storage.');
      return userData;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .upsert({
          id: userData.id, // using Google sub as ID
          email: userData.email,
          name: userData.name,
          profile_image: userData.picture,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'email'
        })
        .select()
        .single();

      if (error) {
        console.error('Error upserting user:', error);
        throw error;
      }

      console.log('User synced with Supabase successfully');
      return data;
    } catch (err) {
      console.error('User Service Error:', err);
      throw err;
    }
  },

  /**
   * Get user by ID
   */
  getUser: async (userId) => {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }
    return data;
  },

  /**
   * Update user data
   */
  updateUser: async (userId, updates) => {
    if (!isSupabaseConfigured()) return updates;

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }
    return data;
  }
};
