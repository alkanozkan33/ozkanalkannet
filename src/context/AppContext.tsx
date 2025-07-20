import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { User, AppSettings, Note, Payment } from '../types';
import { authService } from '../services/supabase';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  settings: AppSettings;
  notes: Note[];
  payments: Payment[];
  selectedTag: string | null;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'SET_NOTES'; payload: Note[] }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'SET_PAYMENTS'; payload: Payment[] }
  | { type: 'ADD_PAYMENT'; payload: Payment }
  | { type: 'UPDATE_PAYMENT'; payload: Payment }
  | { type: 'DELETE_PAYMENT'; payload: string }
  | { type: 'SET_SELECTED_TAG'; payload: string | null }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SIGN_OUT' };

const initialSettings: AppSettings = {
  theme: 'system',
  notifications: {
    enabled: true,
    payment_morning: true,
    payment_30min: true,
    custom_messages: false,
  },
  calendar_sync: false,
  pin_lock: false,
};

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  settings: initialSettings,
  notes: [],
  payments: [],
  selectedTag: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    case 'SET_NOTES':
      return { ...state, notes: action.payload };
    case 'ADD_NOTE':
      return { ...state, notes: [action.payload, ...state.notes] };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.id ? action.payload : note
        ),
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload),
      };
    case 'SET_PAYMENTS':
      return { ...state, payments: action.payload };
    case 'ADD_PAYMENT':
      return { ...state, payments: [...state.payments, action.payload] };
    case 'UPDATE_PAYMENT':
      return {
        ...state,
        payments: state.payments.map(payment =>
          payment.id === action.payload.id ? action.payload : payment
        ),
      };
    case 'DELETE_PAYMENT':
      return {
        ...state,
        payments: state.payments.filter(payment => payment.id !== action.payload),
      };
    case 'SET_SELECTED_TAG':
      return { ...state, selectedTag: action.payload };
    case 'TOGGLE_THEME':
      const newTheme = state.settings.theme === 'light' ? 'dark' : 'light';
      return {
        ...state,
        settings: { ...state.settings, theme: newTheme },
      };
    case 'SIGN_OUT':
      return {
        ...initialState,
        isLoading: false,
        settings: state.settings, // Keep settings after sign out
      };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('capnote-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        dispatch({ type: 'SET_SETTINGS', payload: settings });
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('capnote-settings', JSON.stringify(state.settings));
    
    // Apply theme to document
    const root = document.documentElement;
    if (state.settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (state.settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [state.settings]);

  // Check authentication status on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await authService.getCurrentUser();
        if (data.user) {
          dispatch({
            type: 'SET_USER',
            payload: {
              id: data.user.id,
              email: data.user.email || '',
              theme_preference: state.settings.theme,
            },
          });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, [state.settings.theme]);

  const signOut = async () => {
    try {
      await authService.signOut();
      dispatch({ type: 'SIGN_OUT' });
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const value: AppContextType = {
    state,
    dispatch,
    signOut,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}