import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  DocumentTextIcon,
  CreditCardIcon,
  CalendarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

const navigation: NavItem[] = [
  { name: 'Ana Sayfa', href: '/', icon: HomeIcon },
  { name: 'Notlar', href: '/notes', icon: DocumentTextIcon },
  { name: 'Ödemeler', href: '/payments', icon: CreditCardIcon },
  { name: 'Takvim', href: '/calendar', icon: CalendarIcon },
  { name: 'Ayarlar', href: '/settings', icon: Cog6ToothIcon },
];

export default function Layout({ children }: LayoutProps) {
  const { state, dispatch } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const currentPath = window.location.pathname;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={mobileMenuOpen ? { x: 0 } : { x: '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark-800 shadow-xl lg:hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CN</span>
              </div>
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                CapNote
              </h2>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-white'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon
                    className={`${
                      isActive
                        ? 'text-primary-500 dark:text-primary-300'
                        : 'text-gray-400 dark:text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                    } mr-4 flex-shrink-0 h-6 w-6 transition-colors`}
                  />
                  {item.name}
                </a>
              );
            })}
          </div>
        </nav>
      </motion.div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white dark:bg-dark-800 shadow-sm">
          <div className="flex flex-1 flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">CN</span>
                </div>
              </div>
              <div className="ml-3">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  CapNote
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Takip Uygulaması
                </p>
              </div>
            </div>
            <nav className="mt-8 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = currentPath === item.href;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-white'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                  >
                    <item.icon
                      className={`${
                        isActive
                          ? 'text-primary-500 dark:text-primary-300'
                          : 'text-gray-400 dark:text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                      } mr-3 flex-shrink-0 h-6 w-6 transition-colors`}
                    />
                    {item.name}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 flex-shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Menüyü aç</span>
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 dark:bg-dark-700 lg:hidden" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                CapNote
              </h1>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Theme toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <span className="sr-only">Tema değiştir</span>
                {state.settings.theme === 'dark' ? (
                  <SunIcon className="h-6 w-6" />
                ) : (
                  <MoonIcon className="h-6 w-6" />
                )}
              </button>

              {/* Notifications */}
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <span className="sr-only">Bildirimler</span>
                <BellIcon className="h-6 w-6" />
              </button>

              {/* Profile dropdown placeholder */}
              <div className="relative">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {state.user?.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}