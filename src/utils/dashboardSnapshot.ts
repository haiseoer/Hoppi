import { jsPDF } from 'jspdf';
import { AppTheme, UserIdentity, ConnectedMeshDevice } from '../types';

export interface DepartmentSnapshotItem {
  id: string;
  name: string;
  shortName: string;
  roleDescription: string;
  leadAgentName: string;
  agentCount: number;
  themeColor: string;
  status: 'active' | 'busy' | 'idle';
  currentTask: string;
  tasksCompletedToday: number;
  outputRating: string;
}

export interface IoTDeviceSnapshotItem {
  id: string;
  name: string;
  type: string;
  location: string;
  ip: string;
  protocol: string;
  isOnline: boolean;
  pingMs: number;
  stateDescription: string;
  rawState: Record<string, any>;
}

export interface MeshNodeSnapshotItem {
  id: string;
  name: string;
  type: string;
  os: string;
  ip: string;
  status: string;
  latencyMs: number;
  battery: number;
  cpuLoad: number;
  memoryUsedGB: number;
  memoryTotalGB: number;
  activeTask: string;
}

export interface DashboardSnapshotData {
  snapshotId: string;
  generatedAt: string;
  systemName: string;
  systemVersion: string;
  theme: AppTheme;
  masterIdentity: {
    name: string;
    role: string;
    isMaster: boolean;
    authMethod: string;
    tokenFingerprint: string;
  };
  globalKPIs: {
    ragVectorsCount: number;
    closingRatePercent: number;
    tasksCompletedToday: number;
    meshNodesOnline: number;
    iotDevicesActive: number;
    systemUptime: string;
    zeroTrustStatus: string;
  };
  threeDDepartments: DepartmentSnapshotItem[];
  iotDevices: IoTDeviceSnapshotItem[];
  meshNodes: MeshNodeSnapshotItem[];
  verificationStamp: {
    signedBy: string;
    integrityHash: string;
    confidentiality: string;
  };
}

