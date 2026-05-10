import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export const profileService = {
  getProfile: async (userId) => {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  updateProfile: async (userId, profileData) => {
    if (!isSupabaseConfigured()) return profileData;
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...profileData })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
