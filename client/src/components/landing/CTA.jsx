import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export default function CTA() {
  const shouldReduceMotion = useReducedMotion();

  const revealVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden bg-[#0B192C]">
      {/* Background Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#B85042]/10 via-transparent to-transparent -z-10" />
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={revealVariants}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
            Start Growing Your <br className="hidden md:block" />
            <span className="text-[#B85042]">Business Today</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join the community of entrepreneurs taking control of their finances and scaling their businesses with intelligent tools.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/register" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#B85042] hover:bg-[#9d4438] text-white rounded-2xl font-bold text-base transition-all duration-200 shadow-lg shadow-[#B85042]/20 hover:shadow-xl hover:shadow-[#B85042]/30 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Create Free Account
              <ArrowRight size={20} />
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-2xl font-bold text-base transition-all duration-200"
            >
              Log in to Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
