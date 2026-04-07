import React, { useState, useRef } from 'react';

const VoiceLedger = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const API_URL = import.meta.env.VITE_API_URL || 'https://narisetu-j9ac.onrender.com';

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = sendAudioToBackend;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      alert("Microphone access denied. Please allow permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const sendAudioToBackend = async () => {
    setIsProcessing(true);
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    try {
      const response = await fetch(`${API_URL}/api/ledger/voice`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Backend failed to process");

      const data = await response.json();
      // Extract the 'data' field from the standardized backend success response
      setTransactions(prev => [data.data || data, ...prev]); 
    } catch (error) {
      console.error(error);
      alert("Failed to process transaction.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md border border-gray-100 mt-8">
      <h2 className="text-xl font-bold text-slate-800 mb-4">🎙️ AI Voice Ledger</h2>
      
      <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg mb-6">
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl transition-all shadow-lg ${
            isRecording ? 'bg-red-500 animate-pulse text-white scale-110' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isRecording ? '⏸' : '🎤'}
        </button>
        <p className="mt-4 text-sm text-slate-500 font-medium">
          {isRecording ? "Recording... Release to process" : "Hold to speak (e.g., '500 rupees expense')"}
        </p>
      </div>

      {isProcessing && <div className="text-center text-blue-600 font-medium animate-pulse">🤖 AI is extracting data...</div>}

      <div className="space-y-3 mt-4">
        {transactions.map((t, idx) => (
          <div key={idx} className="flex justify-between items-center p-3 rounded-lg border border-gray-200">
            <div>
              <p className="font-semibold text-slate-800">{t.description}</p>
              <p className={`text-sm font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {t.type === 'income' ? '+' : '-'} ₹{t.amount}
              </p>
            </div>
            <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 capitalize">{t.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoiceLedger;
