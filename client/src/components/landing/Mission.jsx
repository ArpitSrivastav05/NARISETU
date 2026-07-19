import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

export default function Mission() {
  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden" id="mission">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] bg-[length:20px_20px]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-6">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              NariSetu exists to make entrepreneurship accessible for everyone while ensuring women entrepreneurs can easily benefit from government initiatives specifically designed for them.
            </p>
            <p className="text-lg text-slate-500 mt-6 leading-relaxed">
              Instead of excluding users, the platform intelligently recommends opportunities based on eligibility.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
