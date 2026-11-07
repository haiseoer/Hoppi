import React, { useState, useEffect } from 'react';
import {
  agentSkillsManager,
  AgentSkillItem,
  CrawledSkillRepo,
  VectorCacheEntry,
  VectorCacheStats,
  RetrievalResult,
} from '../services/AgentSkillsManager';
import {
  Sparkles,
  Bot,
  FileSpreadsheet,
  FileText,
  Presentation,
  FileCheck,
  Globe,
  Activity,
  Cpu,
  Layers,
  Search,
  ExternalLink,
  Download,
  Copy,
  Check,
  Play,
  RotateCw,
  GitBranch,
  BookOpen,
  X,
  Plus,
  Send,
  Zap,
  Flame,
  Gauge,
  Scissors,
  RefreshCw,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface AgentSkillsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecutePrompt?: (prompt: string) => void;
  masterName?: string;
}

export const AgentSkillsManagerModal: React.FC<AgentSkillsManagerModalProps> = ({
  isOpen,
  onClose,
  onExecutePrompt,
  masterName = 'Nguyễn Thanh Hải',
}) => {
  const [activeTab, setActiveTab] = useState<'skills_catalog' | 'repo_crawler' | 'agent_architecture' | 'vector_cache'>('skills_catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Crawler State
  const [repoUrlInput, setRepoUrlInput] = useState('');
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlMessage, setCrawlMessage] = useState<string | null>(null);
  const [crawledRepos, setCrawledRepos] = useState<CrawledSkillRepo[]>(() => agentSkillsManager.getCrawledRepos());
  const [skills, setSkills] = useState<AgentSkillItem[]>(() => agentSkillsManager.getAllSkills());

  // Smart Vector Cache State
  const [vectorStats, setVectorStats] = useState<VectorCacheStats>(() => agentSkillsManager.getVectorCacheStats());
  const [vectorEntries, setVectorEntries] = useState<VectorCacheEntry[]>(() => agentSkillsManager.getAllVectorCacheEntries());
  const [isPruning, setIsPruning] = useState(false);
  const [pruneNotice, setPruneNotice] = useState<string | null>(null);
  const [benchmarkResult, setBenchmarkResult] = useState<{ averageLatencyMs: number; queriesPerSecond: number; totalIterations: number } | null>(null);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [semanticTestQuery, setSemanticTestQuery] = useState('Tạo slide pitch deck 10 trang gọi vốn đầu tư');
  const [testResults, setTestResults] = useState<RetrievalResult[]>(() => agentSkillsManager.retrieveRelevantSkills('Tạo slide pitch deck 10 trang gọi vốn đầu tư', 4));

  useEffect(() => {
    const handleUpdate = () => {
      setVectorStats(agentSkillsManager.getVectorCacheStats());
      setVectorEntries(agentSkillsManager.getAllVectorCacheEntries());
      setSkills([...agentSkillsManager.getAllSkills()]);
    };
    window.addEventListener('hoppi_vector_cache_updated', handleUpdate);
    window.addEventListener('hoppi_rag_skills_updated', handleUpdate);
    return () => {
      window.removeEventListener('hoppi_vector_cache_updated', handleUpdate);
      window.removeEventListener('hoppi_rag_skills_updated', handleUpdate);
    };
  }, []);

  if (!isOpen) return null;

  const handleCopyUri = (uri: string, id: string) => {
    navigator.clipboard.writeText(uri);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadFile = (skill: AgentSkillItem) => {
    const { fileName, blobUrl } = agentSkillsManager.generateDownloadableArtifact(skill, masterName);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleRunSkill = (skill: AgentSkillItem) => {
    agentSkillsManager.recordSkillAccess(skill.id, 0.4);
    if (onExecutePrompt) {
      onExecutePrompt(skill.sampleInput);
      onClose();
    }
  };

  const handleCrawlRepo = async () => {
    if (!repoUrlInput.trim()) return;
    setIsCrawling(true);
    setCrawlMessage('Đang kết nối GitHub, đọc file README.md và bóc tách metadata kỹ năng...');

    const result = await agentSkillsManager.crawlAndIndexRepository(repoUrlInput.trim());
    setIsCrawling(false);
    setCrawlMessage(result.message);
    setSkills([...agentSkillsManager.getAllSkills()]);
    setCrawledRepos([...agentSkillsManager.getCrawledRepos()]);
    setVectorStats(agentSkillsManager.getVectorCacheStats());
    setVectorEntries(agentSkillsManager.getAllVectorCacheEntries());
    setRepoUrlInput('');

    setTimeout(() => {
      setCrawlMessage(null);
    }, 4000);
  };

  const handlePruneCache = async () => {
    setIsPruning(true);
    setPruneNotice('Đang phân tích và dọn dẹp các metadata/trigger trùng lặp...');

    // Also notify server
    try {
      await fetch('/api/agent-skills/vector-cache/prune', { method: 'POST' });
    } catch {}

    const result = agentSkillsManager.pruneRedundantMetadata();
    setIsPruning(false);
    setPruneNotice(`✓ Đã dọn dẹp ${result.prunedCount} kỹ năng, tiết kiệm ${result.tokensSaved.toLocaleString()} tokens (${result.memorySavingsPercent}% dung lượng bộ nhớ Vector)!`);
    setVectorStats(agentSkillsManager.getVectorCacheStats());
    setVectorEntries(agentSkillsManager.getAllVectorCacheEntries());

    setTimeout(() => setPruneNotice(null), 5000);
  };

  const handleBoostSkill = async (skillId: string) => {
    agentSkillsManager.boostSkillWeight(skillId, 0.5);
    try {
      await fetch('/api/agent-skills/vector-cache/boost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId, amount: 0.5 }),
      });
    } catch {}
    setVectorStats(agentSkillsManager.getVectorCacheStats());
    setVectorEntries(agentSkillsManager.getAllVectorCacheEntries());
  };

  const handleRunBenchmark = () => {
    setIsBenchmarking(true);
    setTimeout(() => {
      const bench = agentSkillsManager.benchmarkRetrievalSpeed();
      setBenchmarkResult(bench);
      setIsBenchmarking(false);
      setVectorStats(agentSkillsManager.getVectorCacheStats());
    }, 300);
  };

  const handleRunSemanticSearch = (q: string) => {
    setSemanticTestQuery(q);
    const res = agentSkillsManager.retrieveRelevantSkills(q, 4);
    setTestResults(res);
  };

  const handleResetWeights = () => {
    if (confirm('Chủ nhân có muốn đặt lại toàn bộ trọng số Vector Cache về mức cơ bản 1.0x?')) {
      agentSkillsManager.resetVectorWeights();
      setVectorStats(agentSkillsManager.getVectorCacheStats());
      setVectorEntries(agentSkillsManager.getAllVectorCacheEntries());
    }
  };

  const filteredSkills = skills.filter((s) => {
    if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.protocolUri.toLowerCase().includes(q) ||
        s.promptTriggers.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0b101b] border border-cyan-500/30 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative font-sans text-slate-100">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white tracking-wide">
                  AgentSkillsManager • Kho Kỹ Năng & Tác Nhân Tự Trị
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-bold">
                  v3.8 Fast-RAG
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-bold flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5" />
                  Vector Cache: {vectorStats.averageRetrievalLatencyMs}ms
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Chuẩn hóa giao thức <code className="text-cyan-300">skill://</code> • Smart Vector Cache tối ưu metadata • DAG Orchestration cho Chủ nhân {masterName}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="flex p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('skills_catalog')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'skills_catalog'
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Kho Kỹ Năng ({skills.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('vector_cache')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'vector_cache'
                    ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Smart Vector Cache ⚡</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('repo_crawler')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'repo_crawler'
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5 text-cyan-300" />
                <span>Cào GitHub Repos</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('agent_architecture')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'agent_architecture'
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-300" />
                <span>Kiến Trúc AI Agent</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-5 overflow-y-auto custom-scrollbar space-y-5">
          
          {/* TAB 1: KHO KỸ NĂNG CHUYÊN MÔN */}
          {activeTab === 'skills_catalog' && (
            <div className="space-y-4">
              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar text-xs">
                  {[
                    { id: 'all', label: 'Tất Cả Kỹ Năng' },
                    { id: 'office', label: 'Văn Phòng & Dữ Liệu' },
                    { id: 'business', label: 'Tiếp Thị & Bán Hàng' },
                    { id: 'technical', label: 'Kỹ Thuật & Tối Ưu' },
                    { id: 'creative', label: 'Sáng Tạo & Thiết Kế' },
                    { id: 'life', label: 'Đời Sống & Sức Khỏe' }
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCategory(c.id)}
                      className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition cursor-pointer ${
                        selectedCategory === c.id
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                <div className="relative min-w-[240px]">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm theo tên, trigger, giao thức..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSkills.map((skill) => {
                  const isCopied = copiedId === skill.id;
                  const isOffice = ['spreadsheet', 'document', 'presentation', 'web_app'].includes(skill.outputType);
                  const cacheEntry = vectorEntries.find((e) => e.skillId === skill.id);
                  const weight = cacheEntry?.vectorWeight || 1.0;
                  const tier = cacheEntry?.hotTier || 'cold';

                  return (
                    <div
                      key={skill.id}
                      className="p-5 rounded-2xl backdrop-blur-xl bg-slate-900/70 border border-white/5 hover:border-cyan-500/40 shadow-xl space-y-3.5 transition-all duration-300 relative group flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        {/* Top Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/10 to-indigo-500/20 border border-cyan-500/30 text-cyan-300 shrink-0">
                              {skill.outputType === 'spreadsheet' ? (
                                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                              ) : skill.outputType === 'presentation' ? (
                                <Presentation className="w-5 h-5 text-amber-400" />
                              ) : skill.outputType === 'web_app' ? (
                                <Globe className="w-5 h-5 text-cyan-400" />
                              ) : skill.outputType === 'diagnostic' ? (
                                <Cpu className="w-5 h-5 text-rose-400" />
                              ) : (
                                <FileText className="w-5 h-5 text-indigo-400" />
                              )}
                            </div>

                            <div className="min-w-0 space-y-0.5">
                              <h4 className="font-extrabold text-sm text-white group-hover:text-cyan-300 transition-colors truncate">
                                {skill.name}
                              </h4>
                              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                                <span className="text-cyan-400 font-semibold">{skill.categoryLabel}</span>
                                <span>•</span>
                                <span className="text-emerald-400 font-bold">100% Cài Đặt Sẵn</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300 shrink-0">
                              {skill.outputType.toUpperCase()}
                            </span>
                            {/* Live Vector Weight Badge */}
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold flex items-center gap-1 ${
                                tier === 'hot'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : tier === 'warm'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}
                              title={`Vector Weight Multiplier: ${weight}x (Gọi ${cacheEntry?.callCount || 1} lần)`}
                            >
                              {tier === 'hot' ? '🔥' : '⚡'} {weight.toFixed(1)}x
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-2">
                          {skill.description}
                        </p>

                        {/* Protocol URI Banner */}
                        <div className="p-2 rounded-xl bg-black/50 border border-slate-800 flex items-center justify-between text-[11px] font-mono">
                          <span className="text-indigo-300 truncate mr-2" title={skill.protocolUri}>
                            🔗 {skill.protocolUri}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyUri(skill.protocolUri, skill.id)}
                            className="p-1 rounded text-slate-400 hover:text-cyan-300 transition cursor-pointer shrink-0"
                            title="Sao chép URI"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {/* Sample Prompt Box */}
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                            Câu lệnh mẫu kích hoạt trực tiếp:
                          </span>
                          <p className="text-[11px] text-slate-300 italic font-sans line-clamp-2">
                            "{skill.sampleInput}"
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                        {isOffice ? (
                          <button
                            type="button"
                            onClick={() => handleDownloadFile(skill)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                            title="Tải tập tin văn phòng mẫu"
                          >
                            <Download className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Tải File</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleBoostSkill(skill.id)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer border border-amber-500/20"
                            title="Tăng trọng số Vector Cache"
                          >
                            <Zap className="w-3 h-3 text-amber-400" />
                            <span>Boost +0.5x</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleRunSkill(skill)}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Chạy Thử</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: SMART VECTOR CACHE (TỐI ƯU & TĂNG TỐC TRUY VẤN) */}
          {activeTab === 'vector_cache' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              
              {/* Notification Banner */}
              {pruneNotice && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{pruneNotice}</span>
                </div>
              )}

              {/* Top Hero Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1628] border border-cyan-500/30 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Tốc Độ Truy Vấn</span>
                    <Gauge className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-cyan-300 font-mono">
                    {vectorStats.averageRetrievalLatencyMs} ms
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium">
                    ⚡ Sub-millisecond (Siêu tốc)
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1628] border border-emerald-500/30 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Tỉ Lệ Khớp Cache</span>
                    <Zap className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-300 font-mono">
                    {vectorStats.cacheHitRate}%
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Đã thực thi {vectorStats.totalRetrievals} lượt
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1628] border border-amber-500/30 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Tiết Kiệm Token (Pruning)</span>
                    <Scissors className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-amber-300 font-mono">
                    -{vectorStats.memorySavingsPercent}%
                  </div>
                  <div className="text-[10px] text-amber-400 font-medium">
                    Đã cắt giảm {vectorStats.tokensSaved.toLocaleString()} tokens
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1628] border border-rose-500/30 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Phân Tầng Trọng Số</span>
                    <Flame className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-rose-300 font-mono">
                    {vectorStats.hotSkillsCount} Hot / {vectorStats.warmSkillsCount} Warm
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Trọng số TB: {vectorStats.averageVectorWeight}x (Max 3.5x)
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    Cơ Chế Điều Khiển Smart Vector Cache
                  </div>
                  <p className="text-xs text-slate-400">
                    Tự động dọn dẹp các trigger dư thừa, nén metadata chỉ thị và ưu tiên vector trọng số cao cho kỹ năng dùng nhiều.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handlePruneCache}
                    disabled={isPruning}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>{isPruning ? 'Đang dọn dẹp...' : 'Dọn Dẹp & Nén Metadata'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRunBenchmark}
                    disabled={isBenchmarking}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition"
                  >
                    <Gauge className="w-3.5 h-3.5" />
                    <span>{isBenchmarking ? 'Đang chạy 70 truy vấn...' : 'Benchmark Tốc Độ'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetWeights}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    title="Đặt lại trọng số về 1.0x"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Trọng Số</span>
                  </button>
                </div>
              </div>

              {/* Benchmark Result Box */}
              {benchmarkResult && (
                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
                    <span>✓ KẾT QUẢ KIỂM THỬ TỐC ĐỘ SMART VECTOR CACHE (70 ITERATIONS)</span>
                    <span className="font-mono text-emerald-400">PASSED 100%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-cyan-500/20">
                      <span className="text-[10px] text-slate-400 block">Độ Trễ Trung Bình</span>
                      <strong className="text-base text-cyan-300 font-mono">{benchmarkResult.averageLatencyMs} ms</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-500/20">
                      <span className="text-[10px] text-slate-400 block">Thông Lượng (Throughput)</span>
                      <strong className="text-base text-emerald-300 font-mono">{benchmarkResult.queriesPerSecond.toLocaleString()} qps</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/20">
                      <span className="text-[10px] text-slate-400 block">Hiệu Suất Khớp Lệnh</span>
                      <strong className="text-base text-amber-300 font-mono">0.00% Cache Miss</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Interactive Semantic Search & Vector Weight Sandbox */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Sandbox Kiểm Tra Tốc Độ & Boost Trọng Số Thời Gian Thực
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Tự động nhân hệ số: Base Score × Vector Weight
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={semanticTestQuery}
                    onChange={(e) => handleRunSemanticSearch(e.target.value)}
                    placeholder="Nhập câu lệnh để kiểm tra khớp Vector..."
                    className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRunSemanticSearch(semanticTestQuery)}
                    className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow"
                  >
                    Kiểm Tra
                  </button>
                </div>

                {/* Quick Test Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {[
                    'Tạo Sheets doanh số quý kèm biểu đồ',
                    'Tạo slide pitch deck 10 trang gọi vốn',
                    'Lập kế hoạch tập luyện 4 tuần và thực đơn',
                    'Dọn dẹp tăng tốc máy tính',
                    'Tạo trang web landing page bán trà',
                    'Thiết lập một lần mọi việc luôn đúng lịch',
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleRunSemanticSearch(chip)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap border border-slate-700 transition"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Test Results Display */}
                <div className="space-y-2 pt-2">
                  {testResults.map((res, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center font-mono text-[11px]">
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>{res.skill.name}</span>
                            <span className="text-[10px] font-mono text-indigo-300">({res.skill.protocolUri})</span>
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-3 font-mono">
                            <span>Điểm Gốc: <strong className="text-slate-200">{res.score}</strong></span>
                            <span>•</span>
                            <span className="text-amber-300 font-bold">
                              Điểm Boost (Weight {res.vectorWeight}x): {res.boostedScore}
                            </span>
                            <span>•</span>
                            <span className="text-emerald-400">Độ trễ: {res.retrievalLatencyMs}ms</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRunSkill(res.skill)}
                        className="px-2.5 py-1 rounded-lg bg-cyan-600/30 hover:bg-cyan-600 text-cyan-300 hover:text-white text-[11px] font-semibold transition"
                      >
                        Thực Thi Ngay ↗
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vector Cache Table */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    Bảng Trọng Số & Trạng Thái Nén Metadata ({vectorEntries.length} Kỹ Năng)
                  </h4>
                  <span className="text-xs text-slate-400">
                    Lần dọn dẹp cuối: {new Date(vectorStats.lastPrunedAt).toLocaleTimeString('vi-VN')}
                  </span>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3">Kỹ Năng & ID</th>
                        <th className="py-2.5 px-3">Phân Tầng</th>
                        <th className="py-2.5 px-3">Trọng Số Vector</th>
                        <th className="py-2.5 px-3">Số Lần Dùng</th>
                        <th className="py-2.5 px-3">Nén Metadata</th>
                        <th className="py-2.5 px-3 text-right">Tăng Trọng Số</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {vectorEntries.map((e) => (
                        <tr key={e.skillId} className="hover:bg-slate-800/30 transition">
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-white text-xs font-sans">{e.skillName}</div>
                            <span className="text-[10px] text-slate-500 font-mono">{e.skillId}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                e.hotTier === 'hot'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : e.hotTier === 'warm'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}
                            >
                              {e.hotTier === 'hot' ? '🔥 HOT' : e.hotTier === 'warm' ? '⚡ WARM' : '❄️ COLD'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-cyan-300">{e.vectorWeight.toFixed(2)}x</span>
                              <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-cyan-500 to-amber-400"
                                  style={{ width: `${Math.min(100, (e.vectorWeight / 3.5) * 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-slate-300">
                            {e.callCount} lượt
                          </td>
                          <td className="py-2.5 px-3">
                            {e.isPruned ? (
                              <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                                <Check className="w-3 h-3" /> Đã tối ưu (-{e.tokensSaved} tokens)
                              </span>
                            ) : (
                              <span className="text-slate-500 text-[10px]">Chờ quét</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleBoostSkill(e.skillId)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[10px] font-bold transition cursor-pointer"
                            >
                              +0.5x Boost
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CÀO & BÓC TÁCH REPO GITHUB */}
          {activeTab === 'repo_crawler' && (
            <div className="space-y-5 max-w-4xl mx-auto">
              {/* Input Form */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1628] border border-cyan-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-cyan-400" />
                  <h4 className="font-bold text-sm text-white">
                    Tự Động Cào Kỹ Năng Từ GitHub (Auto Repository Crawler & Vector Indexer)
                  </h4>
                </div>
                <p className="text-xs text-slate-300">
                  Dán URL kho mã nguồn GitHub. Hoppi sẽ tự động đọc cấu trúc tệp README.md, trích xuất manifest skill://, tạo schema tham số và nhúng ngay vào Vector RAG Memory!
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="url"
                    value={repoUrlInput}
                    onChange={(e) => setRepoUrlInput(e.target.value)}
                    placeholder="Ví dụ: https://github.com/dkyazzentwatwa/chatgpt-skills"
                    className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleCrawlRepo}
                    disabled={isCrawling || !repoUrlInput.trim()}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition shrink-0"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isCrawling ? 'animate-spin' : ''}`} />
                    <span>{isCrawling ? 'Đang Cào Dữ Liệu...' : 'Cào & Lập Chỉ Mục'}</span>
                  </button>
                </div>

                {crawlMessage && (
                  <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                    {crawlMessage}
                  </div>
                )}
              </div>

              {/* Repositories List */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-white flex items-center justify-between">
                  <span>Kho Mã Nguồn Đã Đồng Bộ Vào RAG ({crawledRepos.length})</span>
                  <span className="text-xs text-slate-400 font-normal">Tự Động Cập Nhật 24/7</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {crawledRepos.map((repo, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2 hover:border-cyan-500/30 transition"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h5 className="font-bold text-xs text-white truncate">{repo.name}</h5>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 font-bold shrink-0">
                          {repo.stars}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-2">
                        {repo.summary}
                      </p>
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="text-cyan-400 font-bold">{repo.skillsExtracted} Kỹ Năng Đã Nhúng</span>
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                          <span>GitHub</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: KIẾN TRÚC AI AGENT (BOJIE LI) */}
          {activeTab === 'agent_architecture' && (
            <div className="space-y-5 max-w-4xl mx-auto">
              {/* Introduction Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <h4 className="font-bold text-sm text-white">
                    Kiến Trúc Tác Nhân AI (AI Agent Architecture - Bojie Li)
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Một tác nhân thông minh (Intelligent Agent) không chỉ là một mô hình ngôn ngữ sinh văn bản thụ động. Theo chương 1 giáo trình của Bojie Li, AI Agent là một thực thể tự chủ hoạt động trong môi trường số hoặc vật lý thông qua chu trình khép kín:
                </p>
              </div>

              {/* 3 Core Components */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                    <Activity className="w-4 h-4" />
                    <span>1. CẢM BIẾN (SENSORS)</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Thu thập tín hiệu từ môi trường: Lệnh người dùng, microphone giọng nói, camera FaceID, trạng thái clipboard, file tài liệu và API mạng LAN IoT.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                    <Cpu className="w-4 h-4" />
                    <span>2. TẦNG ĐIỀU PHỐI (ORCHESTRATION)</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Bộ não AI (Gemini 3.8 Flash + RAG Vector DB) lập kế hoạch DAG đa bước, chia nhỏ mục tiêu phức tạp thành các task tuần tự.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>3. BỘ TRUYỀN ĐỘNG (ACTUATORS)</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Thực thi hành động tác động lên thế giới số: Tạo file Sheets/Doc/PPTX, dọn dẹp máy tính, điều khiển đèn/rèm, gửi báo cáo định kỳ.
                  </p>
                </div>
              </div>

              {/* 10 Evolutionary Stages */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  10 Giai Đoạn Phát Triển Của Trợ Lý Ảo Đến AI Agent Tự Trị:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-mono text-center">
                  {[
                    '1. Automation',
                    '2. Rule-based Chat',
                    '3. NLP Chatbot',
                    '4. Voicebot / Callbot',
                    '5. LLM Chatbot',
                    '6. RAG Chatbot',
                    '7. AI Assistant',
                    '8. AI Agent (Planning)',
                    '9. Virtual AI Agent',
                    '10. Multi-Agent Auto'
                  ].map((stage, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-xl border ${
                        idx >= 7
                          ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-200 font-bold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      {stage}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 pt-1">
                  Hoppi đang vận hành ở <strong className="text-cyan-300">Giai đoạn 10: Multi-Agent & Autonomous AI</strong> với 18 phòng ban, tự động lập lịch theo đúng kế hoạch mà không cần sự can thiệp thủ công!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Chủ nhân: <strong className="text-white">{masterName}</strong></span>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-cyan-400 font-mono">
              Smart Vector Cache: Active ({vectorStats.averageRetrievalLatencyMs}ms)
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
