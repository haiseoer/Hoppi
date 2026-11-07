import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wifi,
  WifiOff,
  Cloud,
  Database,
  Shield,
  Zap,
  BatteryCharging,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Clock,
  Sun,
  Moon,
} from 'lucide-react';
import { AppTheme, LowPowerModeConfig } from '../types';

interface SidebarConnectivityCardProps {
  isOnlineMode: boolean;
  onToggleOnlineMode: () => void;
  theme?: AppTheme;
  lowPowerConfig: LowPowerModeConfig;
  onUpdateLowPowerConfig: (config: LowPowerModeConfig) => void;
  autoThemeActive?: boolean;
  autoThemePhase?: string;
  onToggleAutoTheme?: () => void;
}

export const SidebarConnectivityCard: React.FC<SidebarConnectivityCardProps> = ({
  isOnlineMode,
  onToggleOnlineMode,
  theme = 'cyberpunk',
  lowPowerConfig,
  onUpdateLowPowerConfig,
  autoThemeActive = true,
  autoThemePhase = 'Daytime Light',
  onToggleAutoTheme,
}) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [showPowerSlider, setShowPowerSlider] = useState<boolean>(false);

  // Toggle low power manual override
  const handleToggleLowPower = () => {
    onUpdateLowPowerConfig({
      ...lowPowerConfig,
      isActive: !lowPowerConfig.isActive,
      isManualOverride: true,
      animationFramerateReduction: !lowPowerConfig.isActive,
      iotPollingIntervalSeconds: !lowPowerConfig.isActive ? 20 : 4,
    });
  };

  // Battery simulation slider handler (for testing < 20% on desktop/simulators)
  const handleSimulateBatteryLevel = (val: number) => {
    const isAutoLow = val < 20 && !lowPowerConfig.isCharging;
    onUpdateLowPowerConfig({
      ...lowPowerConfig,
      batteryLevel: val,
      isActive: isAutoLow || lowPowerConfig.isManualOverride,
      animationFramerateReduction: isAutoLow || lowPowerConfig.isManualOverride,
      iotPollingIntervalSeconds: isAutoLow || lowPowerConfig.isManualOverride ? 20 : 4,
    });
  };

  return (
    <div
      className={`w-full p-4 rounded-2xl border text-xs transition-all ${
        theme === 'light'
          ? 'bg-white border-slate-200 text-slate-700 shadow-sm'
          : theme === 'deepspace'
          ? 'bg-[#090d15] border-neutral-800 text-neutral-300'
          : 'bg-slate-900/50 border-slate-800/90 text-slate-300'
      }`}
    >
      {/* Header: Mode Badge & Fast Toggle Switch */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg border ${
              isOnlineMode
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : 'bg-amber-500/15 border-amber-500/40 text-amber-400'
            }`}
          >
            {isOnlineMode ? <Cloud className="w-4 h-4" /> : <Database className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs">
                {isOnlineMode ? 'Cloud-Connected' : 'Local Vector-Only'}
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnlineMode ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
            </div>
            <p className="text-[10px] text-slate-400">
              {isOnlineMode ? 'Gemini 2.5 Cloud + Mesh Relay' : 'ChromaDB Cục Bộ 100% (Offline)'}
            </p>
          </div>
        </div>

        {/* Switch Button */}
        <button
          onClick={onToggleOnlineMode}
          className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
            isOnlineMode
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
          }`}
          title="Bấm để chuyển đổi chế độ Trực tuyến (Cloud) hoặc Ngoại tuyến (Local Vector)"
        >
          {isOnlineMode ? 'Chuyển Local' : 'Chuyển Cloud'}
        </button>
      </div>

      {/* Processing Capability Explanation Matrix */}
      <div className="mt-2.5 space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Khả năng suy luận:</span>
          <span
            className={`font-semibold font-mono ${
              isOnlineMode ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {isOnlineMode ? 'Gemini Pro / Flash' : 'Edge SLM / Vectors'}
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Bảo mật dữ liệu:</span>
          <span className="text-cyan-400 font-mono font-medium">
            {isOnlineMode ? 'E2E HTTPS + TLS' : 'Không ra Internet (LAN Airgap)'}
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Độ sẵn sàng:</span>
          <span className="text-emerald-400 font-mono font-medium">
            {isOnlineMode ? 'Phụ thuộc Internet' : '100% Hoạt động khi mất mạng'}
          </span>
        </div>
      </div>

      {/* Low Power Mode Status & Simulator */}
      <div
        className={`mt-3 pt-2.5 border-t border-slate-800/80 flex flex-col gap-2 rounded-xl p-2 ${
          lowPowerConfig.isActive
            ? 'bg-amber-500/10 border border-amber-500/30'
            : theme === 'light'
            ? 'bg-slate-50'
            : 'bg-slate-950/40'
        }`}
      >
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            {lowPowerConfig.batteryLevel <= 20 && !lowPowerConfig.isCharging ? (
              <BatteryLow className="w-4 h-4 text-rose-500 animate-pulse" />
            ) : lowPowerConfig.isCharging ? (
              <BatteryCharging className="w-4 h-4 text-emerald-400" />
            ) : (
              <BatteryMedium className="w-4 h-4 text-amber-400" />
            )}
            <span className="font-semibold text-[11px]">Chế Độ Tiết Kiệm Pin:</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`font-mono font-bold text-[11px] ${
                lowPowerConfig.isActive ? 'text-amber-400' : 'text-slate-400'
              }`}
            >
              {lowPowerConfig.batteryLevel}% {lowPowerConfig.isCharging ? '⚡' : ''}
            </span>
            <button
              onClick={handleToggleLowPower}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                lowPowerConfig.isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              {lowPowerConfig.isActive ? 'BẬT (ECO)' : 'TẮT'}
            </button>
          </div>
        </div>

        {/* Active Throttling Summary */}
        {lowPowerConfig.isActive && (
          <div className="text-[10px] text-amber-300/90 leading-tight flex items-center justify-between">
            <span>• Giảm FPS Avatar (20 FPS)</span>
            <span>• Giãn chu kỳ quét IoT (20s)</span>
          </div>
        )}

        {/* Battery Simulation Drawer Toggle */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setShowPowerSlider(!showPowerSlider)}
            className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
          >
            <Sliders className="w-3 h-3" />
            <span>{showPowerSlider ? 'Ẩn giả lập pin' : 'Mô phỏng mức pin (<20%)'}</span>
          </button>
          {lowPowerConfig.batteryLevel < 20 && !lowPowerConfig.isCharging && (
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono font-bold animate-pulse">
              PIN YẾU &lt; 20%
            </span>
          )}
        </div>

        {/* Interactive Battery Slider for testing */}
        {showPowerSlider && (
          <div className="mt-1 p-2 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Kéo để test mức pin thiết bị:</span>
              <span className="font-mono text-cyan-300 font-bold">
                {lowPowerConfig.batteryLevel}%
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={lowPowerConfig.batteryLevel}
              onChange={(e) => handleSimulateBatteryLevel(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-mono">
              <span
                onClick={() => handleSimulateBatteryLevel(15)}
                className="hover:text-rose-400 cursor-pointer underline"
              >
                15% (Kích hoạt ECO)
              </span>
              <span
                onClick={() => handleSimulateBatteryLevel(85)}
                className="hover:text-emerald-400 cursor-pointer underline"
              >
                85% (Bình thường)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Auto-Theme Scheduler Status */}
      {onToggleAutoTheme && (
        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Lịch giao diện tự động:</span>
          </div>
          <button
            onClick={onToggleAutoTheme}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all cursor-pointer ${
              autoThemeActive
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {autoThemeActive ? `BẬT (${autoThemePhase})` : 'TẮT'}
          </button>
        </div>
      )}
    </div>
  );
};
