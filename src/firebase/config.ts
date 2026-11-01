import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { OperationType, FirestoreErrorInfo } from '../types/index.ts';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with configured databaseId (CRITICAL constraint)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Provider instance for Google Sign-in
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Test connection on boot per Firebase skill requirements
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection note: client is offline or starting up.');
    }
  }
}
testConnection();

// Standardized error handler conforming to FirestoreErrorInfo
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid ?? null,
      email: auth.currentUser?.email ?? null,
      emailVerified: auth.currentUser?.emailVerified ?? null,
      isAnonymous: auth.currentUser?.isAnonymous ?? null,
      tenantId: auth.currentUser?.tenantId ?? null,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Beginner-friendly error messages
export function formatAuthError(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: string }).code;
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Incorrect email or password. Please verify and try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email address already exists. Please sign in instead.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/popup-closed-by-user':
        return 'Google Sign-In popup was closed before completing.';
      case 'auth/popup-blocked':
        return 'Popup blocked by browser. Please allow popups for this site.';
      case 'auth/operation-not-allowed':
        return 'Email/Password sign-in is not yet enabled in the Firebase Console. You can sign in instantly using Google Sign-In with 1 click!';
      default:
        return (error as { message?: string }).message || 'Authentication error. Please try again.';
    }
  }
  return error instanceof Error ? error.message : 'An unexpected error occurred.';
}

export {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  firebaseConfig,
};
