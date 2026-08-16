import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Mic, RefreshCw, Square, Bot, Loader2 } from "lucide-react";

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
    <div className="p-6 sm:p-8 max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 mt-8 space-y-6">
      <div className="border-b border-slate-100 pb-6 flex justify-between items-start gap-4">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#B85042]/10 text-[#B85042]">
            <Mic className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <div className="pt-0.5 text-left">
            <h2 className="text-2xl font-bold text-[#0B192C]">AI Voice Ledger</h2>
            <p className="text-base text-slate-500 mt-1">Log transactions by speaking (Hindi/Hinglish supported).</p>
          </div>
        </div>
        <button
          onClick={fetchTransactions}
          className="flex items-center gap-2 text-sm bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold px-4 py-2 rounded-xl transition border border-slate-200"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Record button widget */}
      <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-2xl">
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isRecording
              ? "bg-[#B85042] animate-pulse text-white scale-110 shadow-lg shadow-[#B85042]/30"
              : "bg-[#0B192C] text-white hover:bg-[#0f2441] shadow-md hover:shadow-xl"
          }`}
        >
          {isRecording ? <Square className="h-8 w-8" strokeWidth={2.5} /> : <Mic className="h-8 w-8" strokeWidth={2.5} />}
        </button>
        <p className="mt-6 text-sm text-slate-600 font-medium">
          {isRecording ? "Recording... Release button to process" : "Hold button & speak (e.g. 'Paanch sau rupiya kharcha')"}
        </p>
      </div>

      {isProcessing && (
        <div className="flex items-center justify-center gap-2 text-base text-[#0B192C] font-semibold animate-pulse py-4">
          <Bot className="h-5 w-5 text-[#B85042]" /> AI is analyzing your voice...
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl">
        {["all", "income", "expense"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl capitalize transition tracking-wide ${
              filterType === tab ? "bg-white text-[#0B192C] shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {isLoadingHistory ? (
          <div className="text-center py-12 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 text-[#0B192C] animate-spin mb-4" />
            <p className="text-base text-slate-500">Loading transactions...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-base">
            No transactions match the selected filter.
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
                className="flex justify-between items-center p-5 border-b border-slate-100 hover:bg-slate-50/50 transition-all last:border-b-0"
              >
                <div>
                  <p className="font-bold text-[#0B192C] text-base">{t.description}</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">{dateStr}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-lg ${t.type === "income" ? "text-emerald-600" : "text-[#B85042]"}`}>
                    {t.type === "income" ? "+" : "-"} ₹{t.amount}
                  </p>
                  <span
                    className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full mt-1.5 ${
                      t.type === "income"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-[#B85042]/10 text-[#B85042]"
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
