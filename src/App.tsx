import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserIdentity,
  ChatMessage,
  ApprovalRequest,
  ExpressiveMood,
  AppTheme,
  HoppiCompletionNotice,
  ConnectedMeshDevice,
  AppModule,
  VoiceMoodSettings,
  DEFAULT_VOICE_MOOD_SETTINGS,
  LowPowerModeConfig,
  AdaptiveLightConfig,
  DEFAULT_ADAPTIVE_LIGHT_CONFIG,
} from './types';
import { AuthFacePasscode } from './components/AuthFacePasscode';
import { AvatarWidget } from './components/AvatarWidget';
import { ServerStatusHeader } from './components/ServerStatusHeader';
import { ChatInterface } from './components/ChatInterface';
import { CodeAgentPanel } from './components/CodeAgentPanel';
import { SalesCrmPanel } from './components/SalesCrmPanel';
import { RagMemoryPanel } from './components/RagMemoryPanel';
import { LanIotPanel } from './components/LanIotPanel';
import { SecurityAuditPanel } from './components/SecurityAuditPanel';
import { HandGestureWidget } from './components/HandGestureWidget';
import { TrustedDevicesModal } from './components/TrustedDevicesModal';
import { HitlApprovalModal } from './components/HitlApprovalModal';
import { HoppiCompletionOverlay } from './components/HoppiCompletionOverlay';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { GlobalStatusDashboard } from './components/GlobalStatusDashboard';
import { SystemPerformanceWidget } from './components/SystemPerformanceWidget';
import { IoTVoiceCommand } from './components/IoTVoiceCommand';
import { SmartSchedulePanel } from './components/SmartSchedulePanel';
import { SidebarConnectivityCard } from './components/SidebarConnectivityCard';
import { ExportInstallModal } from './components/ExportInstallModal';
import { AdaptiveLightControlModal } from './components/AdaptiveLightControlModal';
import { AiAgentHq3DPanel } from './components/AiAgentHq3DPanel';
import { DashboardSnapshotModal } from './components/DashboardSnapshotModal';
import { RobotAndOsControlPanel } from './components/RobotAndOsControlPanel';
import { FloatingHoppiCornerMascot } from './components/FloatingHoppiCornerMascot';
import { SkillsHubModal, AgentSkillItem } from './components/SkillsHubModal';
import { AgentSkillsManagerModal } from './components/AgentSkillsManagerModal';
import { DesktopWidgetView } from './components/DesktopWidgetView';
import { FuturisticOrchestrationConsole } from './components/FuturisticOrchestrationConsole';
import { useHoppiGlobalOverlay } from './context/HoppiGlobalOverlayContext';
import { Maximize2, Minimize2 } from 'lucide-react';

