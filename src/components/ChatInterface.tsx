import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatMessage,
  ExpressiveMood,
  UserIdentity,
  AppTheme,
  VoiceCommandLogItem,
  ConnectedMeshDevice,
  HoppiCompletionNotice,
  DesignArtifact,
} from '../types';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Shield,
  UserCheck,
  Bot,
  Copy,
  Check,
  AlertCircle,
  Play,
  Square,
  Trash2,
  History,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Radio,
  Code2,
  Server,
  ShoppingCart,
  X,
  Search,
  FastForward,
  Zap,
  Activity,
  CheckCircle2,
  Loader2,
  SlidersHorizontal,
  Laptop,
  Smartphone,
  Tablet,
  Crown,
  BellRing,
  Bell,
  TrendingUp,
  Database,
  FileText,
  BookmarkPlus,
  Paperclip,
  Image as ImageIcon,
  FileVideo,
  UploadCloud,
  Palette,
  ExternalLink,
  Table,
  Presentation,
  Film,
  CheckSquare,
  FileSpreadsheet,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ProductivityScoreChart } from './ProductivityScoreChart';
import { FuturisticAskingAiBar } from './FuturisticAskingAiBar';

export type PlaybackSpeed = '1x' | '1.5x' | '2x';

export interface TaskExecutionState {
  id: string;
  title: string;
  steps: string[];
  currentStepIndex: number;
  progress: number;
  isRunning: boolean;
  category: 'code' | 'system' | 'rag' | 'iot' | 'sales';
  targetDeviceName?: string;
}

export interface ChatAttachmentItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'file';
  url: string;
  sizeFormatted: string;
  fileObj?: File;
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  identity: UserIdentity;
  isListening: boolean;
  isSpeaking: boolean;
  isAutoDelegated: boolean;
  onSendMessage: (text: string, attachments?: any[]) => void;
  onToggleListen: () => void;
  onToggleSpeech: () => void;
  onToggleAutoDelegation: () => void;
  onSwitchIdentity: () => void;
  onOpenApproval: (id: string) => void;
  onExecuteAction: (actionStr: string) => void;
  onClearHistory: () => void;
  theme?: AppTheme;
  onSpeakingStateChange?: (speaking: boolean) => void;
  isAiTyping?: boolean;
  lastVoiceCommand?: string | null;
  onTriggerCompletionNotice?: (notice: HoppiCompletionNotice) => void;
  selectedTargetDevice?: ConnectedMeshDevice | null;
  onSelectTargetDevice?: (device: ConnectedMeshDevice | null) => void;
}

// Text Highlighter for Search queries
const HighlightedText: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query || !query.trim()) {
    return <span className="whitespace-pre-wrap">{text}</span>;
  }

  const trimmedQuery = query.trim();
  const escapedQuery = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className="whitespace-pre-wrap">
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-amber-400/35 text-amber-200 px-0.5 py-0.2 rounded font-medium border border-amber-400/40"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

