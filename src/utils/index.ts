import { format, isToday, isTomorrow, isYesterday, formatDistanceToNow, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { WhatsAppShareData, Note, Payment } from '../types';

// Date formatting utilities
export const formatDate = (date: Date | string, formatStr: string = 'dd/MM/yyyy') => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: tr });
};

export const formatDateTime = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: tr });
};

export const formatRelativeDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) return 'Bugün';
  if (isTomorrow(dateObj)) return 'Yarın';
  if (isYesterday(dateObj)) return 'Dün';
  
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: tr });
};

// WhatsApp sharing utilities
export const createWhatsAppUrl = (data: WhatsAppShareData, phoneNumber?: string) => {
  let message = `📌 ${data.title}`;
  
  if (data.date) {
    message += `%0A🕒 Tarih: ${data.date}`;
  }
  
  if (data.amount) {
    message += `%0A💰 Tutar: ${formatCurrency(data.amount)}`;
  }
  
  if (data.description) {
    message += `%0A🗒️ Açıklama: ${data.description}`;
  }
  
  message += '%0A%0ACapNote ile gönderildi 📱';
  
  const baseUrl = 'https://api.whatsapp.com/send';
  const params = new URLSearchParams({ text: message });
  
  if (phoneNumber) {
    params.set('phone', phoneNumber);
  }
  
  return `${baseUrl}?${params.toString()}`;
};

export const shareToWhatsApp = (data: WhatsAppShareData, phoneNumber?: string) => {
  const url = createWhatsAppUrl(data, phoneNumber);
  window.open(url, '_blank');
};

export const shareNote = (note: Note, phoneNumber?: string) => {
  const shareData: WhatsAppShareData = {
    title: note.title,
    description: note.description,
    date: note.reminder_time ? formatDateTime(note.reminder_time) : undefined,
  };
  
  shareToWhatsApp(shareData, phoneNumber);
};

export const sharePayment = (payment: Payment, phoneNumber?: string) => {
  const shareData: WhatsAppShareData = {
    title: payment.title,
    amount: payment.amount,
    date: formatDate(payment.due_date),
    description: payment.notes,
  };
  
  shareToWhatsApp(shareData, phoneNumber);
};

// Currency formatting
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(amount);
};

// Tag color utilities
export const tagColors = [
  { name: 'Mavi', value: '#3B82F6', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  { name: 'Yeşil', value: '#10B981', bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  { name: 'Sarı', value: '#F59E0B', bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  { name: 'Kırmızı', value: '#EF4444', bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  { name: 'Mor', value: '#8B5CF6', bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
  { name: 'Pembe', value: '#EC4899', bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200' },
  { name: 'Turuncu', value: '#F97316', bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
  { name: 'Gri', value: '#6B7280', bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
  { name: 'İndigo', value: '#6366F1', bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
  { name: 'Teal', value: '#14B8A6', bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200' },
];

export const getTagColorClasses = (color: string) => {
  const tagColor = tagColors.find(tc => tc.value === color);
  return tagColor || tagColors[0];
};

// Notification utilities
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export const showNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === 'granted') {
    return new Notification(title, {
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      ...options,
    });
  }
};

// Storage utilities
export const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromLocalStorage = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

// File utilities
export const validateFileType = (file: File, allowedTypes: string[]) => {
  return allowedTypes.some(type => file.type.includes(type));
};

export const validateFileSize = (file: File, maxSizeMB: number) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Search utilities
export const searchNotes = (notes: Note[], searchTerm: string) => {
  if (!searchTerm.trim()) return notes;
  
  const term = searchTerm.toLowerCase();
  return notes.filter(note =>
    note.title.toLowerCase().includes(term) ||
    note.description.toLowerCase().includes(term) ||
    note.tag.toLowerCase().includes(term)
  );
};

export const searchPayments = (payments: Payment[], searchTerm: string) => {
  if (!searchTerm.trim()) return payments;
  
  const term = searchTerm.toLowerCase();
  return payments.filter(payment =>
    payment.title.toLowerCase().includes(term) ||
    (payment.notes && payment.notes.toLowerCase().includes(term))
  );
};

// Validation utilities
export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string) => {
  return password.length >= 6;
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

// Device detection
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches;
};