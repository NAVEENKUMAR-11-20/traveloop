import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export const notesService = {
  getNotes: async (tripId) => {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('trip_id', tripId)
      .order('date', { ascending: false });
    if (error) throw error;
    return data;
  },

  addNote: async (tripId, note) => {
    if (!isSupabaseConfigured()) return note;
    const { data, error } = await supabase
      .from('notes')
      .insert([{ trip_id: tripId, ...note }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateNote: async (noteId, updates) => {
    if (!isSupabaseConfigured()) return updates;
    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', noteId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  deleteNote: async (noteId) => {
    if (!isSupabaseConfigured()) return true;
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId);
    if (error) throw error;
    return true;
  }
};
