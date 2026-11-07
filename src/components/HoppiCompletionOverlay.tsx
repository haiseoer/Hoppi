import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HoppiCompletionNotice, AppTheme } from '../types';
import {
  Sparkles,
  Volume2,
  VolumeX,
  X,
  CheckCircle2,
  ExternalLink,
  Laptop,
  Smartphone,
  Server,
  Tablet,
  Bot,
  Zap,
} from 'lucide-react';

interface HoppiCompletionOverlayProps {
  notice: HoppiCompletionNotice | null;
  onDismiss: () => void;
  onViewDetails?: (notice: HoppiCompletionNotice) => void;
  onReplayVoice?: (text: string) => void;
  theme?: AppTheme;
}

export const HoppiCompletionOverlay: React.FC<HoppiCompletionOverlayProps> = ({
  notice,
  onDismiss,
  onViewDetails,
  onReplayVoice,
  theme = 'cyberpunk',
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Automatically speak notification when a new completion notice arrives
  useEffect(() => {
    if (notice) {
      speakNotice(notice.spokenMessage);
    }
  }, [notice]);

  const speakNotice = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[*_#`[\]()$]/g, '').slice(0, 320);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.08;
    utterance.pitch = 1.1; // Friendly robotic cheerful pitch

    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find((v) => v.lang.startsWith('vi') || v.lang.includes('VN'));
    if (viVoice) {
      utterance.voice = viVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const getDeviceIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('server') || lower.includes('ubuntu') || lower.includes('vps')) {
      return <Server className="w-3.5 h-3.5 text-emerald-400" />;
    }
    if (lower.includes('iphone') || lower.includes('phone') || lower.includes('android')) {
      return <Smartphone className="w-3.5 h-3.5 text-cyan-400" />;
    }
    if (lower.includes('ipad') || lower.includes('tablet')) {
      return <Tablet className="w-3.5 h-3.5 text-amber-400" />;
    }
    return <Laptop className="w-3.5 h-3.5 text-indigo-400" />;
  };

  return (
    <AnimatePresence>
      {notice && (
        <motion.div
          key={notice.id}
          initial={{ opacity: 0, y: -40, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.9 }}
          transition={{ type: 'spring', damping: 18, stiffness: 220 }}
          className="fixed top-20 right-4 sm:right-8 z-50 max-w-md w-[92vw] sm:w-[420px] pointer-events-auto"
        >
          <div
            className={`rounded-2xl border p-4 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all ${
              theme === 'light'
                ? 'bg-white/95 border-cyan-400/80 shadow-cyan-500/20 text-slate-800'
                : theme === 'deepspace'
                ? 'bg-[#0a0f1d]/95 border-indigo-500/60 shadow-indigo-500/20 text-slate-100'
                : 'bg-slate-950/95 border-cyan-500/70 shadow-cyan-500/30 text-slate-100'
            }`}
          >
            {/* Glowing Accent Aura */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

            {/* Header row: Hoppi Mascot Avatar + Device badge + Close */}
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-3">
                {/* Expressive Animated Hoppi Avatar Icon */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/30 animate-[pulse_2s_ease-in-out_infinite]">
                    <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center relative overflow-hidden">
                      {/* Little robot ears */}
                      <div className="absolute top-1 left-1.5 w-1 h-2 bg-cyan-400 rounded-full" />
                      <div className="absolute top-1 right-1.5 w-1 h-2 bg-cyan-400 rounded-full" />

                      {/* Robot face */}
                      <Bot className="w-6 h-6 text-cyan-400 animate-bounce" />

                      {/* Cheerful smiling cheeks */}
                      <div className="absolute bottom-2.5 left-2.5 w-1.5 h-1 bg-pink-400/70 rounded-full" />
                      <div className="absolute bottom-2.5 right-2.5 w-1.5 h-1 bg-pink-400/70 rounded-full" />
                    </div>
                  </div>

                  {/* Pulsing online badge */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1 font-mono">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Hoppi Báo Cáo
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                      Hoàn thành
                    </span>
                  </div>

                  {/* Source Device indicator */}
                  <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-300">
                    {getDeviceIcon(notice.sourceDeviceName)}
                    <span className="font-semibold truncate max-w-[170px]">
                      {notice.sourceDeviceName}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-[10px] text-slate-400 font-mono">{notice.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onDismiss}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                title="Đóng thông báo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notification Body / Speech Bubble */}
            <div
              className={`p-3 rounded-xl border text-xs leading-relaxed mb-3 relative ${
                theme === 'light'
                  ? 'bg-slate-100/90 border-slate-200 text-slate-800'
                  : 'bg-slate-900/80 border-slate-800 text-slate-200'
              }`}
            >
              <div className="font-semibold text-cyan-400 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{notice.taskTitle}</span>
              </div>
              <p className="text-slate-300 leading-snug">{notice.summary}</p>

              {/* Spoken message callout */}
              <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-start gap-1.5 text-[11px] text-cyan-300/90 italic">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>"{notice.spokenMessage}"</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() => speakNotice(notice.spokenMessage)}
                title="Đọc lại giọng nói thông báo"
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSpeaking
                    ? 'bg-cyan-500/25 text-cyan-300 border-cyan-400'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-cyan-400 animate-pulse' : ''}`} />
                <span>{isSpeaking ? 'Đang đọc...' : 'Nghe lại'}</span>
              </button>

              <div className="flex items-center gap-1.5">
                {onViewDetails && (
                  <button
                    type="button"
                    onClick={() => {
                      onViewDetails(notice);
                      onDismiss();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs transition-all shadow-sm shadow-cyan-500/20 cursor-pointer flex items-center gap-1"
                  >
                    <span>Xem báo cáo</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={onDismiss}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium text-xs transition-colors cursor-pointer"
                >
                  Xong
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
