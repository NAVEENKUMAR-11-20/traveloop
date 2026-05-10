import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export const checklistService = {
  getItems: async (tripId) => {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase
      .from('packing_list')
      .select('*')
      .eq('trip_id', tripId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  },

  addItem: async (tripId, item) => {
    if (!isSupabaseConfigured()) return item;
    const { data, error } = await supabase
      .from('packing_list')
      .insert([{ trip_id: tripId, ...item }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateItem: async (itemId, updates) => {
    if (!isSupabaseConfigured()) return updates;
    const { data, error } = await supabase
      .from('packing_list')
      .update(updates)
      .eq('id', itemId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  deleteItem: async (itemId) => {
    if (!isSupabaseConfigured()) return true;
    const { error } = await supabase
      .from('packing_list')
      .delete()
      .eq('id', itemId);
    if (error) throw error;
    return true;
  }
};
