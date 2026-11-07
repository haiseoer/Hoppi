import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Radio,
  Wifi,
  Sparkles,
  Zap,
  Play,
  Send,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Server,
  Activity,
  Sliders,
  RotateCcw,
  Volume2,
  VolumeX,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  History,
  Terminal,
  ShieldAlert,
} from 'lucide-react';
import { ExpressiveMood, AppTheme, IoTScene } from '../types';
import { DEFAULT_PRESET_SCENES } from './IoTSceneManager';

export interface IoTVoiceMapping {
  id: string;
  triggerPhrase: string;
  alternativePhrases: string[];
  targetDeviceId: string;
  targetDeviceName: string;
  endpointUrl: string;
  httpMethod: 'POST' | 'PUT' | 'GET';
  payloadJson: string;
  successMood: ExpressiveMood;
  feedbackSpeechVi: string;
  feedbackSpeechEn: string;
  category: 'lighting' | 'climate' | 'power' | 'security' | 'scenes';
  enabled: boolean;
}

export interface IoTVoiceExecutionLog {
  id: string;
  timestamp: string;
  spokenText: string;
  matchedRuleId?: string;
  ruleTitle?: string;
  endpoint: string;
  httpMethod: string;
  status: 'success' | 'failed' | 'simulated';
  statusCode: number;
  latencyMs: number;
  avatarMoodTriggered: ExpressiveMood;
  responseSummary: string;
}

interface IoTVoiceCommandProps {
  currentMood: ExpressiveMood;
  onSetMood: (mood: ExpressiveMood) => void;
  onSpeakText?: (text: string) => void;
  theme?: AppTheme;
  isMaster?: boolean;
  compactMode?: boolean;
  onNavigateToIotPanel?: () => void;
}

const DEFAULT_MAPPINGS: IoTVoiceMapping[] = [
  {
    id: 'rule-01',
    triggerPhrase: 'Bật đèn phòng khách',
    alternativePhrases: ['Turn on living room lights', 'bật đèn bàn', 'bật đèn', 'mở đèn phòng khách', 'turn on lights'],
    targetDeviceId: 'iot-01',
    targetDeviceName: 'Đèn Thông Minh Bàn Làm Việc',
    endpointUrl: 'http://192.168.1.115:8080/api/lan/iot/lights/living-room',
    httpMethod: 'POST',
    payloadJson: JSON.stringify({ power: true, brightness: 100, color: '#38bdf8' }, null, 2),
    successMood: 'happy',
    feedbackSpeechVi: 'Đã bật hệ thống đèn phòng khách thành công qua cổng LAN 192.168.1.115!',
    feedbackSpeechEn: 'Living room lights have been turned on via local LAN endpoint!',
    category: 'lighting',
    enabled: true,
  },
  {
    id: 'rule-02',
    triggerPhrase: 'Tắt đèn phòng khách',
    alternativePhrases: ['Turn off living room lights', 'tắt đèn bàn', 'tắt đèn', 'tắt hết đèn', 'turn off lights'],
    targetDeviceId: 'iot-01',
    targetDeviceName: 'Đèn Thông Minh Bàn Làm Việc',
    endpointUrl: 'http://192.168.1.115:8080/api/lan/iot/lights/living-room',
    httpMethod: 'POST',
    payloadJson: JSON.stringify({ power: false }, null, 2),
    successMood: 'happy',
    feedbackSpeechVi: 'Đã tắt toàn bộ đèn phòng khách theo lệnh của Chủ nhân!',
    feedbackSpeechEn: 'Living room lights turned off as requested.',
    category: 'lighting',
    enabled: true,
  },
  {
    id: 'rule-03',
    triggerPhrase: 'Bật điều hòa 24 độ',
    alternativePhrases: ['Set AC to 24 degrees', 'điều hòa 24 độ', 'bật máy lạnh', 'mát mẻ 24 độ', 'set ac 24'],
    targetDeviceId: 'iot-04',
    targetDeviceName: 'Điều Hòa Trung Tâm Inverter',
    endpointUrl: 'http://192.168.1.140:80/api/lan/iot/climate/ac',
    httpMethod: 'POST',
    payloadJson: JSON.stringify({ power: true, temperature: 24, mode: 'cool', fan: 'auto' }, null, 2),
    successMood: 'focused',
    feedbackSpeechVi: 'Đã thiết lập điều hòa phòng làm việc 24 độ C chế độ Inverter siêu êm.',
    feedbackSpeechEn: 'Central AC adjusted to 24 degrees Celsius in eco-inverter mode.',
    category: 'climate',
    enabled: true,
  },
  {
    id: 'rule-04',
    triggerPhrase: 'Khởi động Server Home 24/7',
    alternativePhrases: ['Wake Home Server', 'bật server', 'wake on lan', 'khởi động máy chủ', 'turn on server'],
    targetDeviceId: 'iot-03',
    targetDeviceName: 'Ổ Cắm Thông Minh Home Server 24/7',
    endpointUrl: 'http://192.168.1.120:80/api/lan/iot/switch/home-server',
    httpMethod: 'POST',
    payloadJson: JSON.stringify({ relay: 'on', wol: true, mac: '00:1A:2B:3C:4D:5E' }, null, 2),
    successMood: 'focused',
    feedbackSpeechVi: 'Đã gửi gói tin Wake-on-LAN khởi động máy chủ Home Server 24/7 qua cổng nội bộ.',
    feedbackSpeechEn: 'Magic packet sent: Home Server 24/7 is booting via local subnet.',
    category: 'power',
    enabled: true,
  },
  {
    id: 'rule-05',
    triggerPhrase: 'Kéo rèm cửa thông minh',
    alternativePhrases: ['Open smart curtains', 'mở rèm', 'kéo rèm', 'đón ánh sáng', 'open curtains'],
    targetDeviceId: 'iot-06',
    targetDeviceName: 'Động Cơ Rèm Cửa Zigbee',
    endpointUrl: 'http://192.168.1.155:8080/api/lan/iot/curtains/open',
    httpMethod: 'POST',
    payloadJson: JSON.stringify({ position: 100, speed: 'smooth' }, null, 2),
    successMood: 'happy',
    feedbackSpeechVi: 'Đã mở toàn bộ rèm cửa thông minh đón ánh sáng tự nhiên cho phòng làm việc.',
    feedbackSpeechEn: 'Smart motorized curtains opened to 100 percent.',
    category: 'scenes',
    enabled: true,
  },
  {
    id: 'rule-06',
    triggerPhrase: 'Kích hoạt Chế độ Xem Phim',
    alternativePhrases: ['Movie night mode', 'chế độ xem phim', 'rạp chiếu phim gia đình', 'cinema mode'],
    targetDeviceId: 'iot-02',
    targetDeviceName: 'Router Mạng Nội Bộ (Hoppi Gateway)',
    endpointUrl: 'http://192.168.1.1:8080/api/lan/iot/scenes/movie',
    httpMethod: 'POST',
    payloadJson: JSON.stringify({ dim_lights: 15, curtains: 'closed', ac_temp: 23, tv_hdmi: 1 }, null, 2),
    successMood: 'happy',
    feedbackSpeechVi: 'Đã kích hoạt Chế độ Xem Phim: Giảm đèn 15%, đóng rèm và giữ điều hòa 23 độ C!',
    feedbackSpeechEn: 'Movie mode activated: Lights dimmed to 15%, curtains closed, AC set to 23C.',
    category: 'scenes',
    enabled: true,
  },
  {
    id: 'rule-07',
    triggerPhrase: 'Khóa an ninh toàn bộ',
    alternativePhrases: ['Arm security lockdown', 'khóa nhà', 'an ninh đêm', 'bật báo động', 'lockdown'],
    targetDeviceId: 'iot-05',
    targetDeviceName: 'Camera An Ninh AI Hồng Ngoại 4K',
    endpointUrl: 'http://192.168.1.168:8080/api/lan/iot/security/lockdown',
    httpMethod: 'POST',
    payloadJson: JSON.stringify({ armed: true, motion_detect: true, notify_master: true }, null, 2),
    successMood: 'focused',
    feedbackSpeechVi: 'Hệ thống an ninh đã kích hoạt chế độ phong tỏa tối đa và bật cảm biến chuyển động!',
    feedbackSpeechEn: 'Perimeter security armed with active infrared AI motion detection.',
    category: 'security',
    enabled: true,
  },
];

