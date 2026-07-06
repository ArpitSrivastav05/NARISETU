import React from 'react';
import { motion } from 'framer-motion';

export default function HowItWorks() {
  const steps = [
    { num: "01", title: "Create Account", desc: "Sign up securely using your email or Google account in seconds." },
    { num: "02", title: "Complete Profile", desc: "Tell us about your business, income, and goals." },
    { num: "03", title: "Find Eligible Schemes", desc: "Our AI matches you with government schemes you actually qualify for." },
    { num: "04", title: "Manage Finances", desc: "Use voice commands to easily track daily expenses and revenue." },
    { num: "05", title: "Grow Your Business", desc: "Get AI insights and sell on the marketplace to expand your reach." }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-600/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-teal-500/20 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How NariSetu Works
          </h2>
          <p className="text-lg text-slate-400">
            A simple, five-step journey from signing up to scaling your business.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-6 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 text-2xl font-bold flex items-center justify-center mb-6 group-hover:border-purple-500 group-hover:text-purple-400 group-hover:bg-purple-500/10 transition-all duration-300">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400">{step.desc}</p>
                
                {/* Mobile Connecting Line */}
                {index !== steps.length - 1 && (
                  <div className="h-12 w-px bg-slate-800 my-4 lg:hidden" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
