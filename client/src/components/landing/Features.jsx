import React from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Mic, Store, PieChart, BrainCircuit, Lock } from 'lucide-react';

export default function Features() {
  const features = [
    {
      title: "Government Scheme Matching",
      description: "Custom Two-Pass Eligibility Algorithm finds the perfect schemes for your business profile instantly.",
      icon: <FileSearch size={24} className="text-purple-600" />,
      bg: "bg-purple-100",
      delay: 0.1
    },
    {
      title: "AI Voice Ledger",
      description: "Record income and expenses using just your voice. No manual data entry required.",
      icon: <Mic size={24} className="text-teal-600" />,
      bg: "bg-teal-100",
      delay: 0.2
    },
    {
      title: "Marketplace",
      description: "Sell products and discover other women-owned businesses in your community.",
      icon: <Store size={24} className="text-amber-600" />,
      bg: "bg-amber-100",
      delay: 0.3
    },
    {
      title: "Business Dashboard",
      description: "Track profit, expenses, savings, and overall growth with beautiful, easy-to-read charts.",
      icon: <PieChart size={24} className="text-blue-600" />,
      bg: "bg-blue-100",
      delay: 0.4
    },
    {
      title: "AI Business Coach",
      description: "Receive personalized financial insights and actionable advice to grow your enterprise.",
      icon: <BrainCircuit size={24} className="text-rose-600" />,
      bg: "bg-rose-100",
      delay: 0.5
    },
    {
      title: "Secure Authentication",
      description: "Bank-grade security with seamless Email and Google Sign-In options.",
      icon: <Lock size={24} className="text-indigo-600" />,
      bg: "bg-indigo-100",
      delay: 0.6
    }
  ];

  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-lg text-slate-600">
            Powerful tools designed specifically for women entrepreneurs, all in one easy-to-use platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: feature.delay }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:bg-white transition-all duration-300 group"
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
