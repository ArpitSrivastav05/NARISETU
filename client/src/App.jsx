import React, { useState } from 'react';
import SchemeForm from './components/SchemeForm';
import ResultsList from './components/ResultsList';
import VoiceLedger from './components/VoiceLedger';
import DashboardAnalytics from './components/DashboardAnalytics';
import Marketplace from './components/Marketplace';

const API_URL = "https://narisetu-j9ac.onrender.com/api/schemes/match";

const App = () => {
  const [activeTab, setActiveTab] = useState('schemes');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (payload) => {
    setIsLoading(true);
    setResults(null);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResults(data);
    } catch (err) {
      setResults({
        success: false,
        error: "Network error — is the backend running?",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const navItems = [
    { id: 'schemes', label: '🔎 Find Schemes', active: true },
    { id: 'ledger', label: '🎙️ Voice Ledger', active: true },
    { id: 'dashboard', label: '📈 Dashboard', active: true },
    { id: 'market', label: '🛒 Marketplace', active: true },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar Layout */}
      <aside className="w-64 bg-slate-900 text-white flex-col shadow-xl hidden md:flex shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold tracking-tight">NariSetu<span className="text-blue-400">.</span></h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Women Empowerment Suite</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              disabled={!item.active}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all text-left ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : item.active 
                    ? 'text-slate-300 hover:bg-slate-800 hover:text-white' 
                    : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-full uppercase tracking-wider">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm">👤</div>
            <div>
              <p className="text-sm font-medium">Guest User</p>
              <p className="text-xs text-slate-400">Visitor</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header (Visible only on small screens) */}
        <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
          <h1 className="text-xl font-bold">NariSetu</h1>
          <div className="flex space-x-1">
            <button onClick={() => setActiveTab('schemes')} className={`p-2 rounded text-sm ${activeTab === 'schemes' ? 'bg-blue-600' : 'bg-slate-800'}`}>🔎</button>
            <button onClick={() => setActiveTab('ledger')} className={`p-2 rounded text-sm ${activeTab === 'ledger' ? 'bg-blue-600' : 'bg-slate-800'}`}>🎙️</button>
            <button onClick={() => setActiveTab('dashboard')} className={`p-2 rounded text-sm ${activeTab === 'dashboard' ? 'bg-blue-600' : 'bg-slate-800'}`}>📈</button>
            <button onClick={() => setActiveTab('market')} className={`p-2 rounded text-sm ${activeTab === 'market' ? 'bg-blue-600' : 'bg-slate-800'}`}>🛒</button>
          </div>
        </div>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
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
                      Fill in the eligibility form on the left and click "Find Eligible Schemes" to see matching government schemes.
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
        </div>
      </main>
    </div>
  );
};

export default App;
