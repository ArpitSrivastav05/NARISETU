import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ShoppingBag, Briefcase, Star, LogOut, AlertTriangle } from "lucide-react";

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
      navigate("/dashboard", { replace: true });
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

  const roles = [
    {
      id: "buyer",
      icon: ShoppingBag,
      title: "Buyer / User",
      desc: "Find and apply for government schemes, browse handmade crafts and products, and manage records.",
    },
    {
      id: "seller",
      icon: Briefcase,
      title: "Seller / Artisan",
      desc: "Register your business, cooperative, or craft, publish product listings, and connect with customers.",
    },
    {
      id: "both",
      icon: Star,
      title: "Both",
      desc: "Use all resources — list and sell products while applying for empowerment schemes and tools.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl p-6 md:p-10 shadow-sm relative">
        <button
          onClick={handleLogout}
          className="absolute top-6 right-6 flex items-center gap-2 text-sm text-slate-400 hover:text-rose-500 font-semibold transition cursor-pointer"
        >
          <LogOut className="h-4 w-4" strokeWidth={2.5} />
          Sign Out
        </button>

        <div className="text-center max-w-md mx-auto mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#B85042]/10 mb-4">
            <Star className="h-7 w-7 text-[#B85042]" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold text-[#0B192C] tracking-tight">
            Welcome to NariSetu
          </h1>
          <p className="text-slate-500 text-base mt-2">
            Let's customize your workspace. How would you like to use NariSetu?
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-base font-medium flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 shrink-0" strokeWidth={2.5} /> {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {roles.map((role) => {
            const RoleIcon = role.icon;
            return (
              <div
                key={role.id}
                onClick={() => handleSelectRole(role.id)}
                className={`border rounded-2xl p-6 cursor-pointer transition-all duration-200 flex flex-col items-center text-center min-h-[48px] ${
                  selectedRole === role.id
                    ? "border-[#B85042] bg-[#B85042]/5 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                  selectedRole === role.id
                    ? "bg-[#B85042]/10"
                    : "bg-slate-100"
                }`}>
                  <RoleIcon className={`h-6 w-6 ${
                    selectedRole === role.id ? "text-[#B85042]" : "text-slate-500"
                  }`} strokeWidth={2} />
                </div>
                <h3 className="text-base font-bold text-[#0B192C] mb-2">{role.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {role.desc}
                </p>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleConfirm}
          disabled={isSubmitting || !selectedRole}
          className="w-full mt-10 bg-[#B85042] hover:bg-[#9d4438] text-white font-bold min-h-[48px] rounded-xl text-base transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
