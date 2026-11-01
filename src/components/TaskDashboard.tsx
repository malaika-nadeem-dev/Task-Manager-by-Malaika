import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  ListTodo, 
  AlertTriangle, 
  TrendingUp, 
  Plus,
  Flame
} from 'lucide-react';
import { Task } from '../types/index.ts';

interface TaskDashboardProps {
  tasks: Task[];
  onOpenCreateModal: () => void;
  userName?: string | null;
}

export const TaskDashboard: React.FC<TaskDashboardProps> = ({ 
  tasks, 
  onOpenCreateModal,
  userName 
}) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const pending = tasks.filter((t) => t.status === 'todo').length;
  const urgentPending = tasks.filter(
    (t) => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'completed'
  ).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Abstract background decorative shapes */}
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
        <div className="absolute right-20 -bottom-10 w-36 h-36 rounded-full bg-violet-400/20 blur-lg pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-medium text-indigo-100">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-200" />
              <span>Personal Task Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back{userName ? `, ${userName}` : ''}!
            </h1>
            <p className="text-indigo-100 text-sm leading-relaxed">
              {total === 0
                ? 'Your board is fresh and ready. Create your first task to start organizing your projects with Cloud Firestore.'
                : `You've completed ${completed} of ${total} tasks (${completionRate}%). ${
                    urgentPending > 0
                      ? `You have ${urgentPending} high/urgent priority item${urgentPending > 1 ? 's' : ''} to review.`
                      : 'All priority tasks are in great shape!'
                  }`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onOpenCreateModal}
              className="px-5 py-3 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
            >
              <Plus className="w-5 h-5 text-indigo-600 group-hover:rotate-90 transition-transform duration-200" />
              <span>Create New Task</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {total > 0 && (
          <div className="mt-6 pt-4 border-t border-white/15">
            <div className="flex justify-between items-center text-xs font-medium text-indigo-100 mb-1.5">
              <span>Overall Progress</span>
              <span className="font-bold">{completionRate}% Completed</span>
            </div>
            <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500 ease-out shadow-xs"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Tasks */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tasks</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ListTodo className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{total}</span>
            <span className="text-xs text-slate-500">records</span>
          </div>
        </div>

        {/* Todo / Pending */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{pending}</span>
            <span className="text-xs text-slate-500">to do</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Progress</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{inProgress}</span>
            <span className="text-xs text-slate-500">active</span>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{completed}</span>
            <span className="text-xs text-emerald-600 font-semibold">{completionRate}% done</span>
          </div>
        </div>

      </div>

      {/* Urgent Warning if any */}
      {urgentPending > 0 && (
        <div className="flex items-center gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs sm:text-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>
            <strong>Attention:</strong> You have <strong>{urgentPending}</strong> unfinished task{urgentPending > 1 ? 's' : ''} marked as Urgent or High priority.
          </span>
        </div>
      )}

    </div>
  );
};
