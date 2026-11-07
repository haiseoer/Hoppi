import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Moon,
  Briefcase,
  Shield,
  Sparkles,
  Sun,
  Tv,
  Coffee,
  Lock,
  Heart,
  Zap,
  Play,
  CheckCircle2,
  Mic,
  Volume2,
  Plus,
  Trash2,
  Edit3,
  Sliders,
  RotateCcw,
  Check,
  X,
  AlertTriangle,
  Lightbulb,
  Wind,
  Video,
  Router,
  ToggleRight,
  ShieldCheck,
  Clock,
  Sparkle,
} from 'lucide-react';
import {
  IoTScene,
  IoTSceneDeviceAction,
  IoTSceneActionType,
  AppTheme,
  ExpressiveMood,
  IoTDevice,
} from '../types';

export const DEFAULT_PRESET_SCENES: IoTScene[] = [
  {
    id: 'scene-good-night',
    name: 'Chúc Ngủ Ngon (Good Night)',
    description: 'Tắt toàn bộ hệ thống đèn, khóa chốt cửa thông minh, vũ trang camera hồng ngoại và duy trì điều hòa 26°C.',
    icon: 'moon',
    themeColor: 'indigo',
    triggerVoicePhrase: 'Chúc ngủ ngon',
    alternativePhrases: ['Good night', 'Đi ngủ thôi', 'Tắt đèn đi ngủ', 'Night mode', 'Ngủ ngon'],
    feedbackSpeechVi: 'Chúc anh Hải ngủ ngon! Hoppi đã tắt đèn, khóa chặt cửa an ninh, kích hoạt camera hồng ngoại và duy trì điều hòa 26 độ C.',
    feedbackSpeechEn: 'Good night! Lights turned off, perimeter locked, infrared camera armed, and AC set to 26°C.',
    targetMood: 'empathetic',
    isPreset: true,
    createdAt: '2026-10-28T19:00:00Z',
    executionCount: 42,
    lastExecutedAt: 'Hôm qua, 23:15',
    actions: [
      {
        id: 'act-gn-1',
        deviceId: 'iot-01',
        deviceName: 'Đèn Thông Minh Bàn Làm Việc',
        deviceType: 'light',
        actionType: 'power',
        targetState: {
          power: false,
          brightness: 0,
          statusLabel: 'Tắt đèn làm việc',
        },
        delayMs: 0,
      },
      {
        id: 'act-gn-2',
        deviceId: 'iot-lock',
        deviceName: 'Khóa Cửa Từ Vân Tay Thông Minh',
        deviceType: 'lock',
        actionType: 'doorLock',
        targetState: {
          locked: true,
          power: true,
          statusLabel: 'Khóa chốt an toàn 3 lớp',
        },
        delayMs: 150,
      },
      {
        id: 'act-gn-3',
        deviceId: 'iot-05',
        deviceName: 'Camera An Ninh AI Hồng Ngoại 4K',
        deviceType: 'camera',
        actionType: 'securityMode',
        targetState: {
          power: true,
          securityArmed: true,
          statusLabel: 'Kích hoạt cảnh báo hồng ngoại & AI tuần tra',
        },
        delayMs: 300,
      },
      {
        id: 'act-gn-4',
        deviceId: 'iot-04',
        deviceName: 'Điều Hòa Trung Tâm Inverter',
        deviceType: 'climate',
        actionType: 'temperature',
        targetState: {
          power: true,
          temperature: 26,
          statusLabel: 'Chế độ Sleep Inverter 26°C êm dịu',
        },
        delayMs: 450,
      },
    ],
  },
  {
    id: 'scene-deep-focus',
    name: 'Tập Trung Cao Độ (Deep Focus)',
    description: 'Bật đèn sáng 100% ánh sáng trắng tập trung, hạ nhiệt độ điều hòa 23°C và cấp nguồn full công suất cho Home Server.',
    icon: 'briefcase',
    themeColor: 'cyan',
    triggerVoicePhrase: 'Tập trung làm việc',
    alternativePhrases: ['Deep focus', 'Bắt đầu làm việc', 'Focus mode', 'Chế độ làm việc', 'Làm việc thôi'],
    feedbackSpeechVi: 'Đã kích hoạt chế độ Tập Trung Sâu. Đèn bàn 100%, điều hòa 23 độ C, sẵn sàng cùng anh Hải hoàn thành dự án xuất sắc!',
    feedbackSpeechEn: 'Deep Focus mode active! Lights 100%, AC 23°C, ready for maximum productivity.',
    targetMood: 'focused',
    isPreset: true,
    createdAt: '2026-10-28T19:00:00Z',
    executionCount: 68,
    lastExecutedAt: 'Sáng nay, 08:30',
    actions: [
      {
        id: 'act-df-1',
        deviceId: 'iot-01',
        deviceName: 'Đèn Thông Minh Bàn Làm Việc',
        deviceType: 'light',
        actionType: 'brightness',
        targetState: {
          power: true,
          brightness: 100,
          color: '#38bdf8',
          statusLabel: 'Sáng 100% ánh sáng tập trung xanh lam nhẹ',
        },
        delayMs: 0,
      },
      {
        id: 'act-df-2',
        deviceId: 'iot-04',
        deviceName: 'Điều Hòa Trung Tâm Inverter',
        deviceType: 'climate',
        actionType: 'temperature',
        targetState: {
          power: true,
          temperature: 23,
          statusLabel: 'Làm mát nhanh 23°C sảng khoái',
        },
        delayMs: 150,
      },
      {
        id: 'act-df-3',
        deviceId: 'iot-03',
        deviceName: 'Ổ Cắm Thông Minh Home Server 24/7',
        deviceType: 'switch',
        actionType: 'power',
        targetState: {
          power: true,
          statusLabel: 'Home Server sẵn sàng Full Power',
        },
        delayMs: 300,
      },
    ],
  },
  {
    id: 'scene-away-home',
    name: 'Rời Khỏi Nhà (Away / High Security)',
    description: 'Ngắt toàn bộ tải điện gia dụng, khóa chốt toàn bộ cửa ra vào và nâng mức an ninh AI Camera lên mức báo động cao.',
    icon: 'shield',
    themeColor: 'amber',
    triggerVoicePhrase: 'Rời khỏi nhà',
    alternativePhrases: ['Tôi đi ra ngoài', 'Away mode', 'Khóa nhà đi ra ngoài', 'Đi vắng', 'Rời nhà'],
    feedbackSpeechVi: 'Đã kích hoạt chế độ Rời Nhà. Toàn bộ thiết bị điện đã ngắt, cửa đã khóa chặt và hệ thống an ninh 4K đã sẵn sàng bảo vệ ngôi nhà!',
    feedbackSpeechEn: 'Away mode armed. Appliances turned off, doors secured, and 4K AI security watching.',
    targetMood: 'focused',
    isPreset: true,
    createdAt: '2026-10-28T19:00:00Z',
    executionCount: 19,
    lastExecutedAt: '3 ngày trước',
    actions: [
      {
        id: 'act-aw-1',
        deviceId: 'iot-01',
        deviceName: 'Đèn Thông Minh Bàn Làm Việc',
        deviceType: 'light',
        actionType: 'power',
        targetState: {
          power: false,
          brightness: 0,
          statusLabel: 'Tắt đèn phòng',
        },
        delayMs: 0,
      },
      {
        id: 'act-aw-2',
        deviceId: 'iot-04',
        deviceName: 'Điều Hòa Trung Tâm Inverter',
        deviceType: 'climate',
        actionType: 'power',
        targetState: {
          power: false,
          statusLabel: 'Tắt điều hòa tiết kiệm năng lượng',
        },
        delayMs: 150,
      },
      {
        id: 'act-aw-3',
        deviceId: 'iot-lock',
        deviceName: 'Khóa Cửa Từ Vân Tay Thông Minh',
        deviceType: 'lock',
        actionType: 'doorLock',
        targetState: {
          locked: true,
          power: true,
          statusLabel: 'Khóa chốt an toàn chống cạy phá',
        },
        delayMs: 250,
      },
      {
        id: 'act-aw-4',
        deviceId: 'iot-05',
        deviceName: 'Camera An Ninh AI Hồng Ngoại 4K',
        deviceType: 'camera',
        actionType: 'securityMode',
        targetState: {
          power: true,
          securityArmed: true,
          statusLabel: 'Kích hoạt phát hiện chuyển động & AI Báo động',
        },
        delayMs: 400,
      },
    ],
  },
  {
    id: 'scene-chill-movie',
    name: 'Thư Giãn & Chill (Cinema / Relax)',
    description: 'Chuyển đèn bàn sang ánh sáng tím neon mờ 30%, điều hòa 25°C êm dịu và khép rèm cửa đón không gian xem phim.',
    icon: 'sparkles',
    themeColor: 'purple',
    triggerVoicePhrase: 'Thư giãn thôi',
    alternativePhrases: ['Chill mode', 'Xem phim thư giãn', 'Chế độ thư giãn', 'Bật nhạc chill', 'Relax mode'],
    feedbackSpeechVi: 'Đã kích hoạt chế độ Chill Thư Giãn. Ánh sáng neon tím dịu nhẹ và nhiệt độ 25 độ C lý tưởng để anh Hải nghỉ ngơi!',
    feedbackSpeechEn: 'Chill mode activated. Neon ambient lights dimmed and AC adjusted to 25°C.',
    targetMood: 'happy',
    isPreset: true,
    createdAt: '2026-10-28T19:00:00Z',
    executionCount: 31,
    lastExecutedAt: 'Tối qua, 20:45',
    actions: [
      {
        id: 'act-cl-1',
        deviceId: 'iot-01',
        deviceName: 'Đèn Thông Minh Bàn Làm Việc',
        deviceType: 'light',
        actionType: 'brightness',
        targetState: {
          power: true,
          brightness: 30,
          color: '#c084fc',
          statusLabel: 'Ánh sáng neon tím mờ 30%',
        },
        delayMs: 0,
      },
      {
        id: 'act-cl-2',
        deviceId: 'iot-04',
        deviceName: 'Điều Hòa Trung Tâm Inverter',
        deviceType: 'climate',
        actionType: 'temperature',
        targetState: {
          power: true,
          temperature: 25,
          statusLabel: 'Nhiệt độ 25°C thư thái',
        },
        delayMs: 150,
      },
      {
        id: 'act-cl-3',
        deviceId: 'iot-curtain',
        deviceName: 'Động Cơ Rèm Cửa Thông Minh',
        deviceType: 'curtain',
        actionType: 'curtain',
        targetState: {
          power: true,
          position: 15,
          statusLabel: 'Khép rèm 85% cản sáng',
        },
        delayMs: 300,
      },
    ],
  },
];

