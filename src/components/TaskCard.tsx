import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Edit3, 
  Trash2, 
  AlertCircle, 
  Clock, 
  Briefcase, 
  User, 
  GraduationCap, 
  Heart, 
  DollarSign, 
  Folder,
  ChevronDown,
  ChevronUp,
  MoreVertical
} from 'lucide-react';
import { Task, TaskPriority, TaskCategory, TaskStatus } from '../types/index.ts';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (task: Task) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => Promise<void>;
}

const CATEGORY_META: Record<TaskCategory, { label: string; icon: React.ReactNode; bg: string; text: string }> = {
  work: { label: 'Work', icon: <Briefcase className="w-3 h-3" />, bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700' },
  personal: { label: 'Personal', icon: <User className="w-3 h-3" />, bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
  study: { label: 'Study', icon: <GraduationCap className="w-3 h-3" />, bg: 'bg-violet-50 border-violet-200', text: 'text-violet-700' },
  health: { label: 'Health', icon: <Heart className="w-3 h-3" />, bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700' },
  finance: { label: 'Finance', icon: <DollarSign className="w-3 h-3" />, bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
  other: { label: 'Other', icon: <Folder className="w-3 h-3" />, bg: 'bg-slate-50 border-slate-200', text: 'text-slate-700' },
};

const PRIORITY_META: Record<TaskPriority, { label: string; color: string; badge: string }> = {
  urgent: { label: 'Urgent', color: 'bg-rose-500', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
  high: { label: 'High', color: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  medium: { label: 'Medium', color: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  low: { label: 'Low', color: 'bg-slate-400', badge: 'bg-slate-50 text-slate-600 border-slate-200' },
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [isToggling, setIsToggling] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const isCompleted = task.status === 'completed';
  const categoryInfo = CATEGORY_META[task.category] || CATEGORY_META.other;
  const priorityInfo = PRIORITY_META[task.priority] || PRIORITY_META.medium;

  const handleToggle = async () => {
    if (isToggling) return;
    setIsToggling(true);
    try {
      if (!isCompleted) {
        // Trigger celebratory confetti on task completion
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#4f46e5', '#10b981', '#f59e0b', '#3b82f6'],
          });
        } catch {
          // Ignore if canvas is unsupported
        }
      }
      await onToggleComplete(task);
    } finally {
      setIsToggling(false);
    }
  };

  // Due date formatting & calculation
  const getDueDateLabel = () => {
    if (!task.dueDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);

    const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (isCompleted) {
      return {
        text: `Due ${due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`,
        isOverdue: false,
        className: 'text-slate-400 bg-slate-50 border-slate-200',
      };
    }

    if (diffDays < 0) {
      return {
        text: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''}`,
        isOverdue: true,
        className: 'text-rose-700 bg-rose-50 border-rose-200 font-semibold',
      };
    } else if (diffDays === 0) {
      return {
        text: 'Due Today',
        isOverdue: false,
        className: 'text-amber-700 bg-amber-50 border-amber-200 font-semibold',
      };
    } else if (diffDays === 1) {
      return {
        text: 'Due Tomorrow',
        isOverdue: false,
        className: 'text-blue-700 bg-blue-50 border-blue-200',
      };
    } else {
      return {
        text: `Due ${due.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: due.getFullYear() !== today.getFullYear() ? 'numeric' : undefined })}`,
        isOverdue: false,
        className: 'text-slate-600 bg-slate-50 border-slate-200',
      };
    }
  };

  const dueDateLabel = getDueDateLabel();

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-200 p-4 sm:p-5 shadow-2xs hover:shadow-md ${
        isCompleted
          ? 'border-slate-200/80 bg-slate-50/50 opacity-90'
          : task.priority === 'urgent'
          ? 'border-rose-200/90 hover:border-rose-300'
          : 'border-slate-200 hover:border-indigo-300'
      }`}
    >
      <div className="flex items-start gap-3.5">
        
        {/* Completion Checkbox Button */}
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className="mt-0.5 shrink-0 text-slate-300 hover:text-emerald-600 transition-colors cursor-pointer disabled:opacity-50"
          title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-50" />
          ) : (
            <Circle className="w-6 h-6 hover:text-indigo-600 transition-colors" />
          )}
        </button>

        {/* Center content */}
        <div className="flex-1 min-w-0">
          
          {/* Header metadata row */}
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {/* Priority Badge */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${priorityInfo.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${priorityInfo.color}`} />
              {priorityInfo.label}
            </span>

            {/* Category Badge */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${categoryInfo.bg} ${categoryInfo.text}`}
            >
              {categoryInfo.icon}
              {categoryInfo.label}
            </span>

            {/* Status pill (Interactive quick change) */}
            <div className="relative inline-block">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border transition-colors ${
                  task.status === 'completed'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : task.status === 'in_progress'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
                title="Click to quickly switch status"
              >
                <span>
                  {task.status === 'completed'
                    ? 'Completed'
                    : task.status === 'in_progress'
                    ? 'In Progress'
                    : 'To Do'}
                </span>
                <ChevronDown className="w-2.5 h-2.5 opacity-60" />
              </button>

              {showStatusMenu && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setShowStatusMenu(false)} />
                  <div className="absolute left-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-30 text-xs">
                    <button
                      onClick={() => {
                        setShowStatusMenu(false);
                        onStatusChange(task.id, 'todo');
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700"
                    >
                      To Do
                    </button>
                    <button
                      onClick={() => {
                        setShowStatusMenu(false);
                        onStatusChange(task.id, 'in_progress');
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-blue-700 font-medium"
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => {
                        setShowStatusMenu(false);
                        onStatusChange(task.id, 'completed');
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-emerald-700 font-medium"
                    >
                      Completed
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Due date tag */}
            {dueDateLabel && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] border ${dueDateLabel.className}`}
              >
                {dueDateLabel.isOverdue ? (
                  <AlertCircle className="w-3 h-3 text-rose-600" />
                ) : (
                  <Calendar className="w-3 h-3" />
                )}
                {dueDateLabel.text}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className={`text-base font-semibold text-slate-900 leading-snug break-words ${
              isCompleted ? 'line-through text-slate-400' : ''
            }`}
          >
            {task.title}
          </h3>

          {/* Description / Notes */}
          {task.description && (
            <div className="mt-1.5">
              <p
                className={`text-xs text-slate-600 break-words whitespace-pre-line ${
                  isExpanded ? '' : 'line-clamp-2'
                }`}
              >
                {task.description}
              </p>
              {task.description.length > 120 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                >
                  {isExpanded ? (
                    <>Show less <ChevronUp className="w-3 h-3" /></>
                  ) : (
                    <>Show more <ChevronDown className="w-3 h-3" /></>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Creation date note */}
          <div className="mt-2.5 flex items-center gap-2 text-[10px] text-slate-400">
            <Clock className="w-3 h-3" />
            <span>
              Added {new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
            {task.completedAt && (
              <>
                <span>&bull;</span>
                <span className="text-emerald-600 font-medium">
                  Completed {new Date(task.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </>
            )}
          </div>

        </div>

        {/* Actions (Edit / Delete) */}
        <div className="flex items-center gap-1 shrink-0 self-start sm:opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            title="Edit task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
