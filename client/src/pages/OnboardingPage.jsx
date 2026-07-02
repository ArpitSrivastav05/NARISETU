import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "https://narisetu-j9ac.onrender.com";

export default function OnboardingPage() {
  const { authHeaders, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setError("");
  };

  const handleConfirm = async () => {
    if (!selectedRole) {
      setError("Please choose how you would like to use NariSetu.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_URL}/api/user/profile`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ role: selectedRole }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save profile role.");
      }

      await refreshProfile();
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative">
        <button
          onClick={handleLogout}
          className="absolute top-6 right-6 text-xs text-slate-400 hover:text-rose-400 font-semibold transition cursor-pointer"
        >
          🚪 Sign Out
        </button>

        <div className="text-center max-w-md mx-auto mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-2xl shadow-blue-500/30 mb-4">
            <span className="text-3xl">🌸</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome to NariSetu
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Let's customize your workspace. How would you like to use NariSetu?
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-300 text-sm font-medium flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {/* Buyer option */}
          <div
            onClick={() => handleSelectRole("buyer")}
            className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 flex flex-col items-center text-center ${
              selectedRole === "buyer"
                ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                : "border-white/10 hover:border-white/20 bg-white/5"
            }`}
          >
            <span className="text-4xl mb-4">🛍️</span>
            <h3 className="text-base font-bold text-white mb-2">Buyer / User</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Find and apply for government schemes, browse handmade crafts and products, and manage records.
            </p>
          </div>

          {/* Seller option */}
          <div
            onClick={() => handleSelectRole("seller")}
            className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 flex flex-col items-center text-center ${
              selectedRole === "seller"
                ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                : "border-white/10 hover:border-white/20 bg-white/5"
            }`}
          >
            <span className="text-4xl mb-4">💼</span>
            <h3 className="text-base font-bold text-white mb-2">Seller / Artisan</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Register your business, cooperative, or craft, publish product listings, and connect with customers.
            </p>
          </div>

          {/* Both option */}
          <div
            onClick={() => handleSelectRole("both")}
            className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 flex flex-col items-center text-center ${
              selectedRole === "both"
                ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                : "border-white/10 hover:border-white/20 bg-white/5"
            }`}
          >
            <span className="text-4xl mb-4">🌟</span>
            <h3 className="text-base font-bold text-white mb-2">Both</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Use all resources — list and sell products while applying for empowerment schemes and tools.
            </p>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={isSubmitting || !selectedRole}
          className="w-full mt-10 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Setting up your workspace…
            </span>
          ) : (
            "Confirm & Launch Dashboard"
          )}
        </button>
      </div>
    </div>
  );
}
