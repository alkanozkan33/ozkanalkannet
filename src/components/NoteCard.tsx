import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PinIcon,
  ClockIcon,
  TagIcon,
  ShareIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { PinIcon as PinIconSolid } from '@heroicons/react/24/solid';
import type { Note, Checklist } from '../types';
import { formatRelativeDate, getTagColorClasses, shareNote } from '../utils';
import { useApp } from '../context/AppContext';

interface NoteCardProps {
  note: Note;
  checklists?: Checklist[];
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onTogglePin: (noteId: string, isPinned: boolean) => void;
  onAddChecklist?: (noteId: string) => void;
  onToggleChecklistItem?: (checklistId: string, isDone: boolean) => void;
}

export default function NoteCard({
  note,
  checklists = [],
  onEdit,
  onDelete,
  onTogglePin,
  onAddChecklist,
  onToggleChecklistItem,
}: NoteCardProps) {
  const { state } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const tagColorClasses = getTagColorClasses(note.tag_color);

  const completedCount = checklists.filter(item => item.is_done).length;
  const totalCount = checklists.length;
  const hasChecklist = totalCount > 0;
  const completionPercentage = hasChecklist ? (completedCount / totalCount) * 100 : 0;

  const handleShare = () => {
    shareNote(note, state.settings.default_phone);
  };

  const handleTogglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTogglePin(note.id, !note.is_pinned);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(note);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Bu notu silmek istediğinizden emin misiniz?')) {
      onDelete(note.id);
    }
  };

  const handleAddChecklist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddChecklist?.(note.id);
  };

  const handleToggleChecklistItem = (checklistId: string, isDone: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleChecklistItem?.(checklistId, !isDone);
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
        className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-4 cursor-pointer hover:shadow-md transition-all duration-200"
        onClick={handleEdit}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {/* Tag */}
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tagColorClasses.bg} ${tagColorClasses.text} ${tagColorClasses.border} border`}
            >
              <TagIcon className="w-3 h-3 mr-1" />
              {note.tag}
            </span>
            
            {/* Pin indicator */}
            {note.is_pinned && (
              <PinIconSolid className="w-4 h-4 text-amber-500 flex-shrink-0" />
            )}
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center space-x-1"
          >
            <button
              onClick={handleTogglePin}
              className={`p-1.5 rounded-md transition-colors ${
                note.is_pinned
                  ? 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-dark-700'
              }`}
              title={note.is_pinned ? 'Sabitlemeyi kaldır' : 'Sabitle'}
            >
              {note.is_pinned ? (
                <PinIconSolid className="w-4 h-4" />
              ) : (
                <PinIcon className="w-4 h-4" />
              )}
            </button>

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

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {note.title}
        </h3>

        {/* Description */}
        {note.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
            {note.description}
          </p>
        )}

        {/* Checklist */}
        {hasChecklist && (
          <div className="mb-3">
            {/* Progress bar */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {completedCount}/{totalCount} tamamlandı
              </span>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                %{Math.round(completionPercentage)}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-1.5 mb-3">
              <motion.div
                className="bg-green-500 h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Checklist items (show first 3) */}
            <div className="space-y-1">
              {checklists.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-2 text-sm"
                  onClick={(e) => handleToggleChecklistItem(item.id, item.is_done, e)}
                >
                  <button
                    className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                      item.is_done
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 dark:border-dark-600 hover:border-green-400'
                    }`}
                  >
                    {item.is_done && <CheckCircleIcon className="w-3 h-3" />}
                  </button>
                  <span
                    className={`flex-1 ${
                      item.is_done
                        ? 'line-through text-gray-400 dark:text-gray-500'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {item.title}
                  </span>
                </div>
              ))}
              
              {checklists.length > 3 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 pl-6">
                  +{checklists.length - 3} öğe daha...
                </div>
              )}
            </div>

            {/* Add checklist item button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.15 }}
              onClick={handleAddChecklist}
              className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mt-2 transition-colors"
            >
              <PlusIcon className="w-3 h-3" />
              <span>Öğe ekle</span>
            </motion.button>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-gray-100 dark:border-dark-700">
          {/* Reminder time */}
          {note.reminder_time && (
            <div className="flex items-center space-x-1">
              <ClockIcon className="w-3 h-3" />
              <span>{formatRelativeDate(note.reminder_time)}</span>
            </div>
          )}
          
          {/* Created date */}
          <div className="flex items-center space-x-1">
            <span>{formatRelativeDate(note.created_at)}</span>
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
      </div>
    </motion.div>
  );
}