import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function Testimonials() {
  const shouldReduceMotion = useReducedMotion();
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Boutique Owner",
      content: "NariSetu helped me find a government loan I didn't even know existed. The AI voice ledger saves me hours every week!",
      initial: "P",
    },
    {
      name: "Anita Desai",
      role: "Handicraft Seller",
      content: "The marketplace feature allowed me to reach customers across the country. My sales have doubled since I joined the platform.",
      initial: "A",
    },
    {
      name: "Meera Patel",
      role: "Home Bakery",
      content: "As someone who isn't very tech-savvy, the voice commands for managing my expenses are a lifesaver. Highly recommend it!",
      initial: "M",
    }
  ];

  return (
    <section className="py-24 bg-white">
      <motion.div 
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B192C] mb-4">
            Loved by Entrepreneurs
          </h2>
          <p className="text-base md:text-lg text-slate-600">
            Join thousands of entrepreneurs who are growing their businesses with NariSetu.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:border-[#B85042]/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex text-[#FBBF24] mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="text-slate-700 leading-relaxed mb-8 italic">
                "{t.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg bg-[#B85042]/10 text-[#B85042]">
                  {t.initial}
                </div>
                <div>
                  <div className="font-bold text-[#0B192C]">{t.name}</div>
                  <div className="text-sm text-slate-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-center text-xs text-slate-400 mt-12">
          * These are placeholder testimonials for demonstration purposes.
        </p>
      </motion.div>
    </section>
  );
}
