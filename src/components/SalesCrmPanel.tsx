import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  PhoneCall,
  RefreshCw,
  Search,
  Bot,
  Play,
  Pause,
  Square,
  Shuffle,
  Image as ImageIcon,
  Check,
  X,
  Minus,
  Layers,
  Cpu,
  Workflow,
  Sliders,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Film,
  Video,
  ListOrdered,
  Plus,
  Trash2,
  Copy,
  Building2,
  ArrowRight,
  FileText,
  CheckCheck,
  Activity,
  Eye,
  PlayCircle,
  Palette,
  Code2,
  FastForward,
  GripVertical,
  BarChart3,
  Target,
  CalendarCheck,
  ArrowUpRight,
  Download,
  Archive,
  RotateCcw,
  Inbox,
  Settings,
  Key,
  Globe,
  Share2,
  MessageSquare,
} from 'lucide-react';
import { CRMLead } from '../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
} from 'recharts';

interface ZaloAccount {
  id: string;
  name: string;
  ip: string;
  status: 'online' | 'offline' | 'busy';
  selected: boolean;
  messagesSent: number;
}

interface MessageTemplate {
  id: string;
  text: string;
  enabled: boolean;
  spinCount: number;
}

interface ActivityLog {
  id: string;
  time: string;
  accountName: string;
  accountIp: string;
  phone: string;
  message: string;
  status: 'success' | 'failed' | 'skipped';
}