// Component for rendering real-time streaming/typewriter animation on assistant responses with Speed Toggle support
const StreamingMessageContent: React.FC<{
  text: string;
  isLatest: boolean;
  shouldAnimate: boolean;
  speed: PlaybackSpeed;
  searchQuery?: string;
  onAnimationComplete?: () => void;
}> = ({ text, isLatest, shouldAnimate, speed, searchQuery = '', onAnimationComplete }) => {
  const [displayedLength, setDisplayedLength] = useState(() => (shouldAnimate ? 0 : text.length));
  const isTyping = displayedLength < text.length;

  useEffect(() => {
    if (!shouldAnimate) {
      setDisplayedLength(text.length);
      return;
    }

    setDisplayedLength(0);

    // Speed configuration:
    // 1x: 18ms, 3-5 chars per tick
    // 1.5x: 10ms, 6-9 chars per tick
    // 2x: 5ms, 12-18 chars per tick
    const intervalTime = speed === '2x' ? 5 : speed === '1.5x' ? 10 : 18;
    const charsStep = speed === '2x' ? 14 : speed === '1.5x' ? 7 : 4;

    const interval = setInterval(() => {
      setDisplayedLength((prev) => {
        const delta = Math.floor(Math.random() * (charsStep / 2) + charsStep / 2);
        const next = Math.min(prev + Math.max(1, delta), text.length);
        if (next >= text.length) {
          clearInterval(interval);
          onAnimationComplete?.();
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [text, shouldAnimate, speed]);

  // Click to skip typewriter effect
  const handleSkipTyping = () => {
    setDisplayedLength(text.length);
    onAnimationComplete?.();
  };

  const visibleText = text.slice(0, displayedLength);

  return (
    <div
      className="cursor-pointer"
      onClick={isTyping ? handleSkipTyping : undefined}
      title={isTyping ? 'Nhấp chuột để hiển thị toàn bộ nội dung ngay' : undefined}
    >
      <HighlightedText text={visibleText} query={searchQuery} />
      {isTyping && (
        <span className="inline-block w-1.5 h-3.5 bg-cyan-400 ml-0.5 animate-pulse align-middle shadow-sm shadow-cyan-400" />
      )}
    </div>
  );
};

// Interactive Multi-Category Design & Office Artifact Renderer
const DesignArtifactCard: React.FC<{ artifact: DesignArtifact; theme: AppTheme }> = ({ artifact, theme }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPalette, setCopiedPalette] = useState<string | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const handleCopyCode = () => {
    let contentToCopy = '';
    if (artifact.category === 'spreadsheet' && artifact.spreadsheetData) {
      const csv = [
        artifact.spreadsheetData.columns.join(','),
        ...artifact.spreadsheetData.rows.map((r) => r.join(',')),
      ].join('\n');
      contentToCopy = csv;
    } else if (artifact.category === 'slide_deck' && artifact.slideDeckData) {
      contentToCopy = artifact.slideDeckData.slides
        .map((s) => `### Slide ${s.slideNumber}: ${s.title}\n${s.bulletPoints.map((b) => `- ${b}`).join('\n')}\n*Ý tưởng visual:* ${s.visualIdea}`)
        .join('\n\n');
    } else if (artifact.category === 'document' && artifact.documentData) {
      contentToCopy = artifact.documentData.sections
        .map((sec) => `## ${sec.heading}\n${sec.content}`)
        .join('\n\n');
    } else if (artifact.category === 'video_storyboard' && artifact.videoStoryboard) {
      contentToCopy = artifact.videoStoryboard.scenes
        .map((sc) => `[Phân cảnh ${sc.sceneNumber} (${sc.time}) - ${sc.hookType}]\nVisual: ${sc.visual}\nVoiceover: ${sc.audioVoiceover}`)
        .join('\n\n');
    } else {
      contentToCopy = `<!-- Banner Component (${artifact.title}) -->
<div style="width: 100%; aspect-ratio: 1200/630; background: ${artifact.previewGradient || 'linear-gradient(135deg, #0284c7 0%, #0f172a 100%)'}; border-radius: 20px; padding: 48px; color: #fff; font-family: sans-serif; display: flex; flex-direction: column; justify-content: space-between;">
  <div>
    <span style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #38bdf8; font-weight: bold;">${artifact.badgeText || 'AI GRAPHICS AGENT'}</span>
    <h1 style="font-size: 42px; font-weight: 800; margin: 12px 0 8px 0; line-height: 1.2;">${artifact.title}</h1>
    <p style="font-size: 20px; opacity: 0.9; margin: 0;">${artifact.slogan || ''}</p>
  </div>
  <div>
    <button style="padding: 16px 36px; background: #0284c7; color: #fff; border-radius: 12px; font-weight: 700; border: none; font-size: 18px; cursor: pointer;">${artifact.ctaText || 'Đặt Ngay'}</button>
  </div>
</div>`;
    }

    navigator.clipboard.writeText(contentToCopy);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedPalette(hex);
    setTimeout(() => setCopiedPalette(null), 1500);
  };

  const toggleTask = (id: string) => {
    setCompletedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="mt-3.5 rounded-2xl overflow-hidden border border-cyan-500/40 bg-slate-950/95 shadow-2xl space-y-3 p-4">
      {/* Header Info */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            {artifact.category === 'spreadsheet' ? (
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            ) : artifact.category === 'slide_deck' ? (
              <Presentation className="w-4 h-4 text-amber-400" />
            ) : artifact.category === 'document' ? (
              <FileText className="w-4 h-4 text-blue-400" />
            ) : artifact.category === 'cleanup_report' ? (
              <CheckSquare className="w-4 h-4 text-emerald-400" />
            ) : artifact.category === 'video_storyboard' ? (
              <Film className="w-4 h-4 text-rose-400" />
            ) : (
              <Palette className="w-4 h-4 text-cyan-400" />
            )}
          </div>
          <div>
            <div className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
              <span>{artifact.title}</span>
              {artifact.dimensions && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-semibold border border-emerald-500/40">
                  {artifact.dimensions}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {artifact.badgeText || 'AI AGENT THIẾT KẾ & TỔ CHỨC HOÀN TẤT'}
            </div>
          </div>
        </div>

        <button
          onClick={handleCopyCode}
          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
        >
          {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>
            {copiedCode
              ? 'Đã Copy'
              : artifact.category === 'spreadsheet'
              ? 'Copy CSV'
              : artifact.category === 'slide_deck'
              ? 'Copy Slide'
              : artifact.category === 'document'
              ? 'Copy Văn Bản'
              : 'Copy Mã/Tệp'}
          </span>
        </button>
      </div>

      {/* 1. SPREADSHEET TABLE RENDERER */}
      {artifact.category === 'spreadsheet' && artifact.spreadsheetData && (
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-800/80 text-cyan-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  {artifact.spreadsheetData.columns.map((col, idx) => (
                    <th key={idx} className="px-3 py-2.5 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {artifact.spreadsheetData.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-800/40 transition">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-2 whitespace-nowrap font-mono text-[11px]">
                        {typeof cell === 'number' ? cell.toLocaleString('vi-VN') : String(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {artifact.spreadsheetData.summary && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{artifact.spreadsheetData.summary}</span>
            </div>
          )}
        </div>
      )}

      {/* 2. SLIDE DECK CAROUSEL RENDERER */}
      {artifact.category === 'slide_deck' && artifact.slideDeckData && (
        <div className="space-y-3">
          {(() => {
            const slides = artifact.slideDeckData.slides;
            const curSlide = slides[currentSlideIndex] || slides[0];
            return (
              <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-xl">
                {/* Slide Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/40">
                      Trang {curSlide.slideNumber} / {slides.length}
                    </span>
                    <h3 className="text-white font-bold text-sm sm:text-base">
                      {curSlide.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={currentSlideIndex === 0}
                      onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                      className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={currentSlideIndex === slides.length - 1}
                      onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
                      className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Slide Bullets */}
                <div className="space-y-2">
                  {curSlide.bulletPoints.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>

                {/* Visual Idea Box */}
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-cyan-300 flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Ý tưởng minh họa: {curSlide.visualIdea}</span>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 3. DOCUMENT SECTIONS RENDERER */}
      {artifact.category === 'document' && artifact.documentData && (
        <div className="space-y-2.5 rounded-xl border border-slate-800 bg-slate-900/60 p-4 max-h-72 overflow-y-auto">
          {artifact.documentData.sections.map((sec, idx) => (
            <div key={idx} className="space-y-1 pb-2 border-b border-slate-800/60 last:border-0">
              <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>{sec.heading}</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line pl-5">
                {sec.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 4. PC CLEANUP TASKS CHECKLIST RENDERER */}
      {artifact.category === 'cleanup_report' && artifact.cleanupTasks && (
        <div className="space-y-2">
          {artifact.cleanupTasks.map((t) => {
            const isDone = completedTasks[t.id];
            return (
              <div
                key={t.id}
                onClick={() => toggleTask(t.id)}
                className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 cursor-pointer ${
                  isDone
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                    : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                    isDone ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-600 bg-slate-950'
                  }`}>
                    {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold block">{t.category}</span>
                    <span className="text-[11px] text-slate-400">{t.description}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-amber-300 block">{t.savedSpace}</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">{isDone ? '✓ Đã dọn dẹp' : 'Sẵn sàng dọn'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. VIDEO STORYBOARD UGC RENDERER */}
      {artifact.category === 'video_storyboard' && artifact.videoStoryboard && (
        <div className="space-y-2.5">
          {artifact.videoStoryboard.scenes.map((sc) => (
            <div key={sc.sceneNumber} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-800">
                <span className="font-bold text-rose-400 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-rose-400" />
                  <span>Phân cảnh {sc.sceneNumber} ({sc.time})</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  {sc.hookType}
                </span>
              </div>
              <div className="text-xs text-slate-200 space-y-1">
                <p><strong className="text-cyan-300">Góc máy & Visual:</strong> {sc.visual}</p>
                <p><strong className="text-amber-300">Giọng đọc lồng tiếng:</strong> <em>{sc.audioVoiceover}</em></p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. BANNER & GRAPHICS PREVIEW RENDERER */}
      {(artifact.category === 'banner' || artifact.category === 'poster' || artifact.category === 'social_card') && (
        <div
          className="relative w-full rounded-xl overflow-hidden p-6 sm:p-8 flex flex-col justify-between min-h-[180px] sm:min-h-[220px] shadow-inner border border-white/10"
          style={{
            background: artifact.previewGradient || 'linear-gradient(135deg, #0284c7 0%, #0f172a 100%)',
          }}
        >
          {/* Subtle decorative grid overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />

          {/* Banner Top Content */}
          <div className="relative z-10 space-y-1.5">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-mono font-bold text-cyan-300 border border-cyan-400/30 uppercase tracking-widest">
              {artifact.badgeText || 'AI PREMIUM DESIGN'}
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight drop-shadow-md leading-tight">
              {artifact.title}
            </h2>
            {artifact.slogan && (
              <p className="text-xs sm:text-sm text-cyan-100 font-medium max-w-md drop-shadow">
                {artifact.slogan}
              </p>
            )}
          </div>

          {/* Banner Bottom Action & Details */}
          <div className="relative z-10 pt-4 flex items-center justify-between flex-wrap gap-3">
            <div className="px-4 py-2 rounded-xl bg-white text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{artifact.ctaText || 'Khám Phá Ngay'}</span>
            </div>

            <div className="text-[10px] font-mono text-white/80 bg-black/50 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/10">
              Dành cho Chủ nhân Nguyễn Thanh Hải
            </div>
          </div>
        </div>
      )}

      {/* Brand Color Palette & Spec Bullets (if available) */}
      {artifact.palette && artifact.palette.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
              Bảng màu thiết kế (Click mã để copy hex):
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {artifact.palette.map((hex, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCopyHex(hex)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950 border border-slate-700 hover:border-cyan-400 transition-colors text-[10px] font-mono text-slate-300 cursor-pointer"
                  title={`Nhấp để copy mã màu ${hex}`}
                >
                  <span className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: hex }} />
                  <span>{copiedPalette === hex ? '✓ Copy' : hex}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
              Đặc tính kỹ thuật:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(artifact.features || ['Chuẩn thương mại', 'Độ phân giải 4K', 'Tối ưu chuyển đổi']).map((feat, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-950/40 text-cyan-300 border border-cyan-800/40"
                >
                  • {feat}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  identity,
  isListening,
  isSpeaking,
  isAutoDelegated,
  onSendMessage,
  onToggleListen,
  onToggleSpeech,
  onToggleAutoDelegation,
  onSwitchIdentity,
  onOpenApproval,
  onExecuteAction,
  onClearHistory,
  theme = 'cyberpunk',
  onSpeakingStateChange,
  isAiTyping = false,
  lastVoiceCommand,
  onTriggerCompletionNotice,
  selectedTargetDevice,
  onSelectTargetDevice,
}) => {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [showVoiceLog, setShowVoiceLog] = useState<boolean>(false);
  const [voiceLogFilter, setVoiceLogFilter] = useState<'all' | 'system' | 'iot' | 'code' | 'sales'>('all');

  // Target Device Selection for Master's Remote Command Dispatching
  const [targetDeviceId, setTargetDeviceId] = useState<string>('all');

  // Drag and drop & File attachment state
  const [attachments, setAttachments] = useState<ChatAttachmentItem[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (files: FileList | File[]) => {
    const newAttachments: ChatAttachmentItem[] = [];
    Array.from(files).forEach((file) => {
      const isImg = file.type.startsWith('image/');
      const isVid = file.type.startsWith('video/');
      const sizeKB = (file.size / 1024).toFixed(1);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const sizeStr = file.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`;

      const objectUrl = URL.createObjectURL(file);
      newAttachments.push({
        id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        type: isImg ? 'image' : isVid ? 'video' : 'file',
        url: objectUrl,
        sizeFormatted: sizeStr,
        fileObj: file,
      });
    });

    if (newAttachments.length > 0) {
      setAttachments((prev) => [...prev, ...newAttachments]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDraggingOver) setIsDraggingOver(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const targetDeviceOptions = useMemo(
    () => [
      { id: 'all', name: 'Tất cả thiết bị (Mesh Broadcast)', short: 'Tất cả Mesh', type: 'all' },
      { id: 'dev-server-home', name: 'Home Server 24/7 (Mini PC Ubuntu)', short: 'Home Server', type: 'server' },
      { id: 'dev-macbook-master', name: 'MacBook Pro M3 Max (Nguyễn Thanh Hải)', short: 'MacBook Pro', type: 'desktop' },
      { id: 'dev-iphone-master', name: 'iPhone 16 Pro Max (Mobile)', short: 'iPhone 16 Pro', type: 'mobile' },
      { id: 'dev-ipad-living', name: 'iPad Pro 12.9" Phòng Khách', short: 'iPad Pro', type: 'tablet' },
    ],
    []
  );

  useEffect(() => {
    if (selectedTargetDevice) {
      setTargetDeviceId(selectedTargetDevice.id);
    }
  }, [selectedTargetDevice]);

  // Playback Speed Toggle (1x, 1.5x, 2x) with persistence
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(() => {
    try {
      const stored = localStorage.getItem('hoppi_playback_speed');
      if (stored === '1x' || stored === '1.5x' || stored === '2x') return stored;
    } catch (e) {
      console.error(e);
    }
    return '1x';
  });

  const handleSetPlaybackSpeed = (speed: PlaybackSpeed) => {
    setPlaybackSpeed(speed);
    try {
      localStorage.setItem('hoppi_playback_speed', speed);
    } catch (e) {
      console.error(e);
    }
  };

  // Search & Filter state for chat history
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'assistant' | 'user' | 'code' | 'system'>('all');

  // Daily Productivity Score Visualization State (Recharts) - Collapsed by default to maximize chat space
  const [showProductivityChart, setShowProductivityChart] = useState(false);
  const [isProductivityExpanded, setIsProductivityExpanded] = useState(false);
  const [showFuturisticRadarBar, setShowFuturisticRadarBar] = useState(false);

  // Task Execution Progress state
  const [activeTask, setActiveTask] = useState<TaskExecutionState | null>(null);

  // Set of message IDs that have completed streaming typing animation
  const [animatedMessageIds, setAnimatedMessageIds] = useState<Set<string>>(() => new Set());

  // Context-Aware Right-Click Menu State
  interface ChatContextMenuState {
    isOpen: boolean;
    x: number;
    y: number;
    selectedSnippet: string;
    sourceLabel: string;
    messageId?: string;
  }

  const [contextMenu, setContextMenu] = useState<ChatContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
    selectedSnippet: '',
    sourceLabel: '',
  });

  // Action Toast Notification State
  const [actionToast, setActionToast] = useState<{
    show: boolean;
    message: string;
    type: 'rag' | 'copy' | 'summarize';
  } | null>(null);

  // Summarize Modal State
  const [summaryModal, setSummaryModal] = useState<{
    isOpen: boolean;
    originalSnippet: string;
    summary: string;
    keyTakeaway: string;
    isLoading: boolean;
  } | null>(null);

  const showToast = (message: string, type: 'rag' | 'copy' | 'summarize') => {
    setActionToast({ show: true, message, type });
    setTimeout(() => {
      setActionToast(null);
    }, 2800);
  };

  // Markdown Stripper for Copy as Clean Text
  const cleanMarkdownText = (raw: string): string => {
    return raw
      .replace(/```[a-z]*\n([\s\S]*?)```/gi, '$1') // strip code fences
      .replace(/`([^`]+)`/g, '$1') // strip inline code backticks
      .replace(/\*\*([^*]+)\*\*/g, '$1') // strip bold
      .replace(/\*([^*]+)\*/g, '$1') // strip italic
      .replace(/^#+\s+/gm, '') // strip markdown headers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // strip link URLs, preserve text
      .replace(/^[*\-+]\s+/gm, '• ') // normalize bullets
      .replace(/\n{3,}/g, '\n\n') // normalize excessive linebreaks
      .trim();
  };

  // Context Menu trigger
  const handleContextMenu = (e: React.MouseEvent, msg?: ChatMessage) => {
    e.preventDefault();
    e.stopPropagation();

    const selection = window.getSelection();
    const selectedText = selection ? selection.toString().trim() : '';

    let snippet = selectedText;
    let label = 'Đoạn văn bản bôi đen';

    if (!snippet && msg) {
      snippet = msg.text.trim();
      label = `Tin nhắn của ${msg.senderName || (msg.role === 'user' ? 'Bạn' : 'Hoppi AI')}`;
    }

    if (!snippet) return;

    // Viewport boundary guard
    const menuWidth = 280;
    const menuHeight = 240;
    const x = Math.min(e.clientX, window.innerWidth - menuWidth - 15);
    const y = Math.min(e.clientY, window.innerHeight - menuHeight - 15);

    setContextMenu({
      isOpen: true,
      x: Math.max(10, x),
      y: Math.max(10, y),
      selectedSnippet: snippet,
      sourceLabel: label,
      messageId: msg?.id,
    });
  };

  // Global listeners to close context menu
  useEffect(() => {
    const handleGlobalClick = () => {
      if (contextMenu.isOpen) {
        setContextMenu((prev) => ({ ...prev, isOpen: false }));
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setContextMenu((prev) => ({ ...prev, isOpen: false }));
        setSummaryModal(null);
      }
    };

    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [contextMenu.isOpen]);

  // Action 1: Save to RAG Memory
  const handleSaveToRagMemory = () => {
    if (!contextMenu.selectedSnippet) return;
    const snippet = contextMenu.selectedSnippet;
    const firstLine = snippet.split('\n')[0].replace(/^#+\s*/, '').trim();
    const title = firstLine.length > 40 ? firstLine.slice(0, 40) + '...' : firstLine || 'Trích đoạn Chat';

    const newMemoryItem = {
      id: `mem-chat-${Date.now()}`,
      title: `[Chat RAG] ${title}`,
      source: 'Chat Context (Nguyễn Thanh Hải)',
      contentSnippet: snippet,
      tags: ['Chat Snippet', 'RAG Memory', 'Saved Note'],
      vectorDim: 1536,
      syncedAt:
        new Date().toLocaleDateString('vi-VN') +
        ' ' +
        new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      syncedSizeKB: Math.max(1, Math.round(snippet.length / 1024)),
    };

    try {
      const stored = localStorage.getItem('hoppi_rag_memory_items');
      const existing = stored ? JSON.parse(stored) : [];
      localStorage.setItem('hoppi_rag_memory_items', JSON.stringify([newMemoryItem, ...existing]));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }

    // Dispatch real-time event to RagMemoryPanel
    window.dispatchEvent(new CustomEvent('hoppi_rag_memory_updated', { detail: newMemoryItem }));

    // Show toast
    showToast('✓ Đã lưu đoạn trích vào Bộ nhớ RAG (Vector DB)!', 'rag');
    setContextMenu((prev) => ({ ...prev, isOpen: false }));
  };

  // Action 2: Copy as Clean Text
  const handleCopyAsCleanText = () => {
    if (!contextMenu.selectedSnippet) return;
    const clean = cleanMarkdownText(contextMenu.selectedSnippet);
    navigator.clipboard
      .writeText(clean)
      .then(() => {
        showToast('✓ Đã sao chép văn bản sạch vào Clipboard!', 'copy');
        setContextMenu((prev) => ({ ...prev, isOpen: false }));
      })
      .catch(() => {
        showToast('✓ Đã sao chép vào Clipboard!', 'copy');
        setContextMenu((prev) => ({ ...prev, isOpen: false }));
      });
  };

  // Action 3: Summarize Snippet
  const handleSummarizeSnippet = async () => {
    if (!contextMenu.selectedSnippet) return;
    const snippet = contextMenu.selectedSnippet;
    setContextMenu((prev) => ({ ...prev, isOpen: false }));

    setSummaryModal({
      isOpen: true,
      originalSnippet: snippet,
      summary: 'Đang kết nối Hoppi AI Engine để tóm tắt...',
      keyTakeaway: 'Đang phân tích...',
      isLoading: true,
    });

    try {
      const res = await fetch('/api/gemini/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: snippet }),
      });
      const data = await res.json();
      setSummaryModal({
        isOpen: true,
        originalSnippet: snippet,
        summary: data.summary || `• ${snippet.slice(0, 150)}...`,
        keyTakeaway: data.keyTakeaway || 'Điểm cốt lõi quan trọng nhất',
        isLoading: false,
      });
    } catch (e) {
      console.error(e);
      // Local fallback summarization
      const lines = snippet.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
      const bullets = (lines.length > 0 ? lines : [snippet])
        .slice(0, 3)
        .map((l) => `• ${l.replace(/^[-*•]\s*/, '').slice(0, 120)}`);
      setSummaryModal({
        isOpen: true,
        originalSnippet: snippet,
        summary: bullets.join('\n'),
        keyTakeaway: bullets[0]?.replace(/^•\s*/, '') || 'Thông tin chính từ đoạn trích',
        isLoading: false,
      });
    }
  };

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-trigger multi-step task execution progress bar when Hoppi is typing or executing background jobs
  useEffect(() => {
    if (isAiTyping) {
      const currentDev =
        targetDeviceOptions.find((d) => d.id === targetDeviceId)?.name ||
        'Home Server 24/7 (Mini PC)';
      const sampleTasks: Array<{ title: string; steps: string[]; category: TaskExecutionState['category'] }> = [
        {
          title: `Truy vấn Vector RAG & Thẩm định ngữ cảnh [${currentDev}]`,
          steps: [
            'Phân tích ngữ nghĩa & thẩm định quyền bảo mật',
            'Truy vấn cơ sở tri thức ChromaDB / FAISS',
            'Kích hoạt mô hình suy luận đa tác nhân (Multi-Agent)',
            'Tổng hợp kết quả & đồng bộ bộ nhớ dài hạn',
          ],
          category: 'rag',
        },
        {
          title: `Kiểm tra hạ tầng mạng & IoT [${currentDev}]`,
          steps: [
            'Quét cổng dịch vụ mạng LAN & Zigbee IoT',
            'Đo đạc ping độ trễ & lượng tài nguyên phần cứng',
            'Kiểm tra chứng thực Token Thiết bị Tin Cậy',
            'Hoàn tất báo cáo tình trạng toàn diện',
          ],
          category: 'system',
        },
        {
          title: `Phân tích mã nguồn và kiểm định sandbox [${currentDev}]`,
          steps: [
            'Rà soát cú pháp AST & phát hiện bug thuật toán',
            'Chạy thử nghiệm trong sandbox cô lập an toàn',
            'Tối ưu hóa hiệu năng & cấu trúc module',
            'Lưu nhật ký bảo mật phiên làm việc',
          ],
          category: 'code',
        },
      ];

      const chosen = sampleTasks[Math.floor(Math.random() * sampleTasks.length)];
      const taskId = `task-${Date.now()}`;
      setActiveTask({
        id: taskId,
        title: chosen.title,
        steps: chosen.steps,
        currentStepIndex: 0,
        progress: 20,
        isRunning: true,
        category: chosen.category,
        targetDeviceName: currentDev,
      });

      const timer1 = setTimeout(() => {
        setActiveTask((prev) =>
          prev && prev.id === taskId ? { ...prev, currentStepIndex: 1, progress: 50 } : prev
        );
      }, 350);

      const timer2 = setTimeout(() => {
        setActiveTask((prev) =>
          prev && prev.id === taskId ? { ...prev, currentStepIndex: 2, progress: 80 } : prev
        );
      }, 850);

      const timer3 = setTimeout(() => {
        setActiveTask((prev) =>
          prev && prev.id === taskId ? { ...prev, currentStepIndex: 3, progress: 95 } : prev
        );
      }, 1400);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      // Complete current task
      setActiveTask((prev) => {
        if (!prev || !prev.isRunning) return prev;
        return {
          ...prev,
          currentStepIndex: prev.steps.length - 1,
          progress: 100,
          isRunning: false,
        };
      });
      const hideTimer = setTimeout(() => {
        setActiveTask(null);
      }, 2500);
      return () => clearTimeout(hideTimer);
    }
  }, [isAiTyping, targetDeviceId, targetDeviceOptions]);

  // Manual Trigger for Multi-step task demonstration and device completion notice
  const handleStartAutonomousTask = (customTitle?: string, devName?: string) => {
    const taskId = `task-${Date.now()}`;
    const targetName =
      devName ||
      targetDeviceOptions.find((d) => d.id === targetDeviceId)?.name ||
      'Home Server 24/7 (Mini PC)';

    const steps = [
      `Phát lệnh từ xa tới thiết bị: ${targetName}`,
      'Đồng bộ dữ liệu Vector Mesh & Kiểm tra bảo mật HITL',
      'Thực thi agent chuyên trách & kiểm thử sandbox',
      'Xuất bản phản hồi & thông báo hoàn thành cho Chủ nhân',
    ];
    setActiveTask({
      id: taskId,
      title: customTitle || `Thực thi quy trình tự trị trên ${targetName}`,
      steps,
      currentStepIndex: 0,
      progress: 25,
      isRunning: true,
      category: 'system',
      targetDeviceName: targetName,
    });

    setTimeout(() => {
      setActiveTask((prev) =>
        prev && prev.id === taskId ? { ...prev, currentStepIndex: 1, progress: 55 } : prev
      );
    }, 450);

    setTimeout(() => {
      setActiveTask((prev) =>
        prev && prev.id === taskId ? { ...prev, currentStepIndex: 2, progress: 85 } : prev
      );
    }, 1000);

    setTimeout(() => {
      setActiveTask((prev) =>
        prev && prev.id === taskId
          ? { ...prev, currentStepIndex: 3, progress: 100, isRunning: false }
          : prev
      );

      // Trigger animated Hoppi Completion Overlay banner with spoken voice!
      if (onTriggerCompletionNotice) {
        const title = customTitle || 'Kiểm tra & Tối ưu hóa Toàn Diện Hệ Thống';
        const notice: HoppiCompletionNotice = {
          id: `notice-${Date.now()}`,
          sourceDeviceId: targetDeviceId || 'dev-server-home',
          sourceDeviceName: targetName,
          taskTitle: title,
          summary: `Hoppi đã hoàn thành công việc "${title}" trên thiết bị ${targetName}. Toàn bộ báo cáo và trạng thái đã được lưu trữ an toàn và đồng bộ hóa tới toàn bộ 5 thiết bị trong mạng lưới.`,
          spokenMessage: `Chủ nhân Nguyễn Thanh Hải ơi, tôi đã hoàn thành xong công việc ${title} trên ${targetName} rồi ạ! Mời chủ nhân xem báo cáo.`,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          mood: 'happy',
        };
        onTriggerCompletionNotice(notice);
      }

      setTimeout(() => setActiveTask(null), 3000);
    }, 1600);
  };

  // Immediate Test trigger for Hoppi Completion Notification
  const handleTestCompletionNotice = () => {
    const targetName =
      targetDeviceOptions.find((d) => d.id === targetDeviceId)?.name ||
      'Home Server 24/7 (Mini PC)';
    if (onTriggerCompletionNotice) {
      onTriggerCompletionNotice({
        id: `notice-${Date.now()}`,
        sourceDeviceId: targetDeviceId,
        sourceDeviceName: targetName,
        taskTitle: 'Sao lưu & Đồng bộ Vector Database Mesh',
        summary: `Hoppi đã sao lưu 1,420 vector tri thức thành công trên ${targetName}. Mạng lưới 5 thiết bị đã đồng bộ 100%.`,
        spokenMessage: `Chủ nhân Nguyễn Thanh Hải ơi, tôi đã hoàn thành xong công việc sao lưu và đồng bộ tri thức trên ${targetName} rồi ạ!`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        mood: 'happy',
      });
    }
  };

  // 1. Voice Command Log State with persistence
  const [voiceLogs, setVoiceLogs] = useState<VoiceCommandLogItem[]>(() => {
    try {
      const stored = localStorage.getItem('hoppi_voice_command_logs');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading voice logs:', e);
    }
    // Default pre-seeded voice commands from Hoppi Blueprint
    return [
      {
        id: 'vcmd-1',
        command: 'Hoppi, kiểm tra toàn bộ phân hệ máy chủ 24/7',
        timestamp: '09:12',
        success: true,
        category: 'system',
        durationMs: 420,
      },
      {
        id: 'vcmd-2',
        command: 'Hoppi, quét và bật đèn thông minh trong mạng LAN',
        timestamp: '09:30',
        success: true,
        category: 'iot',
        durationMs: 510,
      },
      {
        id: 'vcmd-3',
        command: 'Hoppi, phân tích lỗi thuật toán trong Code Agent',
        timestamp: '10:05',
        success: true,
        category: 'code',
        durationMs: 640,
      },
      {
        id: 'vcmd-4',
        command: 'Hoppi, rà soát cảm xúc khách hàng trên Zalo OA',
        timestamp: '10:20',
        success: true,
        category: 'sales',
        durationMs: 380,
      },
      {
        id: 'vcmd-5',
        command: 'Hoppi, tự học và lấp lỗ hổng tri thức từ tài liệu',
        timestamp: '10:45',
        success: true,
        category: 'system',
        durationMs: 780,
      },
    ];
  });

  // Save voice logs to LocalStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('hoppi_voice_command_logs', JSON.stringify(voiceLogs));
    } catch (e) {
      console.error(e);
    }
  }, [voiceLogs]);

  // Automatically record when a new voice command triggers from parent
  useEffect(() => {
    if (lastVoiceCommand && lastVoiceCommand.trim()) {
      addVoiceLogEntry(lastVoiceCommand.trim());
    }
  }, [lastVoiceCommand]);

  const addVoiceLogEntry = (cmd: string) => {
    let cat: 'system' | 'code' | 'sales' | 'iot' | 'auth' = 'system';
    const lower = cmd.toLowerCase();
    if (lower.includes('đèn') || lower.includes('iot') || lower.includes('mạng lan') || lower.includes('router')) {
      cat = 'iot';
    } else if (lower.includes('code') || lower.includes('thuật toán') || lower.includes('bug') || lower.includes('git')) {
      cat = 'code';
    } else if (lower.includes('zalo') || lower.includes('khách') || lower.includes('báo giá') || lower.includes('crm')) {
      cat = 'sales';
    }

    const newEntry: VoiceCommandLogItem = {
      id: `vcmd-${Date.now()}`,
      command: cmd,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      success: true,
      category: cat,
      durationMs: Math.floor(350 + Math.random() * 400),
    };

    setVoiceLogs((prev) => [newEntry, ...prev.slice(0, 40)]);
  };

  const handleReRunVoiceCommand = (commandText: string) => {
    // 1-click re-run
    onSendMessage(commandText);
    addVoiceLogEntry(commandText);
  };

  const handleClearVoiceLogs = () => {
    if (confirm('Bạn có muốn xóa toàn bộ lịch sử các lệnh giọng nói đã ghi nhận?')) {
      setVoiceLogs([]);
      try {
        localStorage.removeItem('hoppi_voice_command_logs');
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  // Clean up any ongoing TTS on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Sync playingMessageId if external speech is turned off or ended
  useEffect(() => {
    if (!isSpeaking && playingMessageId) {
      setPlayingMessageId(null);
    }
  }, [isSpeaking, playingMessageId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && attachments.length === 0) return;

    let textToSend = input.trim();
    if (!textToSend && attachments.length > 0) {
      textToSend = `[Chủ nhân gửi ${attachments.length} tệp đính kèm: ${attachments.map(a => a.name).join(', ')}]`;
    }

    let detectedTarget = targetDeviceId;

    // Detect natural language device commands in input
    const lower = textToSend.toLowerCase();
    if (lower.startsWith('lệnh cho home server') || lower.includes('trên home server')) {
      detectedTarget = 'dev-server-home';
    } else if (lower.startsWith('lệnh cho macbook') || lower.includes('trên macbook')) {
      detectedTarget = 'dev-macbook-master';
    } else if (lower.startsWith('lệnh cho iphone') || lower.includes('trên iphone')) {
      detectedTarget = 'dev-iphone-master';
    } else if (lower.startsWith('lệnh cho ipad') || lower.includes('trên ipad')) {
      detectedTarget = 'dev-ipad-living';
    }

    if (identity.isMaster && detectedTarget !== 'all') {
      const devName = targetDeviceOptions.find((d) => d.id === detectedTarget)?.name || 'Thiết bị';
      if (!textToSend.startsWith('[')) {
        textToSend = `[🎯 Lệnh tới ${devName}]: ${textToSend}`;
      }
    }

    const outgoingAttachments = attachments.map(({ id, name, type, url, sizeFormatted }) => ({
      id,
      name,
      type,
      url,
      sizeFormatted,
    }));

    onSendMessage(textToSend, outgoingAttachments);
    setInput('');
    setAttachments([]);

    // If it was a device task command, launch task progress and fire completion notice
    if (
      identity.isMaster &&
      (lower.includes('sao lưu') ||
        lower.includes('kiểm định') ||
        lower.includes('quét') ||
        lower.includes('bật camera') ||
        lower.includes('lệnh cho') ||
        lower.includes('audit'))
    ) {
      const taskDevName =
        targetDeviceOptions.find((d) => d.id === detectedTarget)?.name || 'Home Server 24/7';
      handleStartAutonomousTask(`Tác vụ: "${input.trim().slice(0, 45)}"`, taskDevName);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // TTS Toggle for individual chat bubble
  const handleToggleMessageTTS = (message: ChatMessage) => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn chưa hỗ trợ Web Speech Synthesis.');
      return;
    }

    // If currently playing this specific message, toggle it OFF (stop)
    if (playingMessageId === message.id) {
      window.speechSynthesis.cancel();
      setPlayingMessageId(null);
      if (onSpeakingStateChange) {
        onSpeakingStateChange(false);
      }
      return;
    }

    // Otherwise, cancel any existing utterance and speak only this message
    window.speechSynthesis.cancel();

    // Clean text: strip markdown code blocks, bold, italics, backticks, emojis/symbols
    const cleanText = message.text
      .replace(/```[\s\S]*?```/g, ' [Đoạn mã lập trình] ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[*_#`[\]()$]/g, '')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'vi-VN';
    // Dynamic TTS Speech Rate aligned with Playback Speed Toggle
    utterance.rate = playbackSpeed === '2x' ? 1.75 : playbackSpeed === '1.5x' ? 1.35 : 1.05;

    // Select Vietnamese voice if available
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find((v) => v.lang.startsWith('vi') || v.lang.includes('VN'));
    if (viVoice) {
      utterance.voice = viVoice;
    }

    utterance.onstart = () => {
      setPlayingMessageId(message.id);
      if (onSpeakingStateChange) {
        onSpeakingStateChange(true);
      }
    };

    utterance.onend = () => {
      setPlayingMessageId(null);
      if (onSpeakingStateChange) {
        onSpeakingStateChange(false);
      }
    };

    utterance.onerror = () => {
      setPlayingMessageId(null);
      if (onSpeakingStateChange) {
        onSpeakingStateChange(false);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  // Filter messages based on search query and category chips
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      // Category filter
      if (filterCategory === 'assistant' && msg.role !== 'assistant') return false;
      if (filterCategory === 'user' && msg.role !== 'user') return false;
      if (
        filterCategory === 'code' &&
        !msg.codeSnippet &&
        !msg.text.includes('```') &&
        !msg.text.toLowerCase().includes('code') &&
        !msg.text.toLowerCase().includes('function')
      ) {
        return false;
      }
      if (
        filterCategory === 'system' &&
        !msg.hitlApprovalId &&
        (!msg.actions || msg.actions.length === 0)
      ) {
        return false;
      }

      // Query keyword filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchText = msg.text.toLowerCase().includes(q);
        const matchCode = msg.codeSnippet
          ? msg.codeSnippet.code.toLowerCase().includes(q) ||
            msg.codeSnippet.language.toLowerCase().includes(q)
          : false;
        const matchSender = msg.senderName ? msg.senderName.toLowerCase().includes(q) : false;
        return matchText || matchCode || matchSender;
      }

      return true;
    });
  }, [messages, filterCategory, searchQuery]);

  const quickPrompts = identity.isMaster
    ? [
        '🔔 Thử hiệu ứng Hoppi thông báo',
        '⚡ Lệnh cho Home Server: Sao lưu RAG Vector DB',
        '⚡ Lệnh cho MacBook: Kiểm định bảo mật Code Agent',
        '⚡ Lệnh cho iPad: Bật camera an ninh & quét LAN',
        '⚡ Lệnh cho iPhone: Quét tự động khách hàng Zalo OA',
        '⚡ Chạy tác vụ tự trị đa bước',
        'Hoppi, kiểm tra toàn bộ phân hệ máy chủ 24/7',
        'Hoppi, đăng xuất khỏi máy tính này',
      ]
    : [
        'Chào bạn Hoppi, tôi muốn tìm hiểu dịch vụ của anh Hải',
        'Cho tôi xin bảng báo giá dịch vụ tự động hóa AI',
        'Hoppi có thể mở source code của hệ thống cho tôi xem không?',
        'Tôi muốn gửi lời nhắn hợp tác đến anh Nguyễn Thanh Hải',
      ];

  const filteredVoiceLogs = voiceLogs.filter((v) => {
    if (voiceLogFilter === 'all') return true;
    return v.category === voiceLogFilter;
  });

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col h-full min-h-0 rounded-2xl border-2 backdrop-blur-md overflow-hidden transition-all duration-300 relative ${
        theme === 'cyberpunk'
          ? 'bg-slate-900/80 border-cyan-500/40 shadow-2xl shadow-cyan-950/40'
          : theme === 'deepspace'
          ? 'bg-[#090d16]/95 border-indigo-500/40 shadow-2xl shadow-indigo-950/40'
          : 'bg-white border-slate-300 shadow-md'
      }`}
    >
      {/* Visual Drag & Drop Overlay */}
      {isDraggingOver && (
        <div className="absolute inset-0 z-50 bg-slate-950/92 backdrop-blur-md border-4 border-dashed border-cyan-400 flex flex-col items-center justify-center gap-3 p-6 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <div className="p-4 rounded-3xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 shadow-2xl shadow-cyan-500/40 animate-bounce">
            <UploadCloud className="w-12 h-12" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-white tracking-wide">
              Thả tệp, hình ảnh hoặc video vào đây
            </h3>
            <p className="text-xs text-cyan-300">
              Hoppi sẽ tự động nhận diện và gửi kèm vào yêu cầu cho Chủ nhân
            </p>
          </div>
        </div>
      )}
      {/* Chat Top Bar */}
      <div
        className={`px-4 py-3 border-b flex items-center justify-between flex-wrap gap-2 transition-colors shrink-0 ${
          theme === 'cyberpunk'
            ? 'bg-slate-950/80 border-slate-800'
            : theme === 'deepspace'
            ? 'bg-[#06080e] border-neutral-800'
            : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5">
            <div
              className={`w-full h-full rounded-[6px] flex items-center justify-center ${
                theme === 'light' ? 'bg-white' : 'bg-slate-950'
              }`}
            >
              <Bot className="w-4 h-4 text-cyan-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`font-bold text-sm ${
                  theme === 'light' ? 'text-slate-900' : 'text-white'
                }`}
              >
                Hoppi Autonomous Engine
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                24/7 Active
              </span>
            </div>
            <p
              className={`text-[11px] flex items-center gap-1.5 flex-wrap ${
                theme === 'light' ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              <span>Đang tương tác cùng: </span>
              <span
                className={
                  identity.isMaster
                    ? 'text-cyan-500 font-semibold'
                    : 'text-amber-500 font-semibold'
                }
              >
                {identity.name} ({identity.isMaster ? 'Chủ nhân' : 'Khách lạ'})
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[10px] font-mono">
                {messages.length} tin nhắn (LocalStorage)
              </span>
            </p>
          </div>
        </div>

        {/* Identity, Auto Delegation, Voice Command Log & Global Audio Switches */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          {/* Futuristic Asking AI Radar Console Toggle Button */}
          <button
            type="button"
            onClick={() => setShowFuturisticRadarBar(!showFuturisticRadarBar)}
            title="Bật/Tắt Thanh Tìm Kiếm Radar & Cây Phân Nhánh AI 3 Tầng"
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              showFuturisticRadarBar
                ? 'bg-gradient-to-r from-cyan-500/25 to-blue-500/25 text-cyan-200 border-cyan-400 shadow-sm shadow-cyan-500/20'
                : theme === 'light'
                ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Radar AI</span>
            {showFuturisticRadarBar ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
          </button>

          {/* Daily Productivity Score (Recharts) Visualization Toggle Button */}
          <button
            type="button"
            onClick={() => setShowProductivityChart(!showProductivityChart)}
            title="Xem biểu đồ Điểm Năng Suất Hàng Ngày (Daily Productivity Score) theo Tâm trạng & Tốc độ"
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              showProductivityChart
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/20'
                : theme === 'light'
                ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Năng Suất: 95.8</span>
            {showProductivityChart ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
          </button>

          {/* Voice Command Log Drawer Toggle Button */}
          <button
            type="button"
            onClick={() => setShowVoiceLog(!showVoiceLog)}
            title="Mở nhật ký các lệnh giọng nói đã thực hiện và chạy lại nhanh"
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              showVoiceLog
                ? 'bg-cyan-500/25 text-cyan-300 border-cyan-400 shadow-sm shadow-cyan-500/20'
                : theme === 'light'
                ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>Nhật Ký Giọng Nói</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 font-mono">
              {voiceLogs.length}
            </span>
            {showVoiceLog ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
          </button>

          {/* Quick toggle between Master and Guest simulation */}
          <button
            onClick={onSwitchIdentity}
            title="Đổi vai để kiểm thử phân biệt Chủ nhân vs Khách lạ"
            className={`px-2.5 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
              theme === 'light'
                ? 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                : 'border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Đổi vai: {identity.isMaster ? 'Sang Khách' : 'Sang Chủ nhân'}</span>
          </button>

          {/* Auto-delegation switch (Khối 6 trong Blueprint) */}
          {identity.isMaster && (
            <button
              onClick={onToggleAutoDelegation}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                isAutoDelegated
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                  : theme === 'light'
                  ? 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-600'
              }`}
              title="Bật: Tự động hoàn thành trọn gói. Tắt: Hỏi ý kiến chủ nhân trước khi làm."
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Ủy quyền: {isAutoDelegated ? 'BẬT' : 'TẮT'}</span>
            </button>
          )}

          {/* Speed Toggle (1x, 1.5x, 2x) */}
          <div
            className={`flex items-center rounded-lg border p-0.5 text-xs transition-colors ${
              theme === 'light'
                ? 'bg-white border-slate-200'
                : theme === 'deepspace'
                ? 'bg-[#0a0f1d] border-neutral-700'
                : 'bg-slate-900 border-slate-700'
            }`}
            title="Tốc độ streaming & đọc TTS phản hồi AI (1x, 1.5x, 2x)"
          >
            <span className="px-1.5 text-[10px] text-cyan-400 font-mono flex items-center gap-1 font-semibold">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span className="hidden sm:inline">Tốc độ</span>
            </span>
            {(['1x', '1.5x', '2x'] as PlaybackSpeed[]).map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => handleSetPlaybackSpeed(spd)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium transition-all cursor-pointer ${
                  playbackSpeed === spd
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/30 scale-105'
                    : theme === 'light'
                    ? 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {spd}
              </button>
            ))}
          </div>

          {/* Voice mute / unmute */}
          <button
            onClick={onToggleSpeech}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isSpeaking
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                : theme === 'light'
                ? 'bg-white text-slate-500 border-slate-200 hover:text-slate-900'
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title={isSpeaking ? 'Tắt đọc âm thanh' : 'Bật đọc âm thanh'}
          >
            {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Clear chat history from LocalStorage */}
          <button
            onClick={onClearHistory}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              theme === 'light'
                ? 'border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:border-rose-300'
                : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-rose-400 hover:border-rose-500/40'
            }`}
            title="Xóa lịch sử chat trong LocalStorage"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* NEW: Voice Command Log Section (Drop-down Drawer) */}
      {showVoiceLog && (
        <div
          className={`border-b p-3.5 transition-all animate-in slide-in-from-top-2 duration-200 z-10 shadow-lg ${
            theme === 'light'
              ? 'bg-slate-50 border-slate-200 text-slate-800'
              : theme === 'deepspace'
              ? 'bg-[#080d16] border-neutral-800 text-neutral-200'
              : 'bg-slate-950/95 border-slate-800 text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between gap-3 mb-2.5 pb-2 border-b border-slate-800/40 flex-wrap">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Nhật Ký Lệnh Giọng Nói (Voice Command Log)
              </h4>
              <span className="text-[11px] text-slate-400">
                Nhấp nút "Chạy lại" để thực thi nhanh chỉ với 1 cú click
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Filter tabs */}
              <div className="flex items-center gap-1 text-[11px]">
                {(['all', 'system', 'iot', 'code', 'sales'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setVoiceLogFilter(cat)}
                    className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                      voiceLogFilter === cat
                        ? 'bg-cyan-500/25 text-cyan-300 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat === 'all'
                      ? 'Tất cả'
                      : cat === 'system'
                      ? 'Hệ thống'
                      : cat === 'iot'
                      ? 'LAN/IoT'
                      : cat === 'code'
                      ? 'Code'
                      : 'Sales CRM'}
                  </button>
                ))}
              </div>

              {/* Clear logs */}
              {voiceLogs.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearVoiceLogs}
                  className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer ml-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Xóa nhật ký</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowVoiceLog(false)}
                className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Voice Command Log List */}
          {filteredVoiceLogs.length === 0 ? (
            <div className="text-center py-4 text-xs text-slate-400 font-mono">
              Chưa có lệnh giọng nói nào trong danh mục này. Hãy kích hoạt micro và ra lệnh cho Hoppi!
            </div>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {filteredVoiceLogs.map((item) => (
                <div
                  key={item.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors ${
                    theme === 'light'
                      ? 'bg-white border-slate-200 hover:border-cyan-400'
                      : theme === 'deepspace'
                      ? 'bg-[#0e1422] border-neutral-800 hover:border-neutral-700'
                      : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        item.category === 'iot'
                          ? 'bg-amber-500/20 text-amber-400'
                          : item.category === 'code'
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : item.category === 'sales'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-indigo-500/20 text-indigo-400'
                      }`}
                    >
                      {item.category === 'iot' && <Radio className="w-3 h-3" />}
                      {item.category === 'code' && <Code2 className="w-3 h-3" />}
                      {item.category === 'sales' && <ShoppingCart className="w-3 h-3" />}
                      {item.category === 'system' && <Server className="w-3 h-3" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-100 truncate">
                          "{item.command}"
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-mono">{item.timestamp}</span>
                        <span>•</span>
                        <span className="uppercase text-[9px] font-mono tracking-wider text-cyan-400">
                          {item.category}
                        </span>
                        <span>•</span>
                        <span className="text-emerald-400">Đã hoàn thành</span>
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Re-run button */}
                  <button
                    type="button"
                    onClick={() => handleReRunVoiceCommand(item.command)}
                    title={`Chạy lại lệnh: "${item.command}"`}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-[11px] transition-all flex items-center gap-1.5 shrink-0 shadow-sm shadow-cyan-500/20 cursor-pointer active:scale-95"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Chạy lại</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Daily Productivity Score Data Visualization Section using Recharts */}
      {showProductivityChart && (
        <ProductivityScoreChart
          theme={theme}
          isExpanded={isProductivityExpanded}
          onToggleExpand={() => setIsProductivityExpanded(!isProductivityExpanded)}
          completedTasksCount={28}
          averageResponseTimeMs={385}
          currentMood={messages[messages.length - 1]?.mood || 'happy'}
        />
      )}

      {/* Futuristic Asking AI Agent Bar (Radar Scanner & 3-Branch Tree) */}
      <AnimatePresence>
        {showFuturisticRadarBar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 border-b border-cyan-500/30 bg-slate-950/90 backdrop-blur-xl"
          >
            <FuturisticAskingAiBar
              onSendMessage={(q) => onSendMessage(q)}
              onSpeakText={(t) =>
                handleToggleMessageTTS({
                  id: `preview-${Date.now()}`,
                  role: 'assistant',
                  text: t,
                  timestamp: '',
                })
              }
              isListening={isListening}
              onToggleListen={onToggleListen}
              theme={theme}
              isAiTyping={isAiTyping}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Searchable Filter Bar above Chat Message History */}
      <div
        className={`px-4 py-2.5 border-b flex items-center justify-between gap-3 flex-wrap transition-colors shrink-0 ${
          theme === 'light'
            ? 'bg-slate-100/90 border-slate-200'
            : theme === 'deepspace'
            ? 'bg-[#070b13] border-neutral-800'
            : 'bg-slate-950/70 border-slate-800'
        }`}
      >
        {/* Search Input Box */}
        <div className="flex-1 min-w-[210px] relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm lịch sử (từ khóa, mã code, câu hỏi)..."
            className={`w-full pl-8 pr-7 py-1 text-xs rounded-lg border focus:outline-none transition-colors ${
              theme === 'light'
                ? 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-cyan-500'
                : 'bg-slate-900/90 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-cyan-400'
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 cursor-pointer"
              title="Xóa tìm kiếm"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1 text-[11px] flex-wrap">
          {(
            [
              { id: 'all', label: 'Tất cả' },
              { id: 'assistant', label: 'Hoppi AI' },
              { id: 'user', label: 'Chủ nhân' },
              { id: 'code', label: 'Code Snippet' },
              { id: 'system', label: 'HITL/Lệnh' },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterCategory(f.id)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors cursor-pointer ${
                filterCategory === f.id
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 font-semibold shadow-sm'
                  : theme === 'light'
                  ? 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Match Count Badge & Reset */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 shrink-0">
          <span className="px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            {filteredMessages.length}/{messages.length}
          </span>
          <span>khớp</span>
          {(searchQuery || filterCategory !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilterCategory('all');
              }}
              className="text-[10px] text-cyan-400 hover:underline cursor-pointer ml-1"
            >
              Đặt lại
            </button>
          )}
        </div>
      </div>

      {/* Task Execution Progress Bar (Autonomous Background Workflows) */}
      {activeTask && (
        <div
          className={`px-4 py-3 border-b transition-all duration-300 animate-in slide-in-from-top-1 ${
            theme === 'light'
              ? 'bg-cyan-50/95 border-cyan-200 text-slate-900'
              : theme === 'deepspace'
              ? 'bg-[#091122] border-indigo-950/70 text-slate-100'
              : 'bg-slate-950/95 border-cyan-500/30 text-slate-100'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5 gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                {activeTask.isRunning ? (
                  <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <span className="uppercase tracking-wider text-[10px] font-mono">[TIẾN ĐỘ TÁC VỤ ĐA BƯỚC]</span>
                  <span className="text-slate-200 font-medium">{activeTask.title}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400">
                {activeTask.progress}%
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-mono tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                Bước {activeTask.currentStepIndex + 1}/{activeTask.steps.length}
              </span>
            </div>
          </div>

          {/* Progress Track with animated glowing pulse */}
          <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-500 ease-out relative"
              style={{ width: `${activeTask.progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-[pulse_1s_ease-in-out_infinite]" />
            </div>
          </div>

          {/* Current Step Description & Real-time Indicator */}
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400 flex-wrap gap-1">
            <span className="flex items-center gap-1 text-slate-300 font-medium">
              <span className="text-cyan-400 font-bold">▸</span>
              <span>{activeTask.steps[activeTask.currentStepIndex]}</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              {activeTask.isRunning ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>Đang tự trị thực thi ngầm...</span>
                </>
              ) : (
                <span className="text-emerald-400">✓ Đã hoàn tất thành công</span>
              )}
            </span>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div
        className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 custom-scrollbar"
        onContextMenu={(e) => handleContextMenu(e)}
      >
        {filteredMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
            <Search className="w-8 h-8 text-slate-600 mb-2" />
            <p className="text-sm font-semibold text-slate-300">Không tìm thấy tin nhắn phù hợp</p>
            <p className="text-xs text-slate-500 mt-1">
              Thử từ khóa khác hoặc bấm "Đặt lại" để xem toàn bộ lịch sử.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilterCategory('all');
              }}
              className="mt-3 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium hover:bg-cyan-500/30 transition-colors cursor-pointer"
            >
              Xem tất cả tin nhắn
            </button>
          </div>
        ) : (
          filteredMessages.map((msg, index) => {
            const isUser = msg.role === 'user';
            const isAssistant = msg.role === 'assistant';
            const isPlayingThis = playingMessageId === msg.id;
            const isLatestAssistant = isAssistant && index === filteredMessages.length - 1;
            const shouldAnimateTyping = isLatestAssistant && !animatedMessageIds.has(msg.id);

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span
                    className={`text-[10px] font-medium ${
                      theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    {isUser ? msg.senderName || 'Bạn' : 'Hoppi (v4.0)'}
                  </span>
                  <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  {msg.mood && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                        theme === 'light'
                          ? 'bg-slate-200 text-cyan-700'
                          : 'bg-slate-800 text-cyan-300'
                      }`}
                    >
                      {msg.mood}
                    </span>
                  )}
                  {isPlayingThis && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-mono flex items-center gap-1 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      Đang đọc
                    </span>
                  )}
                </div>

                <div
                  onContextMenu={(e) => handleContextMenu(e, msg)}
                  className={`relative px-4 py-3.5 rounded-2xl max-w-[88%] text-sm leading-relaxed transition-all shadow-md ${
                    isUser
                      ? 'bg-gradient-to-r from-cyan-700 via-blue-700 to-indigo-700 text-white rounded-tr-none border-2 border-cyan-400/80 shadow-lg shadow-cyan-950/60'
                      : isPlayingThis
                      ? theme === 'light'
                        ? 'bg-cyan-50 text-slate-950 border-2 border-cyan-500 rounded-tl-none shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-900/95 text-slate-100 border-2 border-cyan-400 rounded-tl-none shadow-xl shadow-cyan-500/25 ring-1 ring-cyan-400/40'
                      : theme === 'light'
                      ? 'bg-white text-slate-900 border-2 border-slate-300 rounded-tl-none shadow-sm'
                      : theme === 'deepspace'
                      ? 'bg-[#0c1220] text-slate-100 border-2 border-indigo-500/60 rounded-tl-none shadow-lg shadow-indigo-950/40'
                      : 'bg-slate-900/95 text-slate-100 border-2 border-cyan-500/50 rounded-tl-none shadow-lg shadow-cyan-950/60'
                  }`}
                >
                  {/* Real-time Streaming Animation with Speed Toggle & Highlighting for Assistant vs User */}
                  {isAssistant ? (
                    <StreamingMessageContent
                      text={msg.text}
                      isLatest={isLatestAssistant}
                      shouldAnimate={shouldAnimateTyping}
                      speed={playbackSpeed}
                      searchQuery={searchQuery}
                      onAnimationComplete={() => {
                        setAnimatedMessageIds((prev) => new Set(prev).add(msg.id));
                      }}
                    />
                  ) : (
                    <HighlightedText text={msg.text} query={searchQuery} />
                  )}

                  {/* Render Message Attachments (Images, Videos, Files) */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {msg.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="rounded-xl overflow-hidden border border-slate-700/80 bg-black/40 p-1.5 max-w-xs shadow-md"
                        >
                          {att.type === 'image' && (
                            <div>
                              <img
                                src={att.url}
                                alt={att.name}
                                className="max-h-48 rounded-lg object-cover w-full cursor-pointer hover:opacity-95 transition-opacity"
                                onClick={() => window.open(att.url, '_blank')}
                              />
                              <div className="px-1 pt-1 text-[10px] text-cyan-200 font-mono truncate flex items-center gap-1">
                                <ImageIcon className="w-3 h-3 text-cyan-400 shrink-0" />
                                <span className="truncate">{att.name}</span>
                                <span className="text-slate-400 shrink-0">({att.sizeFormatted})</span>
                              </div>
                            </div>
                          )}

                          {att.type === 'video' && (
                            <div>
                              <video
                                src={att.url}
                                controls
                                className="max-h-48 rounded-lg w-full bg-black"
                              />
                              <div className="px-1 pt-1 text-[10px] text-indigo-200 font-mono truncate flex items-center gap-1">
                                <FileVideo className="w-3 h-3 text-indigo-400 shrink-0" />
                                <span className="truncate">{att.name}</span>
                                <span className="text-slate-400 shrink-0">({att.sizeFormatted})</span>
                              </div>
                            </div>
                          )}

                          {att.type === 'file' && (
                            <a
                              href={att.url}
                              download={att.name}
                              className="p-2 flex items-center gap-2 hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer text-left"
                            >
                              <FileText className="w-6 h-6 text-emerald-400 shrink-0" />
                              <div className="truncate min-w-0">
                                <div className="font-semibold text-slate-200 text-xs truncate">
                                  {att.name}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {att.sizeFormatted} • Click để tải về
                                </div>
                              </div>
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                {/* Optional Code Snippet Block */}
                {msg.codeSnippet && (
                  <div
                    className={`mt-3 rounded-lg overflow-hidden border ${
                      theme === 'light'
                        ? 'border-slate-300 bg-slate-900 text-slate-100'
                        : 'border-slate-800 bg-[#070b12]'
                    }`}
                  >
                    <div className="px-3 py-1.5 bg-slate-900/90 text-xs font-mono text-cyan-400 flex items-center justify-between border-b border-slate-800">
                      <span>{msg.codeSnippet.language}</span>
                      <button
                        onClick={() => handleCopy(msg.codeSnippet!.code, msg.id)}
                        className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        {copiedId === msg.id ? 'Đã copy' : 'Copy'}
                      </button>
                    </div>
                    <pre className="p-3 text-xs font-mono text-emerald-300 overflow-x-auto">
                      <code>{msg.codeSnippet.code}</code>
                    </pre>
                  </div>
                )}

                {/* Optional Visual Design Artifact Block (Banner / Graphics / Poster) */}
                {msg.designArtifact && (
                  <DesignArtifactCard artifact={msg.designArtifact} theme={theme} />
                )}

                {/* HITL Pending Approval Action Banner if message required approval */}
                {msg.hitlApprovalId && (
                  <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-amber-400">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>Thao tác này đang chờ Chủ nhân phê duyệt (HITL)</span>
                    </div>
                    {identity.isMaster && (
                      <button
                        onClick={() => onOpenApproval(msg.hitlApprovalId!)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors shrink-0 cursor-pointer"
                      >
                        Xem xét ngay
                      </button>
                    )}
                  </div>
                )}

                {/* Interactive Action Buttons if provided by AI */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                    {msg.actions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => onExecuteAction(act)}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
                          theme === 'light'
                            ? 'bg-white hover:bg-slate-100 border-slate-300 text-cyan-700'
                            : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-cyan-300 hover:border-cyan-500/50'
                        }`}
                      >
                        <Play className="w-2.5 h-2.5 text-cyan-400" />
                        <span>{act}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Individual Chat Bubble Controls (TTS Toggle & Copy) */}
                {isAssistant && (
                  <div className="mt-2.5 pt-2 border-t border-slate-700/40 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      {/* TTS Toggle Button for this specific AI message */}
                      <button
                        type="button"
                        onClick={() => handleToggleMessageTTS(msg)}
                        title={
                          isPlayingThis
                            ? 'Dừng đọc tin nhắn này'
                            : 'Đọc lại phản hồi này bằng giọng nói (TTS) mà không ảnh hưởng luồng hội thoại'
                        }
                        aria-label={
                          isPlayingThis
                            ? 'Dừng đọc câu trả lời này'
                            : 'Phát lại câu trả lời này qua giọng nói'
                        }
                        className={`px-2 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                          isPlayingThis
                            ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/60 shadow-sm shadow-cyan-500/30 font-semibold'
                            : theme === 'light'
                            ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-cyan-400'
                            : theme === 'deepspace'
                            ? 'bg-[#101522] hover:bg-[#181f33] text-neutral-300 border border-neutral-700/80 hover:text-cyan-300'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40'
                        }`}
                      >
                        {isPlayingThis ? (
                          <>
                            <Square className="w-3 h-3 text-cyan-300 fill-cyan-400" />
                            <span className="text-[11px]">Dừng đọc</span>
                            {/* Animated Equalizer Waveform */}
                            <span className="flex items-end gap-0.5 h-3 ml-0.5">
                              <span className="w-0.5 bg-cyan-400 rounded animate-[pulse_0.6s_ease-in-out_infinite] h-2" />
                              <span className="w-0.5 bg-cyan-400 rounded animate-[pulse_0.4s_ease-in-out_infinite] h-3" />
                              <span className="w-0.5 bg-cyan-400 rounded animate-[pulse_0.7s_ease-in-out_infinite] h-1.5" />
                            </span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="text-[11px]">Đọc TTS</span>
                          </>
                        )}
                      </button>

                      {/* Copy message text */}
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.text, msg.id)}
                        title="Sao chép nội dung tin nhắn"
                        className={`p-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                          theme === 'light'
                            ? 'text-slate-400 hover:text-slate-700'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>

                    <span
                      className={`text-[10px] font-mono ${
                        theme === 'light' ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {isPlayingThis ? '🔊 Đang đọc phản hồi...' : 'TTS Sẵn sàng'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}

        {/* Real-time AI Typing Animation Indicator Bubble */}
        {isAiTyping && (
          <div className="flex flex-col items-start max-w-full animate-in fade-in duration-200">
            <div className="flex items-center gap-1.5 mb-1 px-1">
              <span className="text-[10px] text-cyan-400 font-semibold flex items-center gap-1">
                <Bot className="w-3 h-3 text-cyan-400" />
                Hoppi v4.0
              </span>
              <span className="text-[10px] text-slate-500">Đang suy nghĩ...</span>
            </div>
            <div
              className={`px-4 py-3 rounded-2xl rounded-tl-none border flex items-center gap-3 shadow-md ${
                theme === 'light'
                  ? 'bg-slate-100 border-cyan-300 text-slate-800'
                  : theme === 'deepspace'
                  ? 'bg-[#0b101c] border-indigo-900/50 text-indigo-200'
                  : 'bg-slate-950/90 border-cyan-500/40 text-cyan-300'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
              </div>
              <span className="text-xs font-medium tracking-wide">
                Hoppi đang phân tích tri thức & tạo phản hồi...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Command Prompts */}
      <div
        className={`px-4 py-2 border-t overflow-x-auto flex items-center gap-2 no-scrollbar shrink-0 ${
          theme === 'cyberpunk'
            ? 'bg-slate-950/40 border-slate-800/60'
            : theme === 'deepspace'
            ? 'bg-[#06080e] border-neutral-800'
            : 'bg-slate-100/70 border-slate-200'
        }`}
      >
        <span
          className={`text-[10px] font-mono uppercase tracking-wider shrink-0 flex items-center gap-1 ${
            theme === 'light' ? 'text-slate-500' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-3 h-3 text-cyan-400" />
          Gợi ý:
        </span>
        {quickPrompts.map((q, i) => (
          <button
            key={i}
            onClick={() => {
              if (q.includes('Thử hiệu ứng Hoppi thông báo')) {
                handleTestCompletionNotice();
              } else if (q.includes('tác vụ tự trị đa bước')) {
                handleStartAutonomousTask('Kiểm tra & Vận hành Quy trình Tự trị Đa tác nhân');
                onSendMessage('Hoppi, hãy thực thi chuỗi tác vụ tự trị đa bước để kiểm tra toàn bộ hệ thống.');
              } else if (q.includes('Home Server')) {
                setTargetDeviceId('dev-server-home');
                handleStartAutonomousTask('Sao lưu RAG Vector DB', 'Home Server 24/7 (Mini PC)');
                onSendMessage('[🎯 Lệnh tới Home Server 24/7 (Mini PC)]: Hoppi, tiến hành sao lưu toàn bộ RAG Vector DB và đồng bộ mesh.');
              } else if (q.includes('MacBook')) {
                setTargetDeviceId('dev-macbook-master');
                handleStartAutonomousTask('Kiểm định bảo mật Code Agent', 'MacBook Pro M3 Max');
                onSendMessage('[🎯 Lệnh tới MacBook Pro M3 Max]: Hoppi, thực thi rà soát bảo mật static code analysis.');
              } else if (q.includes('iPad')) {
                setTargetDeviceId('dev-ipad-living');
                handleStartAutonomousTask('Bật camera an ninh & quét LAN', 'iPad Pro M2 (Phòng khách)');
                onSendMessage('[🎯 Lệnh tới iPad Pro M2 (Phòng khách)]: Hoppi, kích hoạt camera quan sát an ninh.');
              } else if (q.includes('iPhone')) {
                setTargetDeviceId('dev-iphone-master');
                handleStartAutonomousTask('Quét tự động khách hàng Zalo OA', 'iPhone 16 Pro Max');
                onSendMessage('[🎯 Lệnh tới iPhone 16 Pro Max]: Hoppi, quét và tóm tắt hội thoại Zalo OA chưa phản hồi.');
              } else {
                onSendMessage(q);
              }
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap transition-colors cursor-pointer border ${
              q.includes('Thử hiệu ứng Hoppi thông báo')
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold shadow-sm shadow-amber-500/20 animate-pulse'
                : q.includes('tác vụ tự trị đa bước')
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-semibold shadow-sm shadow-cyan-500/20'
                : theme === 'light'
                ? 'bg-white hover:bg-slate-50 text-slate-700 hover:text-cyan-600 border-slate-200'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300'
            }`}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Master Root Target Device Dispatcher Strip */}
      {identity.isMaster && (
        <div
          className={`px-3 py-1.5 border-t flex flex-wrap items-center justify-between gap-1.5 text-xs transition-colors shrink-0 ${
            theme === 'cyberpunk'
              ? 'bg-slate-950/80 border-cyan-900/40 text-slate-300'
              : theme === 'deepspace'
              ? 'bg-[#080c16] border-indigo-950/50 text-slate-300'
              : 'bg-cyan-50/70 border-cyan-200 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="flex items-center gap-1 font-bold text-[11px] text-cyan-400">
              <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
              👑 Đích nhận lệnh:
            </span>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {targetDeviceOptions.map((dev) => {
              const isSelected = targetDeviceId === dev.id;
              return (
                <button
                  key={dev.id}
                  type="button"
                  onClick={() => setTargetDeviceId(dev.id)}
                  className={`px-2 py-0.5 rounded-lg text-[10.5px] font-medium transition-all cursor-pointer whitespace-nowrap border flex items-center gap-1 ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-sm shadow-cyan-500/30 scale-102'
                      : theme === 'light'
                      ? 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100 hover:text-cyan-700'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-cyan-300'
                  }`}
                  title={`Giao việc độc lập cho: ${dev.name}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-slate-950' : 'bg-emerald-400'}`} />
                  {dev.name}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleTestCompletionNotice}
            className="text-[10px] text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer ml-auto"
            title="Thử nghiệm hiển thị Hoppi chúc mừng hoàn thành công việc kèm giọng nói"
          >
            <span>🔔 Thử âm báo hoàn thành</span>
          </button>
        </div>
      )}

      {/* Attached Files Preview Bar */}
      {attachments.length > 0 && (
        <div className="px-3.5 py-2 border-t border-slate-800 bg-slate-950/95 flex items-center gap-2 overflow-x-auto scrollbar-thin shrink-0">
          <span className="text-[10px] font-mono text-cyan-400 shrink-0 font-bold flex items-center gap-1">
            <Paperclip className="w-3 h-3" />
            Đính kèm ({attachments.length}):
          </span>
          {attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-cyan-500/40 text-xs text-slate-200 shrink-0 shadow-sm"
            >
              {att.type === 'image' && <ImageIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
              {att.type === 'video' && <FileVideo className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
              {att.type === 'file' && <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
              <span className="max-w-[120px] truncate text-[11px] font-medium" title={att.name}>
                {att.name}
              </span>
              <span className="text-[10px] font-mono text-slate-400">({att.sizeFormatted})</span>
              <button
                type="button"
                onClick={() => handleRemoveAttachment(att.id)}
                className="p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer ml-0.5"
                title="Gỡ tệp"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Voice Listening Active Banner */}
      {isListening && (
        <div className="px-4 py-2 bg-rose-500/20 border-t border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-between gap-2 shrink-0 animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span>🔴 Đang nhận diện giọng nói của Chủ nhân Nguyễn Thanh Hải (vi-VN)... Hãy nói lệnh của bạn!</span>
          </div>
          <button
            type="button"
            onClick={onToggleListen}
            className="px-2 py-0.5 rounded-md bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold cursor-pointer"
          >
            Dừng lại
          </button>
        </div>
      )}

      {/* 29 Prompt Skills Quick Action Badges from Master's request */}
      <div className="px-3 py-1.5 border-t border-slate-800/80 bg-slate-950/70 overflow-x-auto flex items-center gap-1.5 no-scrollbar shrink-0 text-xs">
        <span className="text-[10px] text-amber-400 font-mono font-bold shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Kỹ Năng:
        </span>
        {[
          { label: '🧹 Dọn dẹp máy tính', prompt: '[Dọn dẹp và tăng tốc máy tính] Máy tính của tôi ngày càng chậm. Hãy tìm các vấn đề liên quan đến dung lượng lưu trữ và chương trình khởi động cùng máy, sau đó đề xuất cho tôi kế hoạch dọn dẹp trước.' },
          { label: '📊 Tạo Sheets', prompt: '[Tạo Sheets] Sắp đến đợt đánh giá doanh số hằng quý. Hãy sắp xếp dữ liệu này và trình bày các xu hướng chính trong bảng tính kèm biểu đồ.' },
          { label: '📑 Tạo tài liệu', prompt: '[Tạo tài liệu] Chúng tôi vừa hoàn tất cuộc họp khởi động dự án. Hãy biến những ghi chú cuộc họp này thành bản đề xuất chỉn chu, có thể chia sẻ ngay.' },
          { label: '🎯 Tạo 10 Slide', prompt: '[Tạo trang chiếu] Tôi đang giới thiệu một công cụ tạo bản thuyết trình bằng AI nhằm thuyết phục các nhà đầu tư. Hãy tạo bộ tài liệu 10 trang chiếu rõ ràng và thuyết phục.' },
          { label: '📦 Tạo PDF trọn gói', prompt: '[Tạo PDF] Khách hàng cần một bộ tài liệu trọn gói. Hãy kết hợp bản tóm lược dự án, báo giá và hợp đồng thành một tập tin PDF chỉn chu.' },
          { label: '🎨 Seedream 5.0 Ảnh', prompt: '[Tạo biến thể quảng cáo] Dùng Seedream 5.0 Pro thiết kế 3 biến thể hình ảnh quảng cáo bình nước thông minh cho từng nhóm đối tượng học sinh, dân văn phòng và gymer.' },
          { label: '🎬 Seedance 2.0 Video', prompt: '[Tạo video bán hàng UGC] Kem chống nắng này có kết cấu mỏng nhẹ và không gây bít tắc lỗ chân lông. Hãy tạo video bán hàng theo phong cách UGC chân thực.' },
          { label: '🚗 Chi phí học lái xe', prompt: 'chi phí học lái xe ô tô hiện tại là bao nhiêu' },
          { label: '📅 Hôm nay ngày bao nhiêu', prompt: 'hôm nay là ngày bao nhiêu' },
        ].map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              onSendMessage(item.prompt, attachments);
              setAttachments([]);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition cursor-pointer flex items-center gap-1 shrink-0 shadow-sm"
          >
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Chat Input & Voice Trigger Bar */}
      <form
        onSubmit={handleSubmit}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDraggingOver(true);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDraggingOver(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files);
          }
        }}
        className={`p-3.5 border-t-2 shrink-0 flex items-center gap-2.5 transition-colors shadow-2xl ${
          theme === 'cyberpunk'
            ? 'bg-slate-950/95 border-cyan-500/60 shadow-cyan-950/50'
            : theme === 'deepspace'
            ? 'bg-[#06080e] border-indigo-500/60 shadow-indigo-950/50'
            : 'bg-white border-cyan-400 shadow-slate-200'
        }`}
      >
        {/* Hidden File Input for Picking Files, Images, Videos */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          accept="*/*"
        />

        {/* Paperclip / File Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Đính kèm file, ảnh hoặc video (hoặc kéo thả trực tiếp vào khung chat)"
          className={`p-3 rounded-xl border-2 transition-all cursor-pointer shrink-0 ${
            attachments.length > 0
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-md shadow-cyan-500/20'
              : theme === 'light'
              ? 'bg-slate-50 text-slate-600 border-slate-300 hover:text-cyan-600 hover:border-cyan-500'
              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-cyan-300 hover:border-cyan-400'
          }`}
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {/* Voice Dictation Button */}
        <button
          type="button"
          onClick={onToggleListen}
          title={isListening ? 'Đang nghe...' : 'Kích hoạt giọng nói (Nói "Hey Hoppi")'}
          className={`p-3 rounded-xl border-2 transition-all cursor-pointer shrink-0 ${
            isListening
              ? 'bg-red-500 text-white border-red-300 shadow-lg shadow-red-500/50 animate-pulse'
              : theme === 'light'
              ? 'bg-slate-50 text-slate-700 border-slate-300 hover:text-cyan-600 hover:border-cyan-500'
              : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-cyan-300 hover:border-cyan-400'
          }`}
        >
          {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            identity.isMaster
              ? targetDeviceId === 'all'
                ? '👑 Lệnh Chủ nhân (Phát tới toàn bộ Mesh): VD: Sao lưu vector, quét bảo mật...'
                : `👑 Lệnh Chủ nhân riêng cho ${targetDeviceOptions.find(d => d.id === targetDeviceId)?.name || 'thiết bị'}: ...`
              : 'Gửi tin nhắn hoặc câu hỏi cho Hoppi...'
          }
          className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium focus:outline-none transition-all ${
            theme === 'light'
              ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/20'
              : 'bg-slate-900/95 border-cyan-500/50 text-slate-100 placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/25'
          }`}
        />

        <button
          type="submit"
          disabled={!input.trim() && attachments.length === 0}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-lg shadow-cyan-500/30 cursor-pointer shrink-0 active:scale-98"
        >
          <span>Gửi</span>
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* 1. Context-Aware Right-Click Menu */}
      {contextMenu.isOpen && (
        <div
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          className="fixed z-50 w-72 rounded-2xl bg-slate-900/95 border border-cyan-500/40 backdrop-blur-xl shadow-2xl shadow-cyan-950/80 p-2 text-xs font-sans text-slate-200 animate-in fade-in zoom-in-95 duration-150 select-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Preview */}
          <div className="px-2.5 py-1.5 mb-1.5 border-b border-slate-800">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span className="text-cyan-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                MENU NGỮ CẢNH CHAT
              </span>
              <span>{contextMenu.selectedSnippet.length} ký tự</span>
            </div>
            <div
              className="text-[11px] text-slate-300 truncate font-medium mt-0.5"
              title={contextMenu.selectedSnippet}
            >
              "{contextMenu.selectedSnippet.slice(0, 42)}..."
            </div>
            <div className="text-[9px] text-slate-500 font-mono mt-0.5">
              Nguồn: {contextMenu.sourceLabel}
            </div>
          </div>

          {/* Action List */}
          <div className="space-y-1">
            {/* Action 1: Save to RAG Memory */}
            <button
              type="button"
              onClick={handleSaveToRagMemory}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-cyan-950/60 hover:text-cyan-300 text-slate-200 transition-colors group cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Database className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-100 group-hover:text-cyan-300">
                  Lưu vào Bộ nhớ RAG (Vector DB)
                </div>
                <div className="text-[10px] text-slate-400">
                  Nhúng vector để Hoppi ghi nhớ vĩnh viễn
                </div>
              </div>
            </button>

            {/* Action 2: Copy as Clean Text */}
            <button
              type="button"
              onClick={handleCopyAsCleanText}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-cyan-950/60 hover:text-cyan-300 text-slate-200 transition-colors group cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-100 group-hover:text-cyan-300">
                  Sao chép Văn bản Sạch (Clean Text)
                </div>
                <div className="text-[10px] text-slate-400">
                  Loại bỏ markdown, định dạng thừa
                </div>
              </div>
            </button>

            {/* Action 3: Summarize */}
            <button
              type="button"
              onClick={handleSummarizeSnippet}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-cyan-950/60 hover:text-cyan-300 text-slate-200 transition-colors group cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-100 group-hover:text-cyan-300">
                  Tóm tắt Ý chính (AI Summarize)
                </div>
                <div className="text-[10px] text-slate-400">
                  Trích xuất 2-3 gạch đầu dòng cốt lõi
                </div>
              </div>
            </button>
          </div>

          {/* Quick Tip Footer */}
          <div className="mt-1 pt-1.5 border-t border-slate-800 px-2 text-[9px] text-slate-500 font-mono flex items-center justify-between">
            <span>Bôi đen hoặc chuột phải tin nhắn</span>
            <span className="text-slate-400">Esc để đóng</span>
          </div>
        </div>
      )}

      {/* 2. AI Summarize Modal */}
      {summaryModal && summaryModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#090d16] border border-cyan-500/50 shadow-2xl p-5 text-slate-100 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">TÓM TẮT ĐOẠN TRÍCH CHAT</h4>
                  <span className="text-[10px] font-mono text-cyan-400">Hoppi AI Engine v4.0</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSummaryModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Original Snippet */}
            <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 text-xs">
              <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">
                Đoạn Trích Gốc:
              </div>
              <div className="text-slate-300 max-h-24 overflow-y-auto custom-scrollbar font-mono text-[11px] whitespace-pre-wrap leading-relaxed">
                {summaryModal.originalSnippet}
              </div>
            </div>

            {/* AI Summary Result */}
            <div className="bg-gradient-to-r from-purple-950/30 via-slate-900 to-cyan-950/30 rounded-xl p-4 border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Kết Quả Tóm Lược Súc Tích:
                </span>
                {summaryModal.isLoading && (
                  <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                )}
              </div>

              <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed font-medium">
                {summaryModal.summary}
              </div>

              {summaryModal.keyTakeaway && (
                <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-cyan-300 font-medium">
                  <span className="text-slate-400 font-semibold">Điểm mấu chốt: </span>
                  {summaryModal.keyTakeaway}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(summaryModal.summary);
                  showToast('✓ Đã sao chép nội dung tóm tắt!', 'copy');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                Sao chép
              </button>

              <button
                type="button"
                onClick={() => {
                  // Save summary to RAG
                  const summaryItem = {
                    id: `mem-sum-${Date.now()}`,
                    title: `[Tóm tắt Chat] ${summaryModal.keyTakeaway.slice(0, 40)}`,
                    source: 'AI Chat Summarizer',
                    contentSnippet: `${summaryModal.summary}\n\n(Nguồn gốc: ${summaryModal.originalSnippet.slice(0, 150)}...)`,
                    tags: ['AI Summary', 'Chat Takeaways', 'RAG'],
                    vectorDim: 1536,
                    syncedAt:
                      new Date().toLocaleDateString('vi-VN') +
                      ' ' +
                      new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                    syncedSizeKB: 2,
                  };
                  try {
                    const stored = localStorage.getItem('hoppi_rag_memory_items');
                    const existing = stored ? JSON.parse(stored) : [];
                    localStorage.setItem('hoppi_rag_memory_items', JSON.stringify([summaryItem, ...existing]));
                    window.dispatchEvent(
                      new CustomEvent('hoppi_rag_memory_updated', { detail: summaryItem })
                    );
                  } catch (e) {
                    console.error(e);
                  }
                  showToast('✓ Đã lưu bản tóm tắt vào Bộ nhớ RAG!', 'rag');
                  setSummaryModal(null);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
              >
                <Database className="w-3.5 h-3.5" />
                Lưu Tóm Tắt vào RAG
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Action Feedback Toast */}
      {actionToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-slate-900/95 border border-cyan-400 text-cyan-300 shadow-2xl backdrop-blur-md text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionToast.message}</span>
        </div>
      )}
    </div>
  );
};
