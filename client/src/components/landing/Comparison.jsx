import React from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

export default function Comparison() {
  const features = [
    { name: "Finding government schemes", traditional: "Manual & confusing", narisetu: "AI-powered matching" },
    { name: "Bookkeeping", traditional: "Paper records", narisetu: "Voice-based digital ledger" },
    { name: "Financial insights", traditional: "None", narisetu: "Personalized AI coach" },
    { name: "Market reach", traditional: "Local only", narisetu: "Digital marketplace" },
    { name: "Data Security", traditional: "Physical loss risk", narisetu: "Secure cloud storage" }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Why Choose NariSetu?
          </h2>
          <p className="text-lg text-slate-600">
            See how we transform traditional business management into a streamlined digital experience.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-3xl border border-slate-200 shadow-xl"
        >
          <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200">
            <div className="p-6 text-sm font-bold text-slate-500 uppercase tracking-wider">Features</div>
            <div className="p-6 text-sm font-bold text-slate-500 uppercase tracking-wider text-center border-l border-slate-200">Traditional</div>
            <div className="p-6 text-sm font-bold text-purple-600 uppercase tracking-wider text-center border-l border-slate-200 bg-purple-50/50">NariSetu</div>
          </div>

          {features.map((item, index) => (
            <div key={index} className={`grid grid-cols-3 ${index !== features.length - 1 ? 'border-b border-slate-100' : ''}`}>
              <div className="p-4 md:p-6 text-sm md:text-base font-semibold text-slate-800 flex items-center">
                {item.name}
              </div>
              <div className="p-4 md:p-6 text-sm md:text-base text-slate-500 flex items-center justify-center text-center border-l border-slate-100">
                <span className="flex flex-col items-center gap-2">
                  <X size={18} className="text-rose-400" />
                  {item.traditional}
                </span>
              </div>
              <div className="p-4 md:p-6 text-sm md:text-base font-bold text-purple-900 flex items-center justify-center text-center border-l border-slate-100 bg-purple-50/30">
                <span className="flex flex-col items-center gap-2">
                  <Check size={20} className="text-teal-500" />
                  {item.narisetu}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
