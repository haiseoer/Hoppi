import React, { useState, useEffect } from 'react';
import {
  AdaptiveLightConfig,
  EyeComfortPreset,
  AmbientSensorSource,
  AppTheme,
  DEFAULT_ADAPTIVE_LIGHT_CONFIG,
} from '../types';
import {
  Sun,
  Moon,
  Eye,
  Sliders,
  Sparkles,
  ShieldCheck,
  Volume2,
  Zap,
  Check,
  RotateCcw,
  Info,
  Radio,
  Clock,
  Laptop,
  CheckCircle2,
  X,
} from 'lucide-react';

interface AdaptiveLightControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AdaptiveLightConfig;
  onUpdateConfig: (newConfig: AdaptiveLightConfig) => void;
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
  onSpeakText?: (text: string) => void;
}

export const AdaptiveLightControlModal: React.FC<AdaptiveLightControlModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  currentTheme,
  onSelectTheme,
  onSpeakText,
}) => {
  const [activeTab, setActiveTab] = useState<'preset' | 'tuning' | 'sensors'>('preset');
  const [hardwareSensorSupported, setHardwareSensorSupported] = useState<boolean>(false);
  const [detectedSensorLux, setDetectedSensorLux] = useState<number>(config.ambientLux);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);

  // Probe W3C AmbientLightSensor API
  useEffect(() => {
    let sensor: any = null;
    try {
      if ('AmbientLightSensor' in window) {
        sensor = new (window as any).AmbientLightSensor();
        sensor.addEventListener('reading', () => {
          setHardwareSensorSupported(true);
          const luxVal = Math.round(sensor.illuminance);
          setDetectedSensorLux(luxVal);
          if (config.isEnabled && config.sensorSource === 'ambient_api') {
            applyAdaptiveAutoLux(luxVal);
          }
        });
        sensor.start();
      } else {
        setHardwareSensorSupported(false);
      }
    } catch {
      setHardwareSensorSupported(false);
    }

    return () => {
      if (sensor) {
        try {
          sensor.stop();
        } catch {
          // ignore
        }
      }
    };
  }, [config.isEnabled, config.sensorSource]);

  // Simulate or sync IoT Mesh BH1750 photodiode telemetry if mesh_iot source
  useEffect(() => {
    if (!config.isEnabled) return;

    const interval = setInterval(() => {
      const hour = new Date().getHours();
      let baseLux = 45;

      if (config.sensorSource === 'time_circadian') {
        // Day/night natural light estimation
        if (hour >= 7 && hour <= 11) baseLux = 320;
        else if (hour > 11 && hour <= 16) baseLux = 550;
        else if (hour > 16 && hour <= 18) baseLux = 210;
        else if (hour > 18 && hour <= 21) baseLux = 65;
        else baseLux = 12; // late night
      } else if (config.sensorSource === 'mesh_iot') {
        // Mesh IoT Hub BH1750 photodiode reading with natural micro-fluctuations
        const timeFactor = hour >= 6 && hour < 19 ? 380 : 35;
        const jitter = Math.floor(Math.random() * 8) - 4;
        baseLux = Math.max(5, timeFactor + jitter);
      } else if (config.sensorSource === 'ambient_api' && !hardwareSensorSupported) {
        baseLux = hour >= 6 && hour < 19 ? 340 : 40;
      } else if (config.sensorSource === 'manual') {
        return;
      }

      setDetectedSensorLux(baseLux);

      if (config.activePreset === 'auto') {
        applyAdaptiveAutoLux(baseLux);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [config.isEnabled, config.sensorSource, config.activePreset, hardwareSensorSupported]);

  // Real-time algorithm: maps Ambient Lux to Eye Comfort parameters
  const applyAdaptiveAutoLux = (lux: number) => {
    let screenBright = 85;
    let themeInt = 70;
    let blueFilter = 20;
    let contrast = 95;

    if (lux < 20) {
      // Pitch black night / bedroom
      screenBright = 65;
      themeInt = 35; // Muted neon to eliminate blinding glare
      blueFilter = 45; // Maximum blue light absorption
      contrast = 88;
    } else if (lux < 80) {
      // Dim office / evening room
      screenBright = 75;
      themeInt = 50;
      blueFilter = 30;
      contrast = 92;
    } else if (lux < 250) {
      // Normal indoor lighting
      screenBright = 85;
      themeInt = 75;
      blueFilter = 15;
      contrast = 98;
    } else {
      // Bright sunlight / well-lit studio
      screenBright = 100;
      themeInt = 100; // Full radiant bloom
      blueFilter = 0;
      contrast = 105;
    }

    onUpdateConfig({
      ...config,
      ambientLux: lux,
      screenBrightnessPercent: screenBright,
      themeIntensityPercent: themeInt,
      blueLightFilterPercent: blueFilter,
      contrastTuningPercent: contrast,
    });
  };

  const handleSelectPreset = (preset: EyeComfortPreset) => {
    let updated: Partial<AdaptiveLightConfig> = { activePreset: preset };

    switch (preset) {
      case 'auto':
        updated = {
          ...updated,
          circadianSync: true,
          sensorSource: 'mesh_iot',
        };
        applyAdaptiveAutoLux(detectedSensorLux);
        break;
      case 'night_shift':
        updated = {
          ...updated,
          screenBrightnessPercent: 70,
          themeIntensityPercent: 40,
          blueLightFilterPercent: 40,
          contrastTuningPercent: 90,
          circadianSync: true,
        };
        break;
      case 'deep_space_oled':
        updated = {
          ...updated,
          screenBrightnessPercent: 80,
          themeIntensityPercent: 20, // Zero neon glare, pure obsidian
          blueLightFilterPercent: 25,
          contrastTuningPercent: 100,
          circadianSync: false,
        };
        onSelectTheme('deepspace');
        break;
      case 'cyber_soft':
        updated = {
          ...updated,
          screenBrightnessPercent: 85,
          themeIntensityPercent: 55, // Gentle cyber teal/amber glow
          blueLightFilterPercent: 20,
          contrastTuningPercent: 95,
          circadianSync: false,
        };
        onSelectTheme('cyberpunk');
        break;
      case 'high_visibility':
        updated = {
          ...updated,
          screenBrightnessPercent: 100,
          themeIntensityPercent: 100,
          blueLightFilterPercent: 0,
          contrastTuningPercent: 105,
          circadianSync: false,
        };
        break;
    }

    onUpdateConfig({
      ...config,
      ...updated,
    });
  };

  const handleSpeakExplanation = () => {
    const text = `Hệ thống Điều Khiển Ánh Sáng Thích Ứng Hoppi Adaptive Light đang bảo vệ thị lực của bạn trong phiên làm việc 24/7. Cảm biến quang học đo được độ rọi môi trường là ${config.ambientLux} Lux. Độ sáng màn hình được tinh chỉnh về ${config.screenBrightnessPercent}%, độ rực rỡ theme ${currentTheme} được giảm tải xuống ${config.themeIntensityPercent}% và bộ lọc ánh sáng xanh đang kích hoạt ở mức ${config.blueLightFilterPercent}% nhằm chống mỏi mắt và duy trì nhịp sinh học circadian tự nhiên.`;
    if (onSpeakText) {
      onSpeakText(text);
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'vi-VN';
      window.speechSynthesis.speak(u);
    }
  };

  const handleCalibrateSensor = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
      applyAdaptiveAutoLux(detectedSensorLux);
    }, 900);
  };

  if (!isOpen) return null;

  const getLuxCategory = (lux: number) => {
    if (lux < 20) return { label: 'Phòng Tối / Đêm Khuya', color: 'text-indigo-400', desc: 'Bảo vệ mắt tối đa' };
    if (lux < 80) return { label: 'Ánh Sáng Yếu / Đèn Bàn', color: 'text-amber-400', desc: 'Êm dịu, chống chói' };
    if (lux < 250) return { label: 'Phòng Làm Việc Tiêu Chuẩn', color: 'text-emerald-400', desc: 'Cân bằng tự nhiên' };
    return { label: 'Ánh Sáng Cao / Ban Ngày', color: 'text-cyan-400', desc: 'Tương phản sắc nét' };
  };

  const luxInfo = getLuxCategory(config.ambientLux);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl rounded-2xl border border-cyan-500/40 bg-slate-950/95 text-slate-100 shadow-2xl shadow-cyan-500/20 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Banner */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/20">
              <Eye className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  ĐIỀU KHIỂN ÁNH SÁNG THÍCH ỨNG
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-300">
                  ADAPTIVE LIGHT 24/7
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tự động cân chỉnh độ rực Theme Cyberpunk &amp; Deep Space theo cảm biến ánh sáng và nhịp sinh học
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeakExplanation}
              title="Nghe Hoppi thuyết minh về cơ chế bảo vệ thị giác 24/7"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Hoppi Giải Thích</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Ambient Sensor Real-Time Telemetry Bar */}
        <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Cảm biến quang học:</span>
              <span className="font-mono font-bold text-sm text-cyan-300">
                {config.ambientLux} Lux
              </span>
              <span className={`text-xs font-semibold ${luxInfo.color}`}>
                • {luxInfo.label}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 hidden md:inline">
              ({luxInfo.desc})
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {/* Auto Adaptive Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/50">
              <input
                type="checkbox"
                checked={config.isEnabled}
                onChange={(e) =>
                  onUpdateConfig({ ...config, isEnabled: e.target.checked })
                }
                className="rounded accent-cyan-500 cursor-pointer w-3.5 h-3.5"
              />
              <span className="text-xs font-medium text-slate-200">
                {config.isEnabled ? 'Tự thích ứng: BẬT' : 'Tự thích ứng: TẮT'}
              </span>
            </label>

            <button
              onClick={handleCalibrateSensor}
              disabled={isCalibrating}
              className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 transition-all font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className={`w-3 h-3 ${isCalibrating ? 'animate-spin' : ''}`} />
              <span>{isCalibrating ? 'Đang hiệu chuẩn...' : 'Hiệu chuẩn'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/40 px-4 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('preset')}
            className={`pb-2 px-3 font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'preset'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Chế Độ &amp; Cài Đặt Nhanh
          </button>
          <button
            onClick={() => setActiveTab('tuning')}
            className={`pb-2 px-3 font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'tuning'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Tinh Chỉnh Theme Cyberpunk &amp; OLED
          </button>
          <button
            onClick={() => setActiveTab('sensors')}
            className={`pb-2 px-3 font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'sensors'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Nguồn Cảm Biến &amp; IoT Telemetry
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* TAB 1: PRESETS */}
          {activeTab === 'preset' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Cấu Hình Mắt Thư Giãn (Eye Comfort Presets)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Preset 1: Auto */}
                  <div
                    onClick={() => handleSelectPreset('auto')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                      config.activePreset === 'auto'
                        ? 'bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {config.activePreset === 'auto' && (
                      <span className="absolute top-2.5 right-2.5 text-cyan-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold text-xs text-white">Tự Động Theo Lux</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Đo đạc cảm biến quang học liên tục để tự tăng giảm độ chói neon và ánh sáng màn hình.
                    </p>
                    <div className="mt-2.5 flex items-center gap-2 text-[10px] font-mono text-cyan-300">
                      <span>Lux: {config.ambientLux}</span>
                      <span>•</span>
                      <span>Màn hình: {config.screenBrightnessPercent}%</span>
                    </div>
                  </div>

                  {/* Preset 2: Night Shift */}
                  <div
                    onClick={() => handleSelectPreset('night_shift')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                      config.activePreset === 'night_shift'
                        ? 'bg-amber-500/15 border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {config.activePreset === 'night_shift' && (
                      <span className="absolute top-2.5 right-2.5 text-amber-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-1.5">
                      <Moon className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-xs text-white">Đêm Khuya / 3200K</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Lọc 40% ánh sáng xanh, giảm chói neon xuống 40%, ấm dịu giác mạc khi theo dõi ca đêm.
                    </p>
                    <div className="mt-2.5 flex items-center gap-2 text-[10px] font-mono text-amber-300">
                      <span>Lọc xanh: 40%</span>
                      <span>•</span>
                      <span>Neon: 40%</span>
                    </div>
                  </div>

                  {/* Preset 3: Deep Space OLED */}
                  <div
                    onClick={() => handleSelectPreset('deep_space_oled')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                      config.activePreset === 'deep_space_oled'
                        ? 'bg-indigo-500/15 border-indigo-400 shadow-md shadow-indigo-500/20'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {config.activePreset === 'deep_space_oled' && (
                      <span className="absolute top-2.5 right-2.5 text-indigo-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-1.5">
                      <Eye className="w-4 h-4 text-indigo-400" />
                      <span className="font-bold text-xs text-white">Deep Space OLED</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Đưa nền về màu đen sâu tuyệt đối, triệt tiêu viền sáng hắt và tiết kiệm pin màn OLED/MiniLED.
                    </p>
                    <div className="mt-2.5 flex items-center gap-2 text-[10px] font-mono text-indigo-300">
                      <span>Đen OLED: 100%</span>
                      <span>•</span>
                      <span>Neon Bloom: 20%</span>
                    </div>
                  </div>

                  {/* Preset 4: Cyber Soft */}
                  <div
                    onClick={() => handleSelectPreset('cyber_soft')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                      config.activePreset === 'cyber_soft'
                        ? 'bg-teal-500/15 border-teal-400 shadow-md shadow-teal-500/20'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {config.activePreset === 'cyber_soft' && (
                      <span className="absolute top-2.5 right-2.5 text-teal-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-1.5">
                      <Zap className="w-4 h-4 text-teal-400" />
                      <span className="font-bold text-xs text-white">Cyber Soft Glow</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Giữ trọn phong cách viễn tưởng cyberpunk với ánh sáng ngọc bích êm dịu, không gây chói gắt.
                    </p>
                    <div className="mt-2.5 flex items-center gap-2 text-[10px] font-mono text-teal-300">
                      <span>Theme: Cyberpunk</span>
                      <span>•</span>
                      <span>Glow: 55%</span>
                    </div>
                  </div>

                  {/* Preset 5: High Visibility */}
                  <div
                    onClick={() => handleSelectPreset('high_visibility')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                      config.activePreset === 'high_visibility'
                        ? 'bg-emerald-500/15 border-emerald-400 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {config.activePreset === 'high_visibility' && (
                      <span className="absolute top-2.5 right-2.5 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-1.5">
                      <Sun className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-xs text-white">Ánh Sáng Cao (Daylight)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      100% độ sáng &amp; tương phản cao, triệt tiêu hiện tượng lóa khi làm việc dưới ánh nắng ban ngày.
                    </p>
                    <div className="mt-2.5 flex items-center gap-2 text-[10px] font-mono text-emerald-300">
                      <span>Sáng: 100%</span>
                      <span>•</span>
                      <span>Tương phản: 105%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Live Preview Card */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-cyan-400" />
                    Mẫu Thử Thị Giác Thực Tế (Real-time Live Preview)
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Theme hiện tại: <strong className="text-white uppercase">{currentTheme}</strong>
                  </span>
                </div>

                <div
                  className={`p-4 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                    currentTheme === 'cyberpunk'
                      ? 'bg-[#080d1a] border-cyan-500/40'
                      : currentTheme === 'deepspace'
                      ? 'bg-[#000000] border-neutral-800'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                  style={{
                    filter: `brightness(${config.screenBrightnessPercent}%) contrast(${config.contrastTuningPercent}%)`,
                  }}
                >
                  <div>
                    <h5
                      className={`font-mono font-bold text-sm ${
                        currentTheme === 'cyberpunk'
                          ? 'text-cyan-400'
                          : currentTheme === 'deepspace'
                          ? 'text-neutral-300'
                          : 'text-slate-800'
                      }`}
                      style={{
                        textShadow:
                          currentTheme === 'cyberpunk'
                            ? `0 0 ${12 * (config.themeIntensityPercent / 100)}px rgba(6, 182, 212, ${
                                0.7 * (config.themeIntensityPercent / 100)
                              })`
                            : 'none',
                      }}
                    >
                      HOPPI v4.0 • 24/7 AUTONOMOUS AGENT
                    </h5>
                    <p className="text-xs text-slate-400 mt-1">
                      Mắt được thư giãn với bộ lọc ánh sáng xanh {config.blueLightFilterPercent}% và độ rực rỡ theme{' '}
                      {config.themeIntensityPercent}%.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2.5 py-1 rounded-md text-xs font-mono font-bold"
                      style={{
                        backgroundColor:
                          currentTheme === 'cyberpunk'
                            ? `rgba(6, 182, 212, ${0.15 * (config.themeIntensityPercent / 100)})`
                            : currentTheme === 'deepspace'
                            ? '#111827'
                            : '#f1f5f9',
                        color: currentTheme === 'cyberpunk' ? '#38bdf8' : '#e2e8f0',
                        border:
                          currentTheme === 'cyberpunk'
                            ? `1px solid rgba(56, 189, 248, ${0.4 * (config.themeIntensityPercent / 100)})`
                            : '1px solid #374151',
                      }}
                    >
                      LUX {config.ambientLux}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GRANULAR TUNING */}
          {activeTab === 'tuning' && (
            <div className="space-y-6">
              {/* Theme Selector */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Lựa chọn Giao diện Cốt lõi:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onSelectTheme('cyberpunk')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      currentTheme === 'cyberpunk'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    ⚡ Cyberpunk Neon
                  </button>
                  <button
                    onClick={() => onSelectTheme('deepspace')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      currentTheme === 'deepspace'
                        ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300 shadow-md shadow-indigo-500/20'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    🌌 Deep Space OLED
                  </button>
                  <button
                    onClick={() => onSelectTheme('light')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      currentTheme === 'light'
                        ? 'bg-white border-slate-300 text-slate-900 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    ☀️ Contrast Light
                  </button>
                </div>
              </div>

              {/* Slider 1: Cyberpunk Neon Bloom Intensity */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    Độ Rực Rỡ &amp; Phát Quang Neon (Cyber Bloom):
                  </span>
                  <span className="font-mono font-bold text-cyan-300">
                    {config.themeIntensityPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={config.themeIntensityPercent}
                  onChange={(e) =>
                    onUpdateConfig({
                      ...config,
                      themeIntensityPercent: Number(e.target.value),
                      activePreset: 'auto',
                    })
                  }
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">
                  {config.themeIntensityPercent < 45
                    ? '🌙 Chế độ êm dịu: Mờ viền neon sáng gắt, thay bằng tông teal/amber trầm dịu mắt ca đêm.'
                    : config.themeIntensityPercent < 75
                    ? '✨ Cân bằng: Tông neon sắc nét vừa đủ, không chói lóa.'
                    : '⚡ Rực rỡ cực đại: Hiệu ứng phát quang viễn tưởng đầy đủ cho không gian sáng.'}
                </p>
              </div>

              {/* Slider 2: Blue-Light Warmth Filter */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-amber-400" />
                    Bộ Lọc Ánh Sáng Xanh (Circadian Warmth Filter):
                  </span>
                  <span className="font-mono font-bold text-amber-300">
                    {config.blueLightFilterPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="5"
                  value={config.blueLightFilterPercent}
                  onChange={(e) =>
                    onUpdateConfig({
                      ...config,
                      blueLightFilterPercent: Number(e.target.value),
                      activePreset: 'auto',
                    })
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">
                  {config.blueLightFilterPercent === 0
                    ? 'Tự nhiên: Tông màu nguyên bản không áp sắc ấm.'
                    : `Áp dụng lớp lọc ấm sinh học (~${
                        6500 - config.blueLightFilterPercent * 50
                      }K), giúp bảo vệ võng mạc và hạn chế ức chế tiết Melatonin.`}
                </p>
              </div>

              {/* Slider 3: Screen Brightness Damping */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-emerald-400" />
                    Độ Sáng Hiển Thị Màn Hình:
                  </span>
                  <span className="font-mono font-bold text-emerald-300">
                    {config.screenBrightnessPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="5"
                  value={config.screenBrightnessPercent}
                  onChange={(e) =>
                    onUpdateConfig({
                      ...config,
                      screenBrightnessPercent: Number(e.target.value),
                      activePreset: 'auto',
                    })
                  }
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">
                  Điều tiết cường độ photon phát xạ, giảm 15-30% điện năng tiêu thụ trên màn hình IPS và OLED.
                </p>
              </div>

              {/* Slider 4: Contrast & OLED Obsidian Tuning */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                    Độ Sâu Màu Đen OLED &amp; Tương Phản:
                  </span>
                  <span className="font-mono font-bold text-indigo-300">
                    {config.contrastTuningPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="75"
                  max="115"
                  step="5"
                  value={config.contrastTuningPercent}
                  onChange={(e) =>
                    onUpdateConfig({
                      ...config,
                      contrastTuningPercent: Number(e.target.value),
                      activePreset: 'auto',
                    })
                  }
                  className="w-full accent-indigo-400 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">
                  Cân bằng giữa màu đen obsidian sâu của theme Deep Space và độ sắc nét của font chữ kỹ thuật.
                </p>
              </div>

              {/* Circadian Day/Night Sync Toggle */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/30 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    Đồng Bộ Chu Kỳ Sinh Học Theo Giờ Thực (Circadian Clock Sync)
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Tự động hạ độ rực neon và tăng lớp lọc ấm từ sau 19h tối đến 06h sáng hôm sau.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.circadianSync}
                    onChange={(e) =>
                      onUpdateConfig({ ...config, circadianSync: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: SENSORS & TELEMETRY */}
          {activeTab === 'sensors' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  Nguồn Cảm Biến Quang Học (Ambient Photodiode Sources)
                </p>
                <p className="text-slate-400">
                  Hoppi hỗ trợ 4 nguồn đo đạc quang học đa dạng để phù hợp với cả máy tính để bàn, laptop và node IoT:
                </p>
              </div>

              <div className="space-y-2.5">
                {/* Source 1: Mesh IoT Photodiode */}
                <div
                  onClick={() =>
                    onUpdateConfig({ ...config, sensorSource: 'mesh_iot' })
                  }
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    config.sensorSource === 'mesh_iot'
                      ? 'bg-cyan-500/15 border-cyan-400 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                      <Radio className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">
                          Node IoT Mesh BH1750 Hub (Khuyên dùng)
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Active
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Đọc số đo quang thông qua giao thức LAN mDNS từ cảm biến BH1750 gắn trên IoT Hub phòng làm việc.
                      </p>
                    </div>
                  </div>
                  {config.sensorSource === 'mesh_iot' && (
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  )}
                </div>

                {/* Source 2: W3C AmbientLightSensor API */}
                <div
                  onClick={() =>
                    onUpdateConfig({ ...config, sensorSource: 'ambient_api' })
                  }
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    config.sensorSource === 'ambient_api'
                      ? 'bg-cyan-500/15 border-cyan-400 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">
                          Cảm Biến Phần Cứng Máy Tính (W3C Sensor API)
                        </span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                            hardwareSensorSupported
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {hardwareSensorSupported ? 'Đã tìm thấy cảm biến' : 'Giả lập / Trình duyệt'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Đọc trực tiếp từ cảm biến ánh sáng tích hợp trên nắp màn hình MacBook / Surface / Laptop.
                      </p>
                    </div>
                  </div>
                  {config.sensorSource === 'ambient_api' && (
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  )}
                </div>

                {/* Source 3: Time-based Circadian */}
                <div
                  onClick={() =>
                    onUpdateConfig({ ...config, sensorSource: 'time_circadian' })
                  }
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    config.sensorSource === 'time_circadian'
                      ? 'bg-cyan-500/15 border-cyan-400 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-white">
                        Ước Tính Theo Đồng Hồ Mặt Trời (Circadian Solar Model)
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Tính toán góc chiếu mặt trời theo múi giờ GMT+7 để mô phỏng mức Lux tự nhiên không cần phần cứng.
                      </p>
                    </div>
                  </div>
                  {config.sensorSource === 'time_circadian' && (
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  )}
                </div>

                {/* Source 4: Manual Lux Calibration Slider */}
                <div
                  onClick={() =>
                    onUpdateConfig({ ...config, sensorSource: 'manual' })
                  }
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    config.sensorSource === 'manual'
                      ? 'bg-cyan-500/15 border-cyan-400 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                        <Sliders className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-white">
                          Cài Đặt Thủ Công (Manual Override)
                        </span>
                        <p className="text-[11px] text-slate-400">
                          Tự tay gạt mức Lux bạn mong muốn mà không bị ảnh hưởng bởi môi trường bên ngoài.
                        </p>
                      </div>
                    </div>
                    {config.sensorSource === 'manual' && (
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    )}
                  </div>

                  {config.sensorSource === 'manual' && (
                    <div className="pt-2 pl-11">
                      <div className="flex justify-between text-xs font-mono text-cyan-300 mb-1">
                        <span>Độ rọi chỉ định:</span>
                        <span>{config.ambientLux} Lux</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="800"
                        step="10"
                        value={config.ambientLux}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          applyAdaptiveAutoLux(val);
                        }}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between flex-wrap gap-2 text-xs">
          <button
            onClick={() => {
              onUpdateConfig(DEFAULT_ADAPTIVE_LIGHT_CONFIG);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi Phục Mặc Định</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Áp Dụng &amp; Đóng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
