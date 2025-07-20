import { createClient } from '@supabase/supabase-js';
import type { Note, Payment, CalendarEvent, Checklist, User } from '../types';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Auth services
export const authService = {
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: () => {
    return supabase.auth.getUser();
  },
};

// Notes services
export const notesService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  create: async (note: Omit<Note, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('notes')
      .insert([note])
      .select()
      .single();
    return { data, error };
  },

  update: async (id: string, updates: Partial<Note>) => {
    const { data, error } = await supabase
      .from('notes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);
    return { error };
  },

  getByTag: async (tag: string) => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('tag', tag)
      .order('created_at', { ascending: false });
    return { data, error };
  },
};

// Payments services
export const paymentsService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('due_date', { ascending: true });
    return { data, error };
  },

  create: async (payment: Omit<Payment, 'id'>) => {
    const { data, error } = await supabase
      .from('payments')
      .insert([payment])
      .select()
      .single();
    return { data, error };
  },

  update: async (id: string, updates: Partial<Payment>) => {
    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id);
    return { error };
  },

  getUpcoming: async (days: number = 7) => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .gte('due_date', new Date().toISOString())
      .lte('due_date', endDate.toISOString())
      .eq('is_paid', false)
      .order('due_date', { ascending: true });
    return { data, error };
  },
};

// Checklist services
export const checklistService = {
  getByNoteId: async (noteId: string) => {
    const { data, error } = await supabase
      .from('checklists')
      .select('*')
      .eq('note_id', noteId)
      .order('created_at', { ascending: true });
    return { data, error };
  },

  create: async (checklist: Omit<Checklist, 'id'>) => {
    const { data, error } = await supabase
      .from('checklists')
      .insert([checklist])
      .select()
      .single();
    return { data, error };
  },

  update: async (id: string, updates: Partial<Checklist>) => {
    const { data, error } = await supabase
      .from('checklists')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('checklists')
      .delete()
      .eq('id', id);
    return { error };
  },
};

// Calendar events services
export const calendarService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('event_date', { ascending: true });
    return { data, error };
  },

  create: async (event: Omit<CalendarEvent, 'id'>) => {
    const { data, error } = await supabase
      .from('calendar_events')
      .insert([event])
      .select()
      .single();
    return { data, error };
  },

  syncWithGoogle: async (eventId: string, googleEventId: string) => {
    const { data, error } = await supabase
      .from('calendar_events')
      .update({ 
        is_synced_with_google: true,
        google_event_id: googleEventId 
      })
      .eq('id', eventId)
      .select()
      .single();
    return { data, error };
  },
};

// File upload service
export const storageService = {
  uploadReceipt: async (file: File, paymentId: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${paymentId}.${fileExt}`;
    const filePath = `receipts/${fileName}`;

    const { data, error } = await supabase.storage
      .from('receipts')
      .upload(filePath, file);

    if (error) return { data: null, error };

    const { data: { publicUrl } } = supabase.storage
      .from('receipts')
      .getPublicUrl(filePath);

    return { data: { path: filePath, url: publicUrl }, error: null };
  },

  deleteReceipt: async (path: string) => {
    const { error } = await supabase.storage
      .from('receipts')
      .remove([path]);
    return { error };
  },
};