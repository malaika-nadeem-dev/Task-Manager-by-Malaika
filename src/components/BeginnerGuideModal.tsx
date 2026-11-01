import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Database, 
  KeyRound, 
  Sparkles, 
  CreditCard, 
  CheckCircle2, 
  ExternalLink,
  Lock,
  Layers,
  HelpCircle
} from 'lucide-react';
import { firebaseConfig } from '../firebase/config.ts';

interface BeginnerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BeginnerGuideModal: React.FC<BeginnerGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'auth' | 'firestore' | 'security' | 'pricing'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Firebase Beginner & Architecture Guide</h2>
              <p className="text-xs text-slate-500">How Firebase Authentication, Firestore, and Security Rules protect your tasks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white overflow-x-auto px-6 gap-2 pt-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" /> 1. Overview
          </button>
          <button
            onClick={() => setActiveTab('auth')}
            className={`pb-3 px-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'auth'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-4 h-4" /> 2. Authentication
          </button>
          <button
            onClick={() => setActiveTab('firestore')}
            className={`pb-3 px-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'firestore'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" /> 3. Cloud Firestore
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 px-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> 4. Security Rules
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`pb-3 px-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'pricing'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" /> 5. Free Tier Guarantee
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm leading-relaxed">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                <h3 className="font-semibold text-indigo-950 text-base mb-1 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  What is Firebase?
                </h3>
                <p className="text-indigo-900 text-sm">
                  Firebase is a <strong>Backend-as-a-Service (BaaS)</strong> provided by Google. In traditional web development, you had to provision Linux servers, set up relational databases, manage password hashing, and configure web socket daemons. With Firebase, Google handles the cloud infrastructure so you can build secure full-stack applications with React directly.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-colors">
                  <KeyRound className="w-6 h-6 text-indigo-600 mb-2" />
                  <h4 className="font-semibold text-slate-900">Firebase Auth</h4>
                  <p className="text-xs text-slate-600 mt-1">Handles registration, sign-in tokens, session cookies, and Google OAuth with zero password leaks.</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-colors">
                  <Database className="w-6 h-6 text-emerald-600 mb-2" />
                  <h4 className="font-semibold text-slate-900">Cloud Firestore</h4>
                  <p className="text-xs text-slate-600 mt-1">A real-time NoSQL document database that persists your tasks across all devices in sub-seconds.</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-colors">
                  <ShieldCheck className="w-6 h-6 text-violet-600 mb-2" />
                  <h4 className="font-semibold text-slate-900">Security Rules</h4>
                  <p className="text-xs text-slate-600 mt-1">Server-enforced firewall checking every single read, write, and delete against your user ID.</p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-600" />
                  Active Configuration for This Applet
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-600">
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-400 block font-sans">Project ID:</span>
                    <span className="text-indigo-600 font-semibold">{firebaseConfig.projectId}</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-400 block font-sans">Database ID:</span>
                    <span className="text-slate-800 break-all">{firebaseConfig.firestoreDatabaseId}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'auth' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 text-base">Step 1: How Authentication Works</h3>
              <p>
                Authentication verifies <em>who</em> a user is. When you sign in with Google or Email/Password:
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <strong>Handshake & Verification:</strong> Google validates your identity in a secure popup. Your password never touches our client code or app server.
                </li>
                <li>
                  <strong>JWT Security Token:</strong> Firebase issues a cryptographically signed JSON Web Token (JWT) with a unique <code className="bg-slate-100 text-indigo-700 px-1 py-0.5 rounded">UID</code> (User ID).
                </li>
                <li>
                  <strong>Session Persistence:</strong> Firebase automatically stores this session securely in browser IndexedDB/LocalStorage, so you stay logged in when refreshing the page.
                </li>
                <li>
                  <strong>Token Injection:</strong> Every Firestore database request automatically includes this JWT token in the background so the database knows exactly who is making the request.
                </li>
              </ol>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900 text-xs">
                <strong>Beginner Tip:</strong> Google Sign-In is pre-configured and works immediately without any extra setup. If you use Email/Password, make sure it is toggled on in the Firebase Console under Authentication &gt; Sign-in method.
              </div>
            </div>
          )}

          {activeTab === 'firestore' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 text-base">Step 2: How Cloud Firestore Stores Tasks</h3>
              <p>
                Cloud Firestore is a <strong>document-based NoSQL database</strong>. Instead of SQL tables and foreign keys, Firestore organizes data into:
              </p>
              
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-semibold text-slate-900">📁 Collections:</span> Containers of records (e.g., <code className="bg-white px-1.5 py-0.5 border rounded text-indigo-600">tasks</code>).
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-semibold text-slate-900">📄 Documents:</span> Individual records (e.g., <code className="bg-white px-1.5 py-0.5 border rounded text-indigo-600">tasks/task_xyz123</code>). Each document holds key-value pairs like <code className="text-slate-600 font-mono">title</code>, <code className="text-slate-600 font-mono">status</code>, <code className="text-slate-600 font-mono">priority</code>, and <code className="text-slate-600 font-mono">userId</code>.
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <h4 className="font-semibold text-emerald-900 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Real-time Synchronization with onSnapshot
                </h4>
                <p className="text-xs text-emerald-800">
                  Unlike traditional REST APIs where you have to manually refresh the page or poll every few seconds, our app uses Firestore&apos;s <code className="bg-white/70 px-1 rounded font-mono">onSnapshot()</code> listener. The moment a task is created or marked complete on one device, it reflects across all your devices in milliseconds over WebSockets!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 text-base">Step 3: Strict Per-User Access Controls</h3>
              <p>
                <strong>Never trust the frontend alone!</strong> A tech-savvy user can open browser developer tools and modify JavaScript code. That is why Firebase provides <strong>Cloud Firestore Security Rules</strong> that run on Google&apos;s servers.
              </p>

              <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto space-y-1">
                <div className="text-slate-400">// Inside firestore.rules:</div>
                <div><span className="text-purple-400">match</span> /tasks/{'{taskId}'} {'{'}</div>
                <div className="pl-4 text-emerald-400">// Only return tasks where userId matches the signed-in user</div>
                <div className="pl-4"><span className="text-purple-400">allow</span> <span className="text-amber-300">list</span>: <span className="text-purple-400">if</span> isSignedIn() &amp;&amp; resource.data.userId == request.auth.uid;</div>
                <div className="pl-4 text-emerald-400">// Block attempts to create tasks for someone else</div>
                <div className="pl-4"><span className="text-purple-400">allow</span> <span className="text-amber-300">create</span>: <span className="text-purple-400">if</span> isSignedIn() &amp;&amp; incoming().userId == request.auth.uid;</div>
                <div className="pl-4 text-emerald-400">// Forbid modifying another user&apos;s task or altering ownership</div>
                <div className="pl-4"><span className="text-purple-400">allow</span> <span className="text-amber-300">update, delete</span>: <span className="text-purple-400">if</span> isSignedIn() &amp;&amp; resource.data.userId == request.auth.uid;</div>
                <div>{'}'}</div>
              </div>

              <p className="text-xs text-slate-600">
                These rules were deployed to your project via Google AI Studio and guarantee that User A can NEVER view, edit, or delete tasks belonging to User B.
              </p>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <h3 className="font-semibold text-emerald-950 text-base mb-1 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  100% Free - No Credit Card or Billing Required!
                </h3>
                <p className="text-emerald-900 text-sm">
                  As requested in your brief: <strong>No paid APIs or services are used. Billing is not enabled, and no payment card is requested.</strong>
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">What is included in the free Firebase Spark Plan?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="font-bold text-slate-800 block text-sm mb-1">50,000 Reads / day</span>
                    More than enough for thousands of daily task syncs.
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="font-bold text-slate-800 block text-sm mb-1">20,000 Writes / day</span>
                    Create, update, and complete tasks freely.
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="font-bold text-slate-800 block text-sm mb-1">1 GB Stored Data</span>
                    Can store hundreds of thousands of text tasks.
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="font-bold text-slate-800 block text-sm mb-1">Unlimited Authentication</span>
                    Free Google Sign-In and Email authentication for all users.
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600">
                <p>
                  <strong>Quota reset:</strong> If you ever test heavily and hit the daily free limit, the quota automatically resets the next day at midnight Pacific Time at zero charge.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-emerald-600" /> End-to-end user isolation active
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-xs"
          >
            Got it, Let&apos;s Build!
          </button>
        </div>

      </div>
    </div>
  );
};
