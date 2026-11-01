import React from 'react';
import { 
  Search, 
  X, 
  ArrowUpDown, 
  Filter,
  Tag,
  Briefcase,
  User,
  GraduationCap,
  Heart,
  DollarSign,
  Folder
} from 'lucide-react';
import { FilterOptions, TaskStatus, TaskPriority, TaskCategory, Task } from '../types/index.ts';

interface TaskFiltersProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
  tasks: Task[];
}

const CATEGORIES: { label: string; value: TaskCategory | 'all'; icon: React.ReactNode }[] = [
  { label: 'All Categories', value: 'all', icon: <Tag className="w-3.5 h-3.5" /> },
  { label: 'Work', value: 'work', icon: <Briefcase className="w-3.5 h-3.5" /> },
  { label: 'Personal', value: 'personal', icon: <User className="w-3.5 h-3.5" /> },
  { label: 'Study', value: 'study', icon: <GraduationCap className="w-3.5 h-3.5" /> },
  { label: 'Health', value: 'health', icon: <Heart className="w-3.5 h-3.5" /> },
  { label: 'Finance', value: 'finance', icon: <DollarSign className="w-3.5 h-3.5" /> },
  { label: 'Other', value: 'other', icon: <Folder className="w-3.5 h-3.5" /> },
];

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onFilterChange,
  tasks,
}) => {
  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchQuery: e.target.value });
  };

  const handleStatusChange = (status: TaskStatus | 'all') => {
    onFilterChange({ ...filters, status });
  };

  const handleCategoryChange = (category: TaskCategory | 'all') => {
    onFilterChange({ ...filters, category });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, priority: e.target.value as TaskPriority | 'all' });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, sortBy: e.target.value as FilterOptions['sortBy'] });
  };

  const resetFilters = () => {
    onFilterChange({
      searchQuery: '',
      status: 'all',
      priority: 'all',
      category: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.category !== 'all';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
      
      {/* Top row: Search input + Priority filter + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder="Search tasks by title or notes..."
            className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-900 placeholder:text-slate-400"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-auto">
            <select
              value={filters.priority}
              onChange={handlePriorityChange}
              className="w-full sm:w-auto text-xs py-2 pl-3 pr-8 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">🔴 Urgent</option>
              <option value="high">🟠 High</option>
              <option value="medium">🔵 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="relative w-full sm:w-auto">
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="w-full sm:w-auto text-xs py-2 pl-3 pr-8 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
            >
              <option value="createdAt">Sort: Newest First</option>
              <option value="dueDate">Sort: Due Date</option>
              <option value="priority">Sort: Highest Priority</option>
              <option value="title">Sort: Alphabetical</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors shrink-0"
              title="Reset all active filters"
            >
              Reset
            </button>
          )}
        </div>

      </div>

      {/* Middle row: Status Tabs */}
      <div className="flex border-b border-slate-200 gap-1 sm:gap-4 overflow-x-auto scrollbar-none pb-1">
        <button
          onClick={() => handleStatusChange('all')}
          className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
            filters.status === 'all'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <span>All Tasks</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
            filters.status === 'all' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {counts.all}
          </span>
        </button>

        <button
          onClick={() => handleStatusChange('todo')}
          className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
            filters.status === 'todo'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <span>To Do</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
            filters.status === 'todo' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {counts.todo}
          </span>
        </button>

        <button
          onClick={() => handleStatusChange('in_progress')}
          className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
            filters.status === 'in_progress'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <span>In Progress</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
            filters.status === 'in_progress' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {counts.in_progress}
          </span>
        </button>

        <button
          onClick={() => handleStatusChange('completed')}
          className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
            filters.status === 'completed'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <span>Completed</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
            filters.status === 'completed' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {counts.completed}
          </span>
        </button>
      </div>

      {/* Bottom row: Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Category:
        </span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategoryChange(cat.value)}
            className={`px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 shrink-0 border ${
              filters.category === cat.value
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs font-semibold'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

    </div>
  );
};
