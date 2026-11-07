import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  Mic,
  Zap,
  Code2,
  HelpCircle,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  Sparkles,
  PieChart as PieIcon,
  BarChart3,
  SlidersHorizontal,
  PlusCircle,
  Radio,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  AppTheme,
  VoiceIntentCategory,
  VoiceIntentDayStat,
  VoiceIntentSummary,
} from '../types';

interface VoiceCommandIntentChartProps {
  theme?: AppTheme;
}

export const INTENT_META: Record<
  VoiceIntentCategory,
  { label: string; labelVi: string; color: string; icon: string; topExample: string }
> = {
  iot_control: {
    label: 'IoT & Smart Home',
    labelVi: 'Điều khiển IoT & Kịch Bản',
    color: '#06b6d4', // cyan-500
    icon: 'zap',
    topExample: '"Hoppi, chúc ngủ ngon" / "Bật điều hòa 24 độ"',
  },
  code_task: {
    label: 'Code Agent & AST',
    labelVi: 'Lập trình & Sandbox AST',
    color: '#8b5cf6', // purple-500
    icon: 'code',
    topExample: '"Hoppi, kiểm tra lỗi cú pháp và chạy test"',
  },
  general_query: {
    label: 'General & RAG Query',
    labelVi: 'Truy vấn & Bộ Nhớ RAG',
    color: '#3b82f6', // blue-500
    icon: 'query',
    topExample: '"Hoppi, tóm tắt tài liệu kiến trúc hệ thống"',
  },
  sales_crm: {
    label: 'Sales CRM & Leads',
    labelVi: 'Quản Lý Khách Hàng CRM',
    color: '#10b981', // emerald-500
    icon: 'crm',
    topExample: '"Hoppi, kiểm tra lead Zalo OA mới nhất"',
  },
  system_routine: {
    label: 'System & Routines',
    labelVi: 'Hệ Thống & Lịch Trình',
    color: '#f59e0b', // amber-500
    icon: 'system',
    topExample: '"Hoppi, dọn dẹp vector cache ngầm"',
  },
};

// Generate realistic 30-day voice command dataset leading up to current date
function generate30DayVoiceIntentData(): VoiceIntentDayStat[] {
  const result: VoiceIntentDayStat[] = [];
  const baseDate = new Date(2026, 9, 28); // 2026-10-28

  for (let i = 29; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() - i);

    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const dayStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    const fullDate = d.toISOString().split('T')[0];

    // Seeded variations
    const iot = Math.floor(18 + Math.sin(i * 0.4) * 6 + (isWeekend ? 4 : 0));
    const code = Math.floor(14 + Math.cos(i * 0.35) * 5 + (isWeekend ? -3 : 2));
    const query = Math.floor(9 + Math.sin(i * 0.6) * 3);
    const sales = Math.floor(5 + Math.cos(i * 0.5) * 2 + (isWeekend ? -2 : 1));
    const system = Math.floor(3 + Math.sin(i * 0.8) * 1.5);

    const total = iot + code + query + sales + system;

    result.push({
      date: dayStr,
      fullDate,
      dayIndex: 30 - i,
      iot_control: Math.max(10, iot),
      code_task: Math.max(6, code),
      general_query: Math.max(4, query),
      sales_crm: Math.max(2, sales),
      system_routine: Math.max(1, system),
      total,
    });
  }

  return result;
}

