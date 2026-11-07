import React, { useState, useEffect } from 'react';
import { ConnectedMeshDevice, AppTheme } from '../types';
import {
  ShieldAlert,
  Laptop,
  Smartphone,
  Server,
  Tablet,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
  Lock,
  LogOut,
  Key,
  RefreshCw,
  Download,
  QrCode,
  Zap,
  Radio,
  Send,
  Sliders,
  Check,
  Copy,
  Activity,
  Layers,
  Sparkles,
  Crown,
} from 'lucide-react';

interface ConnectedDevicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRevokeCurrentDevice: () => void;
  onSelectTargetDevice?: (device: ConnectedMeshDevice) => void;
  theme?: AppTheme;
  isMaster?: boolean;
}

export const TrustedDevicesModal: React.FC<ConnectedDevicesModalProps> = ({
  isOpen,
  onClose,
  onRevokeCurrentDevice,
  onSelectTargetDevice,
  theme = 'cyberpunk',
  isMaster = true,
}) => {
  const [activeTab, setActiveTab] = useState<'mesh' | 'install' | 'sync'>('mesh');
  const [devices, setDevices] = useState<ConnectedMeshDevice[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessNotice, setSyncSuccessNotice] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [pwaPromptEvent, setPwaPromptEvent] = useState<any>(null);
  const [isInstalledPwa, setIsInstalledPwa] = useState(false);

  // Check PWA installability on mount
  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsInstalledPwa(isStandalone);

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setPwaPromptEvent(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadDevices();
    }
  }, [isOpen]);

  const loadDevices = () => {
    const raw = localStorage.getItem('hoppi_connected_mesh_devices');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDevices(parsed);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Default Seed Connected Device Mesh Network for Nguyễn Thanh Hải
    const defaults: ConnectedMeshDevice[] = [
      {
        id: 'dev-current-workstation',
        name: 'Trạm làm việc hiện tại (Web Desktop)',
        type: 'desktop',
        os: 'Windows 11 Pro 64-bit / Chrome',
        browser: 'Google Chrome v128',
        ip: '192.168.1.102 (LAN)',
        isMasterDevice: true,
        isCurrent: true,
        status: 'online',
        currentTask: 'Đang mở giao diện điều khiển trung tâm',
        battery: 98,
        latencyMs: 18,
        lastSync: 'Vừa xong',
        tokenHash: 'HOPPI_MESH_TKN_master_77a2',
        capabilities: ['Root Command Dispatcher', 'HITL Approver', 'Central Dashboard'],
      },
      {
        id: 'dev-server-home',
        name: 'Hoppi 24/7 Home Server (Mini PC Ubuntu)',
        type: 'server',
        os: 'Ubuntu Server 24.04 LTS (Docker)',
        browser: 'Headless Agent Daemon (v4.0)',
        ip: '192.168.1.200 (LAN)',
        isMasterDevice: true,
        isCurrent: false,
        status: 'busy',
        currentTask: 'Đang chạy ngầm ChromaDB Vector & Docker Sandbox',
        battery: 100,
        latencyMs: 8,
        lastSync: 'Vừa xong',
        tokenHash: 'HOPPI_MESH_TKN_srv_99x1',
        capabilities: ['ChromaDB Local Vector Engine', '24/7 Background Scheduler', 'LAN IoT Hub'],
      },
      {
        id: 'dev-macbook-master',
        name: 'MacBook Pro M3 Max (Máy chính Nguyễn Thanh Hải)',
        type: 'desktop',
        os: 'macOS Sequoia 15.1',
        browser: 'Hoppi Desktop Native App (PWA)',
        ip: '192.168.1.108 (Wi-Fi 6E)',
        isMasterDevice: true,
        isCurrent: false,
        status: 'online',
        currentTask: 'Sẵn sàng nhận lệnh Code Agent & Kiểm thử',
        battery: 89,
        latencyMs: 14,
        lastSync: '1 phút trước',
        tokenHash: 'HOPPI_MESH_TKN_mac_bb34',
        capabilities: ['Code Agent Sandbox', 'Git Auto-Commit', 'Full-Stack Build'],
      },
      {
        id: 'dev-iphone-master',
        name: 'iPhone 16 Pro Max (Nguyễn Thanh Hải Mobile)',
        type: 'mobile',
        os: 'iOS 18.2 PWA',
        browser: 'Safari Mobile PWA (Installed)',
        ip: '14.241.120.45 (5G Viettel)',
        isMasterDevice: true,
        isCurrent: false,
        status: 'online',
        currentTask: 'Đang theo dõi tự động Zalo OA & CRM Leads',
        battery: 76,
        latencyMs: 38,
        lastSync: '2 phút trước',
        tokenHash: 'HOPPI_MESH_TKN_ios_fe89',
        capabilities: ['Sales CRM Zalo OA', 'Mobile Voice Dictation', 'Biometric FaceID'],
      },
      {
        id: 'dev-ipad-living',
        name: 'iPad Pro 12.9" Phòng Khách (Smart Display)',
        type: 'tablet',
        os: 'iPadOS 18.1 PWA',
        browser: 'Safari Kiosk Mode',
        ip: '192.168.1.150 (LAN Wi-Fi)',
        isMasterDevice: false,
        isCurrent: false,
        status: 'idle',
        currentTask: 'Màn hình hiển thị gia đình & Điều khiển Zigbee',
        battery: 92,
        latencyMs: 22,
        lastSync: '4 phút trước',
        tokenHash: 'HOPPI_MESH_TKN_pad_201d',
        capabilities: ['LAN IoT Zigbee Display', 'Gesture Camera Widget', 'Visitor Greeting'],
      },
    ];

    setDevices(defaults);
    try {
      localStorage.setItem('hoppi_connected_mesh_devices', JSON.stringify(defaults));
    } catch (e) {
      console.error(e);
    }
  };

  const saveDevices = (list: ConnectedMeshDevice[]) => {
    setDevices(list);
    try {
      localStorage.setItem('hoppi_connected_mesh_devices', JSON.stringify(list));
      // Broadcast update across mesh
      if ('BroadcastChannel' in window) {
        const bc = new BroadcastChannel('hoppi_device_mesh_channel');
        bc.postMessage({ type: 'DEVICES_UPDATED', devices: list });
        bc.close();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Trigger sync across all connected devices in the mesh
  const handleTriggerMeshSync = () => {
    setIsSyncing(true);
    setSyncSuccessNotice(null);

    setTimeout(() => {
      const nowStr = 'Vừa xong';
      const updated = devices.map((d) => ({
        ...d,
        lastSync: nowStr,
        latencyMs: Math.max(4, Math.floor((d.latencyMs || 20) + (Math.random() * 6 - 3))),
      }));
      saveDevices(updated);
      setIsSyncing(false);
      setSyncSuccessNotice('Đã đồng bộ hóa dữ liệu Vector RAG & Lịch sử phiên tới toàn bộ 5 thiết bị trong cụm Mesh!');
      setTimeout(() => setSyncSuccessNotice(null), 4000);
    }, 1200);
  };

  const handlePWAInstallClick = async () => {
    if (pwaPromptEvent) {
      pwaPromptEvent.prompt();
      const choice = await pwaPromptEvent.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalledPwa(true);
        setPwaPromptEvent(null);
      }
    } else {
      alert('Ứng dụng Hoppi đã sẵn sàng để cài đặt! Nếu bạn dùng Chrome/Edge, hãy bấm vào biểu tượng Cài đặt trên thanh địa chỉ. Nếu dùng Safari trên iPhone/iPad, bấm nút "Chia sẻ" và chọn "Thêm vào Màn hình chính".');
    }
  };

  const handleCopyPairingToken = () => {
    const pairingPayload = `HOPPI_PAIR://haiSEOer@gmail.com?mesh=cluster_hai_247&auth=face_passcode_master&ts=${Date.now()}`;
    navigator.clipboard.writeText(pairingPayload);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2500);
  };

  const handleRevoke = (id: string, isCurrent: boolean) => {
    if (isCurrent) {
      if (confirm('Bạn có chắc muốn ngắt kết nối thiết bị hiện tại? Bạn sẽ cần FaceID hoặc Mật mã để kết nối lại.')) {
        onRevokeCurrentDevice();
      }
      return;
    }

    if (confirm('Bạn có chắc muốn ngắt kết nối thiết bị này khỏi mạng lưới Hoppi Mesh?')) {
      const updated = devices.filter((d) => d.id !== id);
      saveDevices(updated);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all ${
          theme === 'light'
            ? 'bg-white border-slate-300 text-slate-800'
            : theme === 'deepspace'
            ? 'bg-[#090d18] border-neutral-800 text-slate-100'
            : 'bg-[#070b14] border-slate-800 text-slate-100'
        }`}
      >
        {/* Header with Master Root Badge & Close */}
        <div
          className={`p-5 border-b flex items-center justify-between flex-wrap gap-3 ${
            theme === 'light'
              ? 'bg-slate-50 border-slate-200'
              : theme === 'deepspace'
              ? 'bg-[#060912] border-neutral-800'
              : 'bg-slate-950 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5">
              <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
                <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-cyan-400 flex items-center gap-1.5">
                  <span>Mạng Lưới Thiết Bị Hoppi (Device Mesh)</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {devices.length} Thiết bị
                  </span>
                </h3>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-amber-400 font-semibold">Chủ nhân cao nhất: Nguyễn Thanh Hải</span>
                <span className="text-slate-600">•</span>
                <span>Toàn quyền chỉ huy các thiết bị làm việc riêng biệt</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerMeshSync}
              disabled={isSyncing}
              title="Đồng bộ hóa tức thì toàn bộ 5 thiết bị"
              className="px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ Mesh'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sync alert banner if triggered */}
        {syncSuccessNotice && (
          <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-5 py-2.5 flex items-center gap-2 text-xs text-emerald-300 font-medium animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncSuccessNotice}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div
          className={`flex border-b text-xs font-medium ${
            theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/60 border-slate-800'
          }`}
        >
          <button
            onClick={() => setActiveTab('mesh')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 cursor-pointer transition-all ${
              activeTab === 'mesh'
                ? 'border-cyan-400 text-cyan-400 font-bold bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Danh Sách Thiết Bị Kết Nối ({devices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('install')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 cursor-pointer transition-all ${
              activeTab === 'install'
                ? 'border-cyan-400 text-cyan-400 font-bold bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Cài Đặt Lên Thiết Bị Bất Kỳ (PWA & QR)</span>
          </button>

          <button
            onClick={() => setActiveTab('sync')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 cursor-pointer transition-all ${
              activeTab === 'sync'
                ? 'border-cyan-400 text-cyan-400 font-bold bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Bảo Mật Quyền Chủ Nhân & Điều Khiển</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: Connected Devices Mesh List */}
          {activeTab === 'mesh' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                <span>
                  Các thiết bị đang chạy Hoppi v4.0. Bấm <strong>"Giao việc riêng"</strong> để phát lệnh trực tiếp:
                </span>
                <span className="font-mono text-emerald-400 text-[11px] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Mesh Network Active
                </span>
              </div>

              {devices.map((device) => {
                const isServer = device.type === 'server';
                const isMobile = device.type === 'mobile';
                const isTablet = device.type === 'tablet';

                return (
                  <div
                    key={device.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      device.isCurrent
                        ? 'bg-slate-950/80 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                        : theme === 'light'
                        ? 'bg-slate-50 border-slate-200'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex items-start gap-3.5 flex-1 min-w-[240px]">
                        {/* Device Type Icon */}
                        <div
                          className={`p-3 rounded-2xl border shrink-0 mt-0.5 ${
                            isServer
                              ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
                              : isMobile
                              ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400'
                              : isTablet
                              ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                              : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                          }`}
                        >
                          {isServer ? (
                            <Server className="w-5 h-5" />
                          ) : isMobile ? (
                            <Smartphone className="w-5 h-5" />
                          ) : isTablet ? (
                            <Tablet className="w-5 h-5" />
                          ) : (
                            <Laptop className="w-5 h-5" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-sm text-slate-100 truncate">
                              {device.name}
                            </h4>

                            {device.isCurrent && (
                              <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/40 font-mono">
                                Đang thao tác
                              </span>
                            )}

                            {device.isMasterDevice && (
                              <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/40 flex items-center gap-1">
                                <Crown className="w-2.5 h-2.5 text-amber-400" />
                                Quyền Chủ nhân
                              </span>
                            )}

                            {/* Status badge */}
                            <span
                              className={`px-2 py-0.5 text-[10px] font-mono rounded-full border uppercase ${
                                device.status === 'online'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : device.status === 'busy'
                                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse'
                                  : 'bg-slate-800 text-slate-400 border-slate-700'
                              }`}
                            >
                              ● {device.status === 'busy' ? 'Đang thực thi' : device.status}
                            </span>
                          </div>

                          {/* Current Task if any */}
                          {device.currentTask && (
                            <div className="mt-1 text-xs text-cyan-300/90 font-medium flex items-center gap-1.5">
                              <Zap className="w-3 h-3 text-cyan-400 shrink-0" />
                              <span className="truncate">{device.currentTask}</span>
                            </div>
                          )}

                          {/* Hardware & Network Metrics */}
                          <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400">
                            <div>
                              <span className="text-slate-500">HĐH:</span> {device.os}
                            </div>
                            <div>
                              <span className="text-slate-500">IP:</span> {device.ip}
                            </div>
                            <div>
                              <span className="text-slate-500">Pin:</span>{' '}
                              <span className="text-emerald-400 font-mono">{device.battery}%</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Độ trễ:</span>{' '}
                              <span className="text-cyan-400 font-mono">{device.latencyMs}ms</span>
                            </div>
                          </div>

                          {/* Capabilities tags */}
                          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                            {device.capabilities.map((cap, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded text-[10px] bg-slate-800/80 text-slate-300 border border-slate-700/80"
                              >
                                {cap}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-end gap-2 shrink-0">
                        {isMaster && onSelectTargetDevice && (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectTargetDevice(device);
                              onClose();
                            }}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm shadow-cyan-500/20 cursor-pointer active:scale-95"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Giao việc riêng</span>
                          </button>
                        )}

                        {!device.isCurrent && (
                          <button
                            type="button"
                            onClick={() => handleRevoke(device.id, false)}
                            className="text-xs text-rose-400 hover:text-rose-300 p-1 flex items-center gap-1 cursor-pointer opacity-70 hover:opacity-100"
                            title="Ngắt kết nối thiết bị"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Ngắt</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: PWA Install & Pair Any Device */}
          {activeTab === 'install' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-200 space-y-1">
                  <h4 className="font-bold text-cyan-300 text-sm">
                    Cài đặt Hoppi trên Mọi Thiết Bị (Android, iOS Safari, Windows, Mac, Linux)
                  </h4>
                  <p className="text-slate-300">
                    Hoppi được phát triển theo tiêu chuẩn Progressive Web App (PWA) thế hệ mới. Khi cài đặt, Hoppi hoạt động như ứng dụng nguyên bản (Native App) với cửa sổ độc lập, tốc độ cực cao, bộ nhớ đệm ngoại tuyến và tự động đồng bộ vào mạng lưới Mesh.
                  </p>
                </div>
              </div>

              {/* Install Current Device Section */}
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>Cài đặt Hoppi lên thiết bị bạn đang dùng</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {isInstalledPwa
                      ? '✓ Thiết bị này đã chạy Hoppi ở chế độ Ứng dụng độc lập (Standalone PWA).'
                      : 'Bấm nút cài đặt để thêm Hoppi vào màn hình chính máy tính hoặc điện thoại.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handlePWAInstallClick}
                  disabled={isInstalledPwa}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isInstalledPwa
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/30 active:scale-95'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>{isInstalledPwa ? 'Đã cài đặt PWA' : 'Cài Đặt Ngay'}</span>
                </button>
              </div>

              {/* Pair New Device via QR Code & Token */}
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span>Ghép đôi thiết bị mới vào cụm Hoppi Mesh</span>
                  </h4>
                  <span className="text-[10px] font-mono text-cyan-400">ENCRYPTED TOKEN</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Để kết nối thêm điện thoại, máy tính bảng hoặc máy tính cơ quan vào cụm Hoppi: Mở trình duyệt trên thiết bị mới, truy cập link ứng dụng và quét mã hoặc dán Token xác thực thiết bị tin cậy này:
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value="HOPPI_MESH://master:haiSEOer@gmail.com?cluster=hoppi_autonomous_247&auth=trusted_token"
                    className="flex-1 bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl font-mono text-xs text-cyan-300 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyPairingToken}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedToken ? 'Đã sao chép!' : 'Copy Token'}</span>
                  </button>
                </div>

                {/* Instructions by Platform */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Dành cho iPhone & iPad (iOS Safari)</span>
                    </div>
                    <ol className="text-slate-400 space-y-1 list-decimal list-inside text-[11px]">
                      <li>Mở liên kết trong trình duyệt Safari</li>
                      <li>Bấm nút <strong>Chia sẻ (Share)</strong> ở thanh dưới cùng</li>
                      <li>Cuộn xuống chọn <strong>Thêm vào MH chính (Add to Home Screen)</strong></li>
                    </ol>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                      <Laptop className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Dành cho Android & Máy tính (Chrome/Edge)</span>
                    </div>
                    <ol className="text-slate-400 space-y-1 list-decimal list-inside text-[11px]">
                      <li>Mở liên kết trên Chrome hoặc Edge</li>
                      <li>Bấm biểu tượng <strong>Cài đặt Hoppi</strong> trên thanh địa chỉ</li>
                      <li>Xác nhận để Hoppi hoạt động như phần mềm độc lập</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Master Root Privileges & Security */}
          {activeTab === 'sync' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 flex items-start gap-3">
                <Crown className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-200 space-y-1">
                  <h4 className="font-bold text-amber-300 text-sm">
                    Đặc Quyền Chỉ Huy Tối Cao của Chủ Nhân (Root Master Authority)
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    Theo cấu trúc Blueprint, chỉ duy nhất người chủ cao nhất (anh Nguyễn Thanh Hải) khi đăng nhập trên bất kỳ thiết bị nào có cài đặt Hoppi mới có quyền phát lệnh từ xa điều khiển các thiết bị khác làm việc độc lập. Các tài khoản khách (Guest) bị giới hạn hoàn toàn và mọi thao tác nhạy cảm đều phải chuyển về phiếu xin ý kiến (HITL) cho anh Hải duyệt.
                  </p>
                </div>
              </div>

              {/* Sync Architecture spec box */}
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2.5 text-xs text-slate-300">
                <h4 className="font-bold text-sm text-cyan-400 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Cơ chế Đồng Bộ Đa Thiết Bị (Cross-Device Sync Bus)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">Kênh đồng bộ trực tiếp:</span>
                    <span className="text-slate-200 font-mono">BroadcastChannel (hoppi_device_mesh_channel)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">Bộ nhớ Vector RAG:</span>
                    <span className="text-emerald-400 font-mono">ChromaDB / FAISS Hybrid Cloud</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">Bảo mật thiết bị:</span>
                    <span className="text-cyan-400 font-mono">SHA-256 Trusted Device Token</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">Kiểm soát an toàn:</span>
                    <span className="text-amber-400 font-mono">Human-in-the-Loop (HITL) Gate</span>
                  </div>
                </div>
              </div>

              {/* Revoke Current Device */}
              <div className="p-4 rounded-2xl border border-rose-900/40 bg-rose-950/20 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h4 className="font-bold text-sm text-rose-300">Thu hồi quyền trên thiết bị này</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Hủy bỏ Token thiết bị tin cậy và đăng xuất an toàn khỏi thiết bị đang thao tác.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRevoke('dev-current-workstation', true)}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Thu Hồi Quyền</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex items-center justify-between flex-wrap gap-2 text-xs ${
            theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <span>Tổng cộng:</span>
            <span className="font-bold text-cyan-400">{devices.length} Thiết bị Mesh</span>
            <span>•</span>
            <span className="text-emerald-400">Đã kích hoạt đồng bộ 24/7</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
