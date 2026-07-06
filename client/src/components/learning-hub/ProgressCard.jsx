import React from 'react';
import { Award, Target, Zap } from 'lucide-react';

export default function ProgressCard({ totalCourses, progress }) {
  const completedCount = Object.values(progress).filter(p => p.certificateId).length;
  const inProgressCount = Object.values(progress).filter(p => p.completedLessons?.length > 0 && !p.certificateId).length;

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10 grid md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-2xl font-extrabold mb-1">Your Learning Journey</h2>
          <p className="text-slate-400 text-sm mb-6">Track your skill development</p>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/10">
            <Award className="text-amber-400" size={20} />
            <span className="font-bold">{completedCount}</span>
            <span className="text-slate-300 text-sm">Certificates Earned</span>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
          <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center">
            <Target className="text-teal-400" size={24} />
          </div>
          <div>
            <div className="text-3xl font-black text-white">{inProgressCount}</div>
            <div className="text-sm font-medium text-slate-400">Courses in Progress</div>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Zap className="text-purple-400" size={24} />
          </div>
          <div>
            <div className="text-3xl font-black text-white">{totalCourses}</div>
            <div className="text-sm font-medium text-slate-400">Available Courses</div>
          </div>
        </div>
      </div>
    </div>
  );
}
