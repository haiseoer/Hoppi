import React, { useState, useEffect, useRef } from 'react';
import { ExpressiveMood } from '../types';

interface DesktopWidgetViewProps {
  onSendMessage: (text: string) => Promise<string | void>;
  masterName?: string;
}

export const DesktopWidgetView: React.FC<DesktopWidgetViewProps> = ({
  onSendMessage,
  masterName = 'Nguyễn Thanh Hải',
}) => {
  const [mood, setMood] = useState<ExpressiveMood>('happy');
  const [inputText, setInputText] = useState('');
  const [lastReply, setLastReply] = useState<string>(
    'Dạ chào Chủ nhân Nguyễn Thanh Hải! Hoppi đang túc trực trực tiếp trên màn hình Desktop của anh Hải 24/7. Anh cần Hoppi thực thi tác vụ gì ạ?'
  );
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Text-To-Speech (TTS)
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '').slice(0, 300);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.05;
    utterance.pitch = 1.1;

    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find((v) => v.lang.includes('vi') || v.lang.includes('VN'));
    if (viVoice) utterance.voice = viVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Toggle Voice Recognition
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Trình duyệt chưa hỗ trợ Web Speech STT.');
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = 'vi-VN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (e: any) => {
        const spoken = e.results[0][0].transcript;
        setIsListening(false);
        handleSend(spoken);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isTyping) return;

    setInputText('');
    setIsTyping(true);
    setMood('curious');

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          isMaster: true,
          responseStyle: 'energetic',
        }),
      });
      const data = await res.json();
      const reply = data.reply || 'Hoppi đã xử lý xong tác vụ của Chủ nhân.';
      setLastReply(reply);
      setMood(data.detectedMood || 'happy');
      speakText(reply);
    } catch {
      const fallback = `Dạ thưa Chủ nhân ${masterName}! Hoppi đã ghi nhận lệnh và tiếp tục túc trực 24/7 trên Desktop.`;
      setLastReply(fallback);
      setMood('happy');
      speakText(fallback);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    'Hôm nay ngày bao nhiêu',
    'Chi phí học lái xe ô tô',
    'Tạo Sheets doanh số',
    'Tạo trang chiếu 10 slide',
    'Lập kế hoạch tập luyện',
    'Dọn dẹp tăng tốc máy tính',
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col p-3 font-sans select-none overflow-hidden border border-cyan-500/30 rounded-xl shadow-2xl">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-xs font-bold tracking-wider text-cyan-300 uppercase">
            Hoppi Desktop 24/7
          </span>
        </div>
        <button
          onClick={() => {
            if (window.opener) {
              window.close();
            } else {
              window.location.href = '/';
            }
          }}
          className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900/60 transition"
          title="Mở toàn màn hình Tổng Hành Dinh 3D"
        >
          Toàn Cảnh ↗
        </button>
      </div>

      {/* Mascot Animated Face Card */}
      <div className="my-2 p-3 rounded-xl bg-gradient-to-b from-[#0e1628] to-[#0a0f1d] border border-cyan-500/20 flex flex-col items-center relative overflow-hidden">
        {/* Floating Aura */}
        <div className="absolute w-24 h-24 rounded-full bg-cyan-500/10 blur-xl pointer-events-none"></div>

        {/* Mascot Face Body */}
        <div
          className={`w-20 h-16 rounded-[2rem] bg-gradient-to-br from-slate-900 via-[#0a1124] to-black border-2 transition-all duration-300 flex items-center justify-center relative shadow-lg ${
            isSpeaking
              ? 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)] scale-105'
              : isTyping
              ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)] animate-pulse'
              : 'border-cyan-500/40'
          }`}
        >
          {/* Antenna */}
          <div className="absolute -top-3 flex flex-col items-center">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-bounce"></div>
            <div className="w-0.5 h-1.5 bg-cyan-400/80"></div>
          </div>

          {/* Animated Eyes */}
          <div className="flex items-center gap-4">
            {mood === 'happy' && (
              <>
                <div className="w-3 h-3 border-t-2 border-r-2 border-cyan-300 rounded-tr-full transform -rotate-45 shadow-[0_0_8px_#38bdf8]"></div>
                <div className="w-3 h-3 border-t-2 border-r-2 border-cyan-300 rounded-tr-full transform -rotate-45 shadow-[0_0_8px_#38bdf8]"></div>
              </>
            )}
            {mood === 'curious' && (
              <>
                <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping delay-100"></div>
              </>
            )}
            {mood === 'focused' && (
              <>
                <div className="w-3 h-1 bg-cyan-300 rounded-full shadow-[0_0_8px_#38bdf8]"></div>
                <div className="w-3 h-1 bg-cyan-300 rounded-full shadow-[0_0_8px_#38bdf8]"></div>
              </>
            )}
            {mood !== 'happy' && mood !== 'curious' && mood !== 'focused' && (
              <>
                <div className="w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8]"></div>
                <div className="w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8]"></div>
              </>
            )}
          </div>
        </div>

        <div className="mt-2 text-center">
          <div className="text-xs font-semibold text-cyan-200">Hoppi • Trợ Lý Tự Trị</div>
          <div className="text-[10px] text-slate-400">
            {isSpeaking ? 'Đang phát âm giọng nói...' : isTyping ? 'Đang suy luận & thực thi...' : 'Đang túc trực ngoài Desktop'}
          </div>
        </div>
      </div>

      {/* Response Box */}
      <div className="flex-1 bg-slate-900/70 border border-slate-800 rounded-lg p-2.5 overflow-y-auto text-xs leading-relaxed max-h-36 mb-2">
        <p className="whitespace-pre-line text-slate-200">{lastReply}</p>
        <div className="mt-2 pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
          <span>Ghi nhận từ RAG & Local Engine</span>
          <button
            onClick={() => speakText(lastReply)}
            className="text-cyan-400 hover:text-cyan-300 font-medium"
          >
            🔊 Nghe lại
          </button>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-2 scrollbar-none">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-[10px] whitespace-nowrap px-2 py-1 rounded-md bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 hover:bg-cyan-900/50 hover:border-cyan-500/60 transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-1.5"
      >
        <button
          type="button"
          onClick={toggleListening}
          className={`p-2 rounded-lg border text-sm transition ${
            isListening
              ? 'bg-rose-600 border-rose-400 text-white animate-pulse'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-cyan-300'
          }`}
          title="Nhấn để nói tiếng Việt"
        >
          🎤
        </button>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Lệnh cho Hoppi..."
          className="flex-1 bg-slate-900/90 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-semibold shadow"
        >
          Gửi
        </button>
      </form>
    </div>
  );
};