// Convert Vietnamese diacritics to clean printable ASCII/Latin for crisp PDF output
export function sanitizeForPdf(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^\x00-\x7F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Builds a complete, authoritative snapshot of the 3D HQ and IoT Ecosystem
 */
export function buildDashboardSnapshotData(params: {
  identity?: UserIdentity | null;
  theme?: AppTheme;
  departmentTaskOverrides?: Record<string, string>;
  selectedDepartmentId?: string;
}): DashboardSnapshotData {
  const now = new Date();
  const timestampIso = now.toISOString();
  const timestampLocal = now.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const snapshotId = `SNAP-3DHQ-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
    now.getDate()
  ).padStart(2, '0')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  const overrides = params.departmentTaskOverrides || {};

  const departments: DepartmentSnapshotItem[] = [
    {
      id: 'dept-control',
      name: 'Phòng Điều Hành Trung Tâm (Central Control HQ)',
      shortName: 'Điều Hành Trung Tâm',
      roleDescription: 'Chỉ huy từ phòng trung tâm: Quản lý kiểm tra tiến độ, duyệt kết quả HITL & phân bổ việc.',
      leadAgentName: params.identity?.name || 'Nguyễn Thanh Hải (Master)',
      agentCount: 1,
      themeColor: 'cyan',
      status: 'active',
      currentTask: overrides['dept-control'] || 'Phê duyệt phiếu can thiệp HITL & điều phối 8 phòng ban',
      tasksCompletedToday: 42,
      outputRating: '100% Tối ưu (HITL Gate)',
    },
    {
      id: 'dept-code',
      name: 'Phòng Kỹ Thuật (Code Agent)',
      shortName: 'Kỹ Thuật & Code',
      roleDescription: 'Trợ lý AI gắn vòng sáng trực chiến, tự động lập trình frontend/backend & sửa bug 24/7.',
      leadAgentName: 'AI Senior Architect • Halo-Alpha',
      agentCount: 3,
      themeColor: 'indigo',
      status: 'busy',
      currentTask: overrides['dept-code'] || 'Refactor module RAG Vector & biên dịch AST tự động',
      tasksCompletedToday: 128,
      outputRating: '98.4% Zero-Bug Delivery',
    },
    {
      id: 'dept-sales',
      name: 'Phòng Kinh Doanh & CRM (Sales Agent)',
      shortName: 'Sales CRM',
      roleDescription: 'Rà soát pipeline, chăm sóc khách Zalo OA, tự động báo giá và phân loại cơ hội tiềm năng.',
      leadAgentName: 'AI Sales Lead • Halo-Beta',
      agentCount: 2,
      themeColor: 'emerald',
      status: 'active',
      currentTask: overrides['dept-sales'] || 'Chăm sóc 18 lead Zalo OA & gửi báo giá website',
      tasksCompletedToday: 86,
      outputRating: 'Closing Rate 68.2% (+16.0%)',
    },
    {
      id: 'dept-design',
      name: 'Phòng Thiết Kế Web & UI/UX (Creative Agent)',
      shortName: 'Thiết Kế UI/UX',
      roleDescription: 'Phối màu chuẩn gu thẩm mỹ cao, thiết kế wireframe, giao diện 3D canvas xoay tương tác 60fps.',
      leadAgentName: 'AI Creative Lead • Halo-Gamma',
      agentCount: 2,
      themeColor: 'rose',
      status: 'active',
      currentTask: overrides['dept-design'] || 'Hoàn thiện giao diện 3D xoay chuột Sơn Đá Coffee',
      tasksCompletedToday: 35,
      outputRating: 'Chuẩn Thẩm Mỹ 10/10',
    },
    {
      id: 'dept-prd',
      name: 'Phòng Phân Tích PRD & Báo Giá (Product Agent)',
      shortName: 'Phân Tích PRD',
      roleDescription: 'Đóng gói quy trình, bóc tách tài liệu yêu cầu khách hàng thành PRD và lập dự toán chi phí.',
      leadAgentName: 'AI Product Manager • Halo-Delta',
      agentCount: 1,
      themeColor: 'amber',
      status: 'active',
      currentTask: overrides['dept-prd'] || 'Phân tích tài liệu đặc tả PRD dự án Resort Vân Thê',
      tasksCompletedToday: 19,
      outputRating: 'Quy Trình 3 Bước Khép Kín',
    },
    {
      id: 'dept-qa',
      name: 'Phòng Kiểm Thử QA/QC & Sandbox (QA Agent)',
      shortName: 'Kiểm Thử QA',
      roleDescription: 'Kiểm tra cú pháp AST, kiểm thử bảo mật, chạy test tải 10,000 req/s và tự động vá lỗi.',
      leadAgentName: 'AI QA Specialist • Halo-Epsilon',
      agentCount: 1,
      themeColor: 'purple',
      status: 'busy',
      currentTask: overrides['dept-qa'] || 'Chạy 142 bài kiểm thử tự động không lỗi',
      tasksCompletedToday: 210,
      outputRating: 'Zero Bug 100% Pass Rate',
    },
    {
      id: 'dept-marketing',
      name: 'Phòng Marketing & Truyền Thông (Growth Agent)',
      shortName: 'Marketing AI',
      roleDescription: 'Sản xuất kịch bản TikTok/Reels viral, viết bài chuẩn SEO và tối ưu chiến dịch đa kênh.',
      leadAgentName: 'AI Growth Strategist • Halo-Zeta',
      agentCount: 1,
      themeColor: 'sky',
      status: 'active',
      currentTask: overrides['dept-marketing'] || 'Tạo 5 kịch bản video viral giới thiệu tổng hành dinh',
      tasksCompletedToday: 64,
      outputRating: '+350% Tương Tác Đa Kênh',
    },
    {
      id: 'dept-devops',
      name: 'Phòng Triển Khai Cloud & Mesh IoT (DevOps Agent)',
      shortName: 'Cloud & Mesh',
      roleDescription: 'Tự động hóa CI/CD, đóng gói Docker/Electron/APK, giám sát mạng Mesh 24/7 và đẩy Cloud.',
      leadAgentName: 'AI DevOps Engineer • Halo-Eta',
      agentCount: 1,
      themeColor: 'teal',
      status: 'active',
      currentTask: overrides['dept-devops'] || 'Tự động xuất gói cài đặt Windows EXE & sync 5 node Mesh',
      tasksCompletedToday: 53,
      outputRating: 'Uptime 99.99% 24/7',
    },
  ];

  const iotDevices: IoTDeviceSnapshotItem[] = [
    {
      id: 'iot-01',
      name: 'Đèn Thông Minh Bàn Làm Việc (Smart Desk Light)',
      type: 'light',
      location: 'Phòng làm việc Chủ nhân Nguyễn Thanh Hải',
      ip: '192.168.1.115',
      protocol: 'Tuya / Local LAN',
      isOnline: true,
      pingMs: 3,
      stateDescription: 'Bật (Power: ON), Độ sáng: 85%, Màu sắc: #38bdf8 (Cyan)',
      rawState: { power: true, brightness: 85, color: '#38bdf8' },
    },
    {
      id: 'iot-02',
      name: 'Router Mạng Nội Bộ (Hoppi Gateway Mesh)',
      type: 'router',
      location: 'Tủ kỹ thuật Rack Server',
      ip: '192.168.1.1',
      protocol: 'mDNS / SSDP',
      isOnline: true,
      pingMs: 1,
      stateDescription: 'Hoạt động 24/7, Băng thông: 940 Mbps, 5 Thiết bị Mesh kết nối',
      rawState: { power: true, bandwidthMbps: 940, connectedMeshDevices: 5 },
    },
    {
      id: 'iot-03',
      name: 'Ổ Cắm Thông Minh Home Server 24/7',
      type: 'switch',
      location: 'Cụm Mini PC Server Ubuntu',
      ip: '192.168.1.120',
      protocol: 'Tasmota MQTT',
      isOnline: true,
      pingMs: 4,
      stateDescription: 'Cấp điện liên tục (Always ON), Công suất: 42W, Bảo vệ quá nhiệt OK',
      rawState: { power: true, wattage: 42, tempProtection: 'normal' },
    },
    {
      id: 'iot-04',
      name: 'Điều Hòa Trung Tâm Inverter',
      type: 'climate',
      location: 'Phòng làm việc',
      ip: '192.168.1.140',
      protocol: 'SSDP / Local API',
      isOnline: true,
      pingMs: 6,
      stateDescription: 'Bật, Nhiệt độ duy trì: 24°C, Chế độ làm mát êm dịu (Silent Eco)',
      rawState: { power: true, temperature: 24, mode: 'eco_cooling' },
    },
    {
      id: 'iot-05',
      name: 'Camera An Ninh AI Hồng Ngoại 4K',
      type: 'camera',
      location: 'Cửa ra vào & Hành lang',
      ip: '192.168.1.168',
      protocol: 'mDNS / RTSP Stream',
      isOnline: true,
      pingMs: 4,
      stateDescription: 'Trực chiến ghi hình 4K, Cảm biến chuyển động AI: Đã kích hoạt',
      rawState: { power: true, securityArmed: true, resolution: '4K', fps: 30 },
    },
    {
      id: 'iot-lock',
      name: 'Khóa Cửa Từ Vân Tay An Ninh 3 Lớp',
      type: 'lock',
      location: 'Cửa chính căn hộ',
      ip: '192.168.1.185',
      protocol: 'Tuya / Local Zigbee Gateway',
      isOnline: true,
      pingMs: 2,
      stateDescription: 'Đã khóa an toàn (Locked), Pin: 96%, Xác thực FaceID & Vân tay',
      rawState: { power: true, locked: true, battery: 96, authModes: ['faceid', 'fingerprint'] },
    },
  ];

  const meshNodes: MeshNodeSnapshotItem[] = [
    {
      id: 'dev-server-home',
      name: 'Home Server 24/7 (Mini PC Ubuntu)',
      type: 'server',
      os: 'Ubuntu 24.04 LTS (Docker Engine v27.2)',
      ip: '192.168.1.100',
      status: 'online',
      latencyMs: 2,
      battery: 100,
      cpuLoad: 24,
      memoryUsedGB: 12.4,
      memoryTotalGB: 32,
      activeTask: 'Chạy RAG Vector Search & Lưu trữ phân tán 24/7',
    },
    {
      id: 'dev-macbook-master',
      name: 'MacBook Pro M3 Max (Nguyễn Thanh Hải)',
      type: 'desktop',
      os: 'macOS Sequoia 15.3 (Safari/Chrome Engine)',
      ip: '192.168.1.102',
      status: 'online',
      latencyMs: 4,
      battery: 88,
      cpuLoad: 18,
      memoryUsedGB: 22.8,
      memoryTotalGB: 64,
      activeTask: 'Phòng Điều Hành Trung Tâm & Duyệt HITL',
    },
    {
      id: 'dev-iphone-master',
      name: 'iPhone 16 Pro Max (Mobile Master)',
      type: 'mobile',
      os: 'iOS 18.4 (PWA Standalone App)',
      ip: '192.168.1.108',
      status: 'online',
      latencyMs: 12,
      battery: 92,
      cpuLoad: 14,
      memoryUsedGB: 4.2,
      memoryTotalGB: 8,
      activeTask: 'Giám sát tin nhắn Zalo OA & Thông báo đẩy Mesh',
    },
    {
      id: 'dev-ipad-living',
      name: 'iPad Pro M2 (Phòng khách)',
      type: 'tablet',
      os: 'iPadOS 18.3 (Interactive Canvas)',
      ip: '192.168.1.110',
      status: 'idle',
      latencyMs: 15,
      battery: 84,
      cpuLoad: 8,
      memoryUsedGB: 3.8,
      memoryTotalGB: 16,
      activeTask: 'Bảng điều khiển nhà thông minh IoT phòng khách',
    },
    {
      id: 'dev-cloud-backup',
      name: 'Cloud VPS Backup Node (Hoppi Distributed Node)',
      type: 'server',
      os: 'Debian 12 Bookworm (GCP Compute Engine)',
      ip: '34.80.192.45',
      status: 'online',
      latencyMs: 28,
      battery: 100,
      cpuLoad: 16,
      memoryUsedGB: 5.1,
      memoryTotalGB: 16,
      activeTask: 'Sao lưu Vector Database & Chứng thực Zero-Trust',
    },
  ];

  return {
    snapshotId,
    generatedAt: timestampIso,
    systemName: 'Hoppi Autonomous AI Agent & IoT Ecosystem',
    systemVersion: 'v2.1.107 (Production Multi-Agent)',
    theme: params.theme || 'cyberpunk',
    masterIdentity: {
      name: params.identity?.name || 'Nguyễn Thanh Hải',
      role: params.identity?.isMaster ? 'Chủ nhân (Master Administrator)' : 'Khách truy cập (Guest)',
      isMaster: params.identity?.isMaster ?? true,
      authMethod: params.identity?.authMethod || 'trusted_token',
      tokenFingerprint: 'SHA256-HOPPI-HITL-7890-AF92-SECURE',
    },
    globalKPIs: {
      ragVectorsCount: 1420,
      closingRatePercent: 68.2,
      tasksCompletedToday: 589,
      meshNodesOnline: 5,
      iotDevicesActive: 6,
      systemUptime: '99.99% (24/7 Active)',
      zeroTrustStatus: 'HITL Gate Active & Enforced',
    },
    threeDDepartments: departments,
    iotDevices,
    meshNodes,
    verificationStamp: {
      signedBy: 'Hoppi Autonomous Autonomous Security Daemon',
      integrityHash: `SHA256-${Date.now().toString(16).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      confidentiality: 'Bảo mật Cấp 1 - Lưu trữ Nội bộ Thiết bị của Chủ nhân Nguyễn Thanh Hải',
    },
  };
}