export const VoiceCommandIntentChart: React.FC<VoiceCommandIntentChartProps> = ({
  theme = 'cyberpunk',
}) => {
  const [data, setData] = useState<VoiceIntentDayStat[]>(() => generate30DayVoiceIntentData());
  const [viewMode, setViewMode] = useState<'area' | 'stacked_bar' | 'donut'>('area');
  const [activeCategory, setActiveCategory] = useState<VoiceIntentCategory | 'all'>('all');
  const [simulatedFeedback, setSimulatedFeedback] = useState<string | null>(null);

  // Compute 30-day aggregates
  const summaries = useMemo<VoiceIntentSummary[]>(() => {
    const totals: Record<VoiceIntentCategory, number> = {
      iot_control: 0,
      code_task: 0,
      general_query: 0,
      sales_crm: 0,
      system_routine: 0,
    };

    data.forEach((day) => {
      totals.iot_control += day.iot_control;
      totals.code_task += day.code_task;
      totals.general_query += day.general_query;
      totals.sales_crm += day.sales_crm;
      totals.system_routine += day.system_routine;
    });

    const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0) || 1;

    const latencies: Record<VoiceIntentCategory, number> = {
      iot_control: 14,
      code_task: 38,
      general_query: 28,
      sales_crm: 22,
      system_routine: 16,
    };

    const trends: Record<VoiceIntentCategory, number> = {
      iot_control: 18.4,
      code_task: 12.1,
      general_query: 8.5,
      sales_crm: 15.2,
      system_routine: 4.8,
    };

    return (Object.keys(totals) as VoiceIntentCategory[]).map((cat) => ({
      category: cat,
      label: INTENT_META[cat].label,
      labelVi: INTENT_META[cat].labelVi,
      totalCount: totals[cat],
      percentage: Number(((totals[cat] / grandTotal) * 100).toFixed(1)),
      color: INTENT_META[cat].color,
      icon: INTENT_META[cat].icon,
      avgLatencyMs: latencies[cat],
      topExample: INTENT_META[cat].topExample,
      trendPercentage: trends[cat],
    }));
  }, [data]);

  const grandTotalCommands = useMemo(
    () => summaries.reduce((sum, s) => sum + s.totalCount, 0),
    [summaries]
  );

  // Donut chart formatted slice data
  const donutData = useMemo(() => {
    return summaries.map((s) => ({
      name: s.labelVi,
      rawName: s.label,
      value: s.totalCount,
      percentage: s.percentage,
      color: s.color,
      category: s.category,
    }));
  }, [summaries]);

  // Simulate injecting a real-time voice command
  const handleSimulateNewVoiceCommand = (category: VoiceIntentCategory = 'iot_control') => {
    setData((prev) => {
      const copy = [...prev];
      const lastIdx = copy.length - 1;
      if (lastIdx >= 0) {
        copy[lastIdx] = {
          ...copy[lastIdx],
          [category]: copy[lastIdx][category] + 1,
          total: copy[lastIdx].total + 1,
        };
      }
      return copy;
    });

    const catName = INTENT_META[category].labelVi;
    setSimulatedFeedback(`+1 Khẩu lệnh mới ghi nhận: "${catName}" (Cập nhật trực tiếp biểu đồ 30 ngày)`);
    setTimeout(() => setSimulatedFeedback(null), 3000);
  };

  // Export JSON Report
  const handleExportJSON = () => {
    const exportPayload = {
      report: 'Hoppi Voice Command Intent Distribution - 30 Days',
      generatedAt: new Date().toISOString(),
      grandTotalCommands,
      intentSummaries: summaries,
      dailyBreakdown: data,
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hoppi-voice-intents-30d-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`rounded-2xl border p-5 md:p-6 transition-all ${
        theme === 'light'
          ? 'bg-white border-slate-200 text-slate-800 shadow-sm'
          : theme === 'deepspace'
          ? 'bg-[#0b0f19] border-neutral-800 text-slate-100'
          : 'bg-slate-900/80 border-slate-800 text-slate-100'
      }`}
    >
      {/* Header and Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Phân Bổ Ý Định Lệnh Giọng Nói 30 Ngày (Voice Command Intents)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Recharts Analytics
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Thống kê tần suất nhận diện theo mục đích sử dụng (IoT, Lập trình, Tra cứu, CRM, Hệ thống)
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Switcher & Export */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center rounded-xl p-1 bg-slate-950/80 border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setViewMode('area')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'area'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Xu Hướng (Area)</span>
            </button>
            <button
              onClick={() => setViewMode('stacked_bar')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'stacked_bar'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Cột (Stacked Bar)</span>
            </button>
            <button
              onClick={() => setViewMode('donut')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'donut'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5" />
              <span>Cơ Cấu (Donut)</span>
            </button>
          </div>

          <button
            onClick={() => handleSimulateNewVoiceCommand('iot_control')}
            title="Mô phỏng thêm 1 khẩu lệnh IoT vào ngày hôm nay để xem Recharts phản hồi động"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">+ Mô Phỏng Lệnh</span>
          </button>

          <button
            onClick={handleExportJSON}
            title="Xuất báo cáo định dạng JSON"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 border border-slate-700 cursor-pointer transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xuất JSON</span>
          </button>
        </div>
      </div>

      {/* Simulated Feedback Banner */}
      {simulatedFeedback && (
        <div className="mt-3 p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 flex items-center gap-2 animate-pulse">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{simulatedFeedback}</span>
        </div>
      )}

      {/* KPI Cards: 30-Day Aggregates */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {/* KPI 1: Grand Total */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-between">
            <span>Tổng Lệnh Giọng Nói</span>
            <Mic className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-cyan-400 mt-1">
            {grandTotalCommands.toLocaleString('vi-VN')}
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2% so với 30 ngày trước</span>
          </div>
        </div>

        {/* KPI 2: Top Intent */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-between">
            <span>Ý Định Chiếm Đa Số</span>
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-extrabold font-mono text-white mt-1 truncate">
            {summaries[0]?.labelVi || 'IoT Control'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {summaries[0]?.percentage}% tổng lưu lượng ({summaries[0]?.totalCount} lệnh)
          </div>
        </div>

        {/* KPI 3: Accuracy / Success */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-between">
            <span>Độ Chính Xác Khẩu Lệnh</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">
            98.6%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Chỉ 1.4% cần xác nhận lại qua STT
          </div>
        </div>

        {/* KPI 4: Average Processing Latency */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-between">
            <span>Độ Trễ Xử Lý LAN P2P</span>
            <Radio className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-indigo-400 mt-1">
            18ms
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">
            Phản hồi tức thì không cần cloud
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <span className="text-xs text-slate-400 font-semibold mr-1">Bộ lọc ý định:</span>
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            activeCategory === 'all'
              ? 'bg-cyan-500 text-slate-950 font-bold'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Tất Cả ({grandTotalCommands})
        </button>
        {summaries.map((cat) => (
          <button
            key={cat.category}
            onClick={() => setActiveCategory(cat.category)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
              activeCategory === cat.category
                ? 'text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            style={{
              backgroundColor: activeCategory === cat.category ? cat.color : undefined,
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: cat.color }}
            />
            <span>{cat.labelVi}</span>
            <span className="font-mono text-[10px] opacity-80">({cat.totalCount})</span>
          </button>
        ))}
      </div>

      {/* Main Chart Rendering Section */}
      <div className="mt-5">
        {viewMode === 'area' && (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorIot" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="colorCode" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="colorQuery" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="colorSystem" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme === 'light' ? '#e2e8f0' : '#1e293b'}
                />
                <XAxis
                  dataKey="date"
                  stroke={theme === 'light' ? '#64748b' : '#94a3b8'}
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke={theme === 'light' ? '#64748b' : '#94a3b8'}
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload as VoiceIntentDayStat;
                      return (
                        <div
                          className={`p-3.5 rounded-xl border shadow-2xl text-xs min-w-56 ${
                            theme === 'light'
                              ? 'bg-white border-slate-200 text-slate-800'
                              : 'bg-slate-900 border-slate-700 text-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-700/60">
                            <span className="font-bold text-cyan-400">Ngày {item.date}</span>
                            <span className="font-mono font-bold text-white">
                              Tổng: {item.total} lệnh
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-cyan-300">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                                Điều khiển IoT:
                              </span>
                              <span className="font-mono font-bold">{item.iot_control}</span>
                            </div>
                            <div className="flex items-center justify-between text-purple-300">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-purple-400" />
                                Lập trình Code:
                              </span>
                              <span className="font-mono font-bold">{item.code_task}</span>
                            </div>
                            <div className="flex items-center justify-between text-blue-300">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-blue-400" />
                                Truy vấn RAG:
                              </span>
                              <span className="font-mono font-bold">{item.general_query}</span>
                            </div>
                            <div className="flex items-center justify-between text-emerald-300">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                Sales CRM:
                              </span>
                              <span className="font-mono font-bold">{item.sales_crm}</span>
                            </div>
                            <div className="flex items-center justify-between text-amber-300">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-400" />
                                Hệ thống:
                              </span>
                              <span className="font-mono font-bold">{item.system_routine}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {(activeCategory === 'all' || activeCategory === 'iot_control') && (
                  <Area
                    type="monotone"
                    dataKey="iot_control"
                    name="Điều khiển IoT"
                    stroke="#06b6d4"
                    fillOpacity={1}
                    fill="url(#colorIot)"
                    stackId="1"
                  />
                )}
                {(activeCategory === 'all' || activeCategory === 'code_task') && (
                  <Area
                    type="monotone"
                    dataKey="code_task"
                    name="Lập trình & AST"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorCode)"
                    stackId="1"
                  />
                )}
                {(activeCategory === 'all' || activeCategory === 'general_query') && (
                  <Area
                    type="monotone"
                    dataKey="general_query"
                    name="Truy vấn & RAG"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorQuery)"
                    stackId="1"
                  />
                )}
                {(activeCategory === 'all' || activeCategory === 'sales_crm') && (
                  <Area
                    type="monotone"
                    dataKey="sales_crm"
                    name="Sales CRM"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorSales)"
                    stackId="1"
                  />
                )}
                {(activeCategory === 'all' || activeCategory === 'system_routine') && (
                  <Area
                    type="monotone"
                    dataKey="system_routine"
                    name="Hệ thống"
                    stroke="#f59e0b"
                    fillOpacity={1}
                    fill="url(#colorSystem)"
                    stackId="1"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {viewMode === 'stacked_bar' && (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme === 'light' ? '#e2e8f0' : '#1e293b'}
                />
                <XAxis
                  dataKey="date"
                  stroke={theme === 'light' ? '#64748b' : '#94a3b8'}
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke={theme === 'light' ? '#64748b' : '#94a3b8'}
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload as VoiceIntentDayStat;
                      return (
                        <div
                          className={`p-3 rounded-xl border shadow-2xl text-xs ${
                            theme === 'light'
                              ? 'bg-white border-slate-200 text-slate-800'
                              : 'bg-slate-900 border-slate-700 text-slate-100'
                          }`}
                        >
                          <div className="font-bold text-cyan-400 mb-1">Ngày {item.date}</div>
                          <div>Tổng: <span className="font-mono font-bold">{item.total}</span> khẩu lệnh</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {(activeCategory === 'all' || activeCategory === 'iot_control') && (
                  <Bar dataKey="iot_control" stackId="a" fill="#06b6d4" name="IoT" />
                )}
                {(activeCategory === 'all' || activeCategory === 'code_task') && (
                  <Bar dataKey="code_task" stackId="a" fill="#8b5cf6" name="Code" />
                )}
                {(activeCategory === 'all' || activeCategory === 'general_query') && (
                  <Bar dataKey="general_query" stackId="a" fill="#3b82f6" name="RAG" />
                )}
                {(activeCategory === 'all' || activeCategory === 'sales_crm') && (
                  <Bar dataKey="sales_crm" stackId="a" fill="#10b981" name="CRM" />
                )}
                {(activeCategory === 'all' || activeCategory === 'system_routine') && (
                  <Bar dataKey="system_routine" stackId="a" fill="#f59e0b" name="System" radius={[4, 4, 0, 0]} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {viewMode === 'donut' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Donut Chart */}
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell
                        key={`donut-cell-${index}`}
                        fill={entry.color}
                        stroke="#0f172a"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div
                            className={`p-2.5 rounded-lg border shadow-xl text-xs ${
                              theme === 'light'
                                ? 'bg-white border-slate-200 text-slate-800'
                                : 'bg-slate-900 border-slate-700 text-slate-100'
                            }`}
                          >
                            <span style={{ color: d.color }} className="font-bold block">
                              {d.name}
                            </span>
                            <span className="text-slate-300 font-mono">
                              {d.value} lệnh ({d.percentage}%)
                            </span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Breakdown Cards & Examples */}
            <div className="md:col-span-2 space-y-2">
              {summaries.map((s) => (
                <div
                  key={s.category}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-850 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: s.color }}
                    />
                    <div className="truncate">
                      <div className="font-semibold text-slate-200 truncate">{s.labelVi}</div>
                      <div className="text-[10px] text-slate-500 truncate italic">
                        {s.topExample}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 font-mono">
                    <span className="text-slate-400">{s.avgLatencyMs}ms</span>
                    <span className="font-bold text-white">{s.totalCount}</span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
                      style={{
                        backgroundColor: `${s.color}20`,
                        color: s.color,
                      }}
                    >
                      {s.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Legend Bar */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-3 flex-wrap">
          {summaries.map((s) => (
            <div key={s.category} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-slate-300 font-medium">{s.labelVi}</span>
              <span className="font-mono text-slate-500">({s.percentage}%)</span>
            </div>
          ))}
        </div>

        <div className="font-mono text-[11px] text-slate-500">
          Khung thời gian: 30 ngày vừa qua (Cập nhật 24/7)
        </div>
      </div>
    </div>
  );
};
