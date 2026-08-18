import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FileSearch, Mic, Store, PieChart, BrainCircuit, Lock } from 'lucide-react';

export default function Features() {
  const shouldReduceMotion = useReducedMotion();
  const features = [
    {
      title: "Government Scheme Matching",
      description: "Custom Two-Pass Eligibility Algorithm finds the perfect schemes for your business profile instantly.",
      icon: <FileSearch size={24} className="text-[#B85042]" />,
    },
    {
      title: "AI Voice Ledger",
      description: "Record income and expenses using just your voice. No manual data entry required.",
      icon: <Mic size={24} className="text-[#B85042]" />,
    },
    {
      title: "Marketplace",
      description: "Sell products and discover other local businesses in your community.",
      icon: <Store size={24} className="text-[#B85042]" />,
    },
    {
      title: "Business Dashboard",
      description: "Track profit, expenses, savings, and overall growth with beautiful, easy-to-read charts.",
      icon: <PieChart size={24} className="text-[#B85042]" />,
    },
    {
      title: "AI Business Coach",
      description: "Receive personalized financial insights and actionable advice to grow your enterprise.",
      icon: <BrainCircuit size={24} className="text-[#B85042]" />,
    },
    {
      title: "Secure Authentication",
      description: "Bank-grade security with seamless Email and Google Sign-In options.",
      icon: <Lock size={24} className="text-[#0B192C]" />,
    }
  ];

  return (
    <section id="features" className="py-24 bg-white relative">
      <motion.div 
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B192C] mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-base md:text-lg text-slate-600">
            Powerful tools designed to help micro and small business owners succeed, all in one easy-to-use platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#B85042]/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-14 h-14 rounded-xl bg-[#B85042]/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-[#0B192C] mb-3">
                {feature.title}
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