interface IoTSceneManagerProps {
  theme?: AppTheme;
  isMaster?: boolean;
  avatarMood?: ExpressiveMood;
  onSetAvatarMood?: (mood: ExpressiveMood) => void;
  onSpeakText?: (text: string) => void;
  onApplySceneActions: (actions: IoTSceneDeviceAction[]) => void;
}

export const IoTSceneManager: React.FC<IoTSceneManagerProps> = ({
  theme = 'cyberpunk',
  isMaster = true,
  avatarMood = 'happy',
  onSetAvatarMood,
  onSpeakText,
  onApplySceneActions,
}) => {
  // Load saved scenes or use presets
  const [scenes, setScenes] = useState<IoTScene[]>(() => {
    try {
      const saved = localStorage.getItem('hoppi_lan_iot_scenes_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load saved scenes:', e);
    }
    return DEFAULT_PRESET_SCENES;
  });

  // State for active execution
  const [executingSceneId, setExecutingSceneId] = useState<string | null>(null);
  const [currentActionIndex, setCurrentActionIndex] = useState<number>(-1);
  const [executionMessage, setExecutionMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Modal state for create / edit scene
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScene, setEditingScene] = useState<Partial<IoTScene> | null>(null);

  // Save to localStorage whenever scenes change
  useEffect(() => {
    try {
      localStorage.setItem('hoppi_lan_iot_scenes_v1', JSON.stringify(scenes));
    } catch (e) {
      console.error('Failed to save scenes:', e);
    }
  }, [scenes]);

  // Execute a scene with staggered actions and speech
  const handleExecuteScene = async (scene: IoTScene) => {
    if (executingSceneId) return; // already executing

    setExecutingSceneId(scene.id);
    setCurrentActionIndex(0);
    setExecutionMessage({
      text: `Đang kích hoạt kịch bản "${scene.name}" với lệnh giọng nói "${scene.triggerVoicePhrase}"...`,
      type: 'info',
    });

    if (onSetAvatarMood) {
      onSetAvatarMood(scene.targetMood);
    }

    // Step-by-step sequential feedback
    for (let i = 0; i < scene.actions.length; i++) {
      setCurrentActionIndex(i);
      const action = scene.actions[i];
      const delay = action.delayMs || 150;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    // Apply actions to the actual LAN devices state
    onApplySceneActions(scene.actions);

    // Update execution counter and timestamp
    const nowTimeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setScenes((prev) =>
      prev.map((s) =>
        s.id === scene.id
          ? {
              ...s,
              executionCount: s.executionCount + 1,
              lastExecutedAt: `Hôm nay, ${nowTimeStr}`,
            }
          : s
      )
    );

    // Speak voice feedback
    if (onSpeakText) {
      onSpeakText(scene.feedbackSpeechVi);
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(scene.feedbackSpeechVi);
      utt.lang = 'vi-VN';
      utt.rate = 1.05;
      utt.pitch = 1.15;
      window.speechSynthesis.speak(utt);
    }

    // Broadcast notice so mesh devices & CommandPalette can catch it
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel('hoppi_device_mesh_channel');
        channel.postMessage({
          type: 'HOPPI_SCENE_EXECUTED',
          sceneId: scene.id,
          sceneName: scene.name,
          triggerPhrase: scene.triggerVoicePhrase,
          actionsCount: scene.actions.length,
          timestamp: new Date().toISOString(),
        });
        channel.close();
      }
    } catch (e) {
      // Ignored
    }

    setExecutionMessage({
      text: `Kích hoạt thành công kịch bản "${scene.name}"! (${scene.actions.length} hành động IoT hoàn tất)`,
      type: 'success',
    });

    setTimeout(() => {
      setExecutingSceneId(null);
      setCurrentActionIndex(-1);
    }, 1200);

    setTimeout(() => {
      setExecutionMessage(null);
    }, 4500);
  };

  // Preview pronunciation of the trigger voice command
  const handleTestVoicePronunciation = (phrase: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(`Hoppi, ${phrase}`);
      utt.lang = 'vi-VN';
      utt.rate = 1.05;
      utt.pitch = 1.15;
      window.speechSynthesis.speak(utt);
    }
  };

  // Reset to default presets
  const handleResetPresets = () => {
    if (window.confirm('Khôi phục danh sách Kịch bản thông minh về thiết lập mẫu mặc định?')) {
      setScenes(DEFAULT_PRESET_SCENES);
      setExecutionMessage({
        text: 'Đã khôi phục các kịch bản mẫu thành công!',
        type: 'info',
      });
      setTimeout(() => setExecutionMessage(null), 3000);
    }
  };

  // Delete scene
  const handleDeleteScene = (sceneId: string) => {
    setScenes((prev) => prev.filter((s) => s.id !== sceneId));
    setExecutionMessage({
      text: 'Đã xóa kịch bản.',
      type: 'info',
    });
    setTimeout(() => setExecutionMessage(null), 2500);
  };

  // Open modal for editing or creating
  const handleOpenCreateModal = () => {
    setEditingScene({
      id: `scene-${Date.now()}`,
      name: '',
      description: '',
      icon: 'zap',
      themeColor: 'cyan',
      triggerVoicePhrase: '',
      alternativePhrases: [],
      feedbackSpeechVi: 'Đã thực hiện kịch bản theo lệnh của Chủ nhân Hải!',
      feedbackSpeechEn: 'Scene executed successfully as requested.',
      targetMood: 'focused',
      actions: [
        {
          id: `act-${Date.now()}-1`,
          deviceId: 'iot-01',
          deviceName: 'Đèn Thông Minh Bàn Làm Việc',
          deviceType: 'light',
          actionType: 'power',
          targetState: { power: true, brightness: 80, statusLabel: 'Bật đèn làm việc' },
          delayMs: 0,
        },
      ],
      createdAt: new Date().toISOString(),
      executionCount: 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (scene: IoTScene) => {
    setEditingScene(JSON.parse(JSON.stringify(scene)));
    setIsModalOpen(true);
  };

  const handleSaveScene = () => {
    if (!editingScene || !editingScene.name?.trim() || !editingScene.triggerVoicePhrase?.trim()) {
      alert('Vui lòng nhập Tên kịch bản và Câu lệnh giọng nói kích hoạt!');
      return;
    }

    const completedScene: IoTScene = {
      id: editingScene.id || `scene-${Date.now()}`,
      name: editingScene.name.trim(),
      description: editingScene.description?.trim() || 'Kịch bản điều khiển IoT tự động',
      icon: editingScene.icon || 'zap',
      themeColor: editingScene.themeColor || 'cyan',
      triggerVoicePhrase: editingScene.triggerVoicePhrase.trim(),
      alternativePhrases: editingScene.alternativePhrases || [],
      feedbackSpeechVi: editingScene.feedbackSpeechVi || 'Đã thực thi kịch bản thành công!',
      feedbackSpeechEn: editingScene.feedbackSpeechEn || 'Scene actions executed successfully.',
      targetMood: editingScene.targetMood || 'focused',
      actions: editingScene.actions && editingScene.actions.length > 0 ? editingScene.actions : [],
      isPreset: false,
      createdAt: editingScene.createdAt || new Date().toISOString(),
      executionCount: editingScene.executionCount || 0,
      lastExecutedAt: editingScene.lastExecutedAt,
    };

    setScenes((prev) => {
      const idx = prev.findIndex((s) => s.id === completedScene.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = completedScene;
        return copy;
      }
      return [completedScene, ...prev];
    });

    setIsModalOpen(false);
    setEditingScene(null);
    setExecutionMessage({
      text: `Đã lưu kịch bản "${completedScene.name}" thành công!`,
      type: 'success',
    });
    setTimeout(() => setExecutionMessage(null), 3000);
  };

  // Icon renderer helper
  const renderSceneIcon = (icon: string, color: string) => {
    const props = { className: 'w-5 h-5' };
    switch (icon) {
      case 'moon':
        return <Moon {...props} />;
      case 'briefcase':
        return <Briefcase {...props} />;
      case 'shield':
        return <Shield {...props} />;
      case 'sparkles':
        return <Sparkles {...props} />;
      case 'sun':
        return <Sun {...props} />;
      case 'tv':
        return <Tv {...props} />;
      case 'coffee':
        return <Coffee {...props} />;
      case 'lock':
        return <Lock {...props} />;
      case 'heart':
        return <Heart {...props} />;
      default:
        return <Zap {...props} />;
    }
  };

  // Device Action icon helper
  const renderDeviceTypeIcon = (type: string) => {
    switch (type) {
      case 'light':
        return <Lightbulb className="w-3.5 h-3.5 text-amber-400" />;
      case 'climate':
        return <Wind className="w-3.5 h-3.5 text-cyan-400" />;
      case 'camera':
        return <Video className="w-3.5 h-3.5 text-rose-400" />;
      case 'lock':
        return <Lock className="w-3.5 h-3.5 text-emerald-400" />;
      case 'curtain':
        return <Sun className="w-3.5 h-3.5 text-indigo-400" />;
      default:
        return <ToggleRight className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  const getThemeColorClass = (color: string) => {
    switch (color) {
      case 'indigo':
        return {
          bg: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300',
          badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
          btn: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20',
          glow: 'shadow-[0_0_20px_rgba(99,102,241,0.25)]',
        };
      case 'cyan':
        return {
          bg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          btn: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-500/20',
          glow: 'shadow-[0_0_20px_rgba(6,182,212,0.25)]',
        };
      case 'amber':
        return {
          bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          btn: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/20',
          glow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]',
        };
      case 'purple':
        return {
          bg: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
          badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          btn: 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/20',
          glow: 'shadow-[0_0_20px_rgba(168,85,247,0.25)]',
        };
      case 'emerald':
        return {
          bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          btn: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20',
          glow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)]',
        };
      case 'rose':
        return {
          bg: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          btn: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/20',
          glow: 'shadow-[0_0_20px_rgba(244,63,94,0.25)]',
        };
      default:
        return {
          bg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          btn: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-500/20',
          glow: 'shadow-[0_0_20px_rgba(6,182,212,0.25)]',
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls: Title, Stats, and Create Button */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                Kịch Bản Tự Trị IoT (Smart Scenes & Voice Routines)
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {scenes.length} Kịch bản
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Nhóm các hành động thiết bị và kích hoạt trọn gói qua một câu lệnh giọng nói duy nhất
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetPresets}
            title="Khôi phục lại các kịch bản mẫu mặc định"
            className="px-2.5 py-1.5 rounded-xl border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mẫu Mặc Định</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tạo Kịch Bản Mới</span>
          </button>
        </div>
      </div>

      {/* Execution Alert / Status Notice */}
      <AnimatePresence>
        {executionMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 shadow-lg ${
              executionMessage.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : executionMessage.type === 'error'
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="font-medium">{executionMessage.text}</span>
            </div>
            <button
              onClick={() => setExecutionMessage(null)}
              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of Scenes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenes.map((scene) => {
          const colorTheme = getThemeColorClass(scene.themeColor);
          const isCurrentlyExecuting = executingSceneId === scene.id;

          return (
            <div
              key={scene.id}
              className={`rounded-2xl border p-4.5 transition-all flex flex-col justify-between ${
                isCurrentlyExecuting
                  ? `${colorTheme.bg} ${colorTheme.glow} ring-2 ring-indigo-500`
                  : theme === 'cyberpunk'
                  ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  : theme === 'deepspace'
                  ? 'bg-[#0b0f19] border-neutral-800 hover:border-neutral-700'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div>
                {/* Header: Icon, Name, and Quick Edit / Delete */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl border ${colorTheme.bg} shrink-0`}>
                      {renderSceneIcon(scene.icon, scene.themeColor)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-slate-100">{scene.name}</h4>
                        {scene.isPreset && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                            Preset AI
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {scene.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEditModal(scene)}
                      title="Chỉnh sửa kịch bản"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {!scene.isPreset && (
                      <button
                        onClick={() => handleDeleteScene(scene.id)}
                        title="Xóa kịch bản này"
                        className="p-1.5 rounded-lg text-rose-400/70 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Voice Command Trigger Pill */}
                <div className="mt-3.5 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
                      <Mic className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                        Lệnh giọng nói kích hoạt:
                      </div>
                      <div className="text-xs font-mono font-bold text-indigo-300 flex items-center gap-1.5 truncate">
                        <span>"{scene.triggerVoicePhrase}"</span>
                        {scene.alternativePhrases.length > 0 && (
                          <span className="text-[10px] font-normal text-slate-500">
                            (+{scene.alternativePhrases.length} từ khóa)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTestVoicePronunciation(scene.triggerVoicePhrase)}
                    title="Nghe phát âm lệnh giọng nói mẫu"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 transition-all cursor-pointer shrink-0"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Actions Checklist Preview */}
                <div className="mt-3 space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                    <span>Chuỗi hành động ({scene.actions.length} thiết bị):</span>
                    {scene.lastExecutedAt && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        Lần cuối: {scene.lastExecutedAt}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 bg-slate-950/40 p-2 rounded-xl border border-slate-900">
                    {scene.actions.map((act, idx) => {
                      const isActActive = isCurrentlyExecuting && currentActionIndex === idx;
                      const isActDone = isCurrentlyExecuting && currentActionIndex > idx;

                      return (
                        <div
                          key={act.id}
                          className={`text-xs px-2.5 py-1.5 rounded-lg flex items-center justify-between gap-2 transition-all ${
                            isActActive
                              ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-200'
                              : isActDone
                              ? 'bg-emerald-500/10 text-emerald-300'
                              : 'text-slate-300 hover:bg-slate-900/60'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {renderDeviceTypeIcon(act.deviceType)}
                            <span className="font-medium text-slate-200 truncate">
                              {act.deviceName}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[11px] font-mono text-slate-400">
                              {act.targetState.statusLabel ||
                                (act.targetState.power ? 'Bật nguồn' : 'Tắt nguồn')}
                            </span>
                            {isActActive && (
                              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                            )}
                            {isActDone && (
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Execution Bar */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>Đã chạy {scene.executionCount} lần</span>
                </div>

                <button
                  onClick={() => handleExecuteScene(scene)}
                  disabled={isCurrentlyExecuting}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                    isCurrentlyExecuting
                      ? 'bg-indigo-500/40 text-indigo-200 cursor-wait'
                      : colorTheme.btn
                  }`}
                >
                  <Play className={`w-3.5 h-3.5 ${isCurrentlyExecuting ? 'animate-spin' : ''}`} />
                  <span>{isCurrentlyExecuting ? 'Đang thực thi...' : 'Kích Hoạt Kịch Bản'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scene Creator & Editor Modal */}
      <AnimatePresence>
        {isModalOpen && editingScene && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">
                      {editingScene.id && scenes.some((s) => s.id === editingScene.id)
                        ? 'Chỉnh Sửa Kịch Bản IoT'
                        : 'Tạo Kịch Bản IoT Mới'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Định nghĩa các lệnh thiết bị thực thi đồng thời với 1 câu lệnh giọng nói
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <div className="p-5 space-y-4 flex-1">
                {/* Scene Name & Icon & Color */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Tên Kịch Bản <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Chúc Ngủ Ngon, Xem Phim, Rời Nhà..."
                      value={editingScene.name || ''}
                      onChange={(e) =>
                        setEditingScene((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Biểu Tượng & Màu Sắc
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={editingScene.icon || 'zap'}
                        onChange={(e) =>
                          setEditingScene((prev) => ({
                            ...prev,
                            icon: e.target.value as any,
                          }))
                        }
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="moon">Mặt Trăng (Moon)</option>
                        <option value="briefcase">Cặp Làm Việc (Work)</option>
                        <option value="shield">Khiên An Ninh (Shield)</option>
                        <option value="sparkles">Ngôi Sao Thư Giãn (Chill)</option>
                        <option value="sun">Mặt Trời (Morning)</option>
                        <option value="tv">Tivi / Cinema</option>
                        <option value="coffee">Cà Phê / Nghỉ</option>
                        <option value="lock">Khóa Cửa</option>
                        <option value="heart">Yêu Thương</option>
                        <option value="zap">Tia Sét (Power)</option>
                      </select>

                      <select
                        value={editingScene.themeColor || 'indigo'}
                        onChange={(e) =>
                          setEditingScene((prev) => ({
                            ...prev,
                            themeColor: e.target.value as any,
                          }))
                        }
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="indigo">Chàm (Indigo)</option>
                        <option value="cyan">Xanh Lam (Cyan)</option>
                        <option value="purple">Tím Cyber (Purple)</option>
                        <option value="amber">Hổ Phách (Amber)</option>
                        <option value="emerald">Ngọc Bích (Emerald)</option>
                        <option value="rose">Hồng Neon (Rose)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mô Tả Ngắn
                  </label>
                  <input
                    type="text"
                    placeholder="Mô tả tóm tắt mục đích của kịch bản..."
                    value={editingScene.description || ''}
                    onChange={(e) =>
                      setEditingScene((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Voice Trigger Phrases */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
                    <Mic className="w-4 h-4" />
                    <span>Thiết Lập Câu Lệnh Giọng Nói Kích Hoạt</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Câu lệnh chính <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="VD: Chúc ngủ ngon"
                        value={editingScene.triggerVoicePhrase || ''}
                        onChange={(e) =>
                          setEditingScene((prev) => ({
                            ...prev,
                            triggerVoicePhrase: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-indigo-200 font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Từ khóa phụ / tiếng Anh (cách nhau dấu phẩy)
                      </label>
                      <input
                        type="text"
                        placeholder="VD: Good night, Đi ngủ thôi, Night mode"
                        value={editingScene.alternativePhrases?.join(', ') || ''}
                        onChange={(e) =>
                          setEditingScene((prev) => ({
                            ...prev,
                            alternativePhrases: e.target.value
                              .split(',')
                              .map((p) => p.trim())
                              .filter(Boolean),
                          }))
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Lời phản hồi bằng giọng nói của Hoppi khi thực thi xong (TTS)
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Chúc anh Hải ngủ ngon! Hoppi đã tắt đèn và bảo mật toàn bộ ngôi nhà."
                      value={editingScene.feedbackSpeechVi || ''}
                      onChange={(e) =>
                        setEditingScene((prev) => ({
                          ...prev,
                          feedbackSpeechVi: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-emerald-300 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Device Actions List Builder */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-indigo-400" />
                      <span>Danh Sách Hành Động Thiết Bị ({editingScene.actions?.length || 0})</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        const newAction: IoTSceneDeviceAction = {
                          id: `act-${Date.now()}-${Math.floor(Math.random() * 100)}`,
                          deviceId: 'iot-01',
                          deviceName: 'Đèn Thông Minh Bàn Làm Việc',
                          deviceType: 'light',
                          actionType: 'power',
                          targetState: { power: false, brightness: 0, statusLabel: 'Tắt thiết bị' },
                          delayMs: 150,
                        };
                        setEditingScene((prev) => ({
                          ...prev,
                          actions: [...(prev?.actions || []), newAction],
                        }));
                      }}
                      className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-medium flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Thiết Bị</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {editingScene.actions && editingScene.actions.length > 0 ? (
                      editingScene.actions.map((act, index) => (
                        <div
                          key={act.id}
                          className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-mono text-indigo-400 font-bold">
                              #{index + 1}
                            </span>

                            {/* Device Selector */}
                            <select
                              value={act.deviceId}
                              onChange={(e) => {
                                const selectedId = e.target.value;
                                let name = 'Thiết Bị LAN';
                                let type: any = 'switch';
                                if (selectedId === 'iot-01') {
                                  name = 'Đèn Thông Minh Bàn Làm Việc';
                                  type = 'light';
                                } else if (selectedId === 'iot-04') {
                                  name = 'Điều Hòa Trung Tâm Inverter';
                                  type = 'climate';
                                } else if (selectedId === 'iot-03') {
                                  name = 'Ổ Cắm Thông Minh Home Server 24/7';
                                  type = 'switch';
                                } else if (selectedId === 'iot-05') {
                                  name = 'Camera An Ninh AI Hồng Ngoại 4K';
                                  type = 'camera';
                                } else if (selectedId === 'iot-lock') {
                                  name = 'Khóa Cửa Từ Vân Tay Thông Minh';
                                  type = 'lock';
                                } else if (selectedId === 'iot-curtain') {
                                  name = 'Động Cơ Rèm Cửa Thông Minh';
                                  type = 'curtain';
                                }

                                const updated = [...(editingScene.actions || [])];
                                updated[index] = {
                                  ...updated[index],
                                  deviceId: selectedId,
                                  deviceName: name,
                                  deviceType: type,
                                };
                                setEditingScene((prev) => ({ ...prev, actions: updated }));
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer flex-1"
                            >
                              <option value="iot-01">💡 Đèn Thông Minh Bàn Làm Việc (Phòng làm việc)</option>
                              <option value="iot-04">❄️ Điều Hòa Trung Tâm Inverter (Phòng làm việc)</option>
                              <option value="iot-lock">🔒 Khóa Cửa Từ Vân Tay Thông Minh (Cửa chính)</option>
                              <option value="iot-05">📹 Camera An Ninh AI Hồng Ngoại 4K (Cửa ra vào)</option>
                              <option value="iot-03">🔌 Ổ Cắm Thông Minh Home Server 24/7 (Server Rack)</option>
                              <option value="iot-curtain">🪟 Động Cơ Rèm Cửa Zigbee Thông Minh</option>
                            </select>

                            {/* Delete action */}
                            <button
                              type="button"
                              onClick={() => {
                                const updated = editingScene.actions?.filter((_, i) => i !== index);
                                setEditingScene((prev) => ({ ...prev, actions: updated }));
                              }}
                              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Action Settings based on device */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-900 text-xs">
                            <div>
                              <span className="text-[10px] text-slate-400 block mb-1">Nguồn Điện:</span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...(editingScene.actions || [])];
                                    const isPower = !updated[index].targetState.power;
                                    updated[index].targetState.power = isPower;
                                    updated[index].targetState.statusLabel = isPower ? 'Bật nguồn' : 'Tắt nguồn';
                                    setEditingScene((prev) => ({ ...prev, actions: updated }));
                                  }}
                                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                                    act.targetState.power
                                      ? 'bg-emerald-500 text-slate-950'
                                      : 'bg-slate-800 text-slate-400'
                                  }`}
                                >
                                  {act.targetState.power ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
                                </button>
                              </div>
                            </div>

                            {/* Additional controls depending on type */}
                            {act.deviceType === 'light' && (
                              <div className="sm:col-span-2">
                                <span className="text-[10px] text-slate-400 block mb-1">
                                  Độ Sáng: {act.targetState.brightness ?? 80}%
                                </span>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={act.targetState.brightness ?? 80}
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    const updated = [...(editingScene.actions || [])];
                                    updated[index].targetState.brightness = val;
                                    updated[index].targetState.power = val > 0;
                                    updated[index].targetState.statusLabel = `Độ sáng ${val}%`;
                                    setEditingScene((prev) => ({ ...prev, actions: updated }));
                                  }}
                                  className="w-full accent-cyan-400"
                                />
                              </div>
                            )}

                            {act.deviceType === 'climate' && (
                              <div className="sm:col-span-2">
                                <span className="text-[10px] text-slate-400 block mb-1">
                                  Nhiệt Độ: {act.targetState.temperature ?? 24}°C
                                </span>
                                <input
                                  type="range"
                                  min="16"
                                  max="30"
                                  value={act.targetState.temperature ?? 24}
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    const updated = [...(editingScene.actions || [])];
                                    updated[index].targetState.temperature = val;
                                    updated[index].targetState.statusLabel = `Nhiệt độ ${val}°C`;
                                    setEditingScene((prev) => ({ ...prev, actions: updated }));
                                  }}
                                  className="w-full accent-cyan-400"
                                />
                              </div>
                            )}

                            {act.deviceType === 'lock' && (
                              <div className="sm:col-span-2">
                                <span className="text-[10px] text-slate-400 block mb-1">
                                  Trạng Thái Khóa:
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...(editingScene.actions || [])];
                                    const isLocked = !updated[index].targetState.locked;
                                    updated[index].targetState.locked = isLocked;
                                    updated[index].targetState.statusLabel = isLocked
                                      ? 'Khóa chốt an toàn'
                                      : 'Mở chốt cửa';
                                    setEditingScene((prev) => ({ ...prev, actions: updated }));
                                  }}
                                  className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                                    act.targetState.locked
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  }`}
                                >
                                  {act.targetState.locked ? '🔒 ĐÃ KHÓA CHẶT' : '🔓 MỞ CHỐT'}
                                </button>
                              </div>
                            )}

                            {act.deviceType === 'camera' && (
                              <div className="sm:col-span-2">
                                <span className="text-[10px] text-slate-400 block mb-1">
                                  Chế Độ Vũ Trang An Ninh:
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...(editingScene.actions || [])];
                                    const isArmed = !updated[index].targetState.securityArmed;
                                    updated[index].targetState.securityArmed = isArmed;
                                    updated[index].targetState.statusLabel = isArmed
                                      ? 'Báo động hồng ngoại & AI tuần tra'
                                      : 'Chế độ riêng tư gia đình';
                                    setEditingScene((prev) => ({ ...prev, actions: updated }));
                                  }}
                                  className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                                    act.targetState.securityArmed
                                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                      : 'bg-slate-800 text-slate-400'
                                  }`}
                                >
                                  {act.targetState.securityArmed ? '🛡️ BẬT AN NINH CAO' : '🛡️ BÌNH THƯỜNG'}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                        Chưa có hành động nào. Nhấn "+ Thêm Thiết Bị" để thiết lập chuỗi hành động.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-5 py-3.5 border-t border-slate-800 flex items-center justify-end gap-2 bg-slate-900 sticky bottom-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="button"
                  onClick={handleSaveScene}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-500/30 cursor-pointer"
                >
                  Lưu Kịch Bản
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