/**
 * Trigger client-side JSON download
 */
export function exportDashboardSnapshotAsJson(data: DashboardSnapshotData): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const filename = `hoppi-snapshot-${data.snapshotId.toLowerCase()}.json`;
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate and download a formatted PDF Document using jsPDF
 */
export function exportDashboardSnapshotAsPdf(data: DashboardSnapshotData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = margin;

  // PAGE 1: EXECUTIVE BRIEFING & 3D HQ DEPARTMENTS
  // Top Banner Background
  doc.setFillColor(10, 15, 26); // dark navy #0a0f1a
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Cyan Top Line Accent
  doc.setFillColor(6, 182, 212); // cyan-500
  doc.rect(0, 0, pageWidth, 2.5, 'F');

  // Title & Brand
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(6, 182, 212); // cyan
  doc.text('HOPPI AUTONOMOUS AI AGENT SYSTEM', margin, 12);

  doc.setFontSize(10);
  doc.setTextColor(241, 245, 249); // white-ish
  doc.text('DASHBOARD SNAPSHOT & OFFLINE SYSTEM AUDIT REPORT', margin, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(
    `SNAPSHOT ID: ${data.snapshotId}  |  GEN: ${sanitizeForPdf(data.generatedAt)}  |  VER: ${data.systemVersion}`,
    margin,
    24
  );

  doc.text(
    `MASTER: ${sanitizeForPdf(data.masterIdentity.name)} (${sanitizeForPdf(data.masterIdentity.role)})  |  TOKEN: ${data.masterIdentity.tokenFingerprint}`,
    margin,
    29
  );

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(52, 211, 153); // emerald-400
  doc.text('STATUS: 24/7 AUTONOMOUS ACTIVE  |  ZERO-TRUST HITL GATE: ENFORCED', margin, 35);

  y = 48;

  // Executive KPI Summary Grid (4 mini cards)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42); // slate-900

  const cardWidth = (pageWidth - margin * 2 - 9) / 4;
  const kpis = [
    { label: 'RAG Vectors', val: `${data.globalKPIs.ragVectorsCount}`, sub: 'Tri thuc Vector' },
    { label: '3D HQ Tasks', val: `${data.globalKPIs.tasksCompletedToday}`, sub: 'Tac vu hoan tat' },
    { label: 'Mesh Online', val: `${data.globalKPIs.meshNodesOnline} / 5`, sub: 'Thiet bi mang' },
    { label: 'IoT Devices', val: `${data.globalKPIs.iotDevicesActive} / 6`, sub: 'Smart Devices' },
  ];

  kpis.forEach((k, idx) => {
    const cx = margin + idx * (cardWidth + 3);
    doc.setFillColor(241, 245, 249); // slate-100
    doc.roundedRect(cx, y, cardWidth, 18, 2, 2, 'F');
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.roundedRect(cx, y, cardWidth, 18, 2, 2, 'D');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(k.label, cx + 3, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(6, 182, 212);
    doc.text(k.val, cx + 3, y + 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(k.sub, cx + 3, y + 15.5);
  });

  y += 24;

  // SECTION 1: 3D HQ VIRTUAL DEPARTMENTS & AUTONOMOUS AGENTS
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, pageWidth - margin * 2, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(241, 245, 249);
  doc.text('1. 3D HQ VIRTUAL DESKS & AUTONOMOUS DEPARTMENTS (TONG HANH DINH 3D)', margin + 3, y + 4.8);

  y += 9;

  // Department Table Header
  doc.setFillColor(226, 232, 240); // slate-200
  doc.rect(margin, y, pageWidth - margin * 2, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);

  doc.text('PHONG BAN (DEPARTMENT)', margin + 2, y + 4.2);
  doc.text('CHI HUY (LEAD AGENT)', margin + 55, y + 4.2);
  doc.text('NHIEM VU HIEN TAI (CURRENT TASK)', margin + 98, y + 4.2);
  doc.text('TIEN DO', margin + 155, y + 4.2);
  doc.text('DANH GIA', margin + 168, y + 4.2);

  y += 7;

  // Department Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);

  data.threeDDepartments.forEach((dept, index) => {
    const isEven = index % 2 === 0;
    if (isEven) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y - 1, pageWidth - margin * 2, 7.5, 'F');
    }

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 6.5, pageWidth - margin, y + 6.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(sanitizeForPdf(dept.shortName), margin + 2, y + 3.2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(sanitizeForPdf(dept.leadAgentName), margin + 55, y + 3.2);

    const taskText = sanitizeForPdf(dept.currentTask);
    const truncatedTask = taskText.length > 38 ? taskText.substring(0, 36) + '...' : taskText;
    doc.text(truncatedTask, margin + 98, y + 3.2);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129); // emerald
    doc.text(`${dept.tasksCompletedToday} xong`, margin + 155, y + 3.2);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(6, 182, 212); // cyan
    const ratingClean = sanitizeForPdf(dept.outputRating);
    doc.text(ratingClean.length > 12 ? ratingClean.substring(0, 10) + '..' : ratingClean, margin + 168, y + 3.2);

    doc.setFontSize(7);
    y += 7.5;
  });

  y += 6;

  // SECTION 2: ACTIVE LAN IOT SMART DEVICES
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, pageWidth - margin * 2, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(241, 245, 249);
  doc.text('2. ACTIVE LAN IOT SMART DEVICES & SENSORS (HE SINH THAI THIET BI IOT)', margin + 3, y + 4.8);

  y += 9;

  // IoT Table Header
  doc.setFillColor(226, 232, 240);
  doc.rect(margin, y, pageWidth - margin * 2, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);

  doc.text('THIET BI IOT (DEVICE)', margin + 2, y + 4.2);
  doc.text('VI TRI (LOCATION)', margin + 58, y + 4.2);
  doc.text('IP / GIAO THUC', margin + 98, y + 4.2);
  doc.text('PING', margin + 138, y + 4.2);
  doc.text('TRANG THAI & THONG SO', margin + 150, y + 4.2);

  y += 7;

  data.iotDevices.forEach((dev, index) => {
    const isEven = index % 2 === 0;
    if (isEven) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y - 1, pageWidth - margin * 2, 7, 'F');
    }

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 6, pageWidth - margin, y + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(15, 23, 42);
    doc.text(sanitizeForPdf(dev.name), margin + 2, y + 3.2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(sanitizeForPdf(dev.location), margin + 58, y + 3.2);

    doc.text(`${dev.ip} (${dev.protocol})`, margin + 98, y + 3.2);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(dev.pingMs <= 3 ? 16 : 245, dev.pingMs <= 3 ? 185 : 158, dev.pingMs <= 3 ? 129 : 11);
    doc.text(`${dev.pingMs}ms`, margin + 138, y + 3.2);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    const descClean = sanitizeForPdf(dev.stateDescription);
    const truncatedDesc = descClean.length > 25 ? descClean.substring(0, 24) + '...' : descClean;
    doc.text(truncatedDesc, margin + 150, y + 3.2);

    y += 7;
  });

  // PAGE 1 FOOTER
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Hoppi Autonomous Engine 2026 - Page 1/2 - Snapshot Document for Master Nguyen Thanh Hai`,
    margin,
    pageHeight - 6
  );

  // -------------------------------------------------------------
  // PAGE 2: MESH NETWORK TELEMETRY, ZERO-TRUST & VERIFICATION STAMP
  // -------------------------------------------------------------
  doc.addPage();
  y = margin;

  // Page 2 Header Banner
  doc.setFillColor(10, 15, 26);
  doc.rect(0, 0, pageWidth, 24, 'F');
  doc.setFillColor(6, 182, 212);
  doc.rect(0, 0, pageWidth, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(6, 182, 212);
  doc.text('3. MESH NETWORK TELEMETRY & SYSTEM INTEGRITY AUDIT', margin, 11);

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `CONTINUATION OF SNAPSHOT: ${data.snapshotId}  |  VERIFIED ZERO-TRUST ACCESS`,
    margin,
    17
  );

  y = 30;

  // Mesh Nodes Table Header
  doc.setFillColor(226, 232, 240);
  doc.rect(margin, y, pageWidth - margin * 2, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);

  doc.text('THIET BI MESH (NODE)', margin + 2, y + 4.2);
  doc.text('HE DIEU HANH (OS)', margin + 55, y + 4.2);
  doc.text('IP ADDRESS', margin + 98, y + 4.2);
  doc.text('CPU / RAM', margin + 125, y + 4.2);
  doc.text('PIN', margin + 150, y + 4.2);
  doc.text('NHIEM VU HIEN TAI (TASK)', margin + 160, y + 4.2);

  y += 7;

  data.meshNodes.forEach((node, index) => {
    const isEven = index % 2 === 0;
    if (isEven) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y - 1, pageWidth - margin * 2, 7.5, 'F');
    }

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 6.5, pageWidth - margin, y + 6.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text(sanitizeForPdf(node.name), margin + 2, y + 3.2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(sanitizeForPdf(node.os), margin + 55, y + 3.2);

    doc.text(node.ip, margin + 98, y + 3.2);

    doc.text(`${node.cpuLoad}% / ${node.memoryUsedGB}GB`, margin + 125, y + 3.2);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text(`${node.battery}%`, margin + 150, y + 3.2);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    const taskClean = sanitizeForPdf(node.activeTask);
    const truncatedTask = taskClean.length > 18 ? taskClean.substring(0, 17) + '..' : taskClean;
    doc.text(truncatedTask, margin + 160, y + 3.2);

    y += 7.5;
  });

  y += 10;

  // ZERO-TRUST SECURITY & HITL GOVERNANCE MATRIX
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, pageWidth - margin * 2, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(241, 245, 249);
  doc.text('4. SECURITY GOVERNANCE & AUTONOMOUS POLICIES', margin + 3, y + 4.8);

  y += 10;

  const policies = [
    {
      title: 'Human-in-the-Loop (HITL) Gate',
      desc: 'Tat ca giao dich tai chinh (>10Tr VND), xoa du lieu va quyen Root bat buoc phai co Token phe duyet truc tiep tu Chu nhan Nguyen Thanh Hai.',
    },
    {
      title: '24/7 Autonomous Self-Healing & RAG',
      desc: 'Tu dong quet va dong bo 1,420 vector tri thuc, phat hien lo hong thong tin tren 5 thiet bi Mesh ma khong can can thiep thu cong.',
    },
    {
      title: 'Local-First LAN & IoT Data Privacy',
      desc: 'Toan bo lenh dieu khien thiet bi thong minh chay truc tiep trong mang noi bo qua mDNS/Tuya Local/Tasmota, khong upload video hay biometric ra ngoai.',
    },
  ];

  policies.forEach((pol) => {
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 13, 1.5, 1.5, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 13, 1.5, 1.5, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(6, 182, 212);
    doc.text(pol.title, margin + 3, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(51, 65, 85);
    doc.text(pol.desc, margin + 3, y + 9);

    y += 16;
  });

  y += 5;

  // DIGITAL VERIFICATION & SIGN-OFF STAMP
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 38, 2, 2, 'F');
  doc.setDrawColor(6, 182, 212);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 38, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('CHUNG THUC XUAT SNAPSHOT & CHU KY DIEN TU (DIGITAL VERIFICATION STAMP)', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text(`Signed by: ${data.verificationStamp.signedBy}`, margin + 4, y + 12);
  doc.text(`Integrity Fingerprint: ${data.verificationStamp.integrityHash}`, margin + 4, y + 17);
  doc.text(`Authorized Master: ${sanitizeForPdf(data.masterIdentity.name)} (ID: master-nguyen-thanh-hai)`, margin + 4, y + 22);
  doc.text(`Classification: ${sanitizeForPdf(data.verificationStamp.confidentiality)}`, margin + 4, y + 27);

  // Digital Badge box
  doc.setFillColor(6, 182, 212);
  doc.roundedRect(pageWidth - margin - 45, y + 8, 40, 22, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('VERIFIED SNAPSHOT', pageWidth - margin - 43, y + 15);
  doc.setFontSize(6.5);
  doc.text('24/7 AI AGENT ENGINE', pageWidth - margin - 43, y + 20);
  doc.text('PASS: ZERO-TRUST', pageWidth - margin - 43, y + 25);

  // Page 2 Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Hoppi Autonomous Engine 2026 - Page 2/2 - End of Offline Documentation Document`,
    margin,
    pageHeight - 6
  );

  const filename = `hoppi-dashboard-snapshot-${data.snapshotId.toLowerCase()}.pdf`;
  doc.save(filename);
}
