import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 py-16 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group inline-flex">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white font-bold text-lg">
                N
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                NariSetu<span className="text-purple-500">.</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Empowering women entrepreneurs through AI, financial tools, and community support.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="https://github.com/arpitsrivastav05" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.8c0-1.2-.4-2.4-1-3.2 3-.3 6-1.5 6-6.5 0-1.4-.5-2.7-1.4-3.7.1-.3.6-1.8-.1-3.7 0 0-1.2-.4-3.8 1.4a12.8 12.8 0 0 0-7 0C6.2 1.5 5 1.9 5 1.9c-.7 1.9-.2 3.4-.1 3.7-.9 1-1.4 2.3-1.4 3.7 0 5 3 6.2 6 6.5-.6.8-1 2-1 3.2V22"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#features" className="hover:text-purple-400 transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-purple-400 transition-colors">How it works</a></li>
              <li><a href="#impact" className="hover:text-purple-400 transition-colors">Impact</a></li>
              <li><Link to="/login" className="hover:text-purple-400 transition-colors">Login</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-slate-500" />
                <a href="mailto:hello@narisetu.in" className="hover:text-purple-400 transition-colors">hello@narisetu.in</a>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                </div>
                <span>System Operational</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {currentYear} NariSetu. All rights reserved.</p>
          <p>Built for Indian Women Entrepreneurs 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}
