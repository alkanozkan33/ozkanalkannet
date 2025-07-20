import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  DocumentTextIcon,
  CreditCardIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import NoteCard from '../components/NoteCard';
import PaymentCard from '../components/PaymentCard';
import { notesService, paymentsService } from '../services/supabase';
import { formatCurrency } from '../utils';

export default function HomePage() {
  const { state, dispatch } = useApp();
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalPayments: 0,
    unpaidAmount: 0,
    overdueCount: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load recent notes
      const { data: notes } = await notesService.getAll();
      if (notes) {
        const recent = notes.slice(0, 6);
        setRecentNotes(recent);
        dispatch({ type: 'SET_NOTES', payload: notes });
      }

      // Load upcoming payments
      const { data: payments } = await paymentsService.getUpcoming(7);
      if (payments) {
        setUpcomingPayments(payments);
      }

      // Load all payments for stats
      const { data: allPayments } = await paymentsService.getAll();
      if (allPayments) {
        dispatch({ type: 'SET_PAYMENTS', payload: allPayments });
        
        const unpaidPayments = allPayments.filter(p => !p.is_paid);
        const unpaidAmount = unpaidPayments.reduce((sum, p) => sum + p.amount, 0);
        const overdueCount = unpaidPayments.filter(p => 
          new Date(p.due_date) < new Date()
        ).length;

        setStats({
          totalNotes: notes?.length || 0,
          totalPayments: allPayments.length,
          unpaidAmount,
          overdueCount,
        });
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const handleCreateNote = () => {
    // Navigate to notes page with create modal
    window.location.href = '/notes?create=true';
  };

  const handleCreatePayment = () => {
    // Navigate to payments page with create modal
    window.location.href = '/payments?create=true';
  };

  const quickActions = [
    {
      name: 'Yeni Not',
      description: 'Hızlıca not oluştur',
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
      onClick: handleCreateNote,
    },
    {
      name: 'Yeni Ödeme',
      description: 'Ödeme takibi ekle',
      icon: CreditCardIcon,
      color: 'bg-green-500',
      onClick: handleCreatePayment,
    },
    {
      name: 'Takvim',
      description: 'Etkinlikleri görüntüle',
      icon: CalendarIcon,
      color: 'bg-purple-500',
      onClick: () => window.location.href = '/calendar',
    },
  ];

  const statCards = [
    {
      name: 'Toplam Not',
      value: stats.totalNotes,
      icon: DocumentTextIcon,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      name: 'Toplam Ödeme',
      value: stats.totalPayments,
      icon: CreditCardIcon,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      name: 'Ödenmemiş Tutar',
      value: formatCurrency(stats.unpaidAmount),
      icon: ClockIcon,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      name: 'Gecikmiş Ödeme',
      value: stats.overdueCount,
      icon: ExclamationTriangleIcon,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          Hoş geldin! 👋
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-2 text-gray-600 dark:text-gray-300"
        >
          Bugün neler yapmak istiyorsun?
        </motion.p>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {quickActions.map((action, index) => (
          <motion.button
            key={action.name}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.onClick}
            className="p-6 bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 hover:shadow-md transition-all duration-200 text-left group"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {action.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {action.description}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Özet
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className={`p-4 rounded-xl ${stat.bg} border border-gray-200 dark:border-dark-700`}
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {stat.name}
                  </p>
                  <p className={`text-lg font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Upcoming Payments */}
      {upcomingPayments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Yaklaşan Ödemeler
            </h2>
            <a
              href="/payments"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm"
            >
              Tümünü gör →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingPayments.slice(0, 3).map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                onEdit={() => {}}
                onDelete={() => {}}
                onTogglePaid={() => {}}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Notes */}
      {recentNotes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Son Notlar
            </h2>
            <a
              href="/notes"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm"
            >
              Tümünü gör →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentNotes.slice(0, 6).map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={() => {}}
                onDelete={() => {}}
                onTogglePin={() => {}}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {recentNotes.length === 0 && upcomingPayments.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-gray-100 dark:bg-dark-700 rounded-full mx-auto mb-6 flex items-center justify-center">
            <PlusIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Henüz hiçbir şey yok
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            İlk notunu veya ödeme takibini oluşturarak başla
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleCreateNote}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              <DocumentTextIcon className="w-5 h-5 mr-2" />
              İlk Notunu Oluştur
            </button>
            <button
              onClick={handleCreatePayment}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-dark-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-800 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
            >
              <CreditCardIcon className="w-5 h-5 mr-2" />
              İlk Ödeme Takibini Ekle
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}