import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CurrencyLiraIcon,
  CalendarDaysIcon,
  ClockIcon,
  ShareIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import type { Payment } from '../types';
import { formatDate, formatRelativeDate, formatCurrency, sharePayment } from '../utils';
import { useApp } from '../context/AppContext';

interface PaymentCardProps {
  payment: Payment;
  onEdit: (payment: Payment) => void;
  onDelete: (paymentId: string) => void;
  onTogglePaid: (paymentId: string, isPaid: boolean) => void;
}

const recurrenceLabels = {
  once: 'Tek seferlik',
  monthly: 'Aylık',
  yearly: 'Yıllık',
};

export default function PaymentCard({
  payment,
  onEdit,
  onDelete,
  onTogglePaid,
}: PaymentCardProps) {
  const { state } = useApp();
  const [isHovered, setIsHovered] = useState(false);

  const isOverdue = !payment.is_paid && new Date(payment.due_date) < new Date();
  const isDueToday = !payment.is_paid && 
    new Date(payment.due_date).toDateString() === new Date().toDateString();
  const isDueTomorrow = !payment.is_paid && 
    new Date(payment.due_date).toDateString() === 
    new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString();

  const getStatusColor = () => {
    if (payment.is_paid) return 'text-green-600 dark:text-green-400';
    if (isOverdue) return 'text-red-600 dark:text-red-400';
    if (isDueToday) return 'text-orange-600 dark:text-orange-400';
    if (isDueTomorrow) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getStatusBg = () => {
    if (payment.is_paid) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    if (isOverdue) return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    if (isDueToday) return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
    if (isDueTomorrow) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    return 'bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700';
  };

  const getStatusText = () => {
    if (payment.is_paid) return 'Ödendi';
    if (isOverdue) return 'Gecikmiş';
    if (isDueToday) return 'Bugün';
    if (isDueTomorrow) return 'Yarın';
    return formatRelativeDate(payment.due_date);
  };

  const handleShare = () => {
    sharePayment(payment, state.settings.default_phone);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(payment);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Bu ödemeyi silmek istediğinizden emin misiniz?')) {
      onDelete(payment.id);
    }
  };

  const handleTogglePaid = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTogglePaid(payment.id, !payment.is_paid);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`rounded-xl shadow-sm border p-4 cursor-pointer hover:shadow-md transition-all duration-200 ${getStatusBg()}`}
        onClick={handleEdit}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {/* Amount */}
            <div className="flex items-center space-x-1">
              <CurrencyLiraIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(payment.amount)}
              </span>
            </div>

            {/* Recurrence indicator */}
            {payment.recurrence !== 'once' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                <ArrowPathIcon className="w-3 h-3 mr-1" />
                {recurrenceLabels[payment.recurrence]}
              </span>
            )}
          </div>

          {/* Status indicator */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleTogglePaid}
              className={`p-1 rounded-full transition-colors ${
                payment.is_paid
                  ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20'
                  : 'text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
              }`}
              title={payment.is_paid ? 'Ödenmedi olarak işaretle' : 'Ödendi olarak işaretle'}
            >
              {payment.is_paid ? (
                <CheckCircleIconSolid className="w-6 h-6" />
              ) : (
                <CheckCircleIcon className="w-6 h-6" />
              )}
            </button>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center space-x-1"
            >
              <button
                onClick={handleShare}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                title="WhatsApp'ta paylaş"
              >
                <ShareIcon className="w-4 h-4" />
              </button>

              <button
                onClick={handleDelete}
                className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Sil"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {payment.title}
        </h3>

        {/* Notes */}
        {payment.notes && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
            {payment.notes}
          </p>
        )}

        {/* Due date and status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {formatDate(payment.due_date)}
            </span>
          </div>
          
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-dark-700">
          <div className="flex items-center space-x-4">
            {/* Reminder time */}
            {payment.reminder_time && (
              <div className="flex items-center space-x-1">
                <ClockIcon className="w-3 h-3" />
                <span>Hatırlatma: {formatRelativeDate(payment.reminder_time)}</span>
              </div>
            )}

            {/* Receipt indicator */}
            {payment.receipt_url && (
              <div className="flex items-center space-x-1">
                <DocumentIcon className="w-3 h-3" />
                <span>Fiş mevcut</span>
              </div>
            )}
          </div>

          {/* Payment status badge */}
          <div className="flex items-center space-x-1">
            {payment.is_paid ? (
              <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                <CheckCircleIconSolid className="w-3 h-3" />
                <span className="font-medium">Ödendi</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <XCircleIcon className="w-3 h-3 text-red-500" />
                <span className="font-medium text-red-600 dark:text-red-400">
                  Ödenmedi
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Edit button overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.15 }}
          className="absolute top-2 right-2"
        >
          <button
            onClick={handleEdit}
            className="p-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors"
            title="Düzenle"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Overdue warning */}
        {isOverdue && (
          <div className="absolute -top-1 -right-1">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
    </motion.div>
  );
}