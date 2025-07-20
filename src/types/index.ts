export interface Note {
  id: string;
  title: string;
  description: string;
  tag: string;
  tag_color: string;
  is_pinned: boolean;
  reminder_time?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Payment {
  id: string;
  title: string;
  amount: number;
  due_date: Date;
  is_paid: boolean;
  recurrence: 'once' | 'monthly' | 'yearly';
  reminder_time?: Date;
  notes?: string;
  receipt_url?: string;
}

export interface CalendarEvent {
  id: string;
  linked_note_id?: string;
  linked_payment_id?: string;
  event_type: 'note' | 'payment';
  event_date: Date;
  is_synced_with_google: boolean;
}

export interface Checklist {
  id: string;
  note_id: string;
  title: string;
  is_done: boolean;
}

export interface User {
  id: string;
  email: string;
  pin_code?: string;
  theme_preference: 'light' | 'dark' | 'system';
}

export interface Tag {
  name: string;
  color: string;
  count: number;
}

export interface NotificationSettings {
  enabled: boolean;
  payment_morning: boolean;
  payment_30min: boolean;
  custom_messages: boolean;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationSettings;
  default_phone?: string;
  calendar_sync: boolean;
  pin_lock: boolean;
}

export interface GoogleCalendarCredentials {
  access_token: string;
  refresh_token: string;
  expires_at: Date;
}

export interface WhatsAppShareData {
  title: string;
  date?: string;
  description?: string;
  amount?: number;
}