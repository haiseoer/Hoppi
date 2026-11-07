import React, { useState } from 'react';
import {
  X,
  Camera,
  FileDown,
  FileCode,
  Copy,
  Check,
  Building2,
  Cpu,
  Wifi,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
  Clock,
  HardDrive,
  Download,
  AlertCircle,
} from 'lucide-react';
import { AppTheme, UserIdentity } from '../types';
import {
  buildDashboardSnapshotData,
  exportDashboardSnapshotAsJson,
  exportDashboardSnapshotAsPdf,
  DashboardSnapshotData,
} from '../utils/dashboardSnapshot';

interface DashboardSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  identity?: UserIdentity | null;
  theme?: AppTheme;
  departmentTaskOverrides?: Record<string, string>;
  onSpeakText?: (text: string) => void;
}

export const DashboardSnapshotModal: React.FC<DashboardSnapshotModalProps> = ({
  isOpen,
  onClose,
  identity,
  theme = 'cyberpunk',
  departmentTaskOverrides = {},
  onSpeakText,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | '3dhq' | 'iot' | 'mesh' | 'raw_json'>('overview');
  const [copied, setCopied] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Generate snapshot data dynamically whenever modal is opened
  const snapshotData: DashboardSnapshotData = React.useMemo(() => {
    return buildDashboardSnapshotData({
      identity,
      theme,
      departmentTaskOverrides,
    });
  }, [isOpen, identity, theme, departmentTaskOverrides]);

  if (!isOpen) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(snapshotData, null, 2));
    setCopied(true);
    setExportNotice('✓ Đã sao chép toàn bộ dữ liệu Snapshot JSON vào Clipboard!');
    setTimeout(() => {
      setCopied(false);
      setExportNotice(null);
    }, 2800);
  };

  const handleExportJson = () => {
    exportDashboardSnapshotAsJson(snapshotData);
    setExportNotice('✓ Đã tạo và tải xuống file JSON thành công!');
    if (onSpeakText) {
      onSpeakText('Đã xuất thành công file Snapshot JSON dữ liệu Tổng hành dinh 3D và IoT cho Chủ nhân.');
    }
    setTimeout(() => setExportNotice(null), 3500);
  };

  const handleExportPdf = () => {
    exportDashboardSnapshotAsPdf(snapshotData);
    setExportNotice('✓ Đã biên dịch và tải xuống tài liệu PDF thành công!');
    if (onSpeakText) {
      onSpeakText('Đã khởi tạo và tải xuống tài liệu PDF Snapshot Tổng hành dinh 3D và Thiết bị IoT hoàn chỉnh.');
    }
    setTimeout(() => setExportNotice(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border-2 shadow-2xl overflow-hidden transition-all duration-300 ${
          theme === 'cyberpunk'
            ? 'bg-[#090d18] border-cyan-500/50 shadow-cyan-950/60 text-slate-100'
            : theme === 'deepspace'
            ? 'bg-[#060912] border-indigo-500/50 shadow-indigo-950/60 text-slate-100'
            : 'bg-white border-slate-300 shadow-slate-300 text-slate-900'
        }`}
      >
        {/* Top Header Bar */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between flex-wrap gap-3 ${
            theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/30">
              <div
                className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                  theme === 'light' ? 'bg-white text-cyan-600' : 'bg-slate-950 text-cyan-400'
                }`}
              >
                <Camera className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  Dashboard Snapshot (3D HQ &amp; IoT)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-bold">
                  Consolidated Export
                </span>
              </div>
              <p
                className={`text-xs ${
                  theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                } flex items-center gap-2 mt-0.5`}
              >
                <span>Mã: <strong className="font-mono text-cyan-400">{snapshotData.snapshotId}</strong></span>
                <span>•</span>
                <span>Chủ nhân: <strong className="text-emerald-400">{snapshotData.masterIdentity.name}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition cursor-pointer ${
                theme === 'light'
                  ? 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'
                  : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Confirmation Banner */}
        {exportNotice && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/50 px-4 py-2 text-xs text-emerald-200 font-bold flex items-center justify-between animate-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{exportNotice}</span>
            </div>
            <span className="text-[10px] font-mono opacity-70">Offline Ready</span>
          </div>
        )}

        {/* Navigation Tabs & Quick Action Bar */}
        <div
          className={`px-5 py-2.5 border-b flex items-center justify-between flex-wrap gap-2 text-xs ${
            theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/40 border-slate-800'
          }`}
        >
          {/* Sub-tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'overview', label: 'Tổng Quan (KPIs)', icon: Activity },
              { id: '3dhq', label: `3D HQ (${snapshotData.threeDDepartments.length} Phòng Ban)`, icon: Building2 },
              { id: 'iot', label: `Thiết Bị IoT (${snapshotData.iotDevices.length})`, icon: Wifi },
              { id: 'mesh', label: `Mạng Lưới Mesh (${snapshotData.meshNodes.length})`, icon: Cpu },
              { id: 'raw_json', label: 'Xem JSON', icon: FileCode },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-medium transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                      : theme === 'light'
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Export Buttons Group */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono font-medium transition flex items-center gap-1.5 cursor-pointer ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : theme === 'light'
                  ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
              }`}
              title="Sao chép JSON Snapshot vào bộ nhớ tạm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã chép' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-200 hover:text-cyan-300 text-xs font-mono font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Tải xuống tệp JSON đầy đủ"
            >
              <FileDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>Xuất JSON</span>
            </button>

            <button
              onClick={handleExportPdf}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/30 cursor-pointer active:scale-95"
              title="Tạo và tải xuống tài liệu PDF hoàn chỉnh cho lưu trữ offline"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất File PDF</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar min-h-0">
          {/* TAB 1: OVERVIEW & SYSTEM KPIS */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Executive Summary Banner */}
              <div
                className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  theme === 'light'
                    ? 'bg-cyan-50/60 border-cyan-200 text-slate-800'
                    : 'bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border-cyan-500/30 text-slate-100'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-extrabold text-sm uppercase tracking-wide text-cyan-400">
                      Bản Chụp Hệ Thống Hợp Nhất (Consolidated Dashboard Snapshot)
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed max-w-2xl opacity-90">
                    Bao gồm toàn bộ dữ liệu thời gian thực của 8 phòng ban ảo Tổng Hành Dinh 3D, danh sách 6 thiết bị thông minh mạng LAN IoT và 5 nút mạng Mesh liên thiết bị của Chủ nhân Nguyễn Thanh Hải.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                    <span className="text-[10px] font-mono text-slate-400 block">Thời gian chụp</span>
                    <strong className="text-xs font-mono text-white">
                      {new Date(snapshotData.generatedAt).toLocaleTimeString('vi-VN')}
                    </strong>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                    <span className="text-[10px] font-mono text-slate-400 block">Tiêu chuẩn</span>
                    <strong className="text-xs font-mono text-emerald-400">Zero-Trust HITL</strong>
                  </div>
                </div>
              </div>

              {/* KPI Metrics Ribbon (4 Cards) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div
                  className={`p-3.5 rounded-2xl border ${
                    theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">RAG Tri Thức</span>
                  <div className="text-xl font-black font-mono text-cyan-400 mt-0.5">
                    {snapshotData.globalKPIs.ragVectorsCount.toLocaleString('vi-VN')}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Vector Embeddings</span>
                </div>

                <div
                  className={`p-3.5 rounded-2xl border ${
                    theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Tác Vụ 3D Hôm Nay</span>
                  <div className="text-xl font-black font-mono text-emerald-400 mt-0.5">
                    {snapshotData.globalKPIs.tasksCompletedToday}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Hoàn tất qua 8 bàn</span>
                </div>

                <div
                  className={`p-3.5 rounded-2xl border ${
                    theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Thiết Bị IoT LAN</span>
                  <div className="text-xl font-black font-mono text-amber-400 mt-0.5">
                    {snapshotData.globalKPIs.iotDevicesActive} / 6
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Đang kết nối mDNS</span>
                </div>

                <div
                  className={`p-3.5 rounded-2xl border ${
                    theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Mạng Lưới Mesh</span>
                  <div className="text-xl font-black font-mono text-purple-400 mt-0.5">
                    {snapshotData.globalKPIs.meshNodesOnline} / 5
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Thiết bị trực chiến 24/7</span>
                </div>
              </div>

              {/* Quick Split View Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Preview: 3D HQ Highlights */}
                <div
                  className={`p-4 rounded-2xl border space-y-2.5 ${
                    theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 text-cyan-400">
                      <Building2 className="w-4 h-4" />
                      8 Phòng Ban Tổng Hành Dinh 3D
                    </span>
                    <button
                      onClick={() => setActiveTab('3dhq')}
                      className="text-[11px] text-cyan-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Xem tất cả</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {snapshotData.threeDDepartments.slice(0, 4).map((d) => (
                      <div
                        key={d.id}
                        className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between"
                      >
                        <div>
                          <strong className="text-white text-[11px] block">{d.shortName}</strong>
                          <span className="text-[10px] text-slate-400 truncate max-w-[210px] block">
                            {d.currentTask}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                          {d.tasksCompletedToday} xong
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Preview: IoT Device Statuses */}
                <div
                  className={`p-4 rounded-2xl border space-y-2.5 ${
                    theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 text-amber-400">
                      <Wifi className="w-4 h-4" />
                      Trạng Thái Thiết Bị LAN IoT
                    </span>
                    <button
                      onClick={() => setActiveTab('iot')}
                      className="text-[11px] text-cyan-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Xem tất cả</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {snapshotData.iotDevices.slice(0, 4).map((dev) => (
                      <div
                        key={dev.id}
                        className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between"
                      >
                        <div>
                          <strong className="text-white text-[11px] block">{dev.name}</strong>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {dev.ip} • {dev.protocol}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                          {dev.pingMs}ms
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 3D HQ VIRTUAL DEPARTMENTS (FULL BREAKDOWN) */}
          {activeTab === '3dhq' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-cyan-400" />
                    Báo Cáo Trực Chiến 8 Phòng Ban Ảo (3D Virtual Desks)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Ghi nhận trạng thái robot làm việc, nhiệm vụ hiện tại và kết quả đầu ra trong không gian 3D.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/50 px-2 py-1 rounded-xl">
                  8/8 Phòng Trực Chiến
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {snapshotData.threeDDepartments.map((dept) => (
                  <div
                    key={dept.id}
                    className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-2.5"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-xs text-white flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-cyan-400" />
                          {dept.name}
                        </strong>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                          {dept.leadAgentName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">{dept.roleDescription}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 text-xs space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] text-slate-400 font-mono">Nhiệm vụ:</span>
                        <span className="text-[11px] text-cyan-300 font-medium text-right line-clamp-2">
                          {dept.currentTask}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400 font-mono">Tiến độ hôm nay:</span>
                        <strong className="text-[11px] text-emerald-400 font-mono">
                          {dept.tasksCompletedToday} việc ({dept.outputRating})
                        </strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: IOT SMART DEVICES (FULL BREAKDOWN) */}
          {activeTab === 'iot' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-amber-400" />
                    Trạng Thái Thiết Bị &amp; Cảm Biến Mạng LAN IoT
                  </h4>
                  <p className="text-xs text-slate-400">
                    Toàn bộ thông số hoạt động, giao thức nội bộ và độ trễ phản hồi tại thời điểm chụp snapshot.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-800/50 px-2 py-1 rounded-xl">
                  6/6 Thiết Bị Online
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 font-mono text-[10px] border-b border-slate-800 uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Thiết Bị (Device)</th>
                      <th className="py-2.5 px-3">Vị Trí (Location)</th>
                      <th className="py-2.5 px-3">IP / Giao Thức</th>
                      <th className="py-2.5 px-3">Độ Trễ</th>
                      <th className="py-2.5 px-3">Trạng Thái &amp; Thông Số</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {snapshotData.iotDevices.map((dev) => (
                      <tr key={dev.id} className="hover:bg-slate-900/50 transition">
                        <td className="py-2.5 px-3">
                          <strong className="text-white block text-xs">{dev.name}</strong>
                          <span className="text-[10px] font-mono text-slate-400">{dev.id}</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-300 text-[11px]">{dev.location}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px]">
                          <span className="text-cyan-400">{dev.ip}</span>
                          <span className="text-slate-500 block text-[10px]">{dev.protocol}</span>
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          <span className="text-emerald-400 font-bold">{dev.pingMs}ms</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-300 text-[11px]">
                          {dev.stateDescription}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: MESH NODES */}
          {activeTab === 'mesh' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-400" />
                    Mạng Lưới Mesh &amp; Nút Thiết Bị Tin Cậy (Multi-Device)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Thông số CPU, RAM, Pin và tác vụ ngầm trên 5 thiết bị thuộc hệ sinh thái của Chủ nhân.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/50 px-2 py-1 rounded-xl">
                  5/5 Node Kết Nối
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {snapshotData.meshNodes.map((node) => (
                  <div
                    key={node.id}
                    className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-white text-xs">{node.name}</strong>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        Online ({node.latencyMs}ms)
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono space-y-0.5">
                      <div>OS: <span className="text-slate-200">{node.os}</span></div>
                      <div>IP: <span className="text-cyan-400">{node.ip}</span></div>
                      <div className="flex items-center gap-3 pt-1">
                        <span>CPU: <strong className="text-amber-400">{node.cpuLoad}%</strong></span>
                        <span>RAM: <strong className="text-blue-400">{node.memoryUsedGB}/{node.memoryTotalGB}GB</strong></span>
                        <span>Pin: <strong className="text-emerald-400">{node.battery}%</strong></span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                      <span className="text-[10px] text-slate-500 font-mono block">Tác vụ đang chạy:</span>
                      <span className="text-cyan-300">{node.activeTask}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: RAW JSON VIEW */}
          {activeTab === 'raw_json' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  Dữ liệu JSON thô chuẩn hóa (Consolidated Raw JSON Payload):
                </span>
                <button
                  onClick={handleCopyJson}
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer font-mono"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép toàn bộ</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 max-h-96 overflow-y-auto custom-scrollbar select-text leading-relaxed">
                {JSON.stringify(snapshotData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Bottom Footer Actions */}
        <div
          className={`px-5 py-3.5 border-t flex items-center justify-between flex-wrap gap-3 text-xs ${
            theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/90 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Xác thực bởi: <strong>{snapshotData.verificationStamp.signedBy}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl border text-xs font-medium transition cursor-pointer ${
                theme === 'light'
                  ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              Đóng
            </button>

            <button
              onClick={handleExportJson}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-cyan-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-cyan-400" />
              <span>Tải File JSON</span>
            </button>

            <button
              onClick={handleExportPdf}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Tải Báo Cáo PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
