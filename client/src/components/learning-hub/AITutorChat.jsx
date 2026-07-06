import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || "https://narisetu-j9ac.onrender.com";

export default function AITutorChat({ lessonContext, language }) {
  const { authHeaders } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'ai', content: `Hello! I'm your AI Tutor. Do you have any questions about this lesson? I can answer in ${language}.` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userQuestion = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userQuestion }]);
    setInput('');
    setIsLoading(true);

    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_URL}/api/learning/tutor`, {
        method: "POST",
        headers,
        body: JSON.stringify({ question: userQuestion, lessonContext, language })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'ai', content: data.data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I couldn't process that right now." }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Network error connecting to the tutor." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px]">
      <div className="px-6 py-4 bg-purple-50 border-b border-purple-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-700">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="font-bold text-purple-900">AI Tutor</h3>
          <p className="text-xs text-purple-600 font-medium">Ask questions about this lesson</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={scrollRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user' ? 'bg-slate-900 text-white rounded-tr-sm' : 'bg-slate-100 text-slate-800 rounded-tl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2 text-slate-500 text-sm">
              <Loader2 className="animate-spin" size={16} /> Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2 relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
