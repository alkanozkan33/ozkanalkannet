import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import NotesPage from './pages/NotesPage';
import PaymentsPage from './pages/PaymentsPage';
import CalendarPage from './pages/CalendarPage';
import SettingsPage from './pages/SettingsPage';
import { requestNotificationPermission } from './utils';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { state } = useApp();

  if (state.isLoading) {
    return <LoadingScreen />;
  }

  if (!state.isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <Layout>{children}</Layout>;
}

// Public Route Component (redirects authenticated users)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { state } = useApp();

  if (state.isLoading) {
    return <LoadingScreen />;
  }

  if (state.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// App Content Component
function AppContent() {
  const { state } = useApp();

  useEffect(() => {
    // Request notification permission on app start
    if (state.settings.notifications.enabled && 'Notification' in window) {
      requestNotificationPermission();
    }

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Add PWA install prompt
    let deferredPrompt: any;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // Show install button or banner
      const installBanner = document.createElement('div');
      installBanner.className = 'fixed bottom-4 left-4 right-4 bg-primary-600 text-white p-4 rounded-lg shadow-lg z-50 flex items-center justify-between';
      installBanner.innerHTML = `
        <div>
          <p class="font-medium">CapNote'u ana ekranına ekle</p>
          <p class="text-sm opacity-90">Daha hızlı erişim için uygulamayı yükle</p>
        </div>
        <button id="install-btn" class="bg-white text-primary-600 px-4 py-2 rounded font-medium ml-4">Yükle</button>
        <button id="dismiss-btn" class="text-white/80 hover:text-white ml-2">×</button>
      `;
      
      document.body.appendChild(installBanner);
      
      document.getElementById('install-btn')?.addEventListener('click', () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult: any) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          }
          deferredPrompt = null;
          installBanner.remove();
        });
      });
      
      document.getElementById('dismiss-btn')?.addEventListener('click', () => {
        installBanner.remove();
      });
    });

    // Handle app installed event
    window.addEventListener('appinstalled', () => {
      console.log('CapNote has been installed');
    });

    // Handle online/offline status
    const handleOnline = () => {
      console.log('App is online');
      // Sync offline data if needed
    };

    const handleOffline = () => {
      console.log('App is offline');
      // Show offline indicator
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [state.settings.notifications.enabled]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <NotesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <PaymentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// Main App Component
function App() {
  return (
    <AppProvider>
      <div className="App">
        <AppContent />
      </div>
    </AppProvider>
  );
}

export default App;