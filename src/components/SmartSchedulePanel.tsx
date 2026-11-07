import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Plus,
  Download,
  Share2,
  RefreshCw,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Zap,
  Code2,
  ShoppingCart,
  Radio,
  Database,
  Heart,
  Bot,
  ExternalLink,
  Sliders,
  Trash2,
  Bell,
  Check,
  X,
  Layers,
  ArrowRight,
  ArrowUpDown,
  Flame,
  ShieldAlert,
} from 'lucide-react';
import {
  AppTheme,
  UserIdentity,
  ExpressiveMood,
  ScheduleEvent,
  SmartTimeBlockSuggestion,
  ScheduleCategory,
  CalendarSyncConfig,
  QuickMaintenanceTaskPreset,
  TaskPriorityTier,
} from '../types';

interface SmartSchedulePanelProps {
  theme: AppTheme;
  identity: UserIdentity;
  currentMood?: ExpressiveMood;
  onSetMood?: (mood: ExpressiveMood) => void;
  onSpeakText?: (text: string) => void;
}

// Initial seed events tailored to Nguyen Thanh Hai's Autonomous Ecosystem (October 2026)
const INITIAL_SCHEDULE_EVENTS: ScheduleEvent[] = [
  {
    id: 'evt-1',
    title: 'Code AST Engine & Sandboxed Execution',
    description: 'Kiểm định cú pháp và sandbox mã nguồn độc lập cho các micro-agent',
    category: 'code',
    dateStr: '2026-10-27', // Today (Tuesday)
    startTime: '08:30',
    endTime: '10:30',
    durationMinutes: 120,
    priority: 'high',
    taskTier: 'routine',
    isAiSuggested: true,
    aiRationale: 'Khung giờ sáng sớm có độ tập trung tối đa, lý tưởng để tinh chỉnh thuật toán AST.',
    isCompleted: true,
    syncedWithSystemCalendar: true,
    calendarSource: 'system_api',
    tags: ['Dev', 'Sandboxing', 'High-Focus'],
  },
  {
    id: 'evt-2',
    title: 'Chăm sóc Lead Zalo OA & Khách Hàng VIP',
    description: 'Rà soát pipeline và phân tích cảm xúc các hợp đồng cần chốt trong ngày',
    category: 'sales',
    dateStr: '2026-10-27', // Today
    startTime: '11:00',
    endTime: '12:00',
    durationMinutes: 60,
    priority: 'urgent',
    taskTier: 'critical',
    isAiSuggested: true,
    aiRationale: 'Khung giờ vàng 11h - 11h45 khách hàng doanh nghiệp sẵn sàng phản hồi báo giá.',
    isCompleted: false,
    syncedWithSystemCalendar: true,
    calendarSource: 'system_api',
    tags: ['CRM', 'Zalo', 'Deals'],
  },
  {
    id: 'evt-3',
    title: 'Nghỉ Trưa, Uống Nước & Phục Hồi Thị Giác',
    description: 'Tạm ngắt tiếp xúc màn hình, kích hoạt Hoppi chế độ Sleep bảo vệ thị lực',
    category: 'wellness',
    dateStr: '2026-10-27', // Today
    startTime: '12:00',
    endTime: '13:00',
    durationMinutes: 60,
    priority: 'medium',
    taskTier: 'routine',
    isAiSuggested: true,
    aiRationale: 'Hoppi tự động chặn lịch nghỉ ngơi để đảm bảo năng lượng làm việc liên tục 24/7.',
    isCompleted: false,
    syncedWithSystemCalendar: true,
    calendarSource: 'system_api',
    tags: ['Health', 'Break'],
  },
  {
    id: 'evt-4',
    title: 'Đồng bộ Tri thức Vector RAG & ChromaDB',
    description: 'Nạp dữ liệu tri thức mới từ Claude, Gemini và các tài liệu kỹ thuật',
    category: 'rag',
    dateStr: '2026-10-27', // Today
    startTime: '14:00',
    endTime: '15:30',
    durationMinutes: 90,
    priority: 'high',
    taskTier: 'routine',
    isAiSuggested: false,
    isCompleted: false,
    syncedWithSystemCalendar: true,
    calendarSource: 'system_api',
    tags: ['RAG', 'ChromaDB'],
  },
  {
    id: 'evt-5',
    title: 'Kiểm Tra Mesh P2P & LAN IoT Gateways',
    description: 'Đo lường độ trễ Home Server và xác nhận kịch bản khẩu lệnh đèn phòng khách',
    category: 'iot',
    dateStr: '2026-10-27', // Today
    startTime: '16:30',
    endTime: '17:30',
    durationMinutes: 60,
    priority: 'medium',
    taskTier: 'maintenance',
    isAiSuggested: true,
    aiRationale: 'Bảo trì gateway trước giờ cao điểm sinh hoạt gia đình.',
    isCompleted: false,
    syncedWithSystemCalendar: true,
    calendarSource: 'system_api',
    tags: ['IoT', 'Mesh'],
  },
  {
    id: 'evt-6',
    title: 'Backup Toàn Diện & Security Audit Log',
    description: 'Kiểm toán Token thiết bị tin cậy và xuất bản báo cáo an ninh mạng nội bộ',
    category: 'system',
    dateStr: '2026-10-28', // Wednesday
    startTime: '09:00',
    endTime: '10:30',
    durationMinutes: 90,
    priority: 'high',
    taskTier: 'critical',
    isAiSuggested: true,
    aiRationale: 'Bảo vệ định kỳ chuỗi khối mật mã và xác thực zero-trust.',
    isCompleted: false,
    syncedWithSystemCalendar: true,
    calendarSource: 'system_api',
    tags: ['Security', 'Backup'],
  },
  {
    id: 'evt-7',
    title: 'Họp Chiến Lược Phát Triển Doanh Nghiệp',
    description: 'Tổng kết doanh thu tuần và bàn giao phân hệ AI tự trị cho khách hàng',
    category: 'sales',
    dateStr: '2026-10-29', // Thursday
    startTime: '14:00',
    endTime: '16:00',
    durationMinutes: 120,
    priority: 'urgent',
    taskTier: 'critical',
    isAiSuggested: false,
    isCompleted: false,
    syncedWithSystemCalendar: true,
    calendarSource: 'system_api',
    tags: ['Strategy', 'Meeting'],
  },
  {
    id: 'evt-8',
    title: 'Refactor Giao Diện & Tối Ưu Tốc Độ Mesh',
    description: 'Chạy benchmark framer-motion và tối ưu hóa thời gian render timeline',
    category: 'code',
    dateStr: '2026-10-30', // Friday
    startTime: '10:00',
    endTime: '12:00',
    durationMinutes: 120,
    priority: 'medium',
    taskTier: 'maintenance',
    isAiSuggested: true,
    aiRationale: 'Hoàn tất các nâng cấp hiệu năng trước kỳ nghỉ cuối tuần.',
    isCompleted: false,
    syncedWithSystemCalendar: true,
    calendarSource: 'system_api',
    tags: ['Performance', 'Frontend'],
  },
];

