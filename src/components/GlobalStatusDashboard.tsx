import React, { useState, useEffect } from 'react';
import {
  Server,
  Laptop,
  Smartphone,
  Tablet,
  Cloud,
  Activity,
  Cpu,
  HardDrive,
  BatteryCharging,
  BatteryFull,
  BatteryMedium,
  BatteryLow,
  Zap,
  Wifi,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Send,
  Sliders,
  Terminal,
  ShieldCheck,
  Check,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowUpRight,
  FileCode,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import { ConnectedMeshDevice, AppTheme, UserIdentity, HoppiCompletionNotice } from '../types';
import { DeviceHealthMonitor, DeviceHealthTelemetry } from './DeviceHealthMonitor';
import { NetworkTrafficHeatmap } from './NetworkTrafficHeatmap';
import { GlobalFileSyncModal } from './GlobalFileSyncModal';
import { VoiceCommandIntentChart } from './VoiceCommandIntentChart';

interface GlobalStatusDashboardProps {
  currentTheme: AppTheme;
  identity: UserIdentity | null;
  onSelectTargetDevice?: (device: ConnectedMeshDevice) => void;
  onOpenDevicesModal?: () => void;
  onTriggerCompletionNotice?: (notice: HoppiCompletionNotice) => void;
  onNavigateToChatWithPrompt?: (prompt: string, targetDeviceName?: string) => void;
}

export interface DeviceTelemetry extends DeviceHealthTelemetry {
  id: string;
  name: string;
  type: 'server' | 'desktop' | 'mobile' | 'tablet';
  os: string;
  ip: string;
  isMasterDevice: boolean;
  isCurrent: boolean;
  status: 'online' | 'busy' | 'syncing' | 'idle';
  latencyMs: number;
  battery: number;
  isCharging: boolean;
  cpuLoad: number;
  memoryUsedGB: number;
  memoryTotalGB: number;
  uptime: string;
  activeTask: string;
  taskQueueCount: number;
  workerTasks: string[];
  capabilities: string[];
}

export const GlobalStatusDashboard: React.FC<GlobalStatusDashboardProps> = ({
  currentTheme,
  identity,
  onSelectTargetDevice,
  onOpenDevicesModal,
  onTriggerCompletionNotice,
  onNavigateToChatWithPrompt,
}) => {
  // Device list with full telemetry
  const [devices, setDevices] = useState<DeviceTelemetry[]>([
    {
      id: 'dev-server-home',
      name: 'Home Server 24/7 (Mini PC)',
      type: 'server',
      os: 'Ubuntu 24.04 LTS (Docker Engine)',
      ip: '192.168.1.100',
      isMasterDevice: false,
      isCurrent: false,
      status: 'online',
      latencyMs: 3,
      battery: 100,
      isCharging: true,
      batteryHealthPercent: 100,
      batteryCycles: 1,
      connectionType: 'Gigabit Ethernet',
      signalBars: 4,
      cpuLoad: 32,
      memoryUsedGB: 7.4,
      memoryTotalGB: 16,
      uptime: '19 ngày 14 giờ',
      activeTask: 'Vector Indexing & RAG Memory Daemon (Chạy ngầm)',
      taskQueueCount: 4,
      workerTasks: [
        'Vector Embedding Chunks (ChromaDB + SQLite)',
        'Zalo Webhook Event Ingestion Daemon',
        'Tuya / Local LAN IoT Telemetry Broker',
        'Daily Productivity Aggregator Worker',
      ],
      capabilities: ['docker', 'rag_memory', 'sales_crawler', 'iot_gateway', 'slm_inference'],
    },
    {
      id: 'dev-macbook-master',
      name: 'MacBook Pro M3 Max',
      type: 'desktop',
      os: 'macOS Sequoia 15.1',
      ip: '192.168.1.105',
      isMasterDevice: true,
      isCurrent: true,
      status: 'online',
      latencyMs: 12,
      battery: 94,
      isCharging: true,
      batteryHealthPercent: 99,
      batteryCycles: 48,
      connectionType: 'WireGuard P2P',
      signalBars: 4,
      cpuLoad: 41,
      memoryUsedGB: 18.2,
      memoryTotalGB: 36,
      uptime: '4 ngày 08 giờ',
      activeTask: 'Code AST Engine & Sandboxed Execution Pipeline',
      taskQueueCount: 3,
      workerTasks: [
        'TypeScript Sandbox Evaluation & Linter',
        'Voice Speech Synthesis & STT Processing',
        'Global Command Dispatcher & Master UI Host',
      ],
      capabilities: ['code_sandbox', 'full_master_ui', 'camera_vision', 'voice_stt'],
    },
    {
      id: 'dev-iphone-master',
      name: 'iPhone 16 Pro Max',
      type: 'mobile',
      os: 'iOS 18.2 (PWA Standalone)',
      ip: '192.168.1.140',
      isMasterDevice: true,
      isCurrent: false,
      status: 'busy',
      latencyMs: 18,
      battery: 18,
      isCharging: false,
      batteryHealthPercent: 96,
      batteryCycles: 112,
      connectionType: '5G Mesh',
      signalBars: 3,
      lowPowerMode: true,
      cpuLoad: 24,
      memoryUsedGB: 3.2,
      memoryTotalGB: 8,
      uptime: '1 ngày 22 giờ',
      activeTask: 'Zalo OA Lead Monitoring & Background Push Notifications',
      taskQueueCount: 2,
      workerTasks: [
        'Zalo OA Real-time Lead Listener',
        'FaceID Biometric Token Renewal Service',
      ],
      capabilities: ['biometric_faceid', 'mobile_push', 'sales_crm_quick_reply'],
    },
    {
      id: 'dev-ipad-livingroom',
      name: 'iPad Pro M2 (Phòng khách)',
      type: 'tablet',
      os: 'iPadOS 18.1 (Kiosk Mode)',
      ip: '192.168.1.120',
      isMasterDevice: false,
      isCurrent: false,
      status: 'syncing',
      latencyMs: 15,
      battery: 76,
      isCharging: true,
      batteryHealthPercent: 97,
      batteryCycles: 84,
      connectionType: 'Wi-Fi 6E',
      signalBars: 4,
      cpuLoad: 18,
      memoryUsedGB: 4.1,
      memoryTotalGB: 8,
      uptime: '2 ngày 11 giờ',
      activeTask: 'Smart Home Kiosk Dashboard & RTSP Camera Stream',
      taskQueueCount: 2,
      workerTasks: [
        'Living Room Dashboard UI Kiosk 24/7',
        'RTSP Security Camera Proxy & Motion Detector',
      ],
      capabilities: ['kiosk_display', 'camera_rtsp_proxy', 'hand_gesture_sensor'],
    },
  ]);

  // UI state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'server' | 'desktop' | 'mobile' | 'tablet'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'busy' | 'syncing'>('all');
  const [selectedDeviceDetails, setSelectedDeviceDetails] = useState<DeviceTelemetry | null>(devices[0]);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [isFileSyncModalOpen, setIsFileSyncModalOpen] = useState<boolean>(false);
  const [fileSyncTargetDevice, setFileSyncTargetDevice] = useState<ConnectedMeshDevice | null>(null);

  // Auto-simulate slight telemetry variations for realistic real-time dashboard feeling
  useEffect(() => {
    const timer = setInterval(() => {
      setDevices((prev) =>
        prev.map((dev) => {
          // small random fluctuation in latency and CPU
          const jitter = Math.floor(Math.random() * 5) - 2;
          const cpuJitter = Math.floor(Math.random() * 7) - 3;
          return {
            ...dev,
            latencyMs: Math.max(1, dev.latencyMs + jitter),
            cpuLoad: Math.min(95, Math.max(8, dev.cpuLoad + cpuJitter)),
          };
        })
      );
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  // Ping all devices
  const handlePingAll = () => {
    setIsRefreshing(true);
    setActionFeedback('Đang kiểm tra kết nối ngang hàng (P2P Ping) tới tất cả các node...');
    setTimeout(() => {
      setDevices((prev) =>
        prev.map((dev) => ({
          ...dev,
          latencyMs:
            dev.type === 'server'
              ? Math.floor(Math.random() * 3) + 2
              : dev.type === 'desktop'
              ? Math.floor(Math.random() * 6) + 9
              : Math.floor(Math.random() * 8) + 14,
        }))
      );
      setIsRefreshing(false);
      setActionFeedback('Tất cả 4 node trong mạng lưới phản hồi siêu tốc! Tình trạng sức khỏe 100%.');
      setTimeout(() => setActionFeedback(null), 3500);
    }, 900);
  };

  // Rebalance distributed workload
  const handleRebalance = () => {
    setIsRefreshing(true);
    setActionFeedback('Đang tái phân phối tác vụ qua Mesh Coordinator: Ưu tiên Server 24/7...');
    setTimeout(() => {
      setIsRefreshing(false);
      setActionFeedback('Đã cân bằng tải tối ưu! Server đảm nhận 55% tác vụ ngầm, giảm tải cho thiết bị di động.');
      setTimeout(() => setActionFeedback(null), 3500);
    }, 1100);
  };

  // Transfer tasks between devices (e.g. offloading from low battery device to server)
  const handleDispatchTaskTransfer = (sourceDeviceId: string, targetDeviceId: string) => {
    const source = devices.find((d) => d.id === sourceDeviceId);
    const target = devices.find((d) => d.id === targetDeviceId);
    if (!source || !target) return;

    setDevices((prev) =>
      prev.map((dev) => {
        if (dev.id === sourceDeviceId) {
          return {
            ...dev,
            activeTask: 'Chế độ chờ tiết kiệm pin (Đã chuyển giao tiến trình)',
            taskQueueCount: 0,
            lowPowerMode: true,
          };
        }
        if (dev.id === targetDeviceId) {
          return {
            ...dev,
            taskQueueCount: dev.taskQueueCount + (source.taskQueueCount || 1),
            activeTask: `[Tiếp nhận từ ${source.name}]: ${source.activeTask}`,
          };
        }
        return dev;
      })
    );

    setActionFeedback(
      `⚡ Đã điều phối chuyển giao toàn bộ tiến trình từ [${source.name}] sang [${target.name}] an toàn qua Mesh Coordinator!`
    );
    setTimeout(() => setActionFeedback(null), 4000);
  };

  // Dispatch command to device
  const handleDispatchCommand = (device: DeviceTelemetry) => {
    if (onSelectTargetDevice) {
      onSelectTargetDevice({
        id: device.id,
        name: device.name,
        type: device.type,
        os: device.os,
        browser: device.type === 'server' ? 'Docker Engine' : 'Hoppi Client',
        ip: device.ip,
        isMasterDevice: device.isMasterDevice,
        isCurrent: device.isCurrent,
        status: device.status,
        currentTask: device.activeTask,
        battery: device.battery,
        latencyMs: device.latencyMs,
        lastSync: 'Vừa xong',
        tokenHash: 'tok-mesh-' + device.id,
        capabilities: device.capabilities,
      });
    }

    if (onNavigateToChatWithPrompt) {
      onNavigateToChatWithPrompt(
        `Thực thi lệnh kiểm tra trạng thái và tối ưu hóa tài nguyên trên node [${device.name}]`,
        device.name
      );
    } else {
      setActionFeedback(`Đã chuyển kênh điều khiển mục tiêu tới [${device.name}].`);
      setTimeout(() => setActionFeedback(null), 3000);
    }
  };

  // Trigger test completion notice for demo
  const handleTestCompletion = (device: DeviceTelemetry) => {
    if (onTriggerCompletionNotice) {
      onTriggerCompletionNotice({
        id: `notice-${Date.now()}`,
        sourceDeviceId: device.id,
        sourceDeviceName: device.name,
        taskTitle: `Hoàn thành tác vụ tự trị trên ${device.name}`,
        summary: `Hoppi trên [${device.name}] đã thực thi xong công việc: "${device.activeTask}" với hiệu suất đạt 100%.`,
        spokenMessage: `Thưa Chủ nhân, tôi là Hoppi trên ${device.name}, tôi đã hoàn thành xong tác vụ và đồng bộ báo cáo về thiết bị của Người!`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        mood: 'happy',
        metrics: {
          durationMs: 4200,
          tokensProcessed: 1850,
          syncedDevicesCount: devices.length,
        },
      });
    }
  };

  // Recharts task distribution data
  const taskDistributionBarData = devices.map((d) => ({
    name: d.type === 'server' ? 'Server 24/7' : d.type === 'desktop' ? 'MacBook M3' : d.type === 'mobile' ? 'iPhone 16' : 'iPad Pro',
    fullName: d.name,
    tasks: d.taskQueueCount,
    cpu: d.cpuLoad,
    latency: d.latencyMs,
  }));

  const workloadCategoryData = [
    { name: 'RAG & Vector AI', value: 36, color: '#06b6d4' },
    { name: 'Code AST Sandbox', value: 27, color: '#8b5cf6' },
    { name: 'Zalo CRM Crawl', value: 18, color: '#10b981' },
    { name: 'Smart Home LAN', value: 14, color: '#f59e0b' },
    { name: 'Bảo Mật & P2P', value: 5, color: '#ec4899' },
  ];

  // Filtered devices
  const filteredDevices = devices.filter((d) => {
    if (filterType !== 'all' && d.type !== filterType) return false;
    if (filterStatus !== 'all' && d.status !== filterStatus) return false;
    return true;
  });

  // Aggregate metrics
  const totalTasksRunning = devices.reduce((sum, d) => sum + d.taskQueueCount, 0);
  const avgLatency = Math.round(devices.reduce((sum, d) => sum + d.latencyMs, 0) / devices.length);
  const onlineCount = devices.filter((d) => d.status === 'online').length;

  return (
    <div
      className={`h-full flex flex-col p-4 md:p-6 overflow-y-auto transition-colors ${
        currentTheme === 'light'
          ? 'bg-slate-50 text-slate-800'
          : currentTheme === 'deepspace'
          ? 'bg-[#060911] text-slate-100'
          : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Top Banner & Control Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/10">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                  Bảng Điều Khiển Mạng Lưới Phân Tán (Global Mesh Dashboard)
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  P2P Mesh v4.0
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-400 mt-0.5">
                Giám sát thời gian thực sức khỏe phần cứng, độ trễ mạng ngang hàng và điều phối tác vụ đa thiết bị độc lập của Chủ nhân.
              </p>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePingAll}
            disabled={isRefreshing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              currentTheme === 'light'
                ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-cyan-500/50 hover:bg-slate-800'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Làm mới Ping & Sức khỏe</span>
          </button>

          <button
            onClick={handleRebalance}
            disabled={isRefreshing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              currentTheme === 'light'
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                : 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>Cân bằng tải tác vụ</span>
          </button>

          <button
            onClick={() => {
              setFileSyncTargetDevice(null);
              setIsFileSyncModalOpen(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              currentTheme === 'light'
                ? 'bg-cyan-50 border-cyan-300 text-cyan-800 hover:bg-cyan-100 shadow-sm'
                : 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30 shadow-sm shadow-cyan-500/20'
            }`}
            title="Đẩy trực tiếp code snippets hoặc tài liệu sang thiết bị trong mạng Hoppi Mesh"
          >
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>Global File Sync</span>
          </button>

          {onOpenDevicesModal && (
            <button
              onClick={onOpenDevicesModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                currentTheme === 'light'
                  ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Quản lý Khóa & Quyền</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Notification Alert Toast */}
      {actionFeedback && (
        <div className="mt-4 p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-5">
        {/* KPI 1: Mesh Health SLA */}
        <div
          className={`p-4 rounded-xl border relative overflow-hidden transition-all ${
            currentTheme === 'light'
              ? 'bg-white border-slate-200 shadow-sm'
              : currentTheme === 'deepspace'
              ? 'bg-[#0d121d] border-neutral-800'
              : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Chỉ số Sức Khỏe Mesh
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl md:text-3xl font-extrabold font-mono text-emerald-400">99.8%</span>
            <span className="text-xs text-slate-400">Tối ưu SLA 24/7</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Không ghi nhận thắt nút cổ chai
          </p>
        </div>

        {/* KPI 2: Connected Nodes */}
        <div
          className={`p-4 rounded-xl border relative overflow-hidden transition-all ${
            currentTheme === 'light'
              ? 'bg-white border-slate-200 shadow-sm'
              : currentTheme === 'deepspace'
              ? 'bg-[#0d121d] border-neutral-800'
              : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Thiết bị Trực Tuyến
            </span>
            <Server className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl md:text-3xl font-extrabold font-mono text-cyan-400">
              {onlineCount} / {devices.length}
            </span>
            <span className="text-xs text-slate-400">Node sẵn sàng</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            1 Server, 1 Desktop, 1 Mobile, 1 Tablet
          </p>
        </div>

        {/* KPI 3: Total Distributed Tasks */}
        <div
          className={`p-4 rounded-xl border relative overflow-hidden transition-all ${
            currentTheme === 'light'
              ? 'bg-white border-slate-200 shadow-sm'
              : currentTheme === 'deepspace'
              ? 'bg-[#0d121d] border-neutral-800'
              : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Tác Vụ Đang Thực Thi
            </span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl md:text-3xl font-extrabold font-mono text-indigo-400">
              {totalTasksRunning}
            </span>
            <span className="text-xs text-slate-400">Luồng ngầm</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Phân tán tự trị không gây lag thiết bị
          </p>
        </div>

        {/* KPI 4: Average Latency */}
        <div
          className={`p-4 rounded-xl border relative overflow-hidden transition-all ${
            currentTheme === 'light'
              ? 'bg-white border-slate-200 shadow-sm'
              : currentTheme === 'deepspace'
              ? 'bg-[#0d121d] border-neutral-800'
              : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Độ Trễ Trung Bình
            </span>
            <Wifi className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl md:text-3xl font-extrabold font-mono text-sky-400">
              {avgLatency}ms
            </span>
            <span className="text-xs text-emerald-400 font-semibold">Cực nhanh</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Giao thức P2P WireGuard LAN tối ưu
          </p>
        </div>
      </div>

      {/* Device Health Monitor: Tracks Battery Life & Connectivity Status with Alerts for Low-Battery Devices */}
      <div className="mt-5">
        <DeviceHealthMonitor
          devices={devices}
          currentTheme={currentTheme}
          onUpdateDevice={(updated) => {
            setDevices((prev) =>
              prev.map((dev) =>
                dev.id === updated.id
                  ? ({ ...dev, ...updated } as DeviceTelemetry)
                  : dev
              )
            );
          }}
          onNavigateToChatWithPrompt={onNavigateToChatWithPrompt}
          onDispatchTaskTransfer={handleDispatchTaskTransfer}
        />
      </div>

      {/* 24-Hour Network Traffic Intensity Heatmap (D3.js Visualization) */}
      <div className="mt-5">
        <NetworkTrafficHeatmap theme={currentTheme} />
      </div>

      {/* 30-Day Voice Command Intent Distribution Chart (Recharts) */}
      <div className="mt-5">
        <VoiceCommandIntentChart theme={currentTheme} />
      </div>

      {/* Task Distribution & Workload Charts Section using Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
        {/* Left: BarChart of Tasks running per Node */}
        <div
          className={`lg:col-span-2 p-4 md:p-5 rounded-xl border transition-all ${
            currentTheme === 'light'
              ? 'bg-white border-slate-200 shadow-sm'
              : currentTheme === 'deepspace'
              ? 'bg-[#0d121d] border-neutral-800'
              : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Phân Bổ Tác Vụ & Tải Phần Cứng Theo Thiết Bị
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Số lượng công việc đang chạy song song (Tasks) và % tải CPU tương ứng trên từng node
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400 px-2 py-1 rounded bg-slate-800 border border-slate-700">
              Realtime telemetry
            </span>
          </div>

          <div className="h-60 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskDistributionBarData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={currentTheme === 'light' ? '#e2e8f0' : '#1e293b'} />
                <XAxis
                  dataKey="name"
                  stroke={currentTheme === 'light' ? '#64748b' : '#94a3b8'}
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke={currentTheme === 'light' ? '#64748b' : '#94a3b8'}
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div
                          className={`p-3 rounded-lg border shadow-xl text-xs ${
                            currentTheme === 'light'
                              ? 'bg-white border-slate-200 text-slate-800'
                              : 'bg-slate-900 border-slate-700 text-slate-100'
                          }`}
                        >
                          <p className="font-bold text-cyan-400">{data.fullName}</p>
                          <p className="text-slate-300 mt-1">
                            Tác vụ đang chạy: <span className="font-mono font-bold text-indigo-400">{data.tasks} tasks</span>
                          </p>
                          <p className="text-slate-300">
                            CPU Load: <span className="font-mono font-bold text-emerald-400">{data.cpu}%</span>
                          </p>
                          <p className="text-slate-300">
                            Độ trễ LAN: <span className="font-mono font-bold text-sky-400">{data.latency}ms</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="tasks" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Số tác vụ" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: PieChart of Workload Categories */}
        <div
          className={`p-4 md:p-5 rounded-xl border transition-all flex flex-col justify-between ${
            currentTheme === 'light'
              ? 'bg-white border-slate-200 shadow-sm'
              : currentTheme === 'deepspace'
              ? 'bg-[#0d121d] border-neutral-800'
              : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <div>
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Cơ Cấu Khối Lượng Công Việc
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tỷ lệ phân phối tính toán theo mảng nghiệp vụ
            </p>
          </div>

          <div className="h-44 w-full my-auto flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={workloadCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={68}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {workloadCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div
                          className={`p-2 rounded-lg border shadow-lg text-xs ${
                            currentTheme === 'light'
                              ? 'bg-white border-slate-200 text-slate-800'
                              : 'bg-slate-900 border-slate-700 text-slate-100'
                          }`}
                        >
                          <span style={{ color: data.color }} className="font-bold">
                            {data.name}: {data.value}%
                          </span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800/80 text-[11px]">
            {workloadCategoryData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}</span>
                <span className="ml-auto font-mono font-bold text-slate-400">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Mesh Nodes Grid Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-7 mb-3">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            Danh Sách Thiết Bị Kết Nối Trong Mạng Lưới (Connected Mesh Nodes)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Mỗi thiết bị có thể nhận lệnh riêng biệt từ Chủ nhân và tự động báo cáo qua Hoppi khi hoàn thành.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Device Type Filters */}
          <div className="flex items-center rounded-lg p-0.5 bg-slate-900 border border-slate-800 text-[11px]">
            {(['all', 'server', 'desktop', 'mobile', 'tablet'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2 py-1 rounded capitalize transition-all ${
                  filterType === type
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type === 'all' ? 'Tất cả' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Connected Mesh Nodes Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDevices.map((device) => {
          // Status indicator color classes
          const statusBadge =
            device.status === 'online'
              ? {
                  dot: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)] animate-pulse',
                  text: 'text-emerald-400',
                  bg: 'bg-emerald-500/10 border-emerald-500/30',
                  label: 'Trực tuyến (Online)',
                }
              : device.status === 'busy'
              ? {
                  dot: 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)] animate-ping',
                  text: 'text-amber-400',
                  bg: 'bg-amber-500/10 border-amber-500/30',
                  label: 'Đang xử lý (Busy)',
                }
              : device.status === 'syncing'
              ? {
                  dot: 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)] animate-spin',
                  text: 'text-cyan-400',
                  bg: 'bg-cyan-500/10 border-cyan-500/30',
                  label: 'Đang đồng bộ (Syncing)',
                }
              : {
                  dot: 'bg-slate-400',
                  text: 'text-slate-400',
                  bg: 'bg-slate-500/10 border-slate-500/30',
                  label: 'Chờ lệnh (Idle)',
                };

          const isSelected = selectedDeviceDetails?.id === device.id;

          return (
            <div
              key={device.id}
              onClick={() => setSelectedDeviceDetails(device)}
              className={`p-4 md:p-5 rounded-xl border transition-all cursor-pointer relative group ${
                isSelected
                  ? 'border-cyan-500/80 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/50'
                  : currentTheme === 'light'
                  ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  : currentTheme === 'deepspace'
                  ? 'bg-[#0d121d] border-neutral-800 hover:border-neutral-700'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header: Device Icon, Name, Master & Status indicators */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl border ${
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
                      <Server className="w-5 h-5" />
                    ) : device.type === 'desktop' ? (
                      <Laptop className="w-5 h-5" />
                    ) : device.type === 'mobile' ? (
                      <Smartphone className="w-5 h-5" />
                    ) : (
                      <Tablet className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm md:text-base text-slate-100 group-hover:text-cyan-300 transition-colors">
                        {device.name}
                      </h3>
                      {device.isCurrent && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                          Thiết bị này
                        </span>
                      )}
                      {device.isMasterDevice && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40">
                          Chủ nhân (Master)
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{device.os}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-400">{device.ip}</span>
                    </div>
                  </div>
                </div>

                {/* Status Indicator Pill */}
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium ${statusBadge.bg} ${statusBadge.text}`}
                >
                  <span className={`w-2 h-2 rounded-full ${statusBadge.dot}`} />
                  <span>{statusBadge.label}</span>
                </div>
              </div>

              {/* Hardware & Network Telemetry Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 text-xs">
                {/* Ping / Latency */}
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-cyan-400" />
                    Độ trễ P2P
                  </div>
                  <div className="font-mono font-bold text-slate-200 mt-1 flex items-center gap-1">
                    <span
                      className={
                        device.latencyMs < 10
                          ? 'text-emerald-400'
                          : device.latencyMs < 30
                          ? 'text-cyan-400'
                          : 'text-amber-400'
                      }
                    >
                      {device.latencyMs}ms
                    </span>
                    <span className="text-[10px] text-slate-400">LAN</span>
                  </div>
                </div>

                {/* CPU Load */}
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-indigo-400" />
                    Tải CPU
                  </div>
                  <div className="font-mono font-bold text-slate-200 mt-1 flex items-center gap-1.5">
                    <span>{device.cpuLoad}%</span>
                    <div className="w-12 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          device.cpuLoad > 75
                            ? 'bg-rose-500'
                            : device.cpuLoad > 50
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                        style={{ width: `${device.cpuLoad}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Memory Usage */}
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <HardDrive className="w-3 h-3 text-sky-400" />
                    RAM
                  </div>
                  <div className="font-mono font-bold text-slate-200 mt-1">
                    {device.memoryUsedGB} / {device.memoryTotalGB} GB
                  </div>
                </div>

                {/* Battery / Power */}
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    {device.isCharging ? (
                      <BatteryCharging className="w-3 h-3 text-emerald-400" />
                    ) : device.battery > 50 ? (
                      <BatteryFull className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <BatteryMedium className="w-3 h-3 text-amber-400" />
                    )}
                    Nguồn điện
                  </div>
                  <div className="font-mono font-bold text-slate-200 mt-1 flex items-center gap-1">
                    <span
                      className={
                        device.isCharging || device.battery > 50
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }
                    >
                      {device.battery}%
                    </span>
                    {device.isCharging && <span className="text-[10px] text-emerald-400">⚡ AC</span>}
                  </div>
                </div>
              </div>

              {/* Active Task Section */}
              <div className="mt-3.5 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    Tác vụ đang chạy:
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Uptime: {device.uptime}
                  </span>
                </div>
                <div className="mt-1.5 text-xs text-cyan-300 font-medium bg-cyan-950/30 border border-cyan-800/40 px-3 py-2 rounded-lg flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin shrink-0" />
                    <span className="truncate">{device.activeTask}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    +{device.taskQueueCount} ngầm
                  </span>
                </div>
              </div>

              {/* Action Buttons for this Device */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDispatchCommand(device);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-600/20 transition-all"
                >
                  <Send className="w-3 h-3" />
                  <span>Ra lệnh riêng cho node này</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFileSyncTargetDevice(device as any);
                    setIsFileSyncModalOpen(true);
                  }}
                  title="Đẩy mã nguồn hoặc tài liệu trực tiếp sang node này qua Hoppi Mesh"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/60 hover:border-cyan-500/60 transition-all cursor-pointer"
                >
                  <FileCode className="w-3 h-3 text-cyan-400" />
                  <span>Đẩy Tệp</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTestCompletion(device);
                  }}
                  title="Mô phỏng Hoppi hoàn thành nhiệm vụ và hiện thông báo pop-up toàn màn hình"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Test Báo Cáo</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Device Deep Inspection Drawer */}
      {selectedDeviceDetails && (
        <div
          className={`mt-6 p-4 md:p-5 rounded-xl border transition-all ${
            currentTheme === 'light'
              ? 'bg-white border-slate-200 shadow-sm'
              : currentTheme === 'deepspace'
              ? 'bg-[#0d121d] border-neutral-800'
              : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-100">
                Chi Tiết Tiến Trình Phân Tán: {selectedDeviceDetails.name}
              </h3>
              <span className="font-mono text-xs text-slate-400">
                ({selectedDeviceDetails.ip})
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Cơ chế đồng bộ:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> E2E Token Handshake
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
            {/* Left: Background Workers */}
            <div>
              <span className="text-slate-400 font-medium block mb-2">
                Các luồng công việc (Worker Tasks) đang chạy trên phần cứng:
              </span>
              <div className="space-y-1.5">
                {selectedDeviceDetails.workerTasks.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-slate-950/60 border border-slate-800/80 text-slate-300 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                      <span className="truncate">{t}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 shrink-0">Đang chạy</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Capabilities & Master Privileges */}
            <div>
              <span className="text-slate-400 font-medium block mb-2">
                Quyền hạn và khả năng phần cứng (Capabilities):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedDeviceDetails.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="px-2.5 py-1 rounded text-[11px] font-mono bg-slate-800/80 text-cyan-300 border border-slate-700/80"
                  >
                    {cap}
                  </span>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/30 text-slate-300 text-[11px] flex items-center justify-between">
                <span>
                  Chủ nhân tối cao có thể trực tiếp chỉ thị thiết bị này chạy độc lập mà không ảnh hưởng tới các thiết bị khác.
                </span>
                <button
                  onClick={() => handleDispatchCommand(selectedDeviceDetails)}
                  className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium shrink-0 ml-2"
                >
                  Giao việc ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global File Sync Modal */}
      <GlobalFileSyncModal
        isOpen={isFileSyncModalOpen}
        onClose={() => setIsFileSyncModalOpen(false)}
        theme={currentTheme}
        initialTargetDevice={fileSyncTargetDevice}
        onSuccessNotice={(title, summary) => {
          setActionFeedback(`${title} - ${summary}`);
          setTimeout(() => setActionFeedback(null), 4000);
        }}
      />
    </div>
  );
};
