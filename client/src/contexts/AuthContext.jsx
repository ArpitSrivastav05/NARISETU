/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  NariSetu — Authentication Context
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  Provides global auth state and sign-in/out functions
 *  to the entire React component tree.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  auth,
  signInWithGoogle as firebaseSignInWithGoogle,
  signInWithEmail,
  registerWithEmail,
  resetPassword,
  logOut,
  onAuthStateChanged,
} from "../services/firebase";

const API_URL = import.meta.env.VITE_API_URL || "https://narisetu-j9ac.onrender.com";

// ── Context creation ─────────────────────────────────────────
const AuthContext = createContext(null);

// ── Provider component ───────────────────────────────────────
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null); // Firestore profile
  const [loading, setLoading] = useState(true); // true until first auth check completes

  // ── Create or update user document in Firestore ────────────
  const syncUserToFirestore = useCallback(async (firebaseUser) => {
    if (!firebaseUser) return;
    try {
      const token = await firebaseUser.getIdToken();
      await fetch(`${API_URL}/api/user/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: firebaseUser.displayName || "NariSetu User",
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL || "",
        }),
      });
    } catch (err) {
      // Non-fatal — user can still use the app
      console.warn("Could not sync user profile to Firestore:", err.message);
    }
  }, []);

  // ── Fetch Firestore profile ────────────────────────────────
  const fetchUserProfile = useCallback(async (firebaseUser) => {
    if (!firebaseUser) {
      setUserProfile(null);
      return;
    }
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(`${API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) setUserProfile(data.data);
      }
    } catch (err) {
      console.warn("Could not load user profile:", err.message);
    }
  }, []);

  // ── Listen to Firebase auth state ──────────────────────────
  useEffect(() => {
    if (!auth) {
      console.warn("Firebase Auth is not initialized. Please check your environment variables.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setCurrentUser(firebaseUser);
      if (firebaseUser) {
        await syncUserToFirestore(firebaseUser);
        await fetchUserProfile(firebaseUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe; // cleanup on unmount
  }, [syncUserToFirestore, fetchUserProfile]);

  // ── Public auth functions ──────────────────────────────────

  const signInWithGoogle = async () => {
    const result = await firebaseSignInWithGoogle();
    return result;
  };

  const signUp = async (email, password, displayName) => {
    const result = await registerWithEmail(email, password, displayName);
    return result;
  };

  const signIn = async (email, password) => {
    const result = await signInWithEmail(email, password);
    return result;
  };

  const logout = async () => {
    await logOut();
    setUserProfile(null);
  };

  const forgotPassword = async (email) => {
    await resetPassword(email);
  };

  /**
   * Get a fresh auth token for API calls.
   * Returns null if no user is signed in.
   */
  const getToken = async () => {
    if (!currentUser) return null;
    return currentUser.getIdToken();
  };

  /**
   * Helper: returns headers with Authorization for fetch calls.
   */
  const authHeaders = async () => {
    const token = await getToken();
    if (!token) return { "Content-Type": "application/json" };
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  /**
   * Refresh the local user profile from Firestore.
   */
  const refreshProfile = () => fetchUserProfile(currentUser);

  const value = {
    currentUser,
    userProfile,
    loading,
    signInWithGoogle,
    signUp,
    signIn,
    logout,
    forgotPassword,
    getToken,
    authHeaders,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Don't render children until the first auth check is complete */}
      {!loading && children}
      {/* Full-screen splash while Firebase resolves auth state */}
      {loading && (
        <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
          <div className="text-center space-y-4">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-2xl shadow-lg">
              🌸
            </div>
            <div className="h-8 w-8 border-3 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-500 font-semibold">Loading NariSetu…</p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

// ── Custom hook ──────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}