const INITIAL_AI_SUGGESTIONS: SmartTimeBlockSuggestion[] = [
  {
    id: 'sug-1',
    title: 'Khối Tập Trung Chuyên Sâu: Tinh Gọn AST Parser',
    category: 'code',
    targetDate: '2026-10-28',
    startTime: '14:00',
    endTime: '15:30',
    durationMinutes: 90,
    priority: 'high',
    rationale: 'Hoppi phát hiện chiều thứ Tư có khoảng trống 2 tiếng, rất thích hợp để hoàn thiện AST sandboxing.',
    energyLevelFit: 'high_focus',
    estimatedProductivityGain: '+35% Năng suất Code',
    relatedModule: 'code',
  },
  {
    id: 'sug-2',
    title: 'Tự Động Quét & Re-engage 12 Lead Zalo Tiềm Năng',
    category: 'sales',
    targetDate: '2026-10-29',
    startTime: '09:30',
    endTime: '10:30',
    durationMinutes: 60,
    priority: 'urgent',
    rationale: 'Thời điểm đầu giờ sáng thứ Năm đạt tỷ lệ phản hồi tin nhắn báo giá cao nhất trong tuần.',
    energyLevelFit: 'moderate',
    estimatedProductivityGain: '+28% Tỷ lệ Chốt Hợp Đồng',
    relatedModule: 'sales',
  },
  {
    id: 'sug-3',
    title: 'Bảo Trì Định Kỳ Firmware Gateway LAN & Home Server',
    category: 'iot',
    targetDate: '2026-10-30',
    startTime: '16:00',
    endTime: '17:00',
    durationMinutes: 60,
    priority: 'medium',
    rationale: 'Đồng bộ kịch bản nhà thông minh và kiểm tra nhiệt độ CPU máy chủ trước hai ngày nghỉ.',
    energyLevelFit: 'chill_recovery',
    estimatedProductivityGain: 'Giảm 15ms độ trễ P2P',
    relatedModule: 'iot',
  },
];

const STORAGE_KEY_SCHEDULE = 'hoppi_smart_schedule_events_v1';
const STORAGE_KEY_SYNC = 'hoppi_calendar_sync_config_v1';

