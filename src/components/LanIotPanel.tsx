import React, { useState, useEffect, useRef } from 'react';
import { IoTDevice, AppTheme, ExpressiveMood, IoTSceneDeviceAction } from '../types';
import { IoTVoiceCommand } from './IoTVoiceCommand';
import { IoTSceneManager, DEFAULT_PRESET_SCENES } from './IoTSceneManager';
import {
  Wifi,
  Power,
  Sliders,
  Sun,
  Shield,
  Activity,
  Radio,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ToggleRight,
  Router,
  Wind,
  Video,
  Radar,
  Play,
  Pause,
  Server,
  Zap,
  Mic,
  Sparkles,
  Moon,
  Lock,
  ShieldCheck,
} from 'lucide-react';

interface ExtendedIoTDevice extends IoTDevice {
  pingMs?: number;
  lastDiscoveredAt?: string;
}

interface LanIotPanelProps {
  theme?: AppTheme;
  avatarMood?: ExpressiveMood;
  onSetAvatarMood?: (mood: ExpressiveMood) => void;
  onSpeakText?: (text: string) => void;
  isMaster?: boolean;
  lowPowerMode?: boolean;
  isEmergencyShutdownActive?: boolean;
}

export const LanIotPanel: React.FC<LanIotPanelProps> = ({
  theme = 'cyberpunk',
  avatarMood = 'happy',
  onSetAvatarMood,
  onSpeakText,
  isMaster = true,
  lowPowerMode = false,
  isEmergencyShutdownActive = false,
}) => {
  const [activeTab, setActiveTab] = useState<'scenes' | 'voice' | 'devices'>('scenes');
  const [isScanning, setIsScanning] = useState(false);
  const [isAutoScanActive, setIsAutoScanActive] = useState(true);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [packetsSent, setPacketsSent] = useState(1420);
  const autoScanIntervalRef = useRef<any>(null);

  const [devices, setDevices] = useState<ExtendedIoTDevice[]>([
    {
      id: 'iot-01',
      name: 'Đèn Thông Minh Bàn Làm Việc',
      type: 'light',
      location: 'Phòng làm việc Chủ nhân Hải',
      ip: '192.168.1.115',
      protocol: 'Tuya / Local',
      isOnline: true,
      pingMs: 3,
      lastDiscoveredAt: 'Vừa xong',
      state: {
        power: true,
        brightness: 85,
        color: '#38bdf8',
      },
    },
    {
      id: 'iot-02',
      name: 'Router Mạng Nội Bộ (Hoppi Gateway)',
      type: 'router',
      location: 'Tủ kỹ thuật Rack Server',
      ip: '192.168.1.1',
      protocol: 'mDNS',
      isOnline: true,
      pingMs: 1,
      lastDiscoveredAt: 'Vừa xong',
      state: {
        power: true,
        bandwidthMbps: 940,
      },
    },
    {
      id: 'iot-03',
      name: 'Ổ Cắm Thông Minh Home Server 24/7',
      type: 'switch',
      location: 'Cụm Mini PC Server',
      ip: '192.168.1.120',
      protocol: 'Tasmota',
      isOnline: true,
      pingMs: 4,
      lastDiscoveredAt: 'Vừa xong',
      state: {
        power: true,
      },
    },
    {
      id: 'iot-04',
      name: 'Điều Hòa Trung Tâm Inverter',
      type: 'climate',
      location: 'Phòng làm việc',
      ip: '192.168.1.140',
      protocol: 'SSDP',
      isOnline: true,
      pingMs: 6,
      lastDiscoveredAt: '1 phút trước',
      state: {
        power: true,
        temperature: 24,
      },
    },
    {
      id: 'iot-05',
      name: 'Camera An Ninh AI Hồng Ngoại 4K',
      type: 'camera',
      location: 'Cửa ra vào & Hành lang',
      ip: '192.168.1.168',
      protocol: 'mDNS',
      isOnline: true,
      pingMs: 4,
      lastDiscoveredAt: 'Vừa xong',
      state: {
        power: true,
        securityArmed: true,
      },
    },
    {
      id: 'iot-lock',
      name: 'Khóa Cửa Từ Vân Tay An Ninh 3 Lớp',
      type: 'lock',
      location: 'Cửa chính căn hộ',
      ip: '192.168.1.185',
      protocol: 'Tuya / Local',
      isOnline: true,
      pingMs: 2,
      lastDiscoveredAt: 'Vừa xong',
      state: {
        power: true,
        locked: true,
      },
    },
  ]);

  // Handle applying scene actions directly to device states
  const handleApplySceneActions = (actions: IoTSceneDeviceAction[]) => {
    setDevices((prev) => {
      let updated = [...prev];
      actions.forEach((act) => {
        const foundIdx = updated.findIndex((d) => d.id === act.deviceId);
        if (foundIdx >= 0) {
          const dev = updated[foundIdx];
          const newPower = act.targetState.power !== undefined ? act.targetState.power : dev.state.power;
          const newBrightness =
            act.targetState.brightness !== undefined ? act.targetState.brightness : dev.state.brightness;
          const newColor = act.targetState.color !== undefined ? act.targetState.color : dev.state.color;
          const newTemp =
            act.targetState.temperature !== undefined ? act.targetState.temperature : dev.state.temperature;
          const newLocked = act.targetState.locked !== undefined ? act.targetState.locked : dev.state.locked;
          const newSecurity =
            act.targetState.securityArmed !== undefined ? act.targetState.securityArmed : dev.state.securityArmed;
          const newPosition =
            act.targetState.position !== undefined ? act.targetState.position : dev.state.position;

          updated[foundIdx] = {
            ...dev,
            state: {
              ...dev.state,
              power: newPower,
              brightness: newBrightness,
              color: newColor,
              temperature: newTemp,
              locked: newLocked,
              securityArmed: newSecurity,
              position: newPosition,
            },
          };
        } else {
          // If device not yet in list, insert dynamically
          updated.push({
            id: act.deviceId,
            name: act.deviceName,
            type: act.deviceType as any,
            location: 'Khu vực chính',
            ip: `192.168.1.${Math.floor(Math.random() * 40) + 150}`,
            protocol: 'Tuya / Local',
            isOnline: true,
            pingMs: 2,
            lastDiscoveredAt: 'Vừa xong',
            state: {
              power: act.targetState.power ?? true,
              brightness: act.targetState.brightness,
              temperature: act.targetState.temperature,
              locked: act.targetState.locked,
              securityArmed: act.targetState.securityArmed,
              position: act.targetState.position,
            },
          });
        }
      });
      return updated;
    });
  };

  // Cross-component Broadcast listener for global Scene execution
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;
    const channel = new BroadcastChannel('hoppi_device_mesh_channel');
    channel.onmessage = (event) => {
      if (event.data?.type === 'HOPPI_TRIGGER_SCENE') {
        const sceneName = event.data?.sceneName;
        const matched = DEFAULT_PRESET_SCENES.find(
          (s) =>
            s.id === event.data?.sceneId ||
            s.name.toLowerCase().includes(sceneName?.toLowerCase()) ||
            s.triggerVoicePhrase.toLowerCase() === event.data?.spokenText?.toLowerCase()
        );
        if (matched) {
          handleApplySceneActions(matched.actions);
          setScanMessage(`Kịch bản "${matched.name}" đã kích hoạt qua lệnh giọng nói toàn cục!`);
          setTimeout(() => setScanMessage(null), 4000);
        }
      }
    };
    return () => {
      channel.close();
    };
  }, []);

  // Background Auto-Scan continuous discovery loop
  useEffect(() => {
    if (isEmergencyShutdownActive) {
      if (autoScanIntervalRef.current) clearInterval(autoScanIntervalRef.current);
      setDevices((prev) => prev.map((d) => ({ ...d, isOnline: false, state: { ...d.state, power: false } })));
      return;
    }

    if (isAutoScanActive) {
      const pollingIntervalMs = lowPowerMode ? 20000 : 4000;
      autoScanIntervalRef.current = setInterval(() => {
        // Increase packet counter
        setPacketsSent((prev) => prev + (lowPowerMode ? 1 : 4));

        // Update random latency on devices and simulate active heartbeats
        setDevices((prev) => {
          const updated = prev.map((d) => ({
            ...d,
            pingMs: Math.max(1, Math.min(15, Math.floor(Math.random() * 8) + 1)),
            lastDiscoveredAt: 'Vừa xong',
          }));

          return updated;
        });
      }, pollingIntervalMs);
    } else {
      if (autoScanIntervalRef.current) {
        clearInterval(autoScanIntervalRef.current);
      }
    }

    return () => {
      if (autoScanIntervalRef.current) {
        clearInterval(autoScanIntervalRef.current);
      }
    };
  }, [isAutoScanActive, lowPowerMode, isEmergencyShutdownActive]);

  // Manual one-shot scan
  const handleScanNetwork = () => {
    setIsScanning(true);
    setScanMessage('Đang phát gói tin UDP mDNS / SSDP broadcast trên dải 192.168.1.0/24...');

    setTimeout(() => {
      setScanMessage(`Đã quét toàn bộ dải mạng LAN: ${devices.length} thiết bị phản hồi tín hiệu hợp lệ!`);
      setIsScanning(false);
      setTimeout(() => setScanMessage(null), 3500);
    }, 1500);
  };

  const handleTogglePower = (id: string) => {
    setDevices((prev) =>
      prev.map((dev) =>
        dev.id === id
          ? { ...dev, state: { ...dev.state, power: !dev.state.power } }
          : dev
      )
    );
  };

  const handleChangeBrightness = (id: string, brightness: number) => {
    setDevices((prev) =>
      prev.map((dev) =>
        dev.id === id
          ? { ...dev, state: { ...dev.state, brightness } }
          : dev
      )
    );
  };

  const handleChangeTemp = (id: string, delta: number) => {
    setDevices((prev) =>
      prev.map((dev) =>
        dev.id === id && dev.state.temperature
          ? { ...dev, state: { ...dev.state, temperature: Math.min(30, Math.max(16, dev.state.temperature + delta)) } }
          : dev
      )
    );
  };

  const getDeviceIcon = (type: IoTDevice['type']) => {
    switch (type) {
      case 'light':
        return <Lightbulb className="w-5 h-5" />;
      case 'router':
        return <Router className="w-5 h-5" />;
      case 'switch':
        return <ToggleRight className="w-5 h-5" />;
      case 'climate':
        return <Wind className="w-5 h-5" />;
      case 'camera':
        return <Video className="w-5 h-5" />;
      case 'lock':
        return <Lock className="w-5 h-5" />;
      case 'curtain':
        return <Sun className="w-5 h-5" />;
      default:
        return <Radio className="w-5 h-5" />;
    }
  };

  return (
    <div
      className={`h-full flex flex-col rounded-2xl border backdrop-blur-md overflow-hidden ${
        theme === 'cyberpunk'
          ? 'bg-slate-900/60 border-slate-800'
          : theme === 'deepspace'
          ? 'bg-[#090d15] border-neutral-800 text-neutral-200'
          : 'bg-white border-slate-200 text-slate-800 shadow-sm'
      }`}
    >
      {/* Top Header */}
      <div
        className={`px-5 py-3.5 border-b flex items-center justify-between flex-wrap gap-2 ${
          theme === 'cyberpunk'
            ? 'bg-slate-950/80 border-slate-800'
            : theme === 'deepspace'
            ? 'bg-[#07090f] border-neutral-800'
            : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-white">
                Điều Khiển LAN & IoT (Zero-Configuration)
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                mDNS / SSDP
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Kịch bản tự trị, định tuyến lệnh giọng nói và quản lý thiết bị nội bộ 24/7
            </p>
          </div>
        </div>

        {/* View Switcher: Smart Scenes vs Voice Command Router vs LAN Devices */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('scenes')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'scenes'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>Kịch Bản Tự Trị (Scenes)</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'voice'
                ? 'bg-cyan-500 text-white font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-cyan-200" />
            <span>Lệnh Giọng Nói</span>
          </button>
          <button
            onClick={() => setActiveTab('devices')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'devices'
                ? 'bg-cyan-500 text-white font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Thiết Bị ({devices.length})</span>
          </button>
        </div>

        {/* Scan Actions: Manual Scan & Continuous Auto-Scan Toggle */}
        <div className="flex items-center gap-2">
          {/* Continuous Background Auto-Scan Toggle Button */}
          <button
            onClick={() => setIsAutoScanActive(!isAutoScanActive)}
            title={
              isAutoScanActive
                ? 'Dừng tiến trình quét ngầm Auto-Scan'
                : 'Kích hoạt tác vụ quét ngầm Auto-Scan tìm thiết bị trong mạng LAN'
            }
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isAutoScanActive
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/20'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            {isAutoScanActive ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Radar className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Auto-Scan: ĐANG CHẠY</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Bật Auto-Scan</span>
              </>
            )}
          </button>

          {/* Manual One-Shot Scan Network Action */}
          <button
            onClick={handleScanNetwork}
            disabled={isScanning}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/20 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Đang quét...' : 'Quét Ngay'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'scenes' ? (
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <IoTSceneManager
            theme={theme}
            isMaster={isMaster}
            avatarMood={avatarMood}
            onSetAvatarMood={onSetAvatarMood}
            onSpeakText={onSpeakText}
            onApplySceneActions={handleApplySceneActions}
          />
        </div>
      ) : activeTab === 'voice' ? (
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <IoTVoiceCommand
            currentMood={avatarMood}
            onSetMood={onSetAvatarMood || (() => {})}
            onSpeakText={onSpeakText}
            theme={theme}
            isMaster={isMaster}
            onNavigateToIotPanel={() => setActiveTab('devices')}
          />
        </div>
      ) : (
        <>
          {/* Quick Scene Trigger Bar on top of Devices */}
          <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chạy Nhanh Kịch Bản:</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  const sc = DEFAULT_PRESET_SCENES.find((s) => s.id === 'scene-good-night');
                  if (sc) {
                    handleApplySceneActions(sc.actions);
                    if (onSpeakText) onSpeakText(sc.feedbackSpeechVi);
                    if (onSetAvatarMood) onSetAvatarMood(sc.targetMood);
                    setScanMessage('Đã kích hoạt kịch bản "Chúc Ngủ Ngon" (Đèn tắt, Cửa khóa, An ninh bật, AC 26°C)!');
                    setTimeout(() => setScanMessage(null), 3500);
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Moon className="w-3 h-3" />
                <span>Chúc Ngủ Ngon</span>
              </button>
              <button
                onClick={() => {
                  const sc = DEFAULT_PRESET_SCENES.find((s) => s.id === 'scene-deep-focus');
                  if (sc) {
                    handleApplySceneActions(sc.actions);
                    if (onSpeakText) onSpeakText(sc.feedbackSpeechVi);
                    if (onSetAvatarMood) onSetAvatarMood(sc.targetMood);
                    setScanMessage('Đã kích hoạt kịch bản "Tập Trung Cao Độ" (Đèn 100%, AC 23°C, Server bật)!');
                    setTimeout(() => setScanMessage(null), 3500);
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Zap className="w-3 h-3" />
                <span>Tập Trung Sâu</span>
              </button>
              <button
                onClick={() => {
                  const sc = DEFAULT_PRESET_SCENES.find((s) => s.id === 'scene-away-home');
                  if (sc) {
                    handleApplySceneActions(sc.actions);
                    if (onSpeakText) onSpeakText(sc.feedbackSpeechVi);
                    if (onSetAvatarMood) onSetAvatarMood(sc.targetMood);
                    setScanMessage('Đã kích hoạt kịch bản "Rời Khỏi Nhà" (Tắt điện, Khóa cửa, Vũ trang Camera 4K)!');
                    setTimeout(() => setScanMessage(null), 3500);
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Rời Nhà</span>
              </button>
              <button
                onClick={() => setActiveTab('scenes')}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium ml-1 cursor-pointer"
              >
                Tất cả kịch bản →
              </button>
            </div>
          </div>

          {/* Auto-Scan Telemetry Status Banner */}
          <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span>Giao thức: UDP Port 5353 (mDNS) & Port 1900 (SSDP)</span>
              <span className="text-slate-600">•</span>
              <span className="font-mono text-cyan-400">
                {packetsSent} gói tin multicast đã gửi
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {devices.filter((d) => d.isOnline).length}/{devices.length} Thiết bị trực tuyến
              </span>
              <span className="text-slate-500 font-mono">Chu kỳ dò: 4 giây</span>
            </div>
          </div>

          {/* Notification banner if any */}
          {scanMessage && (
            <div className="mx-4 mt-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-300 flex items-center gap-2 animate-pulse">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span>{scanMessage}</span>
            </div>
          )}

          {/* Grid of IoT Devices with Pulsing Status Indicators */}
          <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
        {devices.map((device) => {
          const isPowered = device.state.power;
          return (
            <div
              key={device.id}
              className={`p-4 rounded-xl border transition-all ${
                isPowered
                  ? theme === 'cyberpunk'
                    ? 'bg-slate-950/80 border-slate-700 shadow-sm'
                    : 'bg-[#151821]/80 border-zinc-700'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-xl border ${
                      isPowered
                        ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                        : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}
                  >
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-slate-100">{device.name}</h4>
                    </div>

                    {/* Pulsing Real-time Connection Status Indicator */}
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          {device.isOnline && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          )}
                          <span
                            className={`relative inline-flex rounded-full h-2 w-2 ${
                              device.isOnline
                                ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                                : 'bg-slate-500'
                            }`}
                          ></span>
                        </span>
                        <span
                          className={`text-[10px] font-mono font-medium ${
                            device.isOnline ? 'text-emerald-400' : 'text-slate-500'
                          }`}
                        >
                          {device.isOnline ? `Đang kết nối (${device.pingMs || 3}ms)` : 'Mất tín hiệu'}
                        </span>
                      </div>
                      <span className="text-slate-600">•</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {device.ip}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                      <span>Vị trí: {device.location}</span>
                      <span>•</span>
                      <span>{device.protocol}</span>
                    </div>
                  </div>
                </div>

                {/* Power Toggle Button */}
                <button
                  onClick={() => handleTogglePower(device.id)}
                  title={isPowered ? 'Tắt thiết bị' : 'Bật thiết bị'}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isPowered
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/30'
                      : 'bg-slate-900 text-slate-500 border-slate-700 hover:text-white'
                  }`}
                >
                  <Power className="w-4 h-4" />
                </button>
              </div>

              {/* Specific Control Sliders / Gauges based on type */}
              {isPowered && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-3">
                  {/* Light controls */}
                  {device.type === 'light' && device.state.brightness !== undefined && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <Sun className="w-3.5 h-3.5 text-amber-400" />
                          Độ sáng bóng đèn:
                        </span>
                        <span className="font-mono text-cyan-300 font-bold">{device.state.brightness}%</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="100"
                        value={device.state.brightness}
                        onChange={(e) => handleChangeBrightness(device.id, Number(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                    </div>
                  )}

                  {/* Router controls */}
                  {device.type === 'router' && (
                    <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg">
                      <span>Băng thông LAN:</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {device.state.bandwidthMbps} Mbps Full-Duplex
                      </span>
                    </div>
                  )}

                  {/* Climate controls */}
                  {device.type === 'climate' && device.state.temperature !== undefined && (
                    <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg">
                      <span>Nhiệt độ phòng:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleChangeTemp(device.id, -1)}
                          className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-sm cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-mono text-cyan-300 font-bold text-sm">
                          {device.state.temperature}°C
                        </span>
                        <button
                          onClick={() => handleChangeTemp(device.id, 1)}
                          className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-sm cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Camera status */}
                  {device.type === 'camera' && (
                    <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        Luồng RTSP AI Stream 4K:
                      </span>
                      <span className="font-mono text-emerald-400 font-bold">
                        30 FPS • 24/7 Ghi hình
                      </span>
                    </div>
                  )}

                  {/* Smart lock controls */}
                  {device.type === 'lock' && (
                    <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg">
                      <span className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        Trạng thái chốt an toàn:
                      </span>
                      <button
                        onClick={() => {
                          setDevices((prev) =>
                            prev.map((d) =>
                              d.id === device.id
                                ? { ...d, state: { ...d.state, locked: !d.state.locked } }
                                : d
                            )
                          );
                        }}
                        className={`px-3 py-1 rounded text-xs font-bold cursor-pointer transition-all ${
                          device.state.locked
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {device.state.locked ? '🔒 ĐÃ KHÓA CHẶT' : '🔓 ĐANG MỞ CHỐT'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
        </>
      )}
    </div>
  );
};
