import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, formatAuthError } from '../firebase/config.ts';
import { syncUserProfile } from '../firebase/taskService.ts';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = () => setAuthError(null);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Sync profile to /users/{uid} in background
        await syncUserProfile({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignInWithGoogle = async () => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await syncUserProfile({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        });
      }
    } catch (error) {
      const msg = formatAuthError(error);
      setAuthError(msg);
      throw error;
    }
  };

  const handleSignInWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
    } catch (error) {
      const msg = formatAuthError(error);
      setAuthError(msg);
      throw error;
    }
  };

  const handleRegisterWithEmail = async (email: string, pass: string, displayName: string) => {
    setAuthError(null);
    try {
      const res = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (displayName.trim()) {
        await updateProfile(res.user, {
          displayName: displayName.trim(),
        });
      }
      await syncUserProfile({
        uid: res.user.uid,
        email: res.user.email,
        displayName: displayName.trim() || res.user.email?.split('@')[0] || 'User',
        photoURL: res.user.photoURL,
      });
    } catch (error) {
      const msg = formatAuthError(error);
      setAuthError(msg);
      throw error;
    }
  };

  const handleLogout = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        clearAuthError,
        signInWithGoogle: handleSignInWithGoogle,
        signInWithEmail: handleSignInWithEmail,
        registerWithEmail: handleRegisterWithEmail,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
