/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  NariSetu — Firebase Client SDK
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  Initializes the Firebase client SDK for the browser.
 *  Exports auth instance and helper functions.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";

// ── Firebase configuration ──────────────────────────────────
// Values come from Vite environment variables (client/.env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// ── Initialize Firebase ──────────────────────────────────────
let app;
export let auth;
let googleProvider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: "select_account" });
} catch (error) {
  console.error("Firebase Initialization Error:", error);
  console.error("This is likely because the Firebase environment variables are missing or have placeholder values.");
}

// ── Auth helper functions ────────────────────────────────────

/**
 * Sign in with Google via popup.
 */
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

/**
 * Sign in with email and password.
 */
export const signInWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

/**
 * Create a new account with email and password.
 * Optionally sets a display name.
 */
export const registerWithEmail = async (email, password, displayName) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(result.user, { displayName });
  }
  return result;
};

/**
 * Send a password reset email.
 */
export const resetPassword = (email) => sendPasswordResetEmail(auth, email);

/**
 * Sign out the current user.
 */
export const logOut = () => signOut(auth);

/**
 * Get the current user's ID token (for API authorization).
 * Returns null if no user is signed in.
 */
export const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
};

/**
 * Subscribe to auth state changes.
 */
export { onAuthStateChanged };
