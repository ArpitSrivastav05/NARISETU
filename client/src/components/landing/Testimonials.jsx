import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Boutique Owner",
      content: "NariSetu helped me find a government loan I didn't even know existed. The AI voice ledger saves me hours every week!",
      initial: "P",
      color: "bg-rose-100 text-rose-600"
    },
    {
      name: "Anita Desai",
      role: "Handicraft Seller",
      content: "The marketplace feature allowed me to reach customers across the country. My sales have doubled since I joined the platform.",
      initial: "A",
      color: "bg-teal-100 text-teal-600"
    },
    {
      name: "Meera Patel",
      role: "Home Bakery",
      content: "As someone who isn't very tech-savvy, the voice commands for managing my expenses are a lifesaver. Highly recommend it!",
      initial: "M",
      color: "bg-amber-100 text-amber-600"
    }
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Loved by Women Entrepreneurs
          </h2>
          <p className="text-lg text-slate-600">
            Join thousands of women who are growing their businesses with NariSetu.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100"
            >
              <div className="flex text-amber-400 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="text-slate-700 leading-relaxed mb-8 italic">
                "{t.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${t.color}`}>
                  {t.initial}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{t.name}</div>
                  <div className="text-sm text-slate-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <p className="text-center text-xs text-slate-400 mt-12">
          * These are placeholder testimonials for demonstration purposes.
        </p>
      </div>
    </section>
  );
}
