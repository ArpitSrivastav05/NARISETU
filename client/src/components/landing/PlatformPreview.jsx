import React from 'react';
import { motion } from 'framer-motion';

export default function PlatformPreview() {
  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Designed for Clarity
          </h2>
          <p className="text-lg text-slate-600">
            A beautiful, intuitive interface that puts your business front and center.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto max-w-5xl"
        >
          {/* Main Browser Mockup */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden relative z-10">
            {/* Browser Header */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="mx-auto bg-white border border-slate-200 rounded-md text-[10px] text-slate-400 px-24 py-1">
                app.narisetu.in
              </div>
            </div>
            {/* Dashboard Content Mockup */}
            <div className="p-6 md:p-8 bg-slate-50 flex gap-6 h-[400px] md:h-[600px]">
              {/* Sidebar */}
              <div className="hidden md:block w-48 bg-slate-900 rounded-xl p-4 shrink-0">
                <div className="h-6 w-24 bg-white/20 rounded mb-8" />
                <div className="space-y-3">
                  <div className="h-8 w-full bg-blue-600 rounded" />
                  <div className="h-8 w-full bg-white/5 rounded" />
                  <div className="h-8 w-full bg-white/5 rounded" />
                  <div className="h-8 w-full bg-white/5 rounded" />
                </div>
              </div>
              {/* Main Area */}
              <div className="flex-1 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="h-6 w-40 bg-slate-200 rounded" />
                  <div className="h-8 w-8 bg-slate-200 rounded-full" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="h-24 bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                    <div className="h-4 w-16 bg-slate-100 rounded mb-4" />
                    <div className="h-6 w-24 bg-slate-200 rounded" />
                  </div>
                  <div className="h-24 bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                    <div className="h-4 w-16 bg-slate-100 rounded mb-4" />
                    <div className="h-6 w-24 bg-slate-200 rounded" />
                  </div>
                  <div className="hidden md:block h-24 bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                    <div className="h-4 w-16 bg-slate-100 rounded mb-4" />
                    <div className="h-6 w-24 bg-slate-200 rounded" />
                  </div>
                </div>
                <div className="flex-1 h-48 md:h-64 bg-white border border-slate-100 rounded-xl shadow-sm p-4 flex flex-col justify-end">
                  <div className="w-full flex items-end gap-2 h-full opacity-20">
                    {[40, 70, 45, 90, 65, 85, 100, 60].map((h, i) => (
                      <div key={i} className="flex-1 bg-purple-600 rounded-t-sm" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Mobile Mockup */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-4 md:-right-12 -bottom-12 md:-bottom-24 w-48 md:w-64 aspect-[9/19] bg-slate-900 rounded-[2.5rem] border-8 border-slate-800 shadow-2xl z-20 overflow-hidden hidden sm:block"
          >
            {/* Mobile Header */}
            <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center">
               <div className="h-4 w-16 bg-white/20 rounded" />
               <div className="h-6 w-6 bg-white/20 rounded-full" />
            </div>
            {/* Mobile Body */}
            <div className="p-4 bg-slate-50 h-full space-y-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                 <div className="w-6 h-6 bg-purple-500 rounded-full" />
              </div>
              <div className="h-20 bg-white rounded-xl shadow-sm border border-slate-100" />
              <div className="h-20 bg-white rounded-xl shadow-sm border border-slate-100" />
              <div className="h-20 bg-white rounded-xl shadow-sm border border-slate-100" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
