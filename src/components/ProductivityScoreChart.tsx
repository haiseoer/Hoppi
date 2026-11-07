import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Activity,
  Clock,
  Sparkles,
  Smile,
  Target,
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AppTheme, ExpressiveMood } from '../types';

interface ProductivityScoreChartProps {
  theme?: AppTheme;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  completedTasksCount?: number;
  averageResponseTimeMs?: number;
  currentMood?: ExpressiveMood;
}

interface DailyTrendItem {
  day: string;
  productivityScore: number;
  completedTasks: number;
  responseTimeMs: number;
  primaryMood: string;
}

interface MoodProductivityItem {
  name: string;
  mood: ExpressiveMood;
  tasks: number;
  productivityScore: number;
  avgResponseMs: number;
  color: string;
  icon: string;
}

export const ProductivityScoreChart: React.FC<ProductivityScoreChartProps> = ({
  theme = 'cyberpunk',
  isExpanded = true,
  onToggleExpand,
  completedTasksCount = 28,
  averageResponseTimeMs = 385,
  currentMood = 'happy',
}) => {
  const [activeTab, setActiveTab] = useState<'trend' | 'mood'>('trend');

  // Trend data across 7 days
  const trendData: DailyTrendItem[] = [
    { day: 'T2', productivityScore: 86, completedTasks: 16, responseTimeMs: 510, primaryMood: '🎯 Tập trung' },
    { day: 'T3', productivityScore: 91, completedTasks: 22, responseTimeMs: 440, primaryMood: '😊 Vui vẻ' },
    { day: 'T4', productivityScore: 88, completedTasks: 19, responseTimeMs: 480, primaryMood: '🧐 Tò mò' },
    { day: 'T5', productivityScore: 95, completedTasks: 27, responseTimeMs: 390, primaryMood: '🎯 Tập trung' },
    { day: 'T6', productivityScore: 92, completedTasks: 24, responseTimeMs: 420, primaryMood: '😊 Vui vẻ' },
    { day: 'T7', productivityScore: 90, completedTasks: 20, responseTimeMs: 450, primaryMood: '💖 Thấu cảm' },
    {
      day: 'Hôm nay',
      productivityScore: 97,
      completedTasks: completedTasksCount,
      responseTimeMs: averageResponseTimeMs,
      primaryMood:
        currentMood === 'happy'
          ? '😊 Vui vẻ'
          : currentMood === 'focused'
          ? '🎯 Tập trung'
          : currentMood === 'curious'
          ? '🧐 Tò mò'
          : '💖 Thấu cảm',
    },
  ];

  // Mood breakdown data
  const moodData: MoodProductivityItem[] = [
    {
      name: 'Vui vẻ (Happy)',
      mood: 'happy',
      tasks: 12,
      productivityScore: 96,
      avgResponseMs: 380,
      color: '#06b6d4', // Cyan
      icon: '😊',
    },
    {
      name: 'Tập trung (Focused)',
      mood: 'focused',
      tasks: 8,
      productivityScore: 98,
      avgResponseMs: 320,
      color: '#6366f1', // Indigo
      icon: '🎯',
    },
    {
      name: 'Tò mò (Curious / RAG)',
      mood: 'curious',
      tasks: 5,
      productivityScore: 92,
      avgResponseMs: 460,
      color: '#10b981', // Emerald
      icon: '🧐',
    },
    {
      name: 'Thấu cảm (Empathetic)',
      mood: 'empathetic',
      tasks: 3,
      productivityScore: 94,
      avgResponseMs: 410,
      color: '#f59e0b', // Amber
      icon: '💖',
    },
  ];

  const overallScore = 95.8;

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-2.5 rounded-xl border text-xs shadow-xl backdrop-blur-md ${
            theme === 'light'
              ? 'bg-white/95 border-slate-300 text-slate-800'
              : theme === 'deepspace'
              ? 'bg-[#090d16]/95 border-indigo-900 text-indigo-100'
              : 'bg-slate-950/95 border-cyan-500/50 text-cyan-100'
          }`}
        >
          <div className="font-bold border-b pb-1 mb-1.5 flex items-center justify-between gap-3">
            <span>{label}</span>
            <span className="font-mono text-cyan-400">Hoppi v4.0</span>
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3 py-0.5">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-mono font-bold">
                {entry.value}
                {entry.name.includes('Tốc độ') || entry.name.includes('Response') ? 'ms' : ''}
                {entry.name.includes('Điểm') || entry.name.includes('Score') ? '/100' : ''}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`border-b transition-colors overflow-hidden ${
        theme === 'cyberpunk'
          ? 'bg-slate-950/70 border-slate-800/80 text-slate-200'
          : theme === 'deepspace'
          ? 'bg-[#080c16] border-indigo-950/60 text-indigo-100'
          : 'bg-slate-50 border-slate-200 text-slate-800'
      }`}
    >
      {/* Header Bar */}
      <div className="px-4 py-2 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs tracking-wide uppercase font-mono text-cyan-400">
                Daily Productivity Score
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                {overallScore} / 100
              </span>
            </div>
            <p className="text-[10.5px] text-slate-400 hidden sm:block">
              Đo lường năng suất tự trị dựa trên tác vụ hoàn thành, tốc độ phản hồi & tâm trạng
            </p>
          </div>
        </div>

        {/* Action Controls & Tab switcher */}
        <div className="flex items-center gap-1.5">
          <div
            className={`flex items-center p-0.5 rounded-lg border text-[11px] ${
              theme === 'light'
                ? 'bg-white border-slate-300'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            <button
              type="button"
              onClick={() => setActiveTab('trend')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'trend'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3 h-3" />
              <span>Xu hướng & Tốc độ</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('mood')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'mood'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <PieIcon className="w-3 h-3" />
              <span>Theo Tâm trạng</span>
            </button>
          </div>

          {onToggleExpand && (
            <button
              type="button"
              onClick={onToggleExpand}
              className="p-1 rounded-lg border border-slate-700/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title={isExpanded ? 'Thu gọn biểu đồ' : 'Mở rộng biểu đồ'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Expanded Chart Body */}
      {isExpanded && (
        <div className="px-4 pb-3 pt-1 space-y-2.5">
          {/* Key Metric Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div
              className={`p-2 rounded-xl border flex items-center justify-between ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div>
                <span className="text-[10px] text-slate-400 block">Điểm năng suất</span>
                <span className="text-sm font-bold font-mono text-cyan-400">{overallScore}</span>
                <span className="text-[10px] text-emerald-400 ml-1">▲ +3.4%</span>
              </div>
              <Activity className="w-4 h-4 text-cyan-400 opacity-80" />
            </div>

            <div
              className={`p-2 rounded-xl border flex items-center justify-between ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div>
                <span className="text-[10px] text-slate-400 block">Tác vụ hoàn thành</span>
                <span className="text-sm font-bold font-mono text-emerald-400">{completedTasksCount}</span>
                <span className="text-[10px] text-slate-400 ml-1">hôm nay</span>
              </div>
              <Target className="w-4 h-4 text-emerald-400 opacity-80" />
            </div>

            <div
              className={`p-2 rounded-xl border flex items-center justify-between ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div>
                <span className="text-[10px] text-slate-400 block">Tốc độ phản hồi TB</span>
                <span className="text-sm font-bold font-mono text-indigo-400">{averageResponseTimeMs}ms</span>
                <span className="text-[10px] text-emerald-400 ml-1">Siêu tốc</span>
              </div>
              <Clock className="w-4 h-4 text-indigo-400 opacity-80" />
            </div>

            <div
              className={`p-2 rounded-xl border flex items-center justify-between ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div>
                <span className="text-[10px] text-slate-400 block">Tâm trạng chủ đạo</span>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1 mt-0.5">
                  <span>😊</span>
                  <span>Vui vẻ (43%)</span>
                </span>
              </div>
              <Smile className="w-4 h-4 text-amber-400 opacity-80" />
            </div>
          </div>

          {/* Recharts Render Area */}
          <div
            className={`p-2 rounded-2xl border ${
              theme === 'light'
                ? 'bg-white border-slate-200'
                : theme === 'deepspace'
                ? 'bg-[#060910] border-neutral-800'
                : 'bg-slate-950/80 border-slate-800/80'
            }`}
          >
            {activeTab === 'trend' ? (
              <div>
                <div className="flex items-center justify-between px-2 pt-1 pb-1">
                  <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    Tương quan Điểm Năng Suất (Cột) & Tốc độ Phản Hồi (Đường) qua các ngày
                  </span>
                  <div className="flex items-center gap-3 text-[10px] font-mono">
                    <span className="flex items-center gap-1 text-cyan-400">
                      <span className="w-2.5 h-2.5 rounded bg-cyan-500 inline-block" />
                      Điểm (/100)
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
                      Tác Vụ Xong
                    </span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <span className="w-2.5 h-1 rounded bg-amber-400 inline-block" />
                      Tốc Độ (ms)
                    </span>
                  </div>
                </div>

                <div className="w-full h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme === 'light' ? '#e2e8f0' : '#1e293b'}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="day"
                        tick={{ fill: theme === 'light' ? '#64748b' : '#94a3b8', fontSize: 11 }}
                        stroke={theme === 'light' ? '#cbd5e1' : '#334155'}
                      />
                      <YAxis
                        yAxisId="left"
                        domain={[0, 100]}
                        tick={{ fill: theme === 'light' ? '#64748b' : '#94a3b8', fontSize: 10 }}
                        stroke={theme === 'light' ? '#cbd5e1' : '#334155'}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[200, 600]}
                        tick={{ fill: '#f59e0b', fontSize: 9 }}
                        stroke="#f59e0b"
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        yAxisId="left"
                        dataKey="productivityScore"
                        name="Điểm Năng Suất"
                        fill="#06b6d4"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={28}
                      />
                      <Bar
                        yAxisId="left"
                        dataKey="completedTasks"
                        name="Số Tác Vụ"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={16}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="responseTimeMs"
                        name="Tốc độ Phản hồi"
                        stroke="#f59e0b"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: '#f59e0b' }}
                        activeDot={{ r: 5 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between px-2 pt-1 pb-1">
                  <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    Phân Bổ Tác Vụ & Hiệu Suất Theo 4 Trạng Thái Tâm Trạng Của Hoppi
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  {/* Pie Chart */}
                  <div className="sm:col-span-5 h-44 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={moodData}
                          dataKey="tasks"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={36}
                          outerRadius={62}
                          paddingAngle={4}
                        >
                          {moodData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Mood breakdown list */}
                  <div className="sm:col-span-7 space-y-1.5 pr-2">
                    {moodData.map((item) => (
                      <div
                        key={item.mood}
                        className={`p-1.5 px-2 rounded-xl border flex items-center justify-between text-xs ${
                          theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{item.icon}</span>
                          <div>
                            <span className="font-semibold block text-[11px]">{item.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {item.tasks} tác vụ • {item.avgResponseMs}ms
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-mono font-bold text-xs" style={{ color: item.color }}>
                            {item.productivityScore}/100
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono">Hiệu suất</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
