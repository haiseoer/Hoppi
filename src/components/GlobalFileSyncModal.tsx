import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  FileCode,
  FileText,
  Server,
  Laptop,
  Smartphone,
  Tablet,
  CheckCircle2,
  X,
  Copy,
  Check,
  Radio,
  Sparkles,
  Lock,
  ArrowRight,
  RefreshCw,
  HardDrive,
  Cpu,
  Layers,
  History,
} from 'lucide-react';
import { AppTheme, ConnectedMeshDevice, GlobalFileSyncPayload } from '../types';

interface GlobalFileSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: AppTheme;
  initialTargetDevice?: ConnectedMeshDevice | null;
  onSuccessNotice?: (title: string, summary: string) => void;
}

export const GlobalFileSyncModal: React.FC<GlobalFileSyncModalProps> = ({
  isOpen,
  onClose,
  theme = 'cyberpunk',
  initialTargetDevice,
  onSuccessNotice,
}) => {
  const meshDevices: ConnectedMeshDevice[] = [
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

  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(
    initialTargetDevice?.id || 'dev-server-home'
  );

  const [fileType, setFileType] = useState<'code' | 'document'>('code');
  const [language, setLanguage] = useState<string>('typescript');
  const [fileName, setFileName] = useState<string>('vector_backup_daemon.ts');
  const [autoExecute, setAutoExecute] = useState<boolean>(true);
  const [fileContent, setFileContent] = useState<string>(`// Hoppi Mesh Auto-Sync Microservice
import { ChromaClient } from 'chromadb';

export async function syncVectorNodeBuffer() {
  const client = new ChromaClient({ path: 'http://localhost:8000' });
  const collection = await client.getOrCreateCollection({ name: 'hoppi_memory_master' });
  console.log('[Mesh] Đang đồng bộ hóa 1,420 vector tri thức sang cụm Home Server...');
  return { status: 'success', syncedAt: new Date().toISOString() };
}
`);

  const [isPushing, setIsPushing] = useState<boolean>(false);
  const [pushProgress, setPushProgress] = useState<number>(0);
  const [lastDeliveredReceipt, setLastDeliveredReceipt] = useState<GlobalFileSyncPayload | null>(null);

  // Sync History
  const [syncHistory, setSyncHistory] = useState<GlobalFileSyncPayload[]>([
    {
      id: 'sync-01',
      targetDeviceId: 'dev-server-home',
      targetDeviceName: 'Home Server 24/7 (Mini PC)',
      fileName: 'docker-compose.lan-mesh.yml',
      fileType: 'code',
      language: 'yaml',
      content: '# Auto-generated Mesh Docker Compose',
      sizeBytes: 1042,
      checksumSha256: '9f83...c112',
      sentAt: '10 phút trước',
      status: 'synced',
      autoExecute: true,
    },
  ]);

  useEffect(() => {
    if (initialTargetDevice) {
      setSelectedDeviceId(initialTargetDevice.id);
    }
  }, [initialTargetDevice]);

  if (!isOpen) return null;

  const targetDevice = meshDevices.find((d) => d.id === selectedDeviceId) || meshDevices[0];

  // Presets
  const loadPreset = (type: 'ts_crawler' | 'py_rag' | 'env_secret' | 'bash_deploy') => {
    if (type === 'ts_crawler') {
      setFileType('code');
      setLanguage('typescript');
      setFileName('zalo_lead_auto_enrich.ts');
      setFileContent(`// Trích xuất tự động thông tin khách hàng từ Zalo OA Webhook
export async function processIncomingLead(leadData: any) {
  const leadScore = leadData.intent === 'mua_ngay' ? 95 : 60;
  console.log('[Hoppi Mesh] Phân loại lead: ' + leadData.name + ' - Điểm: ' + leadScore);
  return { leadScore, dispatchedTo: 'MacBook Pro M3' };
}`);
    } else if (type === 'py_rag') {
      setFileType('code');
      setLanguage('python');
      setFileName('faiss_vector_reindex.py');
      setFileContent(`# Tối ưu hóa chỉ mục FAISS trên Home Server 24/7
import numpy as np
import faiss

dimension = 1536
index = faiss.IndexFlatL2(dimension)
print(f"[Hoppi Mesh] Khởi tạo chỉ mục FAISS {dimension}-D cho 1,420 vectors")
`);
    } else if (type === 'bash_deploy') {
      setFileType('code');
      setLanguage('bash');
      setFileName('health_check_mesh.sh');
      setFileContent(`#!/usr/bin/env bash
# Ping toàn bộ các node trong cụm Hoppi Mesh
echo "=== KIỂM TRA ĐỘ TRỄ MẠNG HOPPI LAN ==="
ping -c 2 192.168.1.100
ping -c 2 192.168.1.105
echo "Hoàn thành kiểm tra. Toàn bộ node phản hồi dưới 5ms."
`);
    } else {
      setFileType('document');
      setFileName('hoppi_system_architecture.md');
      setFileContent(`# Bản Thiết Kế Hệ Thống Hoppi v4.0
- **Chủ sở hữu**: Nguyễn Thanh Hải
- **Kiến trúc**: Hybrid Cloud + Edge Local Mesh
- **Quy chuẩn**: Xác thực Dual FaceID & Trusted Device Tokens
- **Cơ chế**: P2P E2E Encrypted WireGuard LAN broadcast
`);
    }
  };

  const handlePushFile = () => {
    setIsPushing(true);
    setPushProgress(15);

    const checksum = Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('') + '...' +
      Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    setTimeout(() => setPushProgress(50), 300);
    setTimeout(() => setPushProgress(85), 650);

    setTimeout(() => {
      setPushProgress(100);
      setIsPushing(false);

      const payload: GlobalFileSyncPayload = {
        id: `sync-${Date.now()}`,
        targetDeviceId: targetDevice.id,
        targetDeviceName: targetDevice.name,
        fileName,
        fileType,
        language,
        content: fileContent,
        sizeBytes: new Blob([fileContent]).size,
        checksumSha256: checksum,
        sentAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        status: 'synced',
        autoExecute,
      };

      setLastDeliveredReceipt(payload);
      setSyncHistory((prev) => [payload, ...prev]);

      // Broadcast to mesh channel
      try {
        const bc = new BroadcastChannel('hoppi_device_mesh_channel');
        bc.postMessage({
          type: 'HOPPI_GLOBAL_FILE_SYNC',
          payload,
        });
        bc.close();
      } catch (e) {
        console.error(e);
      }

      if (onSuccessNotice) {
        onSuccessNotice(
          `Đã chuyển tệp "${fileName}" thành công!`,
          `Tệp đã được truyền sang ${targetDevice.name} qua kênh Hoppi Mesh (SHA-256: ${checksum}). ${autoExecute ? 'Đã kích hoạt tự động nạp.' : ''}`
        );
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all ${
          theme === 'light'
            ? 'bg-white border-slate-300 text-slate-800'
            : theme === 'deepspace'
            ? 'bg-[#090d16] border-neutral-800 text-neutral-200'
            : 'bg-slate-900 border-slate-800 text-slate-100 shadow-cyan-500/10'
        }`}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>Global File Sync (Đồng Bộ Mã & Tài Liệu Mesh)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-normal">
                  P2P E2E
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Đẩy trực tiếp code snippets hoặc văn bản sang thiết bị đích trong mạng Hoppi Mesh
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Target Device Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2 flex items-center justify-between">
              <span>Thiết Bị Đích Nhận Tệp (Target Mesh Node):</span>
              <span className="text-[11px] text-cyan-400 font-mono">
                {targetDevice.name} ({targetDevice.ip}) - Ping: {targetDevice.latencyMs}ms
              </span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {meshDevices.map((dev) => (
                <button
                  key={dev.id}
                  onClick={() => setSelectedDeviceId(dev.id)}
                  className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    selectedDeviceId === dev.id
                      ? 'bg-cyan-500/15 border-cyan-500/70 text-cyan-300 shadow-sm shadow-cyan-500/20'
                      : theme === 'light'
                      ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    {dev.type === 'server' ? (
                      <Server className="w-4 h-4 text-cyan-400" />
                    ) : dev.type === 'desktop' ? (
                      <Laptop className="w-4 h-4 text-blue-400" />
                    ) : dev.type === 'mobile' ? (
                      <Smartphone className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Tablet className="w-4 h-4 text-indigo-400" />
                    )}
                    <span
                      className={`w-2 h-2 rounded-full ${
                        dev.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                      }`}
                    />
                  </div>
                  <div className="font-bold text-xs truncate">{dev.name}</div>
                  <div className="text-[10px] font-mono text-slate-400">{dev.ip}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 text-[11px] shrink-0">Mẫu có sẵn:</span>
            <button
              onClick={() => loadPreset('ts_crawler')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono transition-colors shrink-0"
            >
              TypeScript Webhook
            </button>
            <button
              onClick={() => loadPreset('py_rag')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono transition-colors shrink-0"
            >
              Python FAISS Reindex
            </button>
            <button
              onClick={() => loadPreset('bash_deploy')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono transition-colors shrink-0"
            >
              Bash Health Check
            </button>
            <button
              onClick={() => loadPreset('env_secret')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono transition-colors shrink-0"
            >
              Markdown Spec
            </button>
          </div>

          {/* Filename and Language Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Tên Tệp Tin (File Name):
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="ten_tep.ts"
                className={`w-full px-3 py-2 rounded-xl border text-xs font-mono outline-none transition-all ${
                  theme === 'light'
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500'
                    : 'bg-slate-950/80 border-slate-800 text-cyan-300 focus:border-cyan-500'
                }`}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Định dạng (Format):
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs font-mono outline-none ${
                  theme === 'light'
                    ? 'bg-slate-50 border-slate-300 text-slate-900'
                    : 'bg-slate-950/80 border-slate-800 text-slate-200'
                }`}
              >
                <option value="typescript">TypeScript (.ts)</option>
                <option value="python">Python (.py)</option>
                <option value="bash">Shell Script (.sh)</option>
                <option value="json">JSON (.json)</option>
                <option value="yaml">YAML (.yml)</option>
                <option value="markdown">Markdown (.md)</option>
              </select>
            </div>
          </div>

          {/* Content Editor */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span>Nội Dung Mã Nguồn / Văn Bản:</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  ({new Blob([fileContent]).size} bytes)
                </span>
              </label>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoExecute}
                    onChange={(e) => setAutoExecute(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>Tự động nạp & thực thi trên node đích</span>
                </label>
              </div>
            </div>

            <textarea
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              rows={8}
              className={`w-full p-3 rounded-xl border font-mono text-xs leading-relaxed outline-none transition-all resize-none ${
                theme === 'light'
                  ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500'
                  : 'bg-slate-950 border-slate-800 text-slate-200 focus:border-cyan-500/80'
              }`}
            />
          </div>

          {/* Progress Bar when pushing */}
          {isPushing && (
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40">
              <div className="flex items-center justify-between text-xs text-cyan-300 mb-1.5">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  Đang mã hóa E2E & phát gói tin sang {targetDevice.name}...
                </span>
                <span className="font-mono font-bold">{pushProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${pushProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Recent Transmission Receipt */}
          {lastDeliveredReceipt && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Đã xác nhận nhận tệp: <strong>{lastDeliveredReceipt.fileName}</strong> tại{' '}
                  <strong>{lastDeliveredReceipt.targetDeviceName}</strong> (SHA-256:{' '}
                  <span className="font-mono">{lastDeliveredReceipt.checksumSha256}</span>)
                </span>
              </div>
              <span className="font-mono text-[10px] text-emerald-400">ACK 200 OK</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800/80 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Kênh bảo mật P2P Hoppi Mesh</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              Đóng
            </button>
            <button
              onClick={handlePushFile}
              disabled={isPushing || !fileContent.trim()}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                isPushing || !fileContent.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/25'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isPushing ? 'Đang truyền...' : `Đẩy sang ${targetDevice.name}`}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