export const SalesCrmPanel: React.FC = () => {
  // Master view switch: Zalo Multi-Account, OpenAI DOTS Workflow, Muse Studio Pro, B2B Leads, HQ 3D Simulation, Real Accounts Config & Playbooks
  const [activeView, setActiveView] = useState<'zalo' | 'dots' | 'studio' | 'leads' | 'hq_simulation' | 'accounts_config'>('zalo');

  /* -------------------------------------------------------------
     6. REAL ACCOUNTS & SALES PLAYBOOKS CONFIGURATION (Master Nguyễn Thanh Hải)
  ------------------------------------------------------------- */
  const [configSubTab, setConfigSubTab] = useState<'accounts' | 'playbooks'>('accounts');
  const [realAccounts, setRealAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('hoppi_crm_real_accounts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed reading real accounts from localStorage', e);
    }
    return {
      zalo: {
        oaName: 'Hoppi AI Solutions - Master Nguyễn Thanh Hải',
        appId: '419283749281749',
        secretKey: '••••••••••••••••••••••••••••••••',
        oaId: '2981749281749182',
        status: 'connected',
        leadsSynced: 18,
        webhookUrl: 'https://ais-pre-n553xcvx2k5ktidnczw2m3-826729456993.asia-east1.run.app/api/webhooks/zalo',
      },
      facebook: {
        pageName: 'Hoppi Autonomous AI Agent 24/7',
        pageId: '109283749281729',
        accessToken: 'EAAG••••••••••••••••••••••••••••••••',
        pixelId: '839201928374910',
        status: 'connected',
        leadsSynced: 42,
        webhookUrl: 'https://ais-pre-n553xcvx2k5ktidnczw2m3-826729456993.asia-east1.run.app/api/webhooks/facebook',
      },
      tiktok: {
        shopName: 'Hoppi Tech Official Vietnam',
        sellerId: 'VN_SELLER_8839210',
        appKey: '6a89c•••••••••••••••',
        status: 'ready',
        ordersSynced: 12,
        webhookUrl: 'https://ais-pre-n553xcvx2k5ktidnczw2m3-826729456993.asia-east1.run.app/api/webhooks/tiktok',
      },
      google: {
        accountName: 'Google Ads (Nguyễn Thanh Hải - haiSEOer@gmail.com)',
        customerId: '839-291-0492',
        devToken: 'aBc9••••••••••••••••',
        status: 'connected',
        conversionsSynced: 35,
      },
      webhook: {
        crmProvider: 'Custom ERP / Hubspot / Shopee Webhook',
        endpoint: 'https://crm.nguyenthanhhai.vn/api/v1/lead-ingest',
        apiKey: 'sec_live_9381029384910283948',
        status: 'active',
        lastPing: '2 phút trước (22ms)',
      },
    };
  });

  const [salesPlaybooks, setSalesPlaybooks] = useState(() => {
    try {
      const saved = localStorage.getItem('hoppi_sales_playbooks');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed reading sales playbooks from localStorage', e);
    }
    return [
      {
        id: 'pb-1',
        title: 'Tư Vấn Tự Động & Xử Lý Từ Chối Giá (Objection Handling 24/7)',
        channel: 'Đa Kênh (Zalo + Messenger + Web)',
        trigger: 'Khi khách hỏi giá, phân vân ngân sách hoặc phản hồi "giá cao"',
        responseScript: 'Dạ chào {Tên_Khách}, em hiểu băn khoăn về ngân sách của anh/chị ạ! Tuy nhiên, khi ứng dụng Hoppi AI tự trị 24/7, doanh nghiệp của mình sẽ tiết kiệm tối thiểu 70% chi phí nhân sự trực đêm và tăng 35% tỷ lệ chốt đơn ngay trong 5 phút đầu tiên. Em gửi anh/chị bảng tính ROI chi tiết đính kèm nhé ạ! 😊',
        autoEscalateHITL: false,
        isActive: true,
        stats: { triggeredCount: 184, conversionRate: '42.8%' },
      },
      {
        id: 'pb-2',
        title: 'Bám Đuổi Lead Nóng 1-3-7 (Omnichannel Follow-up)',
        channel: 'Zalo OA & ZNS',
        trigger: 'Sau 2 giờ khách xem báo giá nhưng chưa xác nhận chốt cọc',
        responseScript: 'Chào {Tên_Khách}, Hoppi vừa hoàn thiện bản mẫu giao diện 3D trực quan dành riêng cho thương hiệu của anh/chị. Anh/chị có tiện để em mở link demo trực tiếp trên điện thoại để trải nghiệm thử không ạ? 🚀',
        autoEscalateHITL: false,
        isActive: true,
        stats: { triggeredCount: 96, conversionRate: '51.2%' },
      },
      {
        id: 'pb-3',
        title: 'Chốt Combo & Nâng Cấp Gói B2B Tự Động (B2B Upsell)',
        channel: 'Tất cả kênh',
        trigger: 'Khách hàng chốt gói Web/Phần mềm cơ bản',
        responseScript: 'Tuyệt vời ạ! Nhân dịp khởi động dự án, Hoppi xin phép tặng thêm anh/chị gói tích hợp Trợ Lý AI vào Fanpage & Zalo OA miễn phí 3 tháng đầu, kèm chế độ giám sát tự động 24/7 của Chủ nhân Nguyễn Thanh Hải!',
        autoEscalateHITL: false,
        isActive: true,
        stats: { triggeredCount: 65, conversionRate: '68.0%' },
      },
      {
        id: 'pb-4',
        title: 'Phân Loại Lead Lớn & Chuyển Giao Trực Tiếp Chủ Nhân (HITL High-Value)',
        channel: 'Hệ thống Trung tâm',
        trigger: 'Quy mô dự án > 100 Triệu VNĐ hoặc khách yêu cầu gặp trực tiếp Chủ nhân Nguyễn Thanh Hải',
        responseScript: 'Dạ em đã ghi nhận yêu cầu cao cấp của anh/chị! Em vừa chuyển thông tin và tạo phiếu can thiệp HITL khẩn gửi trực tiếp đến Chủ nhân Nguyễn Thanh Hải (haiSEOer@gmail.com). Anh Hải sẽ liên hệ lại qua số điện thoại của anh/chị trong ít phút nữa ạ!',
        autoEscalateHITL: true,
        isActive: true,
        stats: { triggeredCount: 22, conversionRate: '91.0%' },
      },
    ];
  });

  const [testPlaybookOutput, setTestPlaybookOutput] = useState<{ [id: string]: string }>({});
  const [accountSaveNotice, setAccountSaveNotice] = useState<string | null>(null);

  const handleSaveAccounts = () => {
    try {
      localStorage.setItem('hoppi_crm_real_accounts', JSON.stringify(realAccounts));
      setAccountSaveNotice('✓ Đã lưu cấu hình tài khoản thực thành công!');
      setTimeout(() => setAccountSaveNotice(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSavePlaybooks = () => {
    try {
      localStorage.setItem('hoppi_sales_playbooks', JSON.stringify(salesPlaybooks));
      setAccountSaveNotice('✓ Đã lưu kịch bản bán hàng thành công!');
      setTimeout(() => setAccountSaveNotice(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTogglePlaybook = (id: string) => {
    setSalesPlaybooks((prev: any[]) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p));
      localStorage.setItem('hoppi_sales_playbooks', JSON.stringify(updated));
      return updated;
    });
  };

  const handleTestPlaybook = (pb: any) => {
    const rendered = pb.responseScript
      .replace('{Tên_Khách}', 'Anh Tuấn (Giám Đốc Khách Sạn)')
      .replace('{Sản_Phẩm}', 'Hệ thống AI Tự Trị 24/7')
      .replace('{Báo_Giá}', '18.500.000 VNĐ');
    setTestPlaybookOutput((prev) => ({ ...prev, [pb.id]: rendered }));
  };

  /* -------------------------------------------------------------
     1. ZALO MULTI-ACCOUNT SENDER v2.1.107 (Image 37cfd05b)
  ------------------------------------------------------------- */
  const [zaloAccounts, setZaloAccounts] = useState<ZaloAccount[]>([
    { id: '1', name: 'Minh Tuấn', ip: '103.162.2.89', status: 'online', selected: true, messagesSent: 112 },
    { id: '2', name: 'Thu Hằng', ip: '14.225.33.120', status: 'online', selected: true, messagesSent: 98 },
    { id: '3', name: 'Quang Huy', ip: '203.162.7.45', status: 'online', selected: true, messagesSent: 105 },
    { id: '4', name: 'Ngọc Anh', ip: '45.118.22.90', status: 'online', selected: true, messagesSent: 84 },
    { id: '5', name: 'Phương Vy', ip: '171.244.88.16', status: 'online', selected: true, messagesSent: 92 },
    { id: '6', name: 'Tuấn Kiệt', ip: '103.27.11.204', status: 'online', selected: true, messagesSent: 77 },
    { id: '7', name: 'Bảo Trâm', ip: '14.235.201.78', status: 'online', selected: true, messagesSent: 89 },
    { id: '8', name: 'Hoàng Long', ip: '123.30.15.52', status: 'online', selected: true, messagesSent: 94 },
    { id: '9', name: 'Lê Minh', ip: '45.119.162.33', status: 'online', selected: true, messagesSent: 71 },
    { id: '10', name: 'Thanh Hà', ip: '171.226.88.94', status: 'online', selected: true, messagesSent: 68 },
    { id: '11', name: 'Nguyễn Tùng', ip: '27.72.33.108', status: 'online', selected: true, messagesSent: 66 },
  ]);

  const [zaloSubTab, setZaloSubTab] = useState<'send' | 'recipients' | 'templates' | 'advanced'>('send');
  const [isSending, setIsSending] = useState(false);
  const [sentCount, setSentCount] = useState(956);
  const totalRecipients = 2563;
  const [successCount, setSuccessCount] = useState(736);
  const [failCount, setFailCount] = useState(98);
  const [skipCount, setSkipCount] = useState(122);
  const [rotateAccounts, setRotateAccounts] = useState(true);
  const [randomContent, setRandomContent] = useState(true);
  const [sendMedia, setSendMedia] = useState(true);
  const [minDelay, setMinDelay] = useState(5);
  const [maxDelay, setMaxDelay] = useState(12);
  const [pauseBatch, setPauseBatch] = useState(30);
  const [pauseDuration, setPauseDuration] = useState(15);

  const [templates, setTemplates] = useState<MessageTemplate[]>([
    {
      id: 't1',
      text: '{Chào bạn|Hello|Xin chào anh/chị}, mình thấy bạn đang quan tâm giải pháp AI tự động hóa bán hàng & chăm sóc khách hàng. Mình gửi thông tin chi tiết qua đây nhé! 😊',
      enabled: true,
      spinCount: 3,
    },
    {
      id: 't2',
      text: 'Bên mình đang có chương trình trải nghiệm trợ lý Hoppi 24/7 trong 14 ngày, bạn {tham khảo|xem thử|trải nghiệm} tại link này nhé ạ!',
      enabled: true,
      spinCount: 3,
    },
    {
      id: 't3',
      text: '{Xin chào|Chào bạn}, mình gửi bạn bảng so sánh tính năng chatbot truyền thống và Siêu AI Hoppi tự học RAG để bạn tiện đối chiếu nhé 📄',
      enabled: true,
      spinCount: 2,
    },
    {
      id: 't4',
      text: 'Dạ vâng, bên em có sẵn giải pháp kết nối Zalo OA, Fanpage và phần mềm quản lý kho tự động chốt đơn livestream ạ 😊',
      enabled: true,
      spinCount: 1,
    },
    {
      id: 't5',
      text: 'Mình vừa cập nhật thêm module điều khiển nhà thông minh và bảo mật FaceID cho Hoppi, bạn xem demo clip này nhé! 🎥',
      enabled: true,
      spinCount: 1,
    },
  ]);

  const [logs, setLogs] = useState<ActivityLog[]>([
    {
      id: 'l1',
      time: '14:28:45',
      accountName: 'Minh Tuấn',
      accountIp: '103.162.2.89',
      phone: '0965 34 88**',
      message: 'Chào bạn, mình thấy bạn đang quan tâm giải pháp AI tự động hóa...',
      status: 'success',
    },
    {
      id: 'l2',
      time: '14:28:38',
      accountName: 'Thu Hằng',
      accountIp: '14.225.33.120',
      phone: '0912 88 41**',
      message: 'Bên mình đang có chương trình trải nghiệm trợ lý Hoppi 24/7...',
      status: 'success',
    },
    {
      id: 'l3',
      time: '14:28:31',
      accountName: 'Quang Huy',
      accountIp: '203.162.7.45',
      phone: '0988 12 33**',
      message: 'Xin chào, mình gửi bạn bảng so sánh tính năng chatbot...',
      status: 'skipped',
    },
    {
      id: 'l4',
      time: '14:28:22',
      accountName: 'Ngọc Anh',
      accountIp: '45.118.22.90',
      phone: '0903 55 99**',
      message: 'Dạ vâng, bên em có sẵn giải pháp kết nối Zalo OA...',
      status: 'failed',
    },
    {
      id: 'l5',
      time: '14:28:15',
      accountName: 'Phương Vy',
      accountIp: '171.244.88.16',
      phone: '0977 44 21**',
      message: 'Mình vừa cập nhật thêm module điều khiển nhà thông minh...',
      status: 'success',
    },
  ]);

  // Real-time sending simulation
  useEffect(() => {
    if (!isSending) return;
    const interval = setInterval(() => {
      setSentCount((prev) => {
        if (prev >= totalRecipients) {
          setIsSending(false);
          return prev;
        }
        return prev + 1;
      });

      const outcome = Math.random();
      const randomAccount = zaloAccounts[Math.floor(Math.random() * zaloAccounts.length)];
      const randomPhone = `09${Math.floor(10 + Math.random() * 89)} ${Math.floor(10 + Math.random() * 89)} ${Math.floor(10 + Math.random() * 89)}**`;
      const timeStr = new Date().toLocaleTimeString('vi-VN');

      if (outcome > 0.15) {
        setSuccessCount((c) => c + 1);
        setLogs((prev) => [
          {
            id: 'l-' + Date.now(),
            time: timeStr,
            accountName: randomAccount.name,
            accountIp: randomAccount.ip,
            phone: randomPhone,
            message: templates[0].text.slice(0, 50) + '...',
            status: 'success',
          },
          ...prev.slice(0, 19),
        ]);
      } else if (outcome > 0.05) {
        setSkipCount((c) => c + 1);
        setLogs((prev) => [
          {
            id: 'l-' + Date.now(),
            time: timeStr,
            accountName: randomAccount.name,
            accountIp: randomAccount.ip,
            phone: randomPhone,
            message: 'Khách đã nhận tin trong 24h qua, tự động bỏ qua để tránh spam',
            status: 'skipped',
          },
          ...prev.slice(0, 19),
        ]);
      } else {
        setFailCount((c) => c + 1);
        setLogs((prev) => [
          {
            id: 'l-' + Date.now(),
            time: timeStr,
            accountName: randomAccount.name,
            accountIp: randomAccount.ip,
            phone: randomPhone,
            message: 'Lỗi chặn kết nối Zalo Anti-Spam hoặc số không tồn tại',
            status: 'failed',
          },
          ...prev.slice(0, 19),
        ]);
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [isSending, zaloAccounts, templates]);

  const toggleAccountSelection = (id: string) => {
    setZaloAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, selected: !acc.selected } : acc))
    );
  };

  const selectAllAccounts = (selected: boolean) => {
    setZaloAccounts((prev) => prev.map((acc) => ({ ...acc, selected })));
  };

  /* -------------------------------------------------------------
     2. OPENAI DOTS - LUỒNG CÔNG VIỆC (Video 3ce0652e)
  ------------------------------------------------------------- */
  const [dotsActiveStep, setDotsActiveStep] = useState<number>(3);
  const [dotsSimProgress, setDotsSimProgress] = useState<number>(46);
  const [dotsExecutionTime, setDotsExecutionTime] = useState<number>(466);
  const [dotsRunning, setDotsRunning] = useState<boolean>(true);

  useEffect(() => {
    if (!dotsRunning) return;
    const timer = setInterval(() => {
      setDotsExecutionTime((t) => t + 24);
      setDotsSimProgress((p) => {
        if (p >= 100) return 0;
        return p + 2;
      });
    }, 500);
    return () => clearInterval(timer);
  }, [dotsRunning]);

  /* -------------------------------------------------------------
     3. MUSE STUDIO PRO (Image a7e286c8)
  ------------------------------------------------------------- */
  const [studioTasks, setStudioTasks] = useState([
    {
      id: 'task-1',
      title: 'mistletoe-lane-diffuser · ad 3',
      meta: 'Video · 9:16 · API · Tài khoản 4 · 11:22 27/10',
      status: 'Xong',
    },
    {
      id: 'task-2',
      title: 'mistletoe-lane-diffuser · ad 2',
      meta: 'Video · 9:16 · API · Tài khoản 4 · 11:22 27/10',
      status: 'Xong',
    },
    {
      id: 'task-3',
      title: 'mistletoe-lane-diffuser · ad 1',
      meta: 'Video · 9:16 · API · Tài khoản 4 · 11:22 27/10',
      status: 'Xong',
    },
    {
      id: 'task-4',
      title: 'trung-loa-bluetooth-dan-truyen-qua...',
      meta: 'Video · 9:16 · API · Tài khoản 4 · 11:12 27/10',
      status: 'Xong',
    },
    {
      id: 'task-5',
      title: 'trung-loa-bluetooth-dan-truyen-qua...',
      meta: 'Ảnh · 1:1 · API · Tài khoản 4 · 07:04 27/10',
      status: 'Xong',
    },
  ]);

  const [promptText, setPromptText] = useState(
    'Dùng ảnh đính kèm làm khung hình mở đầu. Giữ nguyên bối cảnh và sản phẩm như trong ảnh: máy khuếch tán tinh dầu hình ngôi nhà Giáng Sinh, phần mái đỏ đã nhấc ra đặt bên cạnh, lộ bình chứa nước. Bàn tay nhỏ vài giọt tinh dầu vào bình, rồi đặt mái nhà đỏ trở lại lên thân nhà, đèn cửa sổ bật sáng ấm và sương trắng bắt đầu bay lên từ ống khói. Bàn tay đủ 5 ngón. Không thêm chữ, không đổi hình dáng hay màu sản phẩm.'
  );
  const [aspectRatio, setAspectRatio] = useState('9:16');

  /* -------------------------------------------------------------
     4. HIGH-VALUE B2B LEADS PIPELINE
  ------------------------------------------------------------- */
  const [leads, setLeads] = useState<CRMLead[]>([
    {
      id: 'lead-01',
      name: 'Trần Văn Minh (Giám đốc Công nghệ TechCorp)',
      avatar: 'TM',
      channel: 'Zalo OA',
      lastMessage:
        'Chào anh Hải, bên mình đang cần triển khai hệ thống AI Agent tự động hóa chăm sóc khách hàng cho 50 chi nhánh. Báo giá dự kiến khoảng bao nhiêu và thời gian bao lâu?',
      sentiment: 'Hào hứng',
      buyingIntent: 88,
      status: 'Báo giá',
      dealValueVND: 120000000,
      phone: '0912.345.678',
      updatedAt: '10 phút trước',
    },
    {
      id: 'lead-02',
      name: 'Nguyễn Thị Bích Ngọc (CEO Thời trang Eva)',
      avatar: 'BN',
      channel: 'Fanpage',
      lastMessage:
        'Shop mình muốn tích hợp chatbot chốt đơn tự động qua livestream Facebook. Có kết nối được phần mềm kho không bạn ơi?',
      sentiment: 'Thắc mắc giá',
      buyingIntent: 72,
      status: 'Đang tư vấn',
      dealValueVND: 45000000,
      phone: '0988.777.666',
      updatedAt: '35 phút trước',
    },
    {
      id: 'lead-03',
      name: 'Lê Hoàng Long (Founder EdTech Academy)',
      avatar: 'HL',
      channel: 'Email',
      lastMessage:
        'Hợp đồng dự án trợ lý chấm bài tự động đã được HĐQT ký duyệt. Nhờ anh Hải gửi lại số tài khoản để bên em giải ngân đợt 1 nhé!',
      sentiment: 'Hào hứng',
      buyingIntent: 100,
      status: 'Đã chốt đơn',
      dealValueVND: 180000000,
      phone: '0903.222.111',
      updatedAt: '1 giờ trước',
    },
  ]);

  const [selectedLead, setSelectedLead] = useState<CRMLead>(leads[0]);
  const [analyzingLead, setAnalyzingLead] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [draftReply, setDraftReply] = useState('');

  const handleAnalyzeSelectedLead = async (lead: CRMLead) => {
    setSelectedLead(lead);
    setAnalyzingLead(true);
    setAiAnalysis(null);

    try {
      const res = await fetch('/api/gemini/analyze-sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadName: lead.name,
          message: lead.lastMessage,
          channel: lead.channel,
        }),
      });
      const data = await res.json();
      setAiAnalysis(data);
      if (data.recommendedReply) {
        setDraftReply(data.recommendedReply);
      }
    } catch (e) {
      console.error(e);
      setAiAnalysis({
        sentiment: 'Tích cực',
        buyingIntent: '85%',
        recommendedReply: `Chào bạn ${lead.name}, Hoppi xin chuyển lời tới anh Nguyễn Thanh Hải để sắp xếp cuộc gọi tư vấn giải pháp tối ưu cho bạn ngay trong ngày hôm nay!`,
      });
      setDraftReply(
        `Chào bạn ${lead.name}, Hoppi xin chuyển lời tới anh Nguyễn Thanh Hải để sắp xếp cuộc gọi tư vấn giải pháp tối ưu cho bạn ngay trong ngày hôm nay!`
      );
    } finally {
      setAnalyzingLead(false);
    }
  };

  /* -------------------------------------------------------------
     5. DEPARTMENT WORK SIMULATION & ACTIVE TASK QUEUES (Video Reference)
  ------------------------------------------------------------- */
  interface VirtualDesk {
    id: string;
    deptName: string;
    deskTitle: string;
    agentName: string;
    haloName: string;
    haloColor: string;
    haloBg: string;
    haloRingBorder: string;
    accentBorder: string;
    currentActivity: string;
    throughputToday: number;
    monitorPreview: string;
    icon: any;
  }

  interface WorkflowTask {
    id: string;
    clientName: string;
    projectTitle: string;
    valueVND: number;
    currentDeskId: string;
    stageLabel: string;
    progressPercent: number;
    priority: 'urgent' | 'high' | 'medium' | 'low' | 'normal';
    status: 'running' | 'waiting_hitl' | 'completed';
    startedAt: string;
    dueDate?: string;
    log: string;
    notes?: string[];
    archived?: boolean;
    archivedAt?: string;
  }

  // Visual Priority Badge & Border Styling Configuration (High, Medium, Low)
  const getPriorityBadgeConfig = (priority: string) => {
    switch (priority) {
      case 'urgent':
      case 'high':
        return {
          label: 'High',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm shadow-rose-500/20',
          dotBg: 'bg-rose-400 animate-pulse',
          borderLeft: 'border-l-4 border-l-rose-500',
          shadow: 'shadow-sm shadow-rose-500/10',
        };
      case 'medium':
      case 'normal':
        return {
          label: 'Medium',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/15',
          dotBg: 'bg-amber-400',
          borderLeft: 'border-l-4 border-l-amber-400',
          shadow: 'shadow-sm shadow-amber-500/10',
        };
      case 'low':
      default:
        return {
          label: 'Low',
          badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          dotBg: 'bg-blue-400',
          borderLeft: 'border-l-4 border-l-blue-400',
          shadow: 'shadow-sm shadow-blue-500/10',
        };
    }
  };

  const virtualDesks: VirtualDesk[] = [
    {
      id: 'desk-1',
      deptName: 'Phòng Kinh Doanh',
      deskTitle: 'Bàn 1: Tiếp Nhận & Sàng Lọc Lead',
      agentName: 'AI Sales Lead • Halo-Beta',
      haloName: 'Vòng Sáng Xanh Ngọc',
      haloColor: 'text-emerald-400',
      haloBg: 'bg-emerald-500/20',
      haloRingBorder: 'border-emerald-400 shadow-emerald-500/40',
      accentBorder: 'border-emerald-500/40',
      currentActivity: 'Bắt sóng 18 lead Zalo OA & chấm điểm cảm xúc',
      throughputToday: 86,
      monitorPreview: 'Zalo Webhook: +18 msgs • 92% Buying Intent',
      icon: Users,
    },
    {
      id: 'desk-2',
      deptName: 'Phòng Phân Tích PRD',
      deskTitle: 'Bàn 2: Bóc Tách Yêu Cầu & Báo Giá',
      agentName: 'AI Product Manager • Halo-Delta',
      haloName: 'Vòng Sáng Hổ Phách',
      haloColor: 'text-amber-400',
      haloBg: 'bg-amber-500/20',
      haloRingBorder: 'border-amber-400 shadow-amber-500/40',
      accentBorder: 'border-amber-500/40',
      currentActivity: 'Chuyển prompt khách thành PRD & dự toán chi phí',
      throughputToday: 34,
      monitorPreview: 'PRD Generator: Specs + Cost Matrix',
      icon: FileText,
    },
    {
      id: 'desk-3',
      deptName: 'Phòng Thiết Kế UI/UX',
      deskTitle: 'Bàn 3: Phối Màu & Bản Mẫu 3D',
      agentName: 'AI Creative Lead • Halo-Gamma',
      haloName: 'Vòng Sáng Hồng Ruby',
      haloColor: 'text-rose-400',
      haloBg: 'bg-rose-500/20',
      haloRingBorder: 'border-rose-400 shadow-rose-500/40',
      accentBorder: 'border-rose-500/40',
      currentActivity: 'Phối màu chuẩn gu thẩm mỹ cao & tạo mẫu web 3D',
      throughputToday: 29,
      monitorPreview: 'Palette 60-30-10: Cam Đậm + Đen Nhám',
      icon: Palette,
    },
    {
      id: 'desk-4',
      deptName: 'Phòng Điều Hành Trung Tâm',
      deskTitle: 'Bàn 4: Phê Duyệt Tối Cao HITL',
      agentName: 'Master Nguyễn Thanh Hải',
      haloName: 'Vòng Sáng Cyan Tối Cao',
      haloColor: 'text-cyan-300',
      haloBg: 'bg-cyan-500/25',
      haloRingBorder: 'border-cyan-300 shadow-cyan-500/50',
      accentBorder: 'border-cyan-500/50',
      currentActivity: 'Duyệt chiết khấu, cam kết SLA & ký hợp đồng',
      throughputToday: 21,
      monitorPreview: 'HITL Gate: Zero-Trust Token Active',
      icon: ShieldCheck,
    },
    {
      id: 'desk-5',
      deptName: 'Phòng Kỹ Thuật',
      deskTitle: 'Bàn 5: Lập Trình & Bàn Giao 24/7',
      agentName: 'AI Senior Architect • Halo-Alpha',
      haloName: 'Vòng Sáng Xanh Chàm',
      haloColor: 'text-indigo-400',
      haloBg: 'bg-indigo-500/20',
      haloRingBorder: 'border-indigo-400 shadow-indigo-500/40',
      accentBorder: 'border-indigo-500/40',
      currentActivity: 'Code frontend/backend, fix bug & đẩy Cloud',
      throughputToday: 132,
      monitorPreview: 'Build: Succeeded • Zero Bug Delivery',
      icon: Code2,
    },
  ];

  const defaultSimTasks: WorkflowTask[] = [
    {
      id: 'TASK-01',
      clientName: 'Anh Hoàng Nam',
      projectTitle: 'Sơn Đá Coffee • App Đặt Cà Phê Giao Nhanh',
      valueVND: 45000000,
      currentDeskId: 'desk-3',
      stageLabel: 'Đang Phối Màu UI/UX',
      progressPercent: 75,
      priority: 'high',
      status: 'running',
      startedAt: '10:15',
      dueDate: 'Hôm nay 17:00',
      log: 'Đang dựng bản mẫu giao diện cam đậm & đen nhám',
      notes: [
        '[10:20] Khách yêu cầu thêm mã QR thanh toán MoMo/VietQR',
        '[10:42] Đã thống nhất bảng màu: Cam san hô và xám titan',
      ],
    },
    {
      id: 'TASK-02',
      clientName: 'Chị Mai Lan',
      projectTitle: 'Resort Vân Thê • Khu Nghỉ Dưỡng Núi Rừng',
      valueVND: 65000000,
      currentDeskId: 'desk-4',
      stageLabel: 'Chờ Chủ Nhân Duyệt HITL',
      progressPercent: 100,
      priority: 'urgent',
      status: 'waiting_hitl',
      startedAt: '09:40',
      dueDate: 'Hôm nay 15:30 (Khẩn)',
      log: 'Đã hoàn tất PRD & UI, chờ anh Nguyễn Thanh Hải phê duyệt hợp đồng',
      notes: [
        '[09:55] Đã đối soát điều khoản bảo mật với luật sư',
        '[10:30] Chờ ký điện tử hợp đồng giai đoạn 1',
      ],
    },
    {
      id: 'TASK-03',
      clientName: 'Anh Đức Huy',
      projectTitle: 'Hồ Sơ Năng Lực 3D About HUI (Xoay Chuột)',
      valueVND: 140000000,
      currentDeskId: 'desk-5',
      stageLabel: 'Đang Lập Trình 3D Canvas',
      progressPercent: 48,
      priority: 'urgent',
      status: 'running',
      startedAt: '08:15',
      dueDate: 'Ngày mai 18:00',
      log: 'Đang nhúng Three.js canvas xoay tương tác theo chuột',
      notes: [
        '[08:30] Khách yêu cầu tối ưu 60fps trên điện thoại tầm trung',
        '[09:15] Đã test trên Chrome & Safari iOS chạy mượt mà',
      ],
    },
    {
      id: 'TASK-04',
      clientName: 'Bác Sĩ Trọng',
      projectTitle: 'Nha Khoa SmileCare • Đặt Lịch Tự Động',
      valueVND: 38000000,
      currentDeskId: 'desk-1',
      stageLabel: 'Sàng Lọc Lead Zalo OA',
      progressPercent: 35,
      priority: 'medium',
      status: 'running',
      startedAt: '11:02',
      dueDate: 'Hôm nay 21:00',
      log: 'Đang đối soát nhu cầu tích hợp Zalo Notification Service',
      notes: ['[11:05] Cần tích hợp ZNS thông báo nhắc lịch khám tự động'],
    },
    {
      id: 'TASK-05',
      clientName: 'Chị Thu Thảo',
      projectTitle: 'Thời Trang Bella • AI Livestream CRM',
      valueVND: 55000000,
      currentDeskId: 'desk-2',
      stageLabel: 'Bóc Tách PRD & Báo Giá',
      progressPercent: 82,
      priority: 'low',
      status: 'running',
      startedAt: '10:45',
      dueDate: '03/11 10:00',
      log: 'Đang dự toán module chốt đơn tự động qua livestream',
      notes: ['[10:50] Livestream dự kiến vào tối thứ 6, cần kịch bản chốt đơn nhanh'],
      archived: false,
    },
    {
      id: 'TASK-ARCH-01',
      clientName: 'Anh Quốc Bảo (Tập đoàn An Gia)',
      projectTitle: 'AI CRM Tích Hợp Zalo OA & Fanpage Bất Động Sản',
      valueVND: 220000000,
      currentDeskId: 'desk-5',
      stageLabel: 'Đã Bàn Giao Nghiệm Thu 100%',
      progressPercent: 100,
      priority: 'high',
      status: 'completed',
      startedAt: 'Hôm qua 08:30',
      dueDate: 'Hôm qua 18:00',
      log: 'Dự án đã bàn giao nghiệm thu thành công, lưu trữ lịch sử hoàn tất.',
      notes: [
        '[Hôm qua 17:45] Khách hàng nghiệm thu đạt 10/10, chuyển tiền đợt cuối',
        '[Hôm qua 18:00] Đã chuyển vào Kho Lưu Trữ (Archive) để giải phóng không gian làm việc chính',
      ],
      archived: true,
      archivedAt: 'Hôm qua 18:00',
    },
  ];

  const [taskNotesInput, setTaskNotesInput] = useState<{ [taskId: string]: string }>({});

  const handleAddCustomNote = (taskId: string) => {
    const text = (taskNotesInput[taskId] || '').trim();
    if (!text) return;
    const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const formatted = `[${timeStr}] ${text}`;

    setSimTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, notes: [...(t.notes || []), formatted] }
          : t
      )
    );

    setTaskNotesInput((prev) => ({ ...prev, [taskId]: '' }));
  };

  const [simTasks, setSimTasks] = useState<WorkflowTask[]>(() => {
    try {
      const saved = localStorage.getItem('hoppi_crm_sim_tasks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse sim tasks from localStorage', e);
    }
    return defaultSimTasks;
  });

  // LocalStorage Persistence Sync State for Visual Pulsing Indicator
  const [syncState, setSyncState] = useState<'idle' | 'syncing' | 'saved'>('idle');
  const isInitialSyncMount = useRef(true);

  useEffect(() => {
    if (isInitialSyncMount.current) {
      isInitialSyncMount.current = false;
      return;
    }

    setSyncState('syncing');
    const saveTimer = setTimeout(() => {
      try {
        localStorage.setItem('hoppi_crm_sim_tasks', JSON.stringify(simTasks));
      } catch (err) {
        console.warn('Failed to save sim tasks to localStorage', err);
      }
      setSyncState('saved');

      const idleTimer = setTimeout(() => {
        setSyncState('idle');
      }, 1400);

      return () => clearTimeout(idleTimer);
    }, 400);

    return () => clearTimeout(saveTimer);
  }, [simTasks]);

  const [simRunning, setSimRunning] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<1 | 2 | 4>(1);
  const [autoApproveHitl, setAutoApproveHitl] = useState<boolean>(false);
  const [selectedSimTaskId, setSelectedSimTaskId] = useState<string>('TASK-02');
  const [simQueueFilter, setSimQueueFilter] = useState<'all' | 'running' | 'waiting_hitl' | 'completed' | 'archived'>('all');
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState<boolean>(false);
  const [archiveSearchQuery, setArchiveSearchQuery] = useState<string>('');

  // Simulation Tick Loop
  useEffect(() => {
    if (!simRunning) return;

    const interval = setInterval(() => {
      setSimTasks((prev) =>
        prev.map((task) => {
          if (task.archived || task.status === 'completed') return task;

          // If waiting at Desk 4 for HITL approval
          if (task.currentDeskId === 'desk-4') {
            if (autoApproveHitl) {
              return {
                ...task,
                currentDeskId: 'desk-5',
                stageLabel: 'Đang Lập Trình Code & Fix Bug',
                progressPercent: 5,
                status: 'running',
                log: 'Chủ nhân đã tự động ủy quyền duyệt HITL. Chuyển sang Phòng Kỹ Thuật!',
              };
            }
            return task; // Wait for manual 1-click approval
          }

          const nextProgress = task.progressPercent + 5 * simSpeed;

          if (nextProgress >= 100) {
            if (task.currentDeskId === 'desk-1') {
              return {
                ...task,
                currentDeskId: 'desk-2',
                stageLabel: 'Đang Phân Tích PRD & Báo Giá',
                progressPercent: 0,
                log: 'Đã hoàn tất sàng lọc lead. Chuyển sang Bàn 2 bóc tách PRD!',
              };
            }
            if (task.currentDeskId === 'desk-2') {
              return {
                ...task,
                currentDeskId: 'desk-3',
                stageLabel: 'Đang Phối Màu & Dựng Wireframe UI',
                progressPercent: 0,
                log: 'PRD đã chốt. Chuyển sang Bàn 3 phối màu chuẩn gu thẩm mỹ cao!',
              };
            }
            if (task.currentDeskId === 'desk-3') {
              return {
                ...task,
                currentDeskId: 'desk-4',
                stageLabel: 'Chờ Chủ Nhân Duyệt HITL',
                progressPercent: 100,
                status: 'waiting_hitl',
                log: 'Bản mẫu UI/UX 10/10 hoàn tất. Đang chờ Chủ nhân Nguyễn Thanh Hải phê duyệt!',
              };
            }
            if (task.currentDeskId === 'desk-5') {
              return {
                ...task,
                progressPercent: 100,
                status: 'completed',
                stageLabel: 'Đã Hoàn Tất Bàn Giao',
                log: 'Lập trình xong, kiểm thử zero bug và bàn giao nghiệm thu thành công!',
              };
            }
          }

          return {
            ...task,
            progressPercent: Math.min(99, nextProgress),
          };
        })
      );
    }, 1200 / simSpeed);

    return () => clearInterval(interval);
  }, [simRunning, simSpeed, autoApproveHitl]);

  const handleApproveSimTask = (taskId: string) => {
    setSimTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              currentDeskId: 'desk-5',
              stageLabel: 'Đang Lập Trình Code & Fix Bug',
              progressPercent: 10,
              status: 'running',
              log: 'Chủ nhân Nguyễn Thanh Hải đã CHẤP THUẬN. Chuyển ngay sang Phòng Kỹ Thuật!',
            }
          : t
      )
    );
  };

  const handleAddNewSimTask = () => {
    const clients = [
      { name: 'Anh Quang Minh', project: 'Phòng Khám Đa Khoa Tâm Đức • Đặt Lịch & CRM', val: 58000000 },
      { name: 'Chị Hải Yến', project: 'Khu Đô Thị Ecopark • Cổng Thông Tin Cư Dân', val: 95000000 },
      { name: 'Anh Tuấn Phong', project: 'Nội Thất Luxury Concept • Showroom 3D', val: 82000000 },
    ];
    const pick = clients[Math.floor(Math.random() * clients.length)];
    const newTask: WorkflowTask = {
      id: `TASK-${Date.now().toString().slice(-4)}`,
      clientName: pick.name,
      projectTitle: pick.project,
      valueVND: pick.val,
      currentDeskId: 'desk-1',
      stageLabel: 'Tiếp Nhận Lead Mới',
      progressPercent: 5,
      priority: 'high',
      status: 'running',
      startedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      dueDate: 'Hôm nay 18:30',
      log: 'Lead mới vừa gửi tin nhắn qua Zalo OA, đang sàng lọc sơ bộ',
      notes: [],
      archived: false,
    };
    setSimTasks((prev) => [newTask, ...prev]);
    setSelectedSimTaskId(newTask.id);
  };

  // Archive a task to move it into the separate historical view, keeping workspace uncluttered
  const handleArchiveTask = (taskId: string) => {
    const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const dateStr = new Date().toLocaleDateString('vi-VN');
    const nowStamp = `${timeStr} ${dateStr}`;

    setSimTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              archived: true,
              archivedAt: nowStamp,
              log: `Đã lưu trữ vào Kho Lịch Sử (Archive) vào lúc ${nowStamp}`,
              notes: [
                ...(t.notes || []),
                `[${nowStamp}] Đã lưu trữ nhiệm vụ vào Kho Lịch Sử để giải phóng bàn làm việc`,
              ],
            }
          : t
      )
    );

    setDragNotice(`✓ Đã lưu trữ nhiệm vụ ${taskId} vào Kho Lịch Sử!`);
    setTimeout(() => setDragNotice(null), 3000);
  };

  // Restore an archived task back to the active workspace
  const handleRestoreTask = (taskId: string) => {
    const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const nowStamp = `${timeStr}`;

    setSimTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              archived: false,
              log: `Khôi phục trở lại bàn làm việc vào lúc ${nowStamp}`,
              notes: [
                ...(t.notes || []),
                `[${nowStamp}] Khôi phục từ Kho Lưu Trữ về bàn làm việc hoạt động`,
              ],
            }
          : t
      )
    );

    setDragNotice(`✓ Đã khôi phục nhiệm vụ ${taskId} về không gian làm việc chính!`);
    setTimeout(() => setDragNotice(null), 3000);
  };

  // Delete task permanently from the archive
  const handleDeleteTaskPermanently = (taskId: string) => {
    setSimTasks((prev) => prev.filter((t) => t.id !== taskId));
    setDragNotice(`Đã xóa vĩnh viễn nhiệm vụ ${taskId}`);
    setTimeout(() => setDragNotice(null), 2500);
  };

  // Export current state of all task cards across virtual departments to CSV
  const handleDownloadCSV = (onlyArchived: boolean | React.MouseEvent = false) => {
    const isArchived = typeof onlyArchived === 'boolean' ? onlyArchived : false;
    try {
      const headers = [
        'Mã Nhiệm Vụ (Task ID)',
        'Khách Hàng (Client Name)',
        'Tên Dự Án (Project Title)',
        'Phòng Ban Hiện Tại (Department)',
        'Bàn Làm Việc (Virtual Desk ID)',
        'Giai Đoạn (Stage Label)',
        'Tiến Độ % (Progress)',
        'Độ Ưu Tiên (Priority)',
        'Trạng Thái (Status)',
        'Lưu Trữ (Archive Status)',
        'Thời Điểm Lưu Trữ (Archived At)',
        'Giá Trị Hợp Đồng VNĐ (Value VND)',
        'Thời Gian Bắt Đầu (Started At)',
        'Hạn Chót (Due Date)',
        'Nhật Ký Hoạt Động (Activity Log)',
      ];

      const escapeCSV = (value: any) => {
        if (value === null || value === undefined) return '""';
        const str = String(value).replace(/"/g, '""');
        return `"${str}"`;
      };

      const targetList = isArchived ? simTasks.filter((t) => t.archived) : simTasks;

      const rows = targetList.map((task) => {
        const desk = virtualDesks.find((d) => d.id === task.currentDeskId);
        const deptTitle = desk ? `${desk.deptName} (${desk.deskTitle})` : task.currentDeskId;
        const statusMap: Record<string, string> = {
          running: 'Đang Thực Thi (Running)',
          waiting_hitl: 'Chờ Duyệt HITL (Pending Master)',
          completed: 'Đã Bàn Giao (Completed)',
        };
        const priorityMap: Record<string, string> = {
          urgent: 'Khẩn Cấp (Urgent)',
          high: 'Ưu Tiên Cao (High)',
          medium: 'Trung Bình (Medium)',
          normal: 'Bình Thường (Normal)',
          low: 'Thấp (Low)',
        };

        return [
          escapeCSV(task.id),
          escapeCSV(task.clientName),
          escapeCSV(task.projectTitle),
          escapeCSV(deptTitle),
          escapeCSV(task.currentDeskId),
          escapeCSV(task.stageLabel),
          escapeCSV(`${task.progressPercent}%`),
          escapeCSV(priorityMap[task.priority] || task.priority),
          escapeCSV(statusMap[task.status] || task.status),
          escapeCSV(task.archived ? 'Đã Lưu Trữ (Archived)' : 'Hoạt Động (Active)'),
          escapeCSV(task.archivedAt || '-'),
          escapeCSV(task.valueVND.toLocaleString('vi-VN')),
          escapeCSV(task.startedAt),
          escapeCSV(task.dueDate || 'Hôm nay 18:00'),
          escapeCSV(task.log),
        ].join(',');
      });

      // UTF-8 BOM (\uFEFF) ensures Vietnamese diacritics display properly in Excel & Google Sheets
      const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const now = new Date();
      const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
      link.href = url;
      link.setAttribute('download', isArchived ? `hoppi_archived_tasks_${timestamp}.csv` : `hoppi_virtual_departments_tasks_${timestamp}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDragNotice(isArchived ? `✓ Đã xuất file CSV ${targetList.length} nhiệm vụ lưu trữ!` : `✓ Đã xuất thành công file CSV ${simTasks.length} nhiệm vụ từ 5 phòng ban ảo!`);
      setTimeout(() => setDragNotice(null), 3500);
    } catch (err) {
      console.error('Lỗi khi xuất file CSV:', err);
    }
  };

  // Drag-and-Drop State for Virtual Desks & Priority Queue Reordering
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragSourceDeskId, setDragSourceDeskId] = useState<string | null>(null);
  const [dragOverDeskId, setDragOverDeskId] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);
  const [dragNotice, setDragNotice] = useState<string | null>(null);

  const handleTaskDragStart = (e: React.DragEvent, taskId: string, deskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(taskId);
    setDragSourceDeskId(deskId);
  };

  const handleTaskDragEnd = () => {
    setDraggedTaskId(null);
    setDragSourceDeskId(null);
    setDragOverDeskId(null);
    setDragOverTaskId(null);
  };

  const handleDeskDragOver = (e: React.DragEvent, deskId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverDeskId !== deskId) {
      setDragOverDeskId(deskId);
    }
  };

  const handleDeskDragLeave = (e: React.DragEvent, deskId: string) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (dragOverDeskId === deskId) {
      setDragOverDeskId(null);
    }
  };

  const handleTaskDropOnDesk = (e: React.DragEvent, targetDeskId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (!taskId) return;

    const deskInfo = virtualDesks.find((d) => d.id === targetDeskId);
    const targetDeskTitle = deskInfo?.deptName || targetDeskId;

    setSimTasks((prev) => {
      const taskIndex = prev.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return prev;

      const currentTask = prev[taskIndex];
      const isMovedToOtherDesk = currentTask.currentDeskId !== targetDeskId;

      let newStage = currentTask.stageLabel;
      let newStatus = currentTask.status;
      let newProgress = currentTask.progressPercent;

      if (targetDeskId === 'desk-1') {
        newStage = 'Sàng Lọc & Phân Loại Lead';
        newStatus = 'running';
        newProgress = Math.min(newProgress, 35);
      } else if (targetDeskId === 'desk-2') {
        newStage = 'Bóc Tách PRD & Báo Giá';
        newStatus = 'running';
        newProgress = Math.min(newProgress, 65);
      } else if (targetDeskId === 'desk-3') {
        newStage = 'Phối Màu & Bản Mẫu UI 3D';
        newStatus = 'running';
        newProgress = Math.min(newProgress, 85);
      } else if (targetDeskId === 'desk-4') {
        newStage = 'Chờ Chủ Nhân Duyệt HITL';
        newStatus = 'waiting_hitl';
        newProgress = 100;
      } else if (targetDeskId === 'desk-5') {
        newStage = 'Đang Lập Trình Code & Bàn Giao';
        newStatus = 'running';
        newProgress = isMovedToOtherDesk ? 25 : newProgress;
      }

      const updatedTask: WorkflowTask = {
        ...currentTask,
        currentDeskId: targetDeskId,
        stageLabel: newStage,
        status: newStatus,
        progressPercent: newProgress,
        log: isMovedToOtherDesk
          ? `Chủ nhân vừa kéo thả sang [${targetDeskTitle}]. Đã xếp vào hàng đợi ưu tiên!`
          : currentTask.log,
      };

      const others = prev.filter((t) => t.id !== taskId);
      return [...others, updatedTask];
    });

    setDragNotice(`✓ Đã kéo chuyển nhiệm vụ ${taskId} sang [${targetDeskTitle}] thành công!`);
    setTimeout(() => setDragNotice(null), 3200);

    setDraggedTaskId(null);
    setDragSourceDeskId(null);
    setDragOverDeskId(null);
    setDragOverTaskId(null);
  };

  const handleTaskDropOnTask = (e: React.DragEvent, targetTaskId: string, deskId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const sourceTaskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (!sourceTaskId || sourceTaskId === targetTaskId) return;

    setSimTasks((prev) => {
      const sourceTask = prev.find((t) => t.id === sourceTaskId);
      const targetIndex = prev.findIndex((t) => t.id === targetTaskId);
      if (!sourceTask || targetIndex === -1) return prev;

      const isMovedToOtherDesk = sourceTask.currentDeskId !== deskId;
      let newStage = sourceTask.stageLabel;
      let newStatus = sourceTask.status;

      if (isMovedToOtherDesk) {
        if (deskId === 'desk-4') {
          newStage = 'Chờ Chủ Nhân Duyệt HITL';
          newStatus = 'waiting_hitl';
        } else if (deskId === 'desk-5') {
          newStage = 'Đang Lập Trình Code & Fix Bug';
          newStatus = 'running';
        } else if (deskId === 'desk-1') {
          newStage = 'Tiếp Nhận Lead Mới';
          newStatus = 'running';
        } else if (deskId === 'desk-2') {
          newStage = 'Bóc Tách PRD & Báo Giá';
          newStatus = 'running';
        } else if (deskId === 'desk-3') {
          newStage = 'Phối Màu & Dựng Wireframe UI';
          newStatus = 'running';
        }
      }

      const updatedSource: WorkflowTask = {
        ...sourceTask,
        currentDeskId: deskId,
        stageLabel: newStage,
        status: newStatus,
        priority: 'urgent', // Elevate priority on reorder
        log: `Đã thay đổi vị trí ưu tiên trong hàng đợi bàn ${deskId}.`,
      };

      const remaining = prev.filter((t) => t.id !== sourceTaskId);
      const insertIdx = remaining.findIndex((t) => t.id === targetTaskId);
      remaining.splice(insertIdx, 0, updatedSource);
      return remaining;
    });

    setDragNotice(`✓ Đã đổi vị trí ưu tiên: Nhiệm vụ ${sourceTaskId} được đẩy lên hàng đầu!`);
    setTimeout(() => setDragNotice(null), 3200);

    setDraggedTaskId(null);
    setDragSourceDeskId(null);
    setDragOverDeskId(null);
    setDragOverTaskId(null);
  };

  const progressPercent = Math.min(100, Math.round((sentCount / totalRecipients) * 100 * 10) / 10);

  // Executive Summary Dashboard Metrics & Visual Progress Bar Data
  const [showSummaryDashboard, setShowSummaryDashboard] = useState<boolean>(true);

  // 1. Total Active Leads metrics
  const totalActiveLeadsCount = 38;
  const targetLeadsQuota = 50;
  const activeLeadsPercent = Math.round((totalActiveLeadsCount / targetLeadsQuota) * 100);
  const leadsBreakdown = {
    screening: 12, // 31.6%
    consulting: 18, // 47.4%
    closing: 8, // 21.0%
  };

  // 2. Closing Rate metrics
  const closingRatePercent = 72.4;
  const targetClosingBenchmark = 65.0;
  const closingBreakdown = {
    won: 72.4,
    negotiating: 20.8,
    dropped: 6.8,
  };

  // 3. Tasks Due Today metrics (computed dynamically from simTasks queue)
  const completedTasksToday = simTasks.filter((t) => t.status === 'completed').length + 10;
  const runningTasksToday = simTasks.filter((t) => t.status === 'running').length;
  const hitlTasksToday = simTasks.filter((t) => t.status === 'waiting_hitl').length;
  const totalTasksDueToday = completedTasksToday + runningTasksToday + hitlTasksToday;
  const taskPercentCompleted = Math.round((completedTasksToday / totalTasksDueToday) * 100);
  const taskPercentRunning = Math.round((runningTasksToday / totalTasksDueToday) * 100);
  const taskPercentHitl = Math.max(0, 100 - taskPercentCompleted - taskPercentRunning);

  // Detailed Activity Breakdown Recharts State & 30-Day Trend Data
  const [showDetailedCharts, setShowDetailedCharts] = useState<boolean>(true);
  const [chartTab, setChartTab] = useState<'trend30' | 'deptCompare' | 'combined'>('trend30');

  // 30-day Closing Rate trend dataset (Oct 02 - Oct 31)
  const closingRateTrend30Days = [
    { date: '02/10', rate: 56.4, target: 65, deals: 2, inflow: 12, revenue: 68 },
    { date: '03/10', rate: 58.1, target: 65, deals: 3, inflow: 14, revenue: 85 },
    { date: '04/10', rate: 57.5, target: 65, deals: 2, inflow: 11, revenue: 55 },
    { date: '05/10', rate: 60.2, target: 65, deals: 4, inflow: 15, revenue: 110 },
    { date: '06/10', rate: 59.8, target: 65, deals: 3, inflow: 13, revenue: 92 },
    { date: '07/10', rate: 61.5, target: 65, deals: 4, inflow: 16, revenue: 125 },
    { date: '08/10', rate: 62.0, target: 65, deals: 4, inflow: 15, revenue: 118 },
    { date: '09/10', rate: 61.2, target: 65, deals: 3, inflow: 14, revenue: 95 },
    { date: '10/10', rate: 63.8, target: 65, deals: 5, inflow: 18, revenue: 145 },
    { date: '11/10', rate: 64.5, target: 65, deals: 5, inflow: 17, revenue: 160 },
    { date: '12/10', rate: 65.2, target: 65, deals: 6, inflow: 19, revenue: 175 },
    { date: '13/10', rate: 64.8, target: 65, deals: 5, inflow: 16, revenue: 150 },
    { date: '14/10', rate: 66.1, target: 65, deals: 6, inflow: 20, revenue: 190 },
    { date: '15/10', rate: 65.9, target: 65, deals: 5, inflow: 18, revenue: 165 },
    { date: '16/10', rate: 67.4, target: 65, deals: 6, inflow: 21, revenue: 210 },
    { date: '17/10', rate: 66.8, target: 65, deals: 5, inflow: 19, revenue: 180 },
    { date: '18/10', rate: 68.2, target: 65, deals: 7, inflow: 22, revenue: 235 },
    { date: '19/10', rate: 67.9, target: 65, deals: 6, inflow: 20, revenue: 195 },
    { date: '20/10', rate: 69.5, target: 65, deals: 7, inflow: 23, revenue: 250 },
    { date: '21/10', rate: 68.7, target: 65, deals: 6, inflow: 21, revenue: 215 },
    { date: '22/10', rate: 70.3, target: 65, deals: 8, inflow: 24, revenue: 270 },
    { date: '23/10', rate: 69.8, target: 65, deals: 7, inflow: 22, revenue: 240 },
    { date: '24/10', rate: 71.0, target: 65, deals: 8, inflow: 25, revenue: 295 },
    { date: '25/10', rate: 70.5, target: 65, deals: 7, inflow: 23, revenue: 260 },
    { date: '26/10', rate: 71.8, target: 65, deals: 8, inflow: 24, revenue: 310 },
    { date: '27/10', rate: 71.2, target: 65, deals: 7, inflow: 22, revenue: 280 },
    { date: '28/10', rate: 72.5, target: 65, deals: 9, inflow: 26, revenue: 345 },
    { date: '29/10', rate: 72.0, target: 65, deals: 8, inflow: 25, revenue: 320 },
    { date: '30/10', rate: 73.1, target: 65, deals: 9, inflow: 27, revenue: 375 },
    { date: '31/10', rate: 72.4, target: 65, deals: 8, inflow: 26, revenue: 360 },
  ];

  // Lead Conversion Comparison across 5 Virtual Desks / Departments
  const deptConversionData = [
    {
      deptKey: 'desk-1',
      deptName: 'Kinh Doanh',
      fullDept: 'Bàn 1: Phòng Kinh Doanh (Lead Sàng Lọc)',
      inflow: 185,
      converted: 115,
      conversionRate: 62.2,
      dropRate: 37.8,
      avgDays: 1.2,
      color: '#06b6d4',
    },
    {
      deptKey: 'desk-2',
      deptName: 'Phân Tích PRD',
      fullDept: 'Bàn 2: Phòng Phân Tích PRD & Dự Toán',
      inflow: 115,
      converted: 86,
      conversionRate: 74.8,
      dropRate: 25.2,
      avgDays: 2.5,
      color: '#6366f1',
    },
    {
      deptKey: 'desk-3',
      deptName: 'Thiết Kế UI/UX',
      fullDept: 'Bàn 3: Phòng Thiết Kế UI/UX 3D',
      inflow: 86,
      converted: 68,
      conversionRate: 79.1,
      dropRate: 20.9,
      avgDays: 3.0,
      color: '#a855f7',
    },
    {
      deptKey: 'desk-4',
      deptName: 'Duyệt HITL',
      fullDept: 'Bàn 4: Phòng Phê Duyệt Tối Cao HITL',
      inflow: 68,
      converted: 58,
      conversionRate: 85.3,
      dropRate: 14.7,
      avgDays: 0.5,
      color: '#f59e0b',
    },
    {
      deptKey: 'desk-5',
      deptName: 'Kỹ Thuật',
      fullDept: 'Bàn 5: Phòng Kỹ Thuật & Bàn Giao',
      inflow: 58,
      converted: 54,
      conversionRate: 93.1,
      dropRate: 6.9,
      avgDays: 4.2,
      color: '#10b981',
    },
  ];

  return (
    <div className="flex flex-col h-full min-h-0 bg-[#0a0f18] text-slate-100 rounded-2xl overflow-y-auto custom-scrollbar border border-slate-800 shadow-2xl relative pb-20">
      {/* Top Main Navigation Bar matching User attachments */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2.5 backdrop-blur-md gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              Kinh Doanh & CRM Tự Trị
              <span className="text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                v2.1.107 Multi-Agent
              </span>
              {syncState === 'syncing' ? (
                <span className="inline-flex items-center gap-1 text-[9px] font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-500/50 px-1.5 py-0.5 rounded-full animate-pulse shadow-sm shadow-cyan-500/30">
                  <RefreshCw className="w-2.5 h-2.5 text-cyan-400 animate-spin" />
                  Syncing...
                </span>
              ) : syncState === 'saved' ? (
                <span className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-1.5 py-0.5 rounded-full">
                  <Check className="w-2.5 h-2.5 text-emerald-400" />
                  Saved
                </span>
              ) : null}
            </h2>
            <p className="text-[11px] text-slate-400">
              Quản trị Zalo đa tài khoản · Luồng OpenAI DOTS · Studio truyền thông
            </p>
          </div>
        </div>

        {/* Master View Tabs */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveView('zalo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
              activeView === 'zalo'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Zalo Multi-Account (Ảnh 37cfd)
          </button>

          <button
            onClick={() => setActiveView('dots')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
              activeView === 'dots'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            OpenAI DOTS Workflow (Clip 3ce0)
          </button>

          <button
            onClick={() => setActiveView('studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
              activeView === 'studio'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            Muse Studio Pro (Ảnh a7e2)
          </button>

          <button
            onClick={() => setActiveView('leads')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
              activeView === 'leads'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            Pipeline Khách B2B
          </button>

          <button
            onClick={() => setActiveView('hq_simulation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-bold ${
              activeView === 'hq_simulation'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-500/30'
                : 'text-cyan-300 hover:text-white bg-cyan-950/40 border border-cyan-800/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            Mô Phỏng Phòng Sales 3D (Clip HQ)
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse ml-0.5" />
          </button>

          <button
            onClick={() => setActiveView('accounts_config')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-bold ${
              activeView === 'accounts_config'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/30'
                : 'text-emerald-300 hover:text-white bg-emerald-950/40 border border-emerald-800/60'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-emerald-400" />
            Tài Khoản Thực &amp; Kịch Bản Sales
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </button>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY DASHBOARD: Total Active Leads | Closing Rate | Tasks Due Today */}
      <div className="border-b border-slate-800 bg-slate-950/75 px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Executive Summary Dashboard
            </span>
            <span className="text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 px-2 py-0.5 rounded-full">
              Live KPI Metrics
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="text-[11px] font-mono px-2 py-0.5 rounded-lg border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 bg-slate-900/70 transition flex items-center gap-1 shadow-sm"
              title="Xuất thẻ nhiệm vụ 5 phòng ban ảo ra file CSV"
            >
              <Download className="w-3 h-3 text-cyan-400" />
              Download CSV
            </button>

            <button
              onClick={() => setShowDetailedCharts((prev) => !prev)}
              className={`text-[11px] font-mono px-2 py-0.5 rounded-lg border transition flex items-center gap-1.5 ${
                showDetailedCharts
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              {showDetailedCharts ? 'Ẩn Biểu Đồ Recharts ▲' : 'Xem Xu Hướng 30 Ngày & Phòng Ban ▼'}
            </button>

            <button
              onClick={() => setShowSummaryDashboard((prev) => !prev)}
              className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition"
            >
              {showSummaryDashboard ? 'Thu gọn ▲' : 'Mở rộng ▼'}
            </button>
          </div>
        </div>

        {showSummaryDashboard && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* CARD 1: Total Active Leads */}
            <div className="rounded-xl bg-slate-900/80 border border-slate-800/90 p-3 flex flex-col justify-between hover:border-cyan-500/40 transition shadow-sm">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-200 block leading-tight">Total Active Leads</span>
                    <span className="text-[9px] text-slate-400">Chỉ số lead đang chăm sóc</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800/50 px-1.5 py-0.5 rounded">
                  {totalActiveLeadsCount} / {targetLeadsQuota} ({activeLeadsPercent}%)
                </span>
              </div>

              {/* Big Metric & Trend */}
              <div className="flex items-baseline justify-between mb-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black font-mono text-white">{totalActiveLeadsCount}</span>
                  <span className="text-[10px] text-slate-400">leads đang tương tác</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" /> +14.2% tuần
                </span>
              </div>

              {/* Data Visualization Bar (Segmented by Lead Stage) */}
              <div className="space-y-1.5">
                <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden flex p-0.5 gap-0.5 border border-slate-800">
                  <div
                    className="h-full bg-cyan-400 rounded-l-full transition-all duration-500 hover:brightness-125"
                    style={{ width: `${(leadsBreakdown.screening / totalActiveLeadsCount) * 100}%` }}
                    title={`Sàng lọc Zalo: ${leadsBreakdown.screening} leads`}
                  />
                  <div
                    className="h-full bg-indigo-500 transition-all duration-500 hover:brightness-125"
                    style={{ width: `${(leadsBreakdown.consulting / totalActiveLeadsCount) * 100}%` }}
                    title={`Đàm phán PRD: ${leadsBreakdown.consulting} leads`}
                  />
                  <div
                    className="h-full bg-emerald-400 rounded-r-full transition-all duration-500 hover:brightness-125"
                    style={{ width: `${(leadsBreakdown.closing / totalActiveLeadsCount) * 100}%` }}
                    title={`Chốt hợp đồng: ${leadsBreakdown.closing} leads`}
                  />
                </div>

                {/* Micro Legend */}
                <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
                    Sàng lọc: {leadsBreakdown.screening}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
                    PRD: {leadsBreakdown.consulting}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Chốt: {leadsBreakdown.closing}
                  </span>
                </div>
              </div>
            </div>

            {/* CARD 2: Closing Rate */}
            <div className="rounded-xl bg-slate-900/80 border border-slate-800/90 p-3 flex flex-col justify-between hover:border-emerald-500/40 transition shadow-sm">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                    <Target className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-200 block leading-tight">Closing Rate</span>
                    <span className="text-[9px] text-slate-400">Tỷ lệ chốt đơn B2B & Lead</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 px-1.5 py-0.5 rounded">
                  Target: {targetClosingBenchmark}% (+7.4%)
                </span>
              </div>

              {/* Big Metric & Trend */}
              <div className="flex items-baseline justify-between mb-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black font-mono text-emerald-400">{closingRatePercent}%</span>
                  <span className="text-[10px] text-slate-400">tỷ lệ chuyển đổi</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> Vượt KPI
                </span>
              </div>

              {/* Data Visualization Bar (Benchmark with Target Line) */}
              <div className="space-y-1.5">
                <div className="relative">
                  {/* Gauge Track */}
                  <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden flex p-0.5 gap-0.5 border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-l-full transition-all duration-500 hover:brightness-125"
                      style={{ width: `${closingBreakdown.won}%` }}
                      title={`Đã chốt: ${closingBreakdown.won}%`}
                    />
                    <div
                      className="h-full bg-cyan-500/70 transition-all duration-500 hover:brightness-125"
                      style={{ width: `${closingBreakdown.negotiating}%` }}
                      title={`Đang đàm phán: ${closingBreakdown.negotiating}%`}
                    />
                    <div
                      className="h-full bg-slate-700 rounded-r-full transition-all duration-500 hover:brightness-125"
                      style={{ width: `${closingBreakdown.dropped}%` }}
                      title={`Tạm hoãn: ${closingBreakdown.dropped}%`}
                    />
                  </div>

                  {/* Target Benchmark Line at 65% */}
                  <div
                    className="absolute -top-1 bottom-0 w-0.5 bg-amber-400 pointer-events-none"
                    style={{ left: `${targetClosingBenchmark}%` }}
                    title={`KPI Target: ${targetClosingBenchmark}%`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 -translate-x-[2px] -translate-y-0.5" />
                  </div>
                </div>

                {/* Micro Legend */}
                <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Chốt: {closingBreakdown.won}%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
                    Đàm phán: {closingBreakdown.negotiating}%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                    KPI: {targetClosingBenchmark}%
                  </span>
                </div>
              </div>
            </div>

            {/* CARD 3: Tasks Due Today */}
            <div className="rounded-xl bg-slate-900/80 border border-slate-800/90 p-3 flex flex-col justify-between hover:border-amber-500/40 transition shadow-sm">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                    <CalendarCheck className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-200 block leading-tight">Tasks Due Today</span>
                    <span className="text-[9px] text-slate-400">Tiến độ việc cần giao trong ngày</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-800/50 px-1.5 py-0.5 rounded">
                  SLA: 94.4% Đúng hạn
                </span>
              </div>

              {/* Big Metric & Trend */}
              <div className="flex items-baseline justify-between mb-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black font-mono text-white">{totalTasksDueToday}</span>
                  <span className="text-[10px] text-slate-400">nhiệm vụ (hạn chót hôm nay)</span>
                </div>
                <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-1.5 py-0.5 rounded">
                  {completedTasksToday}/{totalTasksDueToday} hoàn tất
                </span>
              </div>

              {/* Data Visualization Bar (Stacked Task Progress) */}
              <div className="space-y-1.5">
                <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden flex p-0.5 gap-0.5 border border-slate-800">
                  <div
                    className="h-full bg-emerald-400 rounded-l-full transition-all duration-500 hover:brightness-125"
                    style={{ width: `${taskPercentCompleted}%` }}
                    title={`Đã xong: ${completedTasksToday} (${taskPercentCompleted}%)`}
                  />
                  <div
                    className="h-full bg-cyan-400 transition-all duration-500 hover:brightness-125"
                    style={{ width: `${taskPercentRunning}%` }}
                    title={`Đang chạy: ${runningTasksToday} (${taskPercentRunning}%)`}
                  />
                  {hitlTasksToday > 0 && (
                    <div
                      className="h-full bg-amber-400 rounded-r-full animate-pulse transition-all duration-500 hover:brightness-125"
                      style={{ width: `${taskPercentHitl}%` }}
                      title={`Chờ duyệt HITL: ${hitlTasksToday} (${taskPercentHitl}%)`}
                    />
                  )}
                </div>

                {/* Micro Legend */}
                <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Đã xong: {completedTasksToday}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
                    Đang chạy: {runningTasksToday}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                    Chờ duyệt: {hitlTasksToday}
                  </span>
                </div>
              </div>
            </div>

            {/* DETAILED ACTIVITY BREAKDOWN: RECHARTS 30-DAY TREND & DEPARTMENT CONVERSION */}
            {showDetailedCharts && (
              <div className="col-span-1 md:col-span-3 mt-1 pt-3 border-t border-slate-800/80 rounded-2xl bg-slate-900/70 p-3.5 sm:p-4 border border-slate-800/90 shadow-inner">
                {/* Chart Header & Tab Switcher */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-cyan-400" />
                        Biểu Đồ Phân Tích Hoạt Động (Detailed Activity Breakdown)
                      </h4>
                      <span className="text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                        Recharts Live
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Trực quan hóa xu hướng Closing Rate 30 ngày qua và so sánh hiệu suất chuyển đổi giữa 5 phòng ban ảo
                    </p>
                  </div>

                  {/* Chart Tabs */}
                  <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium gap-1">
                    <button
                      onClick={() => setChartTab('trend30')}
                      className={`px-3 py-1 rounded-lg transition font-mono text-[11px] flex items-center gap-1.5 ${
                        chartTab === 'trend30'
                          ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-500/20'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      Xu Hướng 30 Ngày
                    </button>
                    <button
                      onClick={() => setChartTab('deptCompare')}
                      className={`px-3 py-1 rounded-lg transition font-mono text-[11px] flex items-center gap-1.5 ${
                        chartTab === 'deptCompare'
                          ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      So Sánh 5 Phòng Ban
                    </button>
                    <button
                      onClick={() => setChartTab('combined')}
                      className={`px-3 py-1 rounded-lg transition font-mono text-[11px] flex items-center gap-1.5 ${
                        chartTab === 'combined'
                          ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-500/20'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      Ma Trận Tổng Hợp
                    </button>
                  </div>
                </div>

                {/* KPI Ribbon Overview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-xs">
                  <div className="bg-slate-950/70 border border-slate-800/80 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-mono block">Tỷ lệ chốt TB 30 ngày</span>
                    <div className="text-sm font-bold font-mono text-cyan-300 mt-0.5 flex items-center gap-1">
                      68.2% <span className="text-[9px] text-emerald-400 font-normal">(+16.0% vs đầu kỳ)</span>
                    </div>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800/80 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-mono block">Phòng chuyển đổi cao nhất</span>
                    <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5 truncate">
                      Kỹ Thuật: 93.1%
                    </div>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800/80 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-mono block">Lưu lượng lead vào cao nhất</span>
                    <div className="text-sm font-bold font-mono text-blue-400 mt-0.5 truncate">
                      Kinh Doanh: 185 leads
                    </div>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800/80 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-mono block">Doanh thu chốt 30 ngày</span>
                    <div className="text-sm font-bold font-mono text-amber-300 mt-0.5">
                      6.45 Tỷ VNĐ
                    </div>
                  </div>
                </div>

                {/* TAB 1: 30-Day Closing Rate Trend AreaChart */}
                {chartTab === 'trend30' && (
                  <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold text-slate-300 font-mono flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                        Đồ thị Closing Rate 30 ngày (02/10 - 31/10) so với KPI chuẩn 65%
                      </span>
                      <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-1 bg-cyan-400 rounded inline-block" /> Closing Rate (%)
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-0.5 bg-amber-400 border-t border-dashed border-amber-400 inline-block" /> KPI Target 65%
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-64 min-h-[256px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={closingRateTrend30Days} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                          <defs>
                            <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <XAxis
                            dataKey="date"
                            stroke="#64748b"
                            tick={{ fontSize: 9, fill: '#94a3b8' }}
                            interval={2}
                          />
                          <YAxis
                            domain={[50, 80]}
                            stroke="#64748b"
                            tick={{ fontSize: 9, fill: '#94a3b8' }}
                            tickFormatter={(v) => `${v}%`}
                          />
                          <Tooltip
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                const d = payload[0].payload;
                                return (
                                  <div className="bg-slate-900/95 border border-slate-700 p-2.5 rounded-xl shadow-2xl backdrop-blur-md text-xs font-mono space-y-1">
                                    <div className="text-cyan-300 font-bold border-b border-slate-800 pb-1 flex items-center justify-between gap-4">
                                      <span>Ngày {label}</span>
                                      <span className="text-emerald-400 font-black">{d.rate}% Chốt</span>
                                    </div>
                                    <div className="text-slate-300 flex justify-between gap-3 text-[11px]">
                                      <span>Mục tiêu KPI:</span>
                                      <span className="text-amber-400 font-bold">{d.target}%</span>
                                    </div>
                                    <div className="text-slate-300 flex justify-between gap-3 text-[11px]">
                                      <span>Đơn chốt thành công:</span>
                                      <span className="text-white font-bold">{d.deals} hợp đồng</span>
                                    </div>
                                    <div className="text-slate-300 flex justify-between gap-3 text-[11px]">
                                      <span>Lưu lượng lead nhận:</span>
                                      <span className="text-blue-300 font-bold">{d.inflow} leads</span>
                                    </div>
                                    <div className="text-slate-300 flex justify-between gap-3 text-[11px]">
                                      <span>Doanh thu ngày:</span>
                                      <span className="text-purple-300 font-bold">{d.revenue} Tr VNĐ</span>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="rate"
                            stroke="#06b6d4"
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#rateGradient)"
                            name="Closing Rate (%)"
                          />
                          <Line
                            type="monotone"
                            dataKey="target"
                            stroke="#f59e0b"
                            strokeWidth={1.5}
                            strokeDasharray="4 4"
                            dot={false}
                            name="KPI Target"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* TAB 2: Department Conversion Breakdown ComposedChart */}
                {chartTab === 'deptCompare' && (
                  <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold text-slate-300 font-mono flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                        So sánh tương quan Tiếp nhận vs Chuyển đổi thành công giữa 5 phòng ban ảo
                      </span>
                      <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2 bg-blue-500 rounded inline-block" /> Inflow (Lead vào)
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2 bg-emerald-500 rounded inline-block" /> Converted (Chốt)
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-1 bg-amber-400 rounded inline-block" /> Tỷ lệ %
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-64 min-h-[256px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={deptConversionData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <XAxis
                            dataKey="deptName"
                            stroke="#64748b"
                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                          />
                          <YAxis
                            yAxisId="left"
                            stroke="#64748b"
                            tick={{ fontSize: 9, fill: '#94a3b8' }}
                            tickFormatter={(v) => `${v}`}
                          />
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            domain={[0, 100]}
                            stroke="#f59e0b"
                            tick={{ fontSize: 9, fill: '#f59e0b' }}
                            tickFormatter={(v) => `${v}%`}
                          />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const d = payload[0].payload;
                                return (
                                  <div className="bg-slate-900/95 border border-slate-700 p-2.5 rounded-xl shadow-2xl backdrop-blur-md text-xs font-mono space-y-1">
                                    <div className="text-cyan-300 font-bold border-b border-slate-800 pb-1">
                                      {d.fullDept}
                                    </div>
                                    <div className="text-slate-300 flex justify-between gap-3 text-[11px]">
                                      <span>Lưu lượng lead nhận:</span>
                                      <span className="text-blue-400 font-bold">{d.inflow} leads</span>
                                    </div>
                                    <div className="text-slate-300 flex justify-between gap-3 text-[11px]">
                                      <span>Chuyển đổi thành công:</span>
                                      <span className="text-emerald-400 font-bold">{d.converted} leads</span>
                                    </div>
                                    <div className="text-slate-300 flex justify-between gap-3 text-[11px]">
                                      <span>Tỷ lệ chuyển đổi:</span>
                                      <span className="text-amber-400 font-black">{d.conversionRate}%</span>
                                    </div>
                                    <div className="text-slate-400 text-[10px] pt-0.5">
                                      Thời gian xử lý TB: <span className="text-slate-200">{d.avgDays} ngày</span>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar
                            yAxisId="left"
                            dataKey="inflow"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                            name="Lead tiếp nhận"
                          />
                          <Bar
                            yAxisId="left"
                            dataKey="converted"
                            fill="#10b981"
                            radius={[4, 4, 0, 0]}
                            name="Lead chuyển đổi"
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="conversionRate"
                            stroke="#f59e0b"
                            strokeWidth={2.5}
                            name="Tỷ lệ chuyển đổi (%)"
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* TAB 3: Combined Funnel Table & Conversion Matrix */}
                {chartTab === 'combined' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Department Efficiency Cards */}
                    <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800 space-y-2">
                      <div className="text-[11px] font-bold text-slate-300 font-mono mb-1 flex items-center justify-between">
                        <span>MA TRẬN HIỆU QUẢ CHUYỂN ĐỔI THEO PHÒNG BAN</span>
                        <span className="text-[9px] text-slate-400">Target SLA: 90%</span>
                      </div>
                      <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                        {deptConversionData.map((dept) => (
                          <div
                            key={dept.deptKey}
                            className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs flex items-center justify-between hover:border-slate-700 transition"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: dept.color }}
                              />
                              <div>
                                <span className="font-bold text-white text-[11px] block">{dept.deptName}</span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {dept.converted} / {dept.inflow} leads · {dept.avgDays} ngày/lead
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-mono font-bold text-emerald-400 text-xs block">
                                {dept.conversionRate}%
                              </span>
                              <span className="text-[9px] text-slate-500 font-mono">
                                Drop: {dept.dropRate}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Funnel Flow Insight */}
                    <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800 flex flex-col justify-between">
                      <div>
                        <div className="text-[11px] font-bold text-slate-300 font-mono mb-2 flex items-center gap-1.5">
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                          PHÂN TÍCH PHỄU CHUYỂN ĐỔI HOẠT ĐỘNG (Activity Funnel Insights)
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                          Hệ thống AI đa tác nhân Hoppi duy trì tỷ lệ chốt đơn trung bình <strong>68.2%</strong> suốt 30 ngày qua, đạt đỉnh <strong>73.1%</strong> vào ngày 30/10. Phòng Kỹ Thuật (Bàn 5) ghi nhận tỷ lệ nghiệm thu cao nhất (<strong>93.1%</strong>) nhờ quy trình kiểm thử zero-bug tự động trước khi bàn giao.
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/50 text-[11px] font-mono text-cyan-200 space-y-1">
                        <div className="font-bold flex items-center gap-1 text-cyan-300">
                          <Sparkles className="w-3.5 h-3.5" /> Khuyến nghị vận hành AI:
                        </div>
                        <div>
                          Tăng tốc độ bóc tách PRD tại Bàn 2 từ 2.5 ngày xuống 1.5 ngày sẽ giúp nâng tỷ lệ chốt toàn phễu lên trên <strong>78.0%</strong>.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* VIEW 1: ZALO MULTI-ACCOUNT SENDER v2.1.107 (Exact reproduction of image_37cfd05b) */}
      {activeView === 'zalo' && (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#0a0f18]">
          {/* Left Sidebar: 11 Zalo Accounts */}
          <div className="w-full md:w-64 border-r border-slate-800 bg-slate-950/60 flex flex-col">
            <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200">Tài khoản Zalo</span>
                <span className="ml-1.5 text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded border border-blue-500/20">
                  {zaloAccounts.filter((a) => a.selected).length}/{zaloAccounts.length}
                </span>
              </div>
              <button
                onClick={() =>
                  selectAllAccounts(!zaloAccounts.every((a) => a.selected))
                }
                className="text-[11px] text-slate-400 hover:text-cyan-400 transition"
              >
                {zaloAccounts.every((a) => a.selected) ? 'Bỏ chọn' : 'Chọn hết'}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
              {zaloAccounts.map((acc) => (
                <div
                  key={acc.id}
                  onClick={() => toggleAccountSelection(acc.id)}
                  className={`flex items-center justify-between p-2 rounded-xl cursor-pointer border transition-all ${
                    acc.selected
                      ? 'bg-blue-950/30 border-blue-500/40 text-white shadow-sm'
                      : 'bg-slate-900/40 border-slate-800/60 text-slate-400 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={acc.selected}
                      onChange={() => toggleAccountSelection(acc.id)}
                      className="rounded border-slate-700 text-blue-500 focus:ring-0 cursor-pointer"
                    />
                    <div className="relative">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-[10px] flex items-center justify-center">
                        {acc.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(-2)}
                      </div>
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-slate-900"></span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate">{acc.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">{acc.ip}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
                    {acc.messagesSent} tin
                  </span>
                </div>
              ))}
            </div>

            <div className="p-2 border-t border-slate-800">
              <button className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-blue-400 border border-blue-500/20 rounded-xl transition">
                <Plus className="w-3.5 h-3.5" />
                Thêm tài khoản Zalo
              </button>
            </div>
          </div>

          {/* Main Working Area */}
          <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar p-4 space-y-4">
            {/* Top Sub-tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZaloSubTab('send')}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                    zaloSubTab === 'send'
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Gửi tin nhắn
                </button>
                <button
                  onClick={() => setZaloSubTab('recipients')}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                    zaloSubTab === 'recipients'
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Danh sách người nhận (2,563)
                </button>
                <button
                  onClick={() => setZaloSubTab('templates')}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                    zaloSubTab === 'templates'
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Nội dung tin nhắn (5 mẫu spin)
                </button>
                <button
                  onClick={() => setZaloSubTab('advanced')}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                    zaloSubTab === 'advanced'
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Cài đặt nâng cao
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">
                  Proxy status: <span className="text-emerald-400 font-semibold">11/11 Active</span>
                </span>
              </div>
            </div>

            {/* Template Spin Editor & Delay Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Spin Syntax Message Templates (Col 1 & 2) */}
              <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">Mẫu tin nhắn Spin Syntax</span>
                    <span className="text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-full">
                      Hạn chế tối đa khóa nick Zalo
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <button className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition">
                      <Shuffle className="w-3.5 h-3.5" /> Spin cú pháp
                    </button>
                    <button className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition">
                      <Plus className="w-3.5 h-3.5" /> Thêm mẫu
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar pr-1">
                  {templates.map((tpl, idx) => (
                    <div
                      key={tpl.id}
                      className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5 hover:border-slate-700 transition"
                    >
                      <input
                        type="checkbox"
                        checked={tpl.enabled}
                        onChange={() => {
                          setTemplates((prev) =>
                            prev.map((t) => (t.id === tpl.id ? { ...t, enabled: !t.enabled } : t))
                          );
                        }}
                        className="mt-0.5 rounded border-slate-700 text-blue-500 focus:ring-0 cursor-pointer"
                      />
                      <div className="flex-1 font-mono text-[11px] leading-relaxed select-text">
                        <span className="text-cyan-400 font-bold mr-1">#{idx + 1}</span>
                        {tpl.text}
                      </div>
                      <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100">
                        <span className="text-[10px] text-slate-400 bg-slate-900 px-1 rounded">
                          {tpl.spinCount} spin
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Send Settings & Controls (Col 3) */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-xs font-bold text-slate-200">Cài đặt gửi tin</span>
                  <div className="mt-3 space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <span>Delay giữa 2 tin:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={minDelay}
                          onChange={(e) => setMinDelay(Number(e.target.value))}
                          className="w-12 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-center text-xs"
                        />
                        <span className="text-slate-500">-</span>
                        <input
                          type="number"
                          value={maxDelay}
                          onChange={(e) => setMaxDelay(Number(e.target.value))}
                          className="w-12 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-center text-xs"
                        />
                        <span className="text-slate-400 text-[11px]">giây</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Nghỉ sau mỗi đợt:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={pauseBatch}
                          onChange={(e) => setPauseBatch(Number(e.target.value))}
                          className="w-12 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-center text-xs"
                        />
                        <span className="text-slate-400 text-[11px]">tin / nghỉ</span>
                        <input
                          type="number"
                          value={pauseDuration}
                          onChange={(e) => setPauseDuration(Number(e.target.value))}
                          className="w-12 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-center text-xs"
                        />
                        <span className="text-slate-400 text-[11px]">s</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 space-y-2">
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-[11px]">Luân phiên tài khoản</span>
                        <input
                          type="checkbox"
                          checked={rotateAccounts}
                          onChange={(e) => setRotateAccounts(e.target.checked)}
                          className="rounded border-slate-700 text-blue-500 focus:ring-0"
                        />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-[11px]">Random nội dung spin</span>
                        <input
                          type="checkbox"
                          checked={randomContent}
                          onChange={(e) => setRandomContent(e.target.checked)}
                          className="rounded border-slate-700 text-blue-500 focus:ring-0"
                        />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-[11px]">Gửi kèm ảnh / video</span>
                        <input
                          type="checkbox"
                          checked={sendMedia}
                          onChange={(e) => setSendMedia(e.target.checked)}
                          className="rounded border-slate-700 text-blue-500 focus:ring-0"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Main Action Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  {!isSending ? (
                    <button
                      onClick={() => setIsSending(true)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/30 transition active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Bắt đầu gửi
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsSending(false)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-500/30 transition active:scale-95"
                    >
                      <Pause className="w-3.5 h-3.5 fill-current" /> Tạm dừng
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsSending(false);
                      setSentCount(0);
                    }}
                    className="p-2.5 bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 border border-slate-700 rounded-xl transition"
                    title="Dừng và làm mới"
                  >
                    <Square className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Circular Progress & Metrics Display (Matching 37.3% Ring in image_37cfd05b) */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                {/* Circular Progress Gauge */}
                <div className="flex items-center gap-4 border-r border-slate-800/80 pr-4">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        className="text-slate-800"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        className="text-blue-500 transition-all duration-700"
                        strokeWidth="8"
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 - (251.2 * progressPercent) / 100}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-lg font-black text-white">{progressPercent}%</span>
                      <span className="text-[9px] text-slate-400">Tiến độ</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-400">Đang gửi tin nhắn...</div>
                    <div className="text-lg font-black text-cyan-400 mt-0.5">
                      {sentCount.toLocaleString('vi-VN')} / {totalRecipients.toLocaleString('vi-VN')}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Đã chạy: <span className="text-slate-300">42p 18s</span> · Còn lại:{' '}
                      <span className="text-slate-300">2h 28p</span>
                    </div>
                  </div>
                </div>

                {/* 3 Status Cards (736 Thành công, 98 Thất bại, 122 Bỏ qua) */}
                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">{successCount}</div>
                    <div className="text-xs text-emerald-400 font-medium">Thành công (76.9%)</div>
                  </div>
                </div>

                <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                    <X className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">{failCount}</div>
                    <div className="text-xs text-rose-400 font-medium">Thất bại (10.3%)</div>
                  </div>
                </div>

                <div className="bg-blue-950/20 border border-blue-500/30 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                    <Minus className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">{skipCount}</div>
                    <div className="text-xs text-blue-400 font-medium">Bỏ qua (12.8%)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Activity Table (Nhật ký hoạt động) */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-200">Nhật ký hoạt động (Real-time Log)</span>
                  {isSending && (
                    <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Live dispatching
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setLogs([])}
                  className="text-xs text-slate-400 hover:text-rose-400 transition"
                >
                  Xóa log
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 text-[11px]">
                    <tr>
                      <th className="py-2 px-3">Thời gian</th>
                      <th className="py-2 px-3">Tài khoản</th>
                      <th className="py-2 px-3">SĐT người nhận</th>
                      <th className="py-2 px-3">Nội dung tin nhắn</th>
                      <th className="py-2 px-3 text-right">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-2 px-3 text-slate-400 whitespace-nowrap">{log.time}</td>
                        <td className="py-2 px-3 text-white font-sans font-medium flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-[9px] flex items-center justify-center font-bold">
                            {log.accountName[0]}
                          </span>
                          <span>{log.accountName}</span>
                          <span className="text-[9px] text-slate-500 font-mono">({log.accountIp})</span>
                        </td>
                        <td className="py-2 px-3 text-cyan-400">{log.phone}</td>
                        <td className="py-2 px-3 text-slate-300 font-sans truncate max-w-xs">
                          {log.message}
                        </td>
                        <td className="py-2 px-3 text-right">
                          {log.status === 'success' && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full font-sans">
                              <Check className="w-3 h-3" /> Thành công
                            </span>
                          )}
                          {log.status === 'failed' && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-rose-400 bg-rose-950/60 border border-rose-800/40 px-2 py-0.5 rounded-full font-sans">
                              <X className="w-3 h-3" /> Thất bại
                            </span>
                          )}
                          {log.status === 'skipped' && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-blue-400 bg-blue-950/60 border border-blue-800/40 px-2 py-0.5 rounded-full font-sans">
                              <Minus className="w-3 h-3" /> Bỏ qua
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: OPENAI DOTS - LUỒNG CÔNG VIỆC (Exact reproduction of video 3ce0652e) */}
      {activeView === 'dots' && (
        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar p-5 space-y-5 bg-[#070b12]">
          {/* Top Telemetry Header */}
          <div className="border border-slate-800/80 bg-slate-950/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
                CONCEPT / SIMULATION · TIKTOK @nnthanh8931
              </div>
              <h1 className="text-xl font-black text-white tracking-wide mt-0.5">
                OPENAI DOTS · LUỒNG CÔNG VIỆC
              </h1>
              <p className="text-xs text-slate-400">
                Bản giao mục tiêu - Đọt chia việc - Thực hiện đa nhánh - Kiểm tra - Bàn duyệt
              </p>
            </div>

            {/* Metrics Pills */}
            <div className="flex items-center gap-3 font-mono text-xs">
              <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-center">
                <div className="text-[10px] text-slate-400">EXECUTION TIME</div>
                <div className="text-base font-bold text-cyan-400 mt-0.5">
                  00{dotsExecutionTime} ms
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-center">
                <div className="text-[10px] text-slate-400">ACTIVE NODES</div>
                <div className="text-base font-bold text-emerald-400 mt-0.5">3</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-center">
                <div className="text-[10px] text-slate-400">SPAWN NODES</div>
                <div className="text-base font-bold text-purple-400 mt-0.5">1</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-center">
                <div className="text-[10px] text-slate-400">SIMULATED</div>
                <div className="text-base font-bold text-blue-400 mt-0.5">
                  {dotsSimProgress}%
                </div>
              </div>

              <button
                onClick={() => setDotsRunning(!dotsRunning)}
                className="p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl shadow-lg shadow-cyan-500/20 transition"
              >
                {dotsRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Core Visual Pipeline Diagram (6-Step flow) */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            {/* Left Steps Ladder (01 - 06) */}
            <div className="border border-slate-800/80 bg-slate-950/60 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  CÁC BƯỚC / Illustrative Flow
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    { num: '01', title: 'GIAO VIỆC', desc: 'Mục tiêu hoàn thành' },
                    { num: '02', title: 'ĐIỀU PHỐI', desc: 'Lập kế hoạch' },
                    { num: '03', title: 'THỰC HIỆN', desc: 'Các nhánh song song' },
                    { num: '04', title: 'CÔNG CỤ', desc: 'Ứng dụng cho phép' },
                    { num: '05', title: 'KIỂM TRA', desc: 'Đối chiếu mục tiêu' },
                    { num: '06', title: 'BÀN DUYỆT', desc: 'Gói xuất & bước tiếp' },
                  ].map((step, idx) => (
                    <div
                      key={step.num}
                      onClick={() => setDotsActiveStep(idx + 1)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        dotsActiveStep === idx + 1
                          ? 'bg-cyan-950/40 border-cyan-500/50 text-white shadow-md shadow-cyan-500/10'
                          : 'bg-slate-900/40 border-slate-800/60 text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-400">{step.num}</span>
                        <span className="font-bold text-slate-200">{step.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 pl-6">{step.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                <div className="font-semibold text-slate-300">QUYỀN TỐI THIỂU:</div>
                <p className="mt-1 leading-relaxed text-slate-500">
                  Người được cấp phép · Đọt / Điều phối · Lệnh đúng giới hạn cấp.
                </p>
              </div>
            </div>

            {/* Right Flow DAG (Interactive Nodes & Parallel Execution) */}
            <div className="lg:col-span-3 border border-slate-800/80 bg-slate-950/60 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              {/* Header inside Canvas */}
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
                <span className="font-mono">DOT + AGENT CHUYÊN MÔN ( CÔNG CỤ )</span>
                <span className="text-emerald-400 font-mono">SIMULATED 46%</span>
              </div>

              {/* Node 1: BẠN / USER */}
              <div className="border border-cyan-500/40 bg-slate-900/90 rounded-xl p-3 shadow-lg shadow-cyan-500/5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                    BẠN / USER
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Mục tiêu: <span className="text-slate-200">Đạt chỉ tiêu doanh thu & CRM</span> · Tiến độ: Hoàn thành
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2.5 py-1 rounded-lg">
                  RUN
                </span>
              </div>

              {/* Node 2: ĐỌT / ĐIỀU PHỐI */}
              <div className="border border-blue-500/40 bg-slate-900/90 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-blue-300">ĐỌT / ĐIỀU PHỐI</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Lập kế hoạch: Phân tích nhiệm vụ · Trực tiếp gán: AI Agents đa luồng · Quy tắc quy quyền
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-lg">
                  DONE
                </span>
              </div>

              {/* Parallel Execution Level: MARKETING, NỘI DUNG, WEB & BÁO CÁO */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="border border-purple-500/40 bg-purple-950/20 rounded-xl p-3">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                    <span>MARKETING</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">
                      DONE
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Chiến lược: Tối ưu hoá chiến dịch
                  </div>
                </div>

                <div className="border border-pink-500/40 bg-pink-950/20 rounded-xl p-3">
                  <div className="flex items-center justify-between text-xs font-bold text-pink-300">
                    <span>NỘI DUNG</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">
                      DONE
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Bài viết · Hình ảnh: Đa kênh truyền thông
                  </div>
                </div>

                <div className="border border-amber-500/40 bg-amber-950/20 rounded-xl p-3">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                    <span>WEB & BÁO CÁO</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">
                      DONE
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Website tổng hợp: Theo dõi công việc
                  </div>
                </div>
              </div>

              {/* Node: CÔNG CỤ CẤP QUYỀN */}
              <div className="border border-slate-700 bg-slate-900/60 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-300">CÔNG CỤ ĐƯỢC CẤP QUYỀN</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Web / Rerank · Ứng dụng: Zalo, FB Reels · Dữ liệu CRM nội bộ
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-500">WAIT</span>
              </div>

              {/* Bottom: BÀN DUYỆT & KẾT QUẢ */}
              <div className="border border-emerald-500/40 bg-emerald-950/20 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-300">BÀN DUYỆT / KẾT QUẢ</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Gói sản phẩm: Hoàn tất · Tiếp tục: Tự động hoá tiếp
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-500">WAIT</span>
              </div>

              {/* Bottom Session Log Bar */}
              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 text-[11px] font-mono space-y-1">
                <div className="text-slate-400 font-bold mb-1">SESSION LOG (Synthetic Events):</div>
                <div className="text-slate-500">00:00 USER - Giao nhiệm vụ cho người được cấp phép.</div>
                <div className="text-cyan-400">00:26 AGENTS - Nhận việc và khởi tạo nhánh quy trình song song.</div>
                <div className="text-emerald-400">00:44 TOOLS - Thực hiện công việc đúng phạm vi cấp quyền.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: MUSE STUDIO PRO (Exact reproduction of image_a7e286c8) */}
      {activeView === 'studio' && (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#070b10]">
          {/* Studio Left Nav (Muse Studio) */}
          <div className="w-full md:w-56 border-r border-slate-800 bg-[#0d131c] flex flex-col p-3 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-black font-black flex items-center justify-center text-xs">
                M
              </div>
              <span className="text-xs font-bold text-white">Muse Studio Pro</span>
            </div>

            <div className="space-y-1 text-xs">
              <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-950/40 text-emerald-400 font-medium">
                <Film className="w-3.5 h-3.5" /> Studio
              </button>
              <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200">
                <Sliders className="w-3.5 h-3.5" /> Tư liệu
              </button>
              <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200">
                <ImageIcon className="w-3.5 h-3.5" /> Thư viện
              </button>
              <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200">
                <Bot className="w-3.5 h-3.5" /> Quản trị bot
              </button>
            </div>

            <div className="mt-auto border-t border-slate-800 pt-3 text-[11px] text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block mr-1.5"></span>
              Server Nhỏ: đang chạy
            </div>
          </div>

          {/* Prompt & Task Control */}
          <div className="w-full md:w-80 border-r border-slate-800 p-4 flex flex-col space-y-3 overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-2">
              <button className="flex-1 py-1.5 bg-slate-800 text-xs text-slate-300 font-medium rounded-lg">
                Tạo ảnh
              </button>
              <button className="flex-1 py-1.5 bg-emerald-600 text-xs text-white font-bold rounded-lg shadow">
                Tạo video
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Prompt:</label>
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                rows={6}
                className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none leading-relaxed"
              ></textarea>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Tỉ lệ:</label>
              <div className="grid grid-cols-5 gap-1.5 mt-1.5 text-xs">
                {['9:16', '16:9', '1:1', '4:3', '3:4'].map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`py-1 rounded border text-center transition ${
                      aspectRatio === ratio
                        ? 'bg-emerald-600 text-white border-emerald-500 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 transition">
                Tạo & chạy
              </button>
              <button className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-xl border border-slate-800 transition">
                Chỉ thêm vào hàng đợi
              </button>
            </div>
          </div>

          {/* Center Task List & Video Player */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Task List (500 task) */}
            <div className="w-full md:w-80 border-r border-slate-800 p-4 flex flex-col space-y-3 overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">500 task</span>
                <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  Mới nhất
                </span>
              </div>

              <div className="space-y-2">
                {studioTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white truncate max-w-[180px]">
                        {t.title}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{t.meta}</div>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full font-medium">
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Player Preview (Plays user uploaded clip) */}
            <div className="flex-1 p-5 flex flex-col items-center justify-center bg-black/40">
              <div className="w-full max-w-sm rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-black">
                <video
                  src="/assets/aistudio/1793091407464_280755491678518820_5043083094506185021_3ce0652e.mp4"
                  controls
                  autoPlay
                  loop
                  muted
                  className="w-full aspect-[9/16] object-cover"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-2">
                Video 9:16 · API Tài khoản 4 · 11:22 27/10
              </span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: B2B LEADS PIPELINE */}
      {activeView === 'leads' && (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Leads list */}
          <div className="w-full md:w-80 border-r border-slate-800 p-3 overflow-y-auto custom-scrollbar space-y-2">
            <div className="text-xs font-bold text-slate-400 mb-2 px-1">Danh sách đối tác B2B</div>
            {leads.map((l) => (
              <div
                key={l.id}
                onClick={() => handleAnalyzeSelectedLead(l)}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  selectedLead.id === l.id
                    ? 'bg-blue-950/40 border-blue-500/50 text-white shadow-lg'
                    : 'bg-slate-900/40 border-slate-800/60 text-slate-400 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-xs text-white truncate">{l.name}</div>
                  <span className="text-[10px] text-blue-400 font-mono">{l.channel}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{l.lastMessage}</div>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-bold">
                    {(l.dealValueVND / 1000000).toFixed(0)} Triệu VNĐ
                  </span>
                  <span className="text-slate-500">{l.updatedAt}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Lead Analysis & Auto Closer */}
          <div className="flex-1 p-5 overflow-y-auto custom-scrollbar flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedLead.name}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    SĐT: {selectedLead.phone} · Kênh: {selectedLead.channel}
                  </div>
                </div>
                <button
                  onClick={() => handleAnalyzeSelectedLead(selectedLead)}
                  disabled={analyzingLead}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${analyzingLead ? 'animate-spin' : ''}`} />
                  Phân tích tâm lý
                </button>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                <span className="font-semibold text-slate-400">Tin nhắn khách gửi:</span>
                <p className="mt-1 italic leading-relaxed">"{selectedLead.lastMessage}"</p>
              </div>

              {aiAnalysis && (
                <div className="mt-4 p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs space-y-2">
                  <div className="font-bold text-cyan-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Đánh giá cơ hội chốt đơn:
                  </div>
                  <div>
                    Tâm lý: <span className="text-white font-medium">{aiAnalysis.sentiment}</span>
                  </div>
                  <div>
                    Xác suất chốt:{' '}
                    <span className="text-emerald-400 font-bold">{aiAnalysis.buyingIntent}</span>
                  </div>
                </div>
              )}

              <div className="mt-4">
                <label className="text-xs font-semibold text-slate-300">
                  Câu trả lời chốt deal tự động đề xuất:
                </label>
                <textarea
                  value={draftReply}
                  onChange={(e) => setDraftReply(e.target.value)}
                  rows={4}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" /> Gửi phản hồi Zalo ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: HQ 3D SIMULATION - PHÒNG BAN & HÀNG ĐỢI NHIỆM VỤ (DEPARTMENT WORK SIMULATION) */}
      {activeView === 'hq_simulation' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#080d18] text-slate-100 space-y-5 custom-scrollbar">
          {/* 1. TOP SIMULATION CONTROL & TELEMETRY TOOLBAR */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 shadow-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${simRunning ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <h3 className="font-black text-base text-white tracking-wide flex items-center gap-2">
                  MÔ PHỎNG VẬN HÀNH PHÒNG BAN 24/7
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    VIRTUAL DESKS & QUEUES
                  </span>
                </h3>
              </div>
              <p className="text-xs text-slate-300 max-w-2xl">
                Quy trình tự hành khép kín qua 5 bàn làm việc ảo: Sàng lọc Lead &rarr; Bóc tách PRD &rarr; Phối màu UI 3D &rarr; Duyệt HITL Zero-Trust &rarr; Lập trình bàn giao.
              </p>
            </div>

            {/* Simulation Controls */}
            <div className="flex items-center flex-wrap gap-2.5">
              {/* Play / Pause Toggle */}
              <button
                onClick={() => setSimRunning(!simRunning)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-lg ${
                  simRunning
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30'
                    : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/20'
                }`}
              >
                {simRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {simRunning ? 'Tạm Dừng Mô Phỏng' : 'Chạy Mô Phỏng'}
              </button>

              {/* Speed Multiplier */}
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs font-mono">
                {([1, 2, 4] as const).map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setSimSpeed(spd)}
                    className={`px-2 py-1 rounded-lg transition ${
                      simSpeed === spd
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              {/* Auto-Approve HITL Switch */}
              <button
                onClick={() => setAutoApproveHitl(!autoApproveHitl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition flex items-center gap-1.5 ${
                  autoApproveHitl
                    ? 'bg-purple-950/60 border-purple-500 text-purple-300 shadow-md shadow-purple-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
                }`}
                title="Tự động phê duyệt các nhiệm vụ tại Bàn 4 mà không cần click tay"
              >
                <Zap className="w-3.5 h-3.5" />
                Ủy Quyền Auto-HITL: {autoApproveHitl ? 'BẬT' : 'TẮT'}
              </button>

              {/* Add New Lead Button */}
              <button
                onClick={handleAddNewSimTask}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                + Nhận Lead Mới
              </button>

              {/* Download CSV Button */}
              <button
                onClick={() => handleDownloadCSV(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-200 hover:text-white text-xs font-mono font-semibold transition flex items-center gap-1.5 shadow-md hover:shadow-cyan-500/20"
                title="Xuất dữ liệu toàn bộ thẻ nhiệm vụ 5 phòng ban ảo ra file CSV"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                Download CSV ({simTasks.length})
              </button>

              {/* Archive View Button */}
              <button
                onClick={() => setIsArchiveModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/50 hover:border-amber-400 text-amber-300 hover:text-amber-200 text-xs font-mono font-semibold transition flex items-center gap-1.5 shadow-md shadow-amber-500/10 active:scale-95 cursor-pointer"
                title="Mở Kho Lưu Trữ (Archived Tasks View) riêng biệt để xem lịch sử"
              >
                <Archive className="w-3.5 h-3.5 text-amber-400" />
                Kho Lưu Trữ ({simTasks.filter((t) => t.archived).length})
              </button>

              {/* 1-Click HITL Master Approve if any waiting */}
              {simTasks.some((t) => !t.archived && t.status === 'waiting_hitl') && (
                <button
                  onClick={() => {
                    const waitingTask = simTasks.find((t) => !t.archived && t.status === 'waiting_hitl');
                    if (waitingTask) handleApproveSimTask(waitingTask.id);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-black text-xs font-black transition flex items-center gap-1.5 shadow-lg shadow-amber-500/30 animate-bounce"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-black" />
                  Duyệt 1-Click HITL (Nguyễn Thanh Hải)
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar (Reflecting uncluttered active workspace) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Doanh Thu Đang Chạy</span>
                <div className="text-sm sm:text-base font-bold font-mono text-emerald-400 mt-0.5">
                  {(simTasks.filter((t) => !t.archived).reduce((acc, t) => acc + t.valueVND, 0)).toLocaleString('vi-VN')} VNĐ
                </div>
              </div>
              <DollarSign className="w-5 h-5 text-emerald-400 opacity-60" />
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Đang Xử Lý Song Song</span>
                <div className="text-sm sm:text-base font-bold font-mono text-cyan-400 mt-0.5">
                  {simTasks.filter((t) => !t.archived && t.status === 'running').length} Nhiệm vụ
                </div>
              </div>
              <Activity className="w-5 h-5 text-cyan-400 opacity-60" />
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Chờ Duyệt HITL (Bàn 4)</span>
                <div className="text-sm sm:text-base font-bold font-mono text-amber-400 mt-0.5">
                  {simTasks.filter((t) => !t.archived && t.status === 'waiting_hitl').length} Chờ Phê Duyệt
                </div>
              </div>
              <ShieldCheck className="w-5 h-5 text-amber-400 opacity-60" />
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Bàn Giao Chờ Lưu Trữ</span>
                <div className="text-sm sm:text-base font-bold font-mono text-purple-400 mt-0.5">
                  {simTasks.filter((t) => !t.archived && t.status === 'completed').length} Hoàn tất
                </div>
              </div>
              <CheckCheck className="w-5 h-5 text-purple-400 opacity-60" />
            </div>

            <div
              onClick={() => setIsArchiveModalOpen(true)}
              className="p-3 rounded-xl bg-amber-950/30 hover:bg-amber-950/50 border border-amber-500/40 cursor-pointer transition flex items-center justify-between group/arch"
              title="Nhấn để mở Kho Lưu Trữ (Archived Tasks View)"
            >
              <div>
                <span className="text-[10px] text-amber-300 uppercase font-mono flex items-center gap-1">
                  <Archive className="w-3 h-3 text-amber-400" />
                  Kho Lưu Trữ Lịch Sử
                </span>
                <div className="text-sm sm:text-base font-bold font-mono text-amber-300 mt-0.5 group-hover/arch:text-amber-200">
                  {simTasks.filter((t) => t.archived).length} Dự án Lưu
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-400 group-hover/arch:translate-x-0.5 transition" />
            </div>
          </div>

          {/* 2. THE 5 VIRTUAL DESKS HORIZONTAL PIPELINE */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  Mô Phỏng 5 Bàn Làm Việc Ảo (Virtual Work Desks Pipeline)
                </h4>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 px-2 py-0.5 rounded-full">
                  <GripVertical className="w-3 h-3 text-cyan-400" /> Kéo-thả thẻ nhiệm vụ để điều chuyển bàn / ưu tiên
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Tốc độ: {simSpeed}x · {simRunning ? 'Tự Động Luân Chuyển' : 'Đang Tạm Dừng'}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3.5">
              {virtualDesks.map((desk, idx) => {
                const DeskIcon = desk.icon;
                const tasksAtDesk = simTasks.filter((t) => !t.archived && t.currentDeskId === desk.id);
                const isHitlDesk = desk.id === 'desk-4';
                const hasWaitingHitl = tasksAtDesk.some((t) => t.status === 'waiting_hitl');
                const isDragTarget = dragOverDeskId === desk.id;

                return (
                  <div
                    key={desk.id}
                    onDragOver={(e) => handleDeskDragOver(e, desk.id)}
                    onDragLeave={(e) => handleDeskDragLeave(e, desk.id)}
                    onDrop={(e) => handleTaskDropOnDesk(e, desk.id)}
                    className={`rounded-2xl p-4 flex flex-col justify-between transition-all relative overflow-hidden bg-slate-900/80 border ${
                      isDragTarget
                        ? 'border-cyan-400 bg-cyan-950/70 ring-2 ring-cyan-400/60 scale-[1.02] shadow-2xl shadow-cyan-500/30'
                        : hasWaitingHitl
                        ? 'border-amber-400 shadow-xl shadow-amber-500/20'
                        : isHitlDesk
                        ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                        : `${desk.accentBorder} shadow-md`
                    }`}
                  >
                    {/* Glowing halo indicator banner */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        {/* Avatar with Halo Ring */}
                        <div className="relative flex items-center justify-center">
                          {/* Floating Halo Ring above head */}
                          <div
                            className={`absolute -top-1.5 w-6 h-2 rounded-full border-2 ${desk.haloRingBorder} animate-pulse pointer-events-none`}
                          />
                          <div
                            className={`w-8 h-8 rounded-xl ${desk.haloBg} flex items-center justify-center border border-white/10`}
                          >
                            <DeskIcon className={`w-4 h-4 ${desk.haloColor}`} />
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block">{desk.deskTitle}</span>
                          <span className="text-xs font-black text-white">{desk.agentName}</span>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${desk.haloBg} ${desk.haloColor} border border-white/10`}
                      >
                        {desk.haloName.replace('Vòng Sáng ', '')}
                      </span>
                    </div>

                    {/* Department Title */}
                    <div className="text-[11px] font-semibold text-slate-300 mb-2">
                      {desk.deptName}
                    </div>

                    {/* Monitor Screen Preview (Terminal Style) */}
                    <div className="bg-slate-950/90 rounded-xl p-2.5 border border-slate-800 text-[10px] font-mono mb-3 space-y-1">
                      <div className="flex items-center justify-between text-slate-500 text-[9px]">
                        <span>MONITOR #{desk.id}</span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                          LIVE
                        </span>
                      </div>
                      <div className="text-slate-300 font-medium truncate" title={desk.monitorPreview}>
                        &gt; {desk.monitorPreview}
                      </div>
                      <div className="text-slate-500 truncate text-[9px]">
                        Hoạt động: {desk.currentActivity}
                      </div>
                    </div>

                    {/* Active Drag Over Indicator */}
                    {isDragTarget && (
                      <div className="mb-2 py-1.5 px-2 rounded-xl bg-cyan-500/25 border-2 border-cyan-400 border-dashed text-center text-[10px] font-bold text-cyan-200 animate-pulse flex items-center justify-center gap-1 shadow-inner">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                        THẢ ĐỂ CHUYỂN BÀN NÀY
                      </div>
                    )}

                    {/* Tasks Stationed at This Desk */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>HÀNG ĐỢI TẠI BÀN</span>
                        <span className="font-bold text-white bg-slate-800 px-1.5 py-0.2 rounded">
                          {tasksAtDesk.length} việc
                        </span>
                      </div>

                      {tasksAtDesk.length === 0 ? (
                        <div className="p-3 rounded-xl border border-dashed border-slate-800 text-center text-[10px] text-slate-500">
                          Đang sẵn sàng tiếp nhận luồng tiếp theo
                        </div>
                      ) : (
                        tasksAtDesk.map((t) => {
                          const priorityCfg = getPriorityBadgeConfig(t.priority);
                          return (
                            <div
                              key={t.id}
                              draggable={true}
                              onDragStart={(e) => handleTaskDragStart(e, t.id, desk.id)}
                              onDragEnd={handleTaskDragEnd}
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDragOverTaskId(t.id);
                              }}
                              onDrop={(e) => handleTaskDropOnTask(e, t.id, desk.id)}
                              onClick={() => setSelectedSimTaskId(t.id)}
                              className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${priorityCfg.borderLeft} ${
                                draggedTaskId === t.id
                                  ? 'opacity-40 border-cyan-400/60 scale-95 ring-1 ring-cyan-400'
                                  : dragOverTaskId === t.id && draggedTaskId !== t.id
                                  ? 'border-t-2 border-t-amber-400 bg-amber-950/20'
                                  : selectedSimTaskId === t.id
                                  ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/10'
                                  : `bg-slate-950/60 border-slate-800/80 hover:border-slate-700 ${priorityCfg.shadow}`
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-1.5 truncate max-w-[110px]">
                                  <span title="Kéo thả để điều chuyển bàn hoặc ưu tiên hàng đợi" className="cursor-grab active:cursor-grabbing shrink-0">
                                    <GripVertical className="w-3.5 h-3.5 text-slate-500 hover:text-cyan-400" />
                                  </span>
                                  <span className="font-bold text-white text-[11px] truncate">
                                    {t.clientName}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  {/* Visual Priority Badge (High, Medium, Low) */}
                                  <span
                                    className={`text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded border flex items-center gap-1 ${priorityCfg.badgeBg}`}
                                    title={`Độ khẩn cấp: ${priorityCfg.label}`}
                                  >
                                    <span className={`w-1.5 h-1.5 rounded-full ${priorityCfg.dotBg} inline-block`} />
                                    {priorityCfg.label}
                                  </span>

                                  {/* Status / Progress Badge */}
                                  <span
                                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                                      t.status === 'waiting_hitl'
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                                        : t.status === 'completed'
                                        ? 'bg-purple-500/20 text-purple-300'
                                        : 'bg-cyan-500/20 text-cyan-300'
                                    }`}
                                  >
                                    {t.status === 'waiting_hitl' ? 'CHỜ DUYỆT' : `${t.progressPercent}%`}
                                  </span>
                                </div>
                              </div>

                              <div className="text-[10px] text-slate-400 truncate mb-1.5">
                                {t.projectTitle}
                              </div>

                              {/* Progress bar */}
                              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-300 ${
                                    t.status === 'waiting_hitl'
                                      ? 'bg-amber-400'
                                      : t.status === 'completed'
                                      ? 'bg-purple-400'
                                      : 'bg-cyan-400'
                                  }`}
                                  style={{ width: `${t.progressPercent}%` }}
                                />
                              </div>

                              {/* Task Notes Badge & Expandable Section */}
                              <div className="mt-2 pt-1.5 border-t border-slate-800/80">
                                <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                                  <span className="flex items-center gap-1 text-cyan-300">
                                    <FileText className="w-3 h-3 text-cyan-400" />
                                    <span>Ghi chú ({t.notes?.length || 0})</span>
                                  </span>
                                  <span className="text-[8.5px] text-slate-500 hover:text-cyan-300">
                                    {selectedSimTaskId === t.id ? 'Thu gọn ▲' : 'Bấm xem / thêm ▼'}
                                  </span>
                                </div>

                                {selectedSimTaskId === t.id && (
                                  <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="mt-1.5 space-y-1.5 animate-in fade-in duration-150"
                                  >
                                    {/* Existing notes */}
                                    {t.notes && t.notes.length > 0 ? (
                                      <div className="space-y-1 max-h-24 overflow-y-auto custom-scrollbar bg-slate-950/80 p-1.5 rounded-lg border border-slate-800/80 text-[9.5px]">
                                        {t.notes.map((note, nIdx) => (
                                          <div key={nIdx} className="text-slate-300 leading-tight border-b border-slate-900 pb-0.5 last:border-b-0">
                                            {note}
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="text-slate-500 italic text-[9px]">Chưa có ghi chú nào.</div>
                                    )}

                                    {/* Quick add note form */}
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="text"
                                        value={taskNotesInput[t.id] || ''}
                                        onChange={(e) => setTaskNotesInput((prev) => ({ ...prev, [t.id]: e.target.value }))}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddCustomNote(t.id);
                                          }
                                        }}
                                        placeholder="Gõ bình luận / ghi chú..."
                                        className="flex-1 px-2 py-1 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-lg text-[9.5px] text-white focus:outline-none"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleAddCustomNote(t.id)}
                                        className="px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold text-[9px] transition shrink-0 cursor-pointer shadow-sm"
                                      >
                                        Lưu
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* HITL Quick Approve Button at Desk 4 */}
                              {isHitlDesk && t.status === 'waiting_hitl' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApproveSimTask(t.id);
                                  }}
                                  className="w-full mt-2 py-1 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center gap-1 shadow-md shadow-emerald-500/30 transition"
                                >
                                  <CheckCheck className="w-3 h-3" />
                                  Phê Duyệt Chuyển Kỹ Thuật
                                </button>
                              )}

                              {/* Archive Button for Completed Tasks (Moves to separate view, keeps desk uncluttered) */}
                              {t.status === 'completed' && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleArchiveTask(t.id);
                                  }}
                                  className="w-full mt-2 py-1.5 px-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 hover:border-amber-300 font-bold text-[10px] flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                                  title="Chuyển nhiệm vụ hoàn tất này vào Kho Lưu Trữ riêng biệt để giải phóng bàn làm việc"
                                >
                                  <Archive className="w-3.5 h-3.5 text-amber-400" />
                                  Lưu Trữ (Archive)
                                </button>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Footer Throughput */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Năng suất hôm nay:</span>
                      <span className="font-mono font-bold text-white">
                        {desk.throughputToday + tasksAtDesk.filter((t) => t.status === 'completed').length} xong
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. ACTIVE TASK QUEUE TABLE & INSPECTION DRAWER */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Task Queue List (2 Cols) */}
            <div className="lg:col-span-2 rounded-2xl bg-slate-900/70 border border-slate-800 p-4 sm:p-5 flex flex-col space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Workflow className="w-4 h-4 text-cyan-400" />
                    Hàng Đợi Nhiệm Vụ Đang Chạy Thực Tế (Simulated Active Task Queues)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Bấm vào từng nhiệm vụ để xem chi tiết bóc tách luồng và vị trí bàn làm việc
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium flex-wrap gap-1">
                  {(
                    [
                      { id: 'all', label: `Tất cả (${simTasks.filter((t) => !t.archived).length})` },
                      {
                        id: 'running',
                        label: `Đang chạy (${simTasks.filter((t) => !t.archived && t.status === 'running').length})`,
                      },
                      {
                        id: 'waiting_hitl',
                        label: `Chờ HITL (${simTasks.filter((t) => !t.archived && t.status === 'waiting_hitl').length})`,
                      },
                      {
                        id: 'completed',
                        label: `Bàn giao (${simTasks.filter((t) => !t.archived && t.status === 'completed').length})`,
                      },
                      {
                        id: 'archived',
                        label: `Kho Lưu Trữ (${simTasks.filter((t) => t.archived).length})`,
                      },
                    ] as const
                  ).map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSimQueueFilter(f.id)}
                      className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1.5 ${
                        simQueueFilter === f.id
                          ? f.id === 'archived'
                            ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-500/25'
                            : 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-500/20'
                          : f.id === 'archived'
                          ? 'text-amber-400 hover:text-amber-200 hover:bg-amber-950/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {f.id === 'archived' && <Archive className="w-3 h-3 text-amber-300" />}
                      {f.label}
                    </button>
                  ))}

                  <button
                    onClick={() => handleDownloadCSV(false)}
                    className="ml-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white font-mono font-medium transition flex items-center gap-1 shadow-sm"
                    title="Xuất bảng dữ liệu nhiệm vụ ra file CSV"
                  >
                    <Download className="w-3 h-3 text-cyan-400" />
                    CSV
                  </button>
                </div>
              </div>

              {/* Task Table with Responsive Horizontal Scrollbar and Improved Layout */}
              <div className="relative rounded-xl border border-slate-800/90 bg-slate-950/70 shadow-lg overflow-hidden">
                {/* Mobile & Small Screen Responsive Scroll Cue */}
                <div className="sm:hidden flex items-center justify-between px-3 py-1.5 text-[10px] font-mono text-cyan-300 bg-cyan-950/50 border-b border-cyan-800/40">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span>Vuốt ngang xem đủ 4 cột (Client, Value, Status, Due Date)</span>
                  </span>
                  <span className="text-slate-400 font-normal">↔ Cuộn</span>
                </div>

                {/* Horizontal Scroll Area with custom styled cyber scrollbar */}
                <div className="horizontal-table-scrollbar p-0.5 max-h-[480px] overflow-y-auto">
                  <table className="w-full min-w-[760px] text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-slate-950/95 backdrop-blur-md z-10 border-b border-slate-800">
                      <tr className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                        <th className="py-3 px-3.5 min-w-[210px]">Khách Hàng (Client)</th>
                        <th className="py-3 px-3.5 min-w-[130px]">Giá Trị (Value)</th>
                        <th className="py-3 px-3.5 min-w-[190px]">Trạng Thái (Status)</th>
                        <th className="py-3 px-3.5 min-w-[130px]">Hạn Chót (Due Date)</th>
                        <th className="py-3 px-3.5 text-right min-w-[100px]">Hành Động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {simTasks
                        .filter((t) => {
                          if (simQueueFilter === 'archived') return !!t.archived;
                          if (t.archived) return false;
                          if (simQueueFilter === 'all') return true;
                          return t.status === simQueueFilter;
                        })
                        .map((task) => {
                          const currentDesk = virtualDesks.find((d) => d.id === task.currentDeskId);
                          const isSelected = selectedSimTaskId === task.id;
                          const priorityCfg = getPriorityBadgeConfig(task.priority);
                          const dueDateVal = task.dueDate || 'Hôm nay 18:00';
                          const isUrgentDue = dueDateVal.includes('Khẩn') || dueDateVal.includes('15:30');
                          const isTodayDue = dueDateVal.includes('Hôm nay');

                          return (
                            <tr
                              key={task.id}
                              onClick={() => setSelectedSimTaskId(task.id)}
                              className={`cursor-pointer transition group/row ${
                                isSelected
                                  ? 'bg-cyan-950/40 text-white font-medium border-l-2 border-l-cyan-400'
                                  : 'hover:bg-slate-800/40 text-slate-300'
                              }`}
                            >
                              {/* 1. CLIENT COLUMN */}
                              <td className="py-3 px-3.5">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-mono text-cyan-400 font-bold text-[11px] bg-cyan-950/70 border border-cyan-800/50 px-1.5 py-0.5 rounded">
                                    {task.id}
                                  </span>
                                  <span
                                    className={`text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded border flex items-center gap-1 ${priorityCfg.badgeBg}`}
                                    title={`Độ khẩn cấp: ${priorityCfg.label}`}
                                  >
                                    <span className={`w-1.5 h-1.5 rounded-full ${priorityCfg.dotBg} inline-block`} />
                                    {priorityCfg.label}
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-mono">
                                    {task.startedAt}
                                  </span>
                                </div>
                                <div className="text-white font-semibold text-xs group-hover/row:text-cyan-300 transition">
                                  {task.clientName}
                                </div>
                                <div className="text-[11px] text-slate-400 truncate max-w-[210px] mt-0.5" title={task.projectTitle}>
                                  {task.projectTitle}
                                </div>
                              </td>

                              {/* 2. VALUE COLUMN */}
                              <td className="py-3 px-3.5 whitespace-nowrap">
                                <div className="font-mono font-bold text-emerald-400 text-xs">
                                  {task.valueVND.toLocaleString('vi-VN')} đ
                                </div>
                                <div className="mt-0.5">
                                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                                    task.valueVND >= 100000000
                                      ? 'bg-purple-950/60 text-purple-300 border-purple-800/50'
                                      : task.valueVND >= 50000000
                                      ? 'bg-blue-950/60 text-blue-300 border-blue-800/50'
                                      : 'bg-slate-900 text-slate-400 border-slate-800'
                                  }`}>
                                    {task.valueVND >= 100000000 ? 'HĐ VIP' : task.valueVND >= 50000000 ? 'HĐ Lớn' : 'Tiêu chuẩn'}
                                  </span>
                                </div>
                              </td>

                              {/* 3. STATUS & DESK COLUMN */}
                              <td className="py-3 px-3.5 min-w-[190px]">
                                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                  <span
                                    className={`inline-flex items-center gap-1 text-[10.5px] px-2 py-0.5 rounded-full font-medium ${
                                      currentDesk?.haloBg || 'bg-slate-800'
                                    } ${currentDesk?.haloColor || 'text-slate-300'} border border-white/10`}
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                    {currentDesk?.deskTitle.split(':')[0] || task.currentDeskId}
                                  </span>

                                  <span
                                    className={`text-[9.5px] font-mono px-1.5 py-0.2 rounded border font-semibold ${
                                      task.status === 'waiting_hitl'
                                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                                        : task.status === 'completed'
                                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                        : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                    }`}
                                  >
                                    {task.status === 'waiting_hitl' ? 'Chờ Duyệt HITL' : task.status === 'completed' ? 'Đã Xong' : 'Đang Chạy'}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between text-[10px] font-mono mb-1 text-slate-400">
                                  <span className="truncate max-w-[130px]">{task.stageLabel}</span>
                                  <span className="font-bold text-cyan-400">{task.progressPercent}%</span>
                                </div>

                                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full transition-all duration-300 ${
                                      task.status === 'waiting_hitl'
                                        ? 'bg-amber-400'
                                        : task.status === 'completed'
                                        ? 'bg-purple-400'
                                        : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                                    }`}
                                    style={{ width: `${task.progressPercent}%` }}
                                  />
                                </div>
                              </td>

                              {/* 4. DUE DATE COLUMN */}
                              <td className="py-3 px-3.5 whitespace-nowrap">
                                <div className="flex items-center gap-1.5">
                                  <CalendarCheck className={`w-3.5 h-3.5 shrink-0 ${
                                    isUrgentDue ? 'text-rose-400 animate-pulse' : isTodayDue ? 'text-amber-400' : 'text-slate-400'
                                  }`} />
                                  <span className={`font-mono text-xs font-semibold ${
                                    isUrgentDue ? 'text-rose-300 font-bold' : isTodayDue ? 'text-amber-300' : 'text-slate-300'
                                  }`}>
                                    {dueDateVal}
                                  </span>
                                </div>
                                <div className="mt-1">
                                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border inline-flex items-center gap-1 ${
                                    isUrgentDue
                                      ? 'bg-rose-950/60 text-rose-300 border-rose-800/60'
                                      : isTodayDue
                                      ? 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                                      : 'bg-slate-900 text-slate-400 border-slate-800'
                                  }`}>
                                    <Clock className="w-2.5 h-2.5" />
                                    {isUrgentDue ? 'Gấp SLA' : isTodayDue ? 'Trong ngày' : 'Theo lịch'}
                                  </span>
                                </div>
                              </td>

                              {/* 5. ACTIONS COLUMN */}
                              <td className="py-3 px-3.5 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  {task.archived ? (
                                    <>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRestoreTask(task.id);
                                        }}
                                        className="px-2 py-1 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-[10px] font-semibold transition inline-flex items-center gap-1 cursor-pointer"
                                        title="Khôi phục về bàn làm việc hoạt động"
                                      >
                                        <RotateCcw className="w-3 h-3 text-cyan-400" /> Khôi phục
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteTaskPermanently(task.id);
                                        }}
                                        className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 rounded-lg text-[10px] transition border border-rose-800/60"
                                        title="Xoá vĩnh viễn khỏi kho"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </>
                                  ) : task.status === 'waiting_hitl' ? (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleApproveSimTask(task.id);
                                      }}
                                      className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-lg text-[10px] shadow-lg shadow-amber-500/20 transition inline-flex items-center gap-1 cursor-pointer active:scale-95"
                                    >
                                      <ShieldCheck className="w-3 h-3" /> Duyệt HITL
                                    </button>
                                  ) : (
                                    <>
                                      {task.status === 'completed' && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleArchiveTask(task.id);
                                          }}
                                          className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-[10px] font-semibold transition inline-flex items-center gap-1 cursor-pointer active:scale-95"
                                          title="Lưu trữ nhiệm vụ hoàn tất vào kho lịch sử"
                                        >
                                          <Archive className="w-3 h-3 text-amber-400" /> Lưu Trữ
                                        </button>
                                      )}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedSimTaskId(task.id);
                                        }}
                                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[10px] transition inline-flex items-center gap-1 border border-slate-700 hover:border-cyan-500/40 cursor-pointer"
                                      >
                                        <Eye className="w-3 h-3" /> Chi tiết
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Task Detail & Real-Time Inspector (1 Col) */}
            {(() => {
              const selectedTask = simTasks.find((t) => t.id === selectedSimTaskId) || simTasks[0];
              const curDesk = virtualDesks.find((d) => d.id === selectedTask?.currentDeskId);

              return (
                <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 sm:p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400 font-bold block">
                          CHI TIẾT NHIỆM VỤ ĐANG CHỌN
                        </span>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-white">{selectedTask?.id}</h4>
                          {selectedTask && (
                            <span
                              className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${getPriorityBadgeConfig(selectedTask.priority).badgeBg}`}
                              title={`Độ ưu tiên: ${getPriorityBadgeConfig(selectedTask.priority).label}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${getPriorityBadgeConfig(selectedTask.priority).dotBg} inline-block`} />
                              Priority: {getPriorityBadgeConfig(selectedTask.priority).label}
                            </span>
                          )}
                        </div>
                      </div>
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                          selectedTask?.status === 'waiting_hitl'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : selectedTask?.status === 'completed'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        }`}
                      >
                        {selectedTask?.status === 'waiting_hitl'
                          ? 'CHỜ DUYỆT HITL'
                          : selectedTask?.status === 'completed'
                          ? 'ĐÃ BÀN GIAO'
                          : 'ĐANG XỬ LÝ'}
                      </span>
                    </div>

                    {/* Metadata Card */}
                    <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400">Khách hàng &amp; Dự án:</span>
                        <div className="font-bold text-white">{selectedTask?.clientName}</div>
                        <div className="text-slate-300 text-[11px] mt-0.5">{selectedTask?.projectTitle}</div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                        <span className="text-[10px] text-slate-400">Giá trị hợp đồng:</span>
                        <span className="font-mono font-bold text-emerald-400">
                          {selectedTask?.valueVND.toLocaleString('vi-VN')} VNĐ
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400">Hạn chót (Due Date):</span>
                        <span className="font-mono font-semibold text-amber-300 text-[11px] flex items-center gap-1">
                          <CalendarCheck className="w-3 h-3 text-amber-400" />
                          {selectedTask?.dueDate || 'Hôm nay 18:00'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400">Vị trí trực chiến:</span>
                        <span className={`font-semibold text-[11px] ${curDesk?.haloColor}`}>
                          {curDesk?.deskTitle}
                        </span>
                      </div>
                    </div>

                    {/* 5-Step Pipeline Stepper */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        TIẾN TRÌNH 5 BƯỚC KHÉP KÍN:
                      </span>
                      <div className="space-y-1.5 text-[11px]">
                        {[
                          { id: 'desk-1', label: '1. Tiếp Nhận Lead & Sàng Lọc', agent: 'AI Sales Lead' },
                          { id: 'desk-2', label: '2. Bóc Tách PRD & Báo Giá', agent: 'AI Product Manager' },
                          { id: 'desk-3', label: '3. Phối Màu & Bản Mẫu UI 3D', agent: 'AI Creative Lead' },
                          { id: 'desk-4', label: '4. Phê Duyệt HITL Zero-Trust', agent: 'Nguyễn Thanh Hải' },
                          { id: 'desk-5', label: '5. Lập Trình & Bàn Giao Cloud', agent: 'AI Senior Architect' },
                        ].map((step, sIdx) => {
                          const deskIdx = parseInt(step.id.split('-')[1]);
                          const currentDeskIdx = parseInt(selectedTask?.currentDeskId.split('-')[1] || '1');
                          const isDone = deskIdx < currentDeskIdx || selectedTask?.status === 'completed';
                          const isCurrent = deskIdx === currentDeskIdx && selectedTask?.status !== 'completed';

                          return (
                            <div
                              key={step.id}
                              className={`p-2 rounded-xl flex items-center justify-between border ${
                                isCurrent
                                  ? 'bg-cyan-950/40 border-cyan-500 text-white font-bold'
                                  : isDone
                                  ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                                  : 'bg-slate-950/40 border-slate-900 text-slate-500'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                                    isCurrent
                                      ? 'bg-cyan-500 text-black'
                                      : isDone
                                      ? 'bg-emerald-500 text-black'
                                      : 'bg-slate-800 text-slate-400'
                                  }`}
                                >
                                  {isDone ? '✓' : sIdx + 1}
                                </span>
                                <span>{step.label}</span>
                              </div>
                              <span className="text-[9px] font-mono opacity-80">{step.agent}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Live Event Log */}
                    <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 text-[10px] font-mono space-y-1">
                      <div className="text-slate-400 font-bold mb-1">NHẬT KÝ VẬN HÀNH:</div>
                      <div className="text-slate-300 leading-relaxed">&gt; {selectedTask?.log}</div>
                    </div>

                    {/* Notes & Comments Section in Inspector Drawer */}
                    {selectedTask && (
                      <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200 flex items-center gap-1.5 text-[11px]">
                            <FileText className="w-3.5 h-3.5 text-cyan-400" />
                            Ghi Chú &amp; Bình Luận ({selectedTask.notes?.length || 0}):
                          </span>
                          <span className="text-[10px] font-mono text-cyan-400">LocalStorage Synced</span>
                        </div>

                        {selectedTask.notes && selectedTask.notes.length > 0 ? (
                          <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar p-1">
                            {selectedTask.notes.map((note, idx) => (
                              <div
                                key={idx}
                                className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-slate-300 text-[11px] leading-relaxed"
                              >
                                {note}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-slate-500 italic text-[11px] py-1">
                            Chưa có ghi chú nào cho nhiệm vụ này.
                          </div>
                        )}

                        {/* Add note input */}
                        <div className="flex items-center gap-2 pt-1 border-t border-slate-900">
                          <input
                            type="text"
                            value={taskNotesInput[selectedTask.id] || ''}
                            onChange={(e) =>
                              setTaskNotesInput((prev) => ({
                                ...prev,
                                [selectedTask.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCustomNote(selectedTask.id);
                              }
                            }}
                            placeholder="Nhập ghi chú cho nhiệm vụ này..."
                            className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 focus:border-cyan-400 text-xs text-white placeholder-slate-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddCustomNote(selectedTask.id)}
                            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition shrink-0 cursor-pointer shadow-sm"
                          >
                            Thêm
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Inspector Action Buttons */}
                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    {selectedTask?.archived ? (
                      <button
                        onClick={() => handleRestoreTask(selectedTask.id)}
                        className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4 text-cyan-200" />
                        Khôi Phục Về Bàn Làm Việc (Restore)
                      </button>
                    ) : selectedTask?.status === 'waiting_hitl' ? (
                      <button
                        onClick={() => handleApproveSimTask(selectedTask.id)}
                        className="w-full py-2 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-black font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-black" />
                        Phê Duyệt Ngay (Master Nguyễn Thanh Hải)
                      </button>
                    ) : selectedTask?.status === 'completed' ? (
                      <button
                        onClick={() => handleArchiveTask(selectedTask.id)}
                        className="w-full py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 hover:border-amber-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer active:scale-95"
                      >
                        <Archive className="w-4 h-4 text-amber-400" />
                        Lưu Trữ Nhiệm Vụ (Archive Task)
                      </button>
                    ) : null}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleAddNewSimTask}
                        className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> Thêm Việc
                      </button>
                      <button
                        onClick={() => {
                          if (selectedTask) {
                            handleDeleteTaskPermanently(selectedTask.id);
                          }
                        }}
                        className="py-1.5 px-3 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800 text-rose-300 rounded-xl text-xs transition"
                        title="Xoá việc"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Floating Drag & Drop Toast Notice */}
          {dragNotice && (
            <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900/95 border-2 border-cyan-400 text-cyan-100 shadow-2xl shadow-cyan-500/40 text-xs font-semibold flex items-center gap-2.5 backdrop-blur-md animate-bounce">
              <span className="text-base">🚀</span>
              <span>{dragNotice}</span>
            </div>
          )}
        </div>
      )}

      {/* SEPARATE VIEW: ARCHIVED TASKS MODAL (KHO LƯU TRỮ LỊCH SỬ) */}
      {isArchiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[88vh] bg-slate-950 border border-amber-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-800 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Archive className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white uppercase tracking-wider">
                      Kho Lưu Trữ Nhiệm Vụ (Archived Tasks View)
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                      {simTasks.filter((t) => t.archived).length} Dự án
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Bảo toàn hồ sơ lịch sử, hợp đồng và ghi chú hoàn tất • Không gian làm việc chính luôn tinh gọn
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadCSV(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 hover:text-white text-xs font-mono font-medium transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  title="Xuất riêng danh sách các nhiệm vụ đã lưu trữ ra file CSV"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  Xuất CSV Lưu Trữ
                </button>
                <button
                  onClick={() => setIsArchiveModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Stats & Filter Subheader */}
            <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Tổng Giá Trị Lưu Trữ:</span>
                  <span className="text-emerald-400 font-bold">
                    {simTasks
                      .filter((t) => t.archived)
                      .reduce((acc, t) => acc + t.valueVND, 0)
                      .toLocaleString('vi-VN')}{' '}
                    VNĐ
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Nghiệm thu:</span>
                  <span className="text-cyan-300 font-bold">100% SLA Hoàn tất</span>
                </div>
              </div>

              {/* Search Archived Tasks */}
              <div className="relative min-w-[240px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={archiveSearchQuery}
                  onChange={(e) => setArchiveSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm dự án, khách hàng, mã..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Modal Body: Archived Tasks List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5 custom-scrollbar">
              {(() => {
                const archivedList = simTasks.filter((t) => {
                  if (!t.archived) return false;
                  if (!archiveSearchQuery.trim()) return true;
                  const q = archiveSearchQuery.toLowerCase();
                  return (
                    t.id.toLowerCase().includes(q) ||
                    t.clientName.toLowerCase().includes(q) ||
                    t.projectTitle.toLowerCase().includes(q) ||
                    (t.notes && t.notes.some((n) => n.toLowerCase().includes(q)))
                  );
                });

                if (archivedList.length === 0) {
                  return (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Inbox className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-200">
                          {archiveSearchQuery ? 'Không tìm thấy nhiệm vụ lưu trữ phù hợp' : 'Kho lưu trữ đang trống'}
                        </h4>
                        <p className="text-xs text-slate-400 max-w-md">
                          {archiveSearchQuery
                            ? 'Hãy thử thay đổi từ khóa tìm kiếm khách hàng hoặc mã nhiệm vụ.'
                            : 'Khi các nhiệm vụ tại 5 bàn làm việc ảo hoàn tất nghiệm thu, hãy nhấn nút "Lưu Trữ (Archive)" trên thẻ nhiệm vụ để chuyển vào đây và giữ bàn làm việc luôn gọn gàng.'}
                        </p>
                      </div>
                    </div>
                  );
                }

                return archivedList.map((task) => {
                  const desk = virtualDesks.find((d) => d.id === task.currentDeskId);
                  const priorityCfg = getPriorityBadgeConfig(task.priority);

                  return (
                    <div
                      key={task.id}
                      className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-cyan-400 font-bold text-xs bg-cyan-950/70 border border-cyan-800/50 px-2 py-0.5 rounded">
                            {task.id}
                          </span>
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border flex items-center gap-1 ${priorityCfg.badgeBg}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${priorityCfg.dotBg} inline-block`} />
                            {priorityCfg.label}
                          </span>
                          <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" />
                            Đã lưu trữ: {task.archivedAt || task.dueDate || 'Hôm nay'}
                          </span>
                        </div>

                        <div className="flex items-baseline gap-2">
                          <h4 className="text-white font-bold text-sm truncate">{task.clientName}</h4>
                          <span className="text-xs text-slate-400 font-normal truncate max-w-sm">
                            • {task.projectTitle}
                          </span>
                        </div>

                        <div className="text-xs text-slate-400 flex items-center gap-3 font-mono">
                          <span>
                            Giá trị:{' '}
                            <strong className="text-emerald-400">{task.valueVND.toLocaleString('vi-VN')} VNĐ</strong>
                          </span>
                          <span>•</span>
                          <span>Phòng ban hoàn tất: {desk?.deptName || task.currentDeskId}</span>
                        </div>

                        {/* Notes preview if any */}
                        {task.notes && task.notes.length > 0 && (
                          <div className="mt-2 text-[11px] bg-slate-950/70 p-2 rounded-lg border border-slate-800/80 text-slate-300 font-mono space-y-0.5">
                            <span className="text-cyan-400 font-semibold block text-[10px]">
                              Ghi chú nghiệm thu ({task.notes.length}):
                            </span>
                            {task.notes.slice(-2).map((n, nIdx) => (
                              <div key={nIdx} className="truncate text-slate-300">
                                {n}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                        <button
                          onClick={() => handleRestoreTask(task.id)}
                          className="px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                          title="Khôi phục nhiệm vụ này về lại bàn làm việc hoạt động"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                          Khôi Phục Về Bàn
                        </button>
                        <button
                          onClick={() => handleDeleteTaskPermanently(task.id)}
                          className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/60 hover:border-rose-700 transition cursor-pointer"
                          title="Xóa vĩnh viễn khỏi hệ thống"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px]">
                Dữ liệu được lưu trữ an toàn trong LocalStorage &amp; đồng bộ tự động 24/7
              </span>
              <button
                onClick={() => setIsArchiveModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 6: REAL ACCOUNTS CONFIGURATION & AUTONOMOUS SALES PLAYBOOKS */}
      {activeView === 'accounts_config' && (
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 text-slate-100 pb-20">
          {/* Header Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border border-emerald-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Trung Tâm Cấu Hình Tài Khoản Thực &amp; Kịch Bản Kinh Doanh 24/7
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                  PRO LIVE
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Quản lý các tài khoản thực (Zalo OA, Facebook Ads, TikTok Shop, Google Ads, Webhook) và thiết lập kịch bản bán hàng tự động chốt đơn 24/7 cho Chủ nhân Nguyễn Thanh Hải.
              </p>
            </div>

            {/* Sub-tab Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-slate-950/90 border border-slate-800 text-xs shrink-0 self-stretch md:self-auto justify-center">
              <button
                type="button"
                onClick={() => setConfigSubTab('accounts')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  configSubTab === 'accounts'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>Kết Nối Tài Khoản Thực</span>
              </button>

              <button
                type="button"
                onClick={() => setConfigSubTab('playbooks')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  configSubTab === 'playbooks'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Workflow className="w-3.5 h-3.5" />
                <span>Kịch Bản Bán Hàng &amp; Chốt Đơn ({salesPlaybooks.length})</span>
              </button>
            </div>
          </div>

          {/* Success Notification Banner */}
          {accountSaveNotice && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{accountSaveNotice}</span>
            </div>
          )}

          {/* SUB-TAB 1: REAL ACCOUNTS API & WEBHOOK CONFIG */}
          {configSubTab === 'accounts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Dữ liệu nhạy cảm được mã hóa an toàn và lưu trữ trong LocalStorage thiết bị của bạn.</span>
                <button
                  type="button"
                  onClick={handleSaveAccounts}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/25 transition cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Lưu Toàn Bộ Cấu Hình</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 1. Zalo OA & ZNS */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-blue-500/40 shadow-xl space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-xs font-mono">
                        Zalo
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">Zalo Official Account &amp; ZNS</h3>
                        <p className="text-[11px] text-slate-400">Gửi tin tư vấn, báo giá &amp; ZNS OTP/Chốt đơn tự động</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{realAccounts.zalo.leadsSynced} Leads Đồng Bộ</span>
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1 font-medium">Tên Official Account</label>
                      <input
                        type="text"
                        value={realAccounts.zalo.oaName}
                        onChange={(e) =>
                          setRealAccounts((prev: any) => ({
                            ...prev,
                            zalo: { ...prev.zalo, oaName: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-blue-400 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1 font-medium">App ID</label>
                        <input
                          type="text"
                          value={realAccounts.zalo.appId}
                          onChange={(e) =>
                            setRealAccounts((prev: any) => ({
                              ...prev,
                              zalo: { ...prev.zalo, appId: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:border-blue-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1 font-medium">OA ID</label>
                        <input
                          type="text"
                          value={realAccounts.zalo.oaId}
                          onChange={(e) =>
                            setRealAccounts((prev: any) => ({
                              ...prev,
                              zalo: { ...prev.zalo, oaId: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:border-blue-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1 font-medium">Secret Key / Access Token</label>
                      <input
                        type="password"
                        value={realAccounts.zalo.secretKey}
                        onChange={(e) =>
                          setRealAccounts((prev: any) => ({
                            ...prev,
                            zalo: { ...prev.zalo, secretKey: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:border-blue-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1 font-medium">Webhook URL (Nhận tin nhắn Zalo realtime)</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          readOnly
                          value={realAccounts.zalo.webhookUrl}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-[11px] select-all"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(realAccounts.zalo.webhookUrl);
                            setAccountSaveNotice('✓ Đã sao chép Zalo Webhook URL!');
                            setTimeout(() => setAccountSaveNotice(null), 2500);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                          title="Sao chép"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Facebook Ads & Fanpage Messenger */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/40 shadow-xl space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-xs font-mono">
                        Meta
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">Facebook Fanpage &amp; Meta Ads</h3>
                        <p className="text-[11px] text-slate-400">Tự động trả lời Messenger 24/7 &amp; đồng bộ Pixel Ads</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                      <span>{realAccounts.facebook.leadsSynced} Leads Messenger</span>
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1 font-medium">Tên Fanpage</label>
                      <input
                        type="text"
                        value={realAccounts.facebook.pageName}
                        onChange={(e) =>
                          setRealAccounts((prev: any) => ({
                            ...prev,
                            facebook: { ...prev.facebook, pageName: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-indigo-400 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1 font-medium">Page ID</label>
                        <input
                          type="text"
                          value={realAccounts.facebook.pageId}
                          onChange={(e) =>
                            setRealAccounts((prev: any) => ({
                              ...prev,
                              facebook: { ...prev.facebook, pageId: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:border-indigo-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1 font-medium">Pixel ID</label>
                        <input
                          type="text"
                          value={realAccounts.facebook.pixelId}
                          onChange={(e) =>
                            setRealAccounts((prev: any) => ({
                              ...prev,
                              facebook: { ...prev.facebook, pixelId: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:border-indigo-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1 font-medium">Page Access Token</label>
                      <input
                        type="password"
                        value={realAccounts.facebook.accessToken}
                        onChange={(e) =>
                          setRealAccounts((prev: any) => ({
                            ...prev,
                            facebook: { ...prev.facebook, accessToken: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:border-indigo-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1 font-medium">Meta Webhook URL</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          readOnly
                          value={realAccounts.facebook.webhookUrl}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-indigo-300 font-mono text-[11px] select-all"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(realAccounts.facebook.webhookUrl);
                            setAccountSaveNotice('✓ Đã sao chép Meta Webhook URL!');
                            setTimeout(() => setAccountSaveNotice(null), 2500);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. TikTok Shop */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-rose-500/40 shadow-xl space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-bold text-xs font-mono">
                        TikTok
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">TikTok Shop &amp; TikTok Ads</h3>
                        <p className="text-[11px] text-slate-400">Đồng bộ đơn hàng, tin nhắn CSKH &amp; chốt livestream</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                      <span>{realAccounts.tiktok.ordersSynced} Đơn Đã Đồng Bộ</span>
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1 font-medium">Tên Shop TikTok</label>
                        <input
                          type="text"
                          value={realAccounts.tiktok.shopName}
                          onChange={(e) =>
                            setRealAccounts((prev: any) => ({
                              ...prev,
                              tiktok: { ...prev.tiktok, shopName: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-rose-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1 font-medium">Seller Center ID</label>
                        <input
                          type="text"
                          value={realAccounts.tiktok.sellerId}
                          onChange={(e) =>
                            setRealAccounts((prev: any) => ({
                              ...prev,
                              tiktok: { ...prev.tiktok, sellerId: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:border-rose-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1 font-medium">Open API App Key / Secret</label>
                      <input
                        type="password"
                        value={realAccounts.tiktok.appKey}
                        onChange={(e) =>
                          setRealAccounts((prev: any) => ({
                            ...prev,
                            tiktok: { ...prev.tiktok, appKey: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:border-rose-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Custom ERP & Webhook Ingestion */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/40 shadow-xl space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs font-mono">
                        CRM
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">Custom ERP / Hubspot / Shopee API</h3>
                        <p className="text-[11px] text-slate-400">Kết nối cơ sở dữ liệu riêng của doanh nghiệp</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>{realAccounts.webhook.lastPing}</span>
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1 font-medium">Endpoint URL Lead Ingest</label>
                      <input
                        type="text"
                        value={realAccounts.webhook.endpoint}
                        onChange={(e) =>
                          setRealAccounts((prev: any) => ({
                            ...prev,
                            webhook: { ...prev.webhook, endpoint: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1 font-medium">API Secret Token</label>
                      <input
                        type="password"
                        value={realAccounts.webhook.apiKey}
                        onChange={(e) =>
                          setRealAccounts((prev: any) => ({
                            ...prev,
                            webhook: { ...prev.webhook, apiKey: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 2: AUTONOMOUS SALES PLAYBOOKS */}
          {configSubTab === 'playbooks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1 flex-wrap gap-2">
                <span>Hoppi tự động kích hoạt kịch bản phù hợp khi phát hiện tâm lý &amp; nhu cầu của khách hàng.</span>
                <button
                  type="button"
                  onClick={handleSavePlaybooks}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-teal-600/25 transition cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Lưu Kịch Bản Bán Hàng</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {salesPlaybooks.map((pb: any) => (
                  <div
                    key={pb.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      pb.isActive
                        ? 'bg-slate-900/90 border-teal-500/40 shadow-xl'
                        : 'bg-slate-950/60 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-800">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-white text-sm">{pb.title}</h3>
                          <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-semibold">
                            {pb.channel}
                          </span>
                          {pb.autoEscalateHITL && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                              👑 Chuyển giao Chủ nhân (HITL)
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-cyan-300">
                          <strong>Điều kiện kích hoạt:</strong> {pb.trigger}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => handleTogglePlaybook(pb.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            pb.isActive
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {pb.isActive ? 'Đang Chạy 24/7' : 'Đã Tạm Dừng'}
                        </button>
                      </div>
                    </div>

                    <div className="pt-3 space-y-3">
                      <div>
                        <span className="text-[11px] text-slate-400 font-semibold block mb-1">
                          Nội dung kịch bản AI phản hồi tự động:
                        </span>
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 text-xs text-slate-200 leading-relaxed font-sans">
                          {pb.responseScript}
                        </div>
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-xs">
                        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
                          <span>Đã kích hoạt: <strong className="text-cyan-300">{pb.stats.triggeredCount} lần</strong></span>
                          <span>Tỷ lệ chốt: <strong className="text-emerald-300">{pb.stats.conversionRate}</strong></span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleTestPlaybook(pb)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-medium text-xs flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Play className="w-3 h-3 text-cyan-400" />
                          <span>Thử Nghiệm Kịch Bản Này</span>
                        </button>
                      </div>

                      {/* Live Output Simulation */}
                      {testPlaybookOutput[pb.id] && (
                        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs space-y-1 animate-in fade-in">
                          <span className="font-bold text-cyan-300 text-[11px] flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Kết quả AI giả lập gửi cho khách hàng thực tế:
                          </span>
                          <p className="text-slate-200 italic">"{testPlaybookOutput[pb.id]}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subtle 'Syncing...' pulsing indicator in the corner of SalesCrmPanel */}
      <div className="absolute bottom-3 right-4 z-40 pointer-events-auto select-none transition-all duration-300">
        {syncState === 'syncing' ? (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/95 border border-cyan-400 text-cyan-200 text-[10px] font-mono font-medium shadow-xl shadow-cyan-500/30 backdrop-blur-md animate-pulse">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin" />
            <span>Syncing...</span>
          </div>
        ) : syncState === 'saved' ? (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900/95 border border-emerald-400/80 text-emerald-300 text-[10px] font-mono shadow-md shadow-emerald-500/20 backdrop-blur-md transition-all">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>Saved</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/70 border border-slate-800/80 text-[9px] font-mono text-slate-400 opacity-40 hover:opacity-100 transition backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 inline-block" />
            <span>LocalStorage Synced</span>
          </div>
        )}
      </div>
    </div>
  );
};
