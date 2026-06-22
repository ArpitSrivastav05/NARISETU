import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "https://narisetu-j9ac.onrender.com";

const VoiceLedger = () => {
  const { authHeaders, getToken } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [filterType, setFilterType] = useState("all"); // "all", "income", "expense"
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Fetch transaction history on load
  const fetchTransactions = async () => {
    setIsLoadingHistory(true);
    try {
      const headers = await authHeaders();
      const response = await fetch(`${API_URL}/api/transactions`, { headers });
      if (!response.ok) throw new Error("Failed to load transactions.");
      const data = await response.json();
      if (data.success) {
        setTransactions(data.data);
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

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
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const sendAudioToBackend = async () => {
    setIsProcessing(true);
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    try {
      const token = await getToken();
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/api/ledger/voice`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) throw new Error("Backend failed to process");

      const data = await response.json();
      // Prepend the new transaction to history list
      if (data.success) {
        const newTx = data.data;
        // Make sure date format matches
        const formattedTx = {
          ...newTx,
          createdAt: newTx.createdAt ? new Date(newTx.createdAt) : new Date(),
        };
        setTransactions((prev) => [formattedTx, ...prev]);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to process transaction. Please speak clearly.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    if (filterType === "all") return true;
    return t.type === filterType;
  });

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-3xl shadow-md border border-slate-100 mt-8 space-y-6">
      <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">🎙️ AI Voice Ledger</h2>
          <p className="text-xs text-slate-400 mt-0.5">Log transactions by speaking (Hindi/Hinglish supported).</p>
        </div>
        <button
          onClick={fetchTransactions}
          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold px-3 py-1.5 rounded-xl transition"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Record button widget */}
      <div className="flex flex-col items-center justify-center p-6 bg-slate-50/70 border border-slate-100 rounded-2xl">
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all shadow-lg cursor-pointer ${
            isRecording
              ? "bg-rose-500 animate-pulse text-white scale-110"
              : "bg-navy-600 text-white hover:bg-navy-700 hover:shadow-navy-600/20"
          }`}
        >
          {isRecording ? "⏸" : "🎤"}
        </button>
        <p className="mt-4 text-xs text-slate-500 font-medium">
          {isRecording ? "Recording... Release button to process" : "Hold button & speak (e.g. 'Paanch sau rupiya kharcha')"}
        </p>
      </div>

      {isProcessing && (
        <div className="flex items-center justify-center gap-2 text-sm text-navy-600 font-bold animate-pulse py-2">
          <span>🤖</span> AI is analyzing your voice...
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl">
        {["all", "income", "expense"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg uppercase transition tracking-wider ${
              filterType === tab ? "bg-white text-navy-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {isLoadingHistory ? (
          <div className="text-center py-10">
            <div className="h-6 w-6 border-2 border-slate-200 border-t-navy-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-400 mt-2">Loading transactions...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            💸 No transactions match the selected filter.
          </div>
        ) : (
          filteredTransactions.map((t) => {
            const dateStr = t.createdAt
              ? new Date(t.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Date N/A";

            return (
              <div
                key={t.id}
                className="flex justify-between items-center p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/20 transition-all"
              >
                <div>
                  <p className="font-bold text-slate-800 text-sm">{t.description}</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{dateStr}</p>
                </div>
                <div className="text-right">
                  <p className={`font-black text-sm ${t.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                    {t.type === "income" ? "+" : "-"} ₹{t.amount}
                  </p>
                  <span
                    className={`inline-block text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full mt-1.5 ${
                      t.type === "income"
                        ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/10"
                        : "bg-rose-50 text-rose-600 ring-1 ring-rose-500/10"
                    }`}
                  >
                    {t.type}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default VoiceLedger;
