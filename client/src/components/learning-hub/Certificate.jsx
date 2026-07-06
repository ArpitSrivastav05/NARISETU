import React from 'react';
import { Award, Download } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Certificate({ course, certificateId, dateCompleted }) {
  const { currentUser, userProfile } = useAuth();
  const userName = currentUser?.displayName || userProfile?.name || "Entrepreneur";

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden text-center p-12 relative max-w-2xl mx-auto">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-purple-600 via-teal-500 to-amber-500" />
      <div className="absolute top-4 left-4 text-purple-200 opacity-20">
        <Award size={120} />
      </div>
      <div className="absolute bottom-4 right-4 text-teal-200 opacity-20">
        <Award size={120} />
      </div>

      <div className="relative z-10">
        <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
          <Award className="text-amber-500" size={40} />
        </div>
        
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Certificate of Completion</h3>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-8 font-serif">
          {userName}
        </h1>
        
        <p className="text-slate-600 mb-4">has successfully completed the course</p>
        <h2 className="text-2xl font-bold text-purple-700 mb-10">
          {course.title}
        </h2>
        
        <div className="flex justify-between items-end border-t border-slate-200 pt-8 mt-8">
          <div className="text-left">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Date</p>
            <p className="font-semibold text-slate-800">
              {new Date(dateCompleted || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Credential ID</p>
            <p className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
              {certificateId}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button className="mt-8 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition mx-auto shadow-md active:scale-95">
          <Download size={18} /> Download PDF
        </button>
      </div>
    </div>
  );
}
