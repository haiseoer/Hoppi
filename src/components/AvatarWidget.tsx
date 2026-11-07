import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExpressiveMood, AppTheme } from '../types';
import {
  Sparkles,
  Volume2,
  Mic,
  Zap,
  Heart,
  Brain,
  HelpCircle,
  Pause,
  ShieldAlert,
  Monitor,
  Key,
  Bot,
  Cloud,
  Eye,
  Radio,
  CheckCircle2,
  Wand2,
} from 'lucide-react';
import { AudioWaveformVisualizer } from './AudioWaveformVisualizer';

export type HoppiGadget = 'none' | 'monitor24h' | 'quotaVial' | 'goldenKey' | 'companionBot' | 'aiModels';

interface AvatarWidgetProps {
  mood: ExpressiveMood;
  isSpeaking: boolean;
  isListening: boolean;
  isMaster: boolean;
  onAvatarClick: () => void;
  onToggleVoice: () => void;
  onToggleListen: () => void;
  floatingMode?: boolean;
  theme?: AppTheme;
  isPaused?: boolean;
  lowPowerMode?: boolean;
  onSpeakText?: (text: string) => void;
}

export const AvatarWidget: React.FC<AvatarWidgetProps> = ({
  mood,
  isSpeaking,
  isListening,
  isMaster,
  onAvatarClick,
  onToggleVoice,
  onToggleListen,
  floatingMode = false,
  theme = 'cyberpunk',
  isPaused = false,
  lowPowerMode = false,
  onSpeakText,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isSquishing, setIsSquishing] = useState(false);
  const [activeGadget, setActiveGadget] = useState<HoppiGadget>('monitor24h');
  const [isPeekingMode, setIsPeekingMode] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Periodic automatic natural blinking loop (every 3.2 - 4.5 seconds)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3600);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Subtle mouse tracking for eye glance
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = Math.max(-4, Math.min(4, ((e.clientX - centerX) / (rect.width / 2)) * 4));
    const deltaY = Math.max(-3, Math.min(3, ((e.clientY - centerY) / (rect.height / 2)) * 3));
    setMouseOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseOffset({ x: 0, y: 0 });
  };

  // Click squish & bounce physics reaction
  const handleBallClick = () => {
    setIsSquishing(true);
    setTimeout(() => setIsSquishing(false), 450);

    // Call external avatar click (mood rotation)
    onAvatarClick();

    // Trigger voice reaction if available
    if (onSpeakText) {
      const phrases = [
        'Hoppi chào Chủ nhân Nguyễn Thanh Hải! Luôn sẵn sàng hỗ trợ!',
        'Hệ thống AI và IoT Mesh đang hoạt động mượt mà 100%!',
        'Chủ nhân muốn tôi viết code, vẽ hình hay quản lý thiết bị nào ạ?',
      ];
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      onSpeakText(randomPhrase);
    }
  };

  // Switch gadget with audio narration
  const handleSelectGadget = (gadget: HoppiGadget) => {
    setActiveGadget(gadget);
    if (onSpeakText) {
      switch (gadget) {
        case 'monitor24h':
          onSpeakText('Máy chủ đám mây hoạt động 24/7, tự động chạy tác vụ ngay cả khi bạn đang ngủ!');
          break;
        case 'quotaVial':
          onSpeakText('Bình năng lượng 100% đầy đủ, không lo tụt băng thông hay hết hạn mức!');
          break;
        case 'goldenKey':
          onSpeakText('Chìa khóa vàng xác thực thiết bị bảo mật tuyệt đối!');
          break;
        case 'companionBot':
          onSpeakText('Đây là chú bot phụ tá Codex, chuyên trách viết mã và tự động hóa công việc!');
          break;
        case 'aiModels':
          onSpeakText('Codex, Claude, và Gemini đều do Hoppi điều phối và chỉ huy nhịp nhàng!');
          break;
        case 'none':
          onSpeakText('Hoppi đã cất phụ kiện và trở về trạng thái bay tự do thoải mái!');
          break;
      }
    }
  };

  // Mood configuration
  const moodConfig = {
    happy: {
      label: 'Vui vẻ & Rực rỡ',
      auraColor: 'rgba(251, 191, 36, 0.45)',
      softHalo: 'radial-gradient(circle, rgba(251,191,36,0.5) 0%, rgba(245,158,11,0.25) 50%, transparent 75%)',
      eyeColor: '#ffffff',
      eyeGlow: '0 0 12px #ffffff, 0 0 24px rgba(251, 191, 36, 0.8)',
      icon: Sparkles,
      tagBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      antennaColor: 'bg-amber-400',
    },
    critical: {
      label: 'Cảnh Báo Khẩn',
      auraColor: 'rgba(239, 68, 68, 0.55)',
      softHalo: 'radial-gradient(circle, rgba(239,68,68,0.6) 0%, rgba(220,38,38,0.3) 50%, transparent 75%)',
      eyeColor: '#fca5a5',
      eyeGlow: '0 0 14px #ef4444, 0 0 28px rgba(239, 68, 68, 0.9)',
      icon: ShieldAlert,
      tagBg: 'bg-red-500/25 text-red-300 border-red-500/60 animate-pulse',
      antennaColor: 'bg-red-500',
    },
    curious: {
      label: 'Tò mò & Khám phá',
      auraColor: 'rgba(168, 85, 247, 0.45)',
      softHalo: 'radial-gradient(circle, rgba(168,85,247,0.45) 0%, rgba(56,189,248,0.25) 50%, transparent 75%)',
      eyeColor: '#ffffff',
      eyeGlow: '0 0 12px #ffffff, 0 0 22px rgba(168, 85, 247, 0.7)',
      icon: HelpCircle,
      tagBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      antennaColor: 'bg-purple-400',
    },
    focused: {
      label: 'Tập trung Phân tích',
      auraColor: 'rgba(34, 211, 238, 0.45)',
      softHalo: 'radial-gradient(circle, rgba(34,211,238,0.5) 0%, rgba(37,99,235,0.25) 50%, transparent 75%)',
      eyeColor: '#ffffff',
      eyeGlow: '0 0 12px #ffffff, 0 0 24px rgba(34, 211, 238, 0.8)',
      icon: Brain,
      tagBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      antennaColor: 'bg-cyan-400',
    },
    empathetic: {
      label: 'Thấu cảm & Lắng nghe',
      auraColor: 'rgba(251, 113, 133, 0.45)',
      softHalo: 'radial-gradient(circle, rgba(251,113,133,0.5) 0%, rgba(217,70,239,0.25) 50%, transparent 75%)',
      eyeColor: '#ffffff',
      eyeGlow: '0 0 12px #ffffff, 0 0 24px rgba(251, 113, 133, 0.8)',
      icon: Heart,
      tagBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      antennaColor: 'bg-rose-400',
    },
  }[mood] || {
    label: 'Vui vẻ & Rực rỡ',
    auraColor: 'rgba(56, 189, 248, 0.45)',
    softHalo: 'radial-gradient(circle, rgba(56,189,248,0.5) 0%, rgba(14,165,233,0.25) 50%, transparent 75%)',
    eyeColor: '#ffffff',
    eyeGlow: '0 0 12px #ffffff, 0 0 24px rgba(56, 189, 248, 0.8)',
    icon: Sparkles,
    tagBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    antennaColor: 'bg-cyan-400',
  };

  const CurrentMoodIcon = moodConfig.icon;

  // Idle or Waiting for User Input condition
  const isIdleOrWaiting = !isSpeaking && !isListening && !isPaused && !isSquishing;
  const isWaitingForInput = isIdleOrWaiting;

  // Theme-synchronized breathing animation phase & intensity configuration
  const themeBreathingPhases = {
    cyberpunk: {
      themeName: 'Cyberpunk',
      intensityLevel: 'Cao (High • 100%)',
      intensityFactor: 1.0,
      duration: lowPowerMode ? 4.8 : 3.0,
      scaleRange: [1, 1.055, 1], // vibrant energetic breathing amplitude
      scaleYRange: [1, 1.065, 0.985, 1], // prominent vertical respiration
      scaleXRange: [1, 0.978, 1.012, 1],
      floatY: [0, -6.5, 0], // dynamic hovering lift
      auraOpacity: [0.65, 1.0, 0.65],
      auraScale: [1, 1.22, 1],
      rimLightColor: 'rgba(6, 182, 212, 0.65)', // Bright Neon Cyan
      eyePulseOpacity: [0.9, 1.0, 0.9],
      eyePulseScaleY: [0.96, 1.08, 0.96],
      phaseLabel: 'Nhịp thở Cyberpunk (Cường độ 100% • 3.0s)',
      badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      dotColor: 'bg-cyan-400',
    },
    deepspace: {
      themeName: 'Deep Space',
      intensityLevel: 'Dịu Êm (Zen • 55%)',
      intensityFactor: 0.55,
      duration: lowPowerMode ? 7.2 : 5.2,
      scaleRange: [1, 1.022, 1], // gentle, non-intrusive nighttime breathing
      scaleYRange: [1, 1.026, 0.995, 1], // calm meditative respiration
      scaleXRange: [1, 0.992, 1.004, 1],
      floatY: [0, -3.2, 0], // subtle nocturnal buoyancy
      auraOpacity: [0.35, 0.65, 0.35],
      auraScale: [0.96, 1.06, 0.96],
      rimLightColor: 'rgba(129, 140, 248, 0.35)', // Muted Celestial Indigo
      eyePulseOpacity: [0.94, 0.99, 0.94],
      eyePulseScaleY: [0.98, 1.03, 0.98],
      phaseLabel: 'Nhịp thở Deep Space (Cường độ 55% • 5.2s)',
      badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      dotColor: 'bg-indigo-400',
    },
    light: {
      themeName: 'Daylight',
      intensityLevel: 'Cân Bằng (Diurnal • 78%)',
      intensityFactor: 0.78,
      duration: lowPowerMode ? 5.8 : 3.8,
      scaleRange: [1, 1.036, 1], // natural daytime human breathing rhythm
      scaleYRange: [1, 1.042, 0.992, 1],
      scaleXRange: [1, 0.985, 1.008, 1],
      floatY: [0, -4.8, 0], // balanced daylight respiration
      auraOpacity: [0.5, 0.85, 0.5],
      auraScale: [1, 1.12, 1],
      rimLightColor: 'rgba(56, 189, 248, 0.45)', // Sky-Blue Azure
      eyePulseOpacity: [0.92, 1.0, 0.92],
      eyePulseScaleY: [0.97, 1.05, 0.97],
      phaseLabel: 'Nhịp thở Daylight (Cường độ 78% • 3.8s)',
      badgeClass: 'bg-sky-500/20 text-sky-700 border-sky-400/50',
      dotColor: 'bg-sky-400',
    },
  };

  const currentThemePhase = themeBreathingPhases[theme] || themeBreathingPhases.cyberpunk;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative select-none transition-all duration-300 ${
        floatingMode
          ? 'fixed bottom-6 right-6 z-50 flex flex-col items-end'
          : 'flex flex-col items-center w-full'
      }`}
    >
      {/* Top Status Tooltip */}
      <AnimatePresence>
        {(isHovered || isSpeaking || isListening) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="mb-2 px-3.5 py-1.5 rounded-full bg-slate-900/95 border border-slate-700/80 backdrop-blur-md shadow-2xl flex items-center gap-2 text-xs font-medium text-slate-200 pointer-events-none z-30"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isListening
                  ? 'bg-red-400 animate-ping'
                  : isSpeaking
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-emerald-400'
              }`}
            />
            <span>
              {isPaused
                ? 'Hoppi đang tạm nghỉ (Vẫy tay 👋 để đánh thức)...'
                : isListening
                ? 'Hoppi đang lắng nghe...'
                : isSpeaking
                ? 'Hoppi đang phát âm thanh...'
                : `Hoppi Bot: ${moodConfig.label} • ${currentThemePhase.phaseLabel}`}
            </span>
            <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800 font-mono">
              Live Bot
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Mascot Stage Container */}
      <div className="relative flex items-center justify-center py-2 px-4 min-h-[170px] w-full max-w-[340px]">
        {/* Soft Ambient Studio Lighting Aura synchronized with Theme Breathing Phase */}
        <motion.div
          animate={
            isWaitingForInput
              ? {
                  scale: currentThemePhase.auraScale,
                  opacity: currentThemePhase.auraOpacity,
                }
              : { scale: 1, opacity: 0.8 }
          }
          transition={{
            repeat: Infinity,
            duration: currentThemePhase.duration,
            ease: 'easeInOut',
          }}
          style={{
            background:
              theme === 'light'
                ? 'radial-gradient(circle, rgba(186,230,253,0.7) 0%, rgba(125,211,252,0.35) 45%, transparent 72%)'
                : moodConfig.softHalo,
          }}
          className="absolute inset-0 w-64 h-64 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full blur-2xl pointer-events-none transition-opacity duration-700"
        />

        {/* AI Model Satellite Badges Floating Overhead (from video: Codex, Claude, Gemini) */}
        <AnimatePresence>
          {activeGadget === 'aiModels' && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 pointer-events-none"
            >
              <div className="flex flex-col items-center">
                <div className="px-2 py-1 rounded-xl bg-blue-600/90 text-white text-[10px] font-bold shadow-lg shadow-blue-500/30 flex items-center gap-1 border border-blue-400">
                  <span className="font-mono text-[9px]">&gt;_</span>
                  <span>Codex</span>
                </div>
                <div className="w-0.5 h-3 border-l border-dashed border-blue-400/80" />
              </div>

              <div className="flex flex-col items-center -translate-y-1">
                <div className="px-2 py-1 rounded-xl bg-orange-600/90 text-white text-[10px] font-bold shadow-lg shadow-orange-500/30 flex items-center gap-1 border border-orange-400">
                  <Sparkles size={10} />
                  <span>Claude</span>
                </div>
                <div className="w-0.5 h-4 border-l border-dashed border-orange-400/80" />
              </div>

              <div className="flex flex-col items-center">
                <div className="px-2 py-1 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-[10px] font-bold shadow-lg shadow-purple-500/30 flex items-center gap-1 border border-cyan-400">
                  <Zap size={10} />
                  <span>Gemini</span>
                </div>
                <div className="w-0.5 h-3 border-l border-dashed border-cyan-400/80" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mascot Center Box (Peeking Mode or Full Floating Mode) */}
        <div className="relative flex items-center justify-center">
          {/* LEFT DETACHED FLOATING HAND SPHERE */}
          <motion.div
            animate={{
              y: isPaused
                ? 10
                : isSpeaking
                ? [-4, -14, -4]
                : isSquishing
                ? [-8, -2, -6]
                : isWaitingForInput
                ? [-1, -5, -1]
                : [0, -6, 0],
              x: isHovered ? -4 : 0,
              rotate: isSpeaking
                ? [-10, 15, -10]
                : isWaitingForInput
                ? [-2, 3, -2]
                : [0, 5, 0],
            }}
            transition={{
              repeat: isSquishing ? 0 : Infinity,
              duration: isSpeaking
                ? 0.7
                : isWaitingForInput
                ? currentThemePhase.duration
                : lowPowerMode
                ? 4
                : 2.4,
              ease: 'easeInOut',
            }}
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
          >
            {/* Glossy Black Spherical Hand with 3D Specular Highlight */}
            <div className="relative w-5 h-5 rounded-full bg-gradient-to-br from-slate-700 via-slate-900 to-black shadow-md border border-slate-700/50">
              {/* Specular curved reflection */}
              <div className="absolute top-0.5 left-1 w-2 h-1 bg-white/40 rounded-full rotate-[-25deg] blur-[0.3px]" />
              {/* Subtle blue rim bounce light */}
              <div className="absolute bottom-0.5 right-1 w-1.5 h-0.5 bg-cyan-400/25 rounded-full blur-[0.5px]" />
            </div>
          </motion.div>

          {/* MAIN BLACK SPHERICAL HEAD / BODY WITH SYNCHRONIZED BREATHING */}
          <motion.div
            onClick={handleBallClick}
            animate={{
              y: isPeekingMode
                ? isHovered
                  ? 4
                  : 18
                : isPaused
                ? 4
                : isSpeaking
                ? [0, -8, 0]
                : isWaitingForInput
                ? currentThemePhase.floatY
                : [0, -6, 0],
              scale: isWaitingForInput && !isSquishing ? currentThemePhase.scaleRange : 1,
              scaleY: isSquishing
                ? [1, 0.74, 1.16, 0.94, 1]
                : isPaused
                ? 0.98
                : isWaitingForInput
                ? currentThemePhase.scaleYRange
                : 1,
              scaleX: isSquishing
                ? [1, 1.26, 0.88, 1.05, 1]
                : isPaused
                ? 1.02
                : isWaitingForInput
                ? currentThemePhase.scaleXRange
                : 1,
              rotate: mood === 'curious' ? 6 : mood === 'empathetic' ? -4 : 0,
            }}
            transition={{
              repeat: isSquishing ? 0 : Infinity,
              duration: isSpeaking
                ? 0.6
                : isWaitingForInput
                ? currentThemePhase.duration
                : lowPowerMode
                ? 4.5
                : 2.6,
              ease: 'easeInOut',
            }}
            className="relative flex flex-col items-center cursor-pointer group"
          >
            {/* Top Antenna with floating orbital white halo ring (from vector mascot) */}
            <div className="relative -mb-2 flex flex-col items-center z-20 pointer-events-none">
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-b from-slate-600 via-slate-900 to-black border border-slate-600 shadow-md" />
              <motion.div
                animate={{ rotateX: [65, 75, 65], rotateZ: [0, 360] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
                className="absolute top-0.5 w-6 h-3 rounded-full border-2 border-white/95 shadow-[0_0_8px_#ffffff] pointer-events-none"
              />
              <div className="w-1.5 h-3 bg-slate-800" />
            </div>

            {/* Main Pear-Shaped Head Shell */}
            <div
              className="relative w-28 h-24 rounded-[36px] shadow-2xl flex flex-col items-center justify-center overflow-hidden"
              style={{
                background:
                  'radial-gradient(circle at 34% 26%, #475569 0%, #1e293b 22%, #0b0f19 52%, #000000 88%)',
                boxShadow:
                  theme === 'light'
                    ? '0 18px 35px -5px rgba(0, 0, 0, 0.4), 0 0 20px rgba(56, 189, 248, 0.25)'
                    : `0 20px 40px -8px rgba(0, 0, 0, 0.8), 0 0 35px ${moodConfig.auraColor}`,
              }}
            >
              {/* Top-Left Glossy 3D Reflection Arc */}
              <div className="absolute top-2 left-4 w-10 h-5 bg-gradient-to-b from-white/35 via-white/10 to-transparent rounded-[50%] rotate-[-26deg] blur-[0.4px] pointer-events-none z-20" />

              {/* Smooth Curved White Visor (Exact match to vector) */}
              <div className="relative w-22 h-17 rounded-[26px] bg-gradient-to-b from-white via-slate-50 to-slate-200 shadow-lg border border-white/95 flex flex-col items-center justify-center overflow-hidden">
                {/* Visor 3D Specular Highlight */}
                <div className="absolute top-1.5 left-3 w-8 h-3 bg-white rounded-full rotate-[-15deg] opacity-85 blur-[0.3px] pointer-events-none" />

                {/* GLOWING CAPSULE EYES ROW */}
                <div
                  style={{
                    transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px)`,
                    transition: 'transform 0.12s ease-out',
                  }}
                  className="flex items-center gap-3.5 z-10"
                >
                  {/* Left Eye */}
                  <div className="relative">
                    {mood === 'happy' && !isBlinking && !isPaused ? (
                      <svg width="20" height="20" viewBox="0 0 20 20" className="overflow-visible">
                        <path
                          d="M 3 13 Q 10 3 17 13"
                          fill="none"
                          stroke="#0f172a"
                          strokeWidth="3.6"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      <motion.div
                        animate={{
                          scaleY: isBlinking || isPaused ? 0.08 : isSpeaking ? [0.9, 1.15, 0.9] : 1,
                        }}
                        className="w-4 h-6 rounded-full bg-slate-950 relative flex items-center justify-center shadow-sm"
                      >
                        <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1 left-1 opacity-95" />
                        <div className="w-0.5 h-0.5 bg-white/70 rounded-full absolute bottom-1.5 right-1" />
                      </motion.div>
                    )}
                  </div>

                  {/* Right Eye */}
                  <div className="relative">
                    {mood === 'happy' && !isBlinking && !isPaused ? (
                      <svg width="20" height="20" viewBox="0 0 20 20" className="overflow-visible">
                        <path
                          d="M 3 13 Q 10 3 17 13"
                          fill="none"
                          stroke="#0f172a"
                          strokeWidth="3.6"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      <motion.div
                        animate={{
                          scaleY: isBlinking || isPaused ? 0.08 : isSpeaking ? [0.9, 1.15, 0.9] : 1,
                        }}
                        className="w-4 h-6 rounded-full bg-slate-950 relative flex items-center justify-center shadow-sm"
                      >
                        <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1 left-1 opacity-95" />
                        <div className="w-0.5 h-0.5 bg-white/70 rounded-full absolute bottom-1.5 right-1" />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Sweet Curved Smile Line (‿) */}
                <div className="mt-1 z-10 flex items-center justify-center">
                  <svg width="14" height="6" viewBox="0 0 14 6" className="overflow-visible">
                    <path
                      d="M 2 1 Q 7 6 12 1"
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Speaking Audio Wave Ripples around the Ball */}
              {isSpeaking && (
                <motion.div
                  animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ repeat: Infinity, duration: 1.1 }}
                  className="absolute -inset-2 rounded-full border-2 border-cyan-400/40 pointer-events-none"
                />
              )}
            </div>

            {/* Lower Floating Body with White Center Disc (Exact match to vector!) */}
            <div className="relative -mt-1.5 w-14 h-9 rounded-full bg-gradient-to-b from-slate-700 to-black border border-slate-700 shadow-lg flex items-center justify-center z-10">
              <div className="w-5 h-5 rounded-full bg-white shadow-inner border border-slate-200" />
            </div>
          </motion.div>

          {/* RIGHT DETACHED FLOATING HAND SPHERE (Holds gadgets or waves) */}
          <motion.div
            animate={{
              y: isPaused
                ? 10
                : isSpeaking
                ? [-2, -12, -2]
                : isSquishing
                ? [-6, 0, -5]
                : isWaitingForInput
                ? [-3, 3, -3]
                : [-4, 2, -4],
              x: isHovered ? 4 : 0,
              rotate: isSpeaking
                ? [10, -15, 10]
                : isWaitingForInput
                ? [2, -3, 2]
                : [0, -5, 0],
            }}
            transition={{
              repeat: isSquishing ? 0 : Infinity,
              duration: isSpeaking
                ? 0.7
                : isWaitingForInput
                ? currentThemePhase.duration
                : lowPowerMode
                ? 4
                : 2.5,
              ease: 'easeInOut',
            }}
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center"
          >
            {/* Glossy Black Spherical Hand */}
            <div className="relative w-5 h-5 rounded-full bg-gradient-to-br from-slate-700 via-slate-900 to-black shadow-md border border-slate-700/50">
              <div className="absolute top-0.5 left-1 w-2 h-1 bg-white/40 rounded-full rotate-[-25deg] blur-[0.3px]" />
              <div className="absolute bottom-0.5 right-1 w-1.5 h-0.5 bg-cyan-400/25 rounded-full blur-[0.5px]" />
            </div>

            {/* Speaking Sound Ripple Waves radiating from right hand (from clip 00:01) */}
            {isSpeaking && (
              <div className="absolute left-6 flex items-center gap-0.5 pointer-events-none">
                <motion.span
                  animate={{ opacity: [0, 1, 0], scale: [0.7, 1.2, 0.7] }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                  className="w-1.5 h-3 border-r-2 border-cyan-400 rounded-r-full"
                />
                <motion.span
                  animate={{ opacity: [0, 1, 0], scale: [0.7, 1.2, 0.7] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                  className="w-2 h-5 border-r-2 border-cyan-400 rounded-r-full"
                />
              </div>
            )}
          </motion.div>

          {/* GADGET 1: 24h Cloud Monitor (from video 00:12: 24h 一直在线 screen) */}
          <AnimatePresence>
            {activeGadget === 'monitor24h' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.7, x: 20 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="absolute -right-28 top-1/2 -translate-y-1/2 z-30 pointer-events-auto"
                title="Máy chủ đám mây hoạt động 24h liên tục"
              >
                <div className="p-2 rounded-xl bg-gradient-to-b from-blue-900/90 to-slate-950 border-2 border-blue-400/80 shadow-2xl shadow-blue-500/30 text-white min-w-[95px] backdrop-blur-md">
                  <div className="flex items-center justify-between gap-1 border-b border-blue-400/30 pb-1 mb-1">
                    <span className="font-mono font-black text-xs text-white tracking-wide">
                      24h
                    </span>
                    <span className="flex items-center gap-1 text-[8px] text-emerald-400 font-semibold font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Online
                    </span>
                  </div>
                  <div className="space-y-0.5 text-[8px] text-blue-200 font-medium">
                    <div className="flex items-center gap-1 text-emerald-300">
                      <CheckCircle2 size={8} />
                      <span>Viết code</span>
                    </div>
                    <div className="flex items-center gap-1 text-cyan-300">
                      <CheckCircle2 size={8} />
                      <span>Phân tích</span>
                    </div>
                    <div className="flex items-center gap-1 text-indigo-300">
                      <CheckCircle2 size={8} />
                      <span>Tự động 24/7</span>
                    </div>
                  </div>
                </div>
                {/* Stand stem */}
                <div className="w-1.5 h-2 bg-slate-700 mx-auto" />
                <div className="w-6 h-1 bg-slate-600 rounded-full mx-auto" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* GADGET 2: 100% Quota Potion Bottle (from video 00:07: 额度 100%) */}
          <AnimatePresence>
            {activeGadget === 'quotaVial' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.7, y: 10 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="absolute -right-16 top-1/2 -translate-y-1/2 z-30 pointer-events-auto flex flex-col items-center"
                title="Bình năng lượng 100% băng thông"
              >
                {/* Cork */}
                <div className="w-2.5 h-1 bg-amber-800 rounded-t-sm" />
                {/* Bottle body */}
                <div className="w-7 h-10 rounded-b-xl rounded-t-sm border border-cyan-300/80 bg-cyan-950/80 p-0.5 flex flex-col justify-end shadow-lg shadow-cyan-500/40 relative overflow-hidden backdrop-blur-sm">
                  <div className="w-full h-8 bg-gradient-to-t from-cyan-500 via-sky-400 to-cyan-300 rounded-b-lg relative overflow-hidden">
                    <motion.div
                      animate={{ y: [-1, 1, -1] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      className="absolute inset-0 bg-white/20"
                    />
                  </div>
                  <span className="absolute inset-0 flex items-center justify-center font-mono font-black text-[9px] text-white drop-shadow-md">
                    100%
                  </span>
                </div>
                {/* Speech Pill: Không tụt băng thông */}
                <div className="mt-1 px-1.5 py-0.5 rounded-full bg-blue-600/90 text-white font-bold text-[8px] whitespace-nowrap shadow-md border border-blue-300">
                  Hạn mức 100%
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* GADGET 3: Golden Key (from video 01:30: 🔑 device auth) */}
          <AnimatePresence>
            {activeGadget === 'goldenKey' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.7, rotate: -20 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="absolute -right-14 top-1/2 -translate-y-1/2 z-30 pointer-events-auto flex items-center gap-1"
                title="Chìa khóa vàng xác thực"
              >
                <div className="p-1.5 rounded-xl bg-amber-500/20 border border-amber-400/80 shadow-lg shadow-amber-500/30 flex items-center gap-1">
                  <Key size={18} className="text-amber-300 animate-pulse" />
                  <span className="font-mono text-[9px] text-amber-200 font-bold">AUTH</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* GADGET 4: Mini Companion Bot (from video 00:46: Codex Tool Bot) */}
          <AnimatePresence>
            {activeGadget === 'companionBot' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6, x: 25 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  y: [-3, 3, -3],
                }}
                exit={{ opacity: 0, scale: 0.6, x: 25 }}
                transition={{
                  repeat: Infinity,
                  duration: 2.2,
                  ease: 'easeInOut',
                }}
                className="absolute -right-18 top-1/2 -translate-y-1/2 z-30 pointer-events-auto flex flex-col items-center"
                title="Chú bot phụ tá Codex"
              >
                {/* Mini Blue Sphere Bot */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-950 shadow-xl border border-blue-300 flex items-center justify-center relative">
                  {/* Gloss highlight */}
                  <div className="absolute top-1 left-1.5 w-3 h-1.5 bg-white/40 rounded-full rotate-[-25deg] blur-[0.2px]" />
                  {/* Capsule mini eyes */}
                  <div className="flex items-center gap-1.5 z-10">
                    <motion.div
                      animate={{ scaleY: isBlinking ? 0.1 : 1 }}
                      transition={{ duration: 0.12 }}
                      className="w-1 h-2.5 bg-white rounded-full shadow-[0_0_6px_#fff]"
                    />
                    <motion.div
                      animate={{ scaleY: isBlinking ? 0.1 : 1 }}
                      transition={{ duration: 0.12 }}
                      className="w-1 h-2.5 bg-white rounded-full shadow-[0_0_6px_#fff]"
                    />
                  </div>
                </div>
                {/* Mini Bot Tag */}
                <span className="mt-1 px-1.5 py-0.2 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 font-mono text-[8px] font-bold">
                  Codex Bot
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PEEKING LEDGE (Appears when Peeking Mode is enabled, mimicking video 00:00 & 04:22) */}
        {isPeekingMode && (
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-slate-900/90 border-t-2 border-slate-700/80 rounded-t-xl z-25 flex items-center justify-between px-3 shadow-lg pointer-events-none">
            <span className="text-[9px] font-mono text-slate-400">Hoppi Peek Ledge</span>
            <span className="text-[8px] text-cyan-400">Click để nhảy lên 👆</span>
          </div>
        )}

        {/* Quick Voice & Mic Toggle Buttons */}
        <div className="absolute -bottom-2 -left-1 flex items-center gap-1.5 z-30">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleListen();
            }}
            title={isListening ? 'Dừng nghe' : 'Nói "Hey Hoppi" hoặc bấm để nói'}
            className={`p-2 rounded-full border backdrop-blur-md transition-all shadow-lg cursor-pointer ${
              isListening
                ? 'bg-red-500/90 text-white border-red-300 shadow-red-500/50 scale-110 animate-pulse'
                : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-cyan-400 hover:text-cyan-300'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVoice();
            }}
            title={isSpeaking ? 'Dừng đọc' : 'Kích hoạt đọc âm thanh'}
            className={`p-2 rounded-full border backdrop-blur-md transition-all shadow-lg cursor-pointer ${
              isSpeaking
                ? 'bg-cyan-500/90 text-slate-950 border-cyan-300 shadow-cyan-500/50 scale-110'
                : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-emerald-400 hover:text-emerald-300'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mood status chip */}
        <div className="absolute -top-1 -right-1 z-30">
          <AnimatePresence mode="wait">
            <motion.div
              key={isPaused ? 'paused-chip' : mood}
              initial={{ opacity: 0, y: -8, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 420, damping: 25 }}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-medium backdrop-blur-md shadow-md ${
                isPaused ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : moodConfig.tagBg
              }`}
            >
              {isPaused ? <Pause className="w-3 h-3 shrink-0" /> : <CurrentMoodIcon className="w-3 h-3 shrink-0" />}
              <span>
                {isPaused
                  ? 'Tạm nghỉ'
                  : mood === 'happy'
                  ? 'Vui (Gold)'
                  : mood === 'critical'
                  ? 'Khẩn Cấp (Red)'
                  : mood === 'curious'
                  ? 'Tò mò'
                  : mood === 'focused'
                  ? 'Tập trung'
                  : 'Thấu cảm'}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Subtle Synchronized Theme Breathing Intensity Indicator (Idle / Waiting for Input) */}
      <div className="mt-1 flex items-center justify-center">
        <div
          className={`px-2.5 py-0.5 rounded-full border text-[9px] font-mono flex items-center gap-1.5 backdrop-blur-md transition-all ${
            isIdleOrWaiting
              ? currentThemePhase.badgeClass
              : 'bg-slate-900/60 border-slate-800 text-slate-500'
          }`}
          title={`Đang đồng bộ cường độ nhịp thở với theme '${theme}': ${currentThemePhase.intensityLevel}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${currentThemePhase.dotColor} ${
              isIdleOrWaiting ? 'animate-pulse' : 'opacity-40'
            }`}
          />
          <span className="font-semibold">{currentThemePhase.themeName}</span>
          <span className="opacity-60">•</span>
          <span>
            {isIdleOrWaiting
              ? currentThemePhase.intensityLevel
              : isSpeaking
              ? 'Đang phát âm'
              : isListening
              ? 'Đang lắng nghe'
              : 'Tạm nghỉ'}
          </span>
        </div>
      </div>

      {/* VIDEO GADGET SELECTOR BAR (Exact tools from video clip: 24h, 100%, Key, Bot, Multi-AI, Peek) */}
      <div className="mt-2.5 w-full flex items-center justify-center gap-1 flex-wrap text-[10px]">
        <button
          onClick={() => handleSelectGadget(activeGadget === 'monitor24h' ? 'none' : 'monitor24h')}
          className={`px-2 py-0.5 rounded-lg border font-medium flex items-center gap-1 transition-all cursor-pointer ${
            activeGadget === 'monitor24h'
              ? 'bg-blue-500/20 text-blue-300 border-blue-400/80 shadow-sm font-semibold'
              : 'text-slate-400 border-slate-800/80 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
          title="Màn hình đám mây 24h (24h 一直在线)"
        >
          <Monitor size={10} className={activeGadget === 'monitor24h' ? 'text-blue-400' : ''} />
          <span>24h Cloud</span>
        </button>

        <button
          onClick={() => handleSelectGadget(activeGadget === 'quotaVial' ? 'none' : 'quotaVial')}
          className={`px-2 py-0.5 rounded-lg border font-medium flex items-center gap-1 transition-all cursor-pointer ${
            activeGadget === 'quotaVial'
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/80 shadow-sm font-semibold'
              : 'text-slate-400 border-slate-800/80 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
          title="Bình năng lượng 100% Quota (额度 100%)"
        >
          <Zap size={10} className={activeGadget === 'quotaVial' ? 'text-cyan-400' : ''} />
          <span>100% Quota</span>
        </button>

        <button
          onClick={() => handleSelectGadget(activeGadget === 'companionBot' ? 'none' : 'companionBot')}
          className={`px-2 py-0.5 rounded-lg border font-medium flex items-center gap-1 transition-all cursor-pointer ${
            activeGadget === 'companionBot'
              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400/80 shadow-sm font-semibold'
              : 'text-slate-400 border-slate-800/80 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
          title="Chú bot phụ tá Codex"
        >
          <Bot size={10} className={activeGadget === 'companionBot' ? 'text-indigo-400' : ''} />
          <span>Codex Bot</span>
        </button>

        <button
          onClick={() => handleSelectGadget(activeGadget === 'goldenKey' ? 'none' : 'goldenKey')}
          className={`px-2 py-0.5 rounded-lg border font-medium flex items-center gap-1 transition-all cursor-pointer ${
            activeGadget === 'goldenKey'
              ? 'bg-amber-500/20 text-amber-300 border-amber-400/80 shadow-sm font-semibold'
              : 'text-slate-400 border-slate-800/80 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
          title="Chìa khóa vàng xác thực"
        >
          <Key size={10} className={activeGadget === 'goldenKey' ? 'text-amber-400' : ''} />
          <span>Key</span>
        </button>

        <button
          onClick={() => handleSelectGadget(activeGadget === 'aiModels' ? 'none' : 'aiModels')}
          className={`px-2 py-0.5 rounded-lg border font-medium flex items-center gap-1 transition-all cursor-pointer ${
            activeGadget === 'aiModels'
              ? 'bg-purple-500/20 text-purple-300 border-purple-400/80 shadow-sm font-semibold'
              : 'text-slate-400 border-slate-800/80 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
          title="Hệ sinh thái AI: Codex, Claude, Gemini"
        >
          <Sparkles size={10} className={activeGadget === 'aiModels' ? 'text-purple-400' : ''} />
          <span>Multi-AI</span>
        </button>

        <button
          onClick={() => setIsPeekingMode(!isPeekingMode)}
          className={`px-2 py-0.5 rounded-lg border font-medium flex items-center gap-1 transition-all cursor-pointer ${
            isPeekingMode
              ? 'bg-rose-500/20 text-rose-300 border-rose-400/80 shadow-sm font-semibold'
              : 'text-slate-400 border-slate-800/80 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
          title="Chế độ Núp mép (Peeking Ledge) từ video"
        >
          <Eye size={10} className={isPeekingMode ? 'text-rose-400' : ''} />
          <span>{isPeekingMode ? 'Núp mép: BẬT' : 'Núp mép'}</span>
        </button>
      </div>

      {/* Dynamic Real-time Audio Waveform Visualizer synced with Web Speech synthesis */}
      <AudioWaveformVisualizer
        isSpeaking={isSpeaking}
        mood={mood}
        theme={theme}
        lowPowerMode={lowPowerMode}
      />
    </div>
  );
};
