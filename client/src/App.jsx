import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Auth
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Protected pages
import ProfilePage from './pages/ProfilePage';
import SchemeHistoryPage from './pages/SchemeHistoryPage';

// Feature components (existing)
import SchemeForm from './components/SchemeForm';
import ResultsList from './components/ResultsList';
import VoiceLedger from './components/VoiceLedger';
import DashboardAnalytics from './components/DashboardAnalytics';
import Marketplace from './components/Marketplace';

const API_URL = import.meta.env.VITE_API_URL || "https://narisetu-j9ac.onrender.com";

// ── Main authenticated layout ────────────────────────────────
function MainLayout() {
  const { currentUser, userProfile, logout, authHeaders } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('schemes');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSubmit = async (payload) => {
    setIsLoading(true);
    setResults(null);
    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_URL}/api/schemes/match`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setResults({ success: false, error: "Network error — is the backend running?" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { id: 'schemes',   label: '🔎 Find Schemes' },
    { id: 'ledger',    label: '🎙️ Voice Ledger' },
    { id: 'dashboard', label: '📈 Dashboard' },
    { id: 'market',    label: '🛒 Marketplace' },
    { id: 'history',   label: '📋 Scheme History' },
    { id: 'profile',   label: '👤 Profile' },
  ];

  const avatarSrc =
    currentUser?.photoURL ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      currentUser?.displayName || 'NS'
    )}&backgroundColor=e8d5f5,f0e6ff&textColor=7c3aed`;

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-col shadow-xl hidden md:flex shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold tracking-tight">
            NariSetu<span className="text-blue-400">.</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
            Women Empowerment Suite
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all text-left text-sm ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User card at bottom */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 mb-3">
            <img
              src={avatarSrc}
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-700 flex-shrink-0"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.displayName || 'NS')}&backgroundColor=e8d5f5,f0e6ff&textColor=7c3aed`;
              }}
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {currentUser?.displayName || userProfile?.name || 'User'}
              </p>
              <p className="text-xs text-slate-400 truncate">{currentUser?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-700 hover:border-rose-500/30 font-semibold py-2 px-3 rounded-lg transition cursor-pointer"
          >
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile header */}
        <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-30">
          <h1 className="text-xl font-bold">NariSetu<span className="text-blue-400">.</span></h1>
          <div className="flex items-center gap-2">
            <img src={avatarSrc} alt="" className="w-8 h-8 rounded-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.displayName || 'NS')}&backgroundColor=e8d5f5,f0e6ff&textColor=7c3aed`; }} />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300"
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-800 border-b border-slate-700 px-4 pb-3 space-y-1 z-20">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  activeTab === item.id ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition"
            >
              🚪 Sign Out
            </button>
          </div>
        )}

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* Schemes tab */}
          {activeTab === 'schemes' && (
            <div className="grid gap-10 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-lg">
                  <SchemeForm onSubmit={handleSubmit} isLoading={isLoading} />
                </div>
              </div>
              <div className="lg:col-span-3">
                {!results && !isLoading ? (
                  <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 py-28 text-center bg-white/50">
                    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50">
                      <span className="text-3xl">📄</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-700">Your Results Will Appear Here</h3>
                    <p className="mt-2 max-w-sm text-sm text-slate-500">
                      Fill in the eligibility form and click "Find Eligible Schemes" to see matching government schemes.
                    </p>
                  </div>
                ) : (
                  <ResultsList data={results} isLoading={isLoading} />
                )}
              </div>
            </div>
          )}

          {activeTab === 'ledger' && <VoiceLedger />}
          {activeTab === 'dashboard' && <DashboardAnalytics />}
          {activeTab === 'market' && <Marketplace />}
          {activeTab === 'history' && <SchemeHistoryPage />}
          {activeTab === 'profile' && <ProfilePage />}
        </div>
      </main>
    </div>
  );
}

// ── App with routing ─────────────────────────────────────────
export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected main app */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
