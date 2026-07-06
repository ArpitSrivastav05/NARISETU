import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

export default function LessonCard({ lesson, onNext, onPrev, isLast, onComplete, hasCompleted }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="p-8 flex-1 overflow-y-auto">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-6">{lesson.title}</h2>
        <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-p:text-slate-600">
          {lesson.content.split('\n\n').map((paragraph, i) => (
            <p key={i} className="mb-4 text-base">{paragraph}</p>
          ))}
        </div>
      </div>
      
      <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <button 
          onClick={onPrev}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition disabled:opacity-50"
        >
          <ArrowLeft size={18} /> Previous
        </button>

        <button 
          onClick={() => {
            if (!hasCompleted) onComplete(lesson.id);
            onNext();
          }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white transition shadow-sm hover:shadow-md active:scale-95 ${hasCompleted ? 'bg-slate-800' : 'bg-purple-600 hover:bg-purple-700'}`}
        >
          {isLast ? (
            <>Take Quiz <ArrowRight size={18} /></>
          ) : (
            <>Next Lesson <ArrowRight size={18} /></>
          )}
        </button>
      </div>
    </div>
  );
}
