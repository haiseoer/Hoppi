import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MessageSquare,
  Code2,
  ShoppingCart,
  Database,
  Radio,
  ShieldCheck,
  Moon,
  Sun,
  Zap,
  Mic,
  Volume2,
  Trash2,
  Server,
  Laptop,
  Smartphone,
  Tablet,
  Sparkles,
  Bot,
  CornerDownLeft,
  X,
  History,
  Sliders,
  Check,
  UserCheck,
  Layers,
  TrendingUp,
  Volume1,
  VolumeX,
  Play,
  Square,
  RotateCcw,
  CheckCircle2,
  Smile,
  Heart,
  Cpu,
  Clock,
  Settings2,
  ArrowLeft,
  Headphones,
  Edit3,
  Compass,
  HelpCircle,
  Download,
  FileJson,
  FileDown,
  Eye,
  Building2,
  Camera,
} from 'lucide-react';
import {
  AppTheme,
  ChatMessage,
  UserIdentity,
  AppModule,
  VoiceMoodSettings,
  ResponseStylePreset,
  DEFAULT_VOICE_MOOD_SETTINGS,
  VoiceCommandLogItem,
} from '../types';

export interface CommandPaletteAction {
  id: string;
  title: string;
  description: string;
  category: 'modules' | 'devices' | 'actions' | 'settings' | 'history';
  icon: React.ReactNode;
  shortcut?: string;
  keywords?: string[];
  voicePhraseVi?: string;
  voicePhraseEn?: string;
  onSelect: () => void;
}

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule: AppModule;
  onChangeModule: (mod: AppModule) => void;
  onOpenDevicesModal: () => void;
  onSelectTargetDeviceId?: (deviceId: string) => void;
  onTriggerCompletionNotice?: () => void;
  onStartAutonomousTask?: () => void;
  onToggleSpeechRecognition?: () => void;
  onToggleSpeech?: () => void;
  onToggleActivityPause?: () => void;
  isActivityPaused?: boolean;
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
  identity: UserIdentity | null;
  onSwitchIdentity?: () => void;
  onClearHistory?: () => void;
  messages: ChatMessage[];
  onSelectPastMessage?: (msg: ChatMessage) => void;
  voiceSettings?: VoiceMoodSettings;
  onUpdateVoiceSettings?: (settings: VoiceMoodSettings) => void;
  voiceCommandLogs?: VoiceCommandLogItem[];
  onReplayVoiceCommand?: (command: string) => void;
  onOpenAdaptiveLightModal?: () => void;
  onOpenSnapshotModal?: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  activeModule,
  onChangeModule,
  onOpenDevicesModal,
  onSelectTargetDeviceId,
  onTriggerCompletionNotice,
  onStartAutonomousTask,
  onToggleSpeechRecognition,
  onToggleSpeech,
  onToggleActivityPause,
  isActivityPaused,
  currentTheme,
  onSelectTheme,
  identity,
  onSwitchIdentity,
  onClearHistory,
  messages,
  onSelectPastMessage,
  voiceSettings,
  onUpdateVoiceSettings,
  voiceCommandLogs: propVoiceCommandLogs,
  onReplayVoiceCommand,
  onOpenAdaptiveLightModal,
  onOpenSnapshotModal,
}) => {
  const [activeTab, setActiveTab] = useState<'commands' | 'voice-log' | 'voice-settings'>('commands');
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isVoiceTourActive, setIsVoiceTourActive] = useState<boolean>(true);
  const [voiceLogFilter, setVoiceLogFilter] = useState<'all' | 'code' | 'iot' | 'sales' | 'system'>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Voice Command Logs tracking (last 20 commands)
  const [voiceLogs, setVoiceLogs] = useState<VoiceCommandLogItem[]>(() => {
    if (propVoiceCommandLogs && propVoiceCommandLogs.length > 0) return propVoiceCommandLogs.slice(0, 20);
    try {
      const saved = localStorage.getItem('hoppi_voice_command_log_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.slice(0, 20);
      }
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 'vlog-1', command: 'Hoppi, mở Trợ lý Code', timestamp: '10:45', success: true, category: 'code', durationMs: 420 },
      { id: 'vlog-2', command: 'Kiểm tra trạng thái máy chủ 24/7', timestamp: '10:40', success: true, category: 'system', durationMs: 310 },
      { id: 'vlog-3', command: 'Bật đèn bàn làm việc', timestamp: '10:28', success: true, category: 'iot', durationMs: 280 },
      { id: 'vlog-4', command: 'Rà soát lead Zalo OA cần chốt hôm nay', timestamp: '09:55', success: true, category: 'sales', durationMs: 510 },
      { id: 'vlog-5', command: 'Đồng bộ hóa 1,420 vector sang Home Server', timestamp: '09:30', success: true, category: 'system', durationMs: 820 },
      { id: 'vlog-6', command: 'Chuyển giao diện sang Cyberpunk Neon', timestamp: '09:12', success: true, category: 'system', durationMs: 250 },
      { id: 'vlog-7', command: 'Quét các thiết bị IoT trên mạng LAN', timestamp: '08:45', success: true, category: 'iot', durationMs: 640 },
      { id: 'vlog-8', command: 'Tạo khối thời gian tập trung làm việc 2 tiếng', timestamp: '08:15', success: true, category: 'system', durationMs: 390 },
      { id: 'vlog-9', command: 'Hoppi, kiểm tra độ trễ mạng Mesh', timestamp: '07:50', success: true, category: 'system', durationMs: 290 },
      { id: 'vlog-10', command: 'Tắt đèn thông minh khi ra ngoài', timestamp: 'Hôm qua 22:15', success: true, category: 'iot', durationMs: 240 },
    ];
  });

  // Keep voiceLogs persisted
  useEffect(() => {
    try {
      localStorage.setItem('hoppi_voice_command_log_history', JSON.stringify(voiceLogs.slice(0, 20)));
    } catch (e) {
      console.error(e);
    }
  }, [voiceLogs]);

  // Sync propVoiceCommandLogs if provided
  useEffect(() => {
    if (propVoiceCommandLogs && propVoiceCommandLogs.length > 0) {
      setVoiceLogs(propVoiceCommandLogs.slice(0, 20));
    }
  }, [propVoiceCommandLogs]);

  // Voice & Mood Settings state initialized with localStorage persistence
  const [voiceSettingsState, setVoiceSettingsState] = useState<VoiceMoodSettings>(() => {
    if (voiceSettings) return voiceSettings;
    try {
      const saved = localStorage.getItem('hoppi_voice_mood_settings_v1');
      if (saved) {
        return { ...DEFAULT_VOICE_MOOD_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error loading voice mood settings from localStorage:', e);
    }
    return DEFAULT_VOICE_MOOD_SETTINGS;
  });

  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [isTestingSpeech, setIsTestingSpeech] = useState(false);

  // Spoken voice shortcut resolver for interactive Voice Command Tour
  const getVoiceShortcut = (action: CommandPaletteAction) => {
    if (action.voicePhraseVi) {
      return { spokenVi: action.voicePhraseVi, spokenEn: action.voicePhraseEn || 'Hey Hoppi, execute' };
    }
    if (action.id === 'mod-chat') return { spokenVi: 'Hoppi, mở màn hình trò chuyện', spokenEn: 'Hey Hoppi, open chat' };
    if (action.id === 'mod-code') return { spokenVi: 'Hoppi, mở Trợ lý Code', spokenEn: 'Hey Hoppi, open code agent' };
    if (action.id === 'mod-sales') return { spokenVi: 'Hoppi, kiểm tra lead Zalo OA', spokenEn: 'Hey Hoppi, check sales CRM' };
    if (action.id === 'mod-rag') return { spokenVi: 'Hoppi, kiểm tra bộ nhớ vector', spokenEn: 'Hey Hoppi, view vector memory' };
    if (action.id === 'mod-iot') return { spokenVi: 'Hoppi, mở điều khiển LAN IoT', spokenEn: 'Hey Hoppi, open smart home' };
    if (action.id === 'mod-mesh') return { spokenVi: 'Hoppi, kiểm tra mạng lưới Mesh', spokenEn: 'Hey Hoppi, view mesh dashboard' };
    if (action.id === 'mod-schedule') return { spokenVi: 'Hoppi, mở lịch thông minh', spokenEn: 'Hey Hoppi, open calendar schedule' };
    if (action.id === 'mod-security') return { spokenVi: 'Hoppi, xem nhật ký FaceID', spokenEn: 'Hey Hoppi, view security logs' };
    if (action.id.includes('theme-cyberpunk')) return { spokenVi: 'Hoppi, bật giao diện Cyberpunk', spokenEn: 'Hey Hoppi, cyberpunk mode' };
    if (action.id.includes('theme-deepspace')) return { spokenVi: 'Hoppi, chuyển sang Deep Space', spokenEn: 'Hey Hoppi, deep space dark mode' };
    if (action.id.includes('theme-light')) return { spokenVi: 'Hoppi, đổi giao diện sáng', spokenEn: 'Hey Hoppi, light contrast mode' };
    if (action.id.includes('speech-stt')) return { spokenVi: 'Hoppi, lắng nghe tôi nói', spokenEn: 'Hey Hoppi, start listening' };
    if (action.id.includes('pause')) return { spokenVi: 'Hoppi, tạm nghỉ', spokenEn: 'Hey Hoppi, pause activity' };
    return {
      spokenVi: `Hoppi, ${action.title.toLowerCase()}`,
      spokenEn: `Hey Hoppi, ${action.title.toLowerCase()}`,
    };
  };

  // Speak pronunciation guide for hands-free voice command tour
  const speakTourVoice = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = voiceSettingsState.preferredVoiceLang || 'vi-VN';
    utt.rate = voiceSettingsState.rate || 1.0;
    utt.pitch = voiceSettingsState.pitch || 1.15;
    window.speechSynthesis.speak(utt);
  };

  // Replay a voice command from log
  const handleReplayLog = (logItem: VoiceCommandLogItem) => {
    // Add to top of logs as a re-execution
    const newLog: VoiceCommandLogItem = {
      id: `vlog-${Date.now()}`,
      command: logItem.command,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      success: true,
      category: logItem.category,
      durationMs: 300,
    };
    setVoiceLogs((prev) => [newLog, ...prev.slice(0, 19)]);

    if (onReplayVoiceCommand) {
      onReplayVoiceCommand(logItem.command);
      onClose();
    } else if (onSelectPastMessage) {
      onChangeModule('chat');
      onSelectPastMessage({
        id: `replay-${Date.now()}`,
        role: 'user',
        text: logItem.command,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      });
      onClose();
    } else {
      speakTourVoice(`Đang chạy lại lệnh giọng nói: ${logItem.command}`);
      onClose();
    }
  };

  // Edit a voice command from log: copies to search box, focuses, and switches to commands tab
  const handleEditLog = (commandText: string) => {
    setActiveTab('commands');
    setQuery(commandText);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 100);
  };

  // Export last 20 voice commands as a downloadable JSON file for analysis
  const handleExportVoiceCommandsJSON = () => {
    const targetCommands = voiceLogs.slice(0, 20);
    const categoryDistribution = {
      code: targetCommands.filter((c) => c.category === 'code').length,
      iot: targetCommands.filter((c) => c.category === 'iot').length,
      sales: targetCommands.filter((c) => c.category === 'sales').length,
      system: targetCommands.filter((c) => c.category === 'system').length,
    };

    const totalDuration = targetCommands.reduce((sum, item) => sum + (item.durationMs || 300), 0);
    const avgDuration = targetCommands.length > 0 ? Math.round(totalDuration / targetCommands.length) : 0;

    const payload = {
      exportMetadata: {
        application: 'Hoppi Autonomous Executive AI Assistant',
        subsystem: 'Voice Command Execution Engine & Telemetry',
        version: '4.0.0-mesh',
        exportedAt: new Date().toISOString(),
        owner: identity?.name || 'Nguyễn Thanh Hải (Master)',
        userRole: identity?.isMaster ? 'Master Executive' : 'Guest Operator',
        totalCommandsExported: targetCommands.length,
        maxLogLimit: 20,
      },
      telemetryAnalytics: {
        categoryDistribution,
        totalExecutionDurationMs: totalDuration,
        averageExecutionDurationMs: avgDuration,
        successCount: targetCommands.filter((c) => c.success).length,
        failureCount: targetCommands.filter((c) => !c.success).length,
        successRatePercentage: targetCommands.length > 0 ? 100 : 0,
        sampleWindow: 'Last 20 voice interactions',
      },
      voiceCommands: targetCommands.map((item, index) => ({
        sequenceNumber: index + 1,
        id: item.id || `vlog-${index + 1}`,
        commandText: item.command,
        category: item.category,
        timestamp: item.timestamp,
        durationMs: item.durationMs || 300,
        success: item.success,
        isReplay: Boolean(item.id && item.id.includes('replay')),
      })),
    };

    try {
      const jsonContent = JSON.stringify(payload, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const dateTag = new Date().toISOString().replace(/[:.]/g, '-');
      link.setAttribute('download', `hoppi-voice-commands-last20-${dateTag}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportNotice(`Đã xuất ${targetCommands.length} lệnh giọng nói ra tệp JSON thành công!`);
      setTimeout(() => setExportNotice(null), 3500);
    } catch (err) {
      console.error('Failed to export voice commands JSON:', err);
    }
  };

  // Sync state if parent props update
  useEffect(() => {
    if (voiceSettings) {
      setVoiceSettingsState(voiceSettings);
    }
  }, [voiceSettings]);

  // Persist settings to localStorage
  const updateAndPersistSettings = (patch: Partial<VoiceMoodSettings>) => {
    setVoiceSettingsState((prev) => {
      const updated: VoiceMoodSettings = {
        ...prev,
        ...patch,
        lastUpdated: new Date().toISOString(),
      };
      try {
        localStorage.setItem('hoppi_voice_mood_settings_v1', JSON.stringify(updated));
      } catch (e) {
        console.error('Error persisting voice mood settings:', e);
      }
      if (onUpdateVoiceSettings) {
        onUpdateVoiceSettings(updated);
      }
      return updated;
    });
    setSaveNotice('Đã lưu thay đổi vào LocalStorage');
    setTimeout(() => setSaveNotice(null), 1800);
  };

  // Reset to default
  const handleResetToDefault = () => {
    const def = { ...DEFAULT_VOICE_MOOD_SETTINGS, lastUpdated: new Date().toISOString() };
    setVoiceSettingsState(def);
    try {
      localStorage.setItem('hoppi_voice_mood_settings_v1', JSON.stringify(def));
    } catch (e) {
      console.error(e);
    }
    if (onUpdateVoiceSettings) {
      onUpdateVoiceSettings(def);
    }
    setSaveNotice('Đã khôi phục cài đặt gốc Hoppi');
    setTimeout(() => setSaveNotice(null), 1800);
  };

  // Get sample speech text corresponding to mood style
  const getSampleTextForStyle = (style: ResponseStylePreset, promptPrefix?: string): string => {
    switch (style) {
      case 'energetic':
        return 'Dạ em chào anh Hải! Hoppi đã hoàn tất xuất sắc toàn bộ nhiệm vụ. Hệ thống vận hành với 100% công suất, anh Hải hãy kiểm tra ngay nhé!';
      case 'empathetic':
        return 'Anh Hải ơi, Hoppi đã xử lý xong công việc rồi ạ. Anh đã tập trung làm việc suốt nhiều giờ rồi, anh nhớ nghỉ ngơi và uống chút nước ấm nhé!';
      case 'technical':
        return 'Xác nhận kiểm thử kỹ thuật: Độ trễ P2P 12 mili giây, tải CPU 18 phần trăm, AST AST_OK. Hệ thống mesh 5 thiết bị đã đồng bộ trọn vẹn.';
      case 'concise':
        return 'Dạ thưa anh Hải, Hoppi đã hoàn thành tác vụ. Mọi thông số đều đạt chuẩn.';
      case 'playful':
        return 'Ting ting! Hoppi siêu nhí nhảnh đã hoàn thành công việc vèo vèo trong một nốt nhạc rồi đây anh Hải ơi, điểm 10 cho chất lượng luôn!';
      case 'custom':
        return promptPrefix && promptPrefix.trim()
          ? `Dạ chào anh Hải, Hoppi xin phản hồi: ${promptPrefix.slice(0, 80)}`
          : 'Chào anh Hải, Hoppi đang phát âm thanh theo chỉ dẫn tính cách tùy biến của anh!';
      default:
        return 'Chào Chủ nhân Nguyễn Thanh Hải, Hoppi luôn sẵn sàng phục vụ!';
    }
  };

  // Live test speech synthesis
  const handleTestSpeech = (overrideText?: string, overrideStyle?: ResponseStylePreset) => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt chưa hỗ trợ Web Speech Synthesis.');
      return;
    }
    window.speechSynthesis.cancel();
    const styleToUse = overrideStyle || voiceSettingsState.responseStyle;
    const text = overrideText || getSampleTextForStyle(styleToUse, voiceSettingsState.customPromptInstruction);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceSettingsState.preferredVoiceLang || 'vi-VN';
    utterance.pitch = voiceSettingsState.pitch;
    utterance.rate = voiceSettingsState.rate;
    utterance.volume = voiceSettingsState.volume;

    utterance.onstart = () => setIsTestingSpeech(true);
    utterance.onend = () => setIsTestingSpeech(false);
    utterance.onerror = () => setIsTestingSpeech(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsTestingSpeech(false);
  };

  // Focus input automatically on open and reset state
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        if (activeTab === 'commands') {
          inputRef.current?.focus();
        }
      }, 50);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsTestingSpeech(false);
    }
  }, [isOpen, activeTab]);

  // Build standard actions list
  const baseActions: CommandPaletteAction[] = useMemo(() => {
    const list: CommandPaletteAction[] = [
      // 1. Modules navigation
      {
        id: 'mod-chat',
        title: 'Trò chuyện AI & Giọng nói Trợ lý',
        description: 'Mở phân hệ hội thoại, ra lệnh giọng nói và tương tác với Hoppi v4.0',
        category: 'modules',
        icon: <MessageSquare className="w-4 h-4 text-cyan-400" />,
        shortcut: 'M 1',
        keywords: ['chat', 'voice', 'hoi thoai', 'hoppi', 'noi chuyen', 'tro ly'],
        onSelect: () => {
          onChangeModule('chat');
          onClose();
        },
      },
      {
        id: 'mod-hq3d',
        title: 'Tổng Hành Dinh AI 3D (AI Agent HQ 3D - Bàn Làm Việc 250 Triệu)',
        description: 'Mô hình văn phòng 3D trực quan: Chỉ huy 8 phòng ban AI trực chiến 24/7 với trợ lý gắn vòng sáng trên đầu',
        category: 'modules',
        icon: <Building2 className="w-4 h-4 text-cyan-400" />,
        shortcut: 'M 8',
        voicePhraseVi: 'Hoppi, mở tổng hành dinh AI 3D',
        voicePhraseEn: 'Hey Hoppi, open 3D AI HQ',
        keywords: ['hq', '3d', 'tong hanh dinh', 'phong ban', 'vong sang', '250 trieu', 'ban lam viec', 'van phong'],
        onSelect: () => {
          onChangeModule('hq3d');
          onClose();
        },
      },
      {
        id: 'mod-mesh',
        title: 'Mạng Lưới Mesh & Global Status Dashboard',
        description: 'Giám sát thời gian thực sức khỏe phần cứng, độ trễ P2P và phân phối tác vụ trên các thiết bị',
        category: 'modules',
        icon: <Layers className="w-4 h-4 text-cyan-400" />,
        shortcut: 'M 0',
        keywords: ['mesh', 'dashboard', 'status', 'suc khoe', 'thiet bi', 'server', 'phan phoi', 'p2p'],
        onSelect: () => {
          onChangeModule('mesh');
          onClose();
        },
      },
      {
        id: 'mod-code',
        title: 'Lập trình Code Agent (AST Engine & Sandboxing)',
        description: 'Tự động kiểm định cú pháp, refactor và sandbox mã nguồn độc lập',
        category: 'modules',
        icon: <Code2 className="w-4 h-4 text-indigo-400" />,
        shortcut: 'M 2',
        keywords: ['code', 'agent', 'lap trinh', 'ast', 'sandbox', 'git', 'refactor'],
        onSelect: () => {
          onChangeModule('code');
          onClose();
        },
      },
      {
        id: 'mod-sales',
        title: 'Sales CRM & Chăm sóc Khách Zalo OA',
        description: 'Rà soát pipeline, chấm điểm cảm xúc và phản hồi lead tự động',
        category: 'modules',
        icon: <ShoppingCart className="w-4 h-4 text-emerald-400" />,
        shortcut: 'M 3',
        keywords: ['sales', 'crm', 'zalo', 'lead', 'khach hang', 'bao gia'],
        onSelect: () => {
          onChangeModule('sales');
          onClose();
        },
      },
      {
        id: 'mod-rag',
        title: 'Bộ nhớ Dài hạn & RAG Vector DB',
        description: 'Quản lý 1,420 vector tri thức, tự động lấp lỗ hổng hiểu biết',
        category: 'modules',
        icon: <Database className="w-4 h-4 text-purple-400" />,
        shortcut: 'M 4',
        keywords: ['rag', 'memory', 'vector', 'chromadb', 'tri thuc', 'hoc tap'],
        onSelect: () => {
          onChangeModule('rag');
          onClose();
        },
      },
      {
        id: 'mod-iot',
        title: 'Nhà Thông Minh LAN IoT & Smart Devices',
        description: 'Quét mDNS, điều khiển đèn thông minh, camera an ninh và router',
        category: 'modules',
        icon: <Radio className="w-4 h-4 text-amber-400" />,
        shortcut: 'M 5',
        keywords: ['iot', 'lan', 'nha thong minh', 'den', 'camera', 'mdns', 'tuya'],
        onSelect: () => {
          onChangeModule('iot');
          onClose();
        },
      },
      {
        id: 'mod-security',
        title: 'Thẩm định Bảo mật & Audit Logs',
        description: 'Giám sát Zero-Trust, phân quyền HITL và nhật ký truy cập',
        category: 'modules',
        icon: <ShieldCheck className="w-4 h-4 text-rose-400" />,
        shortcut: 'M 6',
        keywords: ['security', 'bao mat', 'audit', 'hitl', 'zero trust', 'nhat ky'],
        onSelect: () => {
          onChangeModule('security');
          onClose();
        },
      },

      // 2. Mesh Devices Targeting
      {
        id: 'dev-modal',
        title: 'Mở Trung tâm Thiết bị Mesh (Connected Devices Hub)',
        description: 'Xem chi tiết 5 thiết bị kết nối, QR Code kết nối và cài đặt PWA',
        category: 'devices',
        icon: <Radio className="w-4 h-4 text-cyan-400" />,
        shortcut: 'D M',
        keywords: ['thiet bi', 'mesh', 'pwa', 'install', 'dong bo', 'cai dat'],
        onSelect: () => {
          onClose();
          onOpenDevicesModal();
        },
      },
      {
        id: 'dev-target-server',
        title: 'Đổi đích nhận lệnh: Home Server 24/7 (Mini PC)',
        description: 'Chỉ định Home Server Ubuntu làm việc riêng lẻ',
        category: 'devices',
        icon: <Server className="w-4 h-4 text-emerald-400" />,
        keywords: ['server', 'ubuntu', 'home server', 'mini pc', 'chay ngam'],
        onSelect: () => {
          if (onSelectTargetDeviceId) onSelectTargetDeviceId('dev-server-home');
          onChangeModule('chat');
          onClose();
        },
      },
      {
        id: 'dev-target-macbook',
        title: 'Đổi đích nhận lệnh: MacBook Pro M3 Max',
        description: 'Giao tác vụ nặng hoặc lập trình cho MacBook chính của Chủ nhân',
        category: 'devices',
        icon: <Laptop className="w-4 h-4 text-indigo-400" />,
        keywords: ['macbook', 'laptop', 'm3', 'macos'],
        onSelect: () => {
          if (onSelectTargetDeviceId) onSelectTargetDeviceId('dev-macbook-master');
          onChangeModule('chat');
          onClose();
        },
      },
      {
        id: 'dev-target-iphone',
        title: 'Đổi đích nhận lệnh: iPhone 16 Pro Max',
        description: 'Giao lệnh tới thiết bị di động cá nhân',
        category: 'devices',
        icon: <Smartphone className="w-4 h-4 text-cyan-400" />,
        keywords: ['iphone', 'dien thoai', 'ios', 'mobile'],
        onSelect: () => {
          if (onSelectTargetDeviceId) onSelectTargetDeviceId('dev-iphone-master');
          onChangeModule('chat');
          onClose();
        },
      },
      {
        id: 'dev-target-ipad',
        title: 'Đổi đích nhận lệnh: iPad Pro M2 (Phòng khách)',
        description: 'Giao lệnh giám sát màn hình, camera smart home',
        category: 'devices',
        icon: <Tablet className="w-4 h-4 text-amber-400" />,
        keywords: ['ipad', 'tablet', 'phong khach', 'camera'],
        onSelect: () => {
          if (onSelectTargetDeviceId) onSelectTargetDeviceId('dev-ipad-living');
          onChangeModule('chat');
          onClose();
        },
      },
      {
        id: 'dev-target-all',
        title: 'Đổi đích nhận lệnh: Toàn bộ Mạng Mesh (Broadcast)',
        description: 'Phát lệnh đồng bộ tới tất cả 5 thiết bị trong hệ thống',
        category: 'devices',
        icon: <Zap className="w-4 h-4 text-cyan-400" />,
        keywords: ['all', 'tat ca', 'broadcast', 'toan bo', 'mesh'],
        onSelect: () => {
          if (onSelectTargetDeviceId) onSelectTargetDeviceId('all');
          onChangeModule('chat');
          onClose();
        },
      },

      // 3. Quick Actions & Settings
      {
        id: 'act-dashboard-snapshot',
        title: 'Chụp Dashboard Snapshot (Xuất PDF & JSON Tổng Hành Dinh 3D & IoT)',
        description: 'Tạo tài liệu hợp nhất 8 phòng ban 3D HQ và 6 thiết bị IoT mạng LAN để lưu trữ offline',
        category: 'actions',
        icon: <Camera className="w-4 h-4 text-cyan-400" />,
        shortcut: 'D S',
        voicePhraseVi: 'Hoppi, chụp dashboard snapshot xuất PDF',
        voicePhraseEn: 'Hey Hoppi, export dashboard snapshot',
        keywords: ['snapshot', 'pdf', 'json', 'export', 'xuat', '3d hq', 'iot', 'offline', 'tai lieu'],
        onSelect: () => {
          onClose();
          if (onOpenSnapshotModal) onOpenSnapshotModal();
        },
      },
      {
        id: 'act-hoppi-notice',
        title: 'Thử nghiệm Hiệu ứng Hoppi Mascot Hoàn thành & Giọng nói',
        description: 'Kích hoạt hộp thoại Mascot Hoppi trượt lên kèm lời chào hoàn thành công việc',
        category: 'actions',
        icon: <Bot className="w-4 h-4 text-amber-400 animate-bounce" />,
        shortcut: 'T N',
        keywords: ['thong bao', 'hoan thanh', 'giong noi', 'mascot', 'hoppi', 'avatar'],
        onSelect: () => {
          onClose();
          if (onTriggerCompletionNotice) onTriggerCompletionNotice();
        },
      },
      {
        id: 'act-productivity-chart',
        title: 'Xem Biểu đồ Điểm Năng Suất Hàng Ngày (Recharts)',
        description: 'Mở chỉ số Daily Productivity Score phân bổ theo 4 tâm trạng và tốc độ phản hồi ms',
        category: 'actions',
        icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
        shortcut: 'P S',
        keywords: ['nang suat', 'productivity', 'score', 'bieu do', 'recharts', 'tam trang', 'toc do', 'thoi gian'],
        onSelect: () => {
          onChangeModule('chat');
          onClose();
        },
      },
      {
        id: 'act-iot-voice-router',
        title: 'Mở Bảng Điều Khiển Lệnh Giọng Nói LAN IoT & Router',
        description: 'Định tuyến khẩu lệnh tới endpoint nội bộ 192.168.1.x kèm phản hồi biểu cảm Avatar',
        category: 'actions',
        icon: <Mic className="w-4 h-4 text-cyan-400" />,
        shortcut: 'V C',
        keywords: ['voice', 'iot', 'giong noi', 'khau lenh', 'bat den', 'lan', 'avatar mood'],
        onSelect: () => {
          onChangeModule('iot');
          onClose();
        },
      },
      {
        id: 'act-iot-voice-lights',
        title: 'Lệnh Nhanh: "Bật đèn phòng khách" qua LAN',
        description: 'Gửi POST http://192.168.1.115:8080/api/lan/iot/lights/living-room và kích hoạt Avatar vui vẻ',
        category: 'actions',
        icon: <Zap className="w-4 h-4 text-amber-400" />,
        keywords: ['bat den', 'turn on lights', 'living room', 'den phong khach', 'iot'],
        onSelect: () => {
          onChangeModule('iot');
          onClose();
        },
      },
      {
        id: 'act-scene-good-night',
        title: 'Kịch Bản IoT: "Chúc Ngủ Ngon" (Good Night)',
        description: 'Tắt đèn, khóa chốt cửa, bật camera hồng ngoại và điều hòa 26°C qua 1 lệnh giọng nói',
        category: 'actions',
        icon: <Moon className="w-4 h-4 text-indigo-400" />,
        shortcut: 'G N',
        voicePhraseVi: 'Hoppi, chúc ngủ ngon',
        voicePhraseEn: 'Hey Hoppi, good night',
        keywords: ['ngu ngon', 'good night', 'di ngu', 'tat den', 'khoa cua', 'an ninh', 'scene', 'kich ban'],
        onSelect: () => {
          onChangeModule('iot');
          try {
            if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
              const ch = new BroadcastChannel('hoppi_device_mesh_channel');
              ch.postMessage({ type: 'HOPPI_TRIGGER_SCENE', sceneId: 'scene-good-night', sceneName: 'Chúc Ngủ Ngon' });
              ch.close();
            }
          } catch (e) {}
          onClose();
        },
      },
      {
        id: 'act-scene-deep-focus',
        title: 'Kịch Bản IoT: "Tập Trung Cao Độ" (Deep Focus)',
        description: 'Bật đèn 100%, hạ điều hòa 23°C, cấp nguồn Home Server 24/7',
        category: 'actions',
        icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
        shortcut: 'D F',
        voicePhraseVi: 'Hoppi, tập trung làm việc',
        voicePhraseEn: 'Hey Hoppi, deep focus',
        keywords: ['tap trung', 'deep focus', 'lam viec', '100%', 'server', 'dieu hoa 23', 'scene', 'kich ban'],
        onSelect: () => {
          onChangeModule('iot');
          try {
            if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
              const ch = new BroadcastChannel('hoppi_device_mesh_channel');
              ch.postMessage({ type: 'HOPPI_TRIGGER_SCENE', sceneId: 'scene-deep-focus', sceneName: 'Tập Trung Cao Độ' });
              ch.close();
            }
          } catch (e) {}
          onClose();
        },
      },
      {
        id: 'act-scene-away',
        title: 'Kịch Bản IoT: "Rời Khỏi Nhà" (Away Mode)',
        description: 'Ngắt toàn bộ tải điện, khóa chốt an toàn và kích hoạt báo động Camera AI',
        category: 'actions',
        icon: <Zap className="w-4 h-4 text-amber-400" />,
        shortcut: 'A W',
        voicePhraseVi: 'Hoppi, rời khỏi nhà',
        voicePhraseEn: 'Hey Hoppi, away mode',
        keywords: ['roi nha', 'away', 'di vang', 'khoa nha', 'bao dong', 'camera 4k', 'scene', 'kich ban'],
        onSelect: () => {
          onChangeModule('iot');
          try {
            if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
              const ch = new BroadcastChannel('hoppi_device_mesh_channel');
              ch.postMessage({ type: 'HOPPI_TRIGGER_SCENE', sceneId: 'scene-away-home', sceneName: 'Rời Khỏi Nhà' });
              ch.close();
            }
          } catch (e) {}
          onClose();
        },
      },
      {
        id: 'act-autonomous-task',
        title: 'Khởi chạy Tác vụ Tự trị Đa bước (Autonomous Multi-Step)',
        description: 'Mô phỏng chuỗi tác vụ tự trị đa tác nhân với thanh tiến trình trực quan',
        category: 'actions',
        icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
        keywords: ['tu tri', 'autonomous', 'multi step', 'tien trinh', 'task'],
        onSelect: () => {
          onClose();
          onChangeModule('chat');
          if (onStartAutonomousTask) onStartAutonomousTask();
        },
      },
      {
        id: 'act-voice-stt',
        title: 'Kích hoạt / Tắt Nhận diện Giọng nói (STT Hey Hoppi)',
        description: 'Bật micro để ra lệnh bằng giọng nói tiếng Việt cho Hoppi',
        category: 'actions',
        icon: <Mic className="w-4 h-4 text-rose-400" />,
        shortcut: 'V',
        keywords: ['mic', 'giong noi', 'stt', 'listen', 'nghe', 'hey hoppi'],
        onSelect: () => {
          onClose();
          if (onToggleSpeechRecognition) onToggleSpeechRecognition();
        },
      },
      {
        id: 'act-voice-tts',
        title: 'Kiểm tra Âm thanh & Lời chào Hoppi (TTS)',
        description: 'Phát giọng đọc lời chào và trạng thái sẵn sàng của Hoppi',
        category: 'actions',
        icon: <Volume2 className="w-4 h-4 text-cyan-400" />,
        keywords: ['am thanh', 'tts', 'doc', 'speak', 'sound'],
        onSelect: () => {
          onClose();
          if (onToggleSpeech) onToggleSpeech();
        },
      },
      {
        id: 'act-pause-activity',
        title: isActivityPaused ? 'Đánh thức Hoppi tiếp tục phục vụ' : 'Chuyển Hoppi sang chế độ Tạm nghỉ (Sleep)',
        description: isActivityPaused
          ? 'Kích hoạt lại toàn bộ các cảm biến và trạng thái làm việc'
          : 'Tạm dừng nhận diện để tiết kiệm năng lượng và bảo vệ thị giác 24/7',
        category: 'actions',
        icon: <Moon className="w-4 h-4 text-amber-400" />,
        shortcut: 'P',
        keywords: ['tam nghi', 'ngu', 'pause', 'sleep', 'danh thuc', 'wake'],
        onSelect: () => {
          onClose();
          if (onToggleActivityPause) onToggleActivityPause();
        },
      },
      {
        id: 'act-switch-identity',
        title: identity?.isMaster
          ? 'Chuyển sang chế độ: Khách ghé thăm (Guest - Hạn chế)'
          : 'Chuyển sang chế độ: Chủ nhân Tối cao (Nguyễn Thanh Hải - Full Master)',
        description: 'Chuyển đổi vai trò người dùng để kiểm tra phân quyền bảo mật Zero-Trust',
        category: 'actions',
        icon: <UserCheck className="w-4 h-4 text-emerald-400" />,
        keywords: ['chu nhan', 'khach', 'guest', 'master', 'admin', 'hai', 'phan quyen'],
        onSelect: () => {
          onClose();
          if (onSwitchIdentity) onSwitchIdentity();
        },
      },
      {
        id: 'act-export-voice-json',
        title: 'Xuất 20 Khẩu Lệnh Giọng Nói Ra Tệp JSON (Export .JSON)',
        description: 'Tải xuống tệp JSON chứa 20 lệnh giọng nói gần nhất kèm số liệu telemetry để phân tích',
        category: 'actions',
        icon: <FileJson className="w-4 h-4 text-emerald-400" />,
        shortcut: 'E J',
        voicePhraseVi: 'Hoppi, xuất file JSON khẩu lệnh',
        voicePhraseEn: 'Hey Hoppi, export voice commands JSON',
        keywords: ['xuat', 'export', 'json', 'voice', 'log', 'download', 'tai ve', 'giong noi', 'khau lenh', 'telemetry'],
        onSelect: () => {
          setActiveTab('voice-log');
          handleExportVoiceCommandsJSON();
        },
      },

      // 4. Voice, Mood & System Settings
      {
        id: 'act-voice-mood-settings',
        title: 'Cài đặt Giọng nói & Phong cách Phản hồi (Voice & Mood Settings)',
        description: `Tùy chỉnh cao độ pitch (${voiceSettingsState.pitch.toFixed(2)}x), tốc độ, âm lượng và phong cách xưng hô của Hoppi`,
        category: 'settings',
        icon: <Sliders className="w-4 h-4 text-cyan-400" />,
        shortcut: 'V S',
        keywords: [
          'voice',
          'giong noi',
          'pitch',
          'cao do',
          'mood',
          'phong cach',
          'tam trang',
          'settings',
          'tts',
          'speech',
          'am thanh',
          'style',
          'toc do',
        ],
        onSelect: () => {
          setActiveTab('voice-settings');
        },
      },
      {
        id: 'settings-adaptive-light',
        title: 'Điều Khiển Ánh Sáng Thích Ứng (Adaptive Light Control)',
        description: 'Tự động đo Lux cảm biến và cân chỉnh độ rực Theme Cyberpunk/Deep Space chống mỏi mắt 24/7',
        category: 'settings',
        icon: <Eye className="w-4 h-4 text-amber-400" />,
        shortcut: 'A L',
        voicePhraseVi: 'Hoppi, mở điều khiển ánh sáng thích ứng',
        voicePhraseEn: 'Hey Hoppi, open adaptive light control',
        keywords: ['anh sang', 'adaptive', 'light', 'lux', 'cam bien', 'chong moi mat', 'cyberpunk', 'deepspace', 'oled', 'eye comfort'],
        onSelect: () => {
          onClose();
          if (onOpenAdaptiveLightModal) onOpenAdaptiveLightModal();
        },
      },
      {
        id: 'theme-cyber',
        title: 'Giao diện: Cyberpunk Neon',
        description: 'Phong cách đậm chất tương lai với ánh sáng neon cyan rực rỡ',
        category: 'settings',
        icon: <Zap className="w-4 h-4 text-cyan-400" />,
        keywords: ['theme', 'giao dien', 'cyber', 'neon', 'mau toi'],
        onSelect: () => {
          onSelectTheme('cyberpunk');
          onClose();
        },
      },
      {
        id: 'theme-deepspace',
        title: 'Giao diện: Deep Space Dark (Siêu tối 24/7)',
        description: 'Nền tối sâu, triệt tiêu ánh sáng xanh, chống mỏi mắt trực đêm',
        category: 'settings',
        icon: <Moon className="w-4 h-4 text-indigo-400" />,
        keywords: ['theme', 'deep space', 'dark', 'toi', 'dem', '24/7'],
        onSelect: () => {
          onSelectTheme('deepspace');
          onClose();
        },
      },
      {
        id: 'theme-light',
        title: 'Giao diện: High Contrast Light (Sáng văn phòng)',
        description: 'Nền trắng tinh khôi, tương phản cao, tối ưu làm việc ban ngày',
        category: 'settings',
        icon: <Sun className="w-4 h-4 text-amber-500" />,
        keywords: ['theme', 'sang', 'light', 'contrast', 'trang'],
        onSelect: () => {
          onSelectTheme('light');
          onClose();
        },
      },
      {
        id: 'act-clear-history',
        title: 'Xóa sạch lịch sử trò chuyện trên thiết bị này',
        description: 'Đặt lại toàn bộ hội thoại lưu cục bộ trong LocalStorage',
        category: 'settings',
        icon: <Trash2 className="w-4 h-4 text-rose-400" />,
        keywords: ['xoa', 'lich su', 'clear', 'reset', 'xoa hoi thoai'],
        onSelect: () => {
          onClose();
          if (onClearHistory) onClearHistory();
        },
      },
    ];

    return list;
  }, [
    activeModule,
    isActivityPaused,
    identity,
    currentTheme,
    onChangeModule,
    onClose,
    onOpenDevicesModal,
    onSelectTargetDeviceId,
    onTriggerCompletionNotice,
    onStartAutonomousTask,
    onToggleSpeechRecognition,
    onToggleSpeech,
    onToggleActivityPause,
    onSwitchIdentity,
    onSelectTheme,
    onClearHistory,
    voiceLogs,
  ]);

  // Build searchable past messages items
  const pastMessageActions: CommandPaletteAction[] = useMemo(() => {
    if (!messages || messages.length === 0) return [];

    // Filter relevant messages (up to 15 most recent unique)
    return messages
      .slice(-15)
      .reverse()
      .map((msg, index) => {
        const isUser = msg.role === 'user';
        const snippet = msg.text.replace(/[*_#`[\]()$]/g, ' ').trim().slice(0, 80);
        return {
          id: `history-${msg.id || index}`,
          title: snippet || (isUser ? 'Lệnh của bạn' : 'Phản hồi từ Hoppi'),
          description: `${isUser ? '👤 Bạn đã hỏi' : '🤖 Hoppi trả lời'} lúc ${msg.timestamp || 'gần đây'}`,
          category: 'history',
          icon: <History className="w-4 h-4 text-cyan-400/80" />,
          keywords: ['lich su', 'tin nhan', 'hoi thoai', 'history', ...snippet.toLowerCase().split(' ')],
          onSelect: () => {
            onChangeModule('chat');
            onClose();
            if (onSelectPastMessage) {
              onSelectPastMessage(msg);
            }
          },
        };
      });
  }, [messages, onChangeModule, onClose, onSelectPastMessage]);

  // Filter actions based on search query
  const filteredActions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Default: show base actions
      return baseActions;
    }

    const all = [...baseActions, ...pastMessageActions];
    return all.filter((item) => {
      if (item.title.toLowerCase().includes(q)) return true;
      if (item.description.toLowerCase().includes(q)) return true;
      if (item.keywords && item.keywords.some((k) => k.toLowerCase().includes(q))) return true;
      return false;
    });
  }, [query, baseActions, pastMessageActions]);

  // Keep selected index in bound
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard navigation within the modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredActions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredActions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredActions[selectedIndex]) {
        filteredActions[selectedIndex].onSelect();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const getCategoryLabel = (cat: CommandPaletteAction['category']) => {
    switch (cat) {
      case 'modules':
        return '🚀 Phân Hệ Chính & Điều Hướng';
      case 'devices':
        return '🌐 Mạng Lưới Thiết Bị Mesh';
      case 'actions':
        return '⚡ Thao Tác Tự Trị & Giọng Nói';
      case 'settings':
        return '⚙️ Cài Đặt Giao Diện & Hệ Thống';
      case 'history':
        return '💬 Lịch Sử Tương Tác & Tin Nhắn Gần Đây';
      default:
        return 'Lệnh Khác';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-3 sm:px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className={`relative w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ${
              currentTheme === 'light'
                ? 'bg-white border-slate-300 text-slate-800 shadow-slate-400/20'
                : currentTheme === 'deepspace'
                ? 'bg-[#090d16] border-indigo-950/80 text-slate-100 shadow-indigo-950/40'
                : 'bg-slate-950/95 border-cyan-500/40 text-slate-100 shadow-cyan-500/15'
            }`}
          >
            {/* Modal Top Tab Switcher */}
            <div
              className={`px-3.5 pt-3 pb-2.5 border-b flex items-center justify-between gap-2 text-xs shrink-0 ${
                currentTheme === 'light'
                  ? 'bg-slate-100/80 border-slate-200'
                  : currentTheme === 'deepspace'
                  ? 'bg-[#07090f]/90 border-neutral-800'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/20 border border-slate-700/40">
                <button
                  type="button"
                  onClick={() => setActiveTab('commands')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
                    activeTab === 'commands'
                      ? currentTheme === 'light'
                        ? 'bg-white text-cyan-700 shadow-sm font-semibold'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Lệnh & Điều Hướng</span>
                  <kbd className="hidden sm:inline-block text-[10px] opacity-70 px-1 rounded bg-black/30">⌘K</kbd>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('voice-log')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
                    activeTab === 'voice-log'
                      ? currentTheme === 'light'
                        ? 'bg-white text-cyan-700 shadow-sm font-semibold'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5 text-rose-400" />
                  <span>Nhật Ký Giọng Nói ({voiceLogs.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('voice-settings')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
                    activeTab === 'voice-settings'
                      ? currentTheme === 'light'
                        ? 'bg-white text-cyan-700 shadow-sm font-semibold'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Cài Đặt Giọng & Biểu Cảm</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                    {voiceSettingsState.pitch.toFixed(2)}x
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {exportNotice && (
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 animate-pulse">
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{exportNotice}</span>
                  </span>
                )}
                {saveNotice && !exportNotice && (
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 animate-pulse">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{saveNotice}</span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors cursor-pointer"
                  title="Đóng cửa sổ (ESC)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* TAB 1: Commands & Navigation */}
            {activeTab === 'commands' && (
              <>
                {/* Search Input Bar */}
                <div
                  className={`p-3.5 border-b flex items-center gap-3 shrink-0 ${
                    currentTheme === 'light'
                      ? 'bg-slate-50 border-slate-200'
                      : currentTheme === 'deepspace'
                      ? 'bg-[#0b101c] border-neutral-800'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Gõ để tìm kiếm lệnh, pitch giọng nói, thiết bị mesh, hoặc lịch sử..."
                    className={`flex-1 bg-transparent border-none text-sm sm:text-base focus:outline-none placeholder:text-xs sm:placeholder:text-sm ${
                      currentTheme === 'light'
                        ? 'text-slate-900 placeholder:text-slate-400'
                        : 'text-slate-100 placeholder:text-slate-500'
                    }`}
                  />

                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-200 cursor-pointer"
                      title="Xóa tìm kiếm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  <kbd
                    className={`hidden sm:flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded-md border ${
                      currentTheme === 'light'
                        ? 'bg-slate-200 border-slate-300 text-slate-600'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    ESC
                  </kbd>
                </div>

                {/* Actions List */}
                <div
                  ref={listRef}
                  className="flex-1 overflow-y-auto p-2 space-y-1 no-scrollbar divide-y divide-transparent"
                  style={{ maxHeight: 'calc(85vh - 160px)' }}
                >
                  {filteredActions.length === 0 ? (
                    <div className="p-8 text-center space-y-2">
                      <div className="w-12 h-12 mx-auto rounded-full bg-slate-800/60 flex items-center justify-center text-slate-400">
                        <Search className="w-6 h-6 text-slate-500" />
                      </div>
                      <p className="text-sm font-semibold">Không tìm thấy lệnh hoặc tin nhắn nào phù hợp</p>
                      <p className="text-xs text-slate-500">
                        Thử tìm kiếm với từ khóa khác như "giong noi", "pitch", "chat", "mesh", "giao dien"...
                      </p>
                    </div>
                  ) : (
                    (() => {
                      let lastCategory: string | null = null;
                      return filteredActions.map((action, index) => {
                        const isSelected = index === selectedIndex;
                        const showCategoryHeader = action.category !== lastCategory;
                        lastCategory = action.category;

                        return (
                          <React.Fragment key={action.id}>
                            {showCategoryHeader && (
                              <div
                                className={`px-3 pt-3 pb-1 text-[10.5px] font-mono uppercase tracking-wider font-semibold ${
                                  currentTheme === 'light' ? 'text-slate-500' : 'text-slate-400'
                                }`}
                              >
                                {getCategoryLabel(action.category)}
                              </div>
                            )}

                            <div
                              data-index={index}
                              onClick={() => action.onSelect()}
                              onMouseEnter={() => setSelectedIndex(index)}
                              className={`px-3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 border ${
                                isSelected
                                  ? currentTheme === 'light'
                                    ? 'bg-cyan-50 border-cyan-400 text-slate-900 shadow-sm'
                                    : currentTheme === 'deepspace'
                                    ? 'bg-indigo-950/60 border-indigo-500/50 text-indigo-100 shadow-sm shadow-indigo-950/30'
                                    : 'bg-slate-900 border-cyan-500/60 text-cyan-200 shadow-sm shadow-cyan-500/20'
                                  : 'border-transparent hover:bg-slate-800/30 text-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div
                                  className={`p-2 rounded-xl shrink-0 transition-colors ${
                                    isSelected
                                      ? currentTheme === 'light'
                                        ? 'bg-cyan-200 text-cyan-900'
                                        : 'bg-cyan-500/20 text-cyan-300'
                                      : currentTheme === 'light'
                                      ? 'bg-slate-100 text-slate-600'
                                      : 'bg-slate-900 text-slate-400'
                                  }`}
                                >
                                  {action.icon}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-xs sm:text-sm truncate">
                                      {action.title}
                                    </span>
                                    {action.id === `mod-${activeModule}` && (
                                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                                        Đang mở
                                      </span>
                                    )}
                                  </div>
                                  <p
                                    className={`text-[11px] truncate mt-0.5 ${
                                      currentTheme === 'light' ? 'text-slate-500' : 'text-slate-400'
                                    }`}
                                  >
                                    {action.description}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {action.shortcut && (
                                  <kbd
                                    className={`hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded border ${
                                      currentTheme === 'light'
                                        ? 'bg-slate-100 border-slate-300 text-slate-600'
                                        : 'bg-slate-900 border-slate-800 text-slate-400'
                                    }`}
                                  >
                                    {action.shortcut}
                                  </kbd>
                                )}

                                {isSelected && (
                                  <div
                                    className={`hidden sm:flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-md ${
                                      currentTheme === 'light'
                                        ? 'bg-cyan-600 text-white'
                                        : 'bg-cyan-500 text-slate-950'
                                    }`}
                                  >
                                    <span>Chọn</span>
                                    <CornerDownLeft className="w-3 h-3" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      });
                    })()
                  )}
                </div>

                {/* Interactive Voice Command Tour Card */}
                {isVoiceTourActive && filteredActions[selectedIndex] && (
                  <div
                    className={`m-2.5 p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-md transition-all ${
                      currentTheme === 'light'
                        ? 'bg-cyan-50/90 border-cyan-300 text-slate-800'
                        : currentTheme === 'deepspace'
                        ? 'bg-[#0e1424] border-indigo-900/60 text-indigo-100'
                        : 'bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border-cyan-500/40 text-cyan-100 shadow-cyan-500/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 shrink-0">
                        <Mic className="w-4 h-4 animate-pulse" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                            Voice Command Tour (Lệnh Giọng Nói Rảnh Tay):
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                            Wake Trigger
                          </span>
                        </div>
                        <div className="font-semibold text-white text-xs sm:text-sm truncate mt-0.5 flex items-center gap-1.5">
                          <span>"{getVoiceShortcut(filteredActions[selectedIndex]).spokenVi}"</span>
                          <span className="text-[10px] text-slate-400 font-normal italic hidden md:inline">
                            / "{getVoiceShortcut(filteredActions[selectedIndex]).spokenEn}"
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakTourVoice(
                            `Để ra lệnh rảnh tay cho tính năng này, hãy nói: ${getVoiceShortcut(filteredActions[selectedIndex]).spokenVi}`
                          );
                        }}
                        title="Bấm để nghe Hoppi phát âm mẫu cách đọc lệnh giọng nói này"
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Nghe Mẫu</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReplayLog({
                            id: `vlog-${Date.now()}`,
                            command: getVoiceShortcut(filteredActions[selectedIndex]).spokenVi,
                            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                            success: true,
                            category: 'system',
                          });
                        }}
                        title="Thực thi ngay lệnh giọng nói này"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[11px] font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Thử Lệnh Này</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Keyboard Shortcuts Footer */}
                <div
                  className={`p-2.5 px-4 border-t text-[11px] flex items-center justify-between font-mono shrink-0 ${
                    currentTheme === 'light'
                      ? 'bg-slate-100 border-slate-200 text-slate-600'
                      : currentTheme === 'deepspace'
                      ? 'bg-[#07090f] border-neutral-800 text-slate-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 rounded bg-black/30 border border-slate-700/60 text-slate-300">↑</kbd>
                      <kbd className="px-1.5 py-0.5 rounded bg-black/30 border border-slate-700/60 text-slate-300">↓</kbd>
                      <span className="hidden sm:inline">Điều hướng</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 rounded bg-black/30 border border-slate-700/60 text-slate-300">↵</kbd>
                      <span className="hidden sm:inline">Chọn</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 rounded bg-black/30 border border-slate-700/60 text-slate-300">ESC</kbd>
                      <span className="hidden sm:inline">Đóng</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsVoiceTourActive(!isVoiceTourActive)}
                      className={`text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                        isVoiceTourActive ? 'text-cyan-400' : 'text-slate-500'
                      }`}
                    >
                      <Compass className="w-3 h-3" />
                      <span>Voice Tour: {isVoiceTourActive ? 'BẬT' : 'TẮT'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('voice-log')}
                      className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Mic className="w-3 h-3" />
                      <span>Nhật ký giọng nói</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: Voice Command Log (Tracks the last 20 voice commands issued, replay & edit) */}
            {activeTab === 'voice-log' && (
              <div
                className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs"
                style={{ maxHeight: 'calc(85vh - 75px)' }}
              >
                {/* Log Header Banner & Filter */}
                <div
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    currentTheme === 'light'
                      ? 'bg-rose-50/70 border-rose-200 text-slate-800'
                      : 'bg-rose-950/20 border-rose-900/40 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                      <Mic className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm flex items-center gap-2">
                        <span>Nhật Ký Lệnh Giọng Nói (Voice Command Log)</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          {voiceLogs.length} / 20 Lệnh Gần Nhất
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Theo dõi, phát lại (Replay) hoặc chỉnh sửa (Edit) để thực thi lại các khẩu lệnh giọng nói
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={handleExportVoiceCommandsJSON}
                      disabled={voiceLogs.length === 0}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:pointer-events-none text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 cursor-pointer transition-all active:scale-95"
                      title="Xuất 20 lệnh giọng nói gần nhất ra file .JSON tải xuống máy để phân tích"
                    >
                      <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Xuất JSON ({Math.min(voiceLogs.length, 20)})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setVoiceLogs([]);
                        try {
                          localStorage.removeItem('hoppi_voice_command_log_history');
                        } catch (e) {}
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                      title="Làm trống nhật ký giọng nói cục bộ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>

                {/* Export Success Notification Banner */}
                <AnimatePresence>
                  {exportNotice && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -6, height: 0 }}
                      className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 flex items-center justify-between gap-2 text-xs shadow-sm shadow-emerald-500/10"
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-md bg-emerald-500/20 text-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <div>
                          <span className="font-bold">{exportNotice}</span>
                          <span className="text-[10px] opacity-75 font-mono ml-2 hidden sm:inline">
                            (Format: UTF-8 JSON • 20 Samples • Telemetry metadata included)
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setExportNotice(null)}
                        className="p-1 rounded hover:bg-emerald-500/20 text-emerald-400 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Filter Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                  <span className="text-slate-400 font-mono mr-1">Bộ lọc:</span>
                  {(['all', 'code', 'iot', 'sales', 'system'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setVoiceLogFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg font-mono transition-all cursor-pointer ${
                        voiceLogFilter === cat
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                          : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
                      }`}
                    >
                      {cat === 'all'
                        ? 'Tất cả (20)'
                        : cat === 'code'
                        ? 'Code Agent'
                        : cat === 'iot'
                        ? 'LAN IoT'
                        : cat === 'sales'
                        ? 'Sales CRM'
                        : 'Hệ thống'}
                    </button>
                  ))}
                </div>

                {/* Log Items List */}
                <div className="space-y-2">
                  {voiceLogs
                    .filter((l) => (voiceLogFilter === 'all' ? true : l.category === voiceLogFilter))
                    .map((logItem, idx) => (
                      <div
                        key={logItem.id || idx}
                        className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                          currentTheme === 'light'
                            ? 'bg-white border-slate-200 hover:border-cyan-400 shadow-sm'
                            : 'bg-slate-900/70 border-slate-800/80 hover:border-cyan-500/40'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0 font-mono text-xs font-bold">
                            {idx + 1}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs sm:text-sm text-slate-100 truncate">
                                "{logItem.command}"
                              </span>
                              <span
                                className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold ${
                                  logItem.category === 'code'
                                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                    : logItem.category === 'iot'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : logItem.category === 'sales'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                }`}
                              >
                                {logItem.category.toUpperCase()}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span>{logItem.timestamp}</span>
                              {logItem.durationMs && (
                                <span className="font-mono text-[10px] text-slate-500">
                                  • {logItem.durationMs}ms
                                </span>
                              )}
                              <span className="text-emerald-400 font-semibold">• Thành công</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleEditLog(logItem.command)}
                            title="Sửa lệnh này trong ô tìm kiếm để thực thi lại"
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Sửa & Chạy</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleReplayLog(logItem)}
                            title="Phát lại và thực thi lệnh này ngay lập tức"
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Phát Lại (Replay)</span>
                          </button>
                        </div>
                      </div>
                    ))}

                  {voiceLogs.length === 0 && (
                    <div className="p-8 text-center text-slate-500 space-y-2">
                      <Mic className="w-8 h-8 mx-auto text-slate-600" />
                      <p>Chưa có lệnh giọng nói nào được lưu. Hãy thử ra lệnh bằng mic hoặc voice tour!</p>
                    </div>
                  )}
                </div>

                {/* Telemetry Summary & Quick Download Bar */}
                {voiceLogs.length > 0 && (
                  <div
                    className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                      currentTheme === 'light'
                        ? 'bg-slate-50 border-slate-200 text-slate-700'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <FileJson className="w-4 h-4" />
                        <span>Telemetry Export</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400">
                        {Math.min(voiceLogs.length, 20)} lệnh gần nhất • Định dạng JSON RFC 8259
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleExportVoiceCommandsJSON}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>Tải Xuống Tệp JSON</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Voice & Mood Settings Panel */}
            {activeTab === 'voice-settings' && (
              <div
                className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 text-sm divide-y divide-slate-800/40"
                style={{ maxHeight: 'calc(85vh - 75px)' }}
              >
                {/* 1. Header Banner & Mascot Status */}
                <div
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    currentTheme === 'light'
                      ? 'bg-cyan-50/70 border-cyan-200 text-slate-800'
                      : 'bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-indigo-950/30 border-cyan-500/30 text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0">
                      <Headphones className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-cyan-400">Hoppi Voice & Mood Engine</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                          Local Auto-Save
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Tùy biến cao độ pitch, tốc độ đọc và phong cách xưng hô phản hồi giọng nói của Hoppi.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isTestingSpeech ? (
                      <button
                        type="button"
                        onClick={handleStopSpeech}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-500/30 cursor-pointer transition-all"
                      >
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>Dừng giọng đọc</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleTestSpeech()}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-cyan-400 cursor-pointer shadow-sm shadow-cyan-500/30 transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Nghe Thử Ngay</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Voice Pitch Adjustment */}
                <div className="pt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <label className="font-semibold text-xs sm:text-sm flex items-center gap-1.5">
                          <Sliders className="w-4 h-4 text-cyan-400" />
                          <span>Cao độ Giọng nói (Voice Pitch Adjustment)</span>
                        </label>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {voiceSettingsState.pitch.toFixed(2)}x
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Điều chỉnh độ cao thanh âm của Web Speech Synthesis (0.5x trầm ấm - 2.0x thanh thoát).
                      </p>
                    </div>

                    <span
                      className={`text-[11px] font-medium px-2 py-1 rounded-md ${
                        voiceSettingsState.pitch < 0.95
                          ? 'bg-indigo-500/20 text-indigo-300'
                          : voiceSettingsState.pitch <= 1.25
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {voiceSettingsState.pitch < 0.9
                        ? '🎙️ Trầm ấm & Quyết đoán'
                        : voiceSettingsState.pitch < 1.1
                        ? '🌿 Tự nhiên & Điềm đạm'
                        : voiceSettingsState.pitch <= 1.25
                        ? '✨ Hoppi Tươi vui (Signature)'
                        : '🎉 Hoạt hình & Nhí nhảnh'}
                    </span>
                  </div>

                  {/* Pitch Slider */}
                  <div className="space-y-1.5">
                    <input
                      type="range"
                      min={0.5}
                      max={2.0}
                      step={0.05}
                      value={voiceSettingsState.pitch}
                      onChange={(e) => updateAndPersistSettings({ pitch: parseFloat(e.target.value) })}
                      className="w-full h-2 rounded-lg bg-slate-800 accent-cyan-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>0.5x (Rất Trầm)</span>
                      <span>1.0x (Chuẩn)</span>
                      <span className="text-cyan-400 font-semibold">1.15x (Khuyên dùng)</span>
                      <span>1.5x (Cao)</span>
                      <span>2.0x (Tối đa)</span>
                    </div>
                  </div>

                  {/* Pitch Presets Quick Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 uppercase font-mono mr-1">Mẫu nhanh:</span>
                    {[
                      { label: 'Trầm ấm', value: 0.8 },
                      { label: 'Tự nhiên', value: 1.0 },
                      { label: 'Hoppi Tươi Vui', value: 1.15, isRecommended: true },
                      { label: 'Năng động', value: 1.3 },
                      { label: 'Hoạt hình', value: 1.5 },
                    ].map((p) => {
                      const isActive = Math.abs(voiceSettingsState.pitch - p.value) < 0.03;
                      return (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => updateAndPersistSettings({ pitch: p.value })}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-medium ${
                            isActive
                              ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-sm shadow-cyan-500/20'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                          }`}
                        >
                          {p.label} ({p.value}x)
                          {p.isRecommended && <span className="ml-1 text-[9px] text-cyan-400">★</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Speech Rate & Volume Adjustment */}
                <div className="pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Rate */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Tốc độ Đọc (Speech Rate)</span>
                      </label>
                      <span className="text-xs font-mono font-semibold text-indigo-300">
                        {voiceSettingsState.rate.toFixed(2)}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.6}
                      max={1.8}
                      step={0.05}
                      value={voiceSettingsState.rate}
                      onChange={(e) => updateAndPersistSettings({ rate: parseFloat(e.target.value) })}
                      className="w-full h-2 rounded-lg bg-slate-800 accent-indigo-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>0.6x Chậm</span>
                      <span className="text-indigo-400 font-semibold">1.05x Chuẩn</span>
                      <span>1.8x Cực nhanh</span>
                    </div>
                    <div className="flex items-center gap-1 pt-1">
                      {[
                        { label: 'Chậm', val: 0.85 },
                        { label: 'Chuẩn', val: 1.05 },
                        { label: 'Nhanh', val: 1.25 },
                        { label: 'Siêu tốc', val: 1.5 },
                      ].map((r) => (
                        <button
                          key={r.label}
                          type="button"
                          onClick={() => updateAndPersistSettings({ rate: r.val })}
                          className={`text-[11px] px-2 py-0.5 rounded border cursor-pointer ${
                            Math.abs(voiceSettingsState.rate - r.val) < 0.03
                              ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Volume */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Âm lượng Phát âm (Volume)</span>
                      </label>
                      <span className="text-xs font-mono font-semibold text-emerald-300">
                        {Math.round(voiceSettingsState.volume * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.1}
                      max={1.0}
                      step={0.05}
                      value={voiceSettingsState.volume}
                      onChange={(e) => updateAndPersistSettings({ volume: parseFloat(e.target.value) })}
                      className="w-full h-2 rounded-lg bg-slate-800 accent-emerald-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>10% Dịu nhẹ</span>
                      <span>50%</span>
                      <span className="text-emerald-400 font-semibold">100% Rõ nét</span>
                    </div>
                    <div className="flex items-center gap-1 pt-1">
                      {[
                        { label: 'Nhỏ', val: 0.4 },
                        { label: 'Vừa', val: 0.75 },
                        { label: 'Tối đa', val: 1.0 },
                      ].map((v) => (
                        <button
                          key={v.label}
                          type="button"
                          onClick={() => updateAndPersistSettings({ volume: v.val })}
                          className={`text-[11px] px-2 py-0.5 rounded border cursor-pointer ${
                            Math.abs(voiceSettingsState.volume - v.val) < 0.05
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Response Style Presets */}
                <div className="pt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-semibold text-xs sm:text-sm flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Phong cách Phản hồi & Tính cách Hoppi (Response Style)</span>
                      </label>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Chọn phong cách giọng điệu trả lời ưa thích cho Hoppi khi đàm thoại và phát âm thanh.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {voiceSettingsState.responseStyle}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {[
                      {
                        id: 'energetic' as ResponseStylePreset,
                        title: 'Năng động & Trực diện',
                        subtitle: 'Hào hứng, nhiệt huyết, hành động ngay',
                        icon: <Zap className="w-4 h-4 text-amber-400" />,
                        sample: 'Dạ em chào anh Hải! Em đã hoàn thành toàn bộ tác vụ...',
                      },
                      {
                        id: 'empathetic' as ResponseStylePreset,
                        title: 'Ấm áp & Thấu cảm',
                        subtitle: 'Ân cần, dịu dàng, chăm sóc sức khỏe',
                        icon: <Heart className="w-4 h-4 text-rose-400" />,
                        sample: 'Anh Hải ơi, anh nhớ uống chút nước ấm và nghỉ ngơi nhé...',
                      },
                      {
                        id: 'technical' as ResponseStylePreset,
                        title: 'Kỹ sư Chuyên sâu',
                        subtitle: 'Chuẩn xác, thông số AST, RAM, ms',
                        icon: <Cpu className="w-4 h-4 text-indigo-400" />,
                        sample: 'Xác nhận AST_OK, độ trễ 12ms, 5 node mesh pass 100%...',
                      },
                      {
                        id: 'concise' as ResponseStylePreset,
                        title: 'Tối giản Cấp tốc',
                        subtitle: 'Dưới 20 từ, súc tích, phản hồi tức thì',
                        icon: <Clock className="w-4 h-4 text-emerald-400" />,
                        sample: 'Đã hoàn thành tác vụ. Toàn bộ thiết bị đã đồng bộ xong.',
                      },
                      {
                        id: 'playful' as ResponseStylePreset,
                        title: 'Người bạn Vui nhộn',
                        subtitle: 'Hóm hỉnh, nhí nhảnh, mascot Hoppi',
                        icon: <Smile className="w-4 h-4 text-cyan-400" />,
                        sample: 'Ting ting! Hoppi làm xong vèo vèo trong một nốt nhạc...',
                      },
                      {
                        id: 'custom' as ResponseStylePreset,
                        title: 'Tùy biến Riêng biệt',
                        subtitle: 'Kịch bản xưng hô & prompt tự tạo',
                        icon: <Settings2 className="w-4 h-4 text-purple-400" />,
                        sample: 'Tuân thủ chỉ dẫn prompt đặc biệt của anh Hải bên dưới...',
                      },
                    ].map((style) => {
                      const isSelected = voiceSettingsState.responseStyle === style.id;
                      return (
                        <div
                          key={style.id}
                          onClick={() => updateAndPersistSettings({ responseStyle: style.id })}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 text-left relative ${
                            isSelected
                              ? currentTheme === 'light'
                                ? 'bg-cyan-50 border-cyan-500 shadow-md ring-1 ring-cyan-400'
                                : 'bg-slate-900 border-cyan-400/80 shadow-md shadow-cyan-500/15 ring-1 ring-cyan-500/40'
                              : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80 text-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-black/30 shrink-0">
                                {style.icon}
                              </div>
                              <div>
                                <h5 className="font-semibold text-xs sm:text-sm text-slate-100 flex items-center gap-1.5">
                                  {style.title}
                                </h5>
                                <p className="text-[10px] text-slate-400">{style.subtitle}</p>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="p-0.5 rounded-full bg-cyan-500 text-slate-950 shrink-0">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            )}
                          </div>

                          <div className="text-[10px] text-slate-400 italic bg-black/20 p-1.5 rounded-md border border-white/5 line-clamp-1">
                            "{style.sample}"
                          </div>

                          <div className="flex justify-end pt-0.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateAndPersistSettings({ responseStyle: style.id });
                                handleTestSpeech(undefined, style.id);
                              }}
                              className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold cursor-pointer"
                            >
                              <Play className="w-2.5 h-2.5 fill-current" />
                              <span>Nghe thử phong cách này</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Custom Persona & Prompt Instruction */}
                <div className="pt-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold flex items-center gap-1.5">
                      <Bot className="w-3.5 h-3.5 text-purple-400" />
                      <span>Chỉ dẫn Xưng hô & Tính cách Riêng cho Hoppi (Custom Persona Prompt)</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Đồng bộ Prompt LLM</span>
                  </div>
                  <textarea
                    rows={3}
                    value={voiceSettingsState.customPromptInstruction}
                    onChange={(e) => updateAndPersistSettings({ customPromptInstruction: e.target.value })}
                    placeholder="Ví dụ: Chào anh Hải với năng lượng tích cực, xưng hô 'anh Hải - Hoppi', kết thúc bằng lời chúc ngày làm việc hiệu quả..."
                    className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                      currentTheme === 'light'
                        ? 'bg-white border-slate-300 text-slate-800 focus:border-cyan-500'
                        : 'bg-slate-900 border-slate-800 text-slate-200 focus:border-cyan-500/70 placeholder:text-slate-600'
                    }`}
                  />
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10.5px]">
                    <span className="text-slate-500">Gợi ý chèn:</span>
                    {[
                      'Dạ anh Hải ơi',
                      'Luôn cổ vũ tinh thần',
                      'Ngắn gọn dưới 25 từ',
                      'Tập trung số liệu kỹ thuật',
                      'Thân mật hài hước',
                    ].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => {
                          const current = voiceSettingsState.customPromptInstruction || '';
                          const next = current ? `${current}, ${chip.toLowerCase()}` : chip;
                          updateAndPersistSettings({ customPromptInstruction: next });
                        }}
                        className="px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/50 cursor-pointer transition-colors"
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. Interaction Toggles & Language Selector */}
                <div className="pt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Auto speak */}
                  <label
                    onClick={() => updateAndPersistSettings({ autoSpeakReplies: !voiceSettingsState.autoSpeakReplies })}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                      voiceSettingsState.autoSpeakReplies
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-200'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs text-slate-200">Tự động Phát Giọng</div>
                      <div className="text-[10px] text-slate-400">Đọc câu trả lời chat tự động</div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center border ${
                        voiceSettingsState.autoSpeakReplies
                          ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-bold'
                          : 'border-slate-700 bg-slate-800'
                      }`}
                    >
                      {voiceSettingsState.autoSpeakReplies && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </label>

                  {/* Sync avatar mood */}
                  <label
                    onClick={() =>
                      updateAndPersistSettings({ syncAvatarMoodWithVoice: !voiceSettingsState.syncAvatarMoodWithVoice })
                    }
                    className={`p-3 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                      voiceSettingsState.syncAvatarMoodWithVoice
                        ? 'bg-purple-500/10 border-purple-500/40 text-purple-200'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs text-slate-200">Avatar Mood Echo</div>
                      <div className="text-[10px] text-slate-400">Đồng bộ biểu cảm theo tông giọng</div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center border ${
                        voiceSettingsState.syncAvatarMoodWithVoice
                          ? 'bg-purple-500 border-purple-400 text-white font-bold'
                          : 'border-slate-700 bg-slate-800'
                      }`}
                    >
                      {voiceSettingsState.syncAvatarMoodWithVoice && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </label>

                  {/* Language */}
                  <div className="p-3 rounded-xl border bg-slate-900/40 border-slate-800 flex items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-xs text-slate-200">Ngôn ngữ Ưu tiên</div>
                      <div className="text-[10px] text-slate-400">Web Speech Engine</div>
                    </div>
                    <select
                      value={voiceSettingsState.preferredVoiceLang}
                      onChange={(e) =>
                        updateAndPersistSettings({
                          preferredVoiceLang: e.target.value as 'vi-VN' | 'en-US',
                        })
                      }
                      className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 focus:outline-none cursor-pointer"
                    >
                      <option value="vi-VN">🇻🇳 Tiếng Việt</option>
                      <option value="en-US">🇺🇸 English</option>
                    </select>
                  </div>
                </div>

                {/* 7. Live Interactive Speech Tester */}
                <div
                  className={`p-4 rounded-xl border space-y-3 ${
                    currentTheme === 'light'
                      ? 'bg-slate-100/90 border-slate-300'
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-cyan-400" />
                      <span className="font-semibold text-xs">Mẫu Âm Thanh Thử Nghiệm Trực Tiếp</span>
                    </div>

                    {isTestingSpeech && (
                      <div className="flex items-center gap-1.5 text-xs text-cyan-400 animate-pulse font-mono">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        <span>Đang phát thanh...</span>
                        {/* Audio decibel equalizer animation */}
                        <div className="flex items-end gap-0.5 h-3.5 ml-1">
                          <span className="w-0.5 bg-cyan-400 rounded-full animate-bounce h-2" />
                          <span className="w-0.5 bg-cyan-400 rounded-full animate-bounce delay-75 h-3.5" />
                          <span className="w-0.5 bg-cyan-400 rounded-full animate-bounce delay-150 h-2.5" />
                          <span className="w-0.5 bg-cyan-400 rounded-full animate-bounce delay-100 h-3" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-3 rounded-lg bg-black/40 border border-slate-800 text-xs text-slate-300 italic font-sans leading-relaxed">
                    "{getSampleTextForStyle(voiceSettingsState.responseStyle, voiceSettingsState.customPromptInstruction)}"
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      {isTestingSpeech ? (
                        <button
                          type="button"
                          onClick={handleStopSpeech}
                          className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
                        >
                          <Square className="w-3.5 h-3.5 fill-current" />
                          <span>Dừng Phát</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleTestSpeech()}
                          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-cyan-500/25 transition-all"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Phát Thử Giọng Với Pitch {voiceSettingsState.pitch.toFixed(2)}x</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleResetToDefault}
                        className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Khôi phục Mặc định</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSaveNotice('Đã lưu tất cả thiết lập!');
                          setTimeout(() => setSaveNotice(null), 2000);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Đã Tự Động Lưu</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 8. Panel Footer Back Button */}
                <div className="pt-4 flex items-center justify-between text-xs font-mono text-slate-400">
                  <button
                    type="button"
                    onClick={() => setActiveTab('commands')}
                    className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 cursor-pointer font-semibold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Quay lại Danh sách Lệnh & Tìm kiếm</span>
                  </button>

                  <div className="text-[11px] text-slate-500">
                    Kho lưu trữ: <code className="text-slate-400">localStorage[hoppi_voice_mood_settings_v1]</code>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

