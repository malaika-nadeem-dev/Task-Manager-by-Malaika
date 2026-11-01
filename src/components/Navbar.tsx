import React, { useState } from 'react';
import { 
  CheckSquare, 
  LogOut, 
  HelpCircle, 
  User as UserIcon, 
  ShieldCheck, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface NavbarProps {
  onOpenGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenGuide }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <img
            src="/assets/aistudio/first_website-removebg-preview__1__7b41a140.png"
            alt="Malaika Logo"
            className="h-10 sm:h-11 w-auto object-contain shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">My Task Manager</span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Cloud Sync
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">Real-time Firestore &bull; Per-User ABAC Security</p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Beginner Guide Trigger */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors shadow-2xs"
            title="Read beginner guide on Firebase Auth & Security Rules"
          >
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">How It Works</span>
            <span className="sm:hidden">Guide</span>
          </button>

          {/* User profile dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-7 h-7 rounded-full object-cover border border-indigo-200"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-medium text-slate-800 max-w-[120px] truncate hidden md:inline">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowDropdown(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {user.displayName || 'Task Manager User'}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        <ShieldCheck className="w-3 h-3" /> User Access Isolated
                      </div>
                    </div>

                    <div className="px-2 py-1">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          onOpenGuide();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition-colors text-left"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        Firebase Architecture Docs
                      </button>
                      <button
                        onClick={async () => {
                          setShowDropdown(false);
                          await logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
