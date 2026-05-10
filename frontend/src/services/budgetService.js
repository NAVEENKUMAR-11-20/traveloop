import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export const budgetService = {
  getBudget: async (tripId) => {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('trip_id', tripId)
      .single();
    if (error && error.code !== 'PGRST116') throw error; // Ignore not found
    return data;
  },

  saveBudget: async (tripId, budgetData) => {
    if (!isSupabaseConfigured()) return budgetData;
    const { data, error } = await supabase
      .from('budgets')
      .upsert({ trip_id: tripId, ...budgetData })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