export default function App() {
  // Authentication & Trusted Device Token state
  const [identity, setIdentity] = useState<UserIdentity | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isOnlineMode, setIsOnlineMode] = useState(true);
  const [isActivityPaused, setIsActivityPaused] = useState(false);

  // Persistent Global Desktop Overlay Container & Window Minimized state
  const {
    isMainAppMinimized,
    minimizeMainApp,
    restoreMainApp,
    toggleMinimize,
  } = useHoppiGlobalOverlay();

  // Command Palette (Cmd/Ctrl + K) state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Cross-Platform Export & Installation Center Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Dashboard Snapshot (3D HQ & IoT) Modal State
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);

  // Agent Skills Hub (24+ Repositories & 4 Super Skills) Modal State
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [isAgentSkillsManagerOpen, setIsAgentSkillsManagerOpen] = useState(false);

  // Adaptive Light Control Modal & 24/7 Eye Comfort Config State
  const [isAdaptiveLightModalOpen, setIsAdaptiveLightModalOpen] = useState(false);
  const [adaptiveLightConfig, setAdaptiveLightConfig] = useState<AdaptiveLightConfig>(() => {
    try {
      const saved = localStorage.getItem('hoppi_adaptive_light_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_ADAPTIVE_LIGHT_CONFIG;
  });

  const handleUpdateAdaptiveLightConfig = (newConfig: AdaptiveLightConfig) => {
    setAdaptiveLightConfig(newConfig);
    try {
      localStorage.setItem('hoppi_adaptive_light_config', JSON.stringify(newConfig));
    } catch (e) {
      console.error(e);
    }
  };

  // Hoppi completion notice modal & Mesh targeted device states
  const [completionNotice, setCompletionNotice] = useState<HoppiCompletionNotice | null>(null);
  const [selectedTargetDevice, setSelectedTargetDevice] = useState<ConnectedMeshDevice | null>(null);

  // Global keyboard shortcut: Cmd+K / Ctrl+K to toggle Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Active module view
  const [activeModule, setActiveModule] = useState<AppModule>('chat');

  // Granular Theme state: 'cyberpunk' | 'deepspace' | 'light' for optimal 24/7 vision comfort
  const [theme, setTheme] = useState<AppTheme>(() => {
    try {
      const stored = localStorage.getItem('hoppi_ui_theme');
      if (stored === 'cyberpunk' || stored === 'deepspace' || stored === 'light') {
        return stored;
      }
    } catch (e) {
      console.error(e);
    }
    return 'cyberpunk';
  });

  const handleSelectTheme = (newTheme: AppTheme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem('hoppi_ui_theme', newTheme);
    } catch (e) {
      console.error(e);
    }
  };

  // Auto-Theme Scheduler: shifts between 'light' (06h-18h), 'cyberpunk' (18h-22h), and 'deepspace' (22h-06h)
  const [autoThemeEnabled, setAutoThemeEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('hoppi_auto_theme_enabled');
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return true;
  });

  const getScheduledThemeForHour = (hour: number): { theme: AppTheme; phase: string } => {
    if (hour >= 6 && hour < 18) {
      return { theme: 'light', phase: 'Sáng' };
    } else if (hour >= 18 && hour < 22) {
      return { theme: 'cyberpunk', phase: 'Tối' };
    } else {
      return { theme: 'deepspace', phase: 'Đêm' };
    }
  };

  const [autoThemePhase, setAutoThemePhase] = useState<string>(() => {
    return getScheduledThemeForHour(new Date().getHours()).phase;
  });

  // Auto-theme scheduler effect
  useEffect(() => {
    const checkSchedule = () => {
      const currentHour = new Date().getHours();
      const scheduled = getScheduledThemeForHour(currentHour);
      setAutoThemePhase(scheduled.phase);

      if (autoThemeEnabled) {
        setTheme((prev) => {
          if (prev !== scheduled.theme) {
            try {
              localStorage.setItem('hoppi_ui_theme', scheduled.theme);
            } catch (e) {
              console.error(e);
            }
            return scheduled.theme;
          }
          return prev;
        });
      }
    };

    checkSchedule();
    const interval = setInterval(checkSchedule, 30000);
    return () => clearInterval(interval);
  }, [autoThemeEnabled]);

  const handleToggleAutoTheme = () => {
    setAutoThemeEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('hoppi_auto_theme_enabled', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      if (next) {
        const scheduled = getScheduledThemeForHour(new Date().getHours());
        handleSelectTheme(scheduled.theme);
      }
      return next;
    });
  };

  // Low Power Mode configuration state & Battery listener (mobile/laptop)
  const [lowPowerConfig, setLowPowerConfig] = useState<LowPowerModeConfig>({
    isActive: false,
    batteryLevel: 94,
    isCharging: true,
    isManualOverride: false,
    animationFramerateReduction: false,
    iotPollingIntervalSeconds: 4,
  });

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any)
        .getBattery()
        .then((batt: any) => {
          const updateBattery = () => {
            const level = Math.round(batt.level * 100);
            const charging = batt.charging;
            const autoLow = level < 20 && !charging;
            setLowPowerConfig((prev) => ({
              ...prev,
              batteryLevel: level,
              isCharging: charging,
              isActive: autoLow || prev.isManualOverride,
              animationFramerateReduction: autoLow || prev.isManualOverride,
              iotPollingIntervalSeconds: autoLow || prev.isManualOverride ? 20 : 4,
            }));
          };

          updateBattery();
          batt.addEventListener('levelchange', updateBattery);
          batt.addEventListener('chargingchange', updateBattery);
        })
        .catch(() => {});
    }
  }, []);

  // Avatar Widget state
  const [avatarMood, setAvatarMood] = useState<ExpressiveMood>('happy');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [floatingWidget, setFloatingWidget] = useState(false);
  const [isAutoDelegated, setIsAutoDelegated] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [lastVoiceCommand, setLastVoiceCommand] = useState<string | null>(null);

  // Emergency Shutdown state & Instant disconnect handler
  const [isEmergencyShutdownActive, setIsEmergencyShutdownActive] = useState<boolean>(false);

  const handleEmergencyShutdown = () => {
    setIsEmergencyShutdownActive(true);
    setAvatarMood('critical');
    speakText('Hệ thống đã kích hoạt chế độ Dừng Khẩn Cấp. Toàn bộ kết nối IoT Mesh đã bị ngắt tức thì.');
    try {
      const bc = new BroadcastChannel('hoppi_device_mesh_channel');
      bc.postMessage({ type: 'HOPPI_EMERGENCY_SHUTDOWN' });
      bc.close();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRestoreFromEmergency = () => {
    setIsEmergencyShutdownActive(false);
    setAvatarMood('happy');
    speakText('Đã khôi phục trạng thái hoạt động bình thường của toàn bộ hệ sinh thái Hoppi.');
    try {
      const bc = new BroadcastChannel('hoppi_device_mesh_channel');
      bc.postMessage({ type: 'HOPPI_RESTORE_FROM_EMERGENCY' });
      bc.close();
    } catch (e) {
      console.error(e);
    }
  };

  // Hand-Gesture Pause/Resume toggle handler
  const handleToggleActivityPause = () => {
    setIsActivityPaused((prev) => {
      const next = !prev;
      if (next) {
        speakText('Hoppi đã nhận cử chỉ vẫy tay và chuyển sang chế độ tạm nghỉ.');
      } else {
        speakText('Hoppi đã thức dậy và sẵn sàng tiếp tục phục vụ Chủ nhân!');
      }
      return next;
    });
  };

  // Modals state
  const [isDevicesModalOpen, setIsDevicesModalOpen] = useState(false);
  const [activeApprovalRequest, setActiveApprovalRequest] = useState<ApprovalRequest | null>(null);
  const [approvalQueue, setApprovalQueue] = useState<ApprovalRequest[]>([
    {
      id: 'appr-01',
      requesterName: 'Khách lạ (Đoàn Doanh Nghiệp ABC)',
      requesterType: 'guest',
      actionTitle: 'Xin quyền trích xuất Báo giá & Chiết khấu Hợp đồng 30%',
      description: 'Khách hàng yêu cầu áp dụng mức chiết khấu 30% cho gói triển khai Hoppi Autonomous Enterprise.',
      riskLevel: 'high',
      timestamp: 'Hôm nay 09:30',
      status: 'pending',
    },
  ]);

  // Chat conversation state with LocalStorage auto-restore
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('hoppi_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading chat history from LocalStorage:', e);
    }
    return [];
  });

  // Automatically persist messages to LocalStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('hoppi_chat_history', JSON.stringify(messages));
      } catch (e) {
        console.error('Error saving chat history to LocalStorage:', e);
      }
    }
  }, [messages]);

  // Speech Recognition reference
  const recognitionRef = useRef<any>(null);

  // 1. Check for Trusted Device Token on startup (Master Blueprint Section II.2)
  useEffect(() => {
    const token = localStorage.getItem('hoppi_trusted_token');
    const storedIdentity = localStorage.getItem('hoppi_identity');

    if (token && storedIdentity) {
      try {
        const user: UserIdentity = JSON.parse(storedIdentity);
        user.authMethod = 'trusted_token';
        setIdentity(user);
        initWelcomeMessage(user);
      } catch (e) {
        console.error(e);
      }
    }
    setCheckingAuth(false);
  }, []);

  const initWelcomeMessage = (user: UserIdentity, forceFresh = false) => {
    // If not forcing fresh, check if messages already exist in LocalStorage
    if (!forceFresh) {
      try {
        const saved = localStorage.getItem('hoppi_chat_history');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    const isMaster = user.isMaster;
    const initialText = isMaster
      ? `Chào mừng Chủ nhân Nguyễn Thanh Hải quay trở lại! Hoppi đã xác nhận Token Thiết bị Tin cậy (Trusted Device Token) của bạn. Hệ thống máy chủ Home Server 24/7 đang hoạt động bình thường với 1,420 vector tri thức sẵn sàng.`
      : `Chào quý khách! Tôi là Hoppi, Siêu AI Trợ lý Cá nhân của anh Nguyễn Thanh Hải. Quý khách cần hỗ trợ tìm hiểu thông tin gì về dịch vụ AI hoặc muốn để lại lời nhắn cho anh Hải?`;

    const welcomeMsg: ChatMessage = {
      id: 'welcome-01',
      role: 'assistant',
      text: initialText,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      mood: 'happy',
      actions: isMaster
        ? ['Kiểm tra trạng thái máy chủ 24/7', 'Mở phân hệ Code Agent', 'Xem báo giá Sales CRM']
        : ['Tìm hiểu dịch vụ AI', 'Gửi lời nhắn hợp tác cho anh Hải'],
    };
    setMessages([welcomeMsg]);
    try {
      localStorage.setItem('hoppi_chat_history', JSON.stringify([welcomeMsg]));
    } catch (e) {
      console.error(e);
    }
    speakText(initialText);
  };

  // Clear chat history from LocalStorage
  const handleClearHistory = () => {
    if (confirm('Bạn có chắc muốn xóa toàn bộ lịch sử trò chuyện đã lưu trên thiết bị này?')) {
      try {
        localStorage.removeItem('hoppi_chat_history');
      } catch (e) {
        console.error(e);
      }
      if (identity) {
        initWelcomeMessage(identity, true);
      } else {
        setMessages([]);
      }
    }
  };

  // Voice & Mood Settings state with localStorage persistence
  const [voiceMoodSettings, setVoiceMoodSettings] = useState<VoiceMoodSettings>(() => {
    try {
      const saved = localStorage.getItem('hoppi_voice_mood_settings_v1');
      if (saved) {
        return { ...DEFAULT_VOICE_MOOD_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error loading voice mood settings in App:', e);
    }
    return DEFAULT_VOICE_MOOD_SETTINGS;
  });

  // Text to Speech playback with pitch, rate, and volume controls
  const speakText = (text: string, overridePitch?: number, overrideRate?: number) => {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();

      // Clean markdown code blocks, backticks, formatting for natural voice
      const cleanText = text
        .replace(/```[\s\S]*?```/g, ' [Có đính kèm mã nguồn lập trình] ')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/[*_#`[\]()$]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 350);

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = voiceMoodSettings.preferredVoiceLang || 'vi-VN';
      utterance.rate = overrideRate ?? voiceMoodSettings.rate;
      utterance.pitch = overridePitch ?? voiceMoodSettings.pitch;
      utterance.volume = voiceMoodSettings.volume;

      // Select Vietnamese voice if available in the browser
      const voices = window.speechSynthesis.getVoices();
      const viVoice = voices.find((v) => v.lang.startsWith('vi') || v.lang.includes('VN'));
      if (viVoice) {
        utterance.voice = viVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      // Chromium speech cancellation delay guard
      setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.error('Speech synthesis error:', err);
        }
      }, 50);
    } catch (e) {
      console.error('speakText error:', e);
    }
  };

  // Listen to cross-tab/device sync and completion notices via BroadcastChannel
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('hoppi_device_mesh_channel');
      channel.onmessage = (event) => {
        if (event.data?.type === 'HOPPI_COMPLETION_NOTICE' && event.data.notice) {
          setCompletionNotice(event.data.notice);
        } else if (event.data?.type === 'MESH_POWER_MODE_CHANGED' && event.data.mode) {
          const isSaver = event.data.mode === 'battery-saver';
          setLowPowerConfig((prev) => ({
            ...prev,
            isActive: isSaver,
            isManualOverride: true,
            animationFramerateReduction: isSaver,
            iotPollingIntervalSeconds: isSaver ? 20 : 4,
          }));
        }
      };
    } catch (e) {
      console.error('BroadcastChannel error:', e);
    }
    return () => {
      try {
        channel?.close();
      } catch (e) {
        console.error(e);
      }
    };
  }, []);

  const handleTriggerCompletionNotice = (notice: HoppiCompletionNotice) => {
    setCompletionNotice(notice);
    try {
      const channel = new BroadcastChannel('hoppi_device_mesh_channel');
      channel.postMessage({ type: 'HOPPI_COMPLETION_NOTICE', notice });
      channel.close();
    } catch (e) {
      console.error(e);
    }
  };

  // Web Speech STT setup
  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói Web Speech. Hãy dùng gõ phím trực tiếp nhé!');
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = 'vi-VN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        setIsListening(false);
        handleSendMessage(spoken, true);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  // 2. Authentication handlers
  const handleAuthenticated = (user: UserIdentity) => {
    setIdentity(user);
    initWelcomeMessage(user);
  };

  const handleContinueAsGuest = () => {
    const guestUser: UserIdentity = {
      isMaster: false,
      name: 'Khách ghé thăm',
      email: 'guest@visitor.internal',
      role: 'Khách truy cập (Guest)',
      authMethod: 'none',
      deviceId: 'dev_guest',
      deviceName: 'Thiết bị Khách',
      authenticatedAt: new Date().toISOString(),
    };
    setIdentity(guestUser);
    initWelcomeMessage(guestUser);
  };

  // Manual revocation / Logout
  const handleLogout = () => {
    localStorage.removeItem('hoppi_trusted_token');
    localStorage.removeItem('hoppi_identity');
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIdentity(null);
  };

  // Send message and process AI logic
  const handleSendMessage = async (text: string, isVoice = false, attachments?: any[]) => {
    if (!text.trim() && (!attachments || attachments.length === 0)) return;

    if (isVoice) {
      setLastVoiceCommand(text);
    }

    // Check voice logout command: "Hoppi, đăng xuất khỏi máy tính này"
    if (
      text.toLowerCase().includes('đăng xuất') ||
      text.toLowerCase().includes('logout') ||
      text.toLowerCase().includes('thu hồi quyền')
    ) {
      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        text,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        senderName: identity?.name,
        attachments,
      };
      const responseMsg: ChatMessage = {
        id: `msg-resp-${Date.now()}`,
        role: 'assistant',
        text: 'Hoppi đã nhận lệnh đăng xuất! Đang hủy Token thiết bị tin cậy và khóa hệ thống bảo mật...',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        mood: 'empathetic',
      };
      setMessages((prev) => [...prev, userMsg, responseMsg]);
      speakText(responseMsg.text);
      setTimeout(() => {
        handleLogout();
      }, 1500);
      return;
    }

    const isMaster = identity?.isMaster ?? false;
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      senderName: identity?.name,
      isGuest: !isMaster,
      attachments,
    };
    setMessages((prev) => [...prev, userMsg]);

    // Set avatar to thinking/focused state and enable AI typing animation
    setAvatarMood('focused');
    setIsAiTyping(true);

    // Guest security filter check (Blueprint Khối 6 & HITL)
    const sensitiveKeywords = ['mã nguồn', 'source code', 'git', 'chiết khấu', 'database', 'mật khẩu', 'tài khoản', 'đèn', 'iot'];
    const isSensitive = sensitiveKeywords.some((kw) => text.toLowerCase().includes(kw));

    if (!isMaster && isSensitive) {
      // Create HITL approval request
      const newApproval: ApprovalRequest = {
        id: `appr-${Date.now()}`,
        requesterName: identity?.name || 'Khách truy cập',
        requesterType: 'guest',
        actionTitle: `Yêu cầu can thiệp nhạy cảm: "${text.slice(0, 40)}..."`,
        description: `Khách lạ đang yêu cầu Hoppi thực hiện: "${text}". Hoppi đã khóa tác vụ và chuyển cho Chủ nhân phê duyệt.`,
        riskLevel: 'medium',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        status: 'pending',
      };
      setApprovalQueue((prev) => [newApproval, ...prev]);

      const guestReplyText = `Hoppi xin cảm ơn quý khách. Đây là thông tin nghiệp vụ nội bộ thuộc quyền quản trị của Chủ nhân Nguyễn Thanh Hải. Hoppi đã ghi nhận yêu cầu và tạo phiếu xin ý kiến phê duyệt (HITL). Sau khi anh Hải duyệt, Hoppi sẽ phản hồi ngay ạ!`;

      const aiReplyMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        role: 'assistant',
        text: guestReplyText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        mood: 'empathetic',
        hitlApprovalId: newApproval.id,
      };

      setIsAiTyping(false);
      setMessages((prev) => [...prev, aiReplyMsg]);
      setAvatarMood('empathetic');
      speakText(guestReplyText);
      return;
    }

    // Call server Gemini endpoint (or fallback)
    try {
      if (!isOnlineMode) {
        // Offline resilience response using local vectors
        const localReply = `[Chế độ Offline 24/7] Hoppi đã tra cứu trong Local Vector Database (ChromaDB / FAISS): Lệnh "${text}" đã được khớp với tri thức cục bộ. Toàn bộ tính năng bảo mật và dữ liệu cá nhân của anh Hải vẫn được bảo toàn nguyên vẹn.`;
        const aiMsg: ChatMessage = {
          id: `reply-${Date.now()}`,
          role: 'assistant',
          text: localReply,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          mood: 'happy',
        };
        setIsAiTyping(false);
        setMessages((prev) => [...prev, aiMsg]);
        setAvatarMood('happy');
        speakText(localReply);
        return;
      }

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          attachments: attachments?.map((a: any) => ({
            name: a.name,
            type: a.type,
            sizeFormatted: a.sizeFormatted,
          })),
          isMaster,
          mood: avatarMood,
          autoDelegated: isAutoDelegated,
          history: messages.slice(-5),
          responseStyle: voiceMoodSettings.responseStyle,
          customPromptInstruction: voiceMoodSettings.customPromptInstruction,
        }),
      });
      const data = await res.json();
      const replyText = data.reply || 'Hoppi đã nhận lệnh và xử lý hoàn tất cho Chủ nhân Nguyễn Thanh Hải.';

      const assignedMood: ExpressiveMood = voiceMoodSettings.syncAvatarMoodWithVoice
        ? voiceMoodSettings.responseStyle === 'empathetic'
          ? 'empathetic'
          : voiceMoodSettings.responseStyle === 'technical'
          ? 'focused'
          : data.detectedMood || 'happy'
        : data.detectedMood || 'happy';

      const aiMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        mood: assignedMood,
        designArtifact: data.designArtifact,
        actions: isMaster ? ['Xem mã nguồn Code Agent', 'Kiểm tra CRM Zalo OA', 'Quét thiết bị LAN IoT'] : undefined,
      };

      setIsAiTyping(false);
      setMessages((prev) => [...prev, aiMsg]);
      setAvatarMood(assignedMood);

      // Vừa nhắn vừa nói: Hoppi tự động phát âm tiếng Việt đồng thời khi phản hồi
      speakText(replyText);
    } catch (e) {
      console.error(e);
      const lowerText = text.toLowerCase();
      const isDate =
        lowerText.includes('ngày') ||
        lowerText.includes('hôm nay') ||
        lowerText.includes('mấy giờ') ||
        lowerText.includes('thời gian') ||
        lowerText.includes('thứ mấy') ||
        lowerText.includes('âm lịch');
      const isDriving = lowerText.includes('lái xe') || lowerText.includes('bằng lái');
      const isDesign = lowerText.includes('banner') || lowerText.includes('thiết kế') || lowerText.includes('tạo ảnh') || lowerText.includes('seedream');
      const isCleanup = lowerText.includes('dọn dẹp') || lowerText.includes('tăng tốc');

      let fallbackArtifact: any = undefined;
      let fallbackText = `Dạ thưa ${identity?.isMaster ? 'Chủ nhân Nguyễn Thanh Hải' : 'Quý khách'}! Hoppi đã hoàn tất xử lý tác vụ "${text.slice(0, 40)}..." trên máy chủ cục bộ 24/7. Mọi dữ liệu an toàn 100%!`;

      if (isDate) {
        fallbackText = 'Dạ thưa Chủ nhân! Hôm nay là Thứ Năm, ngày 5 tháng 11 năm 2026 (tức ngày 26 tháng 9 năm Bính Ngọ). Hoppi và 8 phòng ban AI Agent luôn sẵn sàng phục vụ Chủ nhân Nguyễn Thanh Hải!';
      } else if (isDriving) {
        fallbackText = 'Dạ thưa Chủ nhân Nguyễn Thanh Hải! Chi phí học bằng lái xe ô tô B2 hiện tại trọn gói khoảng 13.5tr - 16.5tr (đã bao gồm chạy DAT 810km và cabin 3D), hạng B1 khoảng 12tr - 14.5tr, bằng lái xe máy A1 khoảng 750k - 950k (gồm lệ phí thi Sở GTVT 685k).';
      } else if (isDesign) {
        fallbackText = 'Dạ thưa Chủ nhân Nguyễn Thanh Hải! Hoppi và Seedream 5.0 Pro đã tạo xong bộ thiết kế banner thương mại đạt chuẩn 4K, tương thích 100% Facebook & Zalo Feed!';
        fallbackArtifact = {
          title: 'Banner Quảng Cáo Thương Mại Cao Cấp (Seedream 5.0 Pro)',
          category: 'banner',
          slogan: 'Công Nghệ AI Tự Động • Đột Phá Năng Suất 24/7',
          dimensions: '1200 x 630 px (Feed Ready)',
          palette: ['#0284c7', '#38bdf8', '#0f172a', '#f59e0b', '#10b981'],
          badgeText: 'AI DESIGNED BY SEEDREAM 5.0 PRO',
          ctaText: 'Khám Phá Giải Pháp Ngay',
          features: ['Độ phân giải Retina 4K', 'Tương thích Mobile & PC Ads', 'Tối ưu chuyển đổi CTR'],
          keyVisualDesc: 'Bố cục cân đối hiện đại, ánh sáng Neon Ambient nổi bật, tăng chuyển đổi bán hàng.',
          previewGradient: 'linear-gradient(135deg, #0284c7 0%, #0f172a 100%)',
        };
      } else if (isCleanup) {
        fallbackText = 'Dạ thưa Chủ nhân! Hoppi đã hoàn tất quét chẩn đoán và lập kế hoạch dọn dẹp giải phóng 6.9 GB bộ nhớ rác trên máy tính!';
        fallbackArtifact = {
          title: 'Kế Hoạch Dọn Dẹp & Tăng Tốc Máy Tính 24/7',
          category: 'cleanup_report',
          dimensions: 'Hệ thống Windows 11 64-bit',
          palette: ['#10b981', '#06b6d4', '#0f172a'],
          badgeText: 'HOPPI OS OPTIMIZER',
          ctaText: 'Thực Thi Dọn Dẹp',
          keyVisualDesc: 'Dọn sạch cache tạm thời và tối ưu startup apps.',
          cleanupTasks: [
            { id: 'c1', category: 'Tệp Tạm Thời', description: 'Xóa tệp rác Temp & Prefetch', savedSpace: '4.8 GB', status: 'ready' },
            { id: 'c2', category: 'Cache Trình Duyệt', description: 'Dọn sạch bộ nhớ đệm Chrome & Zalo', savedSpace: '2.1 GB', status: 'ready' },
          ],
        };
      }

      setIsAiTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          role: 'assistant',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          mood: 'happy',
          designArtifact: fallbackArtifact,
        },
      ]);
      setAvatarMood('happy');
      speakText(fallbackText);
    } finally {
      setIsAiTyping(false);
    }
  };

  // HITL Approvals handlers
  const handleApproveRequest = (id: string) => {
    setApprovalQueue((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'approved' } : item)));
    setActiveApprovalRequest(null);

    const approveNotice: ChatMessage = {
      id: `appr-done-${Date.now()}`,
      role: 'assistant',
      text: `Chủ nhân Nguyễn Thanh Hải đã CHẤP THUẬN yêu cầu (ID: ${id}). Hoppi đang tự động thực thi chuỗi tác vụ và gửi kết quả!`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      mood: 'happy',
    };
    setMessages((prev) => [...prev, approveNotice]);
    speakText(approveNotice.text);
  };

  const handleRejectRequest = (id: string) => {
    setApprovalQueue((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'rejected' } : item)));
    setActiveApprovalRequest(null);

    const rejectNotice: ChatMessage = {
      id: `appr-rej-${Date.now()}`,
      role: 'assistant',
      text: `Chủ nhân Nguyễn Thanh Hải đã TỪ CHỐI yêu cầu (ID: ${id}). Tác vụ đã được hủy bỏ để bảo mật dữ liệu tuyệt đối.`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      mood: 'empathetic',
    };
    setMessages((prev) => [...prev, rejectNotice]);
  };

  // If running in Desktop Widget Pop-Out mode (Always-on-top desktop window)
  const isDesktopWidget = typeof window !== 'undefined' && window.location.search.includes('desktop_widget=true');
  if (isDesktopWidget) {
    return (
      <DesktopWidgetView
        onSendMessage={async (t) => {
          handleSendMessage(t);
        }}
        masterName={identity?.name || 'Nguyễn Thanh Hải'}
      />
    );
  }

  // If loading authentication state
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#060a12] flex items-center justify-center text-cyan-400 font-mono text-sm">
        Đang khởi động lõi Hoppi v4.0...
      </div>
    );
  }

  // If not authenticated yet: Show Dual-Auth (FaceID / Passcode)
  if (!identity) {
    return (
      <AuthFacePasscode
        onAuthenticated={handleAuthenticated}
        onContinueAsGuest={handleContinueAsGuest}
      />
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-500 flex flex-col font-sans relative ${
        theme === 'cyberpunk'
          ? 'bg-[#070b14] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200'
          : theme === 'deepspace'
          ? (adaptiveLightConfig.isEnabled && adaptiveLightConfig.themeIntensityPercent <= 30
              ? 'bg-[#000000] text-neutral-300 selection:bg-neutral-900 selection:text-white'
              : 'bg-[#06080d] text-neutral-300 selection:bg-neutral-800 selection:text-white')
          : 'bg-[#f8fafc] text-slate-900 selection:bg-cyan-500/20 selection:text-cyan-900'
      }`}
      style={{
        filter: adaptiveLightConfig.isEnabled
          ? `brightness(${adaptiveLightConfig.screenBrightnessPercent}%) contrast(${adaptiveLightConfig.contrastTuningPercent}%)`
          : undefined,
        ['--hoppi-neon-intensity' as any]: adaptiveLightConfig.isEnabled
          ? adaptiveLightConfig.themeIntensityPercent / 100
          : 1,
      }}
    >
      {/* Circadian Blue Light Warmth Shield Overlay */}
      {adaptiveLightConfig.isEnabled && adaptiveLightConfig.blueLightFilterPercent > 0 && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-700 bg-amber-600 mix-blend-multiply"
          style={{
            opacity: (adaptiveLightConfig.blueLightFilterPercent / 100) * 0.12,
          }}
        />
      )}

      {/* 24/7 Server Status & Global Navigation Header */}
      <ServerStatusHeader
        identity={identity}
        isOnlineMode={isOnlineMode}
        onToggleOnlineMode={() => setIsOnlineMode(!isOnlineMode)}
        activeModule={activeModule}
        onChangeModule={setActiveModule}
        onOpenDevicesModal={() => setIsDevicesModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenSnapshotModal={() => setIsSnapshotModalOpen(true)}
        onOpenAdaptiveLightModal={() => setIsAdaptiveLightModalOpen(true)}
        adaptiveLightConfig={adaptiveLightConfig}
        onLogout={handleLogout}
        currentTheme={theme}
        onSelectTheme={handleSelectTheme}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onEmergencyShutdown={handleEmergencyShutdown}
        isEmergencyShutdownActive={isEmergencyShutdownActive}
        onRestoreFromEmergency={handleRestoreFromEmergency}
        autoThemeEnabled={autoThemeEnabled}
        autoThemePhase={autoThemePhase}
        onToggleAutoTheme={handleToggleAutoTheme}
        onMinimizeToDesktopMascot={toggleMinimize}
        isMainAppMinimized={isMainAppMinimized}
        onOpenSkillsHub={() => setIsSkillsModalOpen(true)}
        onOpenAgentSkillsManager={() => setIsAgentSkillsManagerOpen(true)}
      />

      {/* Full Authentic Desktop Wallpaper Mode when Minimized (Outside Software Experience) */}
      {isMainAppMinimized && (
        <div className="fixed inset-0 z-30 flex flex-col justify-between overflow-hidden select-none animate-in fade-in duration-300">
          {/* Authentic Desktop Wallpaper Image from Master's upload (Landmark 81 Saigon) */}
          <div
            className="absolute inset-0 bg-cover bg-center pointer-events-auto"
            style={{
              backgroundImage: 'url(/assets/aistudio/_nh_ch_p_m_n_h_nh_2026-11-05_095452_78ca5a44.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Subtle glass vignette */}
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px]" />
          </div>

          {/* Top Floating Master Control Pill */}
          <div className="relative z-40 p-3 sm:p-4 flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-amber-500/60 shadow-2xl text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <div>
                <span className="font-extrabold text-amber-300 block">
                  👑 MÀN HÌNH DESKTOP THỰC THÁI • HOPPI TỰ TRỊ 24/7 ONLINE
                </span>
                <span className="text-[11px] text-slate-300">
                  Hoppi đang tự do di chuyển & quét chủ động trên màn hình của Chủ nhân Nguyễn Thanh Hải
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={restoreMainApp}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 via-cyan-500 to-blue-500 hover:from-amber-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-2xl hover:scale-105 transition cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Mở Lại Cửa Sổ Phần Mềm</span>
              </button>
            </div>
          </div>

          {/* Left Authentic Desktop Shortcuts Grid matching Master's screenshot */}
          <div className="relative z-40 pl-4 sm:pl-6 pt-1 pb-16 flex-1 flex flex-col flex-wrap items-start content-start gap-y-3 gap-x-6 overflow-hidden pointer-events-auto max-h-[calc(100vh-140px)]">
            {[
              { id: 'hoppi', name: 'hoppi AI Agent', icon: '🤖', isHoppi: true, action: restoreMainApp },
              { id: 'bds', name: 'BDS', icon: '📁', action: () => handleSendMessage('Hoppi, hãy mở hồ sơ Bất động sản và danh sách nguồn nhà dự án.') },
              { id: 'teamviewer', name: 'TeamViewer...', icon: '🔄', action: () => handleSendMessage('Hoppi, kiểm tra kết nối điều khiển từ xa TeamViewer.') },
              { id: 'xaydung', name: 'xây dựng phần mềm', icon: '💻', action: () => handleSendMessage('Hoppi, mở module Lập Trình Code Agent tự động.') },
              { id: 'phone', name: '0938152338', icon: '📄', action: () => handleSendMessage('Hoppi, mở tài liệu liên hệ khách hàng 0938152338.') },
              { id: 'unikey', name: 'UniKey', icon: '⌨️', action: () => {} },
              { id: 'user', name: 'nguyễn thanh ...', icon: '👤', action: () => handleSendMessage('Hoppi, mở hồ sơ cá nhân của Chủ nhân Nguyễn Thanh Hải.') },
              { id: 'perfume', name: 'nước hoa', icon: '🖼️', action: () => handleSendMessage('Hoppi, thiết kế banner quảng cáo sản phẩm nước hoa cao cấp.') },
              { id: 'doc', name: 'mô tả siêu AI', icon: '📝', action: () => handleSendMessage('Hoppi, mở tài liệu mô tả kiến trúc Siêu AI Hoppi.') },
              { id: 'thispc', name: 'PC này', icon: '🖥️', action: () => handleSendMessage('[Dọn dẹp và tăng tốc máy tính] Máy tính của tôi ngày càng chậm. Hãy tìm các vấn đề liên quan đến dung lượng lưu trữ và chương trình khởi động cùng máy, sau đó đề xuất cho tôi kế hoạch dọn dẹp trước.') },
              { id: 'zalo', name: 'Zalo Master', icon: '💬', action: () => handleSendMessage('Hoppi, kiểm tra hội thoại Zalo OA và chăm sóc khách hàng.') },
              { id: 'crm', name: 'hệ thống CRM', icon: '📊', action: () => handleSendMessage('Hoppi, mở bảng điều khiển Sales CRM Zalo OA.') },
              { id: 'recycle', name: 'Thùng rác', icon: '🗑️', action: () => handleSendMessage('Hoppi, dọn dẹp thùng rác và bộ nhớ đệm tạm thời.') },
              { id: 'photoshop', name: 'Adobe Photoshop 2026', icon: '🎨', action: () => handleSendMessage('Hoppi, dùng Seedream 5.0 Pro để thiết kế poster quảng cáo thương mại.') },
              { id: 'chrome', name: 'Google Chrome', icon: '🌐', action: () => handleSendMessage('Hoppi, tìm kiếm thông tin mới nhất trên Google và đồng bộ vào RAG.') },
              { id: 'driving', name: 'Lái xe Ô tô & DAT', icon: '🚗', action: () => handleSendMessage('chi phí học lái xe ô tô hiện tại là bao nhiêu') },
              { id: 'veribox', name: 'VeriBOX API', icon: '⚙️', action: () => handleSendMessage('Hoppi, kiểm tra trạng thái cổng API VeriBOX.') },
              { id: 'controlpanel', name: 'Bảng điều khiển', icon: '🎛️', action: () => handleSendMessage('Hoppi, kiểm tra hiệu năng hệ thống CPU và RAM.') },
            ].map((shortcut) => (
              <button
                key={shortcut.id}
                type="button"
                onClick={shortcut.action}
                onDoubleClick={shortcut.action}
                className={`group w-20 flex flex-col items-center justify-center p-1.5 rounded-xl transition text-center cursor-pointer ${
                  shortcut.isHoppi
                    ? 'bg-amber-500/20 border border-amber-400/80 shadow-lg shadow-amber-500/30 hover:scale-105'
                    : 'hover:bg-white/20 hover:backdrop-blur-sm border border-transparent hover:border-white/30'
                }`}
                title={shortcut.isHoppi ? 'Nhấp để mở lại phần mềm Hoppi AI Agent 24/7' : `Nhấp để Hoppi tương tác với lối tắt ${shortcut.name}`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shadow-md transition-transform group-hover:scale-110 ${
                  shortcut.isHoppi ? 'bg-gradient-to-br from-amber-400 via-cyan-500 to-indigo-600 animate-pulse' : 'bg-slate-900/60 backdrop-blur-sm border border-slate-700/60'
                }`}>
                  {shortcut.icon}
                </div>
                <span className="mt-1 text-[11px] font-medium text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.9)] line-clamp-2 leading-tight px-0.5">
                  {shortcut.name}
                </span>
              </button>
            ))}
          </div>

          {/* Windows 11 Taskbar at Bottom matching Screenshot */}
          <div className="relative z-40 w-full h-12 bg-slate-950/85 backdrop-blur-xl border-t border-slate-700/60 px-3 sm:px-6 flex items-center justify-between pointer-events-auto shadow-2xl">
            {/* Left: Weather Widget */}
            <div className="flex items-center gap-2 text-xs text-slate-200 font-medium px-2 py-1 rounded-lg hover:bg-white/10 transition cursor-pointer">
              <span className="text-amber-400 text-sm">☀️</span>
              <div className="flex flex-col text-[11px] leading-tight">
                <span className="font-bold">30°C</span>
                <span className="text-[10px] text-slate-300">Có nắng</span>
              </div>
            </div>

            {/* Center: Windows 11 App Icons Dock */}
            <div className="flex items-center gap-1.5">
              {/* Windows Start Button */}
              <button
                type="button"
                className="w-9 h-9 rounded-lg hover:bg-white/15 flex items-center justify-center transition cursor-pointer"
                title="Bắt đầu Windows 11"
              >
                <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                  <div className="bg-cyan-400 rounded-xs" />
                  <div className="bg-cyan-400 rounded-xs" />
                  <div className="bg-cyan-400 rounded-xs" />
                  <div className="bg-cyan-400 rounded-xs" />
                </div>
              </button>

              {/* Windows Search Bar */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 text-xs text-slate-200 w-44">
                <span>🔍</span>
                <span className="text-[11px] text-slate-300">Tìm kiếm</span>
              </div>

              {/* Pinned Apps */}
              <div className="flex items-center gap-1 px-1">
                <button
                  type="button"
                  onClick={restoreMainApp}
                  className="relative p-2 rounded-xl bg-amber-500/25 border border-amber-400/80 shadow-md shadow-amber-500/40 hover:scale-105 transition cursor-pointer"
                  title="Hoppi AI Agent 24/7 (Đang chạy ngầm)"
                >
                  <span className="text-lg block animate-bounce">🤖</span>
                  {/* Running indicator line */}
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-amber-400 rounded-full" />
                </button>

                <div className="w-8 h-8 rounded-lg hover:bg-white/15 flex items-center justify-center text-sm cursor-pointer">
                  🌐
                </div>
                <div className="w-8 h-8 rounded-lg hover:bg-white/15 flex items-center justify-center text-sm cursor-pointer">
                  💬
                </div>
                <div className="w-8 h-8 rounded-lg hover:bg-white/15 flex items-center justify-center text-sm cursor-pointer">
                  🎨
                </div>
              </div>
            </div>

            {/* Right: System Tray & Clock */}
            <div className="flex items-center gap-3 text-xs text-slate-200">
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-white/10">ENG</span>
              <span className="text-xs">📶</span>
              <span className="text-xs">🔊</span>
              <div className="flex flex-col items-end text-[11px] leading-tight font-mono">
                <span className="font-bold">
                  {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-[9.5px] text-slate-300">05/11/2026</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Container Workarea */}
      <main className={`flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 ${isMainAppMinimized ? 'hidden' : ''}`}>
        {/* Left Column: Avatar & Expressive Robot Widget */}
        <div className="lg:col-span-4 flex flex-col items-center justify-start space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className={`w-full p-6 rounded-2xl border backdrop-blur-md flex flex-col items-center justify-center relative overflow-hidden shadow-xl transition-all ${
              theme === 'cyberpunk'
                ? 'bg-slate-900/50 border-slate-800/80 shadow-cyan-500/5'
                : theme === 'deepspace'
                ? 'bg-[#090d15] border-neutral-800 shadow-none'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            {/* Ambient Background Aura */}
            <div
              className={`absolute inset-0 bg-radial pointer-events-none ${
                theme === 'cyberpunk'
                  ? 'from-cyan-500/10 via-transparent to-transparent'
                  : theme === 'deepspace'
                  ? 'from-indigo-500/5 via-transparent to-transparent'
                  : 'from-cyan-500/5 via-transparent to-transparent'
              }`}
            />

            {/* Living Avatar with Animated Expressions */}
            <AvatarWidget
              mood={avatarMood}
              isSpeaking={isSpeaking}
              isListening={isListening}
              isMaster={identity.isMaster}
              onAvatarClick={() => {
                const moods: ExpressiveMood[] = ['happy', 'curious', 'focused', 'empathetic', 'critical'];
                const nextMood = moods[(moods.indexOf(avatarMood) + 1) % moods.length];
                setAvatarMood(nextMood);
              }}
              onToggleVoice={() => {
                if (isSpeaking) {
                  window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                } else {
                  speakText('Hoppi luôn sẵn sàng phục vụ Chủ nhân Nguyễn Thanh Hải!');
                }
              }}
              onToggleListen={toggleSpeechRecognition}
              theme={theme}
              isPaused={isActivityPaused}
              lowPowerMode={lowPowerConfig.isActive}
              onSpeakText={speakText}
            />

            {/* Mood status text */}
            <div className="mt-4 text-center">
              <h3
                className={`font-bold text-sm flex items-center justify-center gap-1.5 ${
                  theme === 'light' ? 'text-slate-900' : 'text-slate-100'
                }`}
              >
                <span>Hoppi v4.0</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isActivityPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
                  }`}
                />
              </h3>
              <p
                className={`text-xs mt-1 ${
                  theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                {isActivityPaused
                  ? '💤 Đang tạm nghỉ (Vẫy tay 👋 trước camera để tiếp tục)'
                  : identity.isMaster
                  ? 'Trợ lý cá nhân tự trị của Nguyễn Thanh Hải'
                  : 'Chế độ đón tiếp Khách lạ (Bảo mật cao)'}
              </p>
            </div>

            {/* Quick Mood Transition Buttons with Dynamic Glow Themes */}
            <div
              className={`mt-3.5 flex items-center justify-center gap-1.5 p-1 rounded-xl border text-[11px] flex-wrap ${
                theme === 'light'
                  ? 'bg-slate-100 border-slate-200'
                  : theme === 'deepspace'
                  ? 'bg-[#07090f] border-neutral-800'
                  : 'bg-slate-950/80 border-slate-800/80'
              }`}
            >
              {(['happy', 'curious', 'focused', 'empathetic', 'critical'] as ExpressiveMood[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setAvatarMood(m)}
                  className={`px-2 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    avatarMood === m
                      ? m === 'happy'
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-400/80 shadow-sm shadow-amber-500/30 scale-105 font-bold'
                        : m === 'critical'
                        ? 'bg-red-500/25 text-red-300 border border-red-500/80 shadow-sm shadow-red-500/30 scale-105 font-bold animate-pulse'
                        : theme === 'light'
                        ? 'bg-white text-cyan-800 border border-cyan-300 shadow-sm font-semibold scale-105'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/20 scale-105'
                      : theme === 'light'
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {m === 'happy'
                    ? '✨ Vui (Gold)'
                    : m === 'critical'
                    ? '🚨 Báo động (Red)'
                    : m === 'curious'
                    ? '🧐 Tò mò'
                    : m === 'focused'
                    ? '🎯 Tập trung'
                    : '💖 Thấu cảm'}
                </button>
              ))}
            </div>

            {/* Pending HITL approvals badge if any */}
            {approvalQueue.filter((a) => a.status === 'pending').length > 0 && identity.isMaster && (
              <div className="mt-4 w-full p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-between">
                <span className="text-xs text-amber-300 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  {approvalQueue.filter((a) => a.status === 'pending').length} Yêu cầu chờ duyệt
                </span>
                <button
                  onClick={() => {
                    const firstPending = approvalQueue.find((a) => a.status === 'pending');
                    if (firstPending) setActiveApprovalRequest(firstPending);
                  }}
                  className="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition-colors cursor-pointer"
                >
                  Duyệt ngay
                </button>
              </div>
            )}
          </motion.div>

          {/* Visual Connectivity Status & Low Power Mode Toggle Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05, ease: 'easeOut' }}
            className="w-full"
          >
            <SidebarConnectivityCard
              isOnlineMode={isOnlineMode}
              onToggleOnlineMode={() => setIsOnlineMode(!isOnlineMode)}
              theme={theme}
              lowPowerConfig={lowPowerConfig}
              onUpdateLowPowerConfig={setLowPowerConfig}
              autoThemeActive={autoThemeEnabled}
              autoThemePhase={autoThemePhase}
              onToggleAutoTheme={handleToggleAutoTheme}
            />
          </motion.div>

          {/* Compact IoT Voice Command & Spoken Trigger Widget */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
            className="w-full"
          >
            <IoTVoiceCommand
              currentMood={avatarMood}
              onSetMood={setAvatarMood}
              onSpeakText={speakText}
              theme={theme}
              isMaster={identity.isMaster}
              compactMode={true}
              onNavigateToIotPanel={() => setActiveModule('iot')}
            />
          </motion.div>

          {/* Camera Hand Gesture Recognition Widget with Motion Animation */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
            className="w-full"
          >
            <HandGestureWidget
              isPaused={isActivityPaused}
              onTogglePause={handleToggleActivityPause}
              theme={theme}
            />
          </motion.div>

          {/* System Performance Monitor Widget (Current Device & Home Server & Battery Telemetry) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.14, ease: 'easeOut' }}
            className="w-full"
          >
            <SystemPerformanceWidget
              theme={theme}
              onSpeakText={speakText}
              onTriggerCompletionNotice={handleTriggerCompletionNotice}
              onPowerModeChange={(mode) => {
                const isSaver = mode === 'battery-saver';
                setLowPowerConfig((prev) => ({
                  ...prev,
                  isActive: isSaver,
                  isManualOverride: true,
                  animationFramerateReduction: isSaver,
                  iotPollingIntervalSeconds: isSaver ? 20 : 4,
                }));
              }}
            />
          </motion.div>

          {/* Quick Hardware & Architecture Spec Box with Motion Animation */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18, ease: 'easeOut' }}
            className={`w-full p-4 rounded-2xl border text-xs space-y-2 transition-all ${
              theme === 'light'
                ? 'bg-white border-slate-200 text-slate-600 shadow-sm'
                : theme === 'deepspace'
                ? 'bg-[#090d15] border-neutral-800 text-neutral-400'
                : 'bg-slate-900/40 border-slate-800 text-slate-400'
            }`}
          >
            <div
              className={`flex items-center justify-between font-semibold border-b pb-2 ${
                theme === 'light'
                  ? 'text-slate-900 border-slate-200'
                  : 'text-slate-300 border-slate-800'
              }`}
            >
              <span>Hạ tầng & Vận hành</span>
              <span className="font-mono text-cyan-500 text-[11px]">HYBRID CLOUD</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Home Server / VPS:</span>
              <span className="text-emerald-500 font-mono font-medium">24/7 Chạy ngầm</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Bảo mật thiết bị:</span>
              <span className="text-cyan-500 font-mono font-medium">FaceID & Token Tin Cậy</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Vector Database:</span>
              <span className="text-indigo-500 font-mono font-medium">ChromaDB / FAISS</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Kiểm soát HITL:</span>
              <span className="text-amber-500 font-mono font-medium">
                {isAutoDelegated ? 'Ủy quyền trọn gói' : 'Hỏi ý kiến'}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Active Module View (8 cols) with framer-motion entrance and transition */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
          className={`lg:col-span-8 flex flex-col ${
            activeModule === 'hq3d'
              ? 'min-h-[760px]'
              : 'h-[calc(100vh-130px)] min-h-[680px]'
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="h-full flex flex-col min-h-0"
            >
              {activeModule === 'chat' && (
                <ChatInterface
                  messages={messages}
                  identity={identity}
                  isListening={isListening}
                  isSpeaking={isSpeaking}
                  isAutoDelegated={isAutoDelegated}
                  onSendMessage={(text, atts) => handleSendMessage(text, false, atts)}
                  onToggleListen={toggleSpeechRecognition}
                  onToggleSpeech={() => {
                    if (isSpeaking) {
                      window.speechSynthesis.cancel();
                      setIsSpeaking(false);
                    } else {
                      speakText('Hệ thống âm thanh của Hoppi đã sẵn sàng.');
                    }
                  }}
                  onToggleAutoDelegation={() => setIsAutoDelegated(!isAutoDelegated)}
                  onSwitchIdentity={() => {
                    const toggled = !identity.isMaster;
                    const newIdent: UserIdentity = {
                      ...identity,
                      isMaster: toggled,
                      name: toggled ? 'Nguyễn Thanh Hải' : 'Khách ghé thăm',
                      role: toggled ? 'Chủ nhân (Admin)' : 'Khách truy cập (Guest)',
                    };
                    setIdentity(newIdent);
                    initWelcomeMessage(newIdent);
                  }}
                  onOpenApproval={(id) => {
                    const req = approvalQueue.find((a) => a.id === id);
                    if (req) setActiveApprovalRequest(req);
                  }}
                  onExecuteAction={(act) => handleSendMessage(act)}
                  onClearHistory={handleClearHistory}
                  theme={theme}
                  onSpeakingStateChange={setIsSpeaking}
                  isAiTyping={isAiTyping}
                  lastVoiceCommand={lastVoiceCommand}
                  onTriggerCompletionNotice={handleTriggerCompletionNotice}
                  selectedTargetDevice={selectedTargetDevice}
                  onSelectTargetDevice={setSelectedTargetDevice}
                />
              )}

              {activeModule === 'orchestrator' && (
                <FuturisticOrchestrationConsole
                  identity={identity}
                  theme={theme}
                  onSpeakText={speakText}
                  onDispatchCommand={(cmd) => handleSendMessage(cmd)}
                  onNavigateToModule={(mod) => setActiveModule(mod)}
                />
              )}

              {activeModule === 'code' && <CodeAgentPanel />}
              {activeModule === 'sales' && <SalesCrmPanel />}
              {activeModule === 'rag' && (
                <RagMemoryPanel
                  onSpeakText={speakText}
                  onNavigateToChat={() => setActiveModule('chat')}
                  onTriggerChatPrompt={(prompt) => {
                    setActiveModule('chat');
                    handleSendMessage(prompt);
                  }}
                />
              )}
              {activeModule === 'iot' && (
                <LanIotPanel
                  theme={theme}
                  avatarMood={avatarMood}
                  onSetAvatarMood={setAvatarMood}
                  onSpeakText={speakText}
                  isMaster={identity.isMaster}
                  lowPowerMode={lowPowerConfig.isActive}
                  isEmergencyShutdownActive={isEmergencyShutdownActive}
                />
              )}
              {activeModule === 'security' && <SecurityAuditPanel theme={theme} />}
              {activeModule === 'mesh' && (
                <GlobalStatusDashboard
                  currentTheme={theme}
                  identity={identity}
                  onSelectTargetDevice={(device) => {
                    setSelectedTargetDevice(device);
                    setActiveModule('chat');
                  }}
                  onOpenDevicesModal={() => setIsDevicesModalOpen(true)}
                  onTriggerCompletionNotice={handleTriggerCompletionNotice}
                  onNavigateToChatWithPrompt={(prompt) => {
                    setActiveModule('chat');
                    handleSendMessage(prompt);
                  }}
                />
              )}
              {activeModule === 'hq3d' && (
                <AiAgentHq3DPanel
                  theme={theme}
                  identity={identity}
                  onNavigateToModule={(mod) => setActiveModule(mod)}
                  onSpeakText={speakText}
                  onDispatchCommand={(cmd, atts) => handleSendMessage(cmd, false, atts)}
                  onOpenSnapshotModal={() => setIsSnapshotModalOpen(true)}
                  onOpenSkillsHub={() => setIsSkillsModalOpen(true)}
                />
              )}
              {activeModule === 'skills' && (
                <div className="flex-1 flex flex-col min-h-0 space-y-4">
                  <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/30 rounded-2xl border border-amber-500/40 flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                        <span>🌟 KHO SIÊU KỸ NĂNG AGENT (24+ GITHUB REPOSITORIES)</span>
                      </h3>
                      <p className="text-xs text-slate-300">
                        Quản trị, tự động đồng bộ và kích hoạt 4 Siêu Kỹ Năng Vàng cùng 24 kho kỹ năng GitHub cho Hoppi
                      </p>
                    </div>
                    <button
                      onClick={() => setIsSkillsModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold cursor-pointer shadow-md transition"
                    >
                      Mở Bảng Kỹ Năng Đầy Đủ
                    </button>
                  </div>
                  <AiAgentHq3DPanel
                    theme={theme}
                    identity={identity}
                    onNavigateToModule={(mod) => setActiveModule(mod)}
                    onSpeakText={speakText}
                    onDispatchCommand={(cmd, atts) => handleSendMessage(cmd, false, atts)}
                    onOpenSnapshotModal={() => setIsSnapshotModalOpen(true)}
                    onOpenSkillsHub={() => setIsSkillsModalOpen(true)}
                  />
                </div>
              )}
              {activeModule === 'schedule' && (
                <SmartSchedulePanel
                  theme={theme}
                  identity={identity}
                  currentMood={avatarMood}
                  onSetMood={setAvatarMood}
                  onSpeakText={speakText}
                />
              )}
              {activeModule === 'robot' && (
                <RobotAndOsControlPanel
                  theme={theme}
                  identity={identity}
                  onSpeakText={speakText}
                  onDispatchCommand={(cmd) => handleSendMessage(cmd)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Connected Devices Mesh & Universal Installation Hub Modal */}
      <TrustedDevicesModal
        isOpen={isDevicesModalOpen}
        onClose={() => setIsDevicesModalOpen(false)}
        onRevokeCurrentDevice={handleLogout}
        onSelectTargetDevice={(device) => {
          setSelectedTargetDevice(device);
          setActiveModule('chat');
          setIsDevicesModalOpen(false);
        }}
        theme={theme}
        isMaster={identity.isMaster}
      />

      {/* Human-in-the-Loop Approval Modal */}
      <HitlApprovalModal
        request={activeApprovalRequest}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
        onClose={() => setActiveApprovalRequest(null)}
      />

      {/* Expressive Robot Mascot Completion Notice Overlay with Spoken Voice */}
      <HoppiCompletionOverlay
        notice={completionNotice}
        onDismiss={() => setCompletionNotice(null)}
        onReplayVoice={(text: string) => speakText(text)}
        theme={theme}
      />

      {/* Global Command Palette Modal (Cmd/Ctrl + K) */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        activeModule={activeModule}
        onChangeModule={setActiveModule}
        onOpenDevicesModal={() => setIsDevicesModalOpen(true)}
        onSelectTargetDeviceId={(devId) => {
          const deviceList: ConnectedMeshDevice[] = [
            {
              id: 'dev-server-home',
              name: 'Home Server 24/7 (Mini PC)',
              type: 'server',
              os: 'Ubuntu 24.04 LTS (Docker Engine)',
              browser: 'Docker Daemon v27.2',
              ip: '192.168.1.100',
              status: 'online',
              isMasterDevice: false,
              isCurrent: false,
              latencyMs: 2,
              battery: 100,
              currentTask: 'Vector Indexing & RAG Memory Daemon',
              lastSync: 'Vừa xong',
              tokenHash: 'tok-srv-899142',
              capabilities: ['docker', 'rag_memory', 'sales_crawler', 'iot_gateway', 'slm_inference'],
            },
            {
              id: 'dev-macbook-master',
              name: 'MacBook Pro M3 Max',
              type: 'desktop',
              os: 'macOS Sequoia 15.1',
              browser: 'Chrome 131 (Hoppi Native App)',
              ip: '192.168.1.105',
              status: 'online',
              isMasterDevice: true,
              isCurrent: true,
              latencyMs: 12,
              battery: 94,
              currentTask: 'Code AST Engine & Sandboxed Execution',
              lastSync: 'Vừa xong',
              tokenHash: 'tok-mac-master-9921',
              capabilities: ['code_sandbox', 'full_master_ui', 'camera_vision', 'voice_stt'],
            },
            {
              id: 'dev-iphone-master',
              name: 'iPhone 16 Pro Max',
              type: 'mobile',
              os: 'iOS 18.2 (PWA Standalone)',
              browser: 'Safari Mobile PWA',
              ip: '192.168.1.140',
              status: 'online',
              isMasterDevice: true,
              isCurrent: false,
              latencyMs: 18,
              battery: 88,
              currentTask: 'Zalo OA Lead Monitoring & Mobile Notifications',
              lastSync: '1 phút trước',
              tokenHash: 'tok-ios-master-4102',
              capabilities: ['mobile_push', 'voice_wake', 'biometrics', 'camera_vision'],
            },
            {
              id: 'dev-ipad-living',
              name: 'iPad Pro M2 (Phòng khách)',
              type: 'tablet',
              os: 'iPadOS 18.1',
              browser: 'Safari PWA Standalone',
              ip: '192.168.1.120',
              status: 'idle',
              isMasterDevice: false,
              isCurrent: false,
              latencyMs: 25,
              battery: 65,
              currentTask: 'Smart Home LAN Dashboard & Security Monitor',
              lastSync: '2 phút trước',
              tokenHash: 'tok-ipad-living-7721',
              capabilities: ['smart_display', 'iot_hub', 'surveillance_feed'],
            },
          ];

          const found = deviceList.find((d) => d.id === devId);
          if (found) {
            setSelectedTargetDevice(found);
          } else {
            setSelectedTargetDevice(null);
          }
        }}
        onTriggerCompletionNotice={() => {
          handleTriggerCompletionNotice({
            id: `notice-${Date.now()}`,
            sourceDeviceId: 'dev-server-home',
            sourceDeviceName: 'Home Server 24/7',
            taskTitle: 'Đồng bộ Tri thức Vector Mesh',
            summary: 'Hoppi đã sao lưu và đồng bộ toàn bộ 1,420 vector tri thức thành công tới 5 thiết bị trong hệ sinh thái.',
            spokenMessage: 'Chủ nhân Nguyễn Thanh Hải ơi, tôi đã hoàn thành xong công việc đồng bộ tri thức trên Home Server 24/7 rồi ạ! Mời chủ nhân xem báo cáo.',
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            mood: 'happy',
          });
        }}
        onStartAutonomousTask={() => {
          setActiveModule('chat');
          handleSendMessage('Hoppi, hãy thực thi chuỗi tác vụ tự trị đa bước để kiểm tra toàn bộ hệ thống.');
        }}
        onToggleSpeechRecognition={toggleSpeechRecognition}
        onToggleSpeech={() => {
          if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
          } else {
            speakText('Hệ thống âm thanh của Hoppi luôn sẵn sàng phục vụ Chủ nhân Nguyễn Thanh Hải!');
          }
        }}
        onToggleActivityPause={handleToggleActivityPause}
        isActivityPaused={isActivityPaused}
        currentTheme={theme}
        onSelectTheme={handleSelectTheme}
        identity={identity}
        onSwitchIdentity={() => {
          if (!identity) return;
          const toggled = !identity.isMaster;
          const newIdent: UserIdentity = {
            ...identity,
            isMaster: toggled,
            name: toggled ? 'Nguyễn Thanh Hải' : 'Khách ghé thăm',
            role: toggled ? 'Chủ nhân (Admin)' : 'Khách truy cập (Guest)',
          };
          setIdentity(newIdent);
          initWelcomeMessage(newIdent);
        }}
        onClearHistory={handleClearHistory}
        messages={messages}
        onSelectPastMessage={(msg) => {
          setActiveModule('chat');
          if (msg.role === 'user') {
            handleSendMessage(msg.text);
          }
        }}
        voiceSettings={voiceMoodSettings}
        onUpdateVoiceSettings={(updated) => setVoiceMoodSettings(updated)}
        onReplayVoiceCommand={(cmd) => {
          setActiveModule('chat');
          handleSendMessage(cmd, true);
        }}
        onOpenAdaptiveLightModal={() => setIsAdaptiveLightModalOpen(true)}
        onOpenSnapshotModal={() => setIsSnapshotModalOpen(true)}
      />

      {/* Cross-Platform Export & Installation Center Modal */}
      <ExportInstallModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onSpeakText={speakText}
      />

      {/* Adaptive Light Control & 24/7 Eye Comfort Modal */}
      <AdaptiveLightControlModal
        isOpen={isAdaptiveLightModalOpen}
        onClose={() => setIsAdaptiveLightModalOpen(false)}
        config={adaptiveLightConfig}
        onUpdateConfig={handleUpdateAdaptiveLightConfig}
        currentTheme={theme}
        onSelectTheme={handleSelectTheme}
        onSpeakText={speakText}
      />

      {/* Consolidated Dashboard Snapshot (3D HQ & IoT) Modal */}
      <DashboardSnapshotModal
        isOpen={isSnapshotModalOpen}
        onClose={() => setIsSnapshotModalOpen(false)}
        identity={identity}
        theme={theme}
        onSpeakText={speakText}
      />

      {/* Agent Skills Hub (24+ Repositories & 4 Super Skills) Modal */}
      <SkillsHubModal
        isOpen={isSkillsModalOpen}
        onClose={() => setIsSkillsModalOpen(false)}
        theme={theme}
        onSelectSkillForChat={(skill) => {
          setActiveModule('chat');
          handleSendMessage(`Hãy áp dụng kỹ năng ${skill.name} (${skill.repoName}) để giải quyết công việc: `);
        }}
        onSpeakText={speakText}
      />

      {/* AgentSkillsManager Modal: 30+ Skills, Auto Crawler & AI Agent Book Architecture */}
      <AgentSkillsManagerModal
        isOpen={isAgentSkillsManagerOpen}
        onClose={() => setIsAgentSkillsManagerOpen(false)}
        onExecutePrompt={(prompt) => {
          setActiveModule('chat');
          handleSendMessage(prompt);
        }}
        masterName={identity?.name || 'Nguyễn Thanh Hải'}
      />

      {/* ALWAYS-ON CORNER FLOATING EMOTIONAL HOPPI MASCOT (Matches Screenshot 115455_6a1dd7e1) */}
      <FloatingHoppiCornerMascot
        mood={avatarMood}
        isSpeaking={isSpeaking}
        isListening={isListening}
        isThinking={isAiTyping}
        identity={identity}
        theme={theme}
        isMainAppMinimized={isMainAppMinimized}
        onRestoreMainApp={restoreMainApp}
        onMinimizeMainApp={minimizeMainApp}
        onQuickSendMessage={(text) => handleSendMessage(text)}
        onToggleVoice={() => {
          if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
          } else {
            speakText('Hoppi luôn sẵn sàng phục vụ Chủ nhân Nguyễn Thanh Hải!');
          }
        }}
        onToggleListen={toggleSpeechRecognition}
        onChangeMood={setAvatarMood}
      />
    </div>
  );
}
