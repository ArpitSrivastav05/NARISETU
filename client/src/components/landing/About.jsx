import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function About() {
  const points = [
    "Register",
    "Manage finances",
    "Use AI Coach",
    "Sell products",
    "Learn business skills",
    "Build a business profile"
  ];

  return (
    <section className="py-20 bg-white" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">
              A Platform for Everyone
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Anyone can join the NariSetu ecosystem. We believe that providing powerful AI tools should not be exclusive. 
            </p>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-bold text-blue-900 mb-4">You can easily:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {points.map((point, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-slate-700 font-medium">{point}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-slate-500 italic">
              * Government scheme recommendations are personalized according to official eligibility criteria.
            </p>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2 w-full"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video bg-slate-900">
               {/* Decorative background or placeholder image if needed */}
               <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 opacity-90"></div>
               <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                  <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                    Empowering Women.<br/>Enabling Every Entrepreneur.
                  </h3>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
