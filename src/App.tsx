/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ListTodo, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X,
  Loader2,
  FolderOpen
} from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { TaskDashboard } from './components/TaskDashboard.tsx';
import { TaskFilters } from './components/TaskFilters.tsx';
import { TaskCard } from './components/TaskCard.tsx';
import { TaskModal } from './components/TaskModal.tsx';
import { DeleteConfirmModal } from './components/DeleteConfirmModal.tsx';
import { BeginnerGuideModal } from './components/BeginnerGuideModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { 
  Task, 
  FilterOptions, 
  TaskPriority, 
  TaskStatus, 
  TaskCategory 
} from './types/index.ts';
import { 
  subscribeToUserTasks, 
  createTask, 
  updateTask, 
  toggleTaskComplete, 
  deleteTask 
} from './firebase/taskService.ts';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

const MainApp: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSyncing, setIsSyncing] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Filters state
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    status: 'all',
    priority: 'all',
    category: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Subscribe to real-time Firestore updates
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setIsSyncing(false);
      return;
    }

    setIsSyncing(true);
    setSyncError(null);

    const unsubscribe = subscribeToUserTasks(
      user.uid,
      (fetchedTasks) => {
        setTasks(fetchedTasks);
        setIsSyncing(false);
      },
      (err) => {
        console.error('Firestore listener error:', err);
        setSyncError('Could not sync tasks from Firestore. Please verify your connection.');
        setIsSyncing(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Handler: Create task
  const handleCreateTask = async (data: {
    title: string;
    description?: string;
    priority: TaskPriority;
    category: TaskCategory;
    dueDate?: string;
    status?: TaskStatus;
  }) => {
    if (!user) return;
    try {
      await createTask(user.uid, data);
      addToast('success', 'Task created in Cloud Firestore.');
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to create task.');
      throw err;
    }
  };

  // Handler: Update task
  const handleUpdateTask = async (data: {
    title: string;
    description?: string;
    priority: TaskPriority;
    category: TaskCategory;
    dueDate?: string;
    status?: TaskStatus;
  }) => {
    if (!editingTask) return;
    try {
      await updateTask(editingTask.id, data);
      addToast('success', 'Task updated successfully.');
      setEditingTask(null);
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to update task.');
      throw err;
    }
  };

  // Handler: Toggle completion
  const handleToggleComplete = async (task: Task) => {
    try {
      await toggleTaskComplete(task);
      if (task.status !== 'completed') {
        addToast('success', 'Great job! Task marked as completed.');
      } else {
        addToast('info', 'Task reopened to "To Do".');
      }
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to update status.');
    }
  };

  // Handler: Quick status change
  const handleQuickStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      addToast('info', `Status updated to ${newStatus.replace('_', ' ')}.`);
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to update status.');
    }
  };

  // Handler: Delete task
  const handleConfirmDelete = async () => {
    if (!deletingTaskId) return;
    try {
      await deleteTask(deletingTaskId);
      addToast('success', 'Task permanently deleted.');
      setDeletingTaskId(null);
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to delete task.');
    }
  };

  // Filter & sort logic
  const filteredTasks = tasks.filter((task) => {
    // Search
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(q);
      const descMatch = task.description?.toLowerCase().includes(q);
      if (!titleMatch && !descMatch) return false;
    }

    // Status
    if (filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }

    // Priority
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }

    // Category
    if (filters.category !== 'all' && task.category !== filters.category) {
      return false;
    }

    return true;
  });

  // Sorting
  filteredTasks.sort((a, b) => {
    if (filters.sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }
    if (filters.sortBy === 'priority') {
      const priorityOrder: Record<TaskPriority, number> = {
        urgent: 4,
        high: 3,
        medium: 2,
        low: 1,
      };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (filters.sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    // Default: newest createdAt first
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // If initial auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100 animate-pulse mb-4">
          <ListTodo className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-slate-700">Connecting to Firebase...</p>
        <p className="text-xs text-slate-400 mt-1">Verifying authentication & security permissions</p>
      </div>
    );
  }

  // If user is not logged in
  if (!user) {
    return (
      <>
        <AuthModal onOpenGuide={() => setIsGuideOpen(true)} />
        <BeginnerGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      </>
    );
  }

  const deletingTaskObject = tasks.find((t) => t.id === deletingTaskId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl shadow-lg border text-xs sm:text-sm flex items-center gap-2.5 transition-all animate-in slide-in-from-bottom-2 ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-800'
                : toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-800'
                : 'bg-slate-900 text-white border-slate-800'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-sky-300 shrink-0" />}
            <span className="flex-1 font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/70 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Navigation Header */}
      <Navbar onOpenGuide={() => setIsGuideOpen(true)} />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        
        {/* Sync Error Alert if any */}
        {syncError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs sm:text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{syncError}</span>
            </div>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-rose-700 underline font-semibold ml-2 hover:text-rose-900"
            >
              Setup details
            </button>
          </div>
        )}

        {/* Dashboard Metrics */}
        <TaskDashboard
          tasks={tasks}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          userName={user.displayName || user.email?.split('@')[0]}
        />

        {/* Filters, Search & Sort */}
        <TaskFilters
          filters={filters}
          onFilterChange={setFilters}
          tasks={tasks}
        />

        {/* Tasks List Section */}
        <div className="space-y-3">
          
          {/* Header count label */}
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <span>Tasks</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
                {filteredTasks.length}
              </span>
            </h2>

            {isSyncing && (
              <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                Syncing Firestore...
              </span>
            )}
          </div>

          {/* List items */}
          {filteredTasks.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={(t) => setEditingTask(t)}
                  onDelete={(id) => setDeletingTaskId(id)}
                  onStatusChange={handleQuickStatusChange}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center shadow-2xs">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {tasks.length === 0 ? 'No tasks yet' : 'No matching tasks'}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                {tasks.length === 0
                  ? 'Get started by creating your first task. It will be stored in your Cloud Firestore database instantly.'
                  : 'Try adjusting your search query, priority filter, or category pills to view your tasks.'}
              </p>
              <div className="mt-5">
                {tasks.length === 0 ? (
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md shadow-indigo-100 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create My First Task</span>
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      setFilters({
                        searchQuery: '',
                        status: 'all',
                        priority: 'all',
                        category: 'all',
                        sortBy: 'createdAt',
                        sortOrder: 'desc',
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                  >
                    <span>Clear All Filters</span>
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

      </main>

      {/* Floating Action Button on Mobile */}
      <div className="fixed bottom-6 right-6 sm:hidden z-30">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-400/50 hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer"
          title="Create task"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Create Task Modal */}
      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        initialTask={null}
      />

      {/* Edit Task Modal */}
      <TaskModal
        isOpen={editingTask !== null}
        onClose={() => setEditingTask(null)}
        onSubmit={handleUpdateTask}
        initialTask={editingTask}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deletingTaskId !== null}
        onClose={() => setDeletingTaskId(null)}
        onConfirm={handleConfirmDelete}
        taskTitle={deletingTaskObject?.title}
      />

      {/* Beginner & Architecture Guide Modal */}
      <BeginnerGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
