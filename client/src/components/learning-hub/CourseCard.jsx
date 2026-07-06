import React from 'react';
import { BookOpen, CheckCircle, PlayCircle } from 'lucide-react';

export default function CourseCard({ course, progress, onSelect }) {
  const isCompleted = progress?.certificateId != null;
  const completedLessons = progress?.completedLessons?.length || 0;
  
  let totalLessons = 0;
  course.modules.forEach(m => {
    totalLessons += m.lessons.length;
  });

  const percentComplete = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full"
      onClick={() => onSelect(course)}
    >
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold uppercase rounded-full tracking-wider">
            {course.category}
          </span>
          {isCompleted && (
            <div className="flex items-center gap-1 text-teal-600">
              <CheckCircle size={18} />
              <span className="text-xs font-bold">Completed</span>
            </div>
          )}
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">{course.title}</h3>
        <p className="text-slate-500 text-sm flex-1 leading-relaxed">{course.description}</p>
        
        <div className="mt-6">
          <div className="flex justify-between items-center text-xs font-medium text-slate-500 mb-2">
            <span className="flex items-center gap-1"><BookOpen size={14} /> {totalLessons} Lessons</span>
            <span>{percentComplete}% Complete</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full ${isCompleted ? 'bg-teal-500' : 'bg-purple-600'} transition-all`}
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">
          {percentComplete > 0 && !isCompleted ? 'Continue Learning' : isCompleted ? 'Review Course' : 'Start Course'}
        </span>
        <PlayCircle size={20} className={percentComplete > 0 && !isCompleted ? 'text-purple-600' : 'text-slate-400'} />
      </div>
    </div>
  );
}
