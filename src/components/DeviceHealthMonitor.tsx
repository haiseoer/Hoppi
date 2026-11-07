import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryMedium,
  BatteryLow,
  BatteryWarning,
  Wifi,
  WifiOff,
  Signal,
  AlertTriangle,
  Zap,
  RefreshCw,
  Server,
  Laptop,
  Smartphone,
  Tablet,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Power,
  Sliders,
  Send,
  Volume2,
  SlidersHorizontal,
} from 'lucide-react';
import { AppTheme } from '../types';

export interface DeviceHealthTelemetry {
  id: string;
  name: string;
  type: 'server' | 'desktop' | 'mobile' | 'tablet' | 'wearable';
  os: string;
  ip: string;
  isMasterDevice?: boolean;
  isCurrent?: boolean;
  status: 'online' | 'busy' | 'syncing' | 'idle' | 'offline';
  latencyMs: number;
  battery: number;
  isCharging: boolean;
  activeTask?: string;
  // Extended Health & Connectivity Telemetry
  batteryHealthPercent?: number; // e.g. 98%
  batteryCycles?: number; // e.g. 142
  batteryTempC?: number; // e.g. 31°C
  connectionType?: 'WireGuard P2P' | 'Wi-Fi 6E' | 'Gigabit Ethernet' | '5G Mesh';
  signalBars?: number; // 1 to 4
  packetLossPercent?: number; // 0%
  lowPowerMode?: boolean;
}

interface DeviceHealthMonitorProps {
  devices: DeviceHealthTelemetry[];
  currentTheme: AppTheme;
  onUpdateDevice?: (updatedDevice: DeviceHealthTelemetry) => void;
  onNavigateToChatWithPrompt?: (prompt: string, targetDeviceName?: string) => void;
  onDispatchTaskTransfer?: (sourceDeviceId: string, targetDeviceId: string) => void;
}

