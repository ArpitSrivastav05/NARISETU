/**
 * ProtectedRoute — Redirects unauthenticated users to /login.
 * Wrap any Route element with this to require authentication.
 */
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { currentUser, userProfile } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    // Preserve the attempted URL so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user profile is loaded but they have no role selected yet, force onboarding
  if (userProfile && !userProfile.role && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  // If user profile has a role, don't let them visit onboarding
  if (userProfile && userProfile.role && location.pathname === "/onboarding") {
    return <Navigate to="/" replace />;
  }

  return children;
}
