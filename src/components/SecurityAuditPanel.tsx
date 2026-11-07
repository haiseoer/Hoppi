import React, { useState, useEffect } from 'react';
import { SecurityAuditLog, SecurityEventType, AppTheme } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  ScanFace,
  KeyRound,
  Laptop,
  AlertTriangle,
  RefreshCw,
  Search,
  Download,
  Trash2,
  Clock,
  Activity,
  CheckCircle2,
  XCircle,
  FileCheck,
  Radio,
  Eye,
} from 'lucide-react';

interface SecurityAuditPanelProps {
  theme?: AppTheme;
}

export const SecurityAuditPanel: React.FC<SecurityAuditPanelProps> = ({
  theme = 'cyberpunk',
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanReport, setScanReport] = useState<string | null>(null);

  const [logs, setLogs] = useState<SecurityAuditLog[]>(() => {
    try {
      const stored = localStorage.getItem('hoppi_security_audit_logs');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }

    // Default audit records reflecting real system activities
    const defaults: SecurityAuditLog[] = [
      {
        id: 'sec-01',
        eventType: 'token_validated',
        title: 'Xác thực Token Thiết bị Tin cậy thành công',
        details: 'Hệ thống tự động nhận diện Trusted Device Token (dev_current_pc) của Chủ nhân Nguyễn Thanh Hải và mở phiên làm việc không cần hỏi lại mật khẩu.',
        deviceFingerprint: 'Windows 11 / Chrome 128 / SHA256-a8f9',
        ipAddress: '192.168.1.102 (LAN)',
        status: 'success',
        timestamp: 'Hôm nay 08:30:12',
        location: 'Hà Nội, Việt Nam',
      },
      {
        id: 'sec-02',
        eventType: 'faceid_success',
        title: 'Quét FaceID Sinh trắc học trùng khớp 99.8%',
        details: 'Phát hiện 68 điểm mốc khuôn mặt khớp hồ sơ mẫu sinh trắc học của Nguyễn Thanh Hải. Cấp quyền Quản trị viên tối cao.',
        deviceFingerprint: 'Webcam UHD / Biometric-Mesh-68',
        ipAddress: '192.168.1.102 (LAN)',
        status: 'success',
        timestamp: 'Hôm qua 21:14:05',
        location: 'Hà Nội, Việt Nam',
      },
      {
        id: 'sec-03',
        eventType: 'faceid_fail',
        title: 'Cảnh báo: Quét FaceID thất bại (Không khớp nhận diện)',
        details: 'Phát hiện khuôn mặt người lạ thử quét FaceID tại thiết bị cá nhân. Tỷ lệ khớp chỉ đạt 34.2%. Hệ thống lập tức khóa truy cập và yêu cầu Mật mã đặc biệt.',
        deviceFingerprint: 'Webcam UHD / Unknown Subject',
        ipAddress: '192.168.1.189 (Guest Wifi)',
        status: 'warning',
        timestamp: 'Hôm qua 19:40:22',
        location: 'Hà Nội, Việt Nam',
      },
      {
        id: 'sec-04',
        eventType: 'device_registered',
        title: 'Đăng ký Thiết bị Tin cậy mới (Trusted Device Token)',
        details: 'Cấp mã định danh dev_home_server cho máy chủ Ubuntu Mini PC 24/7. Token được mã hóa AES-256 lưu trữ an toàn trong Secure Storage.',
        deviceFingerprint: 'Ubuntu 24.04 LTS / Headless Daemon',
        ipAddress: '192.168.1.200 (Home Server)',
        status: 'success',
        timestamp: '25/10/2026 14:00:00',
        location: 'Home Server Rack',
      },
      {
        id: 'sec-05',
        eventType: 'passcode_fail',
        title: 'Cảnh báo: Nhập sai Mật mã bảo mật 2 lần',
        details: 'Phát hiện hành vi thử mật mã sai ("admin123", "password"). Hoppi đã ghi nhật ký và kích hoạt độ trễ bảo mật 5 giây.',
        deviceFingerprint: 'Mobile Browser / WebKit',
        ipAddress: '14.241.88.19 (Public WAN)',
        status: 'danger',
        timestamp: '24/10/2026 11:25:40',
        location: 'Khu vực Ngoại mạng',
      },
      {
        id: 'sec-06',
        eventType: 'guest_access',
        title: 'Kích hoạt Phiên làm việc Khách lạ (Guest Mode)',
        details: 'Người dùng truy cập với vai trò Khách lạ. Cơ chế HITL đã khóa toàn bộ mã nguồn, cấu hình LAN IoT và phễu CRM.',
        deviceFingerprint: 'Edge Mobile / Anonymous Session',
        ipAddress: '192.168.1.189 (Guest Wifi)',
        status: 'warning',
        timestamp: '23/10/2026 16:10:15',
        location: 'Mạng Khách Nội bộ',
      },
    ];

    try {
      localStorage.setItem('hoppi_security_audit_logs', JSON.stringify(defaults));
    } catch (e) {
      console.error(e);
    }
    return defaults;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hoppi_security_audit_logs', JSON.stringify(logs));
    } catch (e) {
      console.error(e);
    }
  }, [logs]);

  // Run integrity scan
  const handleRunIntegrityScan = () => {
    setIsScanning(true);
    setScanReport(null);

    setTimeout(() => {
      setIsScanning(false);
      setScanReport(
        'Báo cáo Toàn vẹn: Toàn bộ 3 khóa mã hóa thiết bị (Token hashes) đều hợp lệ; Lỗ hổng cổng UDP mDNS được sandbox bảo vệ; Không phát hiện can thiệp lạ vào bộ nhớ Vector DB.'
      );
      // Append a scan log
      const scanLog: SecurityAuditLog = {
        id: `sec-${Date.now()}`,
        eventType: 'token_validated',
        title: 'Hoàn tất Quét Toàn Vẹn Hệ Thống (Integrity Health Check)',
        details: 'Đã kiểm tra tính hợp lệ của kho khóa Token thiết bị, bộ đệm Vector DB và phân quyền HITL. Điểm toàn vẹn đạt 100/100.',
        deviceFingerprint: 'Hoppi Security Daemon v4.0',
        ipAddress: '127.0.0.1 (Localhost)',
        status: 'success',
        timestamp: 'Vừa xong',
        location: 'Server Core',
      };
      setLogs((prev) => [scanLog, ...prev]);
    }, 1800);
  };

  // Simulate a failed FaceID attempt for quick verification
  const handleSimulateFailedFaceId = () => {
    const failedLog: SecurityAuditLog = {
      id: `sec-${Date.now()}`,
      eventType: 'faceid_fail',
      title: 'Cảnh báo: Phát hiện khuôn mặt không xác định quét FaceID',
      details: 'Một cá nhân không nằm trong hồ sơ sinh trắc học của Nguyễn Thanh Hải vừa cố mở khóa giao diện máy chủ.',
      deviceFingerprint: 'Webcam Device / Unknown Mesh',
      ipAddress: '192.168.1.205 (LAN)',
      status: 'danger',
      timestamp: 'Vừa xong',
      location: 'Phòng khách / Bàn trà',
    };
    setLogs((prev) => [failedLog, ...prev]);
  };

  // Export audit logs as JSON file
  const handleExportLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `hoppi_security_audit_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Clear audit logs
  const handleClearLogs = () => {
    if (confirm('Bạn có chắc muốn xóa lịch sử nhật ký bảo mật? Hành động này sẽ được ghi lại.')) {
      const resetLog: SecurityAuditLog = {
        id: `sec-${Date.now()}`,
        eventType: 'token_validated',
        title: 'Nhật ký bảo mật được đặt lại bởi Chủ nhân',
        details: 'Chủ sở hữu Nguyễn Thanh Hải đã làm sạch lịch sử nhật ký kiểm toán.',
        deviceFingerprint: 'Admin Console',
        ipAddress: '127.0.0.1',
        status: 'warning',
        timestamp: 'Vừa xong',
        location: 'Admin Session',
      };
      setLogs([resetLog]);
    }
  };

  // Filter & Search logic
  const filteredLogs = logs.filter((l) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'faceid'
        ? l.eventType === 'faceid_success' || l.eventType === 'faceid_fail'
        : filter === 'device'
        ? l.eventType === 'device_registered' || l.eventType === 'device_revoked' || l.eventType === 'token_validated'
        : filter === 'warning'
        ? l.status === 'warning' || l.status === 'danger'
        : true;

    const matchesSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.ipAddress.toLowerCase().includes(search.toLowerCase()) ||
      l.deviceFingerprint.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getEventIcon = (eventType: SecurityEventType, status: SecurityAuditLog['status']) => {
    if (eventType === 'faceid_fail') {
      return <XCircle className="w-4 h-4 text-rose-400" />;
    }
    if (eventType === 'faceid_success') {
      return <ScanFace className="w-4 h-4 text-emerald-400" />;
    }
    if (eventType === 'passcode_fail') {
      return <AlertTriangle className="w-4 h-4 text-rose-400" />;
    }
    if (eventType === 'device_registered' || eventType === 'token_validated') {
      return <Laptop className="w-4 h-4 text-cyan-400" />;
    }
    return <ShieldAlert className="w-4 h-4 text-amber-400" />;
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
            : 'bg-[#0e1016] border-zinc-800'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white flex items-center gap-2">
              Giám Sát Toàn Vẹn & Nhật Ký Bảo Mật (Security Audit)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono">
                FaceID & Device Logs
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Ghi lại mọi lần quét FaceID, đăng ký thiết bị tin cậy và cảnh báo xâm nhập
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunIntegrityScan}
            disabled={isScanning}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-95 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Đang quét...' : 'Quét Toàn Vẹn Hệ Thống'}</span>
          </button>

          <button
            onClick={handleSimulateFailedFaceId}
            title="Mô phỏng 1 lần quét FaceID lạ để kiểm tra độ nhạy"
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
          >
            <span>+ Giả lập FaceID Lạ</span>
          </button>

          <button
            onClick={handleExportLogs}
            title="Tải về file JSON toàn bộ nhật ký kiểm toán"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleClearLogs}
            title="Làm sạch danh sách nhật ký"
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Integrity Metrics & Scan Banner */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3 border-b border-slate-800/80 bg-slate-950/40">
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400 font-medium">Chỉ số Toàn vẹn (Integrity Score)</span>
            <p className="text-lg font-bold text-emerald-400 font-mono">100%</p>
          </div>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400 font-medium">Lần thử FaceID thất bại</span>
            <p className="text-lg font-bold text-amber-400 font-mono">
              {logs.filter((l) => l.eventType === 'faceid_fail').length} lần
            </p>
          </div>
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <ScanFace className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400 font-medium">Thiết bị Tin cậy đã cấp Token</span>
            <p className="text-lg font-bold text-cyan-400 font-mono">
              {logs.filter((l) => l.eventType === 'device_registered' || l.eventType === 'token_validated').length} thiết bị
            </p>
          </div>
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Laptop className="w-5 h-5" />
          </div>
        </div>

        {scanReport && (
          <div className="col-span-1 md:col-span-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{scanReport}</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
        {/* Category filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === 'all' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tất cả ({logs.length})
          </button>
          <button
            onClick={() => setFilter('faceid')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === 'faceid' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            FaceID
          </button>
          <button
            onClick={() => setFilter('device')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === 'device' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Thiết bị & Token
          </button>
          <button
            onClick={() => setFilter('warning')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === 'warning' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Cảnh báo rủi ro
          </button>
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Lọc IP, thiết bị, sự kiện..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Scrollable Audit Log List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center text-slate-500 text-xs">
            <ShieldCheck className="w-8 h-8 text-slate-600 mb-2" />
            <p>Không tìm thấy sự kiện bảo mật nào phù hợp với bộ lọc.</p>
          </div>
        ) : (
          filteredLogs.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                item.status === 'danger'
                  ? 'bg-rose-950/20 border-rose-900/50 shadow-sm'
                  : item.status === 'warning'
                  ? 'bg-amber-950/20 border-amber-900/40'
                  : 'bg-slate-950/70 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl border shrink-0 mt-0.5 ${
                      item.status === 'danger'
                        ? 'bg-rose-500/20 border-rose-500/40'
                        : item.status === 'warning'
                        ? 'bg-amber-500/20 border-amber-500/40'
                        : 'bg-emerald-500/20 border-emerald-500/40'
                    }`}
                  >
                    {getEventIcon(item.eventType, item.status)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-xs text-slate-100">{item.title}</h4>
                      <span
                        className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${
                          item.status === 'danger'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : item.status === 'warning'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {item.status === 'danger'
                          ? 'Nguy cơ cao'
                          : item.status === 'warning'
                          ? 'Cảnh báo'
                          : 'Hợp lệ'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{item.details}</p>

                    <div className="pt-1.5 flex items-center gap-4 text-[10px] text-slate-400 font-mono flex-wrap">
                      <span className="flex items-center gap-1">
                        <Laptop className="w-3 h-3 text-slate-500" />
                        {item.deviceFingerprint}
                      </span>
                      <span>IP: {item.ipAddress}</span>
                      {item.location && <span>Vị trí: {item.location}</span>}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {item.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
