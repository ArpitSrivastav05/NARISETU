import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CourseCard from '../components/learning-hub/CourseCard';
import LessonCard from '../components/learning-hub/LessonCard';
import QuizCard from '../components/learning-hub/QuizCard';
import ProgressCard from '../components/learning-hub/ProgressCard';
import Certificate from '../components/learning-hub/Certificate';
import AITutorChat from '../components/learning-hub/AITutorChat';
import { ChevronLeft, Globe2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || "https://narisetu-j9ac.onrender.com";

export default function LearningHubPage() {
  const { authHeaders } = useAuth();
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState({});
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState("English"); // Multilingual scaffolding

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = await authHeaders();
      const [coursesRes, progressRes] = await Promise.all([
        fetch(`${API_URL}/api/learning/courses`, { headers }),
        fetch(`${API_URL}/api/learning/progress`, { headers })
      ]);
      const coursesData = await coursesRes.json();
      const progressData = await progressRes.json();
      
      if (coursesData.success) setCourses(coursesData.data);
      if (progressData.success) setProgress(progressData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProgress = async (payload) => {
    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_URL}/api/learning/progress`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ courseId: activeCourse.id, ...payload })
      });
      const data = await res.json();
      if (data.success) {
        setProgress(prev => ({ ...prev, [activeCourse.id]: data.data }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" /></div>;
  }

  // Flatten lessons for easy navigation within the active course
  let flatLessons = [];
  if (activeCourse) {
    activeCourse.modules.forEach(m => {
      m.lessons.forEach((l, i) => {
        flatLessons.push({ ...l, moduleId: m.id, hasQuiz: !!m.quiz && (i === m.lessons.length - 1), quiz: m.quiz });
      });
    });
  }

  const handleLessonComplete = (lessonId) => {
    updateProgress({ completedLessonId: lessonId });
  };

  const handleQuizSubmit = (score, moduleId) => {
    updateProgress({ moduleId, quizScore: score });
  };

  if (activeCourse) {
    const courseProgress = progress[activeCourse.id] || { completedLessons: [], quizScores: {} };
    
    // View Certificate
    if (courseProgress.certificateId) {
      return (
        <div className="max-w-4xl mx-auto py-8 px-4">
          <button onClick={() => setActiveCourse(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium mb-8">
            <ChevronLeft size={20} /> Back to Hub
          </button>
          <Certificate 
            course={activeCourse} 
            certificateId={courseProgress.certificateId} 
            dateCompleted={courseProgress.completedAt} 
          />
        </div>
      );
    }

    // View Quiz
    if (showQuiz) {
      const currentLesson = flatLessons[activeLessonIndex];
      return (
        <div className="max-w-4xl mx-auto py-8 px-4">
          <button onClick={() => setShowQuiz(false)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium mb-8">
            <ChevronLeft size={20} /> Back to Lesson
          </button>
          <QuizCard 
            quiz={currentLesson.quiz} 
            onSubmit={(score) => handleQuizSubmit(score, currentLesson.moduleId)}
            onFinish={() => {
              if (activeLessonIndex < flatLessons.length - 1) {
                setShowQuiz(false);
                setActiveLessonIndex(prev => prev + 1);
              } else {
                fetchData(); // refresh to potentially see certificate
                setActiveCourse(null);
              }
            }}
          />
        </div>
      );
    }

    // View Lesson
    const currentLesson = flatLessons[activeLessonIndex];
    const isCompleted = courseProgress.completedLessons.includes(currentLesson.id);

    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <button onClick={() => setActiveCourse(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium mb-8">
          <ChevronLeft size={20} /> Back to Hub
        </button>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <LessonCard 
              lesson={currentLesson} 
              hasCompleted={isCompleted}
              isLast={currentLesson.hasQuiz}
              onComplete={handleLessonComplete}
              onPrev={() => setActiveLessonIndex(prev => Math.max(0, prev - 1))}
              onNext={() => {
                if (currentLesson.hasQuiz) {
                  setShowQuiz(true);
                } else if (activeLessonIndex < flatLessons.length - 1) {
                  setActiveLessonIndex(prev => prev + 1);
                }
              }}
            />
          </div>
          <div className="lg:col-span-1">
            <AITutorChat lessonContext={currentLesson.content} language={language} />
          </div>
        </div>
      </div>
    );
  }

  // Main Hub View
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Learning & Growth Hub</h1>
          <p className="text-slate-500 mt-1">Master business skills and unlock certificates</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <Globe2 size={18} className="text-slate-400" />
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Hinglish">Hinglish</option>
          </select>
        </div>
      </div>

      <ProgressCard totalCourses={courses.length} progress={progress} />

      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          📚 Recommended Courses
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard 
              key={course.id} 
              course={course} 
              progress={progress[course.id]} 
              onSelect={setActiveCourse} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