export const SmartSchedulePanel: React.FC<SmartSchedulePanelProps> = ({
  theme,
  identity,
  onSetMood,
  onSpeakText,
}) => {
  // Calendar Events State
  const [events, setEvents] = useState<ScheduleEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SCHEDULE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading schedule events:', e);
    }
    return INITIAL_SCHEDULE_EVENTS;
  });

  // AI Suggestions State
  const [suggestions, setSuggestions] = useState<SmartTimeBlockSuggestion[]>(INITIAL_AI_SUGGESTIONS);

  // Sync Config
  const [syncConfig, setSyncConfig] = useState<CalendarSyncConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SYNC);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      autoSyncEnabled: true,
      syncIntervalMinutes: 15,
      lastSyncedAt: 'Vừa xong (Tự động 2 chiều)',
      defaultReminderMinutes: 10,
      exportFormat: 'ics',
      calendarName: 'Hoppi Autonomous Executive Calendar',
      totalSyncedEvents: INITIAL_SCHEDULE_EVENTS.length,
    };
  });

  // UI States
  const [viewMode, setViewMode] = useState<'timeline' | 'daily' | 'agenda'>('timeline');
  const [selectedCategory, setSelectedCategory] = useState<ScheduleCategory | 'all'>('all');
  const [activeDate, setActiveDate] = useState<Date>(new Date('2026-10-27T00:00:00')); // Tuesday, Oct 27, 2026
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [showWebCalModal, setShowWebCalModal] = useState<boolean>(false);

  // Quick Task Floating Action Menu State
  const [isQuickTaskOpen, setIsQuickTaskOpen] = useState<boolean>(false);
  const [selectedQuickFrequency, setSelectedQuickFrequency] = useState<'hourly' | 'daily' | 'weekly' | 'monthly'>('daily');

  // Priority Tier Filter and Urgency Sorting States
  const [selectedPriorityTier, setSelectedPriorityTier] = useState<TaskPriorityTier | 'all'>('all');
  const [sortByUrgency, setSortByUrgency] = useState<boolean>(false);
  const [newEventTier, setNewEventTier] = useState<TaskPriorityTier>('routine');

  // Categorize recurring presets into 'Critical', 'Routine', and 'Maintenance'
  const MAINTENANCE_TASK_PRESETS: QuickMaintenanceTaskPreset[] = [
    {
      id: 'preset-rotate-tokens',
      title: 'Rotate TLS & Trusted Device Tokens',
      category: 'system',
      frequency: 'weekly',
      description: 'Đảo khóa mã hóa AES-256 và tái ký chứng thực Token tin cậy',
      priority: 'urgent',
      taskTier: 'critical',
      durationMinutes: 20,
      estimatedCpuLoad: '8% CPU',
    },
    {
      id: 'preset-backup-crm',
      title: 'Backup CRM Leads to Cold Storage',
      category: 'sales',
      frequency: 'daily',
      description: 'Sao lưu danh sách khách hàng Zalo OA và hợp đồng vào kho lạnh',
      priority: 'high',
      taskTier: 'critical',
      durationMinutes: 45,
      estimatedCpuLoad: '15% CPU',
    },
    {
      id: 'preset-daily-ast-sync',
      title: 'Daily AST Parser & Agent Sandbox Sync',
      category: 'code',
      frequency: 'daily',
      description: 'Kiểm định cú pháp AST và chạy kiểm thử tự động các micro-agents',
      priority: 'high',
      taskTier: 'routine',
      durationMinutes: 30,
      estimatedCpuLoad: '14% CPU',
    },
    {
      id: 'preset-lead-engagement',
      title: 'Sweep & Engage VIP Leads Zalo OA',
      category: 'sales',
      frequency: 'hourly',
      description: 'Quét phễu tư vấn và tự động phản hồi khách hàng tiềm năng 24/7',
      priority: 'high',
      taskTier: 'routine',
      durationMinutes: 25,
      estimatedCpuLoad: '9% CPU',
    },
    {
      id: 'preset-clean-vector',
      title: 'Clean Vector Cache & Vacuum Index',
      category: 'rag',
      frequency: 'daily',
      description: 'Dọn dẹp vector rác, nén embeddings ChromaDB và tái chỉ mục',
      priority: 'high',
      taskTier: 'maintenance',
      durationMinutes: 30,
      estimatedCpuLoad: '12% CPU (Home Server)',
    },
    {
      id: 'preset-vacuum-db',
      title: 'Vacuum SQLite & In-Memory Scratchpad',
      category: 'system',
      frequency: 'daily',
      description: 'Chạy VACUUM SQLite, giải phóng ổ đĩa và nén file log',
      priority: 'medium',
      taskTier: 'maintenance',
      durationMinutes: 15,
      estimatedCpuLoad: '5% CPU',
    },
    {
      id: 'preset-mesh-health',
      title: 'Health Check Mesh Nodes & IoT Gateways',
      category: 'iot',
      frequency: 'hourly',
      description: 'Gửi gói tin ping kiểm tra kết nối 5 thiết bị trong cụm mesh LAN',
      priority: 'medium',
      taskTier: 'maintenance',
      durationMinutes: 10,
      estimatedCpuLoad: '2% CPU',
    },
  ];

  // Helper function to resolve task priority tier
  const resolveEventTier = (evt: ScheduleEvent): TaskPriorityTier => {
    if (evt.taskTier) return evt.taskTier;
    if (
      evt.priority === 'urgent' ||
      evt.tags?.includes('Security') ||
      evt.tags?.includes('Deals') ||
      evt.title.toLowerCase().includes('token') ||
      evt.title.toLowerCase().includes('backup') ||
      evt.title.toLowerCase().includes('audit')
    ) {
      return 'critical';
    }
    if (
      evt.tags?.includes('QuickTask') ||
      evt.title.toLowerCase().includes('clean') ||
      evt.title.toLowerCase().includes('vacuum') ||
      evt.title.toLowerCase().includes('bảo trì') ||
      evt.title.toLowerCase().includes('health check') ||
      evt.category === 'system' ||
      evt.category === 'iot'
    ) {
      return 'maintenance';
    }
    return 'routine';
  };

  // Helper function to return visual meta and urgency ranking for each tier
  const getTaskTierMeta = (tier: TaskPriorityTier) => {
    switch (tier) {
      case 'critical':
        return {
          tier: 'critical',
          label: 'Critical',
          labelVi: 'Khẩn Cấp',
          badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/20',
          badgeText: 'text-rose-400',
          dotClass: 'bg-rose-400 animate-pulse',
          icon: <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />,
          urgencyRank: 3,
        };
      case 'routine':
        return {
          tier: 'routine',
          label: 'Routine',
          labelVi: 'Định Kỳ',
          badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20',
          badgeText: 'text-cyan-400',
          dotClass: 'bg-cyan-400',
          icon: <Clock className="w-3 h-3 text-cyan-400 shrink-0" />,
          urgencyRank: 2,
        };
      case 'maintenance':
        return {
          tier: 'maintenance',
          label: 'Maintenance',
          labelVi: 'Bảo Trì',
          badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20',
          badgeText: 'text-amber-400',
          dotClass: 'bg-amber-400',
          icon: <Zap className="w-3 h-3 text-amber-400 shrink-0" />,
          urgencyRank: 1,
        };
    }
  };

  const handleAddQuickTask = (
    preset: QuickMaintenanceTaskPreset,
    freq: 'hourly' | 'daily' | 'weekly' | 'monthly'
  ) => {
    const now = new Date();
    const startTime = `${now.getHours().toString().padStart(2, '0')}:00`;
    const endHour = (now.getHours() + Math.max(1, Math.ceil(preset.durationMinutes / 60))) % 24;
    const endTime = `${endHour.toString().padStart(2, '0')}:${(preset.durationMinutes % 60).toString().padStart(2, '0')}`;
    const freqLabel =
      freq === 'hourly'
        ? 'Mỗi giờ'
        : freq === 'daily'
        ? 'Hàng ngày'
        : freq === 'weekly'
        ? 'Hàng tuần'
        : 'Hàng tháng';

    const newEvent: ScheduleEvent = {
      id: `quick-${Date.now()}`,
      title: `[${freqLabel}] ${preset.title}`,
      description: `${preset.description} - Lặp lại: ${freq.toUpperCase()} (${preset.estimatedCpuLoad})`,
      category: preset.category,
      dateStr: activeDate.toISOString().split('T')[0],
      startTime,
      endTime,
      durationMinutes: preset.durationMinutes,
      priority: preset.priority,
      taskTier: preset.taskTier || 'maintenance',
      isAiSuggested: true,
      aiRationale: `Tác vụ bảo trì định kỳ (${freqLabel}) đảm bảo hệ sinh thái Hoppi tự vận hành trơn tru 24/7.`,
      isCompleted: false,
      syncedWithSystemCalendar: true,
      calendarSource: 'system_api',
      tags: ['QuickTask', freq, preset.category.toUpperCase()],
    };

    setEvents((prev) => [newEvent, ...prev]);
    setIsQuickTaskOpen(false);
    setSyncSuccessMsg(`Đã tạo tác vụ định kỳ "${preset.title}" (${freqLabel} - ${getTaskTierMeta(preset.taskTier || 'maintenance').labelVi}) thành công!`);
    setTimeout(() => setSyncSuccessMsg(null), 3500);

    if (onSpeakText) {
      onSpeakText(`Hoppi đã lên lịch ${preset.title} tần suất ${freqLabel} phân nhóm ${getTaskTierMeta(preset.taskTier || 'maintenance').labelVi} thành công.`);
    }
  };

  // Form state for creating new event
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<ScheduleCategory>('code');
  const [newEventDate, setNewEventDate] = useState('2026-10-27');
  const [newEventStartTime, setNewEventStartTime] = useState('09:00');
  const [newEventEndTime, setNewEventEndTime] = useState('10:00');
  const [newEventPriority, setNewEventPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('high');
  const [newEventDesc, setNewEventDesc] = useState('');

  // Persist events to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SCHEDULE, JSON.stringify(events));
      // Broadcast update across mesh tabs
      const channel = new BroadcastChannel('hoppi_device_mesh_channel');
      channel.postMessage({ type: 'HOPPI_SCHEDULE_UPDATED', count: events.length });
      channel.close();
    } catch (e) {
      console.error(e);
    }
  }, [events]);

  // Save sync config
  const updateSyncConfig = (patch: Partial<CalendarSyncConfig>) => {
    setSyncConfig((prev) => {
      const updated = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY_SYNC, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Calculate dates of the current week (Monday to Sunday)
  const currentWeekDays = useMemo(() => {
    const curr = new Date(activeDate);
    const day = curr.getDay();
    const diff = curr.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(curr.setDate(diff));

    const week: { date: Date; dateStr: string; dayName: string; isToday: boolean }[] = [];
    const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];

    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      const yyyy = nextDay.getFullYear();
      const mm = String(nextDay.getMonth() + 1).padStart(2, '0');
      const dd = String(nextDay.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const isToday = dateStr === '2026-10-27';

      week.push({
        date: nextDay,
        dateStr,
        dayName: dayNames[i],
        isToday,
      });
    }
    return week;
  }, [activeDate]);

  // Filtered and sorted events
  const filteredEvents = useMemo(() => {
    const list = events.filter((evt) => {
      if (selectedCategory !== 'all' && evt.category !== selectedCategory) return false;
      const tier = resolveEventTier(evt);
      if (selectedPriorityTier !== 'all' && tier !== selectedPriorityTier) return false;
      return true;
    });

    if (sortByUrgency) {
      return [...list].sort((a, b) => {
        const rankA = getTaskTierMeta(resolveEventTier(a)).urgencyRank;
        const rankB = getTaskTierMeta(resolveEventTier(b)).urgencyRank;
        if (rankB !== rankA) {
          return rankB - rankA; // 3 (Critical) -> 2 (Routine) -> 1 (Maintenance)
        }
        return a.startTime.localeCompare(b.startTime);
      });
    }

    return list;
  }, [events, selectedCategory, selectedPriorityTier, sortByUrgency]);

  // Compute counts for each Priority Tier
  const tierCounts = useMemo(() => {
    const counts = { critical: 0, routine: 0, maintenance: 0 };
    events.forEach((evt) => {
      const tier = resolveEventTier(evt);
      counts[tier] = (counts[tier] || 0) + 1;
    });
    return counts;
  }, [events]);

  // Timeline hours from 07:00 to 21:00
  const hoursList = useMemo(() => {
    const list: string[] = [];
    for (let h = 7; h <= 21; h++) {
      list.push(`${String(h).padStart(2, '0')}:00`);
    }
    return list;
  }, []);

  // Category styles and icons mapping
  const getCategoryMeta = (cat: ScheduleCategory) => {
    switch (cat) {
      case 'code':
        return {
          label: 'Lập Trình Code Agent',
          icon: <Code2 className="w-3.5 h-3.5 text-cyan-400" />,
          colorClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:border-cyan-400',
          dotColor: 'bg-cyan-400',
        };
      case 'sales':
        return {
          label: 'Kinh Doanh & CRM',
          icon: <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />,
          colorClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:border-emerald-400',
          dotColor: 'bg-emerald-400',
        };
      case 'iot':
        return {
          label: 'Nhà Thông Minh & IoT',
          icon: <Radio className="w-3.5 h-3.5 text-amber-400" />,
          colorClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:border-amber-400',
          dotColor: 'bg-amber-400',
        };
      case 'rag':
        return {
          label: 'Bộ Nhớ Vector RAG',
          icon: <Database className="w-3.5 h-3.5 text-purple-400" />,
          colorClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:border-purple-400',
          dotColor: 'bg-purple-400',
        };
      case 'wellness':
        return {
          label: 'Nghỉ Ngơi & Thị Giác',
          icon: <Heart className="w-3.5 h-3.5 text-rose-400" />,
          colorClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:border-rose-400',
          dotColor: 'bg-rose-400',
        };
      case 'system':
      default:
        return {
          label: 'Hệ Thống & Bảo Mật',
          icon: <Zap className="w-3.5 h-3.5 text-indigo-400" />,
          colorClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 hover:border-indigo-400',
          dotColor: 'bg-indigo-400',
        };
    }
  };

  // Convert time string "HH:mm" to minutes from 07:00
  const getMinutesFromStart = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return Math.max(0, (h - 7) * 60 + m);
  };

  // Calculate event card top position and height
  const getEventPositionStyles = (startTime: string, endTime: string) => {
    const startMins = getMinutesFromStart(startTime);
    const endMins = getMinutesFromStart(endTime);
    const duration = Math.max(30, endMins - startMins);

    // Each hour is 54px high => 1 min is 0.9px
    const topPx = (startMins / 60) * 54;
    const heightPx = Math.max(28, (duration / 60) * 54);

    return {
      top: `${topPx}px`,
      height: `${heightPx}px`,
    };
  };

  // Toggle event completion
  const handleToggleComplete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEvents((prev) =>
      prev.map((evt) => (evt.id === id ? { ...evt, isCompleted: !evt.isCompleted } : evt))
    );
  };

  // Delete event
  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((evt) => evt.id !== id));
    if (selectedEvent?.id === id) setSelectedEvent(null);
  };

  // Create new event handler
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const [sh, sm] = newEventStartTime.split(':').map(Number);
    const [eh, em] = newEventEndTime.split(':').map(Number);
    const duration = (eh * 60 + em) - (sh * 60 + sm);

    const created: ScheduleEvent = {
      id: `evt-${Date.now()}`,
      title: newEventTitle,
      description: newEventDesc || 'Tác vụ do Chủ nhân Nguyễn Thanh Hải lên lịch',
      category: newEventCategory,
      dateStr: newEventDate,
      startTime: newEventStartTime,
      endTime: newEventEndTime,
      durationMinutes: duration > 0 ? duration : 60,
      priority: newEventPriority,
      taskTier: newEventTier,
      isAiSuggested: false,
      isCompleted: false,
      syncedWithSystemCalendar: true,
      calendarSource: 'system_api',
    };

    setEvents((prev) => [...prev, created]);
    setIsCreateModalOpen(false);
    setNewEventTitle('');
    setNewEventDesc('');
    setNewEventTier('routine');

    if (onSetMood) onSetMood('happy');
    if (onSpeakText) {
      onSpeakText(`Hoppi đã thêm khối thời gian "${created.title}" vào lịch tuần của Chủ nhân.`);
    }
  };

  // Accept a smart suggestion
  const handleAcceptSuggestion = (sug: SmartTimeBlockSuggestion) => {
    const newEvent: ScheduleEvent = {
      id: `evt-${Date.now()}`,
      title: sug.title,
      description: sug.rationale,
      category: sug.category,
      dateStr: sug.targetDate,
      startTime: sug.startTime,
      endTime: sug.endTime,
      durationMinutes: sug.durationMinutes,
      priority: sug.priority,
      isAiSuggested: true,
      aiRationale: sug.rationale,
      isCompleted: false,
      syncedWithSystemCalendar: true,
      calendarSource: 'system_api',
    };

    setEvents((prev) => [...prev, newEvent]);
    setSuggestions((prev) => prev.filter((s) => s.id !== sug.id));

    if (onSetMood) onSetMood('focused');
    if (onSpeakText) {
      onSpeakText(`Hoppi đã chấp nhận đề xuất "${sug.title}" vào lịch ngày ${sug.targetDate}.`);
    }
  };

  // Accept all suggestions
  const handleAcceptAllSuggestions = () => {
    const createdEvents: ScheduleEvent[] = suggestions.map((sug, idx) => ({
      id: `evt-${Date.now()}-${idx}`,
      title: sug.title,
      description: sug.rationale,
      category: sug.category,
      dateStr: sug.targetDate,
      startTime: sug.startTime,
      endTime: sug.endTime,
      durationMinutes: sug.durationMinutes,
      priority: sug.priority,
      isAiSuggested: true,
      aiRationale: sug.rationale,
      isCompleted: false,
      syncedWithSystemCalendar: true,
      calendarSource: 'system_api',
    }));

    setEvents((prev) => [...prev, ...createdEvents]);
    setSuggestions([]);

    if (onSetMood) onSetMood('happy');
    if (onSpeakText) {
      onSpeakText(
        `Tuyệt vời! Hoppi đã tự động xếp toàn bộ các khối thời gian thông minh vào lịch làm việc tuần này của anh Hải.`
      );
    }
  };

  // Regenerate suggestions
  const handleRegenerateSuggestions = () => {
    const fresh: SmartTimeBlockSuggestion[] = [
      {
        id: `sug-${Date.now()}-1`,
        title: '🎯 Sprint Lập Trình: Tích Hợp WebCal Feed 2 Chiều',
        category: 'code',
        targetDate: '2026-10-28',
        startTime: '10:00',
        endTime: '11:30',
        durationMinutes: 90,
        priority: 'high',
        rationale: 'Hoppi tối ưu hóa giao thức iCalendar để các thiết bị iOS/macOS cập nhật tự động.',
        energyLevelFit: 'high_focus',
        estimatedProductivityGain: '+40% Hiệu suất',
        relatedModule: 'code',
      },
      {
        id: `sug-${Date.now()}-2`,
        title: '💼 Báo Cáo Doanh Thu Zalo OA & CRM VIP Lead',
        category: 'sales',
        targetDate: '2026-10-29',
        startTime: '15:00',
        endTime: '16:00',
        durationMinutes: 60,
        priority: 'urgent',
        rationale: 'Thời điểm thích hợp để chốt hợp đồng và gửi hóa đơn điện tử cho đối tác.',
        energyLevelFit: 'moderate',
        estimatedProductivityGain: '+25% Tốc độ ký kết',
        relatedModule: 'sales',
      },
      {
        id: `sug-${Date.now()}-3`,
        title: '☕ Hoppi Care: Tản Bộ & Thư Giãn Não Bộ 30 Phút',
        category: 'wellness',
        targetDate: '2026-10-27',
        startTime: '17:30',
        endTime: '18:00',
        durationMinutes: 30,
        priority: 'medium',
        rationale: 'Sau 4 tiếng code liên tục, 30 phút nghỉ ngơi giúp duy trì năng lượng cho buổi tối.',
        energyLevelFit: 'chill_recovery',
        estimatedProductivityGain: 'Phục hồi 100% thị giác',
        relatedModule: 'chat',
      },
    ];

    setSuggestions(fresh);
    if (onSetMood) onSetMood('curious');
    if (onSpeakText) {
      onSpeakText('Hoppi đã phân tích lại nhịp sinh học và tạo 3 khối thời gian mới cho Chủ nhân!');
    }
  };

  // System Calendar API Sync Trigger (RFC 5545 iCalendar format generator)
  const handleTriggerSystemCalendarSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const timestamp = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      updateSyncConfig({
        lastSyncedAt: `Đã đồng bộ lúc ${timestamp}`,
        totalSyncedEvents: events.length,
      });
      setSyncSuccessMsg(`Đã đồng bộ ${events.length} sự kiện với System Calendar API.`);
      setTimeout(() => setSyncSuccessMsg(null), 3000);

      if (onSpeakText) {
        onSpeakText(`Lịch thông minh Hoppi đã đồng bộ thành công toàn bộ ${events.length} sự kiện với hệ thống.`);
      }
    }, 900);
  };

  // Export RFC 5545 (.ics) file ready for Apple Calendar, Google Calendar, Outlook
  const handleExportICS = () => {
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Hoppi AI Studio//Smart Schedule Engine v4.0//VI',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Lịch Làm Việc Thông Minh Hoppi (Nguyễn Thanh Hải)',
      'X-WR-TIMEZONE:Asia/Ho_Chi_Minh',
    ];

    events.forEach((evt) => {
      const dateNoDash = evt.dateStr.replace(/-/g, '');
      const startNoColon = evt.startTime.replace(':', '') + '00';
      const endNoColon = evt.endTime.replace(':', '') + '00';

      icsContent.push('BEGIN:VEVENT');
      icsContent.push(`UID:${evt.id}@hoppi.local`);
      icsContent.push(`DTSTAMP:${dateNoDash}T${startNoColon}Z`);
      icsContent.push(`DTSTART:${dateNoDash}T${startNoColon}`);
      icsContent.push(`DTEND:${dateNoDash}T${endNoColon}`);
      icsContent.push(`SUMMARY:${evt.title}`);
      icsContent.push(
        `DESCRIPTION:${evt.description || ''}${evt.aiRationale ? ` (Hoppi AI Rationale: ${evt.aiRationale})` : ''}`
      );
      icsContent.push(`CATEGORIES:${evt.category.toUpperCase()}`);
      icsContent.push(`STATUS:${evt.isCompleted ? 'COMPLETED' : 'CONFIRMED'}`);
      icsContent.push('BEGIN:VALARM');
      icsContent.push('TRIGGER:-PT10M');
      icsContent.push('ACTION:DISPLAY');
      icsContent.push('DESCRIPTION:Hoppi nhắc nhở thời gian thực thi tác vụ');
      icsContent.push('END:VALARM');
      icsContent.push('END:VEVENT');
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `hoppi-schedule-${new Date().toISOString().slice(0, 10)}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onSpeakText) {
      onSpeakText('Đã xuất file lịch chuẩn iCalendar để đồng bộ trực tiếp với ứng dụng Lịch của thiết bị!');
    }
  };

  // Google Calendar one-click web intent link
  const getGoogleCalendarUrl = (evt: ScheduleEvent) => {
    const startIso = `${evt.dateStr.replace(/-/g, '')}T${evt.startTime.replace(':', '')}00`;
    const endIso = `${evt.dateStr.replace(/-/g, '')}T${evt.endTime.replace(':', '')}00`;
    const details = encodeURIComponent(
      `${evt.description || ''}\n\n[Lên lịch bởi Hoppi AI Autonomous Agent]`
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      evt.title
    )}&dates=${startIso}/${endIso}&details=${details}&location=Hoppi+Mesh+Workspace`;
  };

  // Web notification permission request
  const handleRequestNotificationPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        new Notification('Hoppi Smart Schedule', {
          body: 'Đã kích hoạt đồng bộ thông báo thời gian thực trước 10 phút!',
          icon: '/favicon.ico',
        });
      }
    }
  };

  return (
    <div
      className={`h-full rounded-2xl border flex flex-col overflow-hidden shadow-xl transition-all ${
        theme === 'light'
          ? 'bg-white border-slate-200 text-slate-800'
          : theme === 'deepspace'
          ? 'bg-[#090d16] border-neutral-800 text-slate-100 shadow-indigo-950/20'
          : 'bg-slate-950 border-cyan-500/30 text-slate-100 shadow-cyan-500/10'
      }`}
    >
      {/* 1. Header Toolbar */}
      <div
        className={`p-3.5 sm:p-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0 ${
          theme === 'light'
            ? 'bg-slate-50 border-slate-200'
            : theme === 'deepspace'
            ? 'bg-[#07090f] border-neutral-800'
            : 'bg-slate-900/80 border-slate-800'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm sm:text-base tracking-tight flex items-center gap-1.5">
                <span>Smart Schedule & Time Blocks</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">
                  System API Sync
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Hoppi phân bổ khối thời gian tối ưu, loại trừ trùng lặp và đồng bộ 2 chiều với lịch hệ thống
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* System API Sync Status Chip */}
          <button
            type="button"
            onClick={handleTriggerSystemCalendarSync}
            disabled={isSyncing}
            title="Đồng bộ ngay với System Calendar APIs (Apple Calendar, Google Calendar, Outlook)"
            className={`px-3 py-1.5 rounded-xl border font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
              isSyncing
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 animate-pulse'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">
              {isSyncing ? 'Đang đồng bộ API...' : syncConfig.lastSyncedAt || 'Đồng bộ Lịch'}
            </span>
          </button>

          {/* Export .ICS */}
          <button
            type="button"
            onClick={handleExportICS}
            title="Tải file .ics chuẩn RFC 5545 để mở trên ứng dụng Lịch macOS / iOS / Windows"
            className="px-2.5 py-1.5 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-900 text-slate-300 hover:text-white font-medium flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Xuất .ICS</span>
          </button>

          {/* WebCal modal toggle */}
          <button
            type="button"
            onClick={() => setShowWebCalModal(true)}
            title="Xem liên kết WebCal / CalDAV tự động đăng ký vào lịch máy tính"
            className="px-2.5 py-1.5 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-900 text-slate-300 hover:text-white font-medium flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">WebCal Feed</span>
          </button>

          {/* Add Event Modal Trigger */}
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 cursor-pointer shadow-sm shadow-cyan-500/20 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Thêm Khối Thời Gian</span>
          </button>
        </div>
      </div>

      {/* 2. Notification Toast if sync success */}
      <AnimatePresence>
        {syncSuccessMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-emerald-500/15 border-b border-emerald-500/30 px-4 py-2 flex items-center justify-between text-xs text-emerald-300 font-medium"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{syncSuccessMsg}</span>
            </div>
            <button
              onClick={() => setSyncSuccessMsg(null)}
              className="text-emerald-400 hover:text-emerald-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Hoppi AI Smart Time Block Suggestions Drawer */}
      {suggestions.length > 0 && (
        <div
          className={`p-3.5 border-b shrink-0 ${
            theme === 'light'
              ? 'bg-amber-50/70 border-amber-200'
              : 'bg-gradient-to-r from-amber-950/20 via-slate-900/60 to-cyan-950/20 border-amber-500/25'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-amber-500/20 text-amber-400">
                <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <span>Hoppi AI Gợi Ý Phân Bổ Thời Gian Thông Minh</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                  {suggestions.length} đề xuất
                </span>
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRegenerateSuggestions}
                title="Yêu cầu Hoppi phân tích lại lịch trình và nhịp sinh học"
                className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 font-medium cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Tạo lại</span>
              </button>

              <button
                type="button"
                onClick={handleAcceptAllSuggestions}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1 cursor-pointer transition-all"
              >
                <Check className="w-3 h-3 stroke-[3]" />
                <span>Chấp nhận tất cả</span>
              </button>
            </div>
          </div>

          {/* Suggestion Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            {suggestions.map((sug) => {
              const meta = getCategoryMeta(sug.category);
              return (
                <div
                  key={sug.id}
                  className={`p-2.5 rounded-xl border flex flex-col justify-between gap-1.5 transition-all ${
                    theme === 'light'
                      ? 'bg-white border-amber-200 shadow-sm'
                      : 'bg-slate-900/90 border-amber-500/30 hover:border-amber-400/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-black/40 text-slate-300 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-cyan-400" />
                        {sug.targetDate.slice(5)} • {sug.startTime} - {sug.endTime}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold">{sug.estimatedProductivityGain}</span>
                    </div>

                    <h5 className="font-semibold text-xs text-slate-100 mt-1 flex items-center gap-1.5">
                      {meta.icon}
                      <span className="truncate">{sug.title}</span>
                    </h5>

                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{sug.rationale}</p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                    <span className="text-[10px] text-amber-300/80 font-mono uppercase">
                      Fit: {sug.energyLevelFit.replace('_', ' ')}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAcceptSuggestion(sug)}
                      className="px-2 py-0.5 rounded-md bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/40 text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>Thêm vào Lịch</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Controls Bar (Week Navigation & Category Filters & View Mode) */}
      <div
        className={`px-3.5 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 ${
          theme === 'light'
            ? 'bg-slate-100/60 border-slate-200'
            : theme === 'deepspace'
            ? 'bg-[#090d16] border-neutral-800'
            : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        {/* Week Navigator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-slate-700/60 rounded-xl overflow-hidden bg-slate-900">
            <button
              type="button"
              onClick={() => {
                const prev = new Date(activeDate);
                prev.setDate(prev.getDate() - 7);
                setActiveDate(prev);
              }}
              className="p-1.5 hover:bg-slate-800 text-slate-300 cursor-pointer transition-colors"
              title="Tuần trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveDate(new Date('2026-10-27T00:00:00'))}
              className="px-2.5 py-1 text-xs font-semibold hover:bg-slate-800 text-cyan-300 border-x border-slate-800 cursor-pointer transition-colors"
            >
              Tuần Hiện Tại (Th10 2026)
            </button>
            <button
              type="button"
              onClick={() => {
                const next = new Date(activeDate);
                next.setDate(next.getDate() + 7);
                setActiveDate(next);
              }}
              className="p-1.5 hover:bg-slate-800 text-slate-300 cursor-pointer transition-colors"
              title="Tuần sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="font-mono text-[11px] text-slate-400 hidden sm:inline">
            {currentWeekDays[0]?.dateStr} → {currentWeekDays[6]?.dateStr}
          </span>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {(
            [
              { id: 'all', label: 'Tất cả' },
              { id: 'code', label: 'Code' },
              { id: 'sales', label: 'Sales CRM' },
              { id: 'iot', label: 'IoT LAN' },
              { id: 'rag', label: 'RAG' },
              { id: 'wellness', label: 'Sức Khỏe' },
              { id: 'system', label: 'Hệ Thống' },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Priority Tier Filter (Critical, Routine, Maintenance) */}
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] overflow-x-auto no-scrollbar">
          <span className="text-[10px] text-slate-500 font-semibold px-2 uppercase tracking-wider hidden lg:inline">
            Ưu Tiên:
          </span>
          <button
            type="button"
            onClick={() => setSelectedPriorityTier('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              selectedPriorityTier === 'all'
                ? 'bg-slate-700 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tất Cả ({events.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedPriorityTier('critical')}
            className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              selectedPriorityTier === 'critical'
                ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40 font-bold shadow-sm'
                : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span>Critical ({tierCounts.critical})</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedPriorityTier('routine')}
            className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              selectedPriorityTier === 'routine'
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm'
                : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Routine ({tierCounts.routine})</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedPriorityTier('maintenance')}
            className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              selectedPriorityTier === 'maintenance'
                ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 font-bold shadow-sm'
                : 'text-slate-400 hover:text-amber-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Maintenance ({tierCounts.maintenance})</span>
          </button>
        </div>

        {/* Urgency Sorting Toggle Button */}
        <button
          type="button"
          onClick={() => {
            const next = !sortByUrgency;
            setSortByUrgency(next);
            if (onSpeakText) {
              onSpeakText(
                next
                  ? 'Đã bật sắp xếp theo mức độ khẩn cấp: Khẩn cấp lên đầu, tiếp đến định kỳ và bảo trì.'
                  : 'Đã hoàn tất chuyển về sắp xếp theo khung thời gian ban đầu.'
              );
            }
          }}
          title={
            sortByUrgency
              ? 'Đang sắp xếp: Critical → Routine → Maintenance. Bấm để xếp lại theo thời gian'
              : 'Bật sắp xếp theo mức độ khẩn cấp (Critical → Routine → Maintenance)'
          }
          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            sortByUrgency
              ? 'bg-rose-500/20 border-rose-500/45 text-rose-300 shadow-sm shadow-rose-500/20'
              : 'bg-slate-900 border-slate-700/80 text-slate-400 hover:text-white'
          }`}
        >
          <ArrowUpDown className={`w-3.5 h-3.5 ${sortByUrgency ? 'text-rose-400' : 'text-slate-400'}`} />
          <span>{sortByUrgency ? 'Đang Xếp: Độ Khẩn Cấp' : 'Xếp Theo Giờ'}</span>
          {sortByUrgency && (
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping inline-block" />
          )}
        </button>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-slate-700/60">
          <button
            type="button"
            onClick={() => setViewMode('timeline')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              viewMode === 'timeline'
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Lịch Tuần (Timeline)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('agenda')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              viewMode === 'agenda'
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Danh Sách (Agenda)
          </button>
        </div>
      </div>

      {/* 5. Main Calendar Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-auto relative no-scrollbar">
        {viewMode === 'timeline' ? (
          /* Weekly Timeline Grid */
          <div className="min-w-[850px] flex flex-col h-full">
            {/* Days Column Header */}
            <div
              className={`sticky top-0 z-20 grid grid-cols-8 border-b text-xs font-semibold ${
                theme === 'light'
                  ? 'bg-slate-100 border-slate-300 text-slate-700'
                  : 'bg-slate-950/95 border-slate-800 text-slate-300 backdrop-blur-md'
              }`}
            >
              {/* Hour corner */}
              <div className="p-2.5 border-r border-slate-800 text-center text-slate-500 font-mono text-[11px]">
                Giờ \ Thứ
              </div>

              {/* 7 Day Headers */}
              {currentWeekDays.map((day) => (
                <div
                  key={day.dateStr}
                  className={`p-2 text-center border-r border-slate-800 last:border-r-0 transition-colors ${
                    day.isToday
                      ? 'bg-cyan-500/10 text-cyan-300 border-b-2 border-b-cyan-400 font-bold'
                      : ''
                  }`}
                >
                  <div className="text-[11px] uppercase tracking-wider">{day.dayName}</div>
                  <div className="text-sm font-mono mt-0.5 flex items-center justify-center gap-1">
                    <span>{day.date.getDate()}</span>
                    {day.isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Time Grid with 15 hour rows & 7 columns */}
            <div className="relative flex-1 grid grid-cols-8 divide-x divide-slate-800/80">
              {/* Hour Labels Column */}
              <div className="flex flex-col">
                {hoursList.map((hour) => (
                  <div
                    key={hour}
                    className="h-[54px] border-b border-slate-800/50 text-[10.5px] font-mono text-slate-500 flex items-start justify-center pt-1"
                  >
                    {hour}
                  </div>
                ))}
              </div>

              {/* 7 Day Columns with Event Time Blocks */}
              {currentWeekDays.map((day) => {
                const dayEvents = filteredEvents.filter((e) => e.dateStr === day.dateStr);

                return (
                  <div
                    key={day.dateStr}
                    className={`relative h-[810px] ${
                      day.isToday ? 'bg-cyan-500/[0.02]' : ''
                    }`}
                  >
                    {/* Background hour grid lines */}
                    {hoursList.map((hour) => (
                      <div
                        key={hour}
                        className="h-[54px] border-b border-slate-800/40 pointer-events-none"
                      />
                    ))}

                    {/* Today current time laser pulse line */}
                    {day.isToday && (
                      <div
                        className="absolute left-0 right-0 z-10 pointer-events-none flex items-center"
                        style={{ top: '185px' }} // Approx 10:25 AM
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping -ml-1" />
                        <div className="h-[2px] flex-1 bg-cyan-400 shadow-sm shadow-cyan-400" />
                      </div>
                    )}

                    {/* Event Blocks */}
                    {dayEvents.map((evt) => {
                      const pos = getEventPositionStyles(evt.startTime, evt.endTime);
                      const meta = getCategoryMeta(evt.category);
                      const tier = resolveEventTier(evt);
                      const tierMeta = getTaskTierMeta(tier);

                      return (
                        <div
                          key={evt.id}
                          onClick={() => setSelectedEvent(evt)}
                          style={{ top: pos.top, height: pos.height }}
                          className={`absolute left-1 right-1 rounded-xl p-1.5 border text-xs overflow-hidden cursor-pointer shadow-sm transition-all hover:scale-[1.02] hover:z-20 ${
                            meta.colorClass
                          } ${evt.isCompleted ? 'opacity-60 saturate-50' : ''}`}
                        >
                          <div className="flex items-start justify-between gap-1 leading-tight">
                            <div className="flex items-center gap-1 font-semibold text-[11px] truncate">
                              <span
                                onClick={(e) => handleToggleComplete(evt.id, e)}
                                className="cursor-pointer hover:text-emerald-400"
                              >
                                {evt.isCompleted ? (
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Circle className="w-3 h-3 text-slate-400" />
                                )}
                              </span>
                              <span className={`truncate ${evt.isCompleted ? 'line-through' : ''}`}>
                                {evt.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {/* Color-coded Priority Tier Badge */}
                              <span
                                className={`text-[8.5px] font-bold px-1 py-0.2 rounded-md border flex items-center gap-0.5 ${tierMeta.badgeClass}`}
                                title={`Nhóm ưu tiên: ${tierMeta.labelVi} (${tierMeta.label})`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${tierMeta.dotClass}`} />
                                <span className="hidden xl:inline">{tierMeta.label}</span>
                              </span>

                              {evt.isAiSuggested && (
                                <span title="Đề xuất bởi Hoppi AI">
                                  <Sparkles className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-[10px] opacity-80 font-mono mt-0.5">
                            <span>{evt.startTime} - {evt.endTime}</span>
                          </div>

                          {/* Quick description snippet if height allows */}
                          {evt.durationMinutes >= 60 && evt.description && (
                            <p className="text-[9.5px] opacity-75 line-clamp-1 mt-0.5">
                              {evt.description}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Agenda / List View */
          <div className="p-4 space-y-4 max-w-4xl mx-auto">
            {currentWeekDays.map((day) => {
              const dayEvents = filteredEvents.filter((e) => e.dateStr === day.dateStr);
              if (dayEvents.length === 0) return null;

              return (
                <div
                  key={day.dateStr}
                  className={`p-3.5 rounded-2xl border ${
                    theme === 'light'
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-cyan-400">{day.dayName}</span>
                      <span className="font-mono text-xs text-slate-400">({day.dateStr})</span>
                      {day.isToday && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                          Hôm nay
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">{dayEvents.length} khối công việc</span>
                  </div>

                  <div className="space-y-2">
                    {dayEvents.map((evt) => {
                      const meta = getCategoryMeta(evt.category);
                      const tier = resolveEventTier(evt);
                      const tierMeta = getTaskTierMeta(tier);
                      return (
                        <div
                          key={evt.id}
                          onClick={() => setSelectedEvent(evt)}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all hover:bg-slate-800/40 ${
                            meta.colorClass
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={(e) => handleToggleComplete(evt.id, e)}
                              className="text-slate-400 hover:text-emerald-400"
                            >
                              {evt.isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Circle className="w-4 h-4" />
                              )}
                            </button>

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`font-semibold text-xs sm:text-sm ${evt.isCompleted ? 'line-through opacity-70' : ''}`}>
                                  {evt.title}
                                </span>

                                {/* Priority Tier Badge */}
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${tierMeta.badgeClass}`}
                                  title={`Phân nhóm ưu tiên: ${tierMeta.labelVi}`}
                                >
                                  {tierMeta.icon}
                                  <span>{tierMeta.label}</span>
                                  <span className="opacity-75">({tierMeta.labelVi})</span>
                                </span>

                                {evt.isAiSuggested && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-medium flex items-center gap-1 border border-amber-500/30">
                                    <Sparkles className="w-2.5 h-2.5" />
                                    AI Block
                                  </span>
                                )}
                              </div>
                              <p className="text-xs opacity-80 mt-0.5">{evt.description}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-black/30 border border-white/5">
                              {evt.startTime} - {evt.endTime} ({evt.durationMinutes}p)
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className={`relative w-full max-w-lg p-5 rounded-2xl border shadow-2xl z-10 space-y-4 ${
                theme === 'light'
                  ? 'bg-white border-slate-300 text-slate-800'
                  : 'bg-slate-950 border-cyan-500/40 text-slate-100'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                    {getCategoryMeta(selectedEvent.category).icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg">{selectedEvent.title}</h3>
                    <p className="text-xs text-slate-400">
                      {getCategoryMeta(selectedEvent.category).label} • {selectedEvent.dateStr}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Time & Priority Badges */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-black/30 border border-slate-700 font-mono text-cyan-300 flex items-center gap-1.5 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedEvent.startTime} - {selectedEvent.endTime} ({selectedEvent.durationMinutes} phút)
                </span>

                {/* Priority Tier Badge */}
                {(() => {
                  const tMeta = getTaskTierMeta(resolveEventTier(selectedEvent));
                  return (
                    <span
                      className={`px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5 border ${tMeta.badgeClass}`}
                    >
                      {tMeta.icon}
                      <span>Nhóm: {tMeta.label} ({tMeta.labelVi})</span>
                    </span>
                  );
                })()}

                <span
                  className={`px-2.5 py-1 rounded-lg font-bold uppercase text-[10px] ${
                    selectedEvent.priority === 'urgent'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : selectedEvent.priority === 'high'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Ưu tiên: {selectedEvent.priority}
                </span>

                {selectedEvent.syncedWithSystemCalendar && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Đã đồng bộ System Calendar
                  </span>
                )}
              </div>

              {/* Description */}
              {selectedEvent.description && (
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                  <span className="text-slate-500 font-mono block mb-1">Mô tả tác vụ:</span>
                  {selectedEvent.description}
                </div>
              )}

              {/* Hoppi AI Rationale */}
              {selectedEvent.aiRationale && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Lý giải phân bổ Hoppi AI:</span>
                    {selectedEvent.aiRationale}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleToggleComplete(selectedEvent.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                    selectedEvent.isCompleted
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm shadow-emerald-500/20'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{selectedEvent.isCompleted ? 'Đánh dấu chưa xong' : 'Hoàn thành tác vụ'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={getGoogleCalendarUrl(selectedEvent)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Mở Google Cal</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                    className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 cursor-pointer"
                    title="Xóa sự kiện"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. Create Event Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className={`relative w-full max-w-lg p-5 rounded-2xl border shadow-2xl z-10 space-y-4 ${
                theme === 'light'
                  ? 'bg-white border-slate-300 text-slate-800'
                  : 'bg-slate-950 border-cyan-500/40 text-slate-100'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Plus className="w-4 h-4 text-cyan-400" />
                  <span>Tạo Khối Thời Gian Lịch Biểu Mới</span>
                </h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Tiêu đề tác vụ / Khối thời gian *</label>
                  <input
                    type="text"
                    required
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="Ví dụ: Lập trình refactor AST Sandboxing..."
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Phân hệ / Danh mục</label>
                    <select
                      value={newEventCategory}
                      onChange={(e) => setNewEventCategory(e.target.value as ScheduleCategory)}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-400 cursor-pointer text-xs"
                    >
                      <option value="code">💻 Code Agent</option>
                      <option value="sales">💼 Sales CRM</option>
                      <option value="iot">⚡ Smart IoT</option>
                      <option value="rag">🧠 Bộ Nhớ RAG</option>
                      <option value="wellness">🧘 Sức Khỏe</option>
                      <option value="system">🛡️ Hệ Thống</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Nhóm Ưu Tiên (Tier)</label>
                    <select
                      value={newEventTier}
                      onChange={(e) => setNewEventTier(e.target.value as TaskPriorityTier)}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-400 cursor-pointer text-xs font-semibold"
                    >
                      <option value="critical">🔴 Critical (Khẩn Cấp)</option>
                      <option value="routine">🔷 Routine (Định Kỳ)</option>
                      <option value="maintenance">🔶 Maintenance (Bảo Trì)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Mức Độ Ưu Tiên</label>
                    <select
                      value={newEventPriority}
                      onChange={(e) => setNewEventPriority(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-400 cursor-pointer text-xs"
                    >
                      <option value="low">Thấp (Low)</option>
                      <option value="medium">Trung bình (Medium)</option>
                      <option value="high">Cao (High)</option>
                      <option value="urgent">Khẩn cấp (Urgent)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Ngày thực hiện</label>
                    <input
                      type="date"
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Giờ bắt đầu</label>
                    <input
                      type="time"
                      value={newEventStartTime}
                      onChange={(e) => setNewEventStartTime(e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Giờ kết thúc</label>
                    <input
                      type="time"
                      value={newEventEndTime}
                      onChange={(e) => setNewEventEndTime(e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Ghi chú & Kịch bản thực thi</label>
                  <textarea
                    rows={2}
                    value={newEventDesc}
                    onChange={(e) => setNewEventDesc(e.target.value)}
                    placeholder="Mục tiêu cụ thể, người phối hợp, hoặc API endpoint..."
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-3 py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white"
                  >
                    Hủy bỏ
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-sm shadow-cyan-500/20"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Lưu Vào Lịch & Đồng Bộ</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. WebCal Feed Link Modal */}
      <AnimatePresence>
        {showWebCalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWebCalModal(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className={`relative w-full max-w-lg p-5 rounded-2xl border shadow-2xl z-10 space-y-4 ${
                theme === 'light'
                  ? 'bg-white border-slate-300 text-slate-800'
                  : 'bg-slate-950 border-cyan-500/40 text-slate-100'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-bold text-base">Đăng Ký WebCal / CalDAV System Calendar</h3>
                </div>
                <button
                  onClick={() => setShowWebCalModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Đăng ký URL này vào Apple Calendar (macOS/iOS), Google Calendar hoặc Outlook để tự động cập nhật lịch làm việc của Hoppi theo thời gian thực:
              </p>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-cyan-300 break-all select-all flex items-center justify-between">
                <span>webcal://hoppi-autonomous.mesh.local/api/calendar/feed.ics?token=tok-mac-master-9921</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs space-y-1.5">
                <span className="font-semibold text-slate-200 block">Hướng dẫn cài đặt nhanh:</span>
                <p className="text-slate-400 text-[11px]">
                  • <b>macOS / iOS:</b> Mở ứng dụng Lịch (Calendar) &gt; File &gt; New Calendar Subscription &gt; Dán đường link trên.
                </p>
                <p className="text-slate-400 text-[11px]">
                  • <b>Google Calendar:</b> Bấm dấu (+) cạnh "Khác lịch" &gt; Từ URL (From URL) &gt; Dán đường link.
                </p>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleRequestNotificationPermission}
                  className="px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kích hoạt Thông báo Trình duyệt</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      'webcal://hoppi-autonomous.mesh.local/api/calendar/feed.ics?token=tok-mac-master-9921'
                    );
                    alert('Đã sao chép đường dẫn WebCal vào bộ nhớ tạm!');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold cursor-pointer"
                >
                  Sao Chép Đường Link
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Task Floating Action Button (Speed Dial Menu) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        <AnimatePresence>
          {isQuickTaskOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className={`mb-3 w-80 sm:w-96 p-4 rounded-2xl border shadow-2xl backdrop-blur-md flex flex-col space-y-3 ${
                theme === 'light'
                  ? 'bg-white/95 border-slate-300 text-slate-800'
                  : 'bg-slate-950/95 border-cyan-500/50 text-slate-100 shadow-cyan-500/20'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm">Thêm Nhanh Tác Vụ Định Kỳ</h4>
                    <p className="text-[10px] text-slate-400">Recurring Maintenance Presets</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsQuickTaskOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Frequency Selector: Hourly, Daily, Weekly, Monthly */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
                  <span>Tần suất lặp lại (Frequency):</span>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                    {selectedQuickFrequency}
                  </span>
                </label>
                <div className="grid grid-cols-4 gap-1 p-0.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px]">
                  {(['hourly', 'daily', 'weekly', 'monthly'] as const).map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setSelectedQuickFrequency(freq)}
                      className={`py-1 rounded-lg font-medium transition-all text-center cursor-pointer ${
                        selectedQuickFrequency === freq
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {freq === 'hourly'
                        ? 'Giờ'
                        : freq === 'daily'
                        ? 'Ngày'
                        : freq === 'weekly'
                        ? 'Tuần'
                        : 'Tháng'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Presets List */}
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Chọn mẫu bảo trì hệ sinh thái:
                </span>
                {MAINTENANCE_TASK_PRESETS.map((preset) => {
                  const pTier = preset.taskTier || 'maintenance';
                  const pMeta = getTaskTierMeta(pTier);
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleAddQuickTask(preset, selectedQuickFrequency)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer group flex items-start justify-between gap-2 ${
                        theme === 'light'
                          ? 'bg-slate-50 border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/50'
                          : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/60 hover:bg-cyan-950/20'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs truncate text-cyan-300 group-hover:text-cyan-200">
                            {preset.title}
                          </span>
                          <span
                            className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded-full border flex items-center gap-0.5 ${pMeta.badgeClass}`}
                          >
                            <span className={`w-1 h-1 rounded-full ${pMeta.dotClass}`} />
                            <span>{pMeta.label}</span>
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {preset.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[9px] font-mono text-slate-500">
                          <span>⏱ {preset.durationMinutes} phút</span>
                          <span>• {preset.estimatedCpuLoad}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all shrink-0 mt-1"
                      >
                        + Lên lịch
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Trigger Button */}
        <button
          type="button"
          onClick={() => setIsQuickTaskOpen(!isQuickTaskOpen)}
          className={`flex items-center gap-2 px-4 py-3 rounded-full font-bold text-xs shadow-xl transition-all cursor-pointer border ${
            isQuickTaskOpen
              ? 'bg-slate-900 text-cyan-300 border-cyan-400 shadow-cyan-500/30 rotate-0'
              : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-cyan-300/40 shadow-cyan-500/30 hover:scale-105 active:scale-95'
          }`}
          title="Mở menu thêm nhanh tác vụ định kỳ (Clean Vector Cache, Vacuum SQLite...)"
        >
          <Zap className={`w-4 h-4 transition-transform duration-300 ${isQuickTaskOpen ? 'rotate-90 text-cyan-400' : ''}`} />
          <span>{isQuickTaskOpen ? 'Đóng Menu' : 'Quick Task'}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 border border-white/20 font-mono">
            +
          </span>
        </button>
      </div>
    </div>
  );
};
