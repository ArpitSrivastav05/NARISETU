import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Target } from 'lucide-react';

export default function Mission() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 bg-white relative overflow-hidden" id="mission">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="inline-flex items-center justify-center p-3 bg-[#B85042]/10 rounded-xl mb-6">
              <Target className="w-8 h-8 text-[#B85042]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B192C] tracking-tight mb-6">
              Our Mission
            </h2>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
              NariSetu exists to make entrepreneurship accessible for everyone while ensuring women entrepreneurs can easily benefit from government initiatives specifically designed for them.
            </p>
            <p className="text-base md:text-lg text-slate-500 mt-6 leading-relaxed">
              Instead of excluding users, the platform intelligently recommends opportunities based on eligibility.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
