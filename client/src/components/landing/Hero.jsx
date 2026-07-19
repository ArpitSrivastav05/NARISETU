import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100/50 via-white to-white -z-10" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-teal-50/40 blur-3xl rounded-full -z-10 transform translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-purple-50/40 blur-3xl rounded-full -z-10 transform -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100/50 border border-purple-200/50 text-purple-700 text-sm font-semibold mb-6">
              <Sparkles size={16} />
              <span>AI-Powered Entrepreneurship Platform</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
              Empowering Women. <br className="hidden lg:block" />
              Enabling Every{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-teal-500">
                Entrepreneur
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              NariSetu is an AI-powered entrepreneurship platform that helps Indian micro and small business owners discover government schemes, manage finances, learn business skills, and grow through intelligent AI tools.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link 
                to="/register" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-semibold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>
              <a 
                href="#features" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full font-semibold transition-all hover:border-slate-300"
              >
                Explore Features
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-teal-500" />
                Secure & Private
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-purple-500" />
                Built for Growth
              </div>
            </div>
          </motion.div>

          {/* Illustration / Graphic */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            {/* Abstract UI Representation */}
            <div className="relative w-full max-w-lg aspect-square lg:aspect-auto lg:h-full">
              {/* Main Card */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white/80 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-3xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-2xl">👩🏽‍💼</span>
                  </div>
                  <div className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-bold uppercase rounded-full">
                    AI Insights
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="h-2 w-1/2 bg-slate-200 rounded-full" />
                  <div className="h-2 w-3/4 bg-slate-100 rounded-full" />
                </div>
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                  <div className="flex items-start gap-3">
                    <Sparkles className="text-purple-500 mt-0.5 shrink-0" size={18} />
                    <p className="text-sm text-purple-900 font-medium">
                      Based on your profile, you are eligible for the <span className="font-bold">Mudra Yojana</span> scheme!
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Element 1 */}
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/4 -right-4 lg:-right-12 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <span className="font-bold text-lg">₹</span>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium mb-1">Voice Ledger</div>
                  <div className="text-sm font-bold text-slate-900">Recorded ₹500</div>
                </div>
              </motion.div>

              {/* Floating Element 2 */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-1/4 -left-4 lg:-left-12 bg-slate-900 p-4 rounded-2xl shadow-xl flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium mb-1">Monthly Profit</div>
                  <div className="text-sm font-bold text-white">+ 24.5%</div>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