export const DeviceHealthMonitor: React.FC<DeviceHealthMonitorProps> = ({
  devices,
  currentTheme,
  onUpdateDevice,
  onNavigateToChatWithPrompt,
  onDispatchTaskTransfer,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'low_battery' | 'charging' | 'low_latency'>('all');
  const [isPinging, setIsPinging] = useState(false);
  const [alertFeedback, setAlertFeedback] = useState<string | null>(null);

  // Critical Low-battery threshold is 20% when not charging
  const lowBatteryDevices = devices.filter(
    (d) => d.type !== 'server' && d.battery <= 20 && !d.isCharging
  );

  const chargingDevices = devices.filter((d) => d.isCharging);
  const avgBattery = Math.round(
    devices.reduce((acc, curr) => acc + curr.battery, 0) / (devices.length || 1)
  );
  const avgLatency = Math.round(
    devices.reduce((acc, curr) => acc + curr.latencyMs, 0) / (devices.length || 1)
  );

  // Handle Quick Ping on all devices
  const handlePingAll = () => {
    setIsPinging(true);
    setAlertFeedback('Đang kiểm tra tín hiệu P2P và đo đạc mức hao hụt pin...');
    setTimeout(() => {
      setIsPinging(false);
      devices.forEach((dev) => {
        if (onUpdateDevice) {
          const jitter = Math.floor(Math.random() * 4) - 2;
          onUpdateDevice({
            ...dev,
            latencyMs: Math.max(2, dev.latencyMs + jitter),
          });
        }
      });
      setAlertFeedback('Đã hoàn tất đo đạc: Tín hiệu mạng lưới 100% ổn định!');
      setTimeout(() => setAlertFeedback(null), 3000);
    }, 800);
  };

  // Toggle Charging state for testing/simulation
  const handleToggleCharging = (device: DeviceHealthTelemetry) => {
    if (onUpdateDevice) {
      const nextCharging = !device.isCharging;
      const nextBattery = nextCharging
        ? Math.min(100, device.battery + (device.battery < 20 ? 15 : 5))
        : device.battery;

      onUpdateDevice({
        ...device,
        isCharging: nextCharging,
        battery: nextBattery,
      });

      setAlertFeedback(
        nextCharging
          ? `Đã cắm nguồn sạc AC cho [${device.name}] (⚡ Đang sạc nhanh).`
          : `Đã ngắt nguồn sạc cho [${device.name}] (Chuyển sang dùng pin).`
      );
      setTimeout(() => setAlertFeedback(null), 3000);
    }
  };

  // Simulate Low-Battery on a portable device to test alerts
  const handleSimulateLowBattery = () => {
    const portableDevice = devices.find((d) => d.type === 'mobile' || d.type === 'tablet');
    if (portableDevice && onUpdateDevice) {
      const isAlreadyLow = portableDevice.battery <= 20 && !portableDevice.isCharging;
      if (isAlreadyLow) {
        // Restore
        onUpdateDevice({
          ...portableDevice,
          battery: 85,
          isCharging: true,
        });
        setAlertFeedback(`Đã khôi phục mức pin cho [${portableDevice.name}] về 85% (Đang sạc).`);
      } else {
        // Trigger low battery
        onUpdateDevice({
          ...portableDevice,
          battery: 16,
          isCharging: false,
          lowPowerMode: true,
        });
        setAlertFeedback(
          `⚠️ Đã kích hoạt kịch bản Pin Yếu (16%) trên [${portableDevice.name}] để kiểm tra cảnh báo khẩn cấp!`
        );
      }
      setTimeout(() => setAlertFeedback(null), 4000);
    }
  };

  // Transfer heavy workload to 24/7 Home Server when battery is critical
  const handleOffloadToServer = (device: DeviceHealthTelemetry) => {
    const serverDevice = devices.find((d) => d.type === 'server');
    if (onDispatchTaskTransfer && serverDevice) {
      onDispatchTaskTransfer(device.id, serverDevice.id);
    }
    setAlertFeedback(
      `Đã chuyển toàn bộ tác vụ nền từ [${device.name}] sang [${serverDevice?.name || 'Home Server'}] để tiết kiệm pin!`
    );
    setTimeout(() => setAlertFeedback(null), 4000);
  };

  // Toggle Low Power Mode
  const handleToggleLowPowerMode = (device: DeviceHealthTelemetry) => {
    if (onUpdateDevice) {
      const nextMode = !device.lowPowerMode;
      onUpdateDevice({
        ...device,
        lowPowerMode: nextMode,
      });
      setAlertFeedback(
        nextMode
          ? `Đã bật Chế độ Tiết Kiệm Pin (Eco Mode) cho [${device.name}].`
          : `Đã tắt Chế độ Tiết Kiệm Pin cho [${device.name}].`
      );
      setTimeout(() => setAlertFeedback(null), 3000);
    }
  };

  // Filtered devices
  const filteredDevices = devices.filter((dev) => {
    if (filterMode === 'low_battery') return dev.battery <= 20 && !dev.isCharging;
    if (filterMode === 'charging') return dev.isCharging;
    if (filterMode === 'low_latency') return dev.latencyMs < 15;
    return true;
  });

  return (
    <div
      className={`rounded-2xl border p-4 md:p-6 transition-all ${
        currentTheme === 'light'
          ? 'bg-white border-slate-200 shadow-sm'
          : currentTheme === 'deepspace'
          ? 'bg-[#0b101d] border-slate-800'
          : 'bg-slate-900/90 border-slate-800'
      }`}
    >
      {/* Header section with Title, Status Badges & Quick Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/70">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400">
              <BatteryCharging className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base md:text-lg font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                  Giám Sát Sức Khỏe Thiết Bị & Nguồn Điện (Device Health Monitor)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Realtime Health
                </span>
                {lowBatteryDevices.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1 animate-pulse">
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    {lowBatteryDevices.length} thiết bị pin yếu!
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Theo dõi liên tục tỷ lệ pin, nguồn sạc AC, chất lượng sóng Wi-Fi/P2P WireGuard và cảnh báo sớm tình trạng cạn kiệt pin.
              </p>
            </div>
          </div>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSimulateLowBattery}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              lowBatteryDevices.length > 0
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25'
            }`}
            title="Nhấp để mô phỏng một thiết bị di động tụt xuống dưới 20% pin để kiểm tra cơ chế cảnh báo"
          >
            <BatteryWarning className="w-3.5 h-3.5" />
            <span>{lowBatteryDevices.length > 0 ? 'Hủy giả lập pin yếu' : 'Mô phỏng pin yếu (<20%)'}</span>
          </button>

          <button
            onClick={handlePingAll}
            disabled={isPinging}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              currentTheme === 'light'
                ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-cyan-500/40'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isPinging ? 'animate-spin' : ''}`} />
            <span>Đo lại kết nối</span>
          </button>
        </div>
      </div>

      {/* Action Toast Feedback */}
      <AnimatePresence>
        {alertFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-3 p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 text-xs flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{alertFeedback}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CRITICAL LOW-BATTERY ALERT BANNER (Prominent warning when devices have battery <= 20%) */}
      <AnimatePresence>
        {lowBatteryDevices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            className={`mt-4 p-4 rounded-xl border relative overflow-hidden transition-all shadow-lg ${
              currentTheme === 'light'
                ? 'bg-rose-50 border-rose-300 text-rose-950 shadow-rose-200/50'
                : 'bg-gradient-to-r from-rose-950/70 via-red-950/50 to-amber-950/40 border-rose-500/60 text-rose-200 shadow-rose-950/50'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 shrink-0 mt-0.5 animate-bounce">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-rose-500 text-white">
                      CẢNH BÁO PIN YẾU KHẨN CẤP
                    </span>
                    <h3 className="font-bold text-sm md:text-base text-rose-300">
                      Phát hiện {lowBatteryDevices.length} thiết bị có pin dưới 20% và đang không cắm sạc!
                    </h3>
                  </div>
                  <p className="text-xs text-rose-200/90 mt-1">
                    Các tác vụ tự trị ngầm của Hoppi trên thiết bị này có nguy cơ bị gián đoạn do hệ điều hành ngắt nguồn hoặc tắt máy.
                  </p>

                  {/* List of critical devices */}
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {lowBatteryDevices.map((dev) => (
                      <div
                        key={dev.id}
                        className="px-3 py-1.5 rounded-lg bg-rose-900/40 border border-rose-600/40 text-xs flex items-center gap-2"
                      >
                        <BatteryLow className="w-4 h-4 text-rose-400 animate-pulse" />
                        <span className="font-semibold text-rose-100">{dev.name}:</span>
                        <span className="font-mono font-bold text-rose-300">{dev.battery}%</span>
                        <span className="text-[10px] text-rose-300/80">
                          (Ước tính còn ~{Math.round(dev.battery * 1.8)} phút)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Remediation Actions */}
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <button
                  onClick={() => lowBatteryDevices.forEach(handleToggleCharging)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-900/40 transition-all"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Cắm sạc ngay (Mô phỏng sạc AC)</span>
                </button>

                <button
                  onClick={() => lowBatteryDevices.forEach(handleOffloadToServer)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-900/40 transition-all"
                >
                  <Server className="w-3.5 h-3.5" />
                  <span>Di chuyển tác vụ sang Server</span>
                </button>

                <button
                  onClick={() => lowBatteryDevices.forEach(handleToggleLowPowerMode)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                >
                  <Power className="w-3.5 h-3.5 text-amber-400" />
                  <span>Bật Chế độ Siêu Tiết Kiệm</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aggregate Health Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {/* Metric 1: Average Battery */}
        <div
          className={`p-3 rounded-xl border ${
            currentTheme === 'light'
              ? 'bg-slate-50 border-slate-200'
              : 'bg-slate-950/60 border-slate-800/80'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-medium">
            <span>MỨC PIN TRUNG BÌNH</span>
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span
              className={`text-xl font-bold font-mono ${
                avgBattery < 30 ? 'text-rose-400' : avgBattery < 60 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {avgBattery}%
            </span>
            <span className="text-[11px] text-slate-400">Toàn bộ node</span>
          </div>
          <div className="w-full h-1 rounded-full bg-slate-800 mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                avgBattery < 30 ? 'bg-rose-500' : avgBattery < 60 ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${avgBattery}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Charging Status */}
        <div
          className={`p-3 rounded-xl border ${
            currentTheme === 'light'
              ? 'bg-slate-50 border-slate-200'
              : 'bg-slate-950/60 border-slate-800/80'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-medium">
            <span>NGUỒN SẠC AC KẾT NỐI</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-xl font-bold font-mono text-cyan-400">
              {chargingDevices.length} / {devices.length}
            </span>
            <span className="text-[11px] text-slate-400">Đang cắm nguồn</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Nguồn cấp ổn định không sụt áp</span>
          </div>
        </div>

        {/* Metric 3: P2P Latency */}
        <div
          className={`p-3 rounded-xl border ${
            currentTheme === 'light'
              ? 'bg-slate-50 border-slate-200'
              : 'bg-slate-950/60 border-slate-800/80'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-medium">
            <span>ĐỘ TRỄ P2P PING</span>
            <Wifi className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-xl font-bold font-mono text-sky-400">{avgLatency}ms</span>
            <span className="text-[11px] text-emerald-400 font-semibold">Cực nhanh</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>WireGuard LAN Mesh</span>
          </div>
        </div>

        {/* Metric 4: Battery Safety SLA */}
        <div
          className={`p-3 rounded-xl border ${
            currentTheme === 'light'
              ? 'bg-slate-50 border-slate-200'
              : 'bg-slate-950/60 border-slate-800/80'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-medium">
            <span>CHỈ SỐ AN TOÀN PIN</span>
            <ShieldAlert
              className={`w-3.5 h-3.5 ${lowBatteryDevices.length === 0 ? 'text-emerald-400' : 'text-rose-400'}`}
            />
          </div>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span
              className={`text-xl font-bold font-mono ${
                lowBatteryDevices.length === 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {lowBatteryDevices.length === 0 ? '100%' : `${Math.round(((devices.length - lowBatteryDevices.length) / devices.length) * 100)}%`}
            </span>
            <span className="text-[11px] text-slate-400">
              {lowBatteryDevices.length === 0 ? 'An toàn tuyệt đối' : 'Cần cắm sạc'}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2">
            {lowBatteryDevices.length === 0
              ? 'Không có nguy cơ sập nguồn'
              : `Cảnh báo ${lowBatteryDevices.length} node cạn pin`}
          </div>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mt-5 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Lọc theo trạng thái sức khỏe:</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              filterMode === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800/40 border border-transparent'
            }`}
          >
            Tất cả ({devices.length})
          </button>

          <button
            onClick={() => setFilterMode('low_battery')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
              filterMode === 'low_battery'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold'
                : 'text-slate-400 hover:text-rose-300 bg-slate-800/40 border border-transparent'
            }`}
          >
            <BatteryLow className="w-3 h-3 text-rose-400" />
            <span>Pin yếu &lt;20% ({lowBatteryDevices.length})</span>
          </button>

          <button
            onClick={() => setFilterMode('charging')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
              filterMode === 'charging'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                : 'text-slate-400 hover:text-emerald-300 bg-slate-800/40 border border-transparent'
            }`}
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Đang cắm sạc ({chargingDevices.length})</span>
          </button>

          <button
            onClick={() => setFilterMode('low_latency')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
              filterMode === 'low_latency'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold'
                : 'text-slate-400 hover:text-sky-300 bg-slate-800/40 border border-transparent'
            }`}
          >
            <Wifi className="w-3 h-3 text-sky-400" />
            <span>Độ trễ thấp &lt;15ms ({devices.filter((d) => d.latencyMs < 15).length})</span>
          </button>
        </div>
      </div>

      {/* Grid of Individual Device Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredDevices.map((device) => {
          const isCritical = device.type !== 'server' && device.battery <= 20 && !device.isCharging;
          const isWarning = device.type !== 'server' && device.battery <= 35 && !device.isCharging;

          // Latency score
          const latencyLabel =
            device.latencyMs < 10 ? 'Rất nhanh' : device.latencyMs < 25 ? 'Tốt' : 'Trung bình';
          const latencyColor =
            device.latencyMs < 10
              ? 'text-emerald-400'
              : device.latencyMs < 25
              ? 'text-cyan-400'
              : 'text-amber-400';

          // Battery icon
          const getBatteryIcon = () => {
            if (device.isCharging) return <BatteryCharging className="w-4 h-4 text-emerald-400 animate-pulse" />;
            if (device.battery <= 20) return <BatteryLow className="w-4 h-4 text-rose-400 animate-pulse" />;
            if (device.battery <= 50) return <BatteryMedium className="w-4 h-4 text-amber-400" />;
            return <BatteryFull className="w-4 h-4 text-emerald-400" />;
          };

          // Signal bars render (1 to 4 bars)
          const bars = device.signalBars ?? (device.latencyMs < 10 ? 4 : device.latencyMs < 20 ? 3 : 2);

          return (
            <div
              key={device.id}
              className={`p-4 rounded-xl border relative transition-all flex flex-col justify-between ${
                isCritical
                  ? currentTheme === 'light'
                    ? 'bg-rose-50/80 border-rose-300 shadow-sm ring-1 ring-rose-400'
                    : 'bg-rose-950/20 border-rose-500/60 shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/50'
                  : currentTheme === 'light'
                  ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  : currentTheme === 'deepspace'
                  ? 'bg-[#0d1322] border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Card Top: Device Info & Badges */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-xl border ${
                        device.type === 'server'
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                          : device.type === 'desktop'
                          ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400'
                          : device.type === 'mobile'
                          ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
                          : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                      }`}
                    >
                      {device.type === 'server' ? (
                        <Server className="w-4 h-4" />
                      ) : device.type === 'desktop' ? (
                        <Laptop className="w-4 h-4" />
                      ) : device.type === 'mobile' ? (
                        <Smartphone className="w-4 h-4" />
                      ) : (
                        <Tablet className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-bold text-xs md:text-sm text-slate-100">{device.name}</h4>
                        {device.isCurrent && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                            Thiết bị này
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {device.ip} • {device.os.split(' ')[0]}
                      </p>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 ${
                      isCritical
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : device.isCharging
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isCritical
                          ? 'bg-rose-400 animate-ping'
                          : device.isCharging
                          ? 'bg-emerald-400 animate-pulse'
                          : 'bg-slate-400'
                      }`}
                    />
                    {isCritical ? 'Pin nguy hiểm' : device.isCharging ? 'Đang sạc' : 'Dùng pin'}
                  </span>
                </div>

                {/* Battery Life Section */}
                <div className="mt-3.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                      {getBatteryIcon()}
                      <span>Pin & Nguồn điện:</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-mono font-bold ${
                          isCritical
                            ? 'text-rose-400'
                            : isWarning
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {device.battery}%
                      </span>
                      {device.isCharging ? (
                        <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-0.5">
                          ⚡ AC
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">🔋 Pin</span>
                      )}
                    </div>
                  </div>

                  {/* Battery Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCritical
                          ? 'bg-rose-500 animate-pulse'
                          : isWarning
                          ? 'bg-amber-400'
                          : device.isCharging
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : 'bg-emerald-400'
                      }`}
                      style={{ width: `${device.battery}%` }}
                    />
                  </div>

                  {/* Battery Health Details Subtext */}
                  <div className="grid grid-cols-2 gap-1 mt-2 text-[10px] text-slate-400 border-t border-slate-800/60 pt-1.5">
                    <div>
                      <span className="text-slate-400">Sức khỏe pin: </span>
                      <span className="text-slate-200 font-medium">
                        {device.batteryHealthPercent ?? 98}%
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400">Ước tính: </span>
                      <span
                        className={`font-medium ${
                          isCritical ? 'text-rose-400 font-bold' : 'text-slate-200'
                        }`}
                      >
                        {device.isCharging
                          ? 'Đầy sau ~35m'
                          : device.type === 'server'
                          ? 'AC 24/7'
                          : `Còn ~${Math.round(device.battery * 0.12)}h`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Connectivity Telemetry Section */}
                <div className="mt-2.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                      <Wifi className="w-3.5 h-3.5 text-sky-400" />
                      <span>Kết nối mạng:</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className={`font-mono font-bold ${latencyColor}`}>
                        {device.latencyMs}ms
                      </span>
                      <span className="text-[10px] text-slate-400">({latencyLabel})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800/60 text-[10px]">
                    <span className="text-slate-400 truncate">
                      {device.connectionType ??
                        (device.type === 'server' ? 'Gigabit Ethernet' : 'WireGuard P2P LAN')}
                    </span>

                    {/* 4-Bar Signal Strength Meter */}
                    <div className="flex items-end gap-0.5 h-3" title={`Cường độ tín hiệu: ${bars}/4 vạch`}>
                      {[1, 2, 3, 4].map((barIndex) => (
                        <div
                          key={barIndex}
                          className={`w-1 rounded-sm transition-all ${
                            barIndex <= bars
                              ? barIndex >= 3
                                ? 'bg-emerald-400'
                                : 'bg-cyan-400'
                              : 'bg-slate-700/60'
                          }`}
                          style={{ height: `${barIndex * 25}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Eco Mode indicator if active */}
                {device.lowPowerMode && (
                  <div className="mt-2 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-300 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Power className="w-3 h-3 text-amber-400" />
                      Chế độ Siêu Tiết Kiệm Pin đang kích hoạt
                    </span>
                    <span className="font-mono">-40% tiêu thụ</span>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-1.5 text-xs">
                <button
                  onClick={() => handleToggleCharging(device)}
                  title={device.isCharging ? 'Ngắt sạc AC (Dùng pin)' : 'Cắm nguồn sạc AC'}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium border transition-all ${
                    device.isCharging
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                  }`}
                >
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>{device.isCharging ? 'Đang sạc (Rút sạc)' : 'Cắm sạc'}</span>
                </button>

                {device.type !== 'server' && (
                  <button
                    onClick={() => handleToggleLowPowerMode(device)}
                    title="Bật/Tắt chế độ tiết kiệm năng lượng"
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium border transition-all ${
                      device.lowPowerMode
                        ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-400'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    <span>{device.lowPowerMode ? 'Eco ON' : 'Eco OFF'}</span>
                  </button>
                )}

                {isCritical && (
                  <button
                    onClick={() => handleOffloadToServer(device)}
                    className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow transition-all ml-auto"
                    title="Chuyển tác vụ sang Server để tránh sập nguồn"
                  >
                    <Server className="w-3 h-3" />
                    <span>Di chuyển tác vụ</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
