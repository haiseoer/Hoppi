import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppTheme, HoppiCompletionNotice, MeshPowerMode } from '../types';
import {
  Cpu,
  Activity,
  HardDrive,
  Wifi,
  ArrowDown,
  ArrowUp,
  Server,
  Laptop,
  RefreshCw,
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
  Gauge,
  Radio,
  Layers,
  Sparkles,
  Battery,
  BatteryCharging,
  BatteryWarning,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  ArrowDownRight,
  Bell,
  Smartphone,
  Tablet,
  Info,
  Sliders,
  SlidersHorizontal,
  X,
  BarChart3,
  Calendar,
  History,
  TrendingUp,
  BellRing,
  ShieldAlert,
  Leaf,
  Download,
  FileSpreadsheet,
  MapPin,
  Move,
  RotateCcw,
  Compass,
  Eye,
  EyeOff,
  Power,
  Terminal,
  ShieldCheck,
  Flame,
  Thermometer,
  Search,
  Wrench,
  Scan,
  AlertOctagon,
  Bug,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts';

export interface MeshBatteryDevice {
  id: string;
  name: string;
  shortName: string;
  type: 'desktop' | 'mobile' | 'tablet';
  currentBattery: number;
  isCharging: boolean;
  dischargeRatePerHour: number;
  color: string;
  accentColor: string;
  batteryHealth: number;
  cpuLoadAvg: number;
  cycleCount: number;
  dischargeHistory60m?: number[]; // Discharge rate in %/h every 5 min over last 60 minutes (-60m to 0m, 13 points)
}

const INITIAL_BATTERY_DEVICES: MeshBatteryDevice[] = [
  {
    id: 'macbook',
    name: 'MacBook Pro M3 Max',
    shortName: 'MacBook M3',
    type: 'desktop',
    currentBattery: 74,
    isCharging: false,
    dischargeRatePerHour: 4.8,
    color: '#22d3ee', // Cyan
    accentColor: 'rgba(34, 211, 238, 0.4)',
    batteryHealth: 99,
    cpuLoadAvg: 38,
    cycleCount: 48,
    dischargeHistory60m: [4.1, 4.2, 4.3, 4.5, 4.9, 5.2, 5.0, 4.8, 5.1, 4.9, 4.7, 4.8, 4.8],
  },
  {
    id: 'iphone',
    name: 'iPhone 16 Pro Max',
    shortName: 'iPhone 16 Pro',
    type: 'mobile',
    currentBattery: 32,
    isCharging: false,
    dischargeRatePerHour: 3.6,
    color: '#fb7185', // Rose
    accentColor: 'rgba(251, 113, 133, 0.4)',
    batteryHealth: 96,
    cpuLoadAvg: 22,
    cycleCount: 112,
    dischargeHistory60m: [3.2, 3.3, 3.4, 3.7, 3.9, 3.8, 3.5, 3.6, 3.8, 3.7, 3.6, 3.5, 3.6],
  },
  {
    id: 'ipad',
    name: 'iPad Pro M2 (Phòng khách)',
    shortName: 'iPad Pro M2',
    type: 'tablet',
    currentBattery: 58,
    isCharging: false,
    dischargeRatePerHour: 2.9,
    color: '#a78bfa', // Purple
    accentColor: 'rgba(167, 139, 250, 0.4)',
    batteryHealth: 97,
    cpuLoadAvg: 18,
    cycleCount: 84,
    dischargeHistory60m: [2.5, 2.6, 2.7, 2.9, 3.1, 3.0, 2.8, 2.9, 3.0, 2.9, 2.8, 2.9, 2.9],
  },
];

export const BASELINE_DISCHARGE_RATES: Record<string, number> = {
  macbook: 2.2, // standard normal baseline 2.2%/h
  iphone: 1.6,  // standard normal baseline 1.6%/h
  ipad: 1.4,    // standard normal baseline 1.4%/h
};

export interface DiagnosticLogItem {
  id: string;
  time: string;
  text: string;
  type: 'info' | 'warn' | 'success' | 'culprit';
}

export interface AbnormalDrainAnomaly {
  device: MeshBatteryDevice;
  baselineRate: number;
  currentRate: number;
  surgePercent: number;
  hoursLost: number;
  normalDepletionHours: number;
  currentDepletionHours: number;
  suspectedProcesses: PowerHungryProcess[];
  timestamp: string;
}

export interface HistoricalDayMeta {
  id: string;
  label: string;
  shortLabel: string;
  dateStr: string;
}

export const HISTORICAL_DAYS: HistoricalDayMeta[] = [
  { id: 'avg7d', label: 'Trung Bình 7 Ngày (Toàn Tuần)', shortLabel: 'TB 7 Ngày', dateStr: '23/10 - 29/10' },
  { id: 'd-0', label: 'Hôm nay (Thứ Năm 29/10)', shortLabel: 'T5 29/10', dateStr: '29/10/2026' },
  { id: 'd-1', label: 'Hôm qua (Thứ Tư 28/10)', shortLabel: 'T4 28/10', dateStr: '28/10/2026' },
  { id: 'd-2', label: 'Thứ Ba (27/10)', shortLabel: 'T3 27/10', dateStr: '27/10/2026' },
  { id: 'd-3', label: 'Thứ Hai (26/10)', shortLabel: 'T2 26/10', dateStr: '26/10/2026' },
  { id: 'd-4', label: 'Chủ Nhật (25/10)', shortLabel: 'CN 25/10', dateStr: '25/10/2026' },
  { id: 'd-5', label: 'Thứ Bảy (24/10)', shortLabel: 'T7 24/10', dateStr: '24/10/2026' },
  { id: 'd-6', label: 'Thứ Sáu (23/10)', shortLabel: 'T6 23/10', dateStr: '23/10/2026' },
];

export interface FloorplanNode {
  id: string;
  name: string;
  shortName: string;
  type: 'router' | 'desktop' | 'mobile' | 'tablet' | 'server' | 'iot';
  room: string;
  x: number; // 0 to 520 (SVG canvas coordinates)
  y: number; // 0 to 320
  defaultX: number;
  defaultY: number;
  optimalX: number;
  optimalY: number;
  txPowerDbm: number;
  ip: string;
  channelBand: string;
  color: string;
  isGateway?: boolean;
}

export const INITIAL_FLOORPLAN_NODES: FloorplanNode[] = [
  {
    id: 'gateway',
    name: 'Wi-Fi 6E Tri-Band Gateway',
    shortName: 'Mesh Gateway',
    type: 'router',
    room: 'Hành Lang / Trung Tâm',
    x: 250,
    y: 155,
    defaultX: 250,
    defaultY: 155,
    optimalX: 255,
    optimalY: 155,
    txPowerDbm: 24,
    ip: '192.168.1.1',
    channelBand: '6GHz Wi-Fi 6E (160MHz)',
    color: '#06b6d4',
    isGateway: true,
  },
  {
    id: 'macbook',
    name: 'MacBook Pro M3 Max',
    shortName: 'MacBook M3',
    type: 'desktop',
    room: 'Phòng Làm Việc (Dev Lab)',
    x: 395,
    y: 95,
    defaultX: 395,
    defaultY: 95,
    optimalX: 370,
    optimalY: 110,
    txPowerDbm: 20,
    ip: '192.168.1.142',
    channelBand: '6GHz (160MHz)',
    color: '#22d3ee',
  },
  {
    id: 'server',
    name: 'Ubuntu 24.04 (Home Server)',
    shortName: 'Server Node',
    type: 'server',
    room: 'Tủ Kỹ Thuật (Server Closet)',
    x: 95,
    y: 105,
    defaultX: 95,
    defaultY: 105,
    optimalX: 115,
    optimalY: 120,
    txPowerDbm: 22,
    ip: '192.168.1.100',
    channelBand: '10GbE + 5GHz Backhaul',
    color: '#a855f7',
  },
  {
    id: 'iphone',
    name: 'iPhone 16 Pro Max',
    shortName: 'iPhone 16 Pro',
    type: 'mobile',
    room: 'Phòng Khách (Living Room)',
    x: 320,
    y: 240,
    defaultX: 320,
    defaultY: 240,
    optimalX: 305,
    optimalY: 215,
    txPowerDbm: 18,
    ip: '192.168.1.178',
    channelBand: '5GHz (80MHz)',
    color: '#fb7185',
  },
  {
    id: 'ipad',
    name: 'iPad Pro M2',
    shortName: 'iPad Pro',
    type: 'tablet',
    room: 'Phòng Ngủ Master',
    x: 435,
    y: 245,
    defaultX: 435,
    defaultY: 245,
    optimalX: 390,
    optimalY: 210,
    txPowerDbm: 19,
    ip: '192.168.1.155',
    channelBand: '5GHz (80MHz)',
    color: '#c084fc',
  },
  {
    id: 'iot-hub',
    name: 'Hoppi IoT Sensor Hub',
    shortName: 'IoT Hub Node',
    type: 'iot',
    room: 'Ban Công / Smart Garden',
    x: 120,
    y: 250,
    defaultX: 120,
    defaultY: 250,
    optimalX: 160,
    optimalY: 215,
    txPowerDbm: 16,
    ip: '192.168.1.88',
    channelBand: '2.4GHz Zigbee/Mesh',
    color: '#10b981',
  },
];

export interface PowerHungryProcess {
  id: string;
  name: string;
  command: string;
  pid: number;
  category: 'dev' | 'browser' | 'vm' | 'media' | 'system';
  cpuPercent: number;
  ramMb: number;
  drainReductionPerHour: number; // % drain saved per hour (e.g. 1.2%/h)
  uptimeExtensionMinutes: number; // estimated minutes of battery life saved
  isTerminated: boolean;
  priority: 'recommended' | 'safe_to_kill' | 'critical_work';
  impactDescription: string;
}

export const INITIAL_POWER_HUNGRY_PROCESSES: PowerHungryProcess[] = [
  {
    id: 'proc-docker',
    name: 'Docker Desktop Engine & HyperKit',
    command: 'com.docker.backend --hyperkit-vm --disk-sync',
    pid: 4812,
    category: 'vm',
    cpuPercent: 21.4,
    ramMb: 2850,
    drainReductionPerHour: 1.6,
    uptimeExtensionMinutes: 45,
    isTerminated: false,
    priority: 'recommended',
    impactDescription: '3 containers nền (PostgreSQL, Redis, Elasticsearch) liên tục chiếm chu kỳ CPU & RAM ảo hoá',
  },
  {
    id: 'proc-chrome-gpu',
    name: 'Google Chrome GPU Helper (14 Tabs)',
    command: 'Google Chrome Helper (Renderer) --type=gpu-process',
    pid: 19283,
    category: 'browser',
    cpuPercent: 15.8,
    ramMb: 1920,
    drainReductionPerHour: 1.2,
    uptimeExtensionMinutes: 35,
    isTerminated: false,
    priority: 'recommended',
    impactDescription: 'Các tab ngầm không hoạt động có animation CSS/WebGL tiêu tốn tài nguyên GPU liên tục',
  },
  {
    id: 'proc-xcode-sim',
    name: 'Xcode Simulator & CoreSimulatorBridge',
    command: 'launchd_sim /Library/Developer/CoreSimulator/Devices',
    pid: 8831,
    category: 'dev',
    cpuPercent: 14.2,
    ramMb: 1480,
    drainReductionPerHour: 1.0,
    uptimeExtensionMinutes: 28,
    isTerminated: false,
    priority: 'recommended',
    impactDescription: 'Máy ảo iOS 18 daemon đang chạy polling ngầm tiêu tốn năng lượng',
  },
  {
    id: 'proc-figma',
    name: 'Figma Desktop Metal Renderer',
    command: 'Figma Helper (Renderer) --enable-metal-compositor',
    pid: 12402,
    category: 'media',
    cpuPercent: 11.5,
    ramMb: 940,
    drainReductionPerHour: 0.8,
    uptimeExtensionMinutes: 22,
    isTerminated: false,
    priority: 'safe_to_kill',
    impactDescription: 'Tiến trình Metal acceleration cho file canvas Figma nặng đang mở ở tab phụ',
  },
  {
    id: 'proc-spotlight',
    name: 'Spotlight Indexer (mdworker_shared)',
    command: '/System/Library/Frameworks/CoreServices.../mdworker',
    pid: 742,
    category: 'system',
    cpuPercent: 8.6,
    ramMb: 360,
    drainReductionPerHour: 0.6,
    uptimeExtensionMinutes: 18,
    isTerminated: false,
    priority: 'safe_to_kill',
    impactDescription: 'Tiến trình lập chỉ mục tìm kiếm tập tin ổ đĩa ngầm của macOS',
  },
  {
    id: 'proc-media-apps',
    name: 'Discord & Spotify HW Acceleration',
    command: 'Discord Helper --gpu-preferences=1 --renderer',
    pid: 21049,
    category: 'media',
    cpuPercent: 6.4,
    ramMb: 420,
    drainReductionPerHour: 0.5,
    uptimeExtensionMinutes: 14,
    isTerminated: false,
    priority: 'safe_to_kill',
    impactDescription: 'Tăng tốc đồ họa cho ứng dụng chat và stream âm nhạc nền khi đang làm việc',
  },
  {
    id: 'proc-node-watcher',
    name: 'Node.js Chokidar File Watcher',
    command: 'node /node_modules/chokidar/index.js (Vite Watcher)',
    pid: 3241,
    category: 'dev',
    cpuPercent: 7.8,
    ramMb: 520,
    drainReductionPerHour: 0.6,
    uptimeExtensionMinutes: 16,
    isTerminated: false,
    priority: 'critical_work',
    impactDescription: 'Tiến trình giám sát thay đổi file code (Cần lưu ý nếu đang thực hiện tác vụ lập trình)',
  },
];

interface DeviceMetrics {
  id: string;
  name: string;
  type: 'current' | 'server';
  roleLabel: string;
  ip: string;
  status: 'online' | 'degraded' | 'offline';
  cpu: {
    percent: number;
    cores: number;
    tempC: number;
    history: number[];
  };
  memory: {
    usedGb: number;
    totalGb: number;
    cacheGb: number;
    percent: number;
  };
  network: {
    downloadKbps: number;
    uploadKbps: number;
    pingMs: number;
    adapter: string;
  };
  uptime: string;
}

interface SystemPerformanceWidgetProps {
  theme?: AppTheme;
  onSpeakText?: (text: string) => void;
  onTriggerCompletionNotice?: (notice: HoppiCompletionNotice) => void;
  onPowerModeChange?: (mode: MeshPowerMode) => void;
}

export const SystemPerformanceWidget: React.FC<SystemPerformanceWidgetProps> = ({
  theme = 'cyberpunk',
  onSpeakText,
  onTriggerCompletionNotice,
  onPowerModeChange,
}) => {
  const [activeTab, setActiveTab] = useState<'dual' | 'current' | 'server' | 'battery' | 'floorplan'>('dual');
  const [isLive, setIsLive] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Interactive 2D Floorplan & Signal Heatmap Visualization State
  const [floorplanNodes, setFloorplanNodes] = useState<FloorplanNode[]>(() => {
    try {
      const saved = localStorage.getItem('hoppi_floorplan_nodes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_FLOORPLAN_NODES;
  });
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [selectedFloorplanNodeId, setSelectedFloorplanNodeId] = useState<string | null>(null);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [showMeshLinks, setShowMeshLinks] = useState<boolean>(true);
  const [showDeadZones, setShowDeadZones] = useState<boolean>(true);
  const [isOptimizingPlacement, setIsOptimizingPlacement] = useState<boolean>(false);
  const floorplanSvgRef = useRef<SVGSVGElement | null>(null);

  // Mesh Power Mode: 'high-performance' vs 'battery-saver'
  const [meshPowerMode, setMeshPowerMode] = useState<MeshPowerMode>(() => {
    try {
      const saved = localStorage.getItem('hoppi_mesh_power_mode');
      if (saved === 'high-performance' || saved === 'battery-saver') return saved;
    } catch (e) {
      console.error(e);
    }
    return 'high-performance';
  });
  const [isFabDrawerOpen, setIsFabDrawerOpen] = useState<boolean>(false);

  // Mesh Devices Battery Tracking State
  const [batteryDevices, setBatteryDevices] = useState<MeshBatteryDevice[]>(INITIAL_BATTERY_DEVICES);
  const [showDepletionOverlay, setShowDepletionOverlay] = useState<boolean>(true);
  const [visibleDevices, setVisibleDevices] = useState<Record<string, boolean>>({
    macbook: true,
    iphone: true,
    ipad: true,
  });
  const [batteryNotice, setBatteryNotice] = useState<string | null>(null);

  // Toggleable View in Battery Section: 'forecast' (Line chart 24h + predictions) vs 'heatmap' (Color-coded grid relative power) vs 'distribution' (Radial bar chart mesh power) vs 'historical' (Bar chart 7 days hourly consumption)
  const [batterySubView, setBatterySubView] = useState<'forecast' | 'heatmap' | 'distribution' | 'historical'>('heatmap');
  const [heatMapFilter, setHeatMapFilter] = useState<'all' | 'battery' | 'ac'>('all');
  const [heatMapSortBy, setHeatMapSortBy] = useState<'power' | 'name' | 'battery'>('power');
  const [selectedHeatMapDeviceId, setSelectedHeatMapDeviceId] = useState<string | null>(null);
  const [radialPowerDeviceFilter, setRadialPowerDeviceFilter] = useState<'all' | 'battery'>('all');
  const [selectedRadialDeviceNode, setSelectedRadialDeviceNode] = useState<string | null>(null);
  const [historicalSelectedDay, setHistoricalSelectedDay] = useState<string>('avg7d');
  const [historicalIsStacked, setHistoricalIsStacked] = useState<boolean>(true);

  // 60-Minute Discharge Rate Sparkline State
  const [sparkline60mDevice, setSparkline60mDevice] = useState<string>('all');
  const [show60mSparklineCard, setShow60mSparklineCard] = useState<boolean>(true);
  const [sparklineHoverIdx, setSparklineHoverIdx] = useState<number | null>(null);

  // Custom Battery Alert Percentage Threshold (User Configurable: 10% - 50%)
  const [customAlertThreshold, setCustomAlertThreshold] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('hoppi_battery_alert_threshold');
      if (saved) {
        const val = parseInt(saved, 10);
        if (!isNaN(val) && val >= 10 && val <= 60) return val;
      }
    } catch (e) {
      console.error(e);
    }
    return 25; // Default 25% threshold
  });
  const [isThresholdSettingsOpen, setIsThresholdSettingsOpen] = useState<boolean>(false);
  const [autoCompletionNoticeEnabled, setAutoCompletionNoticeEnabled] = useState<boolean>(true);
  const lastAlertTimestampRef = useRef<Record<string, number>>({});

  // --- SMART POWER OPTIMIZER STATE & AUTOMATION (<15% BATTERY DROP) ---
  const [smartProcesses, setSmartProcesses] = useState<PowerHungryProcess[]>(() => {
    try {
      const saved = localStorage.getItem('hoppi_smart_power_optimizer_processes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_POWER_HUNGRY_PROCESSES;
  });

  const [isSmartOptimizerOpen, setIsSmartOptimizerOpen] = useState<boolean>(false);
  const [isCriticalTaskMode, setIsCriticalTaskMode] = useState<boolean>(false);
  const [autoOptimizerUnder15, setAutoOptimizerUnder15] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('hoppi_smart_optimizer_auto15');
      if (saved !== null) return saved === 'true';
    } catch (e) {
      console.error(e);
    }
    return true; // Default auto enabled
  });
  const lastOptimizerAutoTriggerRef = useRef<number>(0);
  const [optimizerNotice, setOptimizerNotice] = useState<string | null>(null);

  // Save smart processes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hoppi_smart_power_optimizer_processes', JSON.stringify(smartProcesses));
    } catch (e) {
      console.error(e);
    }
  }, [smartProcesses]);

  const handleToggleAutoOptimizer = (enabled: boolean) => {
    setAutoOptimizerUnder15(enabled);
    try {
      localStorage.setItem('hoppi_smart_optimizer_auto15', String(enabled));
    } catch (e) {
      console.error(e);
    }
    setOptimizerNotice(
      enabled
        ? '⚡ Đã bật: Tự động kích hoạt Smart Power Optimizer khi pin < 15%'
        : '⚠️ Đã tắt tự động kích hoạt Optimizer'
    );
    setTimeout(() => setOptimizerNotice(null), 3500);
  };

  // Smart Power Optimizer Metrics Calculation
  const optimizerMetrics = useMemo(() => {
    const runningProcesses = smartProcesses.filter((p) => !p.isTerminated);
    const terminatedProcesses = smartProcesses.filter((p) => p.isTerminated);
    const suggestedToKill = smartProcesses.filter((p) => !p.isTerminated && p.priority !== 'critical_work');

    const totalPotentialGainMin = smartProcesses
      .filter((p) => p.priority !== 'critical_work')
      .reduce((acc, p) => acc + p.uptimeExtensionMinutes, 0);

    const currentSavedMin = terminatedProcesses.reduce(
      (acc, p) => acc + p.uptimeExtensionMinutes,
      0
    );

    const pendingSavedMin = suggestedToKill.reduce(
      (acc, p) => acc + p.uptimeExtensionMinutes,
      0
    );

    const totalPotentialDrainReduction = +(
      smartProcesses
        .filter((p) => p.priority !== 'critical_work')
        .reduce((acc, p) => acc + p.drainReductionPerHour, 0)
    ).toFixed(1);

    const currentDrainReduction = +(
      terminatedProcesses.reduce((acc, p) => acc + p.drainReductionPerHour, 0)
    ).toFixed(1);

    const freedCpuPercent = Math.round(
      terminatedProcesses.reduce((acc, p) => acc + p.cpuPercent, 0)
    );

    const freedRamMb = Math.round(
      terminatedProcesses.reduce((acc, p) => acc + p.ramMb, 0)
    );

    // Check if any device currently has battery <= 15%
    const criticalBatteryDevice = batteryDevices.find((d) => d.currentBattery <= 15);

    return {
      runningCount: runningProcesses.length,
      terminatedCount: terminatedProcesses.length,
      suggestedCount: suggestedToKill.length,
      totalPotentialGainMin,
      currentSavedMin,
      pendingSavedMin,
      totalPotentialDrainReduction,
      currentDrainReduction,
      freedCpuPercent,
      freedRamMb,
      criticalBatteryDevice,
      isUnder15Active: Boolean(criticalBatteryDevice),
    };
  }, [smartProcesses, batteryDevices]);

  // Automated trigger effect when battery drops below 15%
  useEffect(() => {
    if (!autoOptimizerUnder15) return;
    const criticalDev = batteryDevices.find((d) => d.currentBattery <= 15);
    if (criticalDev) {
      const now = Date.now();
      if (now - lastOptimizerAutoTriggerRef.current > 180000) { // 3-minute cooldown
        lastOptimizerAutoTriggerRef.current = now;
        setIsSmartOptimizerOpen(true);

        const pendingMin = smartProcesses
          .filter((p) => !p.isTerminated && p.priority !== 'critical_work')
          .reduce((acc, p) => acc + p.uptimeExtensionMinutes, 0);

        const alertText = `Chủ nhân ơi! Pin của ${criticalDev.name} chỉ còn ${criticalDev.currentBattery}%, đã rơi xuống dưới 15%! Hoppi kích hoạt Smart Power Optimizer và đề xuất dừng các tiến trình ngầm để kéo dài thêm ${pendingMin} phút hoạt động cho tác vụ quan trọng!`;

        if (onTriggerCompletionNotice) {
          onTriggerCompletionNotice({
            id: `smart-optimizer-alert-${Date.now()}`,
            sourceDeviceId: criticalDev.id,
            sourceDeviceName: criticalDev.name,
            taskTitle: `⚡ Smart Power Optimizer: Pin ${criticalDev.currentBattery}% (<15%)`,
            summary: `Mức pin của ${criticalDev.name} đã xuống dưới 15%! Hoppi Smart Power Optimizer đề xuất kết thúc các tiến trình nền nặng (Docker, Chrome GPU, Xcode Simulator...) để kéo dài thêm +${pendingMin} phút uptime cho tác vụ hiện tại.`,
            spokenMessage: alertText,
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            mood: 'critical',
            metrics: {
              durationMs: 220,
              tokensProcessed: 145,
              syncedDevicesCount: batteryDevices.length,
            },
          });
        } else if (onSpeakText) {
          onSpeakText(alertText);
        }

        setOptimizerNotice(`⚡ Smart Power Optimizer tự động kích hoạt do pin ${criticalDev.shortName} < 15%!`);
        setTimeout(() => setOptimizerNotice(null), 5000);
      }
    }
  }, [batteryDevices, autoOptimizerUnder15, smartProcesses, onTriggerCompletionNotice, onSpeakText]);

  // Handlers for Smart Power Optimizer
  const handleTerminateSingleProcess = (procId: string) => {
    const target = smartProcesses.find((p) => p.id === procId);
    if (!target) return;
    const willTerminate = !target.isTerminated;

    setSmartProcesses((prev) =>
      prev.map((p) => (p.id === procId ? { ...p, isTerminated: willTerminate } : p))
    );

    // Dynamic adjustment to battery drain and client CPU
    if (willTerminate) {
      setBatteryDevices((prev) =>
        prev.map((dev) => ({
          ...dev,
          dischargeRatePerHour: Math.max(0.8, +(dev.dischargeRatePerHour - target.drainReductionPerHour * 0.4).toFixed(1)),
        }))
      );
      setCurrentDevice((prev) => ({
        ...prev,
        cpu: {
          ...prev.cpu,
          percent: Math.max(10, Math.round(prev.cpu.percent - target.cpuPercent * 0.3)),
        },
      }));
      setOptimizerNotice(`✅ Đã dừng [${target.name}] (Tiết kiệm +${target.uptimeExtensionMinutes}m, -${target.drainReductionPerHour}%/h)`);
    } else {
      setBatteryDevices((prev) =>
        prev.map((dev) => ({
          ...dev,
          dischargeRatePerHour: +(dev.dischargeRatePerHour + target.drainReductionPerHour * 0.4).toFixed(1),
        }))
      );
      setOptimizerNotice(`🔄 Đã khôi phục [${target.name}]`);
    }
    setTimeout(() => setOptimizerNotice(null), 3500);
  };

  const handleTerminateAllSuggested = () => {
    const suggestedIds = new Set(
      smartProcesses
        .filter((p) => !p.isTerminated && p.priority !== 'critical_work')
        .map((p) => p.id)
    );

    if (suggestedIds.size === 0) {
      setOptimizerNotice('ℹ️ Tất cả tiến trình đề xuất đã được tối ưu hóa trước đó.');
      setTimeout(() => setOptimizerNotice(null), 3000);
      return;
    }

    setSmartProcesses((prev) =>
      prev.map((p) => (suggestedIds.has(p.id) ? { ...p, isTerminated: true } : p))
    );

    // Apply significant battery drain reduction to devices
    setBatteryDevices((prev) =>
      prev.map((dev) => ({
        ...dev,
        dischargeRatePerHour: Math.max(0.9, +(dev.dischargeRatePerHour - 2.4).toFixed(1)),
      }))
    );

    // Visibly reduce CPU and memory in client device telemetry
    setCurrentDevice((prev) => ({
      ...prev,
      cpu: {
        ...prev.cpu,
        percent: Math.max(12, Math.round(prev.cpu.percent * 0.55)),
        tempC: Math.max(37, prev.cpu.tempC - 6),
      },
      memory: {
        ...prev.memory,
        usedGb: Math.max(4.2, +(prev.memory.usedGb - 2.8).toFixed(1)),
        percent: Math.max(26, Math.round(prev.memory.percent - 18)),
      },
    }));

    const gainedMin = optimizerMetrics.pendingSavedMin;
    setOptimizerNotice(
      `⚡ Hoppi đã dừng ${suggestedIds.size} tiến trình ngầm! Kéo dài thời gian thêm +${gainedMin} phút.`
    );
    setTimeout(() => setOptimizerNotice(null), 6000);

    if (onSpeakText) {
      onSpeakText(
        `Hoppi đã tối ưu năng lượng thông minh thành công, tạm dừng ${suggestedIds.size} tiến trình ngầm ngốn tài nguyên nhất. Thời lượng pin của bạn được kéo dài thêm ${gainedMin} phút cho tác vụ quan trọng!`
      );
    }
  };

  const handleRestoreAllProcesses = () => {
    setSmartProcesses((prev) => prev.map((p) => ({ ...p, isTerminated: false })));

    // Restore standard discharge rates
    setBatteryDevices((prev) =>
      prev.map((dev) => {
        const standardRate = dev.id === 'macbook' ? 4.8 : dev.id === 'iphone' ? 3.6 : 2.9;
        return { ...dev, dischargeRatePerHour: standardRate };
      })
    );

    setCurrentDevice((prev) => ({
      ...prev,
      cpu: { ...prev.cpu, percent: 28, tempC: 44 },
      memory: { ...prev.memory, usedGb: 9.6, percent: 53 },
    }));

    setOptimizerNotice('🔄 Đã khôi phục hoạt động cho toàn bộ tiến trình ngầm.');
    setTimeout(() => setOptimizerNotice(null), 3000);

    if (onSpeakText) {
      onSpeakText('Đã khôi phục toàn bộ tiến trình ngầm về trạng thái hoạt động bình thường.');
    }
  };

  const handleSimulateBatteryDropUnder15 = () => {
    // Set MacBook battery to 13% to immediately trigger automated Smart Power Optimizer
    setBatteryDevices((prev) =>
      prev.map((dev) =>
        dev.id === 'macbook'
          ? { ...dev, currentBattery: 13, dischargeRatePerHour: 5.2 }
          : dev
      )
    );
    setOptimizerNotice('🧪 Mô phỏng: Pin MacBook M3 giảm xuống 13% (<15%) để kích hoạt Smart Power Optimizer!');
    setTimeout(() => setOptimizerNotice(null), 4500);
  };

  const handleRestoreSimulatedBattery = () => {
    setBatteryDevices((prev) =>
      prev.map((dev) => {
        if (dev.id === 'macbook') return { ...dev, currentBattery: 78, dischargeRatePerHour: 4.8 };
        if (dev.id === 'iphone') return { ...dev, currentBattery: 65, dischargeRatePerHour: 3.6 };
        return dev;
      })
    );
    setOptimizerNotice('🔋 Đã khôi phục mức pin thiết bị về mức an toàn (78%).');
    setTimeout(() => setOptimizerNotice(null), 3500);
  };

  const handleToggleCriticalTaskMode = () => {
    const nextVal = !isCriticalTaskMode;
    setIsCriticalTaskMode(nextVal);
    if (nextVal) {
      setOptimizerNotice('🛡️ Đã bật Chế độ Tác vụ Quan trọng: Ưu tiên tối đa IDE & Terminal, khoá tiến trình phụ');
      if (onSpeakText) {
        onSpeakText('Đã kích hoạt Chế độ Tác vụ Quan trọng, Hoppi bảo vệ tối đa pin cho công việc hiện tại.');
      }
    } else {
      setOptimizerNotice('Đã tắt Chế độ Tác vụ Quan trọng.');
    }
    setTimeout(() => setOptimizerNotice(null), 3500);
  };

  // --- ABNORMAL BATTERY DRAIN DETECTION & DIAGNOSTIC ROUTINE STATE ---
  const [isSpikeSimulated, setIsSpikeSimulated] = useState<boolean>(false);
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState<boolean>(false);
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState<boolean>(false);
  const [diagnosticProgress, setDiagnosticProgress] = useState<number>(0);
  const [diagnosticStepText, setDiagnosticStepText] = useState<string>('Sẵn sàng khởi chạy chẩn đoán');
  const [diagnosticLogs, setDiagnosticLogs] = useState<DiagnosticLogItem[]>([
    {
      id: 'init-1',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      text: 'AI Diagnostic Engine v3.8 sẵn sàng giám sát hệ thống.',
      type: 'info',
    },
  ]);
  const [abnormalNoticeDismissed, setAbnormalNoticeDismissed] = useState<boolean>(false);
  const lastSpikeAlertTimeRef = useRef<number>(0);
  const diagnosticTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      diagnosticTimeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // Compute abnormal battery drain anomaly across devices
  const abnormalDrainAnomaly = useMemo<AbnormalDrainAnomaly | null>(() => {
    // If spike simulation is active, target MacBook Pro with an extreme surge
    if (isSpikeSimulated) {
      const dev = batteryDevices.find((d) => d.id === 'macbook') || batteryDevices[0];
      const baseline = BASELINE_DISCHARGE_RATES[dev.id] || 2.2;
      const currentRate = Math.max(dev.dischargeRatePerHour, 7.8);
      const surgePercent = Math.round(((currentRate - baseline) / baseline) * 100); // ~ +254%
      const normalDepletionHours = +(dev.currentBattery / baseline).toFixed(1);
      const currentDepletionHours = +(dev.currentBattery / currentRate).toFixed(1);
      const hoursLost = +(normalDepletionHours - currentDepletionHours).toFixed(1);
      const suspected = smartProcesses.filter((p) => !p.isTerminated);
      return {
        device: { ...dev, dischargeRatePerHour: currentRate },
        baselineRate: baseline,
        currentRate,
        surgePercent,
        hoursLost,
        normalDepletionHours,
        currentDepletionHours,
        suspectedProcesses: suspected,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
    }

    // Dynamic scan: Find any non-charging device exceeding 180% of standard baseline or >=5.0%/h
    for (const dev of batteryDevices) {
      if (dev.isCharging) continue;
      const baseline = BASELINE_DISCHARGE_RATES[dev.id] || 2.2;
      if (dev.dischargeRatePerHour >= baseline * 1.85 || dev.dischargeRatePerHour >= 5.0) {
        const surgePercent = Math.round(((dev.dischargeRatePerHour - baseline) / baseline) * 100);
        const normalDepletionHours = +(dev.currentBattery / baseline).toFixed(1);
        const currentDepletionHours = +(dev.currentBattery / dev.dischargeRatePerHour).toFixed(1);
        const hoursLost = +(normalDepletionHours - currentDepletionHours).toFixed(1);
        const suspected = smartProcesses.filter((p) => !p.isTerminated);
        return {
          device: dev,
          baselineRate: baseline,
          currentRate: dev.dischargeRatePerHour,
          surgePercent,
          hoursLost,
          normalDepletionHours,
          currentDepletionHours,
          suspectedProcesses: suspected,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        };
      }
    }
    return null;
  }, [batteryDevices, isSpikeSimulated, smartProcesses]);

  // Automated trigger effect: notify user via HoppiCompletionNotice and voice when abnormal drain is detected
  useEffect(() => {
    if (!abnormalDrainAnomaly || abnormalNoticeDismissed) return;
    const now = Date.now();
    if (now - lastSpikeAlertTimeRef.current > 180000) { // 3-minute cooldown
      lastSpikeAlertTimeRef.current = now;

      const devName = abnormalDrainAnomaly.device.name;
      const surgeStr = `+${abnormalDrainAnomaly.surgePercent}%`;
      const currentRate = abnormalDrainAnomaly.currentRate;
      const baseline = abnormalDrainAnomaly.baselineRate;
      const hoursLost = abnormalDrainAnomaly.hoursLost;
      const topProcess = abnormalDrainAnomaly.suspectedProcesses[0]?.name || 'Docker Desktop VM';

      const voicePrompt = `Cảnh báo chủ nhân! Hoppi phát hiện tốc độ xả pin của ${devName} đang tăng đột biến bất thường ${surgeStr}, đạt ${currentRate} phần trăm một giờ so với mức chuẩn ${baseline} phần trăm. Tổn thất khoảng ${hoursLost} giờ thời lượng pin. Nhấn Tối Ưu Ngay để Hoppi quét chẩn đoán và đóng tiến trình ngầm ${topProcess}!`;

      if (onTriggerCompletionNotice) {
        onTriggerCompletionNotice({
          id: `abnormal-drain-alert-${Date.now()}`,
          sourceDeviceId: abnormalDrainAnomaly.device.id,
          sourceDeviceName: devName,
          taskTitle: `🚨 Cảnh Báo: Xả Pin Đột Biến Bất Thường (${surgeStr})`,
          summary: `Hoppi AI phát hiện dòng xả pin của ${devName} tăng vọt lên ${currentRate}%/h (${surgeStr} so với mức chuẩn ${baseline}%/h), làm mất ~${hoursLost}h hoạt động. Tiến trình nghi vấn: ${topProcess} và các background threads. Nhấn 'Tối Ưu Ngay' để chẩn đoán và xử lý!`,
          spokenMessage: voicePrompt,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          mood: 'critical',
          metrics: {
            durationMs: 310,
            tokensProcessed: 188,
            syncedDevicesCount: batteryDevices.length,
          },
        });
      } else if (onSpeakText) {
        onSpeakText(voicePrompt);
      }

      setOptimizerNotice(`🚨 Phát hiện xả pin đột biến trên ${abnormalDrainAnomaly.device.shortName} (+${abnormalDrainAnomaly.surgePercent}%)!`);
      setTimeout(() => setOptimizerNotice(null), 5000);
    }
  }, [abnormalDrainAnomaly, abnormalNoticeDismissed, onTriggerCompletionNotice, onSpeakText, batteryDevices.length]);

  // Handlers for Diagnostic Routine
  const handleRunDiagnosticRoutine = () => {
    setIsDiagnosticModalOpen(true);
    setIsDiagnosticRunning(true);
    setDiagnosticProgress(12);
    setDiagnosticStepText('Giai đoạn 1/4: Đang kết nối daemon & quét CPU thread locks...');

    // Clear any prior scheduled steps
    diagnosticTimeoutsRef.current.forEach(clearTimeout);
    diagnosticTimeoutsRef.current = [];

    const nowStr = () => new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    setDiagnosticLogs([
      {
        id: `log-${Date.now()}-1`,
        time: nowStr(),
        text: '⚡ Bắt đầu quy trình Chẩn Đoán AI chuyên sâu (AI Deep Diagnostic Engine v3.8)...',
        type: 'info',
      },
      {
        id: `log-${Date.now()}-2`,
        time: nowStr(),
        text: 'Đang kiểm tra bảng phân bổ nhân CPU M3 Max & số lượng wakeups/giây...',
        type: 'info',
      },
    ]);

    // Phase 2
    const t1 = setTimeout(() => {
      setDiagnosticProgress(42);
      setDiagnosticStepText('Giai đoạn 2/4: Kiểm tra GPU Metal Shaders, Container VM & Network Wake Locks...');
      setDiagnosticLogs((prev) => [
        ...prev,
        {
          id: `log-${Date.now()}-3`,
          time: nowStr(),
          text: 'Phát hiện 1,940 wakeups/giây (chuẩn: <250/giây). Cảnh báo: Nhân P-cores bị giữ wake lock liên tục!',
          type: 'warn',
        },
        {
          id: `log-${Date.now()}-4`,
          time: nowStr(),
          text: 'Đang đo lường mức tiêu thụ dòng điện qua SMC sensor & pin controller...',
          type: 'info',
        },
      ]);
    }, 900);

    // Phase 3
    const t2 = setTimeout(() => {
      setDiagnosticProgress(76);
      setDiagnosticStepText('Giai đoạn 3/4: Đối chiếu gradient tiêu hao pin thực tế với chuẩn baseline...');
      const targetDev = abnormalDrainAnomaly?.device || batteryDevices[0];
      const rate = targetDev.dischargeRatePerHour;
      const baseline = BASELINE_DISCHARGE_RATES[targetDev.id] || 2.2;
      const surge = Math.round(((rate - baseline) / baseline) * 100);
      setDiagnosticLogs((prev) => [
        ...prev,
        {
          id: `log-${Date.now()}-5`,
          time: nowStr(),
          text: `Gradient xả pin đo được: ${rate}%/h vs Baseline chuẩn: ${baseline}%/h (Đột biến: +${surge}%).`,
          type: 'warn',
        },
        {
          id: `log-${Date.now()}-6`,
          time: nowStr(),
          text: 'Đang cô lập tiến trình nền: Docker Hypervisor, Chrome GPU Helper, Spotlight Indexer...',
          type: 'culprit',
        },
      ]);
    }, 1800);

    // Phase 4 - Done
    const t3 = setTimeout(() => {
      setDiagnosticProgress(100);
      setIsDiagnosticRunning(false);
      setDiagnosticStepText('Chẩn đoán hoàn tất! Đã phát hiện và cô lập các tiến trình ngầm gây đột biến.');
      const runningCulpritsCount = smartProcesses.filter((p) => !p.isTerminated && p.priority !== 'critical_work').length;
      setDiagnosticLogs((prev) => [
        ...prev,
        {
          id: `log-${Date.now()}-7`,
          time: nowStr(),
          text: `✅ HOÀN TẤT CHẨN ĐOÁN: Xác định ${runningCulpritsCount} tiến trình ngầm đang làm cạn kiệt pin.`,
          type: 'success',
        },
      ]);

      if (onSpeakText) {
        onSpeakText(
          `Hoppi đã hoàn tất quy trình chẩn đoán! Phát hiện ${runningCulpritsCount} tiến trình ngầm ngốn tài nguyên đang gây xả pin đột biến. Bạn có thể nhấn Đóng Toàn Bộ Tiến Trình để phục hồi lại thời lượng pin.`
        );
      }
    }, 2800);

    diagnosticTimeoutsRef.current = [t1, t2, t3];
  };

  const handleSimulateAbnormalSpike = () => {
    setIsSpikeSimulated(true);
    setAbnormalNoticeDismissed(false);
    // Spike MacBook discharge rate to 7.8%/h and raise CPU load
    setBatteryDevices((prev) =>
      prev.map((dev) =>
        dev.id === 'macbook'
          ? {
              ...dev,
              dischargeRatePerHour: 7.8,
              cpuLoadAvg: 68,
              dischargeHistory60m: [4.1, 4.2, 4.3, 4.6, 5.0, 5.4, 6.1, 6.8, 7.2, 7.5, 7.7, 7.8, 7.8],
            }
          : dev
      )
    );
    setCurrentDevice((prev) => ({
      ...prev,
      cpu: { ...prev.cpu, percent: 68, tempC: 56 },
    }));

    setOptimizerNotice('🧪 Đã kích hoạt mô phỏng: Đột biến xả pin MacBook Pro M3 Max vọt lên 7.8%/h (+254%)!');
    setTimeout(() => setOptimizerNotice(null), 4500);
  };

  const handleRestoreAbnormalSpike = () => {
    setIsSpikeSimulated(false);
    setBatteryDevices((prev) =>
      prev.map((dev) =>
        dev.id === 'macbook'
          ? {
              ...dev,
              dischargeRatePerHour: 2.2,
              cpuLoadAvg: 26,
              dischargeHistory60m: [7.8, 7.5, 6.8, 5.5, 4.4, 3.6, 3.0, 2.6, 2.4, 2.3, 2.2, 2.2, 2.2],
            }
          : dev
      )
    );
    setCurrentDevice((prev) => ({
      ...prev,
      cpu: { ...prev.cpu, percent: 24, tempC: 41 },
    }));
    setOptimizerNotice('🔋 Đã khôi phục tốc độ xả pin MacBook về mức baseline chuẩn (2.2%/h).');
    setTimeout(() => setOptimizerNotice(null), 3500);
  };

  const handleCloseAllDiagnosticCulprits = () => {
    handleTerminateAllSuggested();
    setIsSpikeSimulated(false);
    // Force MacBook discharge rate back down to baseline
    setBatteryDevices((prev) =>
      prev.map((dev) => {
        const baseline = BASELINE_DISCHARGE_RATES[dev.id] || 2.2;
        const currentHist = dev.dischargeHistory60m || [baseline];
        const normalizedHist = [...currentHist.slice(0, -3), baseline + 0.3, baseline + 0.1, baseline];
        return {
          ...dev,
          dischargeRatePerHour: baseline,
          cpuLoadAvg: Math.max(15, Math.round(dev.cpuLoadAvg * 0.45)),
          dischargeHistory60m: normalizedHist,
        };
      })
    );

    const nowStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setDiagnosticLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}-close-all`,
        time: nowStr,
        text: '⚡ Đã dừng toàn bộ tiến trình ngầm gây hao pin! Dòng xả pin trở về baseline 2.2%/h an toàn.',
        type: 'success',
      },
    ]);

    setOptimizerNotice('✅ Tối ưu hoàn tất: Đã đóng toàn bộ tiến trình ngầm, tốc độ xả pin trở về chuẩn an toàn!');
    setTimeout(() => setOptimizerNotice(null), 5000);

    if (onSpeakText) {
      onSpeakText('Hoppi đã đóng toàn bộ tiến trình ngầm thành công. Tốc độ xả pin đã trở về mức chuẩn 2.2% một giờ, bảo vệ an toàn cho thiết bị!');
    }
  };

  // Helper to trigger full Hoppi Completion Notice overlay
  const triggerHoppiNoticeForDevice = (dev: MeshBatteryDevice, threshold: number, isManualTest = false) => {
    const hoursRemaining =
      dev.dischargeRatePerHour > 0 ? (dev.currentBattery / dev.dischargeRatePerHour).toFixed(1) : '99';
    const hoursRemainingInt = Math.floor(Number(hoursRemaining));
    const minutesRemainingInt = Math.round((Number(hoursRemaining) - hoursRemainingInt) * 60);
    const formattedRemaining = `${hoursRemainingInt}h ${minutesRemainingInt}m`;

    const notice: HoppiCompletionNotice = {
      id: `battery-alert-${dev.id}-${Date.now()}`,
      sourceDeviceId: dev.id,
      sourceDeviceName: dev.name,
      taskTitle: isManualTest
        ? `Kiểm Thử Cảnh Báo Pin: ${dev.shortName} (${dev.currentBattery}%)`
        : `Cảnh Báo Pin Yếu: ${dev.shortName} (${dev.currentBattery}%)`,
      summary: `Mức pin của ${dev.name} hiện còn ${dev.currentBattery}%, đã rơi xuống dưới ngưỡng cảnh báo ${threshold}% do bạn thiết lập! Tốc độ xả: -${dev.dischargeRatePerHour}%/h. Dự kiến cạn kiệt trong ${formattedRemaining}.`,
      spokenMessage: `Chủ nhân Nguyễn Thanh Hải ơi, cảnh báo pin yếu! Thiết bị ${dev.name} chỉ còn ${dev.currentBattery}%, đã xuống dưới ngưỡng cảnh báo an toàn ${threshold}% do bạn thiết lập rồi ạ! Xin vui lòng kết nối sạc ngay nhé!`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      mood: 'critical',
      metrics: {
        durationMs: 160,
        tokensProcessed: 95,
        syncedDevicesCount: batteryDevices.length,
      },
    };

    if (onTriggerCompletionNotice) {
      onTriggerCompletionNotice(notice);
    } else if (onSpeakText) {
      onSpeakText(notice.spokenMessage);
    }

    setBatteryNotice(`⚠️ Đã kích hoạt Hoppi Completion Notice cho ${dev.shortName} (${dev.currentBattery}% ≤ Ngưỡng ${threshold}%)`);
    setTimeout(() => setBatteryNotice(null), 6000);
  };

  const handleUpdateThreshold = (newVal: number) => {
    setCustomAlertThreshold(newVal);
    try {
      localStorage.setItem('hoppi_battery_alert_threshold', String(newVal));
    } catch (e) {
      console.error(e);
    }

    // Check if any device is currently below this new threshold
    const droppedDev = batteryDevices.find((d) => d.currentBattery <= newVal);
    if (droppedDev && autoCompletionNoticeEnabled) {
      triggerHoppiNoticeForDevice(droppedDev, newVal);
    } else {
      setBatteryNotice(`⚙️ Đã cập nhật ngưỡng cảnh báo pin Hoppi: ${newVal}%`);
      setTimeout(() => setBatteryNotice(null), 3000);
    }
  };

  // Monitor battery levels against threshold and trigger completion notice when dropping below
  useEffect(() => {
    if (!autoCompletionNoticeEnabled) return;
    const now = Date.now();
    batteryDevices.forEach((dev) => {
      if (dev.currentBattery <= customAlertThreshold) {
        const lastTrigger = lastAlertTimestampRef.current[dev.id] || 0;
        // 3-minute cooldown per device to avoid notice flood
        if (now - lastTrigger > 180000) {
          lastAlertTimestampRef.current[dev.id] = now;
          triggerHoppiNoticeForDevice(dev, customAlertThreshold);
        }
      }
    });
  }, [batteryDevices, customAlertThreshold, autoCompletionNoticeEnabled]);

  // Initial State for Current Device & Home Server
  const [currentDevice, setCurrentDevice] = useState<DeviceMetrics>({
    id: 'current-client',
    name: 'MacBook Pro M3 (Thiết bị này)',
    type: 'current',
    roleLabel: 'Local Client Node',
    ip: '192.168.1.142',
    status: 'online',
    cpu: {
      percent: 24,
      cores: 8,
      tempC: 43,
      history: [18, 22, 20, 28, 25, 23, 29, 24],
    },
    memory: {
      usedGb: 9.2,
      totalGb: 18,
      cacheGb: 3.1,
      percent: 51,
    },
    network: {
      downloadKbps: 1840,
      uploadKbps: 420,
      pingMs: 12,
      adapter: 'Wi-Fi 6E (en0)',
    },
    uptime: '14h 32m',
  });

  const [homeServer, setHomeServer] = useState<DeviceMetrics>({
    id: 'home-server-node',
    name: 'Ubuntu 24.04 (Home Server)',
    type: 'server',
    roleLabel: 'Master Engine & Docker Host',
    ip: '192.168.1.100',
    status: 'online',
    cpu: {
      percent: 36,
      cores: 16,
      tempC: 49,
      history: [30, 34, 42, 38, 45, 36, 40, 36],
    },
    memory: {
      usedGb: 14.8,
      totalGb: 32,
      cacheGb: 7.9,
      percent: 46,
    },
    network: {
      downloadKbps: 5420,
      uploadKbps: 2890,
      pingMs: 4,
      adapter: 'WireGuard (wg0 10GbE)',
    },
    uptime: '28d 06h',
  });

  // Handler to toggle Mesh Power Mode simultaneously across all devices via BroadcastChannel
  const toggleMeshPowerMode = (targetMode?: MeshPowerMode) => {
    const nextMode: MeshPowerMode =
      targetMode || (meshPowerMode === 'high-performance' ? 'battery-saver' : 'high-performance');
    setMeshPowerMode(nextMode);

    try {
      localStorage.setItem('hoppi_mesh_power_mode', nextMode);
    } catch (e) {
      console.error(e);
    }

    // 1. Broadcast simultaneously across BroadcastChannel to all mesh tabs, windows, and devices
    try {
      const channel = new BroadcastChannel('hoppi_device_mesh_channel');
      channel.postMessage({
        type: 'MESH_POWER_MODE_CHANGED',
        mode: nextMode,
        timestamp: Date.now(),
        senderDeviceId: 'macbook-local',
        devicesAffected: ['macbook', 'iphone', 'ipad', 'home-server'],
        rates:
          nextMode === 'battery-saver'
            ? { macbook: 1.8, iphone: 1.2, ipad: 1.1 }
            : { macbook: 4.8, iphone: 3.6, ipad: 2.9 },
      });
      channel.close();
    } catch (e) {
      console.error('BroadcastChannel postMessage error:', e);
    }

    // 2. Simultaneously update all battery devices discharge rates & CPU loads
    setBatteryDevices((prev) =>
      prev.map((dev) => {
        if (nextMode === 'battery-saver') {
          const ecoRates: Record<string, number> = { macbook: 1.8, iphone: 1.2, ipad: 1.1 };
          const ecoCpu: Record<string, number> = { macbook: 16, iphone: 10, ipad: 8 };
          const ecoHistories: Record<string, number[]> = {
            macbook: [4.8, 4.6, 4.2, 3.8, 3.2, 2.8, 2.4, 2.1, 1.9, 1.8, 1.8, 1.8, 1.8],
            iphone: [3.6, 3.4, 3.1, 2.7, 2.3, 2.0, 1.7, 1.5, 1.3, 1.2, 1.2, 1.2, 1.2],
            ipad: [2.9, 2.7, 2.4, 2.1, 1.8, 1.6, 1.4, 1.3, 1.2, 1.1, 1.1, 1.1, 1.1],
          };
          return {
            ...dev,
            dischargeRatePerHour: ecoRates[dev.id] || 1.2,
            cpuLoadAvg: ecoCpu[dev.id] || 12,
            dischargeHistory60m: ecoHistories[dev.id] || [1.8, 1.6, 1.4, 1.2],
          };
        } else {
          const turboRates: Record<string, number> = { macbook: 4.8, iphone: 3.6, ipad: 2.9 };
          const turboCpu: Record<string, number> = { macbook: 38, iphone: 22, ipad: 18 };
          const turboHistories: Record<string, number[]> = {
            macbook: [1.8, 2.2, 2.8, 3.4, 4.1, 4.5, 4.8, 4.9, 4.7, 4.8, 4.8, 4.8, 4.8],
            iphone: [1.2, 1.5, 1.9, 2.4, 3.0, 3.3, 3.5, 3.6, 3.7, 3.6, 3.6, 3.6, 3.6],
            ipad: [1.1, 1.4, 1.8, 2.2, 2.5, 2.8, 2.9, 2.9, 2.8, 2.9, 2.9, 2.9, 2.9],
          };
          return {
            ...dev,
            dischargeRatePerHour: turboRates[dev.id] || 4.0,
            cpuLoadAvg: turboCpu[dev.id] || 25,
            dischargeHistory60m: turboHistories[dev.id] || [4.8, 4.2, 4.8],
          };
        }
      })
    );

    // 3. Simultaneously adjust current client and server node telemetry
    setCurrentDevice((prev) => ({
      ...prev,
      cpu: {
        ...prev.cpu,
        percent: nextMode === 'battery-saver' ? 14 : 34,
        tempC: nextMode === 'battery-saver' ? 38 : 46,
      },
    }));

    setHomeServer((prev) => ({
      ...prev,
      cpu: {
        ...prev.cpu,
        percent: nextMode === 'battery-saver' ? 19 : 42,
        tempC: nextMode === 'battery-saver' ? 44 : 52,
      },
    }));

    // 4. Trigger UI notification notice & Hoppi Completion Notice
    const noticeText =
      nextMode === 'battery-saver'
        ? '🍃 Power Saver [BẬT]: Đã ép toàn bộ thiết bị Mesh giảm tải xuống chế độ năng lượng thấp (-60% xả pin)!'
        : '⚡ Power Saver [TẮT]: Đã khôi phục toàn bộ thiết bị Mesh về chế độ hiệu năng chuẩn (Turbo Mesh)!';
    setBatteryNotice(noticeText);
    setTimeout(() => setBatteryNotice(null), 4500);

    if (onTriggerCompletionNotice && nextMode === 'battery-saver') {
      onTriggerCompletionNotice({
        id: `power-saver-activated-${Date.now()}`,
        sourceDeviceId: 'mesh-gateway',
        sourceDeviceName: 'Mesh Telemetry Gateway',
        taskTitle: '🍃 Power Saver: Ép Toàn Mạng Mesh Sang Chế Độ Năng Lượng Thấp',
        summary: 'Toàn bộ 4 thiết bị Mesh (MacBook Pro M3 Max, iPhone 16 Pro, iPad Pro M2, Home Server) đã được ép đồng thời sang Low-Power Mode qua BroadcastChannel. Tốc độ xả pin giảm hơn 60% và xung nhịp CPU/GPU được tối ưu hóa.',
        spokenMessage: 'Chủ nhân ơi, công tắc Power Saver đã được bật! Hoppi đã đồng bộ ép toàn bộ thiết bị trong mạng Mesh sang chế độ năng lượng thấp Low-Power Mode, giúp kéo dài tối đa thời lượng pin!',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        mood: 'focused',
        metrics: {
          durationMs: 140,
          tokensProcessed: 90,
          syncedDevicesCount: batteryDevices.length,
        },
      });
    }

    // 5. Invoke optional callback
    if (onPowerModeChange) {
      onPowerModeChange(nextMode);
    }

    // 6. Voice announcement in Vietnamese
    if (onSpeakText && (!onTriggerCompletionNotice || nextMode !== 'battery-saver')) {
      const speechText =
        nextMode === 'battery-saver'
          ? 'Chủ nhân ơi, Hoppi đã đồng bộ chuyển toàn bộ thiết bị trong mạng Mesh sang chế độ Tiết kiệm pin Power Saver rồi ạ! Tốc độ xả pin giảm hơn 60%.'
          : 'Hoppi đã tắt Power Saver, chuyển toàn bộ thiết bị trong mạng Mesh sang chế độ Hiệu năng cao Turbo Boost!';
      onSpeakText(speechText);
    }
  };

  // Listen for MESH_POWER_MODE_CHANGED broadcast from other mesh nodes/tabs
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('hoppi_device_mesh_channel');
      channel.onmessage = (event) => {
        if (event.data?.type === 'MESH_POWER_MODE_CHANGED' && event.data.mode) {
          const incomingMode = event.data.mode as MeshPowerMode;
          if (incomingMode === 'battery-saver' || incomingMode === 'high-performance') {
            setMeshPowerMode(incomingMode);
            // Apply simultaneously to all devices without re-broadcasting
            setBatteryDevices((prev) =>
              prev.map((dev) => {
                if (incomingMode === 'battery-saver') {
                  const ecoRates: Record<string, number> = { macbook: 1.8, iphone: 1.2, ipad: 1.1 };
                  const ecoCpu: Record<string, number> = { macbook: 16, iphone: 10, ipad: 8 };
                  return {
                    ...dev,
                    dischargeRatePerHour: ecoRates[dev.id] || 1.2,
                    cpuLoadAvg: ecoCpu[dev.id] || 12,
                  };
                } else {
                  const turboRates: Record<string, number> = { macbook: 4.8, iphone: 3.6, ipad: 2.9 };
                  const turboCpu: Record<string, number> = { macbook: 38, iphone: 22, ipad: 18 };
                  return {
                    ...dev,
                    dischargeRatePerHour: turboRates[dev.id] || 4.0,
                    cpuLoadAvg: turboCpu[dev.id] || 25,
                  };
                }
              })
            );

            setCurrentDevice((prev) => ({
              ...prev,
              cpu: {
                ...prev.cpu,
                percent: incomingMode === 'battery-saver' ? 14 : 34,
                tempC: incomingMode === 'battery-saver' ? 38 : 46,
              },
            }));

            setHomeServer((prev) => ({
              ...prev,
              cpu: {
                ...prev.cpu,
                percent: incomingMode === 'battery-saver' ? 19 : 42,
                tempC: incomingMode === 'battery-saver' ? 44 : 52,
              },
            }));
          }
        }
      };
    } catch (e) {
      console.error('BroadcastChannel listener error in SystemPerformanceWidget:', e);
    }
    return () => {
      try {
        channel?.close();
      } catch (e) {
        console.error(e);
      }
    };
  }, []);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate realistic real-time telemetry fluctuations
  const tickMetrics = () => {
    setCurrentDevice((prev) => {
      const deltaCpu = (Math.random() - 0.48) * 8;
      const newCpu = Math.min(88, Math.max(12, Math.round(prev.cpu.percent + deltaCpu)));
      const newHistory = [...prev.cpu.history.slice(1), newCpu];
      const deltaMem = (Math.random() - 0.5) * 0.2;
      const newUsedGb = Math.min(prev.memory.totalGb - 1, Math.max(4, +(prev.memory.usedGb + deltaMem).toFixed(1)));
      const newMemPercent = Math.round((newUsedGb / prev.memory.totalGb) * 100);
      const newDown = Math.max(300, Math.round(prev.network.downloadKbps + (Math.random() - 0.5) * 600));
      const newUp = Math.max(100, Math.round(prev.network.uploadKbps + (Math.random() - 0.5) * 250));
      const newPing = Math.max(6, Math.min(35, Math.round(prev.network.pingMs + (Math.random() - 0.5) * 3)));

      return {
        ...prev,
        cpu: {
          ...prev.cpu,
          percent: newCpu,
          tempC: Math.min(75, Math.max(38, Math.round(41 + (newCpu / 100) * 16))),
          history: newHistory,
        },
        memory: {
          ...prev.memory,
          usedGb: newUsedGb,
          percent: newMemPercent,
        },
        network: {
          ...prev.network,
          downloadKbps: newDown,
          uploadKbps: newUp,
          pingMs: newPing,
        },
      };
    });

    setHomeServer((prev) => {
      const deltaCpu = (Math.random() - 0.47) * 10;
      const newCpu = Math.min(92, Math.max(18, Math.round(prev.cpu.percent + deltaCpu)));
      const newHistory = [...prev.cpu.history.slice(1), newCpu];
      const deltaMem = (Math.random() - 0.5) * 0.3;
      const newUsedGb = Math.min(prev.memory.totalGb - 2, Math.max(8, +(prev.memory.usedGb + deltaMem).toFixed(1)));
      const newMemPercent = Math.round((newUsedGb / prev.memory.totalGb) * 100);
      const newDown = Math.max(800, Math.round(prev.network.downloadKbps + (Math.random() - 0.48) * 1200));
      const newUp = Math.max(400, Math.round(prev.network.uploadKbps + (Math.random() - 0.48) * 800));
      const newPing = Math.max(2, Math.min(12, Math.round(prev.network.pingMs + (Math.random() - 0.5) * 2)));

      return {
        ...prev,
        cpu: {
          ...prev.cpu,
          percent: newCpu,
          tempC: Math.min(80, Math.max(45, Math.round(47 + (newCpu / 100) * 15))),
          history: newHistory,
        },
        memory: {
          ...prev.memory,
          usedGb: newUsedGb,
          percent: newMemPercent,
        },
        network: {
          ...prev.network,
          downloadKbps: newDown,
          uploadKbps: newUp,
          pingMs: newPing,
        },
      };
    });

    // Subtle real-time oscillation for battery discharge sparkline
    setBatteryDevices((prev) =>
      prev.map((dev) => {
        const jitter = (Math.random() - 0.5) * 0.08;
        const currentHist = dev.dischargeHistory60m || [dev.dischargeRatePerHour];
        const latestPt = +(Math.max(0.5, currentHist[currentHist.length - 1] + jitter)).toFixed(1);
        const updatedHist = [...currentHist.slice(0, -1), latestPt];
        return {
          ...dev,
          dischargeRatePerHour: latestPt,
          dischargeHistory60m: updatedHist,
        };
      })
    );
  };

  useEffect(() => {
    if (isLive) {
      timerRef.current = setInterval(tickMetrics, 2400);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLive]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    tickMetrics();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  // Helper formatters
  const formatSpeed = (kbps: number) => {
    if (kbps >= 1024) {
      return `${(kbps / 1024).toFixed(1)} MB/s`;
    }
    return `${Math.round(kbps)} KB/s`;
  };

  const getLoadColor = (percent: number) => {
    if (percent >= 80) return 'text-rose-500 bg-rose-500';
    if (percent >= 60) return 'text-amber-500 bg-amber-500';
    return 'text-emerald-400 bg-emerald-400';
  };

  const getLoadBarColor = (percent: number) => {
    if (percent >= 80) return 'bg-rose-500';
    if (percent >= 60) return 'bg-amber-500';
    return 'bg-emerald-400';
  };

  // Render SVG Sparkline
  const renderSparkline = (history: number[], strokeColor: string) => {
    const width = 80;
    const height = 24;
    const min = 0;
    const max = 100;
    const step = width / (history.length - 1);

    const points = history
      .map((val, idx) => {
        const x = idx * step;
        const y = height - ((val - min) / (max - min)) * (height - 4) - 2;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  // Mini SVG Sparkline for battery discharge rate over last 60 minutes (compact inline)
  const renderMiniDischargeSparkline = (
    history: number[] = [],
    color: string = '#22d3ee',
    width = 68,
    height = 20
  ) => {
    if (!history || history.length < 2) return null;
    const minVal = Math.max(0.2, Math.min(...history) * 0.88);
    const maxVal = Math.max(minVal + 0.4, Math.max(...history) * 1.12);
    const range = Math.max(0.4, maxVal - minVal);
    const step = width / (history.length - 1);

    const points = history.map((val, idx) => {
      const x = idx * step;
      const y = height - ((val - minVal) / range) * (height - 4) - 2;
      return { x, y, val };
    });

    const pathD = points.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');

    const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;
    const gradId = `spark-grad-${color.replace('#', '')}-${width}`;
    const lastPt = points[points.length - 1];

    return (
      <div
        className="relative group inline-block align-middle cursor-help"
        title={`Xả pin 60 phút qua: Hiện tại ${lastPt.val}%/h (Đáy: ${Math.min(...history)}%/h • Đỉnh: ${Math.max(...history)}%/h)`}
      >
        <svg width={width} height={height} className="overflow-visible block">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <path d={areaD} fill={`url(#${gradId})`} />
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={lastPt.x} cy={lastPt.y} r="2.2" fill={color} />
        </svg>
      </div>
    );
  };

  // Computed metrics for 60-Minute Battery Discharge Sparkline
  const sparkline60mMetrics = useMemo(() => {
    const offsets = [-60, -55, -50, -45, -40, -35, -30, -25, -20, -15, -10, -5, 0];
    const now = new Date();

    let targetHistory: number[] = [];
    let strokeColor = '#f59e0b';
    let deviceName = 'Toàn Mạng Mesh (Trung Bình)';

    if (sparkline60mDevice === 'all') {
      strokeColor = '#f59e0b';
      deviceName = 'Toàn Mạng Mesh (Trung Bình)';
      targetHistory = offsets.map((_, idx) => {
        const sum = batteryDevices.reduce((acc, dev) => {
          const hist = dev.dischargeHistory60m || [dev.dischargeRatePerHour];
          return acc + (hist[idx] ?? dev.dischargeRatePerHour);
        }, 0);
        return +(sum / batteryDevices.length).toFixed(1);
      });
    } else {
      const dev = batteryDevices.find((d) => d.id === sparkline60mDevice) || batteryDevices[0];
      strokeColor = dev.color;
      deviceName = dev.name;
      targetHistory = dev.dischargeHistory60m || [dev.dischargeRatePerHour];
    }

    while (targetHistory.length < 13) {
      targetHistory.unshift(targetHistory[0] || 3.0);
    }
    if (targetHistory.length > 13) {
      targetHistory = targetHistory.slice(-13);
    }

    const currentRate = targetHistory[targetHistory.length - 1];
    const startRate = targetHistory[0];
    const peakRate = Math.max(...targetHistory);
    const peakIdx = targetHistory.indexOf(peakRate);
    const minRate = Math.min(...targetHistory);
    const minIdx = targetHistory.indexOf(minRate);
    const avgRate = +(targetHistory.reduce((a, b) => a + b, 0) / targetHistory.length).toFixed(1);

    const deltaPercent = startRate > 0 ? Math.round(((currentRate - startRate) / startRate) * 100) : 0;
    const isIncreasing = deltaPercent > 0;

    const pointsData = targetHistory.map((val, idx) => {
      const offset = offsets[idx];
      const ptDate = new Date(now.getTime() + offset * 60 * 1000);
      const timeStr = `${String(ptDate.getHours()).padStart(2, '0')}:${String(ptDate.getMinutes()).padStart(2, '0')}`;
      const label = offset === 0 ? 'Hiện tại' : `${offset}m`;
      return {
        idx,
        offset,
        label,
        timeStr,
        rate: val,
        isPeak: idx === peakIdx,
        isMin: idx === minIdx,
      };
    });

    return {
      deviceName,
      strokeColor,
      targetHistory,
      pointsData,
      currentRate,
      startRate,
      peakRate,
      peakTime: pointsData[peakIdx]?.timeStr,
      peakLabel: pointsData[peakIdx]?.label,
      minRate,
      minTime: pointsData[minIdx]?.timeStr,
      minLabel: pointsData[minIdx]?.label,
      avgRate,
      deltaPercent,
      isIncreasing,
    };
  }, [batteryDevices, sparkline60mDevice]);

  // Render interactive 60-Minute Battery Discharge Rate Sparkline Card
  const render60mDischargeSparklineCard = () => {
    const {
      strokeColor,
      targetHistory,
      pointsData,
      currentRate,
      peakRate,
      peakLabel,
      minRate,
      minLabel,
      avgRate,
      deltaPercent,
      isIncreasing,
    } = sparkline60mMetrics;

    const width = 460;
    const height = 80;
    const paddingX = 18;
    const paddingY = 16;
    const chartW = width - paddingX * 2;
    const chartH = height - paddingY * 2;

    const minVal = Math.max(0.4, minRate * 0.85);
    const maxVal = Math.max(minVal + 0.5, peakRate * 1.15);
    const range = maxVal - minVal;
    const step = chartW / (targetHistory.length - 1);

    const coords = pointsData.map((pt) => {
      const x = paddingX + pt.idx * step;
      const y = paddingY + chartH - ((pt.rate - minVal) / range) * chartH;
      return { ...pt, x, y };
    });

    const pathD = coords.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');

    const areaD = `${pathD} L ${paddingX + chartW} ${height - 4} L ${paddingX} ${height - 4} Z`;
    const lastCoord = coords[coords.length - 1];
    const peakCoord = coords.find((c) => c.isPeak) || coords[0];
    const minCoord = coords.find((c) => c.isMin) || coords[0];

    const hoveredCoord = sparklineHoverIdx !== null ? coords[sparklineHoverIdx] : null;

    return (
      <div className="rounded-2xl p-3 bg-gradient-to-br from-slate-950/80 via-slate-900/95 to-slate-950 border border-slate-800 shadow-xl space-y-2.5 backdrop-blur-md">
        {/* Header & Device Switcher */}
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-1.5">
            <TrendingDown size={14} className="text-cyan-400" />
            <span className="font-semibold text-xs text-slate-100">
              Xu Hướng Xả Pin 60 Phút Qua
            </span>
            <span className="font-mono text-[9px] text-cyan-300 px-1.5 py-0.2 rounded bg-cyan-500/15 border border-cyan-500/30">
              60M SPARKLINE
            </span>
          </div>

          {/* Device Tabs for Sparkline */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px]">
            <button
              onClick={() => setSparkline60mDevice('all')}
              className={`px-2 py-0.5 rounded-md font-medium transition-all cursor-pointer ${
                sparkline60mDevice === 'all'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Toàn Mesh
            </button>
            {batteryDevices.map((dev) => (
              <button
                key={dev.id}
                onClick={() => setSparkline60mDevice(dev.id)}
                className={`px-2 py-0.5 rounded-md font-medium transition-all cursor-pointer ${
                  sparkline60mDevice === dev.id
                    ? 'font-bold border shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                style={{
                  backgroundColor: sparkline60mDevice === dev.id ? `${dev.color}25` : undefined,
                  color: sparkline60mDevice === dev.id ? dev.color : undefined,
                  borderColor: sparkline60mDevice === dev.id ? `${dev.color}60` : 'transparent',
                }}
              >
                {dev.shortName}
              </button>
            ))}
          </div>
        </div>

        {/* 4 KPI Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px]">
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-400 font-sans">Hiện tại:</span>
            <span className="font-bold text-xs" style={{ color: strokeColor }}>
              {currentRate}%/h
            </span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-400 font-sans">Đỉnh 60m:</span>
            <span className="font-bold text-xs text-rose-400">
              {peakRate}%/h <span className="text-[9px] text-slate-500 font-sans font-normal">({peakLabel})</span>
            </span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-400 font-sans">Đáy 60m:</span>
            <span className="font-bold text-xs text-emerald-400">
              {minRate}%/h <span className="text-[9px] text-slate-500 font-sans font-normal">({minLabel})</span>
            </span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-400 font-sans">Biến thiên 60m:</span>
            <span className={`font-bold text-xs ${isIncreasing ? 'text-rose-400' : 'text-emerald-400'}`}>
              {isIncreasing ? `+${deltaPercent}%` : `${deltaPercent}%`}
            </span>
          </div>
        </div>

        {/* Interactive SVG Sparkline Chart */}
        <div className="relative pt-1">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-20 overflow-visible select-none"
            onMouseLeave={() => setSparklineHoverIdx(null)}
          >
            <defs>
              <linearGradient id="sparkline-area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity={0.35} />
                <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            {/* Horizontal guide lines */}
            <line
              x1={paddingX}
              y1={paddingY}
              x2={width - paddingX}
              y2={paddingY}
              stroke="rgba(148, 163, 184, 0.12)"
              strokeDasharray="3 3"
            />
            <line
              x1={paddingX}
              y1={height - paddingY}
              x2={width - paddingX}
              y2={height - paddingY}
              stroke="rgba(148, 163, 184, 0.12)"
              strokeDasharray="3 3"
            />

            {/* Area Fill */}
            <path d={areaD} fill="url(#sparkline-area-grad)" />

            {/* Sparkline Stroke */}
            <path
              d={pathD}
              fill="none"
              stroke={strokeColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Peak Rate Dot */}
            <circle cx={peakCoord.x} cy={peakCoord.y} r="3" fill="#f43f5e" stroke="#0f172a" strokeWidth="1.5" />

            {/* Min Rate Dot */}
            <circle cx={minCoord.x} cy={minCoord.y} r="3" fill="#10b981" stroke="#0f172a" strokeWidth="1.5" />

            {/* Current Point (Now) with Animated Pulse */}
            <circle cx={lastCoord.x} cy={lastCoord.y} r="6" fill={strokeColor} opacity="0.3" className="animate-ping" />
            <circle cx={lastCoord.x} cy={lastCoord.y} r="3.5" fill={strokeColor} stroke="#ffffff" strokeWidth="1.5" />

            {/* Hover Vertical Cursor Line */}
            {hoveredCoord && (
              <>
                <line
                  x1={hoveredCoord.x}
                  y1={paddingY}
                  x2={hoveredCoord.x}
                  y2={height - paddingY}
                  stroke={strokeColor}
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
                <circle cx={hoveredCoord.x} cy={hoveredCoord.y} r="4" fill={strokeColor} stroke="#fff" strokeWidth="2" />
              </>
            )}

            {/* Transparent Interactive Hover Hitboxes */}
            {coords.map((pt) => (
              <rect
                key={pt.idx}
                x={pt.x - step / 2}
                y={0}
                width={step}
                height={height}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setSparklineHoverIdx(pt.idx)}
              />
            ))}
          </svg>

          {/* Hover Tooltip Floating Pill */}
          {hoveredCoord && (
            <div
              className="absolute pointer-events-none -top-3.5 transform -translate-x-1/2 px-2 py-0.5 rounded-lg bg-slate-900/95 border border-slate-700 text-[10px] font-mono shadow-xl text-slate-100 flex items-center gap-1.5 whitespace-nowrap z-20"
              style={{ left: `${(hoveredCoord.x / width) * 100}%` }}
            >
              <span className="text-slate-400 font-sans">{hoveredCoord.label} ({hoveredCoord.timeStr}):</span>
              <span className="font-bold" style={{ color: strokeColor }}>{hoveredCoord.rate}%/h</span>
            </div>
          )}

          {/* Time Axis Labels */}
          <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono pt-1 px-3">
            <span>-60m</span>
            <span>-45m</span>
            <span>-30m</span>
            <span>-15m</span>
            <span className="text-cyan-400 font-semibold">Hiện tại (0m)</span>
          </div>
        </div>
      </div>
    );
  };

  // Dynamic predictions for each battery device
  const batteryPredictions = useMemo(() => {
    const now = new Date();
    return batteryDevices.map((dev) => {
      // Hours remaining until 0%
      const hoursToZero = dev.dischargeRatePerHour > 0 ? dev.currentBattery / dev.dischargeRatePerHour : 999;
      // Hours remaining until 20% critical threshold
      const hoursToTwenty =
        dev.dischargeRatePerHour > 0 ? Math.max(0, (dev.currentBattery - 20) / dev.dischargeRatePerHour) : 999;

      // Depletion Date
      const depletionDate = new Date(now.getTime() + hoursToZero * 3600 * 1000);
      const chargeDeadlineDate = new Date(now.getTime() + hoursToTwenty * 3600 * 1000);

      const hoursInt = Math.floor(hoursToZero);
      const minutesInt = Math.round((hoursToZero - hoursInt) * 60);

      const hours20Int = Math.floor(hoursToTwenty);
      const minutes20Int = Math.round((hoursToTwenty - hours20Int) * 60);

      const isCritical = dev.currentBattery <= 20 || hoursToZero <= 5;
      const isWarning = !isCritical && (dev.currentBattery <= 40 || hoursToZero <= 10);

      const formatClockTime = (d: Date) => {
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        const isNextDay = d.getDate() !== now.getDate();
        return `${hh}:${mm}${isNextDay ? ' (+1 ngày)' : ''}`;
      };

      return {
        ...dev,
        hoursToZero,
        hoursToTwenty,
        hoursInt,
        minutesInt,
        formattedRemaining: `${hoursInt}h ${minutesInt}m`,
        formattedRemainingTo20: `${hours20Int}h ${minutes20Int}m`,
        depletionTimeStr: formatClockTime(depletionDate),
        chargeDeadlineStr: formatClockTime(chargeDeadlineDate),
        isCritical,
        isWarning,
      };
    });
  }, [batteryDevices]);

  // Generate 24h past telemetry points + forward predictions
  const batteryChartData = useMemo(() => {
    // 24h past points at intervals: -24h, -20h, -16h, -12h, -8h, -4h, -2h, 0h (Hiện tại)
    const pastOffsets = [-24, -20, -16, -12, -8, -4, -2, 0];
    // Future predictions at intervals: +2h, +4h, +6h, +8h, +12h, +16h, +20h, +24h
    const futureOffsets = [2, 4, 6, 8, 12, 16, 20, 24];

    const points: Array<Record<string, any>> = [];

    // History points
    pastOffsets.forEach((offset) => {
      const label = offset === 0 ? 'Hiện tại' : `${offset}h`;
      const isNow = offset === 0;

      const pt: Record<string, any> = {
        time: label,
        offsetHours: offset,
        isFuture: false,
        isNow,
      };

      batteryDevices.forEach((dev) => {
        // Historical battery calculated back in time + slight realistic wave
        const rawHistorical = dev.currentBattery + dev.dischargeRatePerHour * Math.abs(offset) * 0.96;
        const bounded = Math.min(100, Math.max(10, Math.round(rawHistorical)));
        pt[dev.id] = bounded;

        // At t=0 (Hiện tại), also assign to predicted line so the solid & dashed lines connect seamlessly!
        if (isNow) {
          pt[`${dev.id}Predicted`] = dev.currentBattery;
        }
      });

      points.push(pt);
    });

    // Future points
    futureOffsets.forEach((offset) => {
      const label = `+${offset}h`;
      const pt: Record<string, any> = {
        time: label,
        offsetHours: offset,
        isFuture: true,
        isNow: false,
      };

      batteryDevices.forEach((dev) => {
        // Discharge forward down to 0%
        const pred = Math.max(0, Math.round(dev.currentBattery - dev.dischargeRatePerHour * offset));
        pt[`${dev.id}Predicted`] = pred;
      });

      points.push(pt);
    });

    return points;
  }, [batteryDevices]);

  const handleTriggerChargeAlert = (devId: string) => {
    const target = batteryPredictions.find((d) => d.id === devId);
    if (!target) return;

    const message = `Cảnh báo năng lượng: ${target.name} còn ${target.currentBattery}%, tốc độ xả ${target.dischargeRatePerHour}% mỗi giờ. Dự kiến cạn kiệt lúc ${target.depletionTimeStr} (còn ${target.formattedRemaining}). Vui lòng cắm sạc trước ${target.chargeDeadlineStr}.`;

    setBatteryNotice(`🔔 Đã phát cảnh báo sạc cho ${target.shortName} (Dự kiến cạn: ${target.depletionTimeStr})`);
    if (onSpeakText) {
      onSpeakText(message);
    }
    setTimeout(() => {
      setBatteryNotice(null);
    }, 6000);
  };

  const toggleDeviceVisibility = (id: string) => {
    setVisibleDevices((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSimulateDrainStep = () => {
    setBatteryDevices((prev) =>
      prev.map((d) => ({
        ...d,
        currentBattery: Math.max(8, d.currentBattery - 3),
      }))
    );
    setBatteryNotice('⚡ Đã mô phỏng xả pin nhanh (-3%) trên toàn bộ Mesh');
    setTimeout(() => setBatteryNotice(null), 3000);
  };

  const handleSimulateRecharge = (id: string) => {
    setBatteryDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, currentBattery: Math.min(100, d.currentBattery + 25) } : d))
    );
    const dev = batteryDevices.find((d) => d.id === id);
    setBatteryNotice(`🔌 Đã cắm sạc mô phỏng cho ${dev?.shortName || id} (+25%)`);
    setTimeout(() => setBatteryNotice(null), 3500);
  };

  // Radial Bar Chart: Total Power Consumption Distribution across all Mesh Devices
  const meshPowerDistribution = useMemo(() => {
    // 1. Devices in the Mesh Network:
    // MacBook Pro M3 Max
    const macbookDev = batteryDevices.find((d) => d.id === 'macbook');
    const macbookDrain = macbookDev?.dischargeRatePerHour || 4.8;
    // Estimated watts: baseline 14W + CPU load factor + drain factor
    const macbookWatts = +(14 + (currentDevice.cpu.percent / 100) * 32 + (macbookDrain / 5) * 12).toFixed(1);

    // Ubuntu Home Server (AC Mains plugged, high compute)
    const serverWatts = +(38 + (homeServer.cpu.percent / 100) * 45).toFixed(1);

    // iPhone 16 Pro Max
    const iphoneDev = batteryDevices.find((d) => d.id === 'iphone');
    const iphoneDrain = iphoneDev?.dischargeRatePerHour || 3.6;
    const iphoneWatts = +(3.5 + (iphoneDrain / 4) * 6.5).toFixed(1);

    // iPad Pro M2
    const ipadDev = batteryDevices.find((d) => d.id === 'ipad');
    const ipadDrain = ipadDev?.dischargeRatePerHour || 2.9;
    const ipadWatts = +(5.0 + (ipadDrain / 3.5) * 9.5).toFixed(1);

    // Wi-Fi 6E Gateway (Core network router)
    const gatewayWatts = 16.5;

    // Hoppi IoT Sensor Hub
    const iotHubWatts = 6.2;

    const allDevicesList = [
      {
        id: 'home-server',
        name: 'Ubuntu Home Server',
        shortName: 'Home Server',
        role: 'Master Engine & Docker Host',
        category: 'Server / AC',
        watts: serverWatts,
        drainRate: 0,
        batteryLevel: 100,
        isBatteryPowered: false,
        fill: '#f59e0b', // Amber
        stroke: '#d97706',
        iconType: 'server' as const,
        efficiencyRating: 'Tải Tính Toán Cao (Compute Heavy)',
        advice: 'Tối ưu container Docker nền hoặc lên lịch cronjob vào ban đêm',
      },
      {
        id: 'macbook',
        name: 'MacBook Pro M3 Max',
        shortName: 'MacBook Pro M3',
        role: 'Active Client & Dev Lab',
        category: 'Laptop / Pin',
        watts: macbookWatts,
        drainRate: macbookDrain,
        batteryLevel: macbookDev?.currentBattery || 78,
        isBatteryPowered: true,
        fill: '#06b6d4', // Cyan
        stroke: '#0891b2',
        iconType: 'desktop' as const,
        efficiencyRating: macbookDrain > 4.0 ? 'Tiêu Hao Nhanh (High Drain)' : 'Cân Bằng Tiết Kiệm',
        advice: 'Đóng các helper tab Chrome ngầm & simulator qua Smart Optimizer',
      },
      {
        id: 'gateway',
        name: 'Wi-Fi 6E Gateway Router',
        shortName: 'Mesh Router 6E',
        role: 'Core Network AP (Tri-Band)',
        category: 'Mạng / AC',
        watts: gatewayWatts,
        drainRate: 0,
        batteryLevel: 100,
        isBatteryPowered: false,
        fill: '#3b82f6', // Blue
        stroke: '#2563eb',
        iconType: 'router' as const,
        efficiencyRating: 'Ổn Định 24/7',
        advice: 'Điều chỉnh beamforming tự động để giảm công suất phát thừa',
      },
      {
        id: 'ipad',
        name: 'iPad Pro M2',
        shortName: 'iPad Pro M2',
        role: 'Sidecar & Smart Display',
        category: 'Tablet / Pin',
        watts: ipadWatts,
        drainRate: ipadDrain,
        batteryLevel: ipadDev?.currentBattery || 58,
        isBatteryPowered: true,
        fill: '#a855f7', // Purple
        stroke: '#9333ea',
        iconType: 'tablet' as const,
        efficiencyRating: 'Trung Bình',
        advice: 'Giảm độ sáng màn hình ProMotion xuống 60Hz khi không xem media',
      },
      {
        id: 'iphone',
        name: 'iPhone 16 Pro Max',
        shortName: 'iPhone 16 Pro',
        role: 'Mobile Mesh Node',
        category: 'Mobile / Pin',
        watts: iphoneWatts,
        drainRate: iphoneDrain,
        batteryLevel: iphoneDev?.currentBattery || 32,
        isBatteryPowered: true,
        fill: '#fb7185', // Rose
        stroke: '#e11d48',
        iconType: 'mobile' as const,
        efficiencyRating: iphoneDrain > 3.0 ? 'Tiêu Hao Nhanh' : 'Tiết Kiệm',
        advice: 'Bật chế độ Low Power Mode hoặc tắt 5G Standalone khi ở vùng Wi-Fi mạnh',
      },
      {
        id: 'iot-hub',
        name: 'Hoppi IoT Sensor Hub',
        shortName: 'IoT Hub Node',
        role: 'Zigbee Sensor Mesh Bridge',
        category: 'IoT / Pin',
        watts: iotHubWatts,
        drainRate: 0.8,
        batteryLevel: 94,
        isBatteryPowered: true,
        fill: '#10b981', // Emerald
        stroke: '#059669',
        iconType: 'iot' as const,
        efficiencyRating: 'Siêu Tiết Kiệm (Eco)',
        advice: 'Tần suất gửi telemetry cảm biến hiện tối ưu ở chu kỳ 10 giây',
      },
    ];

    const activeList =
      radialPowerDeviceFilter === 'battery'
        ? allDevicesList.filter((d) => d.isBatteryPowered)
        : allDevicesList;

    const totalWatts = +activeList.reduce((acc, d) => acc + d.watts, 0).toFixed(1);
    const totalDrainRate = +batteryDevices.reduce((acc, d) => acc + d.dischargeRatePerHour, 0).toFixed(1);

    // Compute percent share of power
    const listWithShare = activeList.map((d) => {
      const share = +((d.watts / (totalWatts || 1)) * 100).toFixed(1);
      return {
        ...d,
        percentShare: share,
        radialValue: share,
      };
    });

    // Sorted descending by power draw
    const sortedByPower = [...listWithShare].sort((a, b) => b.watts - a.watts);
    const mostPowerHungryDevice = sortedByPower[0] || allDevicesList[0];
    const secondPowerHungry = sortedByPower[1] || allDevicesList[1];

    // For battery devices only
    const batteryOnly = listWithShare.filter((d) => d.isBatteryPowered);
    const mostBatteryDraining = [...batteryOnly].sort((a, b) => b.drainRate - a.drainRate)[0] || allDevicesList[1];

    return {
      allDevicesList,
      displayList: sortedByPower,
      mostPowerHungryDevice,
      secondPowerHungry,
      mostBatteryDraining,
      totalWatts,
      totalDrainRate,
    };
  }, [batteryDevices, currentDevice.cpu.percent, homeServer.cpu.percent, radialPowerDeviceFilter]);

  const getDeviceIcon = (type: 'desktop' | 'mobile' | 'tablet') => {
    switch (type) {
      case 'desktop':
        return <Laptop size={14} className="text-cyan-400" />;
      case 'mobile':
        return <Smartphone size={14} className="text-rose-400" />;
      case 'tablet':
        return <Tablet size={14} className="text-purple-400" />;
    }
  };

  const getBatteryIcon = (percent: number) => {
    if (percent <= 20) return <BatteryLow size={14} className="text-rose-400" />;
    if (percent <= 55) return <BatteryMedium size={14} className="text-amber-400" />;
    return <BatteryFull size={14} className="text-emerald-400" />;
  };

  // Custom Tooltip for Battery Recharts Chart
  const CustomBatteryTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const isFuture = typeof label === 'string' && label.startsWith('+');
    const isNow = label === 'Hiện tại';

    return (
      <div className="p-2.5 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl text-[11px] space-y-1.5 backdrop-blur-md min-w-[170px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 gap-2">
          <span className="font-semibold text-slate-200">
            {isNow ? 'Mốc Hiện Tại (T=0)' : isFuture ? `Dự báo tương lai: ${label}` : `Lịch sử đo: ${label}`}
          </span>
          <span
            className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-medium ${
              isFuture
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : isNow
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'bg-slate-700/40 text-slate-400 border border-slate-600/30'
            }`}
          >
            {isFuture ? 'AI Forecast' : isNow ? 'Live 0h' : 'Telemetry'}
          </span>
        </div>
        <div className="space-y-1">
          {payload.map((item: any) => {
            if (item.value === undefined || item.value === null) return null;
            return (
              <div key={item.dataKey} className="flex items-center justify-between gap-3 text-slate-300">
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.stroke || item.color }}
                  />
                  <span className="truncate">{item.name}:</span>
                </div>
                <span className="font-mono font-bold text-white flex-shrink-0">{item.value}%</span>
              </div>
            );
          })}
        </div>
        {isFuture && (
          <div className="pt-1 border-t border-slate-800/80 text-[10px] text-amber-300/80 flex items-center gap-1">
            <Clock size={10} />
            <span>Tính theo tốc độ xả thực tế</span>
          </div>
        )}
      </div>
    );
  };

  // Custom Tooltip for Radial Bar Chart Power Distribution
  const CustomRadialPowerTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0]?.payload;
    if (!data) return null;

    return (
      <div className="p-2.5 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl text-[11px] space-y-1.5 backdrop-blur-md min-w-[210px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 gap-2">
          <span className="font-semibold text-slate-100 flex items-center gap-1.5 truncate">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: data.fill }} />
            <span className="truncate">{data.name}</span>
          </span>
          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-slate-800 text-slate-300 flex-shrink-0">
            {data.category}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-0.5">
          <div className="p-1 rounded bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-400 block text-[9px]">Công suất tải:</span>
            <span className="font-bold text-amber-300 text-xs">{data.watts} W</span>
          </div>
          <div className="p-1 rounded bg-slate-950/60 border border-slate-800/80">
            <span className="text-slate-400 block text-[9px]">Tỷ trọng Mesh:</span>
            <span className="font-bold text-cyan-300 text-xs">{data.percentShare}%</span>
          </div>
        </div>

        {data.isBatteryPowered ? (
          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 flex items-center justify-between font-mono">
            <span>Tốc độ xả: <strong className="text-rose-400">-{data.drainRate}%/h</strong></span>
            <span>Mức pin: <strong className="text-emerald-400">{data.batteryLevel}%</strong></span>
          </div>
        ) : (
          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 flex items-center justify-between font-mono">
            <span className="text-cyan-400">Nguồn AC trực tiếp 220V</span>
            <span className="text-slate-300">24/7 Core</span>
          </div>
        )}

        <div className="text-[9px] text-slate-400 italic pt-0.5 border-t border-slate-800/60">
          💡 <span className="text-slate-300">{data.advice}</span>
        </div>
      </div>
    );
  };

  // Real-time Traffic Ratio: Internal App Traffic vs Mesh IoT Traffic for Congestion Analysis
  const realTimeTrafficMetrics = useMemo(() => {
    const clientKbps = currentDevice.network.downloadKbps + currentDevice.network.uploadKbps;
    const serverKbps = homeServer.network.downloadKbps + homeServer.network.uploadKbps;

    // Internal App Traffic: API sync, WebSockets, Vite HMR, Sidecar display stream, Docker IPC
    const appKbps = Math.round(clientKbps * 0.68 + serverKbps * 0.32);

    // Mesh IoT Traffic: Zigbee sensor telemetry, MQTT bursts, BLE beacons, Gateway routing
    const iotKbps = Math.round(380 + clientKbps * 0.16 + serverKbps * 0.18);

    const totalKbps = Math.max(1, appKbps + iotKbps);
    const appPercent = Math.min(95, Math.max(5, Math.round((appKbps / totalKbps) * 100)));
    const iotPercent = 100 - appPercent;

    const appMbps = (appKbps / 1024).toFixed(2);
    const iotMbps = (iotKbps / 1024).toFixed(2);
    const totalMbps = (totalKbps / 1024).toFixed(2);

    let congestionStatus: 'normal' | 'app_heavy' | 'iot_heavy' = 'normal';
    let congestionLabel = 'Kênh Truyền Ổn Định';
    let congestionBadgeClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    let congestionMessage = 'Tỷ lệ lưu lượng phân bổ tối ưu, không có dấu hiệu nghẽn cổ chai giữa App nội bộ và mạng IoT.';

    if (appPercent >= 72) {
      congestionStatus = 'app_heavy';
      congestionLabel = 'Cảnh Báo Nghẽn: App Nội Bộ';
      congestionBadgeClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      congestionMessage = `Nguồn nghẽn: App nội bộ (${appMbps} MB/s, ${appPercent}%) đang chiếm ưu thế do stream Sidecar và Docker container IPC.`;
    } else if (iotPercent >= 48) {
      congestionStatus = 'iot_heavy';
      congestionLabel = 'Cảnh Báo Nghẽn: Mesh IoT';
      congestionBadgeClass = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      congestionMessage = `Nguồn nghẽn: Lưu lượng Mesh IoT (${iotMbps} MB/s, ${iotPercent}%) tăng cao do chu kỳ burst cảm biến Zigbee và beacon Mesh.`;
    }

    return {
      appKbps,
      iotKbps,
      totalKbps,
      appPercent,
      iotPercent,
      appMbps,
      iotMbps,
      totalMbps,
      congestionStatus,
      congestionLabel,
      congestionBadgeClass,
      congestionMessage,
    };
  }, [
    currentDevice.network.downloadKbps,
    currentDevice.network.uploadKbps,
    homeServer.network.downloadKbps,
    homeServer.network.uploadKbps,
  ]);

  const renderRadialPowerDistributionSection = () => {
    const {
      displayList,
      mostPowerHungryDevice,
      totalWatts,
      mostBatteryDraining,
    } = meshPowerDistribution;

    return (
      <div className="p-3.5 rounded-2xl bg-slate-950/85 border border-slate-800/90 shadow-xl space-y-3.5 backdrop-blur-md">
        {/* Top Highlight Banner: Identify the most 'power-hungry' device in the network at a glance */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-rose-950/40 border border-amber-500/50 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between flex-wrap gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/25 to-rose-500/25 border border-amber-500/50 text-amber-300 shadow-md">
                <Flame size={18} className="animate-pulse text-amber-400" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-amber-100 flex items-center gap-1.5">
                    <span>THIẾT BỊ NGỐN ĐIỆN NHẤT MẠNG:</span>
                    <span className="text-amber-300 underline underline-offset-2">{mostPowerHungryDevice.name}</span>
                  </span>
                  <span className="px-2 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] tracking-wide uppercase">
                    #1 POWER HUNGRY
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  Đang tiêu thụ <strong className="text-amber-300 font-mono font-bold">{mostPowerHungryDevice.watts} Watts</strong>, 
                  chiếm tới <strong className="text-rose-400 font-mono font-bold">{mostPowerHungryDevice.percentShare}%</strong> tổng tải điện năng toàn bộ mạng Mesh ({totalWatts}W).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsSmartOptimizerOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/25 to-rose-500/25 hover:from-amber-500/40 hover:to-rose-500/40 border border-amber-500/50 text-amber-200 text-[10px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="Mở Smart Power Optimizer để giảm tải ứng dụng ngầm"
              >
                <Zap size={11} className="text-amber-400 fill-amber-400/40" />
                <span>Tối Ưu Ngay</span>
              </button>
            </div>
          </div>
        </div>

        {/* Controls: Mode Switcher & Filter */}
        <div className="flex items-center justify-between gap-2 flex-wrap pb-1 border-b border-slate-800/80 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Bộ lọc thiết bị:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setRadialPowerDeviceFilter('all')}
                className={`px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
                  radialPowerDeviceFilter === 'all'
                    ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/50 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                Tất cả thiết bị Mesh ({meshPowerDistribution.allDevicesList.length})
              </button>
              <button
                onClick={() => setRadialPowerDeviceFilter('battery')}
                className={`px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
                  radialPowerDeviceFilter === 'battery'
                    ? 'bg-amber-500/20 text-amber-200 border-amber-500/50 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                Chỉ thiết bị dùng pin (Battery)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-mono">
              Tổng công suất: <strong className="text-amber-300">{totalWatts} W</strong>
            </span>
            <button
              onClick={() => {
                if (onSpeakText) {
                  onSpeakText(
                    `Hoppi báo cáo phân bổ điện năng mạng Mesh: Thiết bị ngốn điện nhất là ${mostPowerHungryDevice.name} với công suất ${mostPowerHungryDevice.watts} Watts, chiếm ${mostPowerHungryDevice.percentShare}% toàn mạng. Thiết bị dùng pin xả nhanh nhất là ${mostBatteryDraining.name} với tốc độ âm ${mostBatteryDraining.drainRate}% một giờ.`
                  );
                }
              }}
              className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-[10px]"
              title="Nghe Hoppi đọc báo cáo phân bổ năng lượng"
            >
              <Radio size={10} className="text-cyan-400 animate-pulse" />
              <span>Đọc báo cáo</span>
            </button>
          </div>
        </div>

        {/* Main Visualization: RadialBarChart + Centered HUD + Device Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
          {/* RADIAL BAR CHART CONTAINER */}
          <div className="md:col-span-6 relative flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-full h-[270px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="24%"
                  outerRadius="96%"
                  barSize={11}
                  data={displayList}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar
                    background={{ fill: '#1e293b', opacity: 0.25 }}
                    dataKey="percentShare"
                    cornerRadius={6}
                  >
                    {displayList.map((entry, index) => (
                      <Cell
                        key={`radial-cell-${entry.id}-${index}`}
                        fill={entry.fill}
                        stroke={selectedRadialDeviceNode === entry.id ? '#ffffff' : entry.stroke}
                        strokeWidth={selectedRadialDeviceNode === entry.id ? 2 : 0}
                        className="cursor-pointer transition-opacity hover:opacity-80"
                        onClick={() => setSelectedRadialDeviceNode(entry.id === selectedRadialDeviceNode ? null : entry.id)}
                      />
                    ))}
                  </RadialBar>
                  <Tooltip content={<CustomRadialPowerTooltip />} />
                </RadialBarChart>
              </ResponsiveContainer>

              {/* Centered Donut HUD */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none text-center select-none">
                <Flame size={15} className="text-amber-400 animate-pulse mb-0.5" />
                <span className="font-mono text-base font-black text-white leading-tight">
                  {totalWatts} W
                </span>
                <span className="text-[9px] text-slate-400 font-medium">
                  Tổng Tải Mesh
                </span>
              </div>
            </div>

            <div className="text-[9px] text-slate-500 font-mono text-center pt-1">
              *Độ dài cung tròn biểu thị tỷ lệ % điện năng chiếm dụng toàn mạng
            </div>

            {/* Small Horizontal Segmented Bar Chart: Real-time ratio of Internal App Traffic vs Mesh IoT Traffic */}
            <div className="w-full mt-2.5 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/90 shadow-md space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                  <Activity size={12} className="text-cyan-400" />
                  <span>Tỷ Lệ Băng Thông Thực (Traffic Ratio)</span>
                </div>
                <span className={`px-2 py-0.2 rounded-full font-mono text-[9px] font-bold border flex items-center gap-1 ${realTimeTrafficMetrics.congestionBadgeClass}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${realTimeTrafficMetrics.congestionStatus === 'normal' ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`} />
                  <span>{realTimeTrafficMetrics.congestionLabel}</span>
                </span>
              </div>

              {/* Horizontal Segmented Bar */}
              <div className="space-y-1">
                <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800/80 overflow-hidden flex p-0.5 gap-0.5">
                  {/* Segment 1: Internal App Traffic */}
                  <motion.div
                    className="h-full rounded-l-full bg-gradient-to-r from-cyan-500 to-blue-500 relative group cursor-pointer"
                    style={{ width: `${realTimeTrafficMetrics.appPercent}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${realTimeTrafficMetrics.appPercent}%` }}
                    transition={{ duration: 0.4 }}
                    title={`Internal App Traffic: ${realTimeTrafficMetrics.appPercent}% (${realTimeTrafficMetrics.appMbps} MB/s)`}
                  />

                  {/* Segment 2: Mesh IoT Traffic */}
                  <motion.div
                    className="h-full rounded-r-full bg-gradient-to-r from-emerald-500 to-teal-400 relative group cursor-pointer"
                    style={{ width: `${realTimeTrafficMetrics.iotPercent}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${realTimeTrafficMetrics.iotPercent}%` }}
                    transition={{ duration: 0.4 }}
                    title={`Mesh IoT Traffic: ${realTimeTrafficMetrics.iotPercent}% (${realTimeTrafficMetrics.iotMbps} MB/s)`}
                  />
                </div>

                {/* Sub-Legend with Percentages, Data Rates & Sub-Breakdown */}
                <div className="flex items-center justify-between text-[9px] font-mono pt-0.5">
                  <div className="flex items-center gap-1.5 text-cyan-300">
                    <span className="w-2 h-2 rounded-sm bg-cyan-500 flex-shrink-0" />
                    <span className="font-semibold">App Nội Bộ: {realTimeTrafficMetrics.appPercent}%</span>
                    <span className="text-slate-400">({realTimeTrafficMetrics.appMbps} MB/s)</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-emerald-300">
                    <span className="w-2 h-2 rounded-sm bg-emerald-500 flex-shrink-0" />
                    <span className="font-semibold">Mesh IoT: {realTimeTrafficMetrics.iotPercent}%</span>
                    <span className="text-slate-400">({realTimeTrafficMetrics.iotMbps} MB/s)</span>
                  </div>
                </div>
              </div>

              {/* Congestion Diagnostic Hint */}
              <div className="text-[9px] text-slate-400 leading-tight flex items-start gap-1 pt-1.5 border-t border-slate-800/70">
                <span className="text-amber-400 font-bold flex-shrink-0">💡 Chẩn đoán nghẽn:</span>
                <span className="text-slate-300">{realTimeTrafficMetrics.congestionMessage}</span>
              </div>
            </div>
          </div>

          {/* DEVICE RANKING BREAKDOWN LIST */}
          <div className="md:col-span-6 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-800/80 font-medium">
              <span>Bảng Xếp Hạng Tiêu Thụ Điện Năng</span>
              <span>Tỷ trọng (%)</span>
            </div>

            <div className="space-y-1.5 max-h-[285px] overflow-y-auto pr-0.5">
              {displayList.map((dev, index) => {
                const isSelected = selectedRadialDeviceNode === dev.id;
                const isTop1 = index === 0;

                return (
                  <div
                    key={dev.id}
                    onClick={() => setSelectedRadialDeviceNode(isSelected ? null : dev.id)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-slate-800/90 border-cyan-500/80 shadow-md'
                        : isTop1
                        ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-500/70 shadow-sm'
                        : 'bg-slate-900/60 border-slate-800/70 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <span
                          className={`w-4 h-4 rounded-md text-[9px] font-mono font-bold flex items-center justify-center ${
                            isTop1
                              ? 'bg-amber-500 text-slate-950 font-black'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          #{index + 1}
                        </span>
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: dev.fill }}
                        />
                        <span className="font-semibold text-slate-200 text-xs truncate">
                          {dev.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-xs flex-shrink-0">
                        <span className="font-bold text-amber-300">{dev.watts} W</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800/80 text-cyan-300 border border-slate-700/80 font-bold">
                          {dev.percentShare}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar reflecting share */}
                    <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: dev.fill }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, dev.percentShare * 1.8)}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                      <span>{dev.category}</span>
                      {dev.isBatteryPowered ? (
                        <span className="text-rose-400">
                          Xả: -{dev.drainRate}%/h (Pin: {dev.batteryLevel}%)
                        </span>
                      ) : (
                        <span className="text-slate-500">Cắm nguồn trực tiếp AC</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Device Heat Map: Relative Power Consumption Levels & Hottest Device Detection
  const deviceHeatMapData = useMemo(() => {
    const { allDevicesList, totalWatts } = meshPowerDistribution;
    const maxWatts = Math.max(...allDevicesList.map((d) => d.watts), 1);

    const enrichedList = allDevicesList.map((dev) => {
      // Relative heat score normalized against peak device in mesh (0 to 100)
      const relativeHeatScore = Math.min(100, Math.round((dev.watts / maxWatts) * 100));
      const percentShare = +((dev.watts / (totalWatts || 1)) * 100).toFixed(1);

      let thermalLevel: 'extreme' | 'high' | 'moderate' | 'cool' = 'cool';
      let thermalLabel = 'Mát / Tiết Kiệm';
      let thermalBadgeClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      let cardBgGradient = 'from-emerald-950/25 via-slate-900/85 to-slate-950/95';
      let cardBorderClass = 'border-emerald-500/35 hover:border-emerald-500/60';
      let heatBarGrad = 'from-emerald-500 to-teal-400';
      let textColor = 'text-emerald-400';
      let glowClass = 'shadow-emerald-950/20';

      if (relativeHeatScore >= 75) {
        thermalLevel = 'extreme';
        thermalLabel = 'Cực Đại / Đỉnh Tải';
        thermalBadgeClass = 'bg-rose-500/25 text-rose-300 border-rose-500/60 animate-pulse';
        cardBgGradient = 'from-rose-950/45 via-slate-900/90 to-amber-950/30';
        cardBorderClass = 'border-rose-500/70 hover:border-rose-400 shadow-rose-950/40';
        heatBarGrad = 'from-amber-400 via-rose-500 to-rose-600';
        textColor = 'text-rose-400';
        glowClass = 'shadow-rose-950/50 shadow-lg';
      } else if (relativeHeatScore >= 50) {
        thermalLevel = 'high';
        thermalLabel = 'Tải Cao';
        thermalBadgeClass = 'bg-orange-500/20 text-orange-300 border-orange-500/50';
        cardBgGradient = 'from-amber-950/35 via-slate-900/85 to-orange-950/20';
        cardBorderClass = 'border-orange-500/50 hover:border-orange-400';
        heatBarGrad = 'from-amber-400 to-orange-500';
        textColor = 'text-orange-400';
        glowClass = 'shadow-orange-950/30 shadow-md';
      } else if (relativeHeatScore >= 25) {
        thermalLevel = 'moderate';
        thermalLabel = 'Trung Bình';
        thermalBadgeClass = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
        cardBgGradient = 'from-cyan-950/25 via-slate-900/85 to-slate-950/95';
        cardBorderClass = 'border-cyan-500/35 hover:border-cyan-500/60';
        heatBarGrad = 'from-cyan-500 to-blue-500';
        textColor = 'text-cyan-400';
        glowClass = 'shadow-cyan-950/20';
      }

      let location = 'Phòng Khách';
      let cpuLoadStr = '24%';
      let hardwareSpecs = 'ARM / Low Power';
      let activeWorkload = 'Background polling & telemetry sync';

      if (dev.id === 'home-server') {
        location = 'Tủ Rack Kỹ Thuật (Phòng Server)';
        cpuLoadStr = `${homeServer.cpu.percent}%`;
        hardwareSpecs = 'Intel Xeon / 64GB RAM / AC 220V';
        activeWorkload = '12 Docker Containers, PostgreSQL Master, Ollama LLM Engine';
      } else if (dev.id === 'macbook') {
        location = 'Bàn Làm Việc Chính (Studio)';
        cpuLoadStr = `${currentDevice.cpu.percent}%`;
        hardwareSpecs = 'Apple M3 Max (16-Core) / 64GB Unified';
        activeWorkload = 'VS Code IDE, Vite HMR Server, Chrome Metal Renderer, Hoppi Engine';
      } else if (dev.id === 'gateway') {
        location = 'Hành Lang Trung Tâm';
        cpuLoadStr = '18%';
        hardwareSpecs = 'Quad-Core 2.2GHz / 2GB RAM / Wi-Fi 6E';
        activeWorkload = 'Tri-band Beamforming, NAT Firewall, Mesh Backhaul Switch';
      } else if (dev.id === 'ipad') {
        location = 'Bàn Cạnh MacBook';
        cpuLoadStr = '32%';
        hardwareSpecs = 'Apple M2 / Liquid Retina XDR';
        activeWorkload = 'Sidecar 2nd Monitor, Live System Canvas, Apple Pencil Engine';
      } else if (dev.id === 'iphone') {
        location = 'Di Động (Túi / Bàn Sạc)';
        cpuLoadStr = '28%';
        hardwareSpecs = 'A17 Pro / Super Retina XDR';
        activeWorkload = 'Hoppi Companion iOS, Push Notif Sync, BLE Proximity Daemon';
      } else if (dev.id === 'iot-hub') {
        location = 'Ban Công Sinh Thái';
        cpuLoadStr = '8%';
        hardwareSpecs = 'ESP32-S3 / Zigbee 3.0 / Solar LiPo';
        activeWorkload = 'Nhiệt/Ẩm DHT22, Cảm biến ánh sáng BH1750, Sensor Mesh Bridge';
      }

      return {
        ...dev,
        percentShare,
        relativeHeatScore,
        thermalLevel,
        thermalLabel,
        thermalBadgeClass,
        cardBgGradient,
        cardBorderClass,
        heatBarGrad,
        textColor,
        glowClass,
        location,
        cpuLoadStr,
        hardwareSpecs,
        activeWorkload,
      };
    });

    const sortedByPower = [...enrichedList].sort((a, b) => b.watts - a.watts);
    const mostActiveDevice = sortedByPower[0] || enrichedList[0];

    // Filter list
    let filtered = sortedByPower;
    if (heatMapFilter === 'battery') {
      filtered = sortedByPower.filter((d) => d.isBatteryPowered);
    } else if (heatMapFilter === 'ac') {
      filtered = sortedByPower.filter((d) => !d.isBatteryPowered);
    }

    // Sort list
    if (heatMapSortBy === 'name') {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else if (heatMapSortBy === 'battery') {
      filtered = [...filtered].sort((a, b) => b.batteryLevel - a.batteryLevel);
    }

    return {
      allList: sortedByPower,
      displayList: filtered,
      mostActiveDevice,
      totalWatts,
      maxWatts,
    };
  }, [meshPowerDistribution, currentDevice.cpu.percent, homeServer.cpu.percent, heatMapFilter, heatMapSortBy]);

  const getHeatMapDeviceIcon = (iconType: string, className = 'w-4 h-4') => {
    switch (iconType) {
      case 'server':
        return <Server className={className} />;
      case 'desktop':
        return <Laptop className={className} />;
      case 'router':
        return <Wifi className={className} />;
      case 'tablet':
        return <Tablet className={className} />;
      case 'mobile':
        return <Smartphone className={className} />;
      case 'iot':
        return <Radio className={className} />;
      default:
        return <Laptop className={className} />;
    }
  };

  // Render Interactive Device Heat Map Grid Section
  const renderDeviceHeatMapGrid = () => {
    const { allList, displayList, mostActiveDevice, totalWatts } = deviceHeatMapData;

    return (
      <div className="p-3.5 rounded-2xl bg-slate-950/85 border border-slate-800/90 shadow-xl space-y-3.5 backdrop-blur-md">
        {/* Top Header: Title, Subtitle, and Audio Report */}
        <div className="flex items-center justify-between gap-2 flex-wrap pb-1 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-gradient-to-br from-rose-500/25 to-amber-500/25 border border-rose-500/40 text-rose-300 shadow-sm">
              <Flame size={15} className="text-rose-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                  Bản Đồ Nhiệt Năng Lượng Thiết Bị Mesh (Device Heat Map)
                </span>
                <span className="px-2 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono text-[9px] font-bold">
                  {allList.length} Nodes
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Lưới mã màu nhiệt (Color-Coded Grid) thể hiện mức tiêu thụ điện tương quan & định vị tức thì thiết bị hoạt động mạnh nhất
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                if (onSpeakText) {
                  onSpeakText(
                    `Hoppi báo cáo Bản Đồ Nhiệt Mạng Mesh: Thiết bị hoạt động mạnh nhất và tiêu thụ công suất cao nhất hiện tại là ${mostActiveDevice.name} với công suất ${mostActiveDevice.watts} Watts, chiếm ${mostActiveDevice.percentShare}% tổng điện năng toàn hệ thống mesh (${totalWatts} Watts). Node đang đặt tại ${mostActiveDevice.location}. Tải CPU là ${mostActiveDevice.cpuLoadStr}.`
                  );
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[10px] font-medium flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
              title="Hoppi đọc báo cáo phân tích bản đồ nhiệt"
            >
              <Radio size={10} className="text-cyan-400 animate-pulse" />
              <span>Nghe Hoppi Đọc</span>
            </button>
          </div>
        </div>

        {/* PROMINENT HIGHLIGHT: MOST ACTIVE DEVICE (ĐỈNH TẢI MẠNG MESH) */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-950/70 via-slate-900/90 to-amber-950/50 border border-rose-500/70 shadow-lg shadow-rose-950/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-44 h-44 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between flex-wrap gap-2.5 relative z-10">
            <div className="flex items-start gap-2.5">
              <div className="relative p-2 rounded-xl bg-gradient-to-br from-rose-500/30 to-amber-500/30 border border-rose-500/60 text-rose-300 shadow-md flex-shrink-0 mt-0.5">
                <Flame size={18} className="animate-pulse text-rose-400" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-rose-100 flex items-center gap-1.5">
                    <span>THIẾT BỊ HOẠT ĐỘNG MẠNH NHẤT:</span>
                    <span className="text-rose-300 underline underline-offset-2">{mostActiveDevice.name}</span>
                  </span>
                  <span className="px-2 py-0.2 rounded-full bg-rose-500 text-white font-black text-[9px] tracking-wide uppercase shadow-sm">
                    🔥 #1 MOST ACTIVE • ĐỈNH TẢI MESH
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  Đang tiêu thụ <strong className="text-rose-300 font-mono font-bold text-xs">{mostActiveDevice.watts} Watts</strong>, 
                  chiếm <strong className="text-amber-300 font-mono font-bold">{mostActiveDevice.percentShare}%</strong> tổng tải toàn bộ mạng Mesh ({totalWatts}W). 
                  Vị trí: <strong className="text-slate-200">{mostActiveDevice.location}</strong>. Tải CPU: <strong className="text-cyan-300 font-mono">{mostActiveDevice.cpuLoadStr}</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleRunDiagnosticRoutine}
                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/30 via-rose-500/30 to-rose-600/30 hover:brightness-110 border border-rose-500/60 text-rose-200 text-[10px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="Khởi chạy chẩn đoán và đóng tiến trình ngầm"
              >
                <Zap size={11} className="text-amber-400 fill-amber-400" />
                <span>Tối Ưu Ngay</span>
              </button>
              <button
                onClick={() => setSelectedHeatMapDeviceId(selectedHeatMapDeviceId === mostActiveDevice.id ? null : mostActiveDevice.id)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-[10px] font-medium border border-slate-700 transition-colors cursor-pointer"
              >
                {selectedHeatMapDeviceId === mostActiveDevice.id ? 'Thu gọn' : 'Xem chi tiết'}
              </button>
            </div>
          </div>
        </div>

        {/* CONTROLS & THERMAL SCALE COLOR LEGEND */}
        <div className="space-y-2">
          {/* Filter & Sort Controls */}
          <div className="flex items-center justify-between gap-2 flex-wrap text-[10px]">
            {/* Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Bộ lọc:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setHeatMapFilter('all')}
                  className={`px-2 py-0.5 rounded-lg border font-medium transition-all cursor-pointer ${
                    heatMapFilter === 'all'
                      ? 'bg-rose-500/20 text-rose-200 border-rose-500/50 shadow-sm font-semibold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  Tất cả ({allList.length})
                </button>
                <button
                  onClick={() => setHeatMapFilter('battery')}
                  className={`px-2 py-0.5 rounded-lg border font-medium transition-all cursor-pointer ${
                    heatMapFilter === 'battery'
                      ? 'bg-amber-500/20 text-amber-200 border-amber-500/50 shadow-sm font-semibold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  Chỉ dùng pin ({allList.filter((d) => d.isBatteryPowered).length})
                </button>
                <button
                  onClick={() => setHeatMapFilter('ac')}
                  className={`px-2 py-0.5 rounded-lg border font-medium transition-all cursor-pointer ${
                    heatMapFilter === 'ac'
                      ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/50 shadow-sm font-semibold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  Cắm điện AC ({allList.filter((d) => !d.isBatteryPowered).length})
                </button>
              </div>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Sắp xếp:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setHeatMapSortBy('power')}
                  className={`px-2 py-0.5 rounded-lg border text-[10px] font-medium transition-all cursor-pointer ${
                    heatMapSortBy === 'power'
                      ? 'bg-rose-500/20 text-rose-200 border-rose-500/50 font-semibold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  Nhiệt/Tải (Cao → Thấp)
                </button>
                <button
                  onClick={() => setHeatMapSortBy('name')}
                  className={`px-2 py-0.5 rounded-lg border text-[10px] font-medium transition-all cursor-pointer ${
                    heatMapSortBy === 'name'
                      ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/50 font-semibold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  Tên A-Z
                </button>
                <button
                  onClick={() => setHeatMapSortBy('battery')}
                  className={`px-2 py-0.5 rounded-lg border text-[10px] font-medium transition-all cursor-pointer ${
                    heatMapSortBy === 'battery'
                      ? 'bg-amber-500/20 text-amber-200 border-amber-500/50 font-semibold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  Mức pin
                </button>
              </div>
            </div>
          </div>

          {/* Thermal Scale Color Legend Bar */}
          <div className="flex items-center gap-1.5 flex-wrap text-[9px] font-mono p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-slate-400 font-sans font-medium flex items-center gap-1">
              <Thermometer size={10} className="text-amber-400" />
              <span>Thang mã màu nhiệt:</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>0-24% Mát / Eco (&lt;15W)</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>25-49% Trung Bình (15-30W)</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-300 border border-orange-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              <span>50-74% Tải Cao (30-55W)</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>75-100% Cực Đại / Hottest (&gt;55W)</span>
            </span>
          </div>
        </div>

        {/* COLOR-CODED GRID REPRESENTING RELATIVE POWER LEVELS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayList.map((dev) => {
            const isTop = dev.id === mostActiveDevice.id;
            const isSelected = selectedHeatMapDeviceId === dev.id;

            return (
              <div
                key={dev.id}
                onClick={() => setSelectedHeatMapDeviceId(isSelected ? null : dev.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-2.5 ${
                  dev.cardBgGradient
                } ${dev.cardBorderClass} ${dev.glowClass} ${
                  isSelected ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 scale-[1.01]' : 'hover:scale-[1.01]'
                }`}
              >
                {/* Top Row: Device icon, Name, Role, and Top Badges */}
                <div className="flex items-start justify-between gap-1.5">
                  <div className="flex items-center gap-2 truncate">
                    <div
                      className="p-1.5 rounded-xl border flex-shrink-0"
                      style={{
                        backgroundColor: `${dev.fill}20`,
                        borderColor: `${dev.fill}60`,
                        color: dev.fill,
                      }}
                    >
                      {getHeatMapDeviceIcon(dev.iconType, 'w-4 h-4')}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-100 text-xs truncate" title={dev.name}>
                          {dev.shortName}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-400 block truncate">
                        {dev.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {isTop && (
                      <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-black text-[8px] uppercase tracking-wider flex items-center gap-0.5 shadow-sm animate-pulse">
                        <Flame size={9} />
                        <span>HOTTEST</span>
                      </span>
                    )}
                    <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold border ${dev.thermalBadgeClass}`}>
                      {dev.thermalLabel}
                    </span>
                  </div>
                </div>

                {/* Location row */}
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1 truncate">
                    <MapPin size={10} className="text-slate-500 flex-shrink-0" />
                    <span className="truncate">{dev.location}</span>
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">
                    {dev.category}
                  </span>
                </div>

                {/* Big Metric Display: Watts & Share % */}
                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className={`font-mono text-xl font-black ${dev.textColor}`}>
                        {dev.watts}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Watts</span>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 border border-slate-700/80 text-cyan-300">
                      {dev.percentShare}% tải Mesh
                    </span>
                  </div>

                  {/* Relative Heat Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                      <span className="flex items-center gap-1">
                        <Flame size={9} className={dev.relativeHeatScore >= 50 ? 'text-amber-400' : 'text-slate-500'} />
                        <span>Nhiệt tương quan:</span>
                      </span>
                      <span className={`font-bold ${dev.textColor}`}>
                        {dev.relativeHeatScore}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden p-0.5">
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${dev.heatBarGrad}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${dev.relativeHeatScore}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Telemetry Strip */}
                <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono text-slate-400 pt-0.5">
                  <div className="p-1 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-center justify-between">
                    <span>CPU Load:</span>
                    <strong className="text-slate-200">{dev.cpuLoadStr}</strong>
                  </div>
                  <div className="p-1 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-center justify-between">
                    {dev.isBatteryPowered ? (
                      <>
                        <span>Pin:</span>
                        <strong className="text-emerald-400">{dev.batteryLevel}% (-{dev.drainRate}%/h)</strong>
                      </>
                    ) : (
                      <>
                        <span>Nguồn:</span>
                        <strong className="text-cyan-400">220V AC Core</strong>
                      </>
                    )}
                  </div>
                </div>

                {/* Expanded Details Drawer when clicked */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pt-2 border-t border-slate-800/80 space-y-2 text-[10px]"
                    >
                      <div className="space-y-1 p-2 rounded-xl bg-slate-900/90 border border-slate-700/80">
                        <div className="text-[9px] text-slate-400 font-mono">
                          Phần cứng: <span className="text-slate-200 font-semibold">{dev.hardwareSpecs}</span>
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono">
                          Tác vụ chính: <span className="text-cyan-300">{dev.activeWorkload}</span>
                        </div>
                        <div className="text-[9px] text-amber-300 italic pt-1 border-t border-slate-800">
                          💡 {dev.advice}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-1 pt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsSmartOptimizerOpen(true);
                          }}
                          className="flex-1 py-1 px-2 rounded-lg bg-gradient-to-r from-amber-500/25 to-rose-500/25 hover:from-amber-500/40 hover:to-rose-500/40 border border-amber-500/50 text-amber-200 font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all"
                        >
                          <Zap size={10} className="text-amber-400" />
                          <span>Tối Ưu Node Này</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedHeatMapDeviceId(null);
                          }}
                          className="py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                        >
                          Đóng
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Compute 7-day hourly battery consumption data
  const historical7DayHourlyData = useMemo(() => {
    const dayMap: Record<
      string,
      Array<{ hour: number; hourLabel: string; macbook: number; iphone: number; ipad: number; totalMesh: number }>
    > = {};

    const dayMultipliers: Record<string, { macbook: number; iphone: number; ipad: number }> = {
      'd-0': { macbook: 1.05, iphone: 0.98, ipad: 0.95 },
      'd-1': { macbook: 1.15, iphone: 1.02, ipad: 0.90 }, // heavy compile day
      'd-2': { macbook: 0.95, iphone: 1.05, ipad: 1.00 },
      'd-3': { macbook: 1.02, iphone: 0.96, ipad: 0.92 },
      'd-4': { macbook: 0.40, iphone: 1.25, ipad: 1.40 }, // Sunday: low laptop, high mobile
      'd-5': { macbook: 0.55, iphone: 1.20, ipad: 1.35 }, // Saturday: gaming/media
      'd-6': { macbook: 1.08, iphone: 1.00, ipad: 0.98 },
    };

    const daysList = ['d-0', 'd-1', 'd-2', 'd-3', 'd-4', 'd-5', 'd-6'];

    daysList.forEach((dayKey) => {
      const mult = dayMultipliers[dayKey];
      const hourlyList = [];

      for (let h = 0; h < 24; h++) {
        const hourLabel = `${String(h).padStart(2, '0')}:00`;

        let baseMacbook = 0.5;
        let baseIphone = 0.6;
        let baseIpad = 0.4;

        if (h >= 0 && h <= 5) {
          // Night standby
          baseMacbook = 0.4 + (h % 2) * 0.2;
          baseIphone = 0.6 + (h % 3) * 0.2;
          baseIpad = 0.3 + (h % 2) * 0.1;
        } else if (h >= 6 && h <= 8) {
          // Morning ramp-up
          baseMacbook = 1.8 + (h - 6) * 1.0;
          baseIphone = 3.6 + (h % 2) * 0.8;
          baseIpad = 1.2 + (h % 2) * 0.5;
        } else if (h >= 9 && h <= 11) {
          // Morning work
          baseMacbook = 5.2 + (h === 10 ? 1.8 : 0.6);
          baseIphone = 2.4 + (h % 2) * 0.5;
          baseIpad = 1.8 + (h % 2) * 0.4;
        } else if (h >= 12 && h <= 13) {
          // Lunch break
          baseMacbook = 2.1;
          baseIphone = 4.6;
          baseIpad = 2.0;
        } else if (h >= 14 && h <= 17) {
          // Afternoon peak (video call, AI build)
          baseMacbook = 6.4 + (h === 15 ? 1.4 : 0.4);
          baseIphone = 2.8 + (h % 2) * 0.6;
          baseIpad = 2.2 + (h % 2) * 0.5;
        } else if (h >= 18 && h <= 19) {
          // Evening transition
          baseMacbook = 3.2;
          baseIphone = 4.2;
          baseIpad = 2.4;
        } else if (h >= 20 && h <= 22) {
          // Night media
          baseMacbook = 2.4;
          baseIphone = 4.8 + (h === 21 ? 0.9 : 0.2);
          baseIpad = 5.4 + (h === 21 ? 1.1 : 0.3);
        } else {
          // 23:00
          baseMacbook = 1.2;
          baseIphone = 2.4;
          baseIpad = 2.1;
        }

        const macVal = Math.round(baseMacbook * mult.macbook * 10) / 10;
        const iphVal = Math.round(baseIphone * mult.iphone * 10) / 10;
        const ipadVal = Math.round(baseIpad * mult.ipad * 10) / 10;
        const total = Math.round((macVal + iphVal + ipadVal) * 10) / 10;

        hourlyList.push({
          hour: h,
          hourLabel,
          macbook: macVal,
          iphone: iphVal,
          ipad: ipadVal,
          totalMesh: total,
        });
      }

      dayMap[dayKey] = hourlyList;
    });

    // Compute 'avg7d'
    const avgList = [];
    for (let h = 0; h < 24; h++) {
      const hourLabel = `${String(h).padStart(2, '0')}:00`;
      let sumMac = 0;
      let sumIph = 0;
      let sumIpad = 0;

      daysList.forEach((dKey) => {
        const item = dayMap[dKey][h];
        sumMac += item.macbook;
        sumIph += item.iphone;
        sumIpad += item.ipad;
      });

      const avgMac = Math.round((sumMac / 7) * 10) / 10;
      const avgIph = Math.round((sumIph / 7) * 10) / 10;
      const avgIpad = Math.round((sumIpad / 7) * 10) / 10;
      const total = Math.round((avgMac + avgIph + avgIpad) * 10) / 10;

      avgList.push({
        hour: h,
        hourLabel,
        macbook: avgMac,
        iphone: avgIph,
        ipad: avgIpad,
        totalMesh: total,
      });
    }

    dayMap['avg7d'] = avgList;
    return dayMap;
  }, []);

  // Summary statistics for 7-day power trends
  const historicalTrendsMeta = useMemo(() => {
    const avgData = historical7DayHourlyData['avg7d'] || [];

    let peak = avgData[0];
    let eco = avgData[0];

    avgData.forEach((item) => {
      if (item.totalMesh > (peak?.totalMesh || 0)) peak = item;
      if (item.totalMesh < (eco?.totalMesh || 999)) eco = item;
    });

    const daysList = ['d-0', 'd-1', 'd-2', 'd-3', 'd-4', 'd-5', 'd-6'];
    let macTotal = 0;
    let iphoneTotal = 0;
    let ipadTotal = 0;

    daysList.forEach((dKey) => {
      const dayData = historical7DayHourlyData[dKey] || [];
      dayData.forEach((h) => {
        macTotal += h.macbook;
        iphoneTotal += h.iphone;
        ipadTotal += h.ipad;
      });
    });

    const meshTotal = macTotal + iphoneTotal + ipadTotal;
    const dailyAvg = Math.round((meshTotal / 7) * 10) / 10;

    return {
      peakHour: peak ? `${peak.hourLabel} - ${String(peak.hour + 1).padStart(2, '0')}:00` : '15:00 - 16:00',
      peakDrainRate: peak ? peak.totalMesh : 12.2,
      ecoHour: eco ? `${eco.hourLabel} - ${String(eco.hour + 1).padStart(2, '0')}:00` : '03:00 - 04:00',
      ecoDrainRate: eco ? eco.totalMesh : 1.3,
      macTotal: Math.round(macTotal),
      iphoneTotal: Math.round(iphoneTotal),
      ipadTotal: Math.round(ipadTotal),
      meshTotal: Math.round(meshTotal),
      dailyAvg,
    };
  }, [historical7DayHourlyData]);

  const currentHistoricalHourlyData = useMemo(() => {
    return historical7DayHourlyData[historicalSelectedDay] || historical7DayHourlyData['avg7d'] || [];
  }, [historical7DayHourlyData, historicalSelectedDay]);

  const currentDayAvgDrain = useMemo(() => {
    if (!currentHistoricalHourlyData.length) return 4.5;
    const sum = currentHistoricalHourlyData.reduce((acc, cur) => acc + cur.totalMesh, 0);
    return Math.round((sum / currentHistoricalHourlyData.length) * 10) / 10;
  }, [currentHistoricalHourlyData]);

  // Voice handler for 7-day trends summary
  const handleSpeakTrendSummary = () => {
    const text = `Phân tích xu hướng tiêu thụ pin 7 ngày qua: Giờ cao điểm xả pin mạnh nhất toàn Mesh là khung giờ ${historicalTrendsMeta.peakHour} với tốc độ tiêu hao ${historicalTrendsMeta.peakDrainRate}% mỗi giờ. Khung giờ tiết kiệm nhất là ban đêm từ ${historicalTrendsMeta.ecoHour} với chỉ ${historicalTrendsMeta.ecoDrainRate}%. Trong 7 ngày, MacBook tiêu thụ ${historicalTrendsMeta.macTotal}%, iPhone tiêu thụ ${historicalTrendsMeta.iphoneTotal}%, và iPad là ${historicalTrendsMeta.ipadTotal}%. Mức tiêu thụ toàn Mesh giảm 8.4% so với tuần trước nhờ lịch trình tối ưu tự động của Hoppi.`;

    setBatteryNotice(`📊 Đã phát báo cáo xu hướng pin 7 ngày qua giọng nói Hoppi`);
    if (onSpeakText) {
      onSpeakText(text);
    }
    setTimeout(() => setBatteryNotice(null), 6000);
  };

  // Export 7 days of battery usage data as a downloadable CSV file
  const handleExportHistoricalCSV = () => {
    try {
      const now = new Date();
      const timestampStr = now.toLocaleString('vi-VN');
      const isoDate = now.toISOString().split('T')[0];

      const lines: string[] = [];

      // 1. Metadata Header Comment Block
      lines.push('# ==============================================================');
      lines.push('# HOPPI MESH OS - BÁO CÁO DỮ LIỆU TIÊU THỤ PIN 7 NGÀY (CSV EXPORT)');
      lines.push(`# Thời gian xuất file: ${timestampStr}`);
      lines.push('# Mạng Mesh: WireGuard P2P Telemetry (MacBook, iPhone, iPad, Home Server)');
      lines.push(`# Tổng tiêu hao 7 ngày toàn Mesh: ${historicalTrendsMeta.meshTotal}% pin`);
      lines.push(`# Trung bình ngày toàn Mesh: ${historicalTrendsMeta.dailyAvg}% pin/ngày`);
      lines.push(`# Khung giờ xả cao điểm: ${historicalTrendsMeta.peakHour} (-${historicalTrendsMeta.peakDrainRate}%/h)`);
      lines.push(`# Khung giờ tiết kiệm: ${historicalTrendsMeta.ecoHour} (-${historicalTrendsMeta.ecoDrainRate}%/h)`);
      lines.push('# ==============================================================');
      lines.push('');

      // 2. CSV Column Headers
      lines.push(
        [
          'ID_Ngay',
          'Ngay_Thang',
          'Thu',
          'Gio',
          'Khung_Gio',
          'MacBook_M3_Tieu_Hao_Pct',
          'iPhone_16_Tieu_Hao_Pct',
          'iPad_Pro_Tieu_Hao_Pct',
          'Tong_Mesh_Tieu_Hao_Pct',
          'Che_Do_Nang_Luong',
          'Ghi_Chu_Tac_Vu',
        ].join(',')
      );

      // 3. Hourly data for all 7 days (d-6 to d-0)
      const dayKeys = ['d-6', 'd-5', 'd-4', 'd-3', 'd-2', 'd-1', 'd-0'];
      const dayLabels: Record<string, { label: string; date: string; weekday: string }> = {
        'd-6': { label: 'Thứ Sáu (23/10)', date: '2026-10-23', weekday: 'Thứ Sáu' },
        'd-5': { label: 'Thứ Bảy (24/10)', date: '2026-10-24', weekday: 'Thứ Bảy' },
        'd-4': { label: 'Chủ Nhật (25/10)', date: '2026-10-25', weekday: 'Chủ Nhật' },
        'd-3': { label: 'Thứ Hai (26/10)', date: '2026-10-26', weekday: 'Thứ Hai' },
        'd-2': { label: 'Thứ Ba (27/10)', date: '2026-10-27', weekday: 'Thứ Ba' },
        'd-1': { label: 'Thứ Tư (28/10)', date: '2026-10-28', weekday: 'Thứ Tư' },
        'd-0': { label: 'Hôm nay (29/10)', date: '2026-10-29', weekday: 'Thứ Năm' },
      };

      let totalRecordCount = 0;
      dayKeys.forEach((dKey) => {
        const meta = dayLabels[dKey];
        const hourlyArr = historical7DayHourlyData[dKey] || [];
        hourlyArr.forEach((item) => {
          totalRecordCount++;
          const hourLabel = item.hourLabel;
          const endHour = `${String((item.hour + 1) % 24).padStart(2, '0')}:00`;
          const timeWindow = `"${hourLabel} - ${endHour}"`;

          // Determine primary workload context
          let workload = 'Tiêu chuẩn';
          if (item.hour >= 0 && item.hour <= 5) workload = 'Nghỉ đêm / Standby';
          else if (item.hour >= 9 && item.hour <= 12) workload = 'Lập trình & Biên dịch Dev';
          else if (item.hour >= 14 && item.hour <= 17) workload = 'Họp trực tuyến & AI Agent';
          else if (item.hour >= 19 && item.hour <= 22) workload = 'Giải trí / Truyền thông';

          const powerModeLabel = meshPowerMode === 'battery-saver' ? 'Battery Saver' : 'High Performance';

          lines.push(
            [
              dKey,
              meta.date,
              `"${meta.weekday}"`,
              item.hour,
              timeWindow,
              item.macbook.toFixed(2),
              item.iphone.toFixed(2),
              item.ipad.toFixed(2),
              item.totalMesh.toFixed(2),
              `"${powerModeLabel}"`,
              `"${workload}"`,
            ].join(',')
          );
        });
      });

      // 4. Summary Rows
      lines.push('');
      lines.push('# --- TỔNG KẾT THEO THIẾT BỊ ---');
      lines.push(
        [
          'SUMMARY',
          '7_NGAY_TOAN_MANG',
          'ALL',
          'ALL',
          '"Tổng 168 Giờ"',
          historicalTrendsMeta.macTotal.toFixed(2),
          historicalTrendsMeta.iphoneTotal.toFixed(2),
          historicalTrendsMeta.ipadTotal.toFixed(2),
          historicalTrendsMeta.meshTotal.toFixed(2),
          '--',
          '"Tổng tiêu hao tích lũy 7 ngày qua"',
        ].join(',')
      );
      lines.push(
        [
          'SUMMARY_AVG',
          'TRUNG_BINH_NGAY',
          'AVG',
          'AVG',
          '"TB 24 Giờ"',
          (historicalTrendsMeta.macTotal / 7).toFixed(2),
          (historicalTrendsMeta.iphoneTotal / 7).toFixed(2),
          (historicalTrendsMeta.ipadTotal / 7).toFixed(2),
          historicalTrendsMeta.dailyAvg.toFixed(2),
          '--',
          '"Tiêu hao trung bình mỗi ngày"',
        ].join(',')
      );

      // Create CSV Blob with UTF-8 BOM
      const csvString = '\uFEFF' + lines.join('\r\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hoppi_mesh_battery_usage_7days_${isoDate}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setBatteryNotice(`📥 Đã xuất thành công tệp CSV dữ liệu pin 7 ngày (${totalRecordCount} bản ghi) cho Excel & Sheets!`);
      setTimeout(() => setBatteryNotice(null), 4500);

      if (onSpeakText) {
        onSpeakText('Đã xuất thành công bảng dữ liệu tiêu thụ pin 7 ngày của mạng Mesh thành tệp CSV.');
      }
    } catch (err) {
      console.error('Error exporting CSV:', err);
      setBatteryNotice('❌ Có lỗi xảy ra khi xuất tệp CSV!');
      setTimeout(() => setBatteryNotice(null), 4000);
    }
  };

  // Custom Tooltip for Historical Bar Chart
  const CustomHistoricalBarTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const total = payload.reduce((sum: number, p: any) => sum + (Number(p.value) || 0), 0);

    return (
      <div className="p-2.5 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl text-[11px] space-y-1.5 backdrop-blur-md min-w-[180px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 gap-2">
          <span className="font-semibold text-slate-200 flex items-center gap-1">
            <Clock size={11} className="text-amber-400" />
            <span>Khung giờ: {label}</span>
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Tiêu thụ
          </span>
        </div>
        <div className="space-y-1">
          {payload.map((item: any) => {
            if (item.value === undefined || item.value === null) return null;
            return (
              <div key={item.dataKey} className="flex items-center justify-between gap-3 text-slate-300">
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.fill || item.color }}
                  />
                  <span className="truncate">{item.name}:</span>
                </div>
                <span className="font-mono font-bold text-white flex-shrink-0">
                  {Number(item.value).toFixed(1)}%/h
                </span>
              </div>
            );
          })}
        </div>
        <div className="pt-1 mt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
          <span className="text-slate-400 font-medium">Tổng tiêu hao giờ này:</span>
          <span className="font-mono font-bold text-amber-400">{total.toFixed(1)}%/h</span>
        </div>
      </div>
    );
  };

  // RF / Signal Strength Calculations for 2D Floorplan
  const calculateLinkMetrics = (nodeA: FloorplanNode, nodeB: FloorplanNode) => {
    const distPx = Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y);
    const distM = Math.max(0.8, +(distPx / 25).toFixed(1)); // 1 meter ~ 25 pixels

    // Wall crossing detection (Interior layout walls: x=175, x=350, y=160)
    const crossedX1 = (nodeA.x < 175 && nodeB.x > 175) || (nodeA.x > 175 && nodeB.x < 175);
    const crossedX2 = (nodeA.x < 350 && nodeB.x > 350) || (nodeA.x > 350 && nodeB.x < 350);
    const crossedY = (nodeA.y < 160 && nodeB.y > 160) || (nodeA.y > 160 && nodeB.y < 160);
    const wallCount = (crossedX1 ? 1 : 0) + (crossedX2 ? 1 : 0) + (crossedY ? 1 : 0);

    // Dynamic RSSI dBm calculation
    const baseTx = nodeA.isGateway ? nodeA.txPowerDbm : 22;
    const rssi = Math.min(
      -32,
      Math.max(
        -92,
        Math.round(-30 - 18 * Math.log10(distM) - wallCount * 8.5 + (baseTx - 22) * 0.8)
      )
    );

    // Speed (Mbps) and Latency (ms)
    const speedMbps = Math.max(25, Math.min(1250, Math.round(1450 + rssi * 15.5)));
    const latencyMs = Math.max(2, Math.min(45, Math.round(2 - (rssi + 40) * 0.45)));
    const packetLoss = rssi <= -76 ? '2.4%' : rssi <= -68 ? '0.6%' : '0.0%';

    let qualityLabel = 'Xuất sắc';
    let qualityColor = '#10b981'; // Emerald
    let badgeClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    let advice = 'Vị trí kết nối tuyệt hảo, tốc độ Gigabit tối đa.';

    if (rssi < -75) {
      qualityLabel = 'Yếu / Vùng chết';
      qualityColor = '#f43f5e'; // Rose
      badgeClass = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      advice = 'Bị cản bởi nhiều tường bê tông. Cần kéo node lại gần Gateway hoặc mở cửa phòng.';
    } else if (rssi < -65) {
      qualityLabel = 'Khá';
      qualityColor = '#f59e0b'; // Amber
      badgeClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      advice = 'Tín hiệu đủ dùng cho stream/làm việc, có thể tối ưu thêm bằng cách dịch chuyển nhẹ.';
    } else if (rssi < -50) {
      qualityLabel = 'Tốt';
      qualityColor = '#06b6d4'; // Cyan
      badgeClass = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      advice = 'Vị trí ổn định, độ trễ thấp dưới 5ms.';
    }

    return {
      distM,
      wallCount,
      rssi,
      speedMbps,
      latencyMs,
      packetLoss,
      qualityLabel,
      qualityColor,
      badgeClass,
      advice,
    };
  };

  const getNodeRoomName = (x: number, y: number) => {
    if (y < 160) {
      if (x < 175) return 'Tủ Kỹ Thuật (Server Closet)';
      return 'Phòng Làm Việc (Dev Studio)';
    } else {
      if (x < 175) return 'Ban Công (Smart Garden)';
      if (x < 350) return 'Phòng Khách (Living Room)';
      return 'Phòng Ngủ Master';
    }
  };

  // Mesh Topology Metrics computed from floorplan
  const floorplanMeshMetrics = useMemo(() => {
    const gateway = floorplanNodes.find((n) => n.isGateway) || floorplanNodes[0];
    const clientNodes = floorplanNodes.filter((n) => n.id !== gateway.id);

    const links = clientNodes.map((client) => {
      const metrics = calculateLinkMetrics(gateway, client);
      return {
        client,
        gateway,
        metrics,
      };
    });

    const avgRssi = Math.round(
      links.reduce((acc, l) => acc + l.metrics.rssi, 0) / (links.length || 1)
    );
    const avgSpeed = Math.round(
      links.reduce((acc, l) => acc + l.metrics.speedMbps, 0) / (links.length || 1)
    );
    const deadZoneNodesCount = links.filter((l) => l.metrics.rssi < -75).length;
    const weakNodesCount = links.filter((l) => l.metrics.rssi < -65 && l.metrics.rssi >= -75).length;

    // Quality Score (0 - 100)
    const score = Math.min(
      100,
      Math.max(25, Math.round(100 + (avgRssi + 48) * 1.6 - deadZoneNodesCount * 12))
    );

    return {
      gateway,
      links,
      avgRssi,
      avgSpeed,
      deadZoneNodesCount,
      weakNodesCount,
      score,
      activeNodesCount: floorplanNodes.length,
      overallHealthScore: score,
    };
  }, [floorplanNodes]);

  // Pointer dragging handlers for interactive nodes
  const handleNodePointerDown = (nodeId: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setDraggingNodeId(nodeId);
    setSelectedFloorplanNodeId(nodeId);
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
  };

  const handleFloorplanPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingNodeId || !floorplanSvgRef.current) return;
    const rect = floorplanSvgRef.current.getBoundingClientRect();
    const scaleX = 520 / rect.width;
    const scaleY = 320 / rect.height;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const clampedX = Math.round(Math.min(485, Math.max(35, clientX * scaleX)));
    const clampedY = Math.round(Math.min(290, Math.max(35, clientY * scaleY)));

    setFloorplanNodes((prev) =>
      prev.map((n) =>
        n.id === draggingNodeId
          ? {
              ...n,
              x: clampedX,
              y: clampedY,
              room: getNodeRoomName(clampedX, clampedY),
            }
          : n
      )
    );
  };

  const handleFloorplanPointerUp = (e: React.PointerEvent) => {
    if (draggingNodeId) {
      setDraggingNodeId(null);
      try {
        localStorage.setItem('hoppi_floorplan_nodes', JSON.stringify(floorplanNodes));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAutoOptimizePlacement = () => {
    setIsOptimizingPlacement(true);
    const optimized = floorplanNodes.map((n) => ({
      ...n,
      x: n.optimalX,
      y: n.optimalY,
      room: getNodeRoomName(n.optimalX, n.optimalY),
    }));
    setFloorplanNodes(optimized);
    try {
      localStorage.setItem('hoppi_floorplan_nodes', JSON.stringify(optimized));
    } catch (e) {
      console.error(e);
    }
    setBatteryNotice('✨ AI đã tự động dịch chuyển các node tới vị trí phủ sóng RF tối ưu nhất (Score 98/100)!');
    setTimeout(() => {
      setIsOptimizingPlacement(false);
      setBatteryNotice(null);
    }, 4500);

    if (onSpeakText) {
      onSpeakText(
        'Hoppi đã tự động tối ưu hóa vị trí các thiết bị trên sơ đồ mặt bằng. Tín hiệu toàn Mesh tăng 35%, loại bỏ hoàn toàn các điểm chết.'
      );
    }
  };

  const handleResetFloorplanPositions = () => {
    const def = floorplanNodes.map((n) => ({
      ...n,
      x: n.defaultX,
      y: n.defaultY,
      room: getNodeRoomName(n.defaultX, n.defaultY),
    }));
    setFloorplanNodes(def);
    try {
      localStorage.setItem('hoppi_floorplan_nodes', JSON.stringify(def));
    } catch (e) {
      console.error(e);
    }
    setBatteryNotice('🔄 Đã khôi phục vị trí mặc định ban đầu trên mặt bằng');
    setTimeout(() => setBatteryNotice(null), 3000);
  };

  const handleSpeakFloorplanAnalysis = () => {
    const text = `Phân tích vị trí mạng Mesh: Điểm sức khỏe mạng đạt ${floorplanMeshMetrics.score} trên 100. Tín hiệu trung bình toàn mạng là ${floorplanMeshMetrics.avgRssi} dBm với tốc độ trung bình ${floorplanMeshMetrics.avgSpeed} Megabit mỗi giây. ${floorplanMeshMetrics.deadZoneNodesCount > 0 ? `Hiện đang có ${floorplanMeshMetrics.deadZoneNodesCount} thiết bị trong vùng sóng yếu.` : 'Tất cả các phòng đều được phủ sóng ổn định.'} Bạn có thể nhấp kéo thiết bị trên sơ đồ để kiểm tra vị trí tối ưu.`;
    setBatteryNotice('🎙️ Hoppi đang đọc phân tích độ phủ sóng Mesh');
    if (onSpeakText) {
      onSpeakText(text);
    }
    setTimeout(() => setBatteryNotice(null), 6000);
  };

  const getFloorplanNodeIcon = (type: FloorplanNode['type']) => {
    switch (type) {
      case 'router':
        return <Wifi size={13} className="text-cyan-300" />;
      case 'desktop':
        return <Laptop size={13} className="text-cyan-400" />;
      case 'server':
        return <Server size={13} className="text-purple-400" />;
      case 'mobile':
        return <Smartphone size={13} className="text-rose-400" />;
      case 'tablet':
        return <Tablet size={13} className="text-purple-400" />;
      case 'iot':
        return <Radio size={13} className="text-emerald-400" />;
    }
  };

  const containerClasses =
    theme === 'light'
      ? 'bg-white border-slate-200 text-slate-700 shadow-sm'
      : theme === 'deepspace'
      ? 'bg-[#090d15] border-neutral-800 text-neutral-300'
      : 'bg-slate-900/60 border-slate-800 text-slate-300';

  const subCardClasses =
    theme === 'light'
      ? 'bg-slate-50 border-slate-200'
      : theme === 'deepspace'
      ? 'bg-[#0f1422] border-neutral-800/80'
      : 'bg-slate-950/70 border-slate-800/70';

  const badgeHeaderClasses =
    theme === 'light'
      ? 'text-slate-900 border-slate-200'
      : 'text-slate-100 border-slate-800';

  // Render single device card
  const renderDeviceCard = (device: DeviceMetrics, isCompact = false) => {
    const isCurrent = device.type === 'current';
    const cpuBarColor = getLoadBarColor(device.cpu.percent);
    const memBarColor = getLoadBarColor(device.memory.percent);
    const sparkColor =
      device.cpu.percent >= 80 ? '#f43f5e' : device.cpu.percent >= 60 ? '#f59e0b' : '#10b981';

    return (
      <div
        key={device.id}
        className={`p-3 rounded-xl border transition-all ${subCardClasses} space-y-2.5`}
      >
        {/* Device Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-lg ${
                isCurrent
                  ? theme === 'light'
                    ? 'bg-cyan-100 text-cyan-700'
                    : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : theme === 'light'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
              }`}
            >
              {isCurrent ? <Laptop size={14} /> : <Server size={14} />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-xs text-slate-100 tracking-tight">
                  {isCurrent ? 'Thiết bị này' : 'Home Server'}
                </span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    device.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <span>{device.ip}</span>
                <span>•</span>
                <span className="text-emerald-500 font-sans">{device.network.pingMs}ms</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {meshPowerMode === 'battery-saver' && (
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 animate-pulse">
                <Leaf size={8} className="fill-emerald-400/40 text-emerald-400" /> Low-Power
              </span>
            )}
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                isCurrent
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                  : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
              }`}
            >
              {device.uptime}
            </span>
          </div>
        </div>

        {/* Metric 1: CPU */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Cpu size={12} className="text-cyan-400" />
              <span>CPU ({device.cpu.cores} Cores)</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400">{device.cpu.tempC}°C</span>
              <span
                className={`font-mono font-semibold ${
                  device.cpu.percent >= 80
                    ? 'text-rose-400'
                    : device.cpu.percent >= 60
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {device.cpu.percent}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${cpuBarColor}`}
                animate={{ width: `${device.cpu.percent}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            {!isCompact && (
              <div className="shrink-0 opacity-80 scale-90 origin-right">
                {renderSparkline(device.cpu.history, sparkColor)}
              </div>
            )}
          </div>
        </div>

        {/* Metric 2: Memory */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-400">
              <HardDrive size={12} className="text-indigo-400" />
              <span>RAM</span>
            </span>
            <span className="font-mono text-[11px]">
              <span className="text-slate-200 font-semibold">{device.memory.usedGb}</span>
              <span className="text-slate-500"> / {device.memory.totalGb} GB</span>{' '}
              <span className="text-slate-400 font-medium">({device.memory.percent}%)</span>
            </span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${memBarColor}`}
              animate={{ width: `${device.memory.percent}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {!isCompact && (
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5 font-mono">
              <span>Đệm (Cache): {device.memory.cacheGb} GB</span>
              <span>Trống: {(device.memory.totalGb - device.memory.usedGb).toFixed(1)} GB</span>
            </div>
          )}
        </div>

        {/* Metric 3: Network Traffic */}
        <div className="pt-1 border-t border-slate-800/60">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Wifi size={12} className="text-emerald-400" />
              <span>Mạng ({device.network.adapter.split(' ')[0]})</span>
            </span>
            <div className="flex items-center gap-2.5 font-mono text-[10px]">
              <span className="flex items-center gap-0.5 text-emerald-400">
                <ArrowDown size={10} />
                <span>{formatSpeed(device.network.downloadKbps)}</span>
              </span>
              <span className="flex items-center gap-0.5 text-cyan-400">
                <ArrowUp size={10} />
                <span>{formatSpeed(device.network.uploadKbps)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getProcessCategoryBadge = (category: PowerHungryProcess['category']) => {
    switch (category) {
      case 'vm':
        return (
          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Ảo hoá / VM
          </span>
        );
      case 'browser':
        return (
          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            Trình duyệt
          </span>
        );
      case 'dev':
        return (
          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Lập trình
          </span>
        );
      case 'media':
        return (
          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-medium bg-rose-500/20 text-rose-300 border border-rose-500/30">
            Đồ hoạ / Media
          </span>
        );
      case 'system':
      default:
        return (
          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-medium bg-slate-700/40 text-slate-300 border border-slate-600/40">
            Hệ thống
          </span>
        );
    }
  };

  const renderSmartPowerOptimizerPanel = () => {
    const isUnder15 = optimizerMetrics.isUnder15Active;
    const critDev = optimizerMetrics.criticalBatteryDevice;

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-2xl p-3.5 bg-gradient-to-br from-slate-950 via-slate-900/95 to-slate-950 border border-amber-500/40 shadow-2xl space-y-3 backdrop-blur-xl relative overflow-hidden"
      >
        {/* Glow effect */}
        <div
          className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
            isUnder15 ? 'bg-rose-500/15' : 'bg-amber-500/10'
          }`}
        />

        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-500/40 text-amber-300">
              <Zap size={15} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-slate-100">
                  Smart Power Optimizer (Tối Ưu Năng Lượng Thông Minh)
                </span>
                {isUnder15 ? (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-mono font-bold animate-pulse">
                    MỨC NGUY CẤP &lt; 15%
                  </span>
                ) : (
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono">
                    SẴN SÀNG
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400">
                Tự động kích hoạt khi pin dưới 15% và đề xuất đóng ứng dụng nền ngốn pin để kéo dài thời gian tác vụ quan trọng.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsSmartOptimizerOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 cursor-pointer transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Key Metrics Extension Dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
          <div className="p-2 rounded-xl bg-amber-950/25 border border-amber-500/30">
            <div className="text-slate-400 text-[9px]">Uptime kéo dài thêm:</div>
            <div className="text-sm font-bold font-mono text-amber-300 flex items-baseline gap-1">
              <span>+{optimizerMetrics.currentSavedMin > 0 ? optimizerMetrics.currentSavedMin : optimizerMetrics.totalPotentialGainMin}m</span>
              <span className="text-[9px] font-sans text-amber-400 font-normal">
                ({((optimizerMetrics.totalPotentialGainMin / 60) * 100).toFixed(0)}% tác vụ)
              </span>
            </div>
            <div className="text-[9px] text-slate-400 font-mono">
              {optimizerMetrics.terminatedCount}/{smartProcesses.length} đã dừng
            </div>
          </div>

          <div className="p-2 rounded-xl bg-emerald-950/25 border border-emerald-500/30">
            <div className="text-slate-400 text-[9px]">Giảm tốc độ xả pin:</div>
            <div className="text-sm font-bold font-mono text-emerald-300">
              -{optimizerMetrics.totalPotentialDrainReduction}%/h
            </div>
            <div className="text-[9px] text-slate-400 font-mono">
              Từ ~4.8% xuống 1.2%/h
            </div>
          </div>

          <div className="p-2 rounded-xl bg-cyan-950/25 border border-cyan-500/30">
            <div className="text-slate-400 text-[9px]">CPU & RAM giải phóng:</div>
            <div className="text-sm font-bold font-mono text-cyan-300">
              ~{optimizerMetrics.freedCpuPercent}% / {optimizerMetrics.freedRamMb}MB
            </div>
            <div className="text-[9px] text-slate-400 font-mono">
              Hạ nhiệt độ ~6°C
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-slate-400 text-[9px]">Thiết bị giám sát:</div>
            <div className="text-xs font-bold text-slate-200 truncate">
              {critDev ? `${critDev.shortName} (${critDev.currentBattery}%)` : 'MacBook Pro (78%)'}
            </div>
            <div className="text-[9px] text-rose-400 font-medium font-mono">
              {isUnder15 ? 'Đang kích hoạt khẩn cấp' : 'Ngưỡng kích hoạt: ≤15%'}
            </div>
          </div>
        </div>

        {/* Toolbar: Testing simulations, Critical Task Mode & Auto-trigger Toggle */}
        <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-2 flex-wrap text-[10px]">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleCriticalTaskMode}
              className={`px-2 py-1 rounded-lg border text-[10px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isCriticalTaskMode
                  ? 'bg-amber-500/25 text-amber-200 border-amber-500/60 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title="Chế độ Tác vụ Quan trọng: Giữ tài nguyên tối đa cho IDE & Terminal, đóng băng các tác vụ nền không cần thiết"
            >
              <ShieldCheck size={11} className={isCriticalTaskMode ? 'text-amber-400' : ''} />
              <span>Chế độ Tác vụ Quan trọng</span>
              {isCriticalTaskMode && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />}
            </button>

            <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer ml-1">
              <input
                type="checkbox"
                checked={autoOptimizerUnder15}
                onChange={(e) => handleToggleAutoOptimizer(e.target.checked)}
                className="rounded border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
              />
              <span>Tự động kích hoạt khi pin &lt; 15%</span>
            </label>
          </div>

          {/* Quick Simulation Buttons to let user test immediately */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleSimulateBatteryDropUnder15}
              className="px-2 py-0.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[9px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
              title="Mô phỏng pin rơi xuống 13% (<15%) để kiểm thử quy trình tự động"
            >
              <TrendingDown size={10} className="text-rose-400" />
              <span>Thử Pin 13% (&lt;15%)</span>
            </button>

            <button
              onClick={handleRestoreSimulatedBattery}
              className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[9px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
              title="Khôi phục pin về 78%"
            >
              <RotateCcw size={10} />
              <span>Khôi phục pin 78%</span>
            </button>
          </div>
        </div>

        {/* Process Termination Recommendations List */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] px-1 text-slate-400">
            <span className="font-semibold text-slate-200">
              Danh sách ứng dụng ngầm đề xuất tạm dừng:
            </span>
            <span className="font-mono text-[10px]">
              {smartProcesses.filter((p) => !p.isTerminated).length} đang chạy / {smartProcesses.length} tiến trình
            </span>
          </div>

          <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
            {smartProcesses.map((proc) => {
              const isTerminated = proc.isTerminated;
              const isCriticalWork = proc.priority === 'critical_work';

              return (
                <div
                  key={proc.id}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs ${
                    isTerminated
                      ? 'bg-slate-950/40 border-slate-800/40 opacity-60'
                      : isCriticalWork
                      ? 'bg-amber-950/15 border-amber-500/30 hover:border-amber-500/50'
                      : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Left info */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-100 flex items-center gap-1.5">
                        <Terminal size={12} className={isTerminated ? 'text-slate-500' : 'text-cyan-400'} />
                        <span className={isTerminated ? 'line-through text-slate-400' : ''}>{proc.name}</span>
                      </span>

                      {getProcessCategoryBadge(proc.category)}

                      <span className="text-[9px] font-mono text-slate-500">
                        PID: {proc.pid}
                      </span>

                      {isCriticalWork && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          ⚠️ Đang phục vụ code
                        </span>
                      )}
                    </div>

                    <p className="text-[10px] text-slate-400 line-clamp-1 leading-relaxed">
                      {proc.impactDescription}
                    </p>

                    <div className="flex items-center gap-3 text-[9px] font-mono text-slate-400 pt-0.5">
                      <span>CPU: <strong className={isTerminated ? 'text-slate-500' : 'text-rose-300'}>{proc.cpuPercent}%</strong></span>
                      <span>RAM: <strong className={isTerminated ? 'text-slate-500' : 'text-indigo-300'}>{proc.ramMb} MB</strong></span>
                      <span>Giảm xả: <strong className="text-emerald-400">-{proc.drainReductionPerHour}%/h</strong></span>
                      <span className="text-amber-300 font-bold">Kéo dài: +{proc.uptimeExtensionMinutes}m</span>
                    </div>
                  </div>

                  {/* Right Action */}
                  <div className="shrink-0 flex items-center gap-1.5">
                    {isTerminated ? (
                      <button
                        onClick={() => handleTerminateSingleProcess(proc.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700/80 flex items-center gap-1 cursor-pointer transition-colors"
                        title="Khôi phục tiến trình này"
                      >
                        <RotateCcw size={10} />
                        <span>Khôi phục</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleTerminateSingleProcess(proc.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border flex items-center gap-1 transition-all cursor-pointer ${
                          isCriticalWork
                            ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-500/40'
                            : 'bg-rose-500/20 hover:bg-rose-500/35 text-rose-200 border-rose-500/40 shadow-sm'
                        }`}
                        title="Đóng tiến trình này để giải phóng pin"
                      >
                        <Power size={10} className={isCriticalWork ? 'text-amber-400' : 'text-rose-400'} />
                        <span>Dừng tiến trình</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Actions Footer */}
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-2.5 flex-wrap gap-2 text-[10px]">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTerminateAllSuggested}
              disabled={optimizerMetrics.suggestedCount === 0}
              className={`px-3 py-1.5 rounded-xl text-white font-semibold flex items-center gap-1.5 shadow-lg transition-all cursor-pointer ${
                optimizerMetrics.suggestedCount === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 border border-amber-400/40 shadow-amber-500/20'
              }`}
            >
              <Zap size={12} className="fill-white" />
              <span>Dừng Toàn Bộ {optimizerMetrics.suggestedCount} Ứng Dụng Đề Xuất (+{optimizerMetrics.pendingSavedMin}m)</span>
            </button>

            <button
              onClick={handleRestoreAllProcesses}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer flex items-center gap-1"
            >
              <RotateCcw size={11} />
              <span>Khôi phục tất cả</span>
            </button>
          </div>

          <button
            onClick={() => {
              if (onSpeakText) {
                onSpeakText(
                  `Hoppi Smart Power Optimizer báo cáo: Khi pin dưới 15%, việc đóng ${optimizerMetrics.suggestedCount} tiến trình nặng như Docker, Chrome GPU và Xcode Simulator sẽ giúp kéo dài thêm ${optimizerMetrics.totalPotentialGainMin} phút uptime cho tác vụ quan trọng của bạn!`
                );
              }
            }}
            className="px-2.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Radio size={11} className="text-cyan-400 animate-pulse" />
            <span>Nghe Hoppi phân tích</span>
          </button>
        </div>
      </motion.div>
    );
  };

  const renderBatteryTelemetrySection = () => {
    const criticalDevice = batteryPredictions.find((d) => d.isCritical);
    const avgDischarge = (
      batteryDevices.reduce((sum, d) => sum + d.dischargeRatePerHour, 0) / batteryDevices.length
    ).toFixed(1);

    return (
      <div className="space-y-3">
        {/* Toast Alert Banner */}
        <AnimatePresence>
          {batteryNotice && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between gap-2 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Bell size={13} className="text-amber-400 animate-bounce flex-shrink-0" />
                <span className="font-medium text-[11px] leading-tight">{batteryNotice}</span>
              </div>
              <button
                onClick={() => setBatteryNotice(null)}
                className="p-1 rounded-md text-amber-400 hover:bg-amber-500/20 cursor-pointer"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Smart Power Optimizer Notice Banner */}
        <AnimatePresence>
          {optimizerNotice && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-rose-500/15 to-slate-900 border border-amber-500/50 text-amber-200 text-xs flex items-center justify-between gap-2 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-amber-400 animate-pulse flex-shrink-0" />
                <span className="font-medium text-[11px] leading-tight">{optimizerNotice}</span>
              </div>
              <button
                onClick={() => setOptimizerNotice(null)}
                className="p-1 rounded-md text-amber-400 hover:bg-amber-500/20 cursor-pointer"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ABNORMAL BATTERY DRAIN SPIKE ALERT BANNER */}
        {abnormalDrainAnomaly && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-3 rounded-2xl bg-gradient-to-r from-rose-950/90 via-slate-900/95 to-amber-950/80 border border-rose-500/70 shadow-xl shadow-rose-950/50 space-y-2 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center justify-between flex-wrap gap-2 relative z-10">
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 mt-0.5 flex-shrink-0">
                  <AlertOctagon size={18} className="animate-pulse text-rose-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 font-bold text-xs text-rose-200">
                    <span>PHÁT HIỆN ĐỘT BIẾN XẢ PIN BẤT THƯỜNG</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-mono text-[9px] font-black">
                      +{abnormalDrainAnomaly.surgePercent}% VƯỢT CHUẨN
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 mt-0.5 leading-relaxed">
                    <strong className="text-cyan-300 font-semibold">{abnormalDrainAnomaly.device.name}</strong> đang bị xả pin ở mức{' '}
                    <strong className="text-rose-400 font-mono">{abnormalDrainAnomaly.currentRate}%/h</strong> (chuẩn baseline: {abnormalDrainAnomaly.baselineRate}%/h), làm mất ~<strong className="text-amber-300 font-mono">{abnormalDrainAnomaly.hoursLost}h</strong> uptime do các tiến trình ngầm!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleRunDiagnosticRoutine}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 hover:brightness-110 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-lg shadow-rose-500/30 transition-all cursor-pointer"
                >
                  <Zap size={12} className="fill-white" />
                  <span>Tối Ưu Ngay (Chẩn Đoán AI)</span>
                </button>
                <button
                  onClick={() => setAbnormalNoticeDismissed(true)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors cursor-pointer"
                  title="Ẩn thông báo tạm thời"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* AUTOMATED EMERGENCY WARNING BANNER: BATTERY DROPPED BELOW 15% */}
        {optimizerMetrics.isUnder15Active && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 rounded-2xl bg-gradient-to-r from-rose-950/80 via-slate-900/90 to-amber-950/70 border border-rose-500/60 shadow-xl shadow-rose-950/40 space-y-2 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-rose-200">
                    <ShieldAlert size={14} className="text-rose-400" />
                    <span>CẢNH BÁO PIN NGUY CẤP &lt; 15% ({optimizerMetrics.criticalBatteryDevice?.name}: {optimizerMetrics.criticalBatteryDevice?.currentBattery}%)</span>
                  </div>
                  <p className="text-[10px] text-slate-300">
                    Hoppi Smart Power Optimizer đề xuất kết thúc {optimizerMetrics.suggestedCount} tiến trình ngầm để kéo dài thêm <strong className="text-amber-300 font-mono">+{optimizerMetrics.pendingSavedMin} phút</strong> hoạt động!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleTerminateAllSuggested}
                  className="px-2.5 py-1 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-bold text-[10px] flex items-center gap-1 shadow-md shadow-rose-500/30 transition-all cursor-pointer"
                >
                  <Zap size={11} className="fill-white" />
                  <span>Dừng Ngay ({optimizerMetrics.suggestedCount} Apps)</span>
                </button>
                <button
                  onClick={() => setIsSmartOptimizerOpen(true)}
                  className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-[10px] font-medium border border-slate-700 transition-colors cursor-pointer"
                >
                  Chi tiết tiến trình
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Section Header Controls */}
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-1.5">
            <BatteryCharging size={14} className="text-amber-400" />
            <span className="text-xs font-semibold text-slate-100">
              Biểu Đồ Xả Pin 24h & Dự Báo AI
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Power Saver Toggle Switch Button in Battery Header */}
            <button
              onClick={() => toggleMeshPowerMode()}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-medium flex items-center gap-1.5 border transition-all cursor-pointer ${
                meshPowerMode === 'battery-saver'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm font-semibold'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
              }`}
              title="Power Saver: Ép toàn bộ thiết bị mesh chuyển sang chế độ năng lượng thấp (-60% xả pin)"
            >
              <Leaf size={10} className={meshPowerMode === 'battery-saver' ? 'text-emerald-400 fill-emerald-400/30 animate-pulse' : ''} />
              <span>Power Saver</span>
              <div
                className={`w-5 h-3 rounded-full p-0.5 transition-colors flex items-center ${
                  meshPowerMode === 'battery-saver' ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-white shadow-xs" />
              </div>
            </button>

            {/* Optimize Now Button */}
            <button
              onClick={handleRunDiagnosticRoutine}
              className="px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 bg-gradient-to-r from-amber-500/25 via-rose-500/25 to-cyan-500/25 text-amber-200 border border-amber-400/50 hover:border-amber-300 hover:brightness-110 shadow-sm cursor-pointer transition-all"
              title="Khởi chạy chẩn đoán và đóng tiến trình ngầm gây hao pin"
            >
              <Zap size={10} className="text-amber-400 fill-amber-400 animate-pulse" />
              <span>Tối Ưu Ngay</span>
            </button>
            {/* Smart Power Optimizer Toggle Button */}
            <button
              onClick={() => setIsSmartOptimizerOpen(!isSmartOptimizerOpen)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-medium flex items-center gap-1 border transition-all cursor-pointer ${
                isSmartOptimizerOpen
                  ? 'bg-gradient-to-r from-amber-500/25 to-rose-500/20 text-amber-200 border-amber-500/60 shadow-md shadow-amber-500/20 font-semibold'
                  : optimizerMetrics.isUnder15Active
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
              }`}
              title="Smart Power Optimizer: Tự động đề xuất tắt ứng dụng ngầm khi pin < 15% để kéo dài thời gian tác vụ"
            >
              <Zap size={10} className={optimizerMetrics.isUnder15Active ? 'text-rose-400' : 'text-amber-400'} />
              <span>Smart Optimizer</span>
              {optimizerMetrics.isUnder15Active ? (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping ml-0.5" />
              ) : optimizerMetrics.currentSavedMin > 0 ? (
                <span className="text-[9px] font-mono text-emerald-400 font-bold ml-0.5">
                  +{optimizerMetrics.currentSavedMin}m
                </span>
              ) : null}
            </button>

            {/* Custom Battery Alert Threshold Toggle Button */}
            <button
              onClick={() => setIsThresholdSettingsOpen(!isThresholdSettingsOpen)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-medium flex items-center gap-1 border transition-all cursor-pointer ${
                isThresholdSettingsOpen
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
              }`}
              title="Cài đặt ngưỡng cảnh báo pin tùy chỉnh & Kích hoạt Hoppi Notice"
            >
              <SlidersHorizontal size={10} className={isThresholdSettingsOpen ? 'text-rose-400' : ''} />
              <span>Ngưỡng: {customAlertThreshold}%</span>
              {batteryDevices.some((d) => d.currentBattery <= customAlertThreshold) && (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping ml-0.5" />
              )}
            </button>

            {/* Device Heat Map Quick Toggle Button */}
            <button
              onClick={() => setBatterySubView(batterySubView === 'heatmap' ? 'forecast' : 'heatmap')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-medium flex items-center gap-1 border transition-all cursor-pointer ${
                batterySubView === 'heatmap'
                  ? 'bg-gradient-to-r from-rose-500/25 to-amber-500/20 text-rose-200 border-rose-500/60 shadow-md shadow-rose-500/20 font-semibold'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
              }`}
              title="Bản Đồ Nhiệt: Lưới mã màu biểu diễn tương quan công suất tiêu thụ & Định vị thiết bị hoạt động mạnh nhất"
            >
              <Flame size={10} className={batterySubView === 'heatmap' ? 'text-rose-400 animate-pulse' : 'text-amber-400'} />
              <span>Bản Đồ Nhiệt</span>
              {deviceHeatMapData?.mostActiveDevice && (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping ml-0.5" />
              )}
            </button>

            {/* 60m Sparkline Toggle Button */}
            <button
              onClick={() => setShow60mSparklineCard((prev) => !prev)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-medium flex items-center gap-1 border transition-all cursor-pointer ${
                show60mSparklineCard
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm font-semibold'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
              }`}
              title="Bật/Tắt Biểu Đồ Sparkline Xả Pin 60 Phút Qua"
            >
              <TrendingDown size={10} className={show60mSparklineCard ? 'text-cyan-400' : ''} />
              <span>Sparkline 60m</span>
            </button>

            <button
              onClick={() => setShowDepletionOverlay((prev) => !prev)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-medium flex items-center gap-1 border transition-all cursor-pointer ${
                showDepletionOverlay
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
              }`}
              title="Bật/Tắt Lớp Phủ Dự Báo Cạn Nguồn (Depletion Overlay)"
            >
              <Sparkles size={10} className={showDepletionOverlay ? 'text-amber-400' : ''} />
              <span>{showDepletionOverlay ? 'Lớp phủ: BẬT' : 'Lớp phủ: TẮT'}</span>
            </button>

            <button
              onClick={handleSimulateDrainStep}
              className="px-1.5 py-0.5 rounded-lg text-[10px] bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60 transition-colors cursor-pointer"
              title="Mô phỏng tiêu hao pin (-3%) để thử nghiệm dự báo"
            >
              <TrendingDown size={11} className="inline mr-0.5 text-rose-400" />
              -3%
            </button>
          </div>
        </div>

        {/* 60-MINUTE BATTERY DISCHARGE SPARKLINE CARD */}
        <AnimatePresence>
          {show60mSparklineCard && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
            >
              {render60mDischargeSparklineCard()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* SMART POWER OPTIMIZER INTERACTIVE PANEL */}
        <AnimatePresence>
          {isSmartOptimizerOpen && renderSmartPowerOptimizerPanel()}
        </AnimatePresence>

        {/* CUSTOM BATTERY ALERT THRESHOLD CONFIGURATION PANEL */}
        <AnimatePresence>
          {isThresholdSettingsOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl p-3 bg-gradient-to-br from-rose-950/30 via-slate-900/95 to-slate-950 border border-rose-500/40 shadow-xl space-y-2.5 backdrop-blur-md"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-rose-500/20 pb-2">
                <div className="flex items-center gap-1.5">
                  <ShieldAlert size={14} className="text-rose-400" />
                  <span className="font-mono text-[11px] font-bold text-rose-200 uppercase tracking-wide">
                    Cấu Hình Ngưỡng Cảnh Báo Pin Tùy Chỉnh
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/40">
                    {customAlertThreshold}%
                  </span>
                  <button
                    onClick={() => setIsThresholdSettingsOpen(false)}
                    className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>

              {/* Slider & Presets */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] text-slate-300">
                  <span>Điều chỉnh mức % kích hoạt thông báo Hoppi:</span>
                  <span className="font-mono font-bold text-rose-300">{customAlertThreshold}% pin</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="1"
                  value={customAlertThreshold}
                  onChange={(e) => handleUpdateThreshold(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono">
                  <span>10% (Tối thiểu)</span>
                  <span>25% (Khuyến nghị)</span>
                  <span>50% (Cảnh báo sớm)</span>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1 pt-1 flex-wrap">
                  {[15, 20, 25, 30, 40].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleUpdateThreshold(preset)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border transition-all cursor-pointer ${
                        customAlertThreshold === preset
                          ? 'bg-rose-500 text-white border-rose-400 font-bold shadow-sm shadow-rose-500/40'
                          : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {preset}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Connected Devices Status against configured threshold */}
              <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 text-[10px]">
                <div className="text-slate-400 font-medium">Trạng thái thiết bị so với ngưỡng {customAlertThreshold}%:</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  {batteryDevices.map((dev) => {
                    const isBelow = dev.currentBattery <= customAlertThreshold;
                    return (
                      <div
                        key={dev.id}
                        className={`p-1.5 rounded-lg border flex items-center justify-between ${
                          isBelow
                            ? 'bg-rose-500/15 border-rose-500/40 text-rose-200'
                            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        <span className="font-medium truncate">{dev.shortName}:</span>
                        <span className="font-mono font-bold flex items-center gap-1">
                          <span>{dev.currentBattery}%</span>
                          {isBelow ? (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-rose-500 text-white font-bold">Dưới ngưỡng</span>
                          ) : (
                            <span className="text-[9px] text-emerald-400">An toàn</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons: Toggle Auto-Notice & Test Trigger */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80 text-[10px] flex-wrap">
                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoCompletionNoticeEnabled}
                    onChange={(e) => setAutoCompletionNoticeEnabled(e.target.checked)}
                    className="rounded border-slate-700 text-rose-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Tự động kích hoạt Hoppi Completion Notice khi pin chạm ngưỡng</span>
                </label>

                <button
                  onClick={() => {
                    const lowest = [...batteryDevices].sort((a, b) => a.currentBattery - b.currentBattery)[0];
                    if (lowest) triggerHoppiNoticeForDevice(lowest, customAlertThreshold, true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/25 hover:bg-rose-500/40 text-rose-200 border border-rose-500/50 font-medium flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap"
                  title="Thử nghiệm hiển thị thông báo Hoppi Completion Notice ngay lập tức"
                >
                  <BellRing size={11} className="text-rose-400" />
                  <span>Thử thông báo Hoppi</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 'PREDICTED DEPLETION TIME' HUD OVERLAY */}
        <AnimatePresence>
          {showDepletionOverlay && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl p-3 bg-gradient-to-br from-amber-950/30 via-slate-900/90 to-slate-950 border border-amber-500/30 shadow-xl space-y-2.5 backdrop-blur-md"
            >
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  <span className="font-mono text-[10px] tracking-wider text-amber-300 font-bold uppercase">
                    Lớp Phủ Dự Báo Cạn Nguồn (Depletion HUD)
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 font-mono">
                  Tốc độ Mesh TB: <strong className="text-amber-400">-{avgDischarge}%/h</strong>
                </span>
              </div>

              {/* Connected Devices Prediction Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {batteryPredictions.map((dev) => {
                  const barColor =
                    dev.currentBattery <= 20
                      ? 'bg-rose-500'
                      : dev.currentBattery <= 50
                      ? 'bg-amber-400'
                      : 'bg-emerald-400';

                  return (
                    <div
                      key={dev.id}
                      className={`p-2.5 rounded-xl border transition-all ${
                        dev.isCritical
                          ? 'bg-rose-950/25 border-rose-500/40 shadow-rose-950/20 shadow-md'
                          : dev.isWarning
                          ? 'bg-amber-950/20 border-amber-500/30'
                          : 'bg-slate-900/70 border-slate-800'
                      }`}
                    >
                      {/* Device Header */}
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {getDeviceIcon(dev.type)}
                          <span className="text-xs font-semibold text-slate-200 truncate" title={dev.name}>
                            {dev.shortName}
                          </span>
                        </div>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                            dev.isCritical
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : dev.isWarning
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}
                        >
                          {dev.isCritical ? 'Nguy cấp' : dev.isWarning ? 'Lưu ý' : 'Khỏe'}
                        </span>
                      </div>

                      {/* Battery Bar */}
                      <div className="space-y-1 mb-2">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-400 flex items-center gap-1">
                            {getBatteryIcon(dev.currentBattery)}
                            <span>Mức pin:</span>
                          </span>
                          <span className="font-mono font-bold text-slate-100">{dev.currentBattery}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${dev.currentBattery}%` }}
                            transition={{ duration: 0.5 }}
                            className={`h-full rounded-full ${barColor}`}
                          />
                        </div>
                      </div>

                      {/* Depletion Countdown Details */}
                      <div className="space-y-1 text-[10px] bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 flex items-center gap-1">
                            <TrendingDown size={10} className="text-rose-400" />
                            <span>Tốc độ xả (60m):</span>
                          </span>
                          <div className="flex items-center gap-1.5">
                            {renderMiniDischargeSparkline(dev.dischargeHistory60m || [], dev.color, 64, 18)}
                            <span className="font-mono text-rose-300 font-semibold">
                              -{dev.dischargeRatePerHour}%/h
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 flex items-center gap-1">
                            <Clock size={10} className="text-amber-400" />
                            <span className="font-medium">Dự kiến cạn:</span>
                          </span>
                          <span className="font-mono font-bold text-amber-300">{dev.depletionTimeStr}</span>
                        </div>

                        <div className="flex items-center justify-between text-[9px] text-slate-400">
                          <span>Thời gian còn:</span>
                          <span className="font-mono text-slate-200">{dev.formattedRemaining}</span>
                        </div>

                        <div className="pt-1 mt-1 border-t border-slate-800/80 flex items-center justify-between text-[9px]">
                          <span className="text-slate-400">Sạc trước mốc 20%:</span>
                          <span className="font-mono text-cyan-300 font-semibold">
                            {dev.chargeDeadlineStr}
                          </span>
                        </div>
                      </div>

                      {/* Quick Interactive Actions */}
                      <div className="flex items-center gap-1 mt-2">
                        <button
                          onClick={() => handleTriggerChargeAlert(dev.id)}
                          className="flex-1 py-1 px-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[10px] font-medium flex items-center justify-center gap-1 transition-all cursor-pointer"
                          title="Hoppi phát cảnh báo giọng nói nhắc nhở cắm sạc"
                        >
                          <Bell size={10} />
                          <span>Báo sạc</span>
                        </button>
                        <button
                          onClick={() => handleSimulateRecharge(dev.id)}
                          className="py-1 px-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[10px] font-medium flex items-center justify-center gap-0.5 transition-all cursor-pointer"
                          title="Mô phỏng cắm sạc (+25%)"
                        >
                          <Zap size={10} />
                          <span>+25%</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subview Mode Switcher: Forecast vs Heat Map vs Radial Power Distribution vs Historical Usage */}
        <div className="flex items-center justify-between p-1 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] gap-1">
          <button
            onClick={() => setBatterySubView('forecast')}
            className={`flex-1 py-1 px-1.5 rounded-lg font-medium text-center transition-all cursor-pointer flex items-center justify-center gap-1 truncate ${
              batterySubView === 'forecast'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp size={11} className={batterySubView === 'forecast' ? 'text-amber-400' : ''} />
            <span>Dự Báo & 24h</span>
          </button>

          <button
            onClick={() => setBatterySubView('heatmap')}
            className={`flex-1 py-1 px-1.5 rounded-lg font-medium text-center transition-all cursor-pointer flex items-center justify-center gap-1 truncate ${
              batterySubView === 'heatmap'
                ? 'bg-gradient-to-r from-rose-500/25 to-amber-500/20 text-rose-200 border border-rose-500/50 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Bản Đồ Nhiệt: Lưới mã màu biểu diễn tương quan công suất tiêu thụ & Định vị thiết bị hoạt động mạnh nhất"
          >
            <Flame size={11} className={batterySubView === 'heatmap' ? 'text-rose-400 animate-pulse' : 'text-slate-400'} />
            <span>Bản Đồ Nhiệt</span>
          </button>

          <button
            onClick={() => setBatterySubView('distribution')}
            className={`flex-1 py-1 px-1.5 rounded-lg font-medium text-center transition-all cursor-pointer flex items-center justify-center gap-1 truncate ${
              batterySubView === 'distribution'
                ? 'bg-gradient-to-r from-amber-500/25 to-rose-500/20 text-amber-200 border border-amber-500/50 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Biểu đồ hình nan hoa (Radial Bar Chart) phân bổ điện năng toàn mạng Mesh & Xác định thiết bị ngốn điện nhất"
          >
            <Layers size={11} className={batterySubView === 'distribution' ? 'text-amber-400' : 'text-slate-400'} />
            <span>Phân Bổ Điện (Radial)</span>
          </button>

          <button
            onClick={() => setBatterySubView('historical')}
            className={`flex-1 py-1 px-1.5 rounded-lg font-medium text-center transition-all cursor-pointer flex items-center justify-center gap-1 truncate ${
              batterySubView === 'historical'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History size={11} className={batterySubView === 'historical' ? 'text-cyan-400' : ''} />
            <span>Lịch Sử 7 Ngày</span>
          </button>
        </div>

        {batterySubView === 'forecast' ? (
          <>
            {/* Device Visibility Toggle Chips for the LineChart */}
            <div className="flex items-center justify-between gap-1 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[10px]">
              <span className="text-slate-400 font-medium">Bật/Tắt hiển thị thiết bị:</span>
              <div className="flex items-center gap-1">
                {batteryDevices.map((dev) => {
                  const isVisible = visibleDevices[dev.id] !== false;
                  return (
                    <button
                      key={dev.id}
                      onClick={() => toggleDeviceVisibility(dev.id)}
                      style={{
                        borderColor: isVisible ? dev.color : 'rgba(71, 85, 105, 0.4)',
                        backgroundColor: isVisible ? `${dev.color}18` : 'transparent',
                        color: isVisible ? dev.color : '#94a3b8',
                      }}
                      className="px-2 py-0.5 rounded-lg border text-[10px] font-medium flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: isVisible ? dev.color : '#64748b' }}
                      />
                      <span>{dev.shortName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RECHARTS BATTERY DISCHARGE LINE CHART */}
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/90 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-semibold text-slate-200">Biểu đồ Lịch sử 24h & Quỹ đạo xả pin tương lai</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-slate-400">
                    <span className="w-3 h-0.5 bg-cyan-400 inline-block"></span>
                    <span>Lịch sử (Solid)</span>
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <span className="w-3 h-0.5 border-t border-dashed border-amber-400 inline-block"></span>
                    <span>Dự báo AI (Dashed)</span>
                  </span>
                  <span className="flex items-center gap-1 text-rose-400">
                    <span className="w-3 h-0.5 border-t border-dashed border-rose-500 inline-block"></span>
                    <span>Ngưỡng {customAlertThreshold}%</span>
                  </span>
                </div>
              </div>

              <div className="w-full h-[230px] pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={batteryChartData} margin={{ top: 12, right: 12, left: -22, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.25} />
                    <XAxis
                      dataKey="time"
                      stroke="#64748b"
                      tick={{ fontSize: 9, fill: '#94a3b8' }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      domain={[0, 100]}
                      stroke="#64748b"
                      tick={{ fontSize: 9, fill: '#94a3b8' }}
                      ticks={[0, 20, 40, 60, 80, 100]}
                      unit="%"
                    />
                    <ReferenceLine
                      x="Hiện tại"
                      stroke="#38bdf8"
                      strokeDasharray="3 3"
                      label={{
                        value: 'Hiện tại (T=0)',
                        fill: '#38bdf8',
                        fontSize: 9,
                        position: 'insideTopLeft',
                      }}
                    />
                    <ReferenceLine
                      y={customAlertThreshold}
                      stroke="#f43f5e"
                      strokeDasharray="3 3"
                      strokeWidth={1.5}
                      label={{
                        value: `Ngưỡng cảnh báo (${customAlertThreshold}%)`,
                        fill: '#f43f5e',
                        fontSize: 9,
                        position: 'insideBottomRight',
                      }}
                    />
                    <Tooltip content={<CustomBatteryTooltip />} />
                    <Legend
                      wrapperStyle={{ fontSize: '10px', paddingTop: '6px' }}
                      iconSize={8}
                    />

                    {/* 24h Historical Lines (Solid) */}
                    {visibleDevices.macbook !== false && (
                      <Line
                        type="monotone"
                        dataKey="macbook"
                        name="MacBook M3 (24h)"
                        stroke="#22d3ee"
                        strokeWidth={2}
                        dot={{ r: 2, fill: '#22d3ee' }}
                        activeDot={{ r: 4 }}
                        connectNulls={false}
                      />
                    )}
                    {visibleDevices.iphone !== false && (
                      <Line
                        type="monotone"
                        dataKey="iphone"
                        name="iPhone 16 Pro (24h)"
                        stroke="#fb7185"
                        strokeWidth={2}
                        dot={{ r: 2, fill: '#fb7185' }}
                        activeDot={{ r: 4 }}
                        connectNulls={false}
                      />
                    )}
                    {visibleDevices.ipad !== false && (
                      <Line
                        type="monotone"
                        dataKey="ipad"
                        name="iPad Pro M2 (24h)"
                        stroke="#a78bfa"
                        strokeWidth={2}
                        dot={{ r: 2, fill: '#a78bfa' }}
                        activeDot={{ r: 4 }}
                        connectNulls={false}
                      />
                    )}

                    {/* Forward Prediction Lines (Dashed) */}
                    {visibleDevices.macbook !== false && (
                      <Line
                        type="monotone"
                        dataKey="macbookPredicted"
                        name="MacBook (Dự kiến)"
                        stroke="#22d3ee"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={{ r: 2, fill: '#22d3ee' }}
                        activeDot={{ r: 4 }}
                        connectNulls={false}
                      />
                    )}
                    {visibleDevices.iphone !== false && (
                      <Line
                        type="monotone"
                        dataKey="iphonePredicted"
                        name="iPhone (Dự kiến)"
                        stroke="#fb7185"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={{ r: 2, fill: '#fb7185' }}
                        activeDot={{ r: 4 }}
                        connectNulls={false}
                      />
                    )}
                    {visibleDevices.ipad !== false && (
                      <Line
                        type="monotone"
                        dataKey="ipadPredicted"
                        name="iPad (Dự kiến)"
                        stroke="#a78bfa"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={{ r: 2, fill: '#a78bfa' }}
                        activeDot={{ r: 4 }}
                        connectNulls={false}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Info size={11} className="text-cyan-400" />
                  <span>Dự báo dựa trên gradient xả 24h và chu kỳ sạc thực tế</span>
                </span>
                {criticalDevice && (
                  <span className="text-rose-400 font-semibold animate-pulse">
                    ⚠️ {criticalDevice.shortName} cần cắm sạc sớm!
                  </span>
                )}
              </div>
            </div>
          </>
        ) : batterySubView === 'heatmap' ? (
          renderDeviceHeatMapGrid()
        ) : batterySubView === 'distribution' ? (
          renderRadialPowerDistributionSection()
        ) : (
          /* HISTORICAL USAGE VIEW: 7-DAY HOURLY CONSUMPTION BAR CHART WITH CSV EXPORT */
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/90 shadow-lg space-y-3">
            {/* Header Controls: Title & CSV Export & Stack Mode */}
            <div className="flex items-center justify-between gap-2 flex-wrap pb-1 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <BarChart3 size={14} className="text-cyan-400" />
                <span className="text-xs font-semibold text-slate-100">
                  Lịch Sử Tiêu Hao Pin 7 Ngày (Từng Giờ)
                </span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {/* EXPORT 7-DAY CSV BUTTON */}
                <button
                  onClick={handleExportHistoricalCSV}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-500/40 text-emerald-200 text-[10px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:shadow-emerald-500/20"
                  title="Xuất bảng dữ liệu tiêu thụ pin 7 ngày qua (168 giờ) ra file CSV để mở trên Excel hoặc Google Sheets"
                >
                  <Download size={11} className="text-emerald-400" />
                  <span>Xuất CSV (7 Ngày)</span>
                </button>

                {/* Stack vs Grouped Bar Chart Mode Toggle */}
                <button
                  onClick={() => setHistoricalIsStacked(!historicalIsStacked)}
                  className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700/80 transition-colors cursor-pointer"
                  title="Chuyển chế độ xếp chồng (Stacked) hoặc nhóm riêng biệt (Grouped)"
                >
                  {historicalIsStacked ? 'Cột: Xếp chồng' : 'Cột: Nhóm riêng'}
                </button>

                {/* Voice Summary Audio Report */}
                <button
                  onClick={handleSpeakTrendSummary}
                  className="px-2 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[10px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  title="Nghe Hoppi đọc tóm tắt xu hướng tiêu thụ 7 ngày"
                >
                  <Radio size={10} className="text-cyan-400 animate-pulse" />
                  <span>Đọc tóm tắt</span>
                </button>
              </div>
            </div>

            {/* Quick Day Selector Chips */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px]">
              <span className="text-slate-400 font-medium whitespace-nowrap mr-1 flex items-center gap-1">
                <Calendar size={11} className="text-cyan-400" />
                <span>Ngày:</span>
              </span>
              {HISTORICAL_DAYS.map((dayMeta) => {
                const isSelected = historicalSelectedDay === dayMeta.id;
                return (
                  <button
                    key={dayMeta.id}
                    onClick={() => setHistoricalSelectedDay(dayMeta.id)}
                    className={`px-2 py-0.5 rounded-lg border font-medium whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/25 text-cyan-200 border-cyan-500/50 shadow-sm font-semibold'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {dayMeta.shortLabel}
                  </button>
                );
              })}
            </div>

            {/* 4 Summary Analytics Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-0.5">
                <div className="text-[9px] text-slate-400 flex items-center justify-between">
                  <span>Giờ xả cao điểm:</span>
                  <span className="text-rose-400 font-bold">PEAK</span>
                </div>
                <div className="font-mono text-xs font-bold text-slate-100 truncate">
                  {historicalTrendsMeta.peakHour}
                </div>
                <div className="text-[9px] text-rose-300 font-mono">
                  -{historicalTrendsMeta.peakDrainRate}%/h toàn Mesh
                </div>
              </div>

              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-0.5">
                <div className="text-[9px] text-slate-400 flex items-center justify-between">
                  <span>Khung giờ tiết kiệm:</span>
                  <span className="text-emerald-400 font-bold">ECO</span>
                </div>
                <div className="font-mono text-xs font-bold text-slate-100 truncate">
                  {historicalTrendsMeta.ecoHour}
                </div>
                <div className="text-[9px] text-emerald-300 font-mono">
                  -{historicalTrendsMeta.ecoDrainRate}%/h toàn Mesh
                </div>
              </div>

              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-0.5">
                <div className="text-[9px] text-slate-400 flex items-center justify-between">
                  <span>Tổng tiêu hao 7 ngày:</span>
                  <span className="text-cyan-400 font-bold">7-DAY</span>
                </div>
                <div className="font-mono text-xs font-bold text-slate-100">
                  {historicalTrendsMeta.meshTotal}% pin
                </div>
                <div className="text-[9px] text-slate-400 font-mono">
                  TB {historicalTrendsMeta.dailyAvg}% / ngày
                </div>
              </div>

              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-0.5">
                <div className="text-[9px] text-slate-400 flex items-center justify-between">
                  <span>TB ngày đang chọn:</span>
                  <span className="text-amber-400 font-bold">DAY AVG</span>
                </div>
                <div className="font-mono text-xs font-bold text-amber-300">
                  {currentDayAvgDrain}%/h
                </div>
                <div className="text-[9px] text-slate-400 font-mono">
                  24 khung giờ đo
                </div>
              </div>
            </div>

            {/* RECHARTS HOURLY CONSUMPTION BAR CHART */}
            <div className="w-full h-[230px] pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentHistoricalHourlyData} margin={{ top: 12, right: 12, left: -22, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.25} />
                  <XAxis
                    dataKey="hourLabel"
                    stroke="#64748b"
                    tick={{ fontSize: 9, fill: '#94a3b8' }}
                    interval={2}
                  />
                  <YAxis
                    domain={[0, 'auto']}
                    stroke="#64748b"
                    tick={{ fontSize: 9, fill: '#94a3b8' }}
                    unit="%/h"
                  />
                  <ReferenceLine
                    y={currentDayAvgDrain}
                    stroke="#f59e0b"
                    strokeDasharray="3 3"
                    strokeWidth={1.5}
                    label={{
                      value: `Mức TB (${currentDayAvgDrain}%/h)`,
                      fill: '#f59e0b',
                      fontSize: 9,
                      position: 'insideTopRight',
                    }}
                  />
                  <Tooltip content={<CustomHistoricalBarTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '6px' }} iconSize={8} />

                  {visibleDevices.macbook !== false && (
                    <Bar
                      dataKey="macbook"
                      name="MacBook Pro"
                      fill="#22d3ee"
                      stackId={historicalIsStacked ? 'mesh' : undefined}
                      radius={historicalIsStacked ? [0, 0, 0, 0] : [2, 2, 0, 0]}
                    />
                  )}
                  {visibleDevices.iphone !== false && (
                    <Bar
                      dataKey="iphone"
                      name="iPhone 16 Pro"
                      fill="#fb7185"
                      stackId={historicalIsStacked ? 'mesh' : undefined}
                      radius={historicalIsStacked ? [0, 0, 0, 0] : [2, 2, 0, 0]}
                    />
                  )}
                  {visibleDevices.ipad !== false && (
                    <Bar
                      dataKey="ipad"
                      name="iPad Pro"
                      fill="#a78bfa"
                      stackId={historicalIsStacked ? 'mesh' : undefined}
                      radius={historicalIsStacked ? [2, 2, 0, 0] : [2, 2, 0, 0]}
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Historical Footer: Device Breakdown & Analytical CSV Info */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-cyan-300">
                  <Laptop size={11} className="text-cyan-400" />
                  <span>MacBook: {historicalTrendsMeta.macTotal}%</span>
                </span>
                <span className="flex items-center gap-1 text-rose-300">
                  <Smartphone size={11} className="text-rose-400" />
                  <span>iPhone: {historicalTrendsMeta.iphoneTotal}%</span>
                </span>
                <span className="flex items-center gap-1 text-purple-300">
                  <Tablet size={11} className="text-purple-400" />
                  <span>iPad: {historicalTrendsMeta.ipadTotal}%</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500">168 điểm đo (7 ngày × 24h)</span>
                <button
                  onClick={handleExportHistoricalCSV}
                  className="text-emerald-400 hover:text-emerald-300 font-medium underline flex items-center gap-1 cursor-pointer"
                  title="Tải tệp CSV phân tích"
                >
                  <FileSpreadsheet size={11} />
                  <span>Tải CSV</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderFloorplanSection = () => {
    const gateway = floorplanMeshMetrics.gateway;
    const selectedNode = selectedFloorplanNodeId
      ? floorplanNodes.find((n) => n.id === selectedFloorplanNodeId)
      : null;

    return (
      <div className="space-y-3">
        {/* Floorplan Control Header */}
        <div className="flex items-center justify-between gap-2 flex-wrap pb-1 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Compass size={14} className="text-emerald-400 animate-spin" style={{ animationDuration: '20s' }} />
            <span className="text-xs font-semibold text-slate-100">
              Sơ Đồ Mặt Bằng 2D & Heatmap Tín Hiệu Mesh
            </span>
            <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium">
              Score: {floorplanMeshMetrics.score}/100
            </span>
          </div>

          {/* Quick Toolbar Action Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-2 py-0.5 rounded-lg border text-[10px] font-medium flex items-center gap-1 transition-all cursor-pointer ${
                showHeatmap
                  ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/50 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title="Bật/Tắt Lớp Phủ Heatmap RF (Bản đồ nhiệt sóng vô tuyến)"
            >
              {showHeatmap ? <Eye size={10} className="text-emerald-400" /> : <EyeOff size={10} />}
              <span>Heatmap</span>
            </button>

            <button
              onClick={() => setShowMeshLinks(!showMeshLinks)}
              className={`px-2 py-0.5 rounded-lg border text-[10px] font-medium flex items-center gap-1 transition-all cursor-pointer ${
                showMeshLinks
                  ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/50 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title="Bật/Tắt Đường Liên Kết Mesh & Thông Số dBm"
            >
              <Radio size={10} className={showMeshLinks ? 'text-cyan-400' : ''} />
              <span>Liên kết</span>
            </button>

            <button
              onClick={() => setShowDeadZones(!showDeadZones)}
              className={`px-2 py-0.5 rounded-lg border text-[10px] font-medium flex items-center gap-1 transition-all cursor-pointer ${
                showDeadZones
                  ? 'bg-rose-500/20 text-rose-200 border-rose-500/50 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title="Bật/Tắt Cảnh Báo Điểm Chết Sóng"
            >
              <AlertTriangle size={10} className={showDeadZones ? 'text-rose-400' : ''} />
              <span>Vùng chết</span>
            </button>

            <button
              onClick={handleAutoOptimizePlacement}
              disabled={isOptimizingPlacement}
              className="px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 hover:from-cyan-500/30 hover:to-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-sm hover:shadow-emerald-500/20"
              title="AI tự động phân bổ lại vị trí thiết bị để đạt độ phủ sóng tối ưu và tốc độ cao nhất"
            >
              <Sparkles size={10} className="text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Tối ưu vị trí</span>
            </button>

            <button
              onClick={handleResetFloorplanPositions}
              className="px-1.5 py-0.5 rounded-lg bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors cursor-pointer"
              title="Khôi phục vị trí mặc định ban đầu"
            >
              <RotateCcw size={10} />
            </button>

            <button
              onClick={handleSpeakFloorplanAnalysis}
              className="px-2 py-0.5 rounded-lg bg-slate-900 text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors cursor-pointer flex items-center gap-1"
              title="Nghe Hoppi đọc báo cáo tối ưu mặt bằng mạng Mesh"
            >
              <Radio size={9} className="text-cyan-400 animate-pulse" />
              <span>Phân tích</span>
            </button>
          </div>
        </div>

        {/* 2D Interactive SVG Floorplan Canvas Container */}
        <div className="relative rounded-2xl bg-[#030712] border border-slate-800/90 shadow-2xl overflow-hidden select-none">
          {/* Subtle instruction tip badge */}
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900/90 border border-slate-700/60 backdrop-blur-md text-[9px] text-slate-300 pointer-events-none">
            <Move size={10} className="text-cyan-400" />
            <span>Kéo thả (Drag & Drop) node để thử nghiệm độ phủ sóng</span>
          </div>

          {/* SVG Canvas */}
          <svg
            ref={floorplanSvgRef}
            viewBox="0 0 520 320"
            className="w-full h-[290px] touch-none cursor-default"
            onPointerMove={handleFloorplanPointerMove}
            onPointerUp={handleFloorplanPointerUp}
            onPointerLeave={handleFloorplanPointerUp}
          >
            <defs>
              {/* Blueprint Grid Pattern */}
              <pattern id="floorplan-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" strokeWidth="0.5" opacity="0.35" />
              </pattern>

              {/* Radial Gradients for Signal Heatmap per node */}
              {floorplanNodes.map((n) => {
                const isGw = n.isGateway;
                const rRadius = isGw ? 210 : 135;
                return (
                  <radialGradient
                    key={`rf-heat-${n.id}`}
                    id={`rf-heat-${n.id}`}
                    cx={n.x}
                    cy={n.y}
                    r={rRadius}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor={isGw ? '#10b981' : n.color} stopOpacity="0.48" />
                    <stop offset="35%" stopColor="#06b6d4" stopOpacity="0.26" />
                    <stop offset="68%" stopColor="#f59e0b" stopOpacity="0.12" />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity="0.04" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                  </radialGradient>
                );
              })}

              {/* Arrow Marker for Mesh Direction */}
              <marker
                id="mesh-arrow"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="4"
                markerHeight="4"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" opacity="0.8" />
              </marker>
            </defs>

            {/* Base Blueprint Floorplan Rectangle */}
            <rect x="15" y="15" width="490" height="290" rx="12" fill="#020617" stroke="#1e293b" strokeWidth="2" />
            <rect x="15" y="15" width="490" height="290" rx="12" fill="url(#floorplan-grid)" />

            {/* Architectural Rooms Background Fill with subtle colors */}
            {/* Room 1: Server Closet (Kho kỹ thuật) */}
            <rect x="15" y="15" width="160" height="145" rx="10" fill="#a855f7" fillOpacity="0.03" />
            {/* Room 2: Dev Studio (Phòng làm việc) */}
            <rect x="175" y="15" width="330" height="145" rx="10" fill="#06b6d4" fillOpacity="0.03" />
            {/* Room 3: Ban Công & Garden */}
            <rect x="15" y="160" width="160" height="145" rx="10" fill="#10b981" fillOpacity="0.03" />
            {/* Room 4: Phòng Khách (Living) */}
            <rect x="175" y="160" width="175" height="145" fill="#f59e0b" fillOpacity="0.02" />
            {/* Room 5: Phòng Ngủ Master */}
            <rect x="350" y="160" width="155" height="145" rx="10" fill="#c084fc" fillOpacity="0.02" />

            {/* Architectural Interior & Exterior Walls */}
            {/* Outer perimeter thick line */}
            <rect x="15" y="15" width="490" height="290" rx="12" fill="none" stroke="#475569" strokeWidth="2.5" />

            {/* Interior Walls (with Door Openings) */}
            {/* Vertical Wall 1: at x=175 (Separates West rooms from East rooms) */}
            <line x1="175" y1="15" x2="175" y2="105" stroke="#475569" strokeWidth="2" />
            <line x1="175" y1="140" x2="175" y2="215" stroke="#475569" strokeWidth="2" />
            <line x1="175" y1="250" x2="175" y2="305" stroke="#475569" strokeWidth="2" />

            {/* Door swing arcs for Wall 1 */}
            <path d="M 175 105 A 35 35 0 0 0 140 140" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
            <path d="M 175 215 A 35 35 0 0 0 140 250" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />

            {/* Horizontal Wall: at y=160 (Separates North from South) */}
            <line x1="15" y1="160" x2="95" y2="160" stroke="#475569" strokeWidth="2" />
            <line x1="130" y1="160" x2="225" y2="160" stroke="#475569" strokeWidth="2" />
            <line x1="260" y1="160" x2="505" y2="160" stroke="#475569" strokeWidth="2" />

            {/* Door swing arcs for Horizontal Wall */}
            <path d="M 95 160 A 35 35 0 0 0 130 195" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
            <path d="M 225 160 A 35 35 0 0 0 260 195" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />

            {/* Vertical Wall 2: at x=350 (Separates Living room from Master bedroom) */}
            <line x1="350" y1="160" x2="350" y2="235" stroke="#475569" strokeWidth="2" />
            <line x1="350" y1="270" x2="350" y2="305" stroke="#475569" strokeWidth="2" />
            <path d="M 350 235 A 35 35 0 0 0 385 270" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />

            {/* Room Labels & Architectural Dimensions */}
            <g className="text-slate-500 font-sans pointer-events-none select-none">
              <text x="30" y="38" fill="#a855f7" fontSize="10" fontWeight="bold">TỦ SERVER & RACK</text>
              <text x="30" y="50" fill="#64748b" fontSize="8">10GbE Switch • 8m²</text>

              <text x="195" y="38" fill="#06b6d4" fontSize="10" fontWeight="bold">PHÒNG LÀM VIỆC (DEV STUDIO)</text>
              <text x="195" y="50" fill="#64748b" fontSize="8">Trạm phát Wi-Fi 6E 160MHz • 24m²</text>

              <text x="30" y="185" fill="#10b981" fontSize="10" fontWeight="bold">BAN CÔNG & SMART GARDEN</text>
              <text x="30" y="197" fill="#64748b" fontSize="8">IoT Sensor Mesh • 12m²</text>

              <text x="195" y="185" fill="#f59e0b" fontSize="10" fontWeight="bold">PHÒNG KHÁCH (LIVING)</text>
              <text x="195" y="197" fill="#64748b" fontSize="8">Smart TV & Loa • 28m²</text>

              <text x="365" y="185" fill="#c084fc" fontSize="10" fontWeight="bold">PHÒNG NGỦ MASTER</text>
              <text x="365" y="197" fill="#64748b" fontSize="8">Tường bê tông 2 lớp • 22m²</text>
            </g>

            {/* COLOR-CODED SIGNAL HEATMAP OVERLAYS */}
            {showHeatmap && (
              <g style={{ mixBlendMode: 'screen' }} className="pointer-events-none">
                {floorplanNodes.map((n) => (
                  <circle
                    key={`heat-circ-${n.id}`}
                    cx={n.x}
                    cy={n.y}
                    r={n.isGateway ? 210 : 135}
                    fill={`url(#rf-heat-${n.id})`}
                  />
                ))}

                {/* Animated propagation RF wave rings from the Gateway node */}
                <circle
                  cx={gateway.x}
                  cy={gateway.y}
                  r="50"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.2"
                  opacity="0.35"
                  className="animate-ping"
                  style={{ animationDuration: '3.5s' }}
                />
                <circle
                  cx={gateway.x}
                  cy={gateway.y}
                  r="110"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="1"
                  opacity="0.25"
                  className="animate-ping"
                  style={{ animationDuration: '4.5s' }}
                />
              </g>
            )}

            {/* DEAD ZONES OVERLAY */}
            {showDeadZones && (
              <g className="pointer-events-none">
                {/* Master Bedroom far corner (heavy wall attenuation) */}
                <rect x="445" y="260" width="55" height="40" rx="6" fill="#f43f5e" fillOpacity="0.12" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 3" />
                <text x="448" y="278" fill="#f43f5e" fontSize="7.5" fontWeight="bold">⚠️ VÙNG CHẾT</text>
                <text x="448" y="288" fill="#fda4af" fontSize="6.5">Góc xa (-78 dBm)</text>

                {/* Balcony extreme corner */}
                <rect x="20" y="265" width="55" height="35" rx="6" fill="#f43f5e" fillOpacity="0.1" stroke="#f43f5e" strokeWidth="0.8" strokeDasharray="2 2" />
                <text x="23" y="282" fill="#f43f5e" fontSize="7" fontWeight="bold">⚠️ VÙNG SUY HAO</text>
                <text x="23" y="291" fill="#fda4af" fontSize="6.5">Kính phản xạ (-76 dBm)</text>
              </g>
            )}

            {/* MESH INTER-NODE CONNECTION LINKS */}
            {showMeshLinks && (
              <g className="pointer-events-none">
                {floorplanMeshMetrics.links.map(({ client, metrics }) => {
                  const midX = Math.round((gateway.x + client.x) / 2);
                  const midY = Math.round((gateway.y + client.y) / 2);
                  const isSelected = selectedFloorplanNodeId === client.id;

                  return (
                    <g key={`mesh-link-${client.id}`}>
                      {/* Connection Line */}
                      <line
                        x1={gateway.x}
                        y1={gateway.y}
                        x2={client.x}
                        y2={client.y}
                        stroke={metrics.qualityColor}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                        strokeDasharray={metrics.rssi < -75 ? '3 3' : '5 4'}
                        opacity={isSelected ? 0.95 : 0.75}
                      />

                      {/* Midpoint Signal Badge */}
                      <g transform={`translate(${midX}, ${midY})`}>
                        <rect
                          x="-32"
                          y="-9"
                          width="64"
                          height="18"
                          rx="5"
                          fill="#090d16"
                          stroke={metrics.qualityColor}
                          strokeWidth="1"
                          opacity="0.95"
                        />
                        <text
                          x="0"
                          y="3"
                          textAnchor="middle"
                          fill={metrics.qualityColor}
                          fontSize="7.5"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {metrics.rssi} dBm
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>
            )}

            {/* INTERACTIVE DRAGGABLE NODES */}
            <g>
              {floorplanNodes.map((node) => {
                const isGw = node.isGateway;
                const isSelected = selectedFloorplanNodeId === node.id;
                const isDragging = draggingNodeId === node.id;

                // Lookup link metrics for clients
                const linkObj = floorplanMeshMetrics.links.find((l) => l.client.id === node.id);
                const badgeRssi = isGw ? '+24 dBm (AP)' : `${linkObj?.metrics.rssi || -45} dBm`;
                const badgeColor = isGw ? '#10b981' : linkObj?.metrics.qualityColor || '#06b6d4';

                return (
                  <g
                    key={`node-${node.id}`}
                    transform={`translate(${node.x}, ${node.y})`}
                    onPointerDown={(e) => handleNodePointerDown(node.id, e)}
                    className="cursor-grab active:cursor-grabbing transition-transform"
                    style={{
                      filter: isSelected ? 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.8))' : 'none',
                    }}
                  >
                    {/* Outer Pulsing Halo */}
                    <circle
                      r={isGw ? 24 : 19}
                      fill={node.color}
                      fillOpacity={isDragging ? 0.35 : 0.18}
                      stroke={badgeColor}
                      strokeWidth={isSelected ? 2 : 1}
                      strokeDasharray={isSelected ? '3 2' : undefined}
                    />

                    {/* Main Node Body Circle */}
                    <circle
                      r={isGw ? 15 : 12}
                      fill="#090d16"
                      stroke={node.color}
                      strokeWidth={2}
                    />

                    {/* Center Node Dot or Indicator */}
                    <circle
                      r={isGw ? 6 : 4}
                      fill={node.color}
                    />

                    {/* Node Text Label & RSSI Chip */}
                    <g transform="translate(0, 22)">
                      <rect
                        x="-36"
                        y="0"
                        width="72"
                        height="19"
                        rx="5"
                        fill="#020617"
                        stroke={node.color}
                        strokeWidth="0.8"
                        opacity="0.95"
                      />
                      <text
                        x="0"
                        y="9"
                        textAnchor="middle"
                        fill="#f8fafc"
                        fontSize="7"
                        fontWeight="bold"
                        className="truncate"
                      >
                        {node.shortName}
                      </text>
                      <text
                        x="0"
                        y="16"
                        textAnchor="middle"
                        fill={badgeColor}
                        fontSize="6.5"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {badgeRssi}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* SIGNAL STRENGTH HEATMAP COLOR LEGEND */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <Compass size={11} className="text-emerald-400" />
              <span>Thang đo độ mạnh tín hiệu sóng vô tuyến (RSSI Heatmap):</span>
            </span>
            <span className="text-[9px] text-slate-400 font-mono">1m ≈ 25px</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[9px] font-mono">
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
              <div>
                <span className="font-bold">&gt; -50 dBm</span>
                <span className="text-slate-400 block font-sans">Xuất sắc (900-1200M)</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-cyan-300">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 flex-shrink-0" />
              <div>
                <span className="font-bold">-50 đến -65 dBm</span>
                <span className="text-slate-400 block font-sans">Tốt (500-850M)</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" />
              <div>
                <span className="font-bold">-65 đến -75 dBm</span>
                <span className="text-slate-400 block font-sans">Khá (150-450M)</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 flex-shrink-0" />
              <div>
                <span className="font-bold">&lt; -75 dBm</span>
                <span className="text-slate-400 block font-sans">Điểm chết (&lt;100M)</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI PLACEMENT OPTIMIZATION & DEVICE MESH STATUS DRAWER */}
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/90 shadow-lg space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-cyan-400" />
              <span className="text-xs font-semibold text-slate-100">
                Phân Tích & Tối Ưu Hóa Vị Trí Node Mesh
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-mono">
                Băng thông TB: <strong className="text-cyan-300">{floorplanMeshMetrics.avgSpeed} Mbps</strong>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Độ trễ: <strong className="text-emerald-300">~3.2ms</strong>
              </span>
            </div>
          </div>

          {/* Node Placement Details Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {floorplanMeshMetrics.links.map(({ client, metrics }) => {
              const isSelected = selectedFloorplanNodeId === client.id;
              return (
                <div
                  key={client.id}
                  onClick={() => setSelectedFloorplanNodeId(client.id)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-cyan-950/30 border-cyan-500/60 shadow-md shadow-cyan-950/30'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                      {getFloorplanNodeIcon(client.type)}
                      <span>{client.name}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${metrics.badgeClass}`}>
                      {metrics.rssi} dBm ({metrics.qualityLabel})
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-slate-400 pt-0.5">
                    <div>
                      <span className="text-slate-500 block text-[9px]">Khoảng cách:</span>
                      <span className="text-slate-200 font-semibold">{metrics.distM}m</span> ({metrics.wallCount} tường)
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">Tốc độ:</span>
                      <span className="text-cyan-300 font-semibold">{metrics.speedMbps} Mbps</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">Ping / Loss:</span>
                      <span className="text-emerald-300 font-semibold">{metrics.latencyMs}ms</span> ({metrics.packetLoss})
                    </div>
                  </div>

                  <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 truncate">
                      Vị trí: <strong className="text-slate-300 font-medium">{client.room}</strong>
                    </span>
                    <span className="text-amber-400 text-[9px] font-sans italic truncate ml-1">
                      {metrics.advice}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // --- RENDER DIAGNOSTIC ROUTINE MODAL (AI DEEP DIAGNOSTIC ENGINE) ---
  const renderDiagnosticModal = () => {
    const runningCulprits = smartProcesses.filter((p) => !p.isTerminated && p.priority !== 'critical_work');
    const allCulprits = smartProcesses.filter((p) => p.priority !== 'critical_work');

    return (
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22 }}
          className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-4 sm:p-6 space-y-4 text-slate-100 overflow-hidden"
        >
          {/* Ambient glowing radial effects */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 via-rose-500/20 to-cyan-500/20 border border-amber-500/40 text-amber-300">
                <Wrench size={18} className="animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-slate-100 tracking-tight">
                    Quy Trình Chẩn Đoán & Tối Ưu Năng Lượng AI
                  </h3>
                  <span className="px-1.5 py-0.2 rounded font-mono text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    DIAGNOSTIC v3.8
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Phát hiện, cô lập và đề xuất xử lý các tiến trình ngầm gây xả pin đột biến
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsDiagnosticModalOpen(false)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          {/* Anomaly Overview Card */}
          {abnormalDrainAnomaly ? (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900/90 to-amber-950/40 border border-rose-500/50 space-y-2 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300">
                  <AlertOctagon size={14} className="text-rose-400 animate-spin" />
                  <span>PHÁT HIỆN ĐỘT BIẾN XẢ PIN BẤT THƯỜNG TRÊN {abnormalDrainAnomaly.device.name.toUpperCase()}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-mono text-[10px] font-extrabold shadow-sm">
                  +{abnormalDrainAnomaly.surgePercent}% VƯỢT CHUẨN
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center font-mono">
                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[9px] text-slate-400 block font-sans">Tốc độ xả hiện tại</span>
                  <span className="text-xs font-bold text-rose-400">{abnormalDrainAnomaly.currentRate}%/h</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[9px] text-slate-400 block font-sans">Mức Baseline chuẩn</span>
                  <span className="text-xs font-bold text-slate-300">{abnormalDrainAnomaly.baselineRate}%/h</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[9px] text-slate-400 block font-sans">Tổn thất pin ước tính</span>
                  <span className="text-xs font-bold text-amber-300">~{abnormalDrainAnomaly.hoursLost} giờ</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[9px] text-slate-400 block font-sans">Pin còn lại</span>
                  <span className="text-xs font-bold text-cyan-300">{abnormalDrainAnomaly.device.currentBattery}%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>Hệ thống mạng Mesh đang hoạt động ở mức xả pin baseline an toàn (~2.2%/h).</span>
              </div>
              <button
                onClick={handleSimulateAbnormalSpike}
                className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[10px] font-mono cursor-pointer transition-colors"
                title="Tạo đột biến xả pin lên 7.8%/h (+254%) để thử nghiệm"
              >
                + Mô Phỏng Đột Biến
              </button>
            </div>
          )}

          {/* Diagnostic Progress & Status */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {isDiagnosticRunning ? (
                  <RefreshCw size={13} className="text-cyan-400 animate-spin" />
                ) : (
                  <CheckCircle2 size={13} className="text-emerald-400" />
                )}
                <span className="font-medium text-slate-200 text-[11px]">{diagnosticStepText}</span>
              </div>
              <span className="font-mono text-xs font-bold text-cyan-400">{diagnosticProgress}%</span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-400 rounded-full"
                animate={{ width: `${diagnosticProgress}%` }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Diagnostic Terminal Logs HUD */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Terminal size={11} className="text-cyan-400" />
                <span>LIVE DIAGNOSTIC SCANNER LOGS</span>
              </span>
              <span>{diagnosticLogs.length} events logged</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800/80 font-mono text-[11px] space-y-1.5 max-h-36 overflow-y-auto shadow-inner">
              {diagnosticLogs.map((log) => {
                let badgeClass = 'text-cyan-400';
                if (log.type === 'warn') badgeClass = 'text-amber-400';
                if (log.type === 'culprit') badgeClass = 'text-rose-400';
                if (log.type === 'success') badgeClass = 'text-emerald-400 font-bold';

                return (
                  <div key={log.id} className="flex items-start gap-2 leading-tight">
                    <span className="text-slate-500 text-[10px] flex-shrink-0">[{log.time}]</span>
                    <span className={`${badgeClass} break-words`}>{log.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Identified High-Drain Culprits Table */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Scan size={13} className="text-amber-400" />
                <h4 className="text-xs font-semibold text-slate-200">
                  Tiến Trình Ngầm Gây Hao Pin Được Đề Xuất Đóng ({runningCulprits.length} đang chạy)
                </h4>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-medium">
                Tiết kiệm tối đa: +{optimizerMetrics.totalPotentialGainMin} phút uptime
              </span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {allCulprits.map((proc) => (
                <div
                  key={proc.id}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                    proc.isTerminated
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                      : 'bg-slate-800/50 hover:bg-slate-800/80 border-slate-700/80 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg text-xs font-mono font-bold flex-shrink-0 ${
                        proc.isTerminated
                          ? 'bg-slate-800 text-slate-500'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {proc.isTerminated ? 'OFF' : `-${proc.drainReductionPerHour}%/h`}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-semibold truncate ${
                            proc.isTerminated ? 'line-through text-slate-500' : 'text-slate-200'
                          }`}
                        >
                          {proc.name}
                        </span>
                        <span className="text-[9px] px-1 rounded bg-slate-700/60 text-slate-400 font-mono">
                          PID {proc.pid}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                        <span>CPU: {proc.cpuPercent}%</span>
                        <span>RAM: {proc.ramMb}MB</span>
                        <span className="text-emerald-400 font-sans font-medium">
                          +{proc.uptimeExtensionMinutes}m uptime
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTerminateSingleProcess(proc.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all cursor-pointer flex-shrink-0 ${
                      proc.isTerminated
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                        : 'bg-rose-500/25 hover:bg-rose-500 text-white border border-rose-500/50 shadow-sm'
                    }`}
                  >
                    {proc.isTerminated ? 'Khôi phục' : 'Đóng tiến trình'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleRunDiagnosticRoutine}
                disabled={isDiagnosticRunning}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={12} className={isDiagnosticRunning ? 'animate-spin' : ''} />
                <span>Chạy lại chẩn đoán</span>
              </button>

              {isSpikeSimulated ? (
                <button
                  onClick={handleRestoreAbnormalSpike}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono cursor-pointer transition-colors"
                >
                  Khôi phục chuẩn (2.2%/h)
                </button>
              ) : (
                <button
                  onClick={handleSimulateAbnormalSpike}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-mono cursor-pointer transition-colors"
                >
                  Mô phỏng đột biến (+254%)
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDiagnosticModalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs cursor-pointer transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={handleCloseAllDiagnosticCulprits}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-500/30 transition-all cursor-pointer"
              >
                <Zap size={13} className="fill-white" />
                <span>Đóng Toàn Bộ Tiến Trình Gây Hao Pin</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className={`w-full p-3.5 rounded-2xl border transition-all relative ${containerClasses}`}>
      {/* Header bar */}
      <div
        className={`flex items-center justify-between pb-2.5 border-b font-medium text-xs ${badgeHeaderClasses}`}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <Activity size={15} className="text-cyan-400" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <span className="font-semibold text-slate-100 tracking-tight">
            Hiệu Năng Hệ Thống
          </span>
          <span className="font-mono text-[10px] text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/20">
            LIVE
          </span>

          {/* Header 'Power Saver' Toggle Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={meshPowerMode === 'battery-saver'}
            onClick={() => toggleMeshPowerMode()}
            className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1.5 border transition-all cursor-pointer ${
              meshPowerMode === 'battery-saver'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30 shadow-xs'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Công tắc Power Saver: Ép toàn bộ thiết bị mesh chuyển sang chế độ năng lượng thấp (-60% xả pin)"
          >
            <Leaf
              size={10}
              className={meshPowerMode === 'battery-saver' ? 'text-emerald-400 fill-emerald-400/40 animate-pulse' : 'text-slate-500'}
            />
            <span className="font-semibold text-[9.5px]">Power Saver</span>
            {/* Visual sliding toggle track */}
            <div
              className={`w-7 h-3.5 rounded-full p-0.5 transition-colors flex items-center ${
                meshPowerMode === 'battery-saver' ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-2.5 h-2.5 rounded-full bg-white shadow-xs"
              />
            </div>
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Prominent Optimize Now Header Button */}
          <button
            onClick={handleRunDiagnosticRoutine}
            className="px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 bg-gradient-to-r from-amber-500/25 via-rose-500/25 to-cyan-500/25 text-amber-200 border border-amber-400/40 hover:border-amber-300 hover:brightness-110 shadow-sm transition-all cursor-pointer"
            title="Khởi chạy chẩn đoán và đóng tiến trình ngầm gây hao pin"
          >
            <Zap size={10} className="text-amber-400 fill-amber-400 animate-pulse" />
            <span>Tối Ưu Ngay</span>
          </button>

          <button
            onClick={handleManualRefresh}
            title="Làm mới tức thì"
            className={`p-1 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 transition-colors cursor-pointer ${
              isRefreshing ? 'animate-spin text-cyan-400' : ''
            }`}
          >
            <RefreshCw size={13} />
          </button>

          <button
            onClick={() => setIsLive(!isLive)}
            title={isLive ? 'Tạm dừng live stream' : 'Tiếp tục theo dõi'}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${
              isLive
                ? 'text-emerald-400 hover:bg-slate-800/60'
                : 'text-amber-400 hover:bg-slate-800/60'
            }`}
          >
            {isLive ? <Pause size={13} /> : <Play size={13} />}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Thu gọn' : 'Mở rộng'}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-3 pt-2.5 overflow-hidden"
          >
            {/* View Selector Tabs */}
            <div className="flex items-center justify-between p-1 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] gap-1">
              <button
                onClick={() => setActiveTab('dual')}
                className={`flex-1 py-1 px-1.5 rounded-lg font-medium text-center transition-all cursor-pointer truncate ${
                  activeTab === 'dual'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Cả hai
              </button>
              <button
                onClick={() => setActiveTab('current')}
                className={`flex-1 py-1 px-1.5 rounded-lg font-medium text-center transition-all cursor-pointer truncate ${
                  activeTab === 'current'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Thiết bị
              </button>
              <button
                onClick={() => setActiveTab('server')}
                className={`flex-1 py-1 px-1.5 rounded-lg font-medium text-center transition-all cursor-pointer truncate ${
                  activeTab === 'server'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Server
              </button>
              <button
                onClick={() => setActiveTab('battery')}
                className={`flex-1 py-1 px-1.5 rounded-lg font-medium text-center transition-all cursor-pointer truncate flex items-center justify-center gap-1 ${
                  activeTab === 'battery'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BatteryCharging size={11} className={activeTab === 'battery' ? 'text-amber-400' : ''} />
                <span>Pin & Dự Báo</span>
              </button>
              <button
                onClick={() => setActiveTab('floorplan')}
                className={`flex-1 py-1 px-1.5 rounded-lg font-medium text-center transition-all cursor-pointer truncate flex items-center justify-center gap-1 ${
                  activeTab === 'floorplan'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Sơ đồ mặt bằng 2D & Bản đồ nhiệt sóng Wi-Fi Mesh"
              >
                <Compass size={11} className={activeTab === 'floorplan' ? 'text-emerald-400' : ''} />
                <span>Sơ Đồ 2D Mesh</span>
              </button>
            </div>

            {/* Power Saver Global Toggle Switch Bar */}
            <div
              className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                meshPowerMode === 'battery-saver'
                  ? 'bg-gradient-to-r from-emerald-950/80 via-slate-900/95 to-teal-950/80 border-emerald-500/50 shadow-md shadow-emerald-950/40'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700/80'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`p-2 rounded-xl border flex-shrink-0 transition-all ${
                    meshPowerMode === 'battery-saver'
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <Leaf
                    size={16}
                    className={meshPowerMode === 'battery-saver' ? 'text-emerald-400 fill-emerald-400/30 animate-pulse' : 'text-slate-400'}
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs text-slate-100 tracking-tight">Power Saver</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full font-mono text-[9px] font-bold uppercase transition-colors ${
                        meshPowerMode === 'battery-saver'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {meshPowerMode === 'battery-saver' ? 'LOW-POWER MODE (BẬT)' : 'TẮT (CHUẨN)'}
                    </span>
                    {meshPowerMode === 'battery-saver' && (
                      <span className="text-[9px] font-mono text-emerald-400 font-bold hidden sm:inline">
                        • Giảm 60% tốc độ xả pin
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {meshPowerMode === 'battery-saver'
                      ? 'Đang ép toàn bộ thiết bị Mesh (MacBook, iPhone, iPad, Server) chạy ở chế độ năng lượng thấp qua BroadcastChannel'
                      : 'Bật để ép đồng thời toàn bộ 4 thiết bị Mesh chuyển sang chế độ tiết kiệm năng lượng thấp (Low-Power Mode)'}
                  </p>
                </div>
              </div>

              {/* Interactive Sliding Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={meshPowerMode === 'battery-saver'}
                onClick={() => toggleMeshPowerMode()}
                className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center relative flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 ${
                  meshPowerMode === 'battery-saver'
                    ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-800 border border-slate-700'
                }`}
                title="Bật/Tắt Power Saver: Ép toàn bộ thiết bị mesh chuyển sang chế độ năng lượng thấp"
              >
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center transition-transform ${
                    meshPowerMode === 'battery-saver' ? 'translate-x-6' : 'translate-x-0'
                  }`}
                >
                  {meshPowerMode === 'battery-saver' ? (
                    <Leaf size={10} className="text-emerald-600 fill-emerald-600" />
                  ) : (
                    <Zap size={10} className="text-slate-400" />
                  )}
                </motion.div>
              </button>
            </div>

            {/* Device Cards Render */}
            <div className="space-y-2.5">
              {activeTab === 'dual' && (
                <>
                  {renderDeviceCard(currentDevice, true)}
                  {renderDeviceCard(homeServer, true)}
                  {/* Quick Battery Glance in Dual Mode */}
                  <div
                    onClick={() => setActiveTab('battery')}
                    className="p-2 rounded-xl bg-amber-950/20 hover:bg-amber-950/30 border border-amber-500/30 flex items-center justify-between text-[11px] cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <BatteryCharging size={13} className="text-amber-400 group-hover:scale-110 transition-transform" />
                      <span className="text-slate-300 font-medium">Theo dõi Pin Mesh 24h & Dự báo AI:</span>
                      <span className="text-rose-400 font-semibold font-mono">iPhone (32%, cạn lúc {batteryPredictions[1]?.depletionTimeStr})</span>
                      <div className="hidden sm:inline-block ml-1">
                        {renderMiniDischargeSparkline(batteryDevices[1]?.dischargeHistory60m || [], '#fb7185', 52, 16)}
                      </div>
                    </div>
                    <span className="text-[10px] text-amber-300 group-hover:translate-x-0.5 transition-transform flex items-center">
                      Xem biểu đồ →
                    </span>
                  </div>

                  {/* Quick Abnormal Battery Drain Spike Glance in Dual Mode */}
                  {abnormalDrainAnomaly && (
                    <div
                      onClick={handleRunDiagnosticRoutine}
                      className="p-2 rounded-xl bg-gradient-to-r from-rose-950/50 via-slate-900 to-amber-950/40 hover:brightness-110 border border-rose-500/60 flex items-center justify-between text-[11px] cursor-pointer transition-all shadow-md shadow-rose-950/30"
                    >
                      <div className="flex items-center gap-2">
                        <AlertOctagon size={13} className="text-rose-400 animate-pulse" />
                        <span className="text-rose-200 font-bold">Cảnh Báo Xả Pin Đột Biến:</span>
                        <span className="text-amber-300 font-mono">
                          {abnormalDrainAnomaly.device.shortName} (+{abnormalDrainAnomaly.surgePercent}% / {abnormalDrainAnomaly.currentRate}%/h)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center gap-0.5">
                          <Zap size={9} className="fill-white" /> Tối Ưu Ngay →
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Quick Smart Power Optimizer Glance in Dual Mode if under 15% */}
                  {optimizerMetrics.isUnder15Active && (
                    <div
                      onClick={() => {
                        setActiveTab('battery');
                        setIsSmartOptimizerOpen(true);
                      }}
                      className="p-2 rounded-xl bg-rose-950/30 hover:bg-rose-950/40 border border-rose-500/40 flex items-center justify-between text-[11px] cursor-pointer transition-all animate-pulse"
                    >
                      <div className="flex items-center gap-2">
                        <Zap size={13} className="text-rose-400" />
                        <span className="text-rose-200 font-semibold">Smart Power Optimizer:</span>
                        <span className="text-slate-300 font-mono">
                          {optimizerMetrics.criticalBatteryDevice?.shortName} (&lt;15%) — Đề xuất tắt {optimizerMetrics.suggestedCount} apps (+{optimizerMetrics.pendingSavedMin}m)
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-300 font-bold flex items-center">
                        Mở tối ưu →
                      </span>
                    </div>
                  )}

                  {/* Quick Radial Power Distribution Glance in Dual Mode */}
                  <div
                    onClick={() => {
                      setActiveTab('battery');
                      setBatterySubView('distribution');
                    }}
                    className="p-2 rounded-xl bg-gradient-to-r from-amber-950/20 via-slate-900 to-slate-950 hover:bg-amber-950/30 border border-amber-500/30 flex items-center justify-between text-[11px] cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <Flame size={13} className="text-amber-400 group-hover:scale-110 transition-transform animate-pulse" />
                      <span className="text-slate-300 font-medium">Phân bổ điện năng Radial:</span>
                      <span className="text-amber-300 font-semibold font-mono">
                        🔥 Ngốn nhất: {meshPowerDistribution.mostPowerHungryDevice.shortName} ({meshPowerDistribution.mostPowerHungryDevice.percentShare}%)
                      </span>
                    </div>
                    <span className="text-[10px] text-amber-300 group-hover:translate-x-0.5 transition-transform flex items-center">
                      Xem Radial Bar →
                    </span>
                  </div>

                  {/* Quick Floorplan Glance in Dual Mode */}
                  <div
                    onClick={() => setActiveTab('floorplan')}
                    className="p-2 rounded-xl bg-emerald-950/20 hover:bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-[11px] cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <Compass size={13} className="text-emerald-400 group-hover:rotate-45 transition-transform" />
                      <span className="text-slate-300 font-medium">Sơ đồ 2D & Heatmap tín hiệu Mesh:</span>
                      <span className="text-emerald-300 font-semibold font-mono">
                        {floorplanMeshMetrics.activeNodesCount} Nodes ({floorplanMeshMetrics.overallHealthScore}/100 Điểm)
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-300 group-hover:translate-x-0.5 transition-transform flex items-center">
                      Mở sơ đồ 2D →
                    </span>
                  </div>
                </>
              )}
              {activeTab === 'current' && renderDeviceCard(currentDevice, false)}
              {activeTab === 'server' && renderDeviceCard(homeServer, false)}
              {activeTab === 'battery' && renderBatteryTelemetrySection()}
              {activeTab === 'floorplan' && renderFloorplanSection()}
            </div>

            {/* Mesh Link Status Banner */}
            <div className="p-2 rounded-xl bg-cyan-950/20 border border-cyan-900/40 flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5 text-cyan-300">
                <Radio size={11} className="text-cyan-400 animate-pulse" />
                <span>Kênh truyền đồng bộ Mesh:</span>
                <span className="font-semibold text-emerald-400">P2P WireGuard</span>
              </div>
              <span className="text-slate-400 font-mono">RTT: ~4ms</span>
            </div>

            {/* FLOATING ACTION BUTTON (FAB): Quick Toggle High Performance vs Battery Saver across Mesh */}
            <div className="sticky bottom-2 z-30 flex flex-col items-end gap-2 pt-1 pointer-events-none">
              {/* Expanded FAB Detail Drawer */}
              <AnimatePresence>
                {isFabDrawerOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="pointer-events-auto p-3 rounded-2xl bg-slate-950/95 border border-slate-700/80 shadow-2xl backdrop-blur-xl w-80 text-xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-100">
                        <Radio size={13} className="text-cyan-400 animate-pulse" />
                        <span>Đồng Bộ Mesh BroadcastChannel</span>
                      </div>
                      <button
                        onClick={() => setIsFabDrawerOpen(false)}
                        className="text-slate-400 hover:text-slate-200 p-0.5 rounded cursor-pointer"
                      >
                        <X size={13} />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Chuyển đổi tức thì giữa <span className="text-amber-300 font-medium">Hiệu Năng Cao</span> và{' '}
                      <span className="text-emerald-300 font-medium">Tiết Kiệm Pin</span> đồng thời cho toàn bộ thiết bị trong mạng qua{' '}
                      <code className="text-cyan-400 font-mono text-[10px]">hoppi_device_mesh_channel</code>.
                    </p>

                    {/* Matrix of affected devices */}
                    <div className="space-y-1 rounded-xl bg-slate-900/90 p-2.5 border border-slate-800/80 text-[10px]">
                      <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/60 pb-1 font-medium">
                        <span>Thiết bị Mesh</span>
                        <span>High Perf ⇄ Saver</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300 pt-0.5">
                        <span className="flex items-center gap-1.5"><Laptop size={11} className="text-cyan-400" /> MacBook Pro:</span>
                        <span className="font-mono text-cyan-300 font-medium">4.8% ⇄ 1.8%/h</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5"><Smartphone size={11} className="text-rose-400" /> iPhone 16 Pro:</span>
                        <span className="font-mono text-rose-300 font-medium">3.6% ⇄ 1.2%/h</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5"><Tablet size={11} className="text-purple-400" /> iPad Pro M2:</span>
                        <span className="font-mono text-purple-300 font-medium">2.9% ⇄ 1.1%/h</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5"><Server size={11} className="text-emerald-400" /> Home Server:</span>
                        <span className="font-mono text-emerald-300 font-medium">Turbo ⇄ Throttled</span>
                      </div>
                    </div>

                    {/* Mode switch radio buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                      <button
                        onClick={() => toggleMeshPowerMode('high-performance')}
                        className={`p-2 rounded-xl border text-[11px] font-medium flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          meshPowerMode === 'high-performance'
                            ? 'bg-amber-500/20 text-amber-200 border-amber-500/50 shadow-sm font-semibold'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <Zap size={12} className={meshPowerMode === 'high-performance' ? 'text-amber-400 fill-amber-400/40' : ''} />
                          <span>High Perf</span>
                        </div>
                        <span className="text-[9px] text-amber-400/80">Turbo Boost</span>
                      </button>

                      <button
                        onClick={() => toggleMeshPowerMode('battery-saver')}
                        className={`p-2 rounded-xl border text-[11px] font-medium flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          meshPowerMode === 'battery-saver'
                            ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/50 shadow-sm font-semibold'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <Leaf size={12} className={meshPowerMode === 'battery-saver' ? 'text-emerald-400 fill-emerald-400/30' : ''} />
                          <span>Battery Saver</span>
                        </div>
                        <span className="text-[9px] text-emerald-400/80">Eco -60% Drain</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Floating Action Button (FAB) Main Bar */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pointer-events-auto flex items-center shadow-2xl backdrop-blur-md rounded-2xl border transition-all overflow-hidden"
                style={{
                  borderColor:
                    meshPowerMode === 'high-performance' ? 'rgba(245, 158, 11, 0.55)' : 'rgba(16, 185, 129, 0.55)',
                  boxShadow:
                    meshPowerMode === 'high-performance'
                      ? '0 10px 25px -5px rgba(245, 158, 11, 0.3), 0 0 15px rgba(245, 158, 11, 0.2)'
                      : '0 10px 25px -5px rgba(16, 185, 129, 0.3), 0 0 15px rgba(16, 185, 129, 0.2)',
                }}
              >
                {/* Main Action Trigger */}
                <button
                  onClick={() => toggleMeshPowerMode()}
                  className={`px-3 py-2 flex items-center gap-2.5 transition-all cursor-pointer text-left ${
                    meshPowerMode === 'high-performance'
                      ? 'bg-gradient-to-r from-amber-950/95 via-orange-950/90 to-slate-950/95 text-amber-100 hover:from-amber-900/95 hover:to-slate-900/95'
                      : 'bg-gradient-to-r from-emerald-950/95 via-teal-950/90 to-slate-950/95 text-emerald-100 hover:from-emerald-900/95 hover:to-slate-900/95'
                  }`}
                  title="Nhấn để chuyển đổi nhanh High Performance ⇄ Battery Saver cho tất cả thiết bị đồng thời qua BroadcastChannel"
                >
                  {/* Animated Icon Circle */}
                  <div
                    className={`p-1.5 rounded-xl border flex items-center justify-center transition-all ${
                      meshPowerMode === 'high-performance'
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    }`}
                  >
                    {meshPowerMode === 'high-performance' ? (
                      <Zap size={15} className="fill-amber-400 text-amber-400 animate-pulse" />
                    ) : (
                      <Leaf size={15} className="fill-emerald-400/40 text-emerald-400 animate-pulse" />
                    )}
                  </div>

                  {/* Mode Titles & Broadcast Sync badge */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold tracking-tight">
                        {meshPowerMode === 'high-performance' ? 'High Performance' : 'Battery Saver'}
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold tracking-wider ${
                          meshPowerMode === 'high-performance'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {meshPowerMode === 'high-performance' ? 'TURBO' : 'ECO'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Radio size={9} className="text-cyan-400 animate-pulse" />
                      <span>BroadcastChannel:</span>
                      <span className="font-semibold text-slate-200">
                        {meshPowerMode === 'high-performance' ? 'Chuyển Eco →' : 'Chuyển Turbo →'}
                      </span>
                    </div>
                  </div>

                  {/* Toggle Switch Visual */}
                  <div
                    className={`w-9 h-5 rounded-full p-0.5 border transition-all flex items-center ml-1 ${
                      meshPowerMode === 'high-performance'
                        ? 'bg-amber-500/30 border-amber-500/60 justify-end'
                        : 'bg-emerald-500/30 border-emerald-500/60 justify-start'
                    }`}
                  >
                    <motion.div
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`w-4 h-4 rounded-full shadow-md ${
                        meshPowerMode === 'high-performance' ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                    />
                  </div>
                </button>

                {/* Details Drawer Toggle Button */}
                <button
                  onClick={() => setIsFabDrawerOpen((prev) => !prev)}
                  className={`px-2 py-3 border-l text-slate-400 hover:text-slate-200 transition-colors cursor-pointer bg-slate-950/70 ${
                    meshPowerMode === 'high-performance' ? 'border-amber-500/30' : 'border-emerald-500/30'
                  }`}
                  title="Xem ma trận thiết bị Mesh đồng bộ qua BroadcastChannel"
                >
                  <SlidersHorizontal size={13} className={isFabDrawerOpen ? 'text-cyan-400' : ''} />
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI DEEP DIAGNOSTIC ROUTINE MODAL */}
      <AnimatePresence>
        {isDiagnosticModalOpen && renderDiagnosticModal()}
      </AnimatePresence>
    </div>
  );
};
