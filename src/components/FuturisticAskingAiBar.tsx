import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  Mic,
  MicOff,
  Send,
  Zap,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  Volume2,
  Table,
  Presentation,
  FileText,
  Code2,
  GitBranch,
  ShieldCheck,
  Cpu,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AppTheme, DesignArtifact } from '../types';

interface BranchResponseCard {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  summary: string;
  content: string;
  isBest?: boolean;
  artifactPreview?: {
    type: 'spreadsheet' | 'presentation' | 'document' | 'code';
    title: string;
    metrics: string;
  };
}

interface FuturisticAskingAiBarProps {
  onSendMessage: (query: string) => void;
  onSpeakText?: (text: string) => void;
  isListening?: boolean;
  onToggleListen?: () => void;
  theme?: AppTheme;
  latestArtifact?: DesignArtifact;
  isAiTyping?: boolean;
}

export const FuturisticAskingAiBar: React.FC<FuturisticAskingAiBarProps> = ({
  onSendMessage,
  onSpeakText,
  isListening = false,
  onToggleListen,
  theme = 'cyberpunk',
  latestArtifact,
  isAiTyping = false,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [activeBranch, setActiveBranch] = useState<'reasoning' | 'best' | 'artifact'>('best');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isTreeExpanded, setIsTreeExpanded] = useState(true);

  // Pre-configured dynamic response cards representing the 3-branching AI tree
  const sampleBranches: BranchResponseCard[] = [
    {
      id: 'branch-1',
      badge: 'CHIẾN LƯỢC SUY LUẬN',
      badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
      title: 'Phân rã ý định & Truy vấn RAG Vector',
      summary: 'Khớp 1,420 vector tri thức + Kích hoạt quy trình 18 phòng ban',
      content:
        'Hệ thống đã nhận lệnh từ Chủ nhân Nguyễn Thanh Hải. Khối Intent Router phân loại tác vụ thành High-Priority. Smart Vector Cache tự động boost trọng số 1.8x, giảm 42% tokens và kích hoạt Actuator song song.',
    },
    {
      id: 'branch-2',
      badge: '★ BEST RESPONSE',
      badgeColor: 'text-cyan-300 border-cyan-400/80 bg-cyan-500/20 shadow-cyan-500/30',
      title: 'Giải Pháp Tối Ưu • Thực Thi Tự Động 24/7',
      summary: 'Khuyến nghị bởi Hoppi v4.0 Autonomous Engine',
      content:
        'Đã điều phối 8 phòng ban AI Agent thực thi đồng bộ: Kiểm soát an ninh FaceID, chuẩn bị báo cáo tài chính Sales CRM Zalo OA, đồng bộ dữ liệu vào Local FAISS, và thiết lập kịch bản tự động hóa trên máy chủ Home Server.',
      isBest: true,
      artifactPreview: {
        type: 'code',
        title: 'hoppi_autonomous_runner.ts',
        metrics: '142 lines • 0.95ms latency',
      },
    },
    {
      id: 'branch-3',
      badge: 'ARTIFACT SẢN PHẨM',
      badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
      title: 'Bảng Kê & Tài Liệu Xuất Bản Sẵn Sàng',
      summary: 'Tệp định dạng Office .xlsx / .pptx / .docx đã render',
      content:
        'Toàn bộ kết quả đầu ra đã được đóng gói thành báo cáo cấu trúc chuẩn doanh nghiệp. Chủ nhân có thể tải trực tiếp hoặc gửi qua Zalo OA với 1 cú nhấp.',
      artifactPreview: {
        type: 'spreadsheet',
        title: 'Bao_Cao_Nang_Suat_Q4_2026.xlsx',
        metrics: '5 bảng tính • Đầy đủ công thức KPI',
      },
    },
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSendMessage(query);
    setQuery('');
  };

  const handlePresetClick = (preset: string) => {
    onSendMessage(preset);
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Top Futuristic Search & Asking AI Bar */}
      <div className="relative group">
        {/* Ambient neon backglow */}
        <div
          className={`absolute -inset-1 rounded-2xl opacity-60 blur-xl transition-all duration-500 pointer-events-none ${
            isFocused
              ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-amber-500 opacity-80'
              : 'bg-gradient-to-r from-cyan-500/30 via-slate-800 to-amber-500/20'
          }`}
        />

        <form
          onSubmit={handleSubmit}
          className="relative flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-950/90 backdrop-blur-2xl border border-cyan-500/40 shadow-2xl transition-all duration-300 focus-within:border-cyan-400"
        >
          {/* Concentric Rotating Radar Scanner Icon (from Video 3) */}
          <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
            {/* Outer radar ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-dashed border-cyan-400/60"
            />
            {/* Middle radar ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              className="absolute inset-1 rounded-full border border-cyan-500/40"
            />
            {/* Radar scanner ping sweep */}
            <motion.div
              animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.4, 0.9, 0.4] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="absolute w-4 h-4 rounded-full bg-cyan-400/20"
            />
            {/* Center target dot */}
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
          </div>

          {/* AI AGENT Badge Tag */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-[10px] font-mono font-extrabold text-cyan-300 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>AI AGENT</span>
          </div>

          {/* Prompt Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Asking AI Agent... (Nhập câu hỏi, chỉ thị lập trình, hoặc kích hoạt DAG)"
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none font-medium"
          />

          {/* Voice Input Toggle Button */}
          {onToggleListen && (
            <button
              type="button"
              onClick={onToggleListen}
              className={`p-2 rounded-xl transition cursor-pointer flex items-center justify-center ${
                isListening
                  ? 'bg-red-500/30 text-red-400 border border-red-500 animate-pulse shadow-lg shadow-red-500/40'
                  : 'hover:bg-slate-800 text-slate-400 hover:text-cyan-300'
              }`}
              title={isListening ? 'Dừng lắng nghe' : 'Nói lệnh trực tiếp qua micro'}
            >
              {isListening ? <Mic className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4" />}
            </button>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={!query.trim() || isAiTyping}
            className={`px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg ${
              query.trim() && !isAiTyping
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/30 scale-102'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Gửi</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Quick Action Presets Pill Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-slate-400 scrollbar-none">
        <span className="font-mono text-[10px] text-cyan-400 shrink-0 uppercase tracking-wider flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" />
          Lối tắt:
        </span>
        {[
          'Kế hoạch dọn dẹp & tăng tốc OS',
          'Thiết kế banner Seedream 5.0 Pro',
          'Đồng bộ 24 kho Agent Skills',
          'Kiểm tra 18 phòng ban HQ',
          'Chi phí học lái xe B2 & cabin 3D',
        ].map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handlePresetClick(preset)}
            className="px-2.5 py-1 rounded-lg bg-slate-900/70 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200 transition text-[11px] whitespace-nowrap cursor-pointer"
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Visual Branching 3-Card Result Tree (from Video 3: Tree branching from AI prompt) */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/20 backdrop-blur-xl shadow-2xl space-y-3">
        {/* Tree Header & Toggle */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <span>CÂY PHÂN NHÁNH KẾT QUẢ ĐA TẦNG (3-BRANCH TREE)</span>
                <span className="text-[10px] font-mono text-cyan-400 font-normal">
                  Parallel Agent Tree
                </span>
              </h4>
              <p className="text-[11px] text-slate-400">
                1 Prompt duy nhất sinh ra: Kế hoạch suy luận · Câu trả lời chuẩn nhất · Sản phẩm Office / Code
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsTreeExpanded(!isTreeExpanded)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
          >
            {isTreeExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Branch Cards Container */}
        <AnimatePresence>
          {isTreeExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1"
            >
              {sampleBranches.map((branch) => {
                const isSelected = activeBranch === (branch.isBest ? 'best' : branch.id === 'branch-1' ? 'reasoning' : 'artifact');

                return (
                  <motion.div
                    key={branch.id}
                    whileHover={{ scale: 1.015, y: -2 }}
                    onClick={() =>
                      setActiveBranch(
                        branch.isBest ? 'best' : branch.id === 'branch-1' ? 'reasoning' : 'artifact'
                      )
                    }
                    className={`relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      branch.isBest
                        ? 'bg-gradient-to-b from-cyan-950/40 via-slate-900/90 to-slate-950 border-cyan-400/70 shadow-lg shadow-cyan-500/15 ring-1 ring-cyan-400/30'
                        : isSelected
                        ? 'bg-slate-900/90 border-slate-700 shadow-md'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    {/* Top Branch Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[9.5px] font-mono font-extrabold px-2 py-0.5 rounded-md border ${branch.badgeColor}`}
                      >
                        {branch.badge}
                      </span>

                      {branch.isBest && (
                        <span className="flex items-center gap-1 text-[10px] text-amber-300 font-bold font-mono">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          Recommended
                        </span>
                      )}
                    </div>

                    {/* Card Title & Summary */}
                    <div>
                      <h5 className="text-xs font-bold text-slate-100 leading-snug">{branch.title}</h5>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{branch.summary}</p>
                      <p className="text-[11px] text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                        {branch.content}
                      </p>
                    </div>

                    {/* Artifact Preview Pill if available */}
                    {branch.artifactPreview && (
                      <div className="mt-3 p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1.5 text-cyan-300 font-medium">
                          {branch.artifactPreview.type === 'spreadsheet' ? (
                            <Table className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                          )}
                          <span className="truncate max-w-[140px] font-mono">
                            {branch.artifactPreview.title}
                          </span>
                        </div>
                        <span className="text-slate-400 font-mono text-[9px]">
                          {branch.artifactPreview.metrics}
                        </span>
                      </div>
                    )}

                    {/* Bottom Action Row */}
                    <div className="mt-3 pt-2 border-t border-slate-850 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1 text-slate-400">
                        {onSpeakText && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSpeakText(branch.content);
                            }}
                            className="p-1 hover:text-cyan-300 transition cursor-pointer"
                            title="Nghe đọc nội dung này"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(branch.id, branch.content);
                          }}
                          className="p-1 hover:text-cyan-300 transition cursor-pointer"
                          title="Sao chép nội dung"
                        >
                          {copiedId === branch.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSendMessage(branch.title);
                        }}
                        className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Áp dụng nhánh này</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
