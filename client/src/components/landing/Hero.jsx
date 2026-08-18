import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';

function CountUp({ end, prefix = "", suffix = "" }) {
  const shouldReduceMotion = useReducedMotion();
  const [count, setCount] = useState(shouldReduceMotion ? end : 0);

  useEffect(() => {
    if (shouldReduceMotion) return;
    
    let startTime = null;
    const duration = 1500;
    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, shouldReduceMotion]);

  return <span>{prefix}{count}{suffix}</span>;
}

function Waveform() {
  const shouldReduceMotion = useReducedMotion();
  const bars = 5;
  
  return (
    <div className="flex items-center gap-1 h-8">
      {[...Array(bars)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 bg-[#B85042] rounded-full"
          animate={shouldReduceMotion ? { height: 16 } : {
            height: [12, 24, 12, 32, 16][i % 5]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.1,
            ease: "easeInOut"
          }}
          style={{ height: 16 }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const revealVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#0B192C]">
      {/* Background Depth: Subtle Terracotta Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#B85042]/15 blur-[120px] rounded-full -z-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-800/40 blur-[100px] rounded-full -z-10 transform -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={revealVariants}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#B85042]/10 border border-[#B85042]/20 text-[#B85042] text-sm font-semibold mb-6">
              <Sparkles size={16} />
              <span>AI-Powered Entrepreneurship Platform</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1]">
              Empowering Women. <br className="hidden lg:block" />
              Enabling Every{" "}
              <span className="text-[#B85042]">
                Entrepreneur
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              NariSetu is an AI-powered entrepreneurship platform that helps Indian micro and small business owners discover government schemes, manage finances, learn business skills, and grow through intelligent tools.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link 
                to="/register" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#B85042] hover:bg-[#9d4438] text-white rounded-2xl font-bold transition-all duration-200 shadow-lg shadow-[#B85042]/20 hover:shadow-xl hover:shadow-[#B85042]/30 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>
              <a 
                href="#features" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all duration-200"
              >
                Explore Features
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm font-medium text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#FBBF24]" />
                Secure & Private
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-[#B85042]" />
                Built for Growth
              </div>
            </div>
          </motion.div>

          {/* Illustration / Graphic */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={revealVariants}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg aspect-square lg:aspect-auto lg:h-full">
              
              {/* Main Card */}
              <motion.div 
                animate={shouldReduceMotion ? {} : { y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-slate-900/80 backdrop-blur-xl border border-slate-700 shadow-2xl rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                    <Sparkles className="h-6 w-6 text-[#B85042]" />
                  </div>
                  <div className="px-3 py-1 bg-[#FBBF24]/10 text-[#FBBF24] text-xs font-bold uppercase rounded-full">
                    AI Match
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="h-2 w-1/2 bg-slate-700 rounded-full" />
                  <div className="h-2 w-3/4 bg-slate-800 rounded-full" />
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <p className="text-sm text-slate-300 font-medium">
                    You are eligible for the <span className="font-bold text-white">Mudra Yojana</span> scheme.
                  </p>
                </div>
              </motion.div>

              {/* Voice Ledger Graphic */}
              <motion.div 
                animate={shouldReduceMotion ? {} : { y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/4 -right-4 lg:-right-8 bg-slate-900 p-5 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-[#B85042]/10 flex items-center justify-center text-[#B85042] border border-[#B85042]/20">
                  <Mic size={20} />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium mb-1">Voice Ledger</div>
                  <Waveform />
                </div>
              </motion.div>

              {/* Floating Element 2 */}
              <motion.div 
                animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-1/4 -left-4 lg:-left-8 bg-slate-900 p-5 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium mb-1">Monthly Profit</div>
                  <div className="text-lg font-bold text-white"><CountUp end={24} prefix="+" suffix="%" /></div>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
