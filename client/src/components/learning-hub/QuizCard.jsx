import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export default function QuizCard({ quiz, onSubmit, onFinish }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (qIndex, oIndex) => {
    if (submitted) return;
    setAnswers({ ...answers, [qIndex]: oIndex });
  };

  const handleSubmit = () => {
    let s = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) s++;
    });
    const finalScore = Math.round((s / quiz.questions.length) * 100);
    setScore(finalScore);
    setSubmitted(true);
    onSubmit(finalScore);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-8 bg-slate-900 text-white">
        <h2 className="text-2xl font-extrabold mb-2">Knowledge Check</h2>
        <p className="text-slate-400">Test what you've learned in this module.</p>
      </div>
      
      <div className="p-8 space-y-8">
        {quiz.questions.map((q, qIndex) => (
          <div key={qIndex}>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">{qIndex + 1}. {q.question}</h3>
            <div className="space-y-3">
              {q.options.map((opt, oIndex) => {
                const isSelected = answers[qIndex] === oIndex;
                const isCorrect = q.correctIndex === oIndex;
                const showStatus = submitted;
                
                let ringClass = "border-slate-200 hover:border-purple-300 hover:bg-purple-50";
                if (isSelected) ringClass = "border-purple-500 bg-purple-50 ring-1 ring-purple-500";
                
                if (showStatus) {
                  if (isCorrect) ringClass = "border-teal-500 bg-teal-50 text-teal-900";
                  else if (isSelected && !isCorrect) ringClass = "border-rose-500 bg-rose-50 text-rose-900";
                  else ringClass = "border-slate-100 opacity-50";
                }

                return (
                  <button
                    key={oIndex}
                    onClick={() => handleSelect(qIndex, oIndex)}
                    disabled={submitted}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all flex items-center justify-between ${ringClass}`}
                  >
                    <span>{opt}</span>
                    {showStatus && isCorrect && <CheckCircle2 className="text-teal-500" size={20} />}
                    {showStatus && isSelected && !isCorrect && <XCircle className="text-rose-500" size={20} />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        {submitted ? (
          <>
            <div className="flex items-center gap-3">
              <div className={`px-4 py-2 rounded-lg font-bold text-white ${score >= 50 ? 'bg-teal-500' : 'bg-amber-500'}`}>
                Score: {score}%
              </div>
              <span className="text-slate-600 font-medium text-sm">
                {score >= 50 ? 'Passed! Great job.' : 'Please review the lesson and try again.'}
              </span>
            </div>
            <button 
              onClick={onFinish}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition"
            >
              Continue <ArrowRight size={18} />
            </button>
          </>
        ) : (
          <button 
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < quiz.questions.length}
            className="ml-auto px-6 py-2.5 rounded-xl font-bold bg-purple-600 text-white hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answers
          </button>
        )}
      </div>
    </div>
  );
}
