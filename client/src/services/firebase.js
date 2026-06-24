/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  NariSetu — Firebase Client SDK
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  Initializes the Firebase client SDK for the browser.
 *  Exports auth instance and helper functions.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { initializeApp, getApps } from "firebase/app";
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

// ── Sanitize env value (strip accidental quotes / whitespace) ─
const clean = (val) => (val ? val.replace(/^[\s"']+|[\s"']+$/g, "") : "");

// ── Firebase configuration ──────────────────────────────────
const firebaseConfig = {
  apiKey:            clean(import.meta.env.VITE_FIREBASE_API_KEY)              || "AIzaSyAWl6ZJ1iahOWYWR5BF6ffl8X-_3F68cf4",
  authDomain:        clean(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN)          || "narisetu-d0a23.firebaseapp.com",
  projectId:         clean(import.meta.env.VITE_FIREBASE_PROJECT_ID)           || "narisetu-d0a23",
  storageBucket:     clean(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET)      || "narisetu-d0a23.firebasestorage.app",
  messagingSenderId: clean(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID) || "894145370079",
  appId:             clean(import.meta.env.VITE_FIREBASE_APP_ID)              || "1:894145370079:web:515dcb5e761bf589b6d66a",
};

// ── Initialize Firebase (prevent duplicate app on hot-reload) ─
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// ── Auth instance ────────────────────────────────────────────
export const auth = getAuth(app);

// ── Google Auth Provider ─────────────────────────────────────
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

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
