import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Cpu,
  Layers,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Radio,
  Terminal,
  ShieldCheck,
  Server,
  Code2,
  GitBranch,
  Search,
  Sparkles,
  Bot,
  ExternalLink,
  Sliders,
  Check,
  Copy,
  Volume2,
  Maximize2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { AppTheme, UserIdentity, ExpressiveMood } from '../types';
import { FuturisticAskingAiBar } from './FuturisticAskingAiBar';

interface DagNode {
  id: string;
  stepNumber: number;
  label: string;
  category: string;
  status: 'completed' | 'running' | 'pending';
  latencyMs: number;
  tokens: number;
  executor: string;
  details: string;
  outputSummary: string;
}

interface FuturisticOrchestrationConsoleProps {
  identity: UserIdentity;
  theme?: AppTheme;
  onSpeakText?: (text: string) => void;
  onDispatchCommand: (cmd: string) => void;
  onNavigateToModule?: (mod: any) => void;
}

export const FuturisticOrchestrationConsole: React.FC<FuturisticOrchestrationConsoleProps> = ({
  identity,
  theme = 'cyberpunk',
  onSpeakText,
  onDispatchCommand,
  onNavigateToModule,
}) => {
  const [activeStepId, setActiveStepId] = useState<string>('step-4');
  const [activeLogTab, setActiveLogTab] = useState<'orchestrator' | 'vector_cache' | 'zalo_crm' | 'live_stream'>('orchestrator');
  const [isSimulatingRun, setIsSimulatingRun] = useState(false);
  const [currentSimStep, setCurrentSimStep] = useState(4);
  const [copiedLog, setCopiedLog] = useState(false);

  // DAG Pipeline Nodes (from Video 2 Dual Monitor Operations Center)
  const [dagNodes, setDagNodes] = useState<DagNode[]>([
    {
      id: 'step-1',
      stepNumber: 1,
      label: 'Perception & Intent',
      category: 'Trigger',
      status: 'completed',
      latencyMs: 12,
      tokens: 85,
      executor: 'Voice / Webhook Router',
      details: 'Khối tiếp nhận lệnh giọng nói vi-VN, phân tách âm vị học, phân rã intent và kiểm tra token tin cậy.',
      outputSummary: 'Intent: "EXECUTE_AUTONOMOUS_WORKFLOW" (Confidence: 99.4%)',
    },
    {
      id: 'step-2',
      stepNumber: 2,
      label: 'Vector RAG & Cache',
      category: 'Memory',
      status: 'completed',
      latencyMs: 1.2,
      tokens: 310,
      executor: 'Smart Vector Cache ⚡',
      details: 'Truy vấn ChromaDB & FAISS Local, áp dụng cơ chế Smart Vector Cache boost trọng số 1.8x, giảm 42% tokens.',
      outputSummary: 'Khớp 4 vector tri thức liên quan từ 24 kho Agent Skills GitHub.',
    },
    {
      id: 'step-3',
      stepNumber: 3,
      label: '18-Agent Swarm DAG',
      category: 'Orchestrator',
      status: 'completed',
      latencyMs: 84,
      tokens: 950,
      executor: 'Atlas Lead & Sage Architect',
      details: 'Phân công nhiệm vụ song song cho 18 Agent thuộc 8 phòng ban AI trong Tổng Hành Dinh 3D SAMS.',
      outputSummary: '4 Sub-agents đã nhận task: Code, Security, CRM, IoT.',
    },
    {
      id: 'step-4',
      stepNumber: 4,
      label: 'Tool Actuator Pipeline',
      category: 'Execution',
      status: 'running',
      latencyMs: 142,
      tokens: 1420,
      executor: 'Hoppi Autonomous Engine',
      details: 'Gọi trực tiếp API máy tính, biên dịch mã TypeScript, dọn dẹp bộ nhớ RAM rác, và đồng bộ dữ liệu Zalo OA.',
      outputSummary: 'Đang thực thi tác vụ nền: Cleaned 6.9GB cache • Syncing CRM leads...',
    },
    {
      id: 'step-5',
      stepNumber: 5,
      label: 'HITL Quality Gate',
      category: 'Safety',
      status: 'pending',
      latencyMs: 0,
      tokens: 0,
      executor: 'Master Nguyễn Thanh Hải (Admin)',
      details: 'Kiểm soát con người tham gia vòng lặp (Human-in-the-Loop) hoặc kích hoạt tự động theo chính sách bảo mật.',
      outputSummary: 'Chờ phê duyệt tự động (Auto-Delegated: Active)',
    },
    {
      id: 'step-6',
      stepNumber: 6,
      label: 'Output Production Artifacts',
      category: 'Artifacts',
      status: 'pending',
      latencyMs: 0,
      tokens: 0,
      executor: 'Seedream 5.0 & Office Exporter',
      details: 'Đóng gói sản phẩm cuối: Bảng tính Excel .xlsx, Slide báo cáo .pptx, Mã nguồn hoàn thiện .zip, và thông báo qua Mesh.',
      outputSummary: 'Sẵn sàng render kết quả khi Step 4 hoàn tất.',
    },
  ]);

  // Terminal Logs Stream
  const terminalLogs = {
    orchestrator: `[00:00:01.012] [INFO] [DAG_ENGINE] Initializing pipeline session #DAG-2026-11-06-884
[00:00:01.025] [INFO] [ROUTER] Identity verified: Master Nguyễn Thanh Hải (Role: Chủ nhân)
[00:00:01.042] [TRACE] [STEP_1] Voice intent recognized: "Kích hoạt Tổng Hành Dinh AI & Đồng bộ 24 kho Skills"
[00:00:01.058] [SUCCESS] [STEP_1] Perception & Intent completed in 12ms (Tokens: 85)
[00:00:01.060] [INFO] [STEP_2] Querying Smart Vector Cache with Cosine Similarity >= 0.78
[00:00:01.074] [CACHE_HIT] [STEP_2] 4 Skill repos matched: vercel-labs/skills, cuongducle/viet-humanize, ljagiello/ctf-skills, prompt-optimizer
[00:00:01.076] [OPTIMIZE] [STEP_2] Weight boosted +1.8x, token footprint pruned from 530 -> 310 tokens
[00:00:01.080] [SUCCESS] [STEP_2] Smart Vector RAG retrieval completed in 1.2ms
[00:00:01.085] [SWARM_DISPATCH] [STEP_3] Assigning DAG sub-tasks to 18 agents:
  ├─ [Agent 01: Atlas] -> Hardware monitoring & System performance telemetry
  ├─ [Agent 02: Sage] -> RAG index optimization & prompt synthesis
  ├─ [Agent 03: Blue] -> Zalo OA CRM message queue dispatch
  └─ [Agent 06: Hoppi] -> Core reasoning & Autonomous tool actuation
[00:00:01.169] [SUCCESS] [STEP_3] 18-Department Multi-Agent DAG initialized (Latency: 84ms)
[00:00:01.172] [EXEC] [STEP_4] Tool Actuator starting execution:
  ├─ [CALL] /api/agent-skills/vector-cache/prune (status: 200 OK)
  ├─ [CALL] /api/agent-skills/vector-cache/boost (repo: cuongducle/viet-humanize, boost: +1.8x)
  ├─ [CALL] system.memory.cleanup (reclaimed: 6.9 GB temp cache)
  └─ [SYNC] broadcast_channel.send("MESH_POWER_ACTIVE") -> 3 devices synced
[00:00:01.314] [RUNNING] [STEP_4] Step 4 in progress... 92% completed`,
    vector_cache: `[00:00:00.890] [CACHE_INIT] VectorCacheStore size: 1,420 vectors
[00:00:00.912] [INDEX_STATS] High-usage boosted skills: 8 items
  • cuongducle/viet-humanize: weight=2.4x (usage=48 calls)
  • vercel-labs/agent-skills: weight=2.1x (usage=39 calls)
  • anthropic/skills: weight=1.9x (usage=27 calls)
  • shadcn-ui/ui: weight=1.8x (usage=22 calls)
[00:00:01.065] [PRUNE_SCAN] Scanned 28 metadata nodes, trimmed 4 redundant description fields
[00:00:01.070] [SUB_MS] Query latency: 0.95ms (99th percentile: 1.4ms)`,
    zalo_crm: `[00:00:00.940] [ZALO_OA_WEBHOOK] Listening on /api/crm/zalo/webhook (Port 3000)
[00:00:01.020] [CRM_SYNC] Polling 4 active customer leads
  ├─ Lead: Nguyễn Hoàng Long (Tag: VIP BĐS) • Trạng thái: Đã gửi báo giá
  ├─ Lead: Công ty TNHH Song Toàn • Trạng thái: Hẹn demo phần mềm Hoppi
  └─ Lead: Khách hàng Zalo 0938152338 • Trạng thái: Chờ phản hồi tự động
[00:00:01.110] [CRM_DISPATCH] Auto-reply message generated via Hoppi Empathetic persona`,
    live_stream: `[STREAM:00:01.315] { "event": "NODE_PROGRESS", "step": 4, "progress": 0.92, "activeThreads": 8 }
[STREAM:00:01.320] { "event": "TELEMETRY_SAMPLE", "cpu": 14.2, "ramGB": 3.4, "tpuPercent": 80.0, "latencyMs": 0.95 }
[STREAM:00:01.328] { "event": "DAG_HEALTH", "state": "HEALTHY", "unhandledExceptions": 0 }`,
  };

  const handleSimulateExecution = () => {
    setIsSimulatingRun(true);
    setCurrentSimStep(1);

    if (onSpeakText) {
      onSpeakText('Đang khởi chạy luồng điều phối tác nhân AI tự trị trên toàn bộ 6 bước.');
    }

    let step = 1;
    const interval = setInterval(() => {
      step++;
      setCurrentSimStep(step);
      if (step >= 6) {
        clearInterval(interval);
        setIsSimulatingRun(false);
        setDagNodes((prev) =>
          prev.map((node) => ({
            ...node,
            status: 'completed',
          }))
        );
        if (onSpeakText) {
          onSpeakText('Luồng điều phối đã hoàn tất thành công 100%. Các sản phẩm đã sẵn sàng xuất bản!');
        }
      } else {
        setDagNodes((prev) =>
          prev.map((node) =>
            node.stepNumber < step
              ? { ...node, status: 'completed' }
              : node.stepNumber === step
              ? { ...node, status: 'running' }
              : { ...node, status: 'pending' }
          )
        );
      }
    }, 1200);
  };

  const activeNode = dagNodes.find((n) => n.id === activeStepId) || dagNodes[3];

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(terminalLogs[activeLogTab]);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  return (
    <div className="w-full flex-1 flex flex-col space-y-4">
      {/* TOP MISSION-CONTROL BANNER (from Video 2 Dual Monitor Operations Center) */}
      <div className="p-4 rounded-2xl bg-slate-950/95 border border-cyan-500/40 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <h2 className="text-sm font-extrabold text-cyan-300 font-mono tracking-wider uppercase">
              SYSTEMS · AI AGENT ORCHESTRATION PLATFORM
            </h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/50">
              PRODUCTION
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-300 font-medium flex-wrap">
            <span>Khu vực: <strong className="text-cyan-200">VN-HCM-HQ</strong></span>
            <span>·</span>
            <span>NodePool: <strong className="text-amber-300">18 Agents Active</strong></span>
            <span>·</span>
            <span>Workflow: <strong className="text-emerald-300">Live Continuous</strong></span>
            <span>·</span>
            <span>Chủ nhân: <strong className="text-amber-200">{identity.name}</strong></span>
          </div>
        </div>

        {/* Action Controls & Benchmark Trigger */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            type="button"
            onClick={handleSimulateExecution}
            disabled={isSimulatingRun}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg ${
              isSimulatingRun
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/25 scale-102'
            }`}
          >
            {isSimulatingRun ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Đang điều phối DAG...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Khởi chạy Quy trình DAG</span>
              </>
            )}
          </button>

          {onNavigateToModule && (
            <button
              type="button"
              onClick={() => onNavigateToModule('hq3d')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Vào 3D SAMS Office</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ASKING AI AGENT SEARCH & PROMPT CONSOLE (from Video 3) */}
      <FuturisticAskingAiBar
        onSendMessage={onDispatchCommand}
        onSpeakText={onSpeakText}
        theme={theme}
      />

      {/* HORIZONTAL INTERACTIVE DAG PIPELINE FLOW (from Video 2) */}
      <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800/90 backdrop-blur-xl shadow-xl flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">
              PIPELINE DAG FLOW · TOÀN BỘ 6 BƯỚC TỰ TRỊ
            </h3>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Đang chạy: Bước 4 / 6
            </span>
            <span>·</span>
            <span>Độ trễ trung bình: 0.95ms</span>
            <span>·</span>
            <span className="text-emerald-400">Thành công 99.8%</span>
          </div>
        </div>

        {/* Nodes Flowchart Track with SVG Connectors */}
        <div className="relative overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center min-w-[780px] gap-2 py-2">
            {dagNodes.map((node, index) => {
              const isSelected = activeStepId === node.id;
              const isRunning = node.status === 'running';
              const isCompleted = node.status === 'completed';

              return (
                <React.Fragment key={node.id}>
                  {/* Step Node Card */}
                  <div
                    onClick={() => setActiveStepId(node.id)}
                    className={`relative flex-1 min-w-[130px] p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-gradient-to-b from-cyan-950/60 to-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-102 ring-1 ring-cyan-400/40'
                        : isRunning
                        ? 'bg-slate-900/90 border-cyan-500/60 shadow-md shadow-cyan-500/10'
                        : isCompleted
                        ? 'bg-slate-900/50 border-emerald-500/40 hover:border-emerald-500/70'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-60'
                    }`}
                  >
                    {/* Top Node Header */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[9.5px] font-mono font-bold text-slate-400">
                        STEP 0{node.stepNumber}
                      </span>
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : isRunning ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </div>

                    {/* Step Title */}
                    <h4 className="text-xs font-bold text-slate-100 leading-tight truncate">
                      {node.label}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                      {node.executor}
                    </p>

                    {/* Metrics Bar */}
                    <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono text-slate-400">
                      <span>{node.latencyMs > 0 ? `${node.latencyMs}ms` : '0ms'}</span>
                      <span className="text-cyan-400">{node.tokens > 0 ? `${node.tokens} tok` : 'idle'}</span>
                    </div>

                    {/* Laser glowing bottom pulse when running */}
                    {isRunning && (
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#38bdf8]"
                      />
                    )}
                  </div>

                  {/* Connector Arrow */}
                  {index < dagNodes.length - 1 && (
                    <div className="shrink-0 flex items-center justify-center text-slate-600">
                      <ChevronRight className="w-4 h-4 text-cyan-500/50" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Selected Step Inspector Box */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-cyan-400">
                [ĐANG SOI CHI TIẾT]: Bước {activeNode.stepNumber} · {activeNode.label}
              </span>
              <span className={`text-[9.5px] font-mono px-2 py-0.5 rounded border ${
                activeNode.status === 'completed'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                  : activeNode.status === 'running'
                  ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 animate-pulse'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {activeNode.status.toUpperCase()}
              </span>
            </div>
            <p className="text-slate-300 mt-1">{activeNode.details}</p>
            <p className="text-[11px] font-mono text-emerald-400 mt-0.5">
              ➜ Đầu ra: {activeNode.outputSummary}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onSpeakText && (
              <button
                type="button"
                onClick={() => onSpeakText(`Bước ${activeNode.stepNumber}: ${activeNode.label}. ${activeNode.details}`)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-cyan-300 transition cursor-pointer"
                title="Nghe đọc thông tin bước này"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => onDispatchCommand(`Thực thi lại Bước ${activeNode.stepNumber}: ${activeNode.label}`)}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 font-bold text-[11px] transition cursor-pointer"
            >
              Kích hoạt lại
            </button>
          </div>
        </div>
      </div>

      {/* DUAL-PANE COCKPIT: HOLOGRAPHIC HUD & LIVE CODE TERMINAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Pane (5 Cols): Holographic Glass HUD Analytics (matching Image 2) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden space-y-4">
            {/* Ambient cybernetic grid background */}
            <div className="absolute inset-0 bg-radial from-cyan-500/5 via-transparent to-transparent pointer-events-none" />

            {/* Central Holographic [ AI ] Tile (Exact Signature from Image 2) */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                {/* 3D Glass Embossed AI Tile */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-600 to-slate-950 p-0.5 shadow-lg shadow-cyan-500/30 flex items-center justify-center relative">
                  <div className="w-full h-full rounded-[10px] bg-slate-950/80 backdrop-blur-md flex items-center justify-center font-black text-xl text-cyan-200 tracking-wider shadow-inner">
                    AI
                  </div>
                  {/* Glass reflection highlight */}
                  <div className="absolute top-1 left-2 w-4 h-2 bg-white/40 rounded-full rotate-[-25deg] blur-[0.4px]" />
                </div>

                <div>
                  <h4 className="text-xs font-extrabold text-slate-100 flex items-center gap-1.5 font-mono">
                    <span>HOLOGRAM HUD ANALYTICS</span>
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Trực quan hóa tài nguyên & hiệu năng tác nhân thời gian thực
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-800">
                24/7 LIVE
              </span>
            </div>

            {/* 4 Radial / Percentage Telemetry Meters (50%, 80%, 55%, 75% as shown in Image 2) */}
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: 'Intent Conf', value: '50%', color: 'text-sky-400', barColor: 'bg-sky-400' },
                { label: 'TPU Load', value: '80%', color: 'text-amber-400', barColor: 'bg-amber-400' },
                { label: 'Cache Hit', value: '55%', color: 'text-indigo-400', barColor: 'bg-indigo-400' },
                { label: 'Task Prog', value: '75%', color: 'text-emerald-400', barColor: 'bg-emerald-400' },
              ].map((meter, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80">
                  <span className={`text-base font-extrabold font-mono block ${meter.color}`}>
                    {meter.value}
                  </span>
                  <span className="text-[9.5px] text-slate-400 block mt-0.5 font-medium">
                    {meter.label}
                  </span>
                  <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${meter.barColor}`}
                      style={{ width: meter.value }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Thermal Neural Heatmap & Sparkline Graph */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  Neural Memory Throughput
                </span>
                <span className="font-mono text-cyan-400 text-[10px]">1,420 vectors · 0.95ms</span>
              </div>

              {/* Simulated SVG Waveform curve */}
              <div className="h-16 w-full flex items-end gap-1 pt-2">
                {[35, 45, 60, 52, 70, 85, 65, 78, 92, 74, 88, 96, 60, 72, 84, 90, 68, 77, 86, 95].map(
                  (val, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ height: `${val * 0.4}%` }}
                      animate={{ height: [`${val * 0.4}%`, `${val}%`, `${val * 0.6}%`] }}
                      transition={{
                        repeat: Infinity,
                        duration: 2.5 + (idx % 4) * 0.4,
                        ease: 'easeInOut',
                      }}
                      className="flex-1 bg-gradient-to-t from-cyan-500/40 via-cyan-400 to-amber-400/90 rounded-t-xs"
                    />
                  )
                )}
              </div>
            </div>

            {/* Hardware & Mesh Snapshot */}
            <div className="space-y-1.5 text-xs text-slate-300 font-mono">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-slate-800/60">
                <span>CPU / GPU Core:</span>
                <span className="text-cyan-300 font-bold">14.2% / Apple M-Series & TPU</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-slate-800/60">
                <span>RAM Cache:</span>
                <span className="text-emerald-400 font-bold">3.4 GB / 16.0 GB (Cleaned)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-slate-800/60">
                <span>Mesh Devices:</span>
                <span className="text-amber-300 font-bold">3 Thiết bị kết nối 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane (7 Cols): Real-time Scrolling Terminal & Code Explorer (matching Video 2) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950/95 border border-cyan-500/40 backdrop-blur-2xl shadow-2xl flex flex-col h-full min-h-[420px]">
            {/* Terminal Top Bar with File Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  AGENT RUNTIME TERMINAL
                </span>
              </div>

              {/* File / Log Tabs */}
              <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-800 text-[10px] font-mono">
                {[
                  { id: 'orchestrator', label: 'orchestrator.py' },
                  { id: 'vector_cache', label: 'vector_cache.ts' },
                  { id: 'zalo_crm', label: 'zalo_crm.ts' },
                  { id: 'live_stream', label: 'live_telemetry.log' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveLogTab(tab.id as any)}
                    className={`px-2 py-1 rounded-md transition cursor-pointer ${
                      activeLogTab === tab.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Copy Terminal Output */}
              <button
                type="button"
                onClick={handleCopyLogs}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition cursor-pointer"
                title="Sao chép toàn bộ log terminal"
              >
                {copiedLog ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Code / Log Stream Body with Syntax Coloring */}
            <div className="flex-1 rounded-xl bg-slate-900/70 border border-slate-800/80 p-3 font-mono text-[11px] leading-relaxed overflow-y-auto max-h-[360px] text-slate-300 select-text">
              <pre className="whitespace-pre-wrap font-mono">
                {terminalLogs[activeLogTab]}
              </pre>
            </div>

            {/* Terminal Command Input Footer */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-mono font-bold">$</span>
                <span className="text-[11px] font-mono text-slate-300">
                  hoppi-agent --env production --region vn-hcm --stream-active
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                PID: 49821 • Port 3000
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
