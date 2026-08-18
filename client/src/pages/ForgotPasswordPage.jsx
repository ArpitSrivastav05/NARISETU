import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { KeyRound, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (err) {
      const map = {
        "auth/user-not-found": "No account found with this email.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/network-request-failed": "Network error. Check your connection.",
      };
      setError(map[err.code] || "Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#B85042]/10 mb-4">
            <KeyRound className="h-7 w-7 text-[#B85042]" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold text-[#0B192C] tracking-tight">
            NariSetu<span className="text-[#B85042]">.</span>
          </h1>
          <p className="text-slate-500 text-base mt-1">Reset your password</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-[#0B192C] mb-1">Forgot password?</h2>
          <p className="text-slate-500 text-base mb-6">
            Enter your email and we'll send you a reset link.
          </p>

          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-base font-medium flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 shrink-0" strokeWidth={2.5} /> {error}
            </div>
          )}
          {message && (
            <div className="mb-5 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-base font-medium flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 shrink-0" strokeWidth={2.5} /> {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 min-h-[48px] text-[#0B192C] text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B85042]/30 focus:border-[#B85042] transition"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#B85042] hover:bg-[#9d4438] text-white font-bold min-h-[48px] rounded-xl text-base transition shadow-sm disabled:opacity-60 active:scale-[0.98] cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending…
                </span>
              ) : "Send Reset Email"}
            </button>
          </form>

          <p className="text-center text-slate-500 text-base mt-6">
            Remembered it?{" "}
            <Link to="/login" className="text-[#B85042] hover:text-[#9d4438] font-semibold transition">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
