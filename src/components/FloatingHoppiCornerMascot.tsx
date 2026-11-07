import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Mic,
  Maximize2,
  Minimize2,
  X,
  Send,
  Zap,
  Bot,
  Crown,
  CheckCircle2,
  Move,
  RotateCcw,
  Smile,
  Eye,
  Sliders,
  Cpu,
  Radio,
  Loader2,
  Heart,
  Flame,
  ExternalLink,
} from 'lucide-react';
import { ExpressiveMood, AppTheme, UserIdentity } from '../types';
import { useHoppiGlobalOverlay } from '../context/HoppiGlobalOverlayContext';

interface FloatingHoppiCornerMascotProps {
  mood: ExpressiveMood;
  isSpeaking: boolean;
  isListening: boolean;
  isThinking?: boolean; // Thinking state when AI is generating/processing
  identity: UserIdentity | null;
  theme?: AppTheme;
  isMainAppMinimized: boolean;
  onRestoreMainApp: () => void;
  onMinimizeMainApp?: () => void;
  onQuickSendMessage: (text: string) => void;
  onToggleVoice: () => void;
  onToggleListen: () => void;
  onChangeMood?: (mood: ExpressiveMood) => void;
}

export const FloatingHoppiCornerMascot: React.FC<FloatingHoppiCornerMascotProps> = ({
  mood = 'happy',
  isSpeaking,
  isListening,
  isThinking = false,
  identity,
  theme = 'cyberpunk',
  isMainAppMinimized,
  onRestoreMainApp,
  onMinimizeMainApp,
  onQuickSendMessage,
  onToggleVoice,
  onToggleListen,
  onChangeMood,
}) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [quickInput, setQuickInput] = useState('');
  const [isBlinking, setIsBlinking] = useState(false);
  const [isSquishing, setIsSquishing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragMoved, setDragMoved] = useState(false);
  const [isLocalListening, setIsLocalListening] = useState(false);
  const [previewThinking, setPreviewThinking] = useState(false);
  const [heartBurst, setHeartBurst] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Connect to Persistent Global State Container (Root Desktop Overlay)
  let globalOverlay: any = null;
  try {
    globalOverlay = useHoppiGlobalOverlay();
  } catch {
    // Graceful fallback if rendered outside provider
  }

  // Free Draggable Desktop Position (defaults near upper-right matching Master's desktop screenshot)
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    try {
      const saved = localStorage.getItem('hoppi_desktop_mascot_pos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved mascot position:', e);
    }

    const defaultX = typeof window !== 'undefined' ? Math.max(30, window.innerWidth - 240) : 1050;
    const defaultY = 120;
    return { x: defaultX, y: defaultY };
  });

  // Effective Position & Minimized State from Persistent Global State
  const activePosition = globalOverlay?.mascotPosition || position;
  const activeMinimized = typeof isMainAppMinimized === 'boolean'
    ? isMainAppMinimized
    : (globalOverlay?.isMainAppMinimized ?? false);

  const handleRestore = () => {
    if (onRestoreMainApp) onRestoreMainApp();
    if (globalOverlay?.restoreMainApp) globalOverlay.restoreMainApp();
  };

  const handleMinimize = () => {
    if (onMinimizeMainApp) onMinimizeMainApp();
    if (globalOverlay?.minimizeMainApp) globalOverlay.minimizeMainApp();
  };

  // Pop-out Document Picture-in-Picture Desktop Floating Window
  const handlePopOutDesktopWidget = async () => {
    if (typeof window === 'undefined') return;

    if ('documentPictureInPicture' in window) {
      try {
        const pipWindow = await (window as any).documentPictureInPicture.requestWindow({
          width: 260,
          height: 310,
        });

        // Copy styles
        [...document.styleSheets].forEach((sheet) => {
          try {
            const rules = [...sheet.cssRules].map((r) => r.cssText).join('');
            const style = document.createElement('style');
            style.textContent = rules;
            pipWindow.document.head.appendChild(style);
          } catch {
            if (sheet.href) {
              const link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = sheet.href;
              pipWindow.document.head.appendChild(link);
            }
          }
        });

        pipWindow.document.title = 'Hoppi AI Agent (Desktop Overlay)';
        pipWindow.document.body.className = 'bg-slate-950 text-white overflow-hidden flex flex-col items-center justify-center p-4 select-none';

        pipWindow.document.body.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;font-family:sans-serif;text-align:center;gap:10px;">
            <div style="width:76px;height:76px;border-radius:50%;background:radial-gradient(circle at 35% 30%, #38bdf8 0%, #0284c7 40%, #030712 90%);box-shadow:0 0 30px rgba(56,189,248,0.7);display:flex;align-items:center;justify-content:center;position:relative;">
              <div style="display:flex;gap:14px;">
                <span style="display:inline-block;width:14px;height:8px;border-top:3.5px solid #ffffff;border-radius:7px 7px 0 0;"></span>
                <span style="display:inline-block;width:14px;height:8px;border-top:3.5px solid #ffffff;border-radius:7px 7px 0 0;"></span>
              </div>
            </div>
            <div style="font-weight:900;font-size:14px;color:#38bdf8;letter-spacing:0.5px;">Hoppi AI Agent 24/7</div>
            <div style="font-size:11px;color:#94a3b8;">Đang ghim trực tiếp trên màn hình Desktop</div>
            <div style="display:flex;gap:6px;margin-top:6px;">
              <button id="pip-restore" style="padding:6px 14px;border-radius:12px;background:linear-gradient(to right, #06b6d4, #6366f1);color:#fff;border:none;font-weight:bold;font-size:11px;cursor:pointer;">
                Mở Phần Mềm
              </button>
            </div>
          </div>
        `;

        pipWindow.document.getElementById('pip-restore')?.addEventListener('click', () => {
          window.focus();
          handleRestore();
        });

        handleMinimize();
        return;
      } catch (err) {
        console.warn('PiP window request failed, fallback to desktop mode:', err);
      }
    }

    // Fallback: Standalone window popup
    window.open(
      '/?desktop_widget=true',
      'HoppiDesktopOverlay',
      'width=260,height=340,resizable=no,scrollbars=no,status=no,toolbar=no,menubar=no,location=no'
    );
    handleMinimize();
  };

  // Effective animation states
  const effectiveListening = isListening || isLocalListening;
  const effectiveThinking = isThinking || previewThinking;

  // Proactive Scan Mode State: Subtly tracks cursor & switches to curious near desktop icons
  const [isProactiveScan, setIsProactiveScan] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('hoppi_proactive_scan_enabled');
      if (saved !== null) return JSON.parse(saved);
    } catch {}
    return true;
  });

  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 500, y: 250 });
  const [cursorLingerNearIcon, setCursorLingerNearIcon] = useState(false);
  const [scanPulseAngle, setScanPulseAngle] = useState(0);
  const [scanTargetName, setScanTargetName] = useState<string | null>(null);
  const lastMousePosRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: Date.now() });
  const iconLingerTimerRef = useRef<any>(null);

  const toggleProactiveScan = () => {
    setIsProactiveScan((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('hoppi_proactive_scan_enabled', JSON.stringify(next));
      } catch {}
      if (!next) {
        setCursorLingerNearIcon(false);
        setScanTargetName(null);
      }
      return next;
    });
  };

  // Cursor Tracking and Desktop Icon Proximity Detection
  useEffect(() => {
    if (!isProactiveScan) {
      setCursorLingerNearIcon(false);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      setMousePos({ x: clientX, y: clientY });

      // Compute vector and angle from mascot center to cursor
      const mascotCenterX = (activePosition?.x ?? position.x) + 40;
      const mascotCenterY = (activePosition?.y ?? position.y) + 40;
      const dx = clientX - mascotCenterX;
      const dy = clientY - mascotCenterY;
      const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
      setScanPulseAngle(angleDeg);

      // Velocity check for lingering
      const now = Date.now();
      const dt = Math.max(1, now - lastMousePosRef.current.time);
      const distMoved = Math.hypot(clientX - lastMousePosRef.current.x, clientY - lastMousePosRef.current.y);
      const velocity = distMoved / dt; // px / ms
      lastMousePosRef.current = { x: clientX, y: clientY, time: now };

      // Desktop icons region on Windows desktop: left column (x < 280) or near edge/shortcuts
      const isNearDesktopIcons = clientX < 280 && clientY < window.innerHeight - 50;
      const isNearEdge = (clientX < 140 || clientX > window.innerWidth - 140) && clientY < window.innerHeight - 70;

      if ((isNearDesktopIcons || isNearEdge) && velocity < 0.4) {
        if (!iconLingerTimerRef.current) {
          iconLingerTimerRef.current = setTimeout(() => {
            setCursorLingerNearIcon(true);
            if (isNearDesktopIcons) {
              setScanTargetName('Tệp & Lối tắt Desktop');
            } else {
              setScanTargetName('Khu vực cửa sổ cạnh màn hình');
            }
          }, 320);
        }
      } else {
        if (iconLingerTimerRef.current) {
          clearTimeout(iconLingerTimerRef.current);
          iconLingerTimerRef.current = null;
        }
        if (velocity > 0.6) {
          setCursorLingerNearIcon(false);
          setScanTargetName(null);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (iconLingerTimerRef.current) clearTimeout(iconLingerTimerRef.current);
    };
  }, [isProactiveScan, activePosition, position]);

  // Handle window resize boundaries
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        const maxX = Math.max(30, window.innerWidth - 180);
        const maxY = Math.max(30, window.innerHeight - 180);
        const clampedX = Math.min(Math.max(20, prev.x), maxX);
        const clampedY = Math.min(Math.max(20, prev.y), maxY);
        const newPos = { x: clampedX, y: clampedY };
        if (globalOverlay?.setMascotPosition) {
          globalOverlay.setMascotPosition(newPos);
        }
        return newPos;
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [globalOverlay]);

  // Natural Blinking loop (every 3.2 - 4.5s)
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  // Quick Speech Recognition
  const handleQuickVoiceListen = () => {
    if (isLocalListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsLocalListening(false);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      onToggleListen();
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = 'vi-VN';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsLocalListening(true);
      };

      recognition.onresult = (event: any) => {
        let text = '';
        for (let i = 0; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        if (text) {
          setQuickInput(text);
        }
      };

      recognition.onerror = () => {
        setIsLocalListening(false);
      };

      recognition.onend = () => {
        setIsLocalListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsLocalListening(false);
      onToggleListen();
    }
  };

  const handleSendQuick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    onQuickSendMessage(quickInput.trim());
    setQuickInput('');
    setIsOpenMenu(false);
  };

  const handleDragStart = () => {
    setIsDragging(true);
    setDragMoved(false);
  };

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    // If movement was more than 8 pixels, mark as drag
    if (Math.abs(info.offset.x) > 8 || Math.abs(info.offset.y) > 8) {
      setDragMoved(true);
      setPosition((prev) => {
        const baseX = activePosition?.x ?? prev.x;
        const baseY = activePosition?.y ?? prev.y;
        const newX = Math.max(15, Math.min(window.innerWidth - 180, baseX + info.offset.x));
        const newY = Math.max(15, Math.min(window.innerHeight - 180, baseY + info.offset.y));
        const newPos = { x: newX, y: newY };
        if (globalOverlay?.setMascotPosition) {
          globalOverlay.setMascotPosition(newPos);
        } else {
          try {
            localStorage.setItem('hoppi_desktop_mascot_pos', JSON.stringify(newPos));
          } catch (e) {}
        }
        return newPos;
      });
    }
  };

  const resetToDefaultPosition = () => {
    const def = {
      x: Math.max(30, window.innerWidth - 240),
      y: 120,
    };
    setPosition(def);
    if (globalOverlay?.setMascotPosition) {
      globalOverlay.setMascotPosition(def);
    } else {
      try {
        localStorage.setItem('hoppi_desktop_mascot_pos', JSON.stringify(def));
      } catch (e) {}
    }
  };

  // Easter egg: double-click heart burst
  const handleDoubleClick = () => {
    setHeartBurst(true);
    setTimeout(() => setHeartBurst(false), 1200);
  };

  // Compute cursor vectors for gaze tracking & proactive scan
  const mascotCenterX = (activePosition?.x ?? position.x) + 40;
  const mascotCenterY = (activePosition?.y ?? position.y) + 40;
  const cursorDx = mousePos.x - mascotCenterX;
  const cursorDy = mousePos.y - mascotCenterY;
  const cursorDist = Math.hypot(cursorDx, cursorDy);

  // Subtle pupil tracking offsets clamped to [-3.5, 3.5] px
  const pupilOffsetX = isProactiveScan ? Math.max(-3.5, Math.min(3.5, (cursorDx / Math.max(1, window.innerWidth / 2)) * 3.5)) : 0;
  const pupilOffsetY = isProactiveScan ? Math.max(-2.5, Math.min(2.5, (cursorDy / Math.max(1, window.innerHeight / 2)) * 2.5)) : 0;

  // Subtle 3D tilt towards cursor
  const mascotTiltX = isProactiveScan ? -pupilOffsetY * 1.6 : 0;
  const mascotTiltY = isProactiveScan ? pupilOffsetX * 1.8 : 0;

  // Effective mood: when cursor lingers near desktop icons, auto-shift to 'curious'
  const effectiveMood: ExpressiveMood = cursorLingerNearIcon
    ? 'curious'
    : cursorDist < 95
    ? 'happy'
    : mood;

  // Dynamic Aura Glow based on current active state
  const getMoodAuraColor = () => {
    if (effectiveThinking) {
      return 'rgba(168, 85, 247, 0.75)'; // Electric purple thinking aura
    }
    if (effectiveListening) {
      return 'rgba(16, 185, 129, 0.85)'; // Emerald green listening radar aura
    }
    if (isSpeaking) {
      return 'rgba(6, 182, 212, 0.8)'; // Cyan audio speaking aura
    }
    if (cursorLingerNearIcon) {
      return 'rgba(6, 182, 212, 0.85)'; // Intense cyan proactive scan aura
    }
    switch (effectiveMood) {
      case 'happy':
        return 'rgba(245, 158, 11, 0.6)'; // Gold glow as in screenshot
      case 'curious':
        return 'rgba(6, 182, 212, 0.75)'; // Cyan curious
      case 'focused':
        return 'rgba(168, 85, 247, 0.6)'; // Purple
      case 'empathetic':
        return 'rgba(236, 72, 153, 0.6)'; // Rose pink
      case 'critical':
        return 'rgba(239, 68, 68, 0.7)'; // Red
      default:
        return 'rgba(245, 158, 11, 0.6)';
    }
  };

  const getMoodLabel = () => {
    if (effectiveThinking) return 'Đang suy nghĩ (Thinking)';
    if (effectiveListening) return 'Đang lắng nghe (Listening)';
    if (isSpeaking) return 'Đang nói (Speaking)';
    if (cursorLingerNearIcon) return '🔍 Quét tệp Desktop (Curious)';
    switch (effectiveMood) {
      case 'happy':
        return 'Vui (Gold)';
      case 'curious':
        return 'Tò mò (Cyan)';
      case 'focused':
        return 'Tập trung (Tím)';
      case 'empathetic':
        return 'Thấu cảm (Hồng)';
      case 'critical':
        return 'Cảnh báo (Đỏ)';
      default:
        return 'Vui (Gold)';
    }
  };

  const mascotNode = (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        left: activePosition.x,
        top: activePosition.y,
        position: 'fixed',
      }}
      className="z-[999999] select-none font-sans pointer-events-auto touch-none"
    >
      {/* Quick Action Popup Modal */}
      <AnimatePresence>
        {isOpenMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-full right-0 mb-3 w-84 sm:w-92 rounded-2xl bg-slate-950/95 border-2 border-amber-500/60 shadow-2xl shadow-black/90 p-4 backdrop-blur-xl text-slate-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-1">
                  👑 Hoppi AI 24/7 • {identity?.isMaster ? 'Chủ nhân Nguyễn Thanh Hải' : 'Khách ghé thăm'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpenMenu(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Mascot Status Snippet */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-2 mb-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Trạng thái sống:</span>
                <span className={`font-bold font-mono flex items-center gap-1.5 ${
                  effectiveThinking
                    ? 'text-purple-400 animate-pulse'
                    : effectiveListening
                    ? 'text-emerald-400 animate-pulse'
                    : isSpeaking
                    ? 'text-cyan-400'
                    : 'text-amber-300'
                }`}>
                  {effectiveThinking && <Loader2 className="w-3 h-3 animate-spin" />}
                  {effectiveListening && <Radio className="w-3 h-3 animate-ping" />}
                  {isSpeaking && <Volume2 className="w-3 h-3 animate-bounce" />}
                  {!effectiveThinking && !effectiveListening && !isSpeaking && <CheckCircle2 className="w-3 h-3" />}
                  <span>{getMoodLabel()}</span>
                </span>
              </div>

              {/* Animation State Test Chips for Master */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <span className="text-[10px] text-slate-400 block font-semibold">
                  Thử nghiệm trạng thái động của Hoppi:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={toggleProactiveScan}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition cursor-pointer border ${
                      isProactiveScan
                        ? 'bg-cyan-600 text-white font-bold border-cyan-400 shadow-sm'
                        : 'bg-slate-800/80 text-cyan-300 hover:text-white border-cyan-800/60'
                    }`}
                  >
                    📡 Quét Chủ Động: {isProactiveScan ? 'BẬT' : 'TẮT'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCursorLingerNearIcon(true);
                      setScanTargetName('Tệp & Lối tắt Desktop');
                      setTimeout(() => setCursorLingerNearIcon(false), 2400);
                    }}
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono transition cursor-pointer border bg-slate-800/80 text-cyan-300 hover:text-white border-cyan-700/60"
                  >
                    🔍 Test Quét Icon
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewThinking(!previewThinking)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition cursor-pointer border ${
                      previewThinking
                        ? 'bg-purple-600 text-white font-bold border-purple-400 shadow-sm'
                        : 'bg-slate-800/80 text-purple-300 hover:text-white border-purple-800/60'
                    }`}
                  >
                    🧠 {previewThinking ? 'Dừng Suy Nghĩ' : 'Test Suy Nghĩ'}
                  </button>

                  <button
                    type="button"
                    onClick={handleQuickVoiceListen}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition cursor-pointer border ${
                      isLocalListening
                        ? 'bg-emerald-600 text-white font-bold border-emerald-400 shadow-sm'
                        : 'bg-slate-800/80 text-emerald-300 hover:text-white border-emerald-800/60'
                    }`}
                  >
                    🎤 {isLocalListening ? 'Dừng Lắng Nghe' : 'Test Lắng Nghe'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onToggleVoice();
                      setHeartBurst(true);
                      setTimeout(() => setHeartBurst(false), 1200);
                    }}
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono transition cursor-pointer border bg-slate-800/80 text-cyan-300 hover:text-white border-cyan-800/60"
                  >
                    📢 Test Vừa Nói
                  </button>
                </div>
              </div>

              {/* Quick Mood Selector Chips */}
              {onChangeMood && (
                <div className="pt-1.5 border-t border-slate-800/80 flex items-center gap-1 flex-wrap">
                  {(['happy', 'curious', 'focused', 'empathetic', 'critical'] as ExpressiveMood[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => onChangeMood(m)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition cursor-pointer border ${
                        mood === m && !effectiveThinking && !effectiveListening
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                          : 'bg-slate-800/80 text-slate-300 hover:text-white border-slate-700'
                      }`}
                    >
                      {m === 'happy' && '✨ Vui'}
                      {m === 'curious' && '🔍 Tò mò'}
                      {m === 'focused' && '🎯 Tập trung'}
                      {m === 'empathetic' && '💖 Thấu cảm'}
                      {m === 'critical' && '🚨 Cảnh báo'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Dispatch Input */}
            <form onSubmit={handleSendQuick} className="space-y-2">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  placeholder={effectiveListening ? '🔴 Đang lắng nghe Chủ nhân nói...' : 'Nhập lệnh nhanh cho Hoppi...'}
                  className="w-full pl-3 pr-9 py-2 rounded-xl bg-slate-900 border border-amber-500/40 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 shadow-inner"
                />
                <button
                  type="button"
                  onClick={handleQuickVoiceListen}
                  title="Nhận diện giọng nói Tiếng Việt"
                  className={`absolute right-1.5 p-1.5 rounded-lg transition-colors cursor-pointer ${
                    effectiveListening
                      ? 'bg-emerald-500 text-white animate-pulse'
                      : 'text-slate-400 hover:text-amber-300'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="submit"
                  disabled={!quickInput.trim()}
                  className="flex-1 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 disabled:opacity-40 cursor-pointer shadow-md transition-transform active:scale-95"
                >
                  <Send className="w-3 h-3" />
                  <span>Gửi Lệnh</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleRestore();
                    setIsOpenMenu(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition shadow-md"
                  title="Mở toàn bộ giao diện phần mềm Hoppi"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Mở Phần Mềm</span>
                </button>
              </div>
            </form>

            {/* Sub-actions toolbar */}
            <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 gap-1 flex-wrap">
              <button
                type="button"
                onClick={resetToDefaultPosition}
                className="flex items-center gap-1 hover:text-amber-300 transition cursor-pointer"
                title="Đưa Hoppi về vị trí góc trên bên phải mặc định"
              >
                <RotateCcw className="w-3 h-3 text-amber-400" />
                <span>Góc màn hình</span>
              </button>

              <button
                type="button"
                onClick={handlePopOutDesktopWidget}
                className="flex items-center gap-1 hover:text-emerald-300 text-emerald-400 font-bold transition cursor-pointer"
                title="Ghim Hoppi ra màn hình desktop luôn nổi (Always-On-Top PiP Mode) kể cả khi đóng hay ẩn phần mềm"
              >
                <ExternalLink className="w-3 h-3 text-emerald-400" />
                <span>Ghim Ra Desktop ⚡</span>
              </button>

              {!activeMinimized && (
                <button
                  type="button"
                  onClick={() => {
                    handleMinimize();
                    setIsOpenMenu(false);
                  }}
                  className="flex items-center gap-1 hover:text-cyan-300 transition cursor-pointer"
                  title="Thu nhỏ phần mềm vào biểu tượng Hoppi nổi trên desktop"
                >
                  <Minimize2 className="w-3 h-3 text-cyan-400" />
                  <span>Thu nhỏ</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING EMOTIONAL HOPPI CHARACTER (Matches Master's Desktop Wallpaper Screenshot) */}
      <div
        className="relative group cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDoubleClick={handleDoubleClick}
        onClick={() => {
          if (dragMoved) {
            setDragMoved(false);
            return;
          }
          setIsSquishing(true);
          setTimeout(() => setIsSquishing(false), 250);

          // Nếu ứng dụng đang thu nhỏ, bấm vào Hoppi sẽ mở lại giao diện phần mềm ngay lập tức
          if (activeMinimized) {
            handleRestore();
          } else {
            setIsOpenMenu((prev) => !prev);
          }
        }}
      >
        {/* Dynamic Aura Glow (changes color & pulsation based on animation states) */}
        <div
          className={`absolute inset-0 rounded-full blur-xl pointer-events-none transition-all duration-500 ${
            effectiveThinking
              ? 'animate-pulse scale-150'
              : effectiveListening
              ? 'animate-ping scale-140'
              : isSpeaking
              ? 'animate-pulse scale-135'
              : 'animate-pulse'
          }`}
          style={{
            background: getMoodAuraColor(),
            transform: isHovered || isDragging ? 'scale(1.45)' : undefined,
          }}
        />

        {/* LISTENING RADAR PULSE RINGS (Concentric sonar waves expanding outwards) */}
        {effectiveListening && (
          <>
            <motion.div
              animate={{ scale: [1, 2.2], opacity: [0.9, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
              className="absolute -inset-3 rounded-full border-2 border-emerald-400 pointer-events-none"
            />
            <motion.div
              animate={{ scale: [1, 1.8], opacity: [0.7, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
              className="absolute -inset-2 rounded-full border-2 border-teal-300 pointer-events-none"
            />
          </>
        )}

        {/* THINKING NEURAL COMPUTING ORBIT (Spins around body when AI is generating) */}
        {effectiveThinking && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-3 rounded-full border-2 border-purple-400/80 border-dashed pointer-events-none shadow-[0_0_15px_#c084fc]"
          >
            {/* Thinking orbiting particle */}
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8] absolute -top-1.5 left-1/2 -translate-x-1/2" />
          </motion.div>
        )}

        {/* Outer Draggable Shell with Lifelike Float & Animation States */}
        <motion.div
          animate={
            effectiveThinking
              ? {
                  y: [-3, 3, -3],
                  rotate: [-2, 2, -1, 0],
                  scale: isSquishing ? [1, 1.15, 0.9, 1] : 1.04,
                }
              : effectiveListening
              ? {
                  y: [-2, 2, -2],
                  scale: isSquishing ? [1, 1.15, 0.9, 1] : [1, 1.05, 1],
                }
              : isSpeaking
              ? {
                  y: [0, -5, 0],
                  scale: isSquishing ? [1, 1.15, 0.9, 1] : [1, 1.03, 1],
                }
              : {
                  y: isDragging ? 0 : [0, -6, 0],
                  scale: isSquishing ? [1, 1.15, 0.9, 1] : isHovered ? 1.06 : 1,
                }
          }
          transition={{
            y: { duration: effectiveThinking ? 1.4 : effectiveListening ? 1.8 : 3.2, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            scale: { duration: 0.25 },
          }}
          className={`relative flex items-center gap-2 p-1.5 rounded-3xl bg-slate-950/90 backdrop-blur-md border-2 transition-colors shadow-2xl shadow-black ${
            effectiveThinking
              ? 'border-purple-400 shadow-purple-950/80'
              : effectiveListening
              ? 'border-emerald-400 shadow-emerald-950/80'
              : isSpeaking
              ? 'border-cyan-400 shadow-cyan-950/80'
              : cursorLingerNearIcon
              ? 'border-cyan-400 shadow-cyan-950/90 ring-2 ring-cyan-400/40'
              : 'border-amber-500/70 hover:border-amber-400'
          }`}
          style={{
            transform: `perspective(600px) rotateX(${mascotTiltX}deg) rotateY(${mascotTiltY}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* PROACTIVE SCAN FLOATING OBSERVATION BADGE */}
          <AnimatePresence>
            {isProactiveScan && cursorLingerNearIcon && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.88 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full bg-cyan-950/95 border border-cyan-400/90 shadow-2xl shadow-cyan-950/90 text-[10px] font-mono text-cyan-200 flex items-center gap-1.5 pointer-events-none z-50 backdrop-blur-md"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
                <span>🔍 Quét chủ động: {scanTargetName || 'Desktop Icons'}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Left Floating Satellite Orb (Robot Ear/Hand as seen in screenshot) */}
          <motion.div
            animate={
              effectiveThinking
                ? { y: [-6, 6, -6], scale: [0.9, 1.15, 0.9] }
                : effectiveListening
                ? { scale: [1, 1.3, 1], y: [-2, 2, -2] }
                : cursorLingerNearIcon
                ? { y: [-4, 2, -4], scale: [1, 1.2, 1] }
                : { y: isDragging ? 0 : [-2, 2, -2] }
            }
            transition={{
              duration: effectiveThinking ? 1.2 : effectiveListening ? 0.8 : 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={`w-4 h-4 rounded-full bg-gradient-to-br from-slate-500 via-slate-800 to-black shadow-lg border shrink-0 transition-colors ${
              effectiveThinking
                ? 'border-purple-400 shadow-[0_0_8px_#c084fc]'
                : effectiveListening
                ? 'border-emerald-400 shadow-[0_0_8px_#34d399]'
                : cursorLingerNearIcon
                ? 'border-cyan-400 shadow-[0_0_8px_#22d3ee]'
                : 'border-slate-600/80'
            }`}
          />

          {/* Main Obsidian Navy Pear-Shaped Robot Head & Visor matching Master's 3D cute robot vector */}
          <div className="relative flex flex-col items-center shrink-0">
            {/* Top Antenna with floating orbital white halo ring */}
            <div className="relative -mb-1 flex flex-col items-center z-20 pointer-events-none">
              {/* Antenna tip sphere */}
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-b from-slate-600 via-slate-900 to-black border border-slate-600 shadow-sm" />
              {/* Floating white halo ring */}
              <motion.div
                animate={{ rotateX: [65, 75, 65], rotateZ: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute top-0.5 w-4 h-2 rounded-full border-[1.5px] border-white/90 shadow-[0_0_6px_#ffffff] pointer-events-none"
              />
              {/* Antenna stem */}
              <div className="w-1 h-2 bg-slate-800" />
            </div>

            {/* Pear-shaped Head Shell */}
            <div className="relative w-16 h-14 sm:w-18 sm:h-16 rounded-[28px] bg-gradient-to-br from-slate-700 via-slate-900 to-black border-2 border-slate-700 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
              {/* Top-Left Spherical Light Specular Highlight for 3D realism */}
              <div className="absolute top-1.5 left-2.5 w-5 h-2.5 rounded-full bg-white/40 blur-[1px] -rotate-15 pointer-events-none z-20" />

              {/* Smooth Curved White Visor (Exact match to vector: white front face) */}
              <div className="relative w-13 h-10 sm:w-15 sm:h-12 rounded-[20px] bg-gradient-to-b from-white via-slate-50 to-slate-200 shadow-md border border-white/90 flex flex-col items-center justify-center overflow-hidden">
                {/* Visor 3D Specular Highlight */}
                <div className="absolute top-1 left-2 w-4 h-1.5 bg-white rounded-full rotate-[-15deg] opacity-80 blur-[0.2px] pointer-events-none" />

                {/* PROACTIVE SCAN RADAR BEAM */}
                {isProactiveScan && cursorLingerNearIcon && (
                  <div className="absolute inset-0 rounded-full pointer-events-none flex items-center justify-center overflow-hidden">
                    <div
                      className="w-24 h-1 origin-left bg-gradient-to-r from-cyan-400 via-teal-300 to-transparent blur-[0.5px] opacity-75 animate-pulse"
                      style={{
                        transform: `rotate(${scanPulseAngle}deg)`,
                      }}
                    />
                  </div>
                )}

                {/* Expressive Glossy Black Eyes on White Visor */}
                <div
                  className="relative flex items-center gap-2 z-10 transition-transform duration-100 ease-out"
                  style={{
                    transform: `translate(${pupilOffsetX}px, ${pupilOffsetY}px)`,
                  }}
                >
                  {isBlinking && !effectiveThinking && !effectiveListening ? (
                    <>
                      <div className="w-3.5 h-0.5 bg-slate-900 rounded-full" />
                      <div className="w-3.5 h-0.5 bg-slate-900 rounded-full" />
                    </>
                  ) : effectiveThinking ? (
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [0.85, 1.25, 0.85] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="w-3.5 h-3.5 rounded-full bg-purple-900 shadow-[0_0_8px_#c084fc] flex items-center justify-center"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </motion.div>
                      <motion.div
                        animate={{ scale: [1.25, 0.85, 1.25] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="w-3.5 h-3.5 rounded-full bg-cyan-900 shadow-[0_0_8px_#38bdf8] flex items-center justify-center"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </motion.div>
                    </div>
                  ) : effectiveListening ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-4.5 rounded-full bg-slate-950 border border-emerald-400 shadow-[0_0_8px_#34d399] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-1 left-1" />
                      </div>
                      <div className="w-3.5 h-4.5 rounded-full bg-slate-950 border border-emerald-400 shadow-[0_0_8px_#34d399] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-1 left-1" />
                      </div>
                    </div>
                  ) : effectiveMood === 'curious' ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-4 rounded-full bg-slate-950 relative flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-0.5 left-0.5" />
                      </div>
                      <div className="w-3.5 h-4.5 rounded-full bg-slate-950 relative flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-0.5 left-0.5" />
                      </div>
                    </div>
                  ) : (
                    // Classic Cute Glossy Black Eyes with specular highlight (exact match to vector)
                    <div className="flex items-center gap-2.5">
                      <div className="w-3.5 h-4 rounded-full bg-slate-950 relative shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-0.5 left-0.5" />
                        <div className="w-0.5 h-0.5 rounded-full bg-white/70 absolute bottom-1 right-1" />
                      </div>
                      <div className="w-3.5 h-4 rounded-full bg-slate-950 relative shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-0.5 left-0.5" />
                        <div className="w-0.5 h-0.5 rounded-full bg-white/70 absolute bottom-1 right-1" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Sweet Curved Smile Line (exact match to vector: ‿ ) */}
                <div className="mt-0.5 z-10 flex items-center justify-center">
                  <svg width="12" height="5" viewBox="0 0 12 5" className="overflow-visible">
                    <path
                      d="M 2 1 Q 6 5 10 1"
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* SPEAKING AUDIO EQUALIZER */}
                {isSpeaking && (
                  <div className="flex items-center gap-0.5 justify-center mt-0.5 z-10">
                    {[0.4, 0.9, 0.6, 1, 0.5].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: ['2px', '6px', '2px'] }}
                        transition={{ duration: 0.45, repeat: Infinity, delay: i * 0.08 }}
                        className="w-0.5 bg-cyan-600 rounded-full"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Lower Floating Body with White Center Disc (Exact match to vector!) */}
            <div className="relative -mt-1 w-9 h-6 rounded-full bg-gradient-to-b from-slate-700 to-black border border-slate-700 shadow-md flex items-center justify-center z-10">
              <div className="w-3.5 h-3.5 rounded-full bg-white shadow-inner border border-slate-200" />
            </div>
          </div>

          {/* Right Floating Satellite Orb (Robot Ear/Hand as seen in screenshot) */}
          <motion.div
            animate={
              effectiveThinking
                ? { y: [6, -6, 6], scale: [1.15, 0.9, 1.15] }
                : effectiveListening
                ? { scale: [1, 1.3, 1], y: [2, -2, 2] }
                : { y: isDragging ? 0 : [2, -2, 2] }
            }
            transition={{
              duration: effectiveThinking ? 1.2 : effectiveListening ? 0.8 : 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={`w-4 h-4 rounded-full bg-gradient-to-br from-slate-500 via-slate-800 to-black shadow-lg border shrink-0 transition-colors ${
              effectiveThinking
                ? 'border-purple-400 shadow-[0_0_8px_#c084fc]'
                : effectiveListening
                ? 'border-emerald-400 shadow-[0_0_8px_#34d399]'
                : 'border-slate-600/80'
            }`}
          />

          {/* Side Info Pill: 24h Online & Dynamic Animation Status Badge */}
          <div className="hidden sm:flex flex-col gap-0.5 pr-2 min-w-[95px]">
            <div className={`flex items-center gap-1 text-[10px] font-extrabold truncate ${
              effectiveThinking
                ? 'text-purple-300'
                : effectiveListening
                ? 'text-emerald-300'
                : isSpeaking
                ? 'text-cyan-300'
                : 'text-amber-300'
            }`}>
              {effectiveThinking ? (
                <>
                  <Loader2 className="w-3 h-3 text-purple-400 animate-spin shrink-0" />
                  <span>Đang suy nghĩ...</span>
                </>
              ) : effectiveListening ? (
                <>
                  <Radio className="w-3 h-3 text-emerald-400 animate-ping shrink-0" />
                  <span>Đang nghe...</span>
                </>
              ) : isSpeaking ? (
                <>
                  <Volume2 className="w-3 h-3 text-cyan-400 animate-bounce shrink-0" />
                  <span>Đang nói...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>{getMoodLabel()}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-1 text-[9.5px] font-mono text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>24h Online</span>
            </div>

            <div className="text-[8.5px] text-slate-400 font-mono truncate">
              {effectiveThinking
                ? '⚡ Xử lý LLM'
                : effectiveListening
                ? '🎙️ Nhận diện Mic'
                : isSpeaking
                ? '📢 Đọc Tiếng Việt'
                : '🖐️ Kéo di chuyển'}
            </div>
          </div>
        </motion.div>

        {/* Easter Egg: Floating Heart Burst on Double Click */}
        {heartBurst && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 0.5 }}
            animate={{ opacity: 0, y: -45, scale: 1.5 }}
            transition={{ duration: 1 }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-1 text-pink-400 font-bold text-xs"
          >
            <Heart className="w-5 h-5 fill-pink-500 text-pink-400 animate-ping" />
            <span className="text-pink-300 whitespace-nowrap shadow-sm">Yêu Chủ nhân!</span>
          </motion.div>
        )}

        {/* Hover / Minimized Tooltip */}
        {isHovered && !isOpenMenu && !isDragging && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 rounded-xl bg-black/95 border border-amber-500/60 text-[11px] text-amber-200 whitespace-nowrap shadow-2xl backdrop-blur-md pointer-events-none flex items-center gap-1.5">
            <Move className="w-3 h-3 text-amber-400" />
            <span>
              {activeMinimized
                ? '👑 Bấm vào Hoppi để mở lại giao diện phần mềm! (Giữ chuột để kéo di chuyển)'
                : effectiveThinking
                ? '🧠 Hoppi đang suy nghĩ & sinh câu trả lời...'
                : effectiveListening
                ? '🎤 Hoppi đang lắng nghe giọng nói...'
                : '👑 Hoppi AI Mascot • Kéo di chuyển bất kỳ đâu trên màn hình • Bấm để mở menu nhanh'}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );

  // Persistent Desktop Overlay Root Rendering Strategy via React Portal
  if (typeof document !== 'undefined' && document.body) {
    return createPortal(mascotNode, document.body);
  }

  return mascotNode;
};
