import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "How does NariSetu work?",
      a: "NariSetu is an all-in-one platform that uses AI to match you with eligible government schemes, provides a voice-based ledger to manage your finances, and connects you to a marketplace of other women entrepreneurs."
    },
    {
      q: "Is it free to use?",
      a: "Yes, creating an account and accessing the core features like scheme matching and the basic voice ledger is completely free."
    },
    {
      q: "How secure is my data?",
      a: "We use bank-grade encryption and secure authentication via Google and Firebase. Your financial data is private and only accessible by you."
    },
    {
      q: "Which government schemes are supported?",
      a: "We currently support major central and state government schemes designed for women entrepreneurs, such as Mudra Yojana, Stand-Up India, and Mahila Samriddhi Yojana, and constantly update our database."
    },
    {
      q: "Can I use the app in Hindi?",
      a: "Currently, our voice ledger supports Hinglish and basic Hindi commands. Full Hindi language support for the entire app is coming in our next major update."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600">
            Everything you need to know about the platform.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                <span className="font-semibold text-slate-900 pr-4">{faq.q}</span>
                <ChevronDown 
                  className={`text-slate-400 transition-transform duration-300 shrink-0 ${openIndex === index ? 'rotate-180 text-purple-600' : ''}`} 
                  size={20} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-5 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