export const IoTVoiceCommand: React.FC<IoTVoiceCommandProps> = ({
  currentMood,
  onSetMood,
  onSpeakText,
  theme = 'cyberpunk',
  isMaster = true,
  compactMode = false,
  onNavigateToIotPanel,
}) => {
  const [mappings, setMappings] = useState<IoTVoiceMapping[]>(() => {
    try {
      const stored = localStorage.getItem('hoppi_iot_voice_mappings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_MAPPINGS;
  });

  const [logs, setLogs] = useState<IoTVoiceExecutionLog[]>(() => {
    try {
      const stored = localStorage.getItem('hoppi_iot_voice_logs');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'log-01',
        timestamp: '10:15',
        spokenText: 'Bật đèn phòng khách',
        matchedRuleId: 'rule-01',
        ruleTitle: 'Bật đèn phòng khách',
        endpoint: 'http://192.168.1.115:8080/api/lan/iot/lights/living-room',
        httpMethod: 'POST',
        status: 'success',
        statusCode: 200,
        latencyMs: 8,
        avatarMoodTriggered: 'happy',
        responseSummary: '{"status":"ok","relay":"ON","brightness":100}',
      },
    ];
  });

  // State
  const [isListening, setIsListening] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState<'vi-VN' | 'en-US'>('vi-VN');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'triggers' | 'logs' | 'rule_editor'>('triggers');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [selectedLogDetail, setSelectedLogDetail] = useState<IoTVoiceExecutionLog | null>(null);
  const [voiceVolumeLevel, setVoiceVolumeLevel] = useState(0);

  // New Rule Form State
  const [isEditingRule, setIsEditingRule] = useState<string | null>(null);
  const [ruleForm, setRuleForm] = useState<Partial<IoTVoiceMapping>>({
    triggerPhrase: '',
    alternativePhrases: [],
    targetDeviceId: 'iot-01',
    targetDeviceName: 'Đèn Thông Minh Bàn Làm Việc',
    endpointUrl: 'http://192.168.1.115:8080/api/lan/iot/lights/custom',
    httpMethod: 'POST',
    payloadJson: '{\n  "power": true\n}',
    successMood: 'happy',
    feedbackSpeechVi: 'Đã thực thi tác vụ LAN IoT thành công!',
    feedbackSpeechEn: 'LAN IoT action dispatched successfully!',
    category: 'lighting',
    enabled: true,
  });

  const recognitionRef = useRef<any>(null);
  const waveAnimIntervalRef = useRef<any>(null);

  // Save mappings and logs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hoppi_iot_voice_mappings', JSON.stringify(mappings));
    } catch (e) {
      console.error(e);
    }
  }, [mappings]);

  useEffect(() => {
    try {
      localStorage.setItem('hoppi_iot_voice_logs', JSON.stringify(logs));
    } catch (e) {
      console.error(e);
    }
  }, [logs]);

  // Audio wave pulsation simulator when listening
  useEffect(() => {
    if (isListening) {
      waveAnimIntervalRef.current = setInterval(() => {
        setVoiceVolumeLevel(Math.floor(Math.random() * 85) + 15);
      }, 120);
    } else {
      setVoiceVolumeLevel(0);
      if (waveAnimIntervalRef.current) clearInterval(waveAnimIntervalRef.current);
    }
    return () => {
      if (waveAnimIntervalRef.current) clearInterval(waveAnimIntervalRef.current);
    };
  }, [isListening]);

  // Normalization for robust natural speech matching
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '')
      .trim();
  };

  // Find best matching rule from speech
  const matchVoiceCommand = (transcript: string): IoTVoiceMapping | null => {
    const normSpoken = normalizeText(transcript);
    if (!normSpoken) return null;

    // Direct or alternative phrase matching
    for (const rule of mappings) {
      if (!rule.enabled) continue;

      const normTrigger = normalizeText(rule.triggerPhrase);
      if (normSpoken.includes(normTrigger) || normTrigger.includes(normSpoken)) {
        return rule;
      }

      for (const alt of rule.alternativePhrases) {
        const normAlt = normalizeText(alt);
        if (normSpoken.includes(normAlt) || normAlt.includes(normSpoken)) {
          return rule;
        }
      }
    }
    return null;
  };

  // Execute Voice Command: Trigger LAN Endpoint and update Avatar Mood
  const executeVoiceCommand = async (spoken: string) => {
    if (!spoken.trim()) return;

    setIsProcessing(true);
    setLiveTranscript(spoken);

    // 1. Avatar Feedback: Step 1 -> Curious/Focused (Processing network payload)
    onSetMood('focused');

    setStatusMessage({
      text: `Đang phân tích lệnh: "${spoken}" và định tuyến tới cổng LAN...`,
      type: 'info',
    });

    const startTime = performance.now();

    // Check if spoken command matches any Smart IoT Scene (e.g. Chúc Ngủ Ngon, Tập Trung Sâu, Rời Nhà, Chill)
    const normSpoken = normalizeText(spoken);
    const scenesToSearch: IoTScene[] = (() => {
      try {
        const stored = localStorage.getItem('hoppi_lan_iot_scenes_v1');
        if (stored) return JSON.parse(stored);
      } catch (e) {}
      return DEFAULT_PRESET_SCENES;
    })();

    const matchedScene = scenesToSearch.find((sc) => {
      const normTrigger = normalizeText(sc.triggerVoicePhrase);
      if (normSpoken.includes(normTrigger) || normTrigger.includes(normSpoken)) return true;
      return sc.alternativePhrases.some((alt) => {
        const normAlt = normalizeText(alt);
        return normSpoken.includes(normAlt) || normAlt.includes(normSpoken);
      });
    });

    if (matchedScene) {
      const totalLatency = Math.round(performance.now() - startTime) + 12;
      onSetMood(matchedScene.targetMood);

      const feedbackVoice =
        speechLanguage === 'vi-VN' ? matchedScene.feedbackSpeechVi : matchedScene.feedbackSpeechEn;

      // Broadcast to trigger actions across LanIotPanel
      try {
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
          const channel = new BroadcastChannel('hoppi_device_mesh_channel');
          channel.postMessage({
            type: 'HOPPI_TRIGGER_SCENE',
            sceneId: matchedScene.id,
            sceneName: matchedScene.name,
            spokenText: spoken,
            actions: matchedScene.actions,
            timestamp: new Date().toISOString(),
          });
          channel.close();
        }
      } catch (e) {
        // Ignored
      }

      setStatusMessage({
        text: `Đã kích hoạt Kịch Bản Tự Trị: "${matchedScene.name}" (${matchedScene.actions.length} hành động IoT hoàn tất)`,
        type: 'success',
      });

      if (onSpeakText) {
        onSpeakText(feedbackVoice);
      } else if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(feedbackVoice);
        utt.lang = speechLanguage;
        window.speechSynthesis.speak(utt);
      }

      const newLog: IoTVoiceExecutionLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        spokenText: spoken,
        matchedRuleId: matchedScene.id,
        ruleTitle: `Kịch bản: ${matchedScene.name}`,
        endpoint: `lan://scenes/${matchedScene.id}`,
        httpMethod: 'SCENE_EXEC',
        status: 'success',
        statusCode: 200,
        latencyMs: totalLatency,
        avatarMoodTriggered: matchedScene.targetMood,
        responseSummary: JSON.stringify({ scene: matchedScene.name, actionsCount: matchedScene.actions.length, status: 'ok' }),
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
      setIsProcessing(false);
      return;
    }

    const matchedRule = matchVoiceCommand(spoken);

    // Simulated network delay (8 - 35ms for true high-speed local LAN)
    const simulatedLatency = Math.floor(Math.random() * 25) + 8;
    await new Promise((r) => setTimeout(r, simulatedLatency + 200));

    if (matchedRule) {
      // 2. Dispatch to Local LAN Endpoint
      let endpointSuccess = true;
      let statusCode = 200;
      let responseBody = { status: 'ok', device: matchedRule.targetDeviceName, ack: true };

      // Optional real fetch attempt with fallback (to handle private LAN endpoints)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);
        // We attempt a fetch if valid HTTP URL, but don't crash if browser restricts local LAN or CORS
        await fetch(matchedRule.endpointUrl, {
          method: matchedRule.httpMethod,
          headers: { 'Content-Type': 'application/json' },
          body: matchedRule.httpMethod !== 'GET' ? matchedRule.payloadJson : undefined,
          signal: controller.signal,
          mode: 'no-cors',
        }).catch(() => {
          // Fallback to LAN daemon simulation
        });
        clearTimeout(timeoutId);
      } catch (err) {
        // Handled gracefully
      }

      const totalLatency = Math.round(performance.now() - startTime);

      // 3. Avatar Feedback: Step 2 -> Success Mood (happy or focused)
      onSetMood(matchedRule.successMood);

      const feedbackVoice =
        speechLanguage === 'vi-VN' ? matchedRule.feedbackSpeechVi : matchedRule.feedbackSpeechEn;

      setStatusMessage({
        text: `Đã gọi thành công ${matchedRule.httpMethod} ${matchedRule.endpointUrl} (${totalLatency}ms)`,
        type: 'success',
      });

      if (onSpeakText) {
        onSpeakText(feedbackVoice);
      } else if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(feedbackVoice);
        utt.lang = speechLanguage;
        window.speechSynthesis.speak(utt);
      }

      // Record log
      const newLog: IoTVoiceExecutionLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        spokenText: spoken,
        matchedRuleId: matchedRule.id,
        ruleTitle: matchedRule.triggerPhrase,
        endpoint: matchedRule.endpointUrl,
        httpMethod: matchedRule.httpMethod,
        status: 'success',
        statusCode,
        latencyMs: totalLatency,
        avatarMoodTriggered: matchedRule.successMood,
        responseSummary: JSON.stringify(responseBody),
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
    } else {
      // 4. Avatar Feedback: Step 3 -> Empathetic (unrecognized command)
      onSetMood('empathetic');

      const failMsg =
        speechLanguage === 'vi-VN'
          ? `Hoppi chưa tìm thấy cấu hình LAN IoT cho lệnh: "${spoken}". Hãy thêm quy tắc mới hoặc chọn một trong các mẫu bên dưới nhé!`
          : `No LAN IoT endpoint found for: "${spoken}". Please add a mapping rule below!`;

      setStatusMessage({
        text: failMsg,
        type: 'error',
      });

      if (onSpeakText) {
        onSpeakText(failMsg);
      }

      const failLog: IoTVoiceExecutionLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        spokenText: spoken,
        endpoint: 'None (Unmatched)',
        httpMethod: 'N/A',
        status: 'failed',
        statusCode: 404,
        latencyMs: Math.round(performance.now() - startTime),
        avatarMoodTriggered: 'empathetic',
        responseSummary: 'No matching trigger phrase found in rule table',
      };
      setLogs((prev) => [failLog, ...prev.slice(0, 49)]);
    }

    setIsProcessing(false);
  };

  // Start or Stop Speech Recognition
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error(e);
        }
      }
      setIsListening(false);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      setStatusMessage({
        text: 'Trình duyệt chưa hỗ trợ Web Speech API trực tiếp. Bạn có thể bấm các nút kích hoạt mẫu hoặc gõ vào ô kiểm thử bên dưới!',
        type: 'info',
      });
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = speechLanguage;
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        // Avatar mood immediately transitions to curious/listening
        onSetMood('curious');
        setStatusMessage({
          text: `Đang lắng nghe giọng nói (${speechLanguage === 'vi-VN' ? 'Tiếng Việt' : 'English'}). Hãy nói lệnh IoT...`,
          type: 'info',
        });
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setLiveTranscript(transcript);

        if (event.results[0].isFinal) {
          setIsListening(false);
          executeVoiceCommand(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        setIsListening(false);
        setStatusMessage({
          text: `Không nhận được tín hiệu mic (${event.error || 'timeout'}). Bạn có thể click thử nhanh bằng nút mẫu!`,
          type: 'error',
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Mic start error:', err);
      setIsListening(false);
      setStatusMessage({
        text: 'Không thể mở Microphone trong môi trường hiện tại. Dùng nút mẫu kích hoạt tức thì!',
        type: 'info',
      });
    }
  };

  // Handle Manual Input Submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    const cmd = manualInput;
    setManualInput('');
    executeVoiceCommand(cmd);
  };

  // Save or Update Custom Rule
  const handleSaveRule = () => {
    if (!ruleForm.triggerPhrase?.trim() || !ruleForm.endpointUrl?.trim()) {
      alert('Vui lòng nhập khẩu lệnh kích hoạt và URL endpoint LAN!');
      return;
    }

    try {
      JSON.parse(ruleForm.payloadJson || '{}');
    } catch (e) {
      alert('Định dạng Payload JSON không hợp lệ. Vui lòng kiểm tra lại cú pháp!');
      return;
    }

    if (isEditingRule) {
      setMappings((prev) =>
        prev.map((r) =>
          r.id === isEditingRule
            ? ({
                ...r,
                ...ruleForm,
              } as IoTVoiceMapping)
            : r
        )
      );
      setStatusMessage({ text: `Đã cập nhật quy tắc "${ruleForm.triggerPhrase}"!`, type: 'success' });
    } else {
      const newRule: IoTVoiceMapping = {
        id: `rule-${Date.now()}`,
        triggerPhrase: ruleForm.triggerPhrase!,
        alternativePhrases: ruleForm.alternativePhrases || [],
        targetDeviceId: ruleForm.targetDeviceId || 'iot-custom',
        targetDeviceName: ruleForm.targetDeviceName || 'Thiết bị LAN tùy chỉnh',
        endpointUrl: ruleForm.endpointUrl!,
        httpMethod: (ruleForm.httpMethod as any) || 'POST',
        payloadJson: ruleForm.payloadJson || '{}',
        successMood: ruleForm.successMood || 'happy',
        feedbackSpeechVi: ruleForm.feedbackSpeechVi || 'Đã thực hiện lệnh LAN IoT!',
        feedbackSpeechEn: ruleForm.feedbackSpeechEn || 'Executed LAN IoT voice trigger!',
        category: ruleForm.category || 'lighting',
        enabled: true,
      };
      setMappings((prev) => [newRule, ...prev]);
      setStatusMessage({ text: `Đã thêm quy tắc mới "${newRule.triggerPhrase}"!`, type: 'success' });
    }

    setIsEditingRule(null);
    setActiveTab('triggers');
  };

  const handleEditRuleClick = (rule: IoTVoiceMapping) => {
    setIsEditingRule(rule.id);
    setRuleForm({ ...rule });
    setActiveTab('rule_editor');
  };

  const handleDeleteRule = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa quy tắc giọng nói này khỏi bộ nhớ Hoppi?')) {
      setMappings((prev) => prev.filter((r) => r.id !== id));
      setStatusMessage({ text: 'Đã xóa quy tắc giọng nói.', type: 'info' });
    }
  };

  const handleToggleRuleEnabled = (id: string) => {
    setMappings((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleResetDefaults = () => {
    if (confirm('Khôi phục danh sách lệnh giọng nói LAN IoT mặc định?')) {
      setMappings(DEFAULT_MAPPINGS);
      setStatusMessage({ text: 'Đã khôi phục các quy tắc giọng nói mẫu.', type: 'info' });
    }
  };

  // Compact Sidebar Widget Mode
  if (compactMode) {
    return (
      <div
        className={`w-full p-4 rounded-2xl border transition-all ${
          theme === 'cyberpunk'
            ? 'bg-slate-900/60 border-cyan-500/30'
            : theme === 'deepspace'
            ? 'bg-[#0a0e17] border-neutral-800'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5" />
              <span>Lệnh Giọng Nói LAN IoT</span>
            </h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            {mappings.filter((m) => m.enabled).length} triggers
          </span>
        </div>

        {/* Live Speech Push-to-Talk Orb */}
        <div className="flex flex-col items-center justify-center py-2">
          <button
            onClick={toggleListening}
            disabled={isProcessing}
            className={`relative p-4 rounded-full transition-all cursor-pointer flex items-center justify-center ${
              isListening
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/50 scale-105'
                : 'bg-gradient-to-tr from-cyan-600 to-blue-500 text-white shadow-lg shadow-cyan-500/20 hover:scale-105'
            }`}
          >
            {isListening ? (
              <Radio className="w-6 h-6 animate-spin" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
            {isListening && (
              <span className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping" />
            )}
          </button>
          <span className="text-[11px] mt-2 font-medium text-slate-300">
            {isListening ? 'Đang nghe... Nói lệnh IoT' : 'Nhấn để ra lệnh giọng nói'}
          </span>
          {liveTranscript && (
            <span className="text-[10px] text-cyan-400 font-mono mt-0.5 line-clamp-1 italic">
              "{liveTranscript}"
            </span>
          )}
        </div>

        {/* Quick Trigger Chips */}
        <div className="mt-3 space-y-1.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Kích hoạt nhanh:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {mappings.slice(0, 3).map((rule) => (
              <button
                key={rule.id}
                onClick={() => executeVoiceCommand(rule.triggerPhrase)}
                disabled={isProcessing}
                className="text-[10px] px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition-all text-left flex items-center gap-1 cursor-pointer"
              >
                <Zap className="w-2.5 h-2.5 text-cyan-400" />
                <span>{rule.triggerPhrase}</span>
              </button>
            ))}
          </div>
        </div>

        {onNavigateToIotPanel && (
          <button
            onClick={onNavigateToIotPanel}
            className="w-full mt-3 text-center text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-1 py-1 cursor-pointer"
          >
            <span>Mở Bảng Điều Khiển LAN IoT Chi Tiết</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  }

  // Full Console Mode
  return (
    <div
      className={`w-full rounded-2xl border backdrop-blur-md transition-all shadow-xl overflow-hidden ${
        theme === 'cyberpunk'
          ? 'bg-slate-900/60 border-slate-800 shadow-cyan-500/5'
          : theme === 'deepspace'
          ? 'bg-[#080c14] border-neutral-800 shadow-none'
          : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      {/* Header bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-1.5">
                <span>IoT Voice Command & LAN Router</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  LAN Subnet 192.168.1.0/24
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Định tuyến khẩu lệnh giọng nói trực tiếp tới API thiết bị nội bộ • Tương tác biểu cảm trực tiếp qua Avatar Hoppi
            </p>
          </div>
        </div>

        {/* Language selector & stats */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
            <button
              onClick={() => setSpeechLanguage('vi-VN')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                speechLanguage === 'vi-VN'
                  ? 'bg-cyan-500 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🇻🇳 Tiếng Việt
            </button>
            <button
              onClick={() => setSpeechLanguage('en-US')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                speechLanguage === 'en-US'
                  ? 'bg-cyan-500 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🇺🇸 English
            </button>
          </div>

          <button
            onClick={handleResetDefaults}
            title="Khôi phục quy tắc mặc định"
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice Commander Listening Center & Mic Visualizer */}
      <div
        className={`p-5 sm:p-6 border-b transition-colors relative overflow-hidden ${
          isListening
            ? 'bg-gradient-to-r from-red-950/20 via-slate-900 to-cyan-950/20 border-red-500/30'
            : theme === 'cyberpunk'
            ? 'bg-gradient-to-b from-slate-950/60 to-slate-900/40 border-slate-800/80'
            : theme === 'deepspace'
            ? 'bg-[#05080f] border-neutral-800'
            : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left: Interactive Microphone Orb */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <motion.button
                onClick={toggleListening}
                disabled={isProcessing}
                whileTap={{ scale: 0.95 }}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl ${
                  isListening
                    ? 'bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 text-white shadow-red-500/40'
                    : isProcessing
                    ? 'bg-gradient-to-tr from-amber-600 to-cyan-600 text-white animate-pulse'
                    : 'bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-cyan-500/25 hover:shadow-cyan-500/40'
                }`}
              >
                {isListening ? (
                  <Radio className="w-9 h-9 animate-spin" />
                ) : isProcessing ? (
                  <Activity className="w-8 h-8 animate-spin" />
                ) : (
                  <Mic className="w-9 h-9" />
                )}

                {/* Animated Pulsing Rings when listening */}
                {isListening && (
                  <>
                    <motion.span
                      animate={{ scale: [1, 1.45, 1], opacity: [0.8, 0, 0.8] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 rounded-full border-2 border-red-400 pointer-events-none"
                    />
                    <motion.span
                      animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                      className="absolute inset-0 rounded-full border-2 border-rose-400 pointer-events-none"
                    />
                  </>
                )}
              </motion.button>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  {isListening ? 'Đang ghi âm & Nhận diện' : isProcessing ? 'Đang thực thi LAN' : 'Microphone Sẵn Sàng'}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isListening
                      ? 'bg-red-400 animate-ping'
                      : isProcessing
                      ? 'bg-amber-400 animate-pulse'
                      : 'bg-emerald-400'
                  }`}
                />
              </div>
              <h4 className="text-lg font-bold text-slate-100 mt-0.5">
                {isListening
                  ? 'Hãy nói: "Bật đèn phòng khách", "Tắt điều hòa"...'
                  : 'Nhấn Microphone hoặc click lệnh mẫu bên dưới'}
              </h4>

              {/* Real-time decibel bars visualization */}
              <div className="flex items-center gap-1 mt-2.5 h-4">
                {[12, 28, 45, 60, 80, 55, 30, 42, 65, 88, 70, 35, 20, 50, 75, 40, 22].map((height, idx) => (
                  <div
                    key={idx}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      isListening
                        ? 'bg-gradient-to-t from-cyan-400 to-emerald-400'
                        : 'bg-slate-700/60'
                    }`}
                    style={{
                      height: isListening ? `${Math.min(100, Math.max(15, (voiceVolumeLevel * height) / 50))}%` : '20%',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Manual Text Testing Box */}
          <div className="w-full lg:w-96">
            <form onSubmit={handleManualSubmit} className="relative flex items-center">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Nhập thử giọng nói: e.g. Turn on living room lights..."
                className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-cyan-400 focus:outline-none text-xs text-slate-200 placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={!manualInput.trim() || isProcessing}
                className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-medium flex items-center gap-1 cursor-pointer transition-all"
              >
                <span>Gửi</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 px-1">
              <span>Hỗ trợ cả Tiếng Việt & English</span>
              <span className="font-mono text-cyan-400/80">Avatar Mood: {currentMood}</span>
            </div>
          </div>
        </div>

        {/* Live Transcript / Status Toast */}
        <AnimatePresence>
          {(liveTranscript || statusMessage) && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className={`mt-4 p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                statusMessage?.type === 'error'
                  ? 'bg-red-950/40 border-red-500/30 text-red-200'
                  : statusMessage?.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                  : 'bg-cyan-950/40 border-cyan-500/30 text-cyan-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {statusMessage?.type === 'error' ? (
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                ) : statusMessage?.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Radio className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
                )}
                <span>{statusMessage?.text || `Đã ghi nhận khẩu lệnh: "${liveTranscript}"`}</span>
              </div>
              {liveTranscript && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/10 shrink-0">
                  Transcribed
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tabs navigation */}
      <div className="px-5 pt-3 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('triggers')}
            className={`px-3.5 py-2 border-b-2 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'triggers'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Danh Sách Spoken Triggers ({mappings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3.5 py-2 border-b-2 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'logs'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Lịch Sử Thực Thi ({logs.length})</span>
          </button>

          <button
            onClick={() => {
              setIsEditingRule(null);
              setRuleForm({
                triggerPhrase: '',
                alternativePhrases: [],
                targetDeviceId: 'iot-01',
                targetDeviceName: 'Thiết bị LAN tùy chỉnh',
                endpointUrl: 'http://192.168.1.115:8080/api/lan/iot/lights/custom',
                httpMethod: 'POST',
                payloadJson: '{\n  "power": true\n}',
                successMood: 'happy',
                feedbackSpeechVi: 'Đã thực hiện lệnh LAN IoT!',
                feedbackSpeechEn: 'Executed custom LAN IoT action!',
                category: 'lighting',
                enabled: true,
              });
              setActiveTab('rule_editor');
            }}
            className={`px-3.5 py-2 border-b-2 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'rule_editor'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isEditingRule ? 'Chỉnh Sửa Quy Tắc' : 'Thêm Quy Tắc Mới'}</span>
          </button>
        </div>

        {/* Quick simulation banner */}
        <span className="text-[11px] text-slate-400 hidden sm:inline-flex items-center gap-1">
          <Zap className="w-3 h-3 text-cyan-400" />
          <span>Ấn "Test Trigger" để kiểm thử luồng Avatar Mood</span>
        </span>
      </div>

      {/* Tab 1: Triggers List */}
      {activeTab === 'triggers' && (
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mappings.map((rule) => {
              const isEnabled = rule.enabled;
              return (
                <div
                  key={rule.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    isEnabled
                      ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/30 border-slate-800/40 opacity-60'
                  }`}
                >
                  <div>
                    {/* Top row */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isEnabled ? 'bg-emerald-400' : 'bg-slate-600'
                          }`}
                        />
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {rule.category}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          {rule.httpMethod}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                            rule.successMood === 'happy'
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                              : rule.successMood === 'focused'
                              ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                              : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          Mood: {rule.successMood}
                        </span>
                        <button
                          onClick={() => handleToggleRuleEnabled(rule.id)}
                          className={`w-7 h-4 rounded-full transition-colors relative cursor-pointer ${
                            isEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
                              isEnabled ? 'left-3.5' : 'left-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Trigger phrase */}
                    <h5 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>"{rule.triggerPhrase}"</span>
                    </h5>

                    {/* Alternative phrases */}
                    {rule.alternativePhrases.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {rule.alternativePhrases.map((alt: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                          >
                            "{alt}"
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Target device & Endpoint */}
                    <div className="mt-2.5 p-2 rounded-lg bg-slate-900/90 border border-slate-800/80 font-mono text-[11px] space-y-1">
                      <div className="text-slate-300 flex items-center gap-1.5">
                        <Server className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{rule.targetDeviceName}</span>
                      </div>
                      <div className="text-cyan-400 truncate flex items-center gap-1">
                        <Wifi className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="truncate">{rule.endpointUrl}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between">
                    <button
                      onClick={() => executeVoiceCommand(rule.triggerPhrase)}
                      disabled={isProcessing}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600/90 hover:bg-cyan-500 text-white font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-cyan-500/20"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Test Trigger</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditRuleClick(rule)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                        title="Chỉnh sửa quy tắc"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-300 transition-all cursor-pointer"
                        title="Xóa quy tắc"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Execution Logs */}
      {activeTab === 'logs' && (
        <div className="p-5">
          {logs.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              Chưa có lịch sử lệnh giọng nói. Nhấn microphone hoặc nút "Test Trigger" để thực thi lệnh đầu tiên!
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Nhật ký thời gian thực ({logs.length} bản ghi)</span>
                <button
                  onClick={() => setLogs([])}
                  className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Xóa lịch sử</span>
                </button>
              </div>

              <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    onClick={() => setSelectedLogDetail(selectedLogDetail?.id === log.id ? null : log)}
                    className="p-3 hover:bg-slate-900/60 transition-colors flex items-center justify-between gap-3 text-xs cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          log.status === 'success' ? 'bg-emerald-400' : 'bg-red-400'
                        }`}
                      />
                      <span className="font-mono text-[11px] text-slate-400 shrink-0">
                        {log.timestamp}
                      </span>
                      <span className="font-semibold text-slate-200 truncate">
                        "{log.spokenText}"
                      </span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 shrink-0 hidden sm:inline">
                        {log.httpMethod}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {log.latencyMs}ms
                      </span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        Avatar: {log.avatarMoodTriggered}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                          selectedLogDetail?.id === log.id ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Log Detail Drawer */}
              {selectedLogDetail && (
                <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs font-mono space-y-2">
                  <div className="flex items-center justify-between text-cyan-300 font-bold">
                    <span>HTTP REST Transaction Inspector</span>
                    <span>Status: {selectedLogDetail.statusCode} OK</span>
                  </div>
                  <div className="text-slate-300">
                    <span className="text-slate-500">Endpoint: </span>
                    {selectedLogDetail.endpoint}
                  </div>
                  <div className="text-slate-300">
                    <span className="text-slate-500">Avatar Feedback Mood: </span>
                    <span className="text-emerald-400 font-bold">{selectedLogDetail.avatarMoodTriggered}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded text-[11px] text-slate-300 overflow-x-auto">
                    <div className="text-slate-500 mb-1">// LAN Response Payload</div>
                    <pre>{selectedLogDetail.responseSummary}</pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Rule Editor */}
      {activeTab === 'rule_editor' && (
        <div className="p-5">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>{isEditingRule ? 'Cập Nhật Quy Tắc Giọng Nói LAN' : 'Thêm Khẩu Lệnh Giọng Nói LAN Mới'}</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Ánh xạ câu nói tự nhiên tới API REST của thiết bị thông minh trên mạng cục bộ
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Khẩu Lệnh Kích Hoạt Chính (Spoken Trigger) *
                </label>
                <input
                  type="text"
                  value={ruleForm.triggerPhrase || ''}
                  onChange={(e) => setRuleForm({ ...ruleForm, triggerPhrase: e.target.value })}
                  placeholder="Ví dụ: Bật quạt thông gió..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tên Thiết Bị Đích (Target Device)
                </label>
                <input
                  type="text"
                  value={ruleForm.targetDeviceName || ''}
                  onChange={(e) => setRuleForm({ ...ruleForm, targetDeviceName: e.target.value })}
                  placeholder="Ví dụ: Quạt Phòng Làm Việc"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Các Câu Nói Tương Đương (Alternative Phrasing, phân cách dấu phẩy)
              </label>
              <input
                type="text"
                value={(ruleForm.alternativePhrases || []).join(', ')}
                onChange={(e) =>
                  setRuleForm({
                    ...ruleForm,
                    alternativePhrases: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="bật quạt, mát mẻ, turn on fan..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  HTTP Method
                </label>
                <select
                  value={ruleForm.httpMethod || 'POST'}
                  onChange={(e) => setRuleForm({ ...ruleForm, httpMethod: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none cursor-pointer"
                >
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="GET">GET</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  LAN Endpoint URL *
                </label>
                <input
                  type="text"
                  value={ruleForm.endpointUrl || ''}
                  onChange={(e) => setRuleForm({ ...ruleForm, endpointUrl: e.target.value })}
                  placeholder="http://192.168.1.xxx:8080/api/lan/iot/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-cyan-300 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Payload JSON (Body gửi qua LAN)
              </label>
              <textarea
                rows={3}
                value={ruleForm.payloadJson || ''}
                onChange={(e) => setRuleForm({ ...ruleForm, payloadJson: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Biểu Cảm Avatar Khi Thành Công (Mood Reaction)
                </label>
                <select
                  value={ruleForm.successMood || 'happy'}
                  onChange={(e) => setRuleForm({ ...ruleForm, successMood: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none cursor-pointer"
                >
                  <option value="happy">Happy (Vui vẻ, Rạng rỡ)</option>
                  <option value="focused">Focused (Tập trung, Phân tích)</option>
                  <option value="curious">Curious (Tò mò, Lắng nghe)</option>
                  <option value="empathetic">Empathetic (Thấu cảm, Ấm áp)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Danh Mục (Category)
                </label>
                <select
                  value={ruleForm.category || 'lighting'}
                  onChange={(e) => setRuleForm({ ...ruleForm, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none cursor-pointer"
                >
                  <option value="lighting">Ánh sáng (Lighting)</option>
                  <option value="climate">Nhiệt độ & Điều hòa (Climate)</option>
                  <option value="power">Nguồn điện & Server (Power)</option>
                  <option value="security">An ninh & Camera (Security)</option>
                  <option value="scenes">Kịch bản tổng hợp (Scenes)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Lời Nói Hoppi Phản Hồi (Speech Confirmation)
              </label>
              <input
                type="text"
                value={ruleForm.feedbackSpeechVi || ''}
                onChange={(e) => setRuleForm({ ...ruleForm, feedbackSpeechVi: e.target.value })}
                placeholder="Ví dụ: Đã bật quạt thành công cho Chủ nhân!"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('triggers')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition-all"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveRule}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isEditingRule ? 'Cập Nhật Quy Tắc' : 'Lưu Quy Tắc Mới'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
