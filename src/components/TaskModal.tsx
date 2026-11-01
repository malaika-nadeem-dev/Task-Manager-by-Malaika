import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Calendar, 
  Tag, 
  Flag, 
  FileText, 
  Layers,
  AlertCircle
} from 'lucide-react';
import { Task, TaskPriority, TaskCategory, TaskStatus } from '../types/index.ts';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    priority: TaskPriority;
    category: TaskCategory;
    dueDate?: string;
    status?: TaskStatus;
  }) => Promise<void>;
  initialTask?: Task | null;
}

const CATEGORIES: { label: string; value: TaskCategory }[] = [
  { label: 'Work', value: 'work' },
  { label: 'Personal', value: 'personal' },
  { label: 'Study', value: 'study' },
  { label: 'Health', value: 'health' },
  { label: 'Finance', value: 'finance' },
  { label: 'Other', value: 'other' },
];

const PRIORITIES: { label: string; value: TaskPriority; desc: string; color: string }[] = [
  { label: 'Urgent', value: 'urgent', desc: 'Critical, immediate action', color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { label: 'High', value: 'high', desc: 'Important deadline', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { label: 'Medium', value: 'medium', desc: 'Standard task', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { label: 'Low', value: 'low', desc: 'Someday / nice to have', color: 'text-slate-600 bg-slate-50 border-slate-200' },
];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState<TaskCategory>('personal');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setPriority(initialTask.priority || 'medium');
      setCategory(initialTask.category || 'personal');
      setDueDate(initialTask.dueDate || '');
      setStatus(initialTask.status || 'todo');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('personal');
      setDueDate('');
      setStatus('todo');
    }
    setError(null);
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setError('Please provide a task title.');
      return;
    }

    if (cleanTitle.length > 140) {
      setError('Title cannot exceed 140 characters.');
      return;
    }

    if (description.length > 1000) {
      setError('Description cannot exceed 1000 characters.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({
        title: cleanTitle,
        description: description.trim() || undefined,
        priority,
        category,
        dueDate: dueDate.trim() || undefined,
        status,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {initialTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p className="text-xs text-slate-500">
              {initialTask ? 'Update details in your Cloud Firestore database' : 'Add a new task with priority and deadline'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-sm">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600" /> Task Title *
              </label>
              <span className={`text-[10px] ${title.length > 130 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                {title.length} / 140
              </span>
            </div>
            <input
              type="text"
              required
              maxLength={140}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Finalize quarterly budget spreadsheet"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Description Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                Description / Notes
              </label>
              <span className={`text-[10px] ${description.length > 950 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                {description.length} / 1000
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={1000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key context, links, or specific acceptance criteria..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-900 placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* Priority Options */}
          <div>
            <label className="font-semibold text-slate-800 text-xs flex items-center gap-1.5 mb-2">
              <Flag className="w-3.5 h-3.5 text-indigo-600" /> Priority Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRIORITIES.map((p) => {
                const isSelected = priority === p.value;
                return (
                  <button
                    type="button"
                    key={p.value}
                    onClick={() => setPriority(p.value)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? `${p.color} ring-2 ring-indigo-500 font-semibold shadow-xs`
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{p.label}</div>
                    <div className="text-[10px] opacity-75 truncate">{p.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Category */}
            <div>
              <label className="font-semibold text-slate-800 text-xs flex items-center gap-1.5 mb-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-600" /> Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status (If editing) */}
            <div>
              <label className="font-semibold text-slate-800 text-xs flex items-center gap-1.5 mb-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" /> Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

          </div>

          {/* Due Date */}
          <div>
            <label className="font-semibold text-slate-800 text-xs flex items-center gap-1.5 mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Due Date (Optional)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs sm:text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md shadow-indigo-100 flex items-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving to Firestore...' : initialTask ? 'Update Task' : 'Save Task'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
