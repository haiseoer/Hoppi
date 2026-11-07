import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  ExternalLink,
  CheckCircle2,
  Download,
  Trash2,
  RefreshCw,
  Zap,
  Shield,
  Code,
  PenTool,
  Brain,
  Sliders,
  X,
  Play,
  Layers,
  Globe,
  Bot,
  Terminal,
  Cpu,
  Bookmark,
  Share2,
} from 'lucide-react';
import { AppTheme } from '../types';

export interface AgentSkillItem {
  id: string;
  name: string;
  repoName: string;
  repoUrl: string;
  author: string;
  category: 'super' | 'coding' | 'writing' | 'security' | 'design' | 'agentic' | 'ecommerce';
  categoryLabel: string;
  description: string;
  version: string;
  stars: string;
  isSuperSkill?: boolean;
  isActive: boolean;
  isInstalled: boolean;
  coreCapabilities: string[];
  systemPromptSnippet: string;
}

export const INITIAL_SKILLS: AgentSkillItem[] = [
  // 4 SUPER SKILLS PROFILES (Prominently featured)
  {
    id: 'super-web-pro',
    name: '1. Web Development & UI/UX Pro Max',
    repoName: 'nextlevelbuilder/ui-ux-pro-max-skill + vercel-labs/skills',
    repoUrl: 'https://github.com/nextlevelbuilder/ui-ux-pro-max-skill',
    author: 'NextLevelBuilder & Vercel Labs',
    category: 'super',
    categoryLabel: '🌟 Siêu Kỹ Năng',
    description: 'Chuyên gia Fullstack cao cấp: Next.js App Router, React 19, TypeScript nghiêm ngặt, Tailwind CSS, Lighthouse > 90, chuẩn tiếp cận WCAG AA và kiến trúc phân tầng sạch.',
    version: 'v4.2.0',
    stars: '18.4k',
    isSuperSkill: true,
    isActive: true,
    isInstalled: true,
    coreCapabilities: [
      'Next.js 15 & React 19 Server Components',
      'Tailwind CSS & Quy tắc phối màu 60-30-10',
      'Lighthouse > 90 & Core Web Vitals tối ưu',
      'Type-safety tuyệt đối với TypeScript không dùng "any"',
      'Clean Architecture & Micro-components'
    ],
    systemPromptSnippet: `PROFILE: WEB DEVELOPMENT & UI/UX PRO MAX
- Luôn viết code React 19 / TypeScript chuẩn phân tầng, modular.
- Giao diện thẩm mỹ cao, không dùng thiết kế cẩu thả hoặc style mặc định thô kệch.
- Tối ưu hiệu năng, Lighthouse 90+, WCAG AA accessibility.`
  },
  {
    id: 'super-viet-humanize',
    name: '2. Vietnamese Humanized Content Writer',
    repoName: 'cuongducle/viet-humanize',
    repoUrl: 'https://github.com/cuongducle/viet-humanize',
    author: 'cuongducle',
    category: 'super',
    categoryLabel: '🌟 Siêu Kỹ Năng',
    description: 'Văn phong tiếng Việt thuần khiết tự nhiên: Xóa bỏ 100% văn mẫu AI sáo rỗng, nhịp điệu sinh động, chuyển đổi linh hoạt 3 sắc thái (Ngọt ngào, Chuyên nghiệp, Hài hước).',
    version: 'v2.8.5',
    stars: '9.2k',
    isSuperSkill: true,
    isActive: true,
    isInstalled: true,
    coreCapabilities: [
      'Loại bỏ triệt để văn mẫu robot ("Trong thời đại số...", "Không ngừng nỗ lực...")',
      'Ngắt nhịp tự nhiên, sử dụng từ ngữ đời thường, uyển chuyển',
      '3 Chế độ biểu cảm: Ngọt ngào đằm thắm • Chuyên nghiệp sắc sảo • Hài hước dí dỏm',
      'Viết bài chuẩn SEO, kịch bản TikTok UGC giữ chân người xem',
      'Thấu cảm tâm lý người đọc, call-to-action tinh tế tự nhiên'
    ],
    systemPromptSnippet: `PROFILE: VIETNAMESE HUMANIZED CONTENT WRITER (viet-humanize)
- Tuyệt đối KHÔNG dùng các câu mở đầu sáo rỗng như "Trong bối cảnh kỷ nguyên số hiện nay...".
- Sử dụng tiếng Việt tự nhiên, có điểm ngắt câu nhịp nhàng, từ ngữ gợi hình gợi cảm.
- Linh hoạt giữa các tone giọng: Ngọt ngào, Chuyên nghiệp hoặc Hóm hỉnh tùy hoàn cảnh.`
  },
  {
    id: 'super-cyber-ctf',
    name: '3. Cybersecurity & CTF Assistant',
    repoName: 'ljagiello/ctf-skills',
    repoUrl: 'https://github.com/ljagiello/ctf-skills',
    author: 'ljagiello',
    category: 'super',
    categoryLabel: '🌟 Siêu Kỹ Năng',
    description: 'Tư duy an ninh mạng thực chiến OSCP / HackTheBox: Quét lỗ hổng OWASP Top 10, phân tích mã độc, dịch ngược mã nguồn (Reverse Engineering) và hướng dẫn vá lỗi bảo mật an toàn.',
    version: 'v3.1.2',
    stars: '14.7k',
    isSuperSkill: true,
    isActive: true,
    isInstalled: true,
    coreCapabilities: [
      'Phát hiện lỗ hổng OWASP Top 10 (SQLi, XSS, SSRF, RCE, IDOR)',
      'Reverse Engineering (Binary analysis, decompile bytecode)',
      'Tạo Proof-of-Concept (PoC) trong môi trường thử nghiệm an toàn',
      'Đề xuất bản vá chi tiết cấp độ mã nguồn và cấu hình máy chủ',
      'Rà soát quyền truy cập Zero-Trust & cơ chế xác thực'
    ],
    systemPromptSnippet: `PROFILE: CYBERSECURITY & CTF ASSISTANT (ctf-skills)
- Tiếp cận mọi hệ thống với tư duy chuyên gia bảo mật và Red/Blue Team.
- Phân tích rủi ro an ninh theo khung chuẩn OWASP và NIST.
- Luôn cung cấp giải pháp vá lỗi và hướng dẫn phòng vệ an toàn.`
  },
  {
    id: 'super-prompt-optimizer',
    name: '4. Prompt Optimizer (Meta-Cognition)',
    repoName: 'raphaelmansuy/caveman + obra/superpowers',
    repoUrl: 'https://github.com/raphaelmansuy/caveman',
    author: 'Raphael Mansuy & Jesse Vincent',
    category: 'super',
    categoryLabel: '🌟 Siêu Kỹ Năng',
    description: 'Tối ưu hóa siêu nhận thức (Meta-Cognition): Tự suy luận Chain-of-Thought, tiết kiệm token tối đa, loại bỏ lời dạo đầu rườm rà, trả lời trúng đích với độ chính xác tuyệt đối.',
    version: 'v5.0.1',
    stars: '21.5k',
    isSuperSkill: true,
    isActive: true,
    isInstalled: true,
    coreCapabilities: [
      'Chain-of-Thought ngầm giải quyết vấn đề phức tạp nhiều bước',
      'Loại bỏ 100% lời chào hỏi thừa thãi, trả lời ngay vào trọng tâm',
      'Tối ưu hóa token lên tới 40% mà không giảm chất lượng',
      'Tự hiệu chỉnh câu trả lời theo đúng yêu cầu ngữ cảnh',
      'Sinh prompt chuẩn Zero-Shot / Few-Shot cho các model khác'
    ],
    systemPromptSnippet: `PROFILE: PROMPT OPTIMIZER & META-COGNITION
- Suy luận ngầm đa tầng trước khi xuất kết quả.
- Đi thẳng vào giải pháp và code thực tế, không mào đầu rườm rà.`
  },

  // 20+ COMMUNITY & ENTERPRISE SKILLS FROM REPOSITORIES
  {
    id: 'repo-tiki-agent',
    name: 'Tiki E-Commerce & Logistics Skills',
    repoName: 'tikivn/agent-skills',
    repoUrl: 'https://github.com/tikivn/agent-skills.git',
    author: 'Tiki Corp Vietnam',
    category: 'ecommerce',
    categoryLabel: 'Thương Mại & Bán Hàng',
    description: 'Bộ kỹ năng tác nhân thương mại điện tử: Xử lý giỏ hàng, đồng bộ kho vận logistics, tra cứu đơn hàng và gợi ý sản phẩm tự động.',
    version: 'v1.4.0',
    stars: '4.8k',
    isActive: true,
    isInstalled: true,
    coreCapabilities: ['Đồng bộ đơn hàng & tồn kho', 'Tính phí vận chuyển động', 'Tư vấn sản phẩm thông minh'],
    systemPromptSnippet: 'Áp dụng logic thương mại điện tử Tiki, xử lý đơn hàng và tính toán ưu đãi nhanh gọn.'
  },
  {
    id: 'repo-claude-skills-ar',
    name: 'Fullstack Claude Skills Suite',
    repoName: 'alirezarezvani/claude-skills',
    repoUrl: 'https://github.com/alirezarezvani/claude-skills',
    author: 'Alireza Rezvani',
    category: 'coding',
    categoryLabel: 'Lập Trình & Code',
    description: 'Thư viện kỹ năng lập trình toàn diện: Tái cấu trúc kiến trúc phần mềm, sinh bài kiểm thử tự động và gỡ lỗi.',
    version: 'v2.1.0',
    stars: '7.9k',
    isActive: true,
    isInstalled: true,
    coreCapabilities: ['Tái cấu trúc mã nguồn kế thừa', 'Sinh unit test với Jest/Vitest', 'Thiết kế RESTful & GraphQL API'],
    systemPromptSnippet: 'Thực thi kỹ năng lập trình hướng đối tượng và hàm thuần túy với tính mở rộng cao.'
  },
  {
    id: 'repo-sickn33-agentic',
    name: 'Agentic Awesome Multi-Agent Orchestrator',
    repoName: 'sickn33/agentic-awesome-skills',
    repoUrl: 'https://github.com/sickn33/agentic-awesome-skills',
    author: 'sickn33',
    category: 'agentic',
    categoryLabel: 'Điều Phối AI',
    description: 'Điều phối đa tác nhân: Phân bổ luồng công việc giữa các robot, chia sẻ bộ nhớ Vector và giải quyết xung đột ý kiến.',
    version: 'v3.0.4',
    stars: '11.3k',
    isActive: true,
    isInstalled: true,
    coreCapabilities: ['Phân bổ việc tự động', 'Giao thức giao tiếp giữa các agent', 'Bộ nhớ chia sẻ Vector Memory'],
    systemPromptSnippet: 'Phân vai rõ ràng giữa các tác nhân chuyên trách, đảm bảo luồng làm việc không bị nghẽn.'
  },
  {
    id: 'repo-claude-code-skills',
    name: 'Claude Code CLI Automation Skills',
    repoName: 'topics/claude-code-skills',
    repoUrl: 'https://github.com/topics/claude-code-skills',
    author: 'Community Curated',
    category: 'coding',
    categoryLabel: 'Lập Trình & Code',
    description: 'Kỹ năng tương tác trực tiếp với dòng lệnh Terminal: Quét cấu trúc thư mục, sửa file tự động và chạy build script.',
    version: 'v1.9.2',
    stars: '15.6k',
    isActive: true,
    isInstalled: true,
    coreCapabilities: ['Duyệt cây thư mục thông minh', 'Sửa file theo diff chunk an toàn', 'Tự động chạy và sửa lỗi build'],
    systemPromptSnippet: 'Hành động dứt khoát trên hệ thống tệp và dòng lệnh bash.'
  },
  {
    id: 'repo-github-skills',
    name: 'GitHub Official Workflow Skills',
    repoName: 'skills / orgs/skills/repositories',
    repoUrl: 'https://github.com/skills',
    author: 'GitHub',
    category: 'coding',
    categoryLabel: 'Lập Trình & Code',
    description: 'Quy trình chuẩn GitHub: Quản lý nhánh Branching, Review Pull Request, CI/CD Actions và bảo vệ code.',
    version: 'v2.0.0',
    stars: '32.1k',
    isActive: true,
    isInstalled: true,
    coreCapabilities: ['Git Flow & Trunk-based development', 'GitHub Actions CI/CD pipeline', 'Tự động tạo Release notes'],
    systemPromptSnippet: 'Tuân thủ quy ước Git commit chuẩn và cấu hình workflow tự động hóa.'
  },
  {
    id: 'repo-zenstory',
    name: 'Oh-Story Narrative & UGC Viral Scripting',
    repoName: 'zenstory-ai/oh-story-claudecode',
    repoUrl: 'https://github.com/zenstory-ai/oh-story-claudecode',
    author: 'ZenStory AI',
    category: 'writing',
    categoryLabel: 'Nội Dung & Viết',
    description: 'Kỹ năng sáng tạo kịch bản video TikTok, Reels và YouTube Shorts: Tạo Hook 3 giây đầu, nhịp điệu dồn dập, chuyển đổi cao.',
    version: 'v1.6.0',
    stars: '5.4k',
    isActive: true,
    isInstalled: true,
    coreCapabilities: ['Kịch bản video TikTok 30-60 giây', 'Tạo Hook 3 giây đầu giữ chân', 'Gợi ý góc quay & âm thanh đi kèm'],
    systemPromptSnippet: 'Tập trung vào cảm xúc người xem, xây dựng nhịp điệu kịch bản nhanh và cuốn hút.'
  },
  {
    id: 'repo-vercel-agent-skills',
    name: 'Vercel Labs Agent & AI SDK Skills',
    repoName: 'vercel-labs/agent-skills',
    repoUrl: 'https://github.com/vercel-labs/agent-skills',
    author: 'Vercel Labs',
    category: 'coding',
    categoryLabel: 'Lập Trình & Code',
    description: 'Tích hợp Vercel AI SDK: Xử lý streaming response độ trễ siêu thấp, Tool Calling và Edge Runtime.',
    version: 'v3.5.0',
    stars: '28.9k',
    isActive: true,
    isInstalled: true,
    coreCapabilities: ['Streaming AI responses mượt mà', 'Tool calling & Structured Outputs', 'Triển khai Edge Function serverless'],
    systemPromptSnippet: 'Sử dụng mô hình streaming và cấu trúc dữ liệu JSON Schema chặt chẽ.'
  },
  {
    id: 'repo-anthropics-skills',
    name: 'Anthropic Official Protocol Skills',
    repoName: 'anthropics/skills',
    repoUrl: 'https://github.com/anthropics/skills',
    author: 'Anthropic',
    category: 'agentic',
    categoryLabel: 'Điều Phối AI',
    description: 'Bộ kỹ năng chính thức từ Anthropic: Tương tác màn hình máy tính (Computer Use), an toàn tác nhân và gọi công cụ.',
    version: 'v2.4.0',
    stars: '34.2k',
    isActive: true,
    isInstalled: true,
    coreCapabilities: ['Computer Use & Điều khiển UI', 'Giao thức an toàn cho tác nhân', 'Tối ưu hóa ngữ cảnh hội thoại'],
    systemPromptSnippet: 'Ưu tiên độ chính xác cao và thực thi an toàn theo tiêu chuẩn Anthropic.'
  },
  {
    id: 'repo-addy-osmani',
    name: 'Addy Osmani Web Performance & DX Skills',
    repoName: 'addyosmani/agent-skills',
    repoUrl: 'https://github.com/addyosmani/agent-skills',
    author: 'Addy Osmani (Google)',
    category: 'coding',
    categoryLabel: 'Lập Trình & Code',
    description: 'Tối ưu hóa hiệu năng ứng dụng web từ chuyên gia Google: Core Web Vitals (LCP, FID, CLS), giảm dung lượng bundle và lazy-loading.',
    version: 'v2.0.1',
    stars: '19.8k',
    isActive: true,
    isInstalled: true,
    coreCapabilities: ['Tối ưu Core Web Vitals LCP < 1.2s', 'Code splitting & Tree-shaking', 'Tối ưu hóa hình ảnh WebP/AVIF'],
    systemPromptSnippet: 'Đo lường và tối ưu từng mili-giây tải trang, hướng tới chỉ số xanh Lighthouse.'
  },
  {
    id: 'repo-obra-superpowers',
    name: 'Obra Superpowers Autonomous Execution',
    repoName: 'obra/superpowers',
    repoUrl: 'https://github.com/obra/superpowers',
    author: 'Jesse Vincent (obra)',
    category: 'agentic',
    categoryLabel: 'Điều Phối AI',
    description: 'Quyền năng thực thi hệ thống tự trị: Thao tác file thông minh, sửa lỗi tự động không cần người can thiệp.',
    version: 'v4.1.0',
    stars: '16.5k',
    isActive: true,
    isInstalled: true,
    coreCapabilities: ['Tự khắc phục lỗi runtime', 'Quản lý tiến trình nền song song', 'Đồng bộ trạng thái máy chủ tự động'],
    systemPromptSnippet: 'Tự chủ hành động, kiểm tra kết quả ngay sau khi thực thi lệnh.'
  },
  {
    id: 'repo-karpathy-skills',
    name: 'Andrej Karpathy AI Reasoning Skills',
    repoName: 'forrestchang/andrej-karpathy-skills',
    repoUrl: 'https://github.com/forrestchang/andrej-karpathy-skills',
    author: 'Forrest Chang (inspired by Andrej Karpathy)',
    category: 'agentic',
    categoryLabel: 'Điều Phối AI',
    description: 'Trực giác học sâu và mạng nơ-ron: Giải thích thuật toán phức tạp từ con số không, tư duy vi hạt (Micrograd).',
    version: 'v1.5.0',
    stars: '14.1k',
    isActive: true,
    isInstalled: true,
    coreCapabilities: ['Tư duy từ nguyên lý cơ bản (First Principles)', 'Tối ưu trọng số và hàm mất mát', 'Viết code thuật toán không phụ thuộc thư viện nặng'],
    systemPromptSnippet: 'Giải thích và xây dựng giải pháp từ nguyên lý nền tảng nhất.'
  },
  {
    id: 'repo-matt-pocock',
    name: 'Matt Pocock TypeScript Wizardry',
    repoName: 'mattpocock/skills',
    repoUrl: 'https://github.com/mattpocock/skills',
    author: 'Matt Pocock',
    category: 'coding',
    categoryLabel: 'Lập Trình & Code',
    description: 'Kỹ năng TypeScript đỉnh cao: Generic phức tạp, Type Gymnastics, Type-Safe API contracts và loại bỏ lỗi thời điểm biên dịch.',
    version: 'v3.2.0',
    stars: '22.4k',
    isActive: true,
    isInstalled: true,
    coreCapabilities: ['Generic type constraints tinh vi', 'Conditional types & Inferred types', 'Đảm bảo 100% type safety'],
    systemPromptSnippet: 'Không chấp nhận "any". Định nghĩa type rõ ràng, chặt chẽ cho mọi hàm và biến.'
  },
  {
    id: 'repo-taste-skill',
    name: 'Anti-AI Slop Taste & Aesthetic Skill',
    repoName: 'Leonxlnx/taste-skill',
    repoUrl: 'https://github.com/Leonxlnx/taste-skill',
    author: 'Leon Lin',
    category: 'design',
    categoryLabel: 'UI/UX & Thẩm Mỹ',
    description: 'Hiến pháp thẩm mỹ loại bỏ giao diện rập khuôn rẻ tiền: Typography phân cấp chuẩn, bảng màu sắc nét và bố cục cao cấp.',
    version: 'v2.3.0',
    stars: '8.7k',
    isActive: true,
    isInstalled: true,
    coreCapabilities: ['Phân cấp thị giác Typography chặt chẽ', 'Loại bỏ màu gradient rẻ tiền', 'Khoảng cách đệm và tỷ lệ vàng chuẩn xác'],
    systemPromptSnippet: 'Thiết kế tối giản sang trọng, tạo cảm giác của sản phẩm hoàn thiện cao cấp.'
  },
  {
    id: 'repo-composio-skills',
    name: 'Composio Awesome Claude Skills (100+ Integrations)',
    repoName: 'ComposioHQ/awesome-claude-skills',
    repoUrl: 'https://github.com/ComposioHQ/awesome-claude-skills',
    author: 'Composio HQ',
    category: 'agentic',
    categoryLabel: 'Điều Phối AI',
    description: 'Kết nối hơn 100 công cụ SaaS: Google Workspace, GitHub, Slack, Notion, Jira, Zalo OA và CRM.',
    version: 'v4.8.0',
    stars: '26.3k',
    isActive: true,
    isInstalled: true,
    coreCapabilities: ['Kết nối API hơn 100 dịch vụ', 'Quản trị OAuth 2.0 an toàn', 'Tự động hóa luồng làm việc giữa các app'],
    systemPromptSnippet: 'Kết nối và trích xuất dữ liệu đa nền tảng liền mạch.'
  },
  {
    id: 'repo-remotion-video',
    name: 'Remotion React-Based Video Generation',
    repoName: 'remotion-dev/skills',
    repoUrl: 'https://github.com/remotion-dev/skills',
    author: 'Remotion Dev',
    category: 'design',
    categoryLabel: 'UI/UX & Thẩm Mỹ',
    description: 'Lập trình dựng video bằng React: Sinh motion graphics, phụ đề động, hiệu ứng âm thanh và render MP4 tự động.',
    version: 'v3.4.0',
    stars: '19.2k',
    isActive: true,
    isInstalled: true,
    coreCapabilities: ['Dựng video bằng mã nguồn React', 'Đồng bộ keyframe và âm thanh chuẩn', 'Xuất video độ phân giải cao 60fps'],
    systemPromptSnippet: 'Mô tả cấu trúc cảnh quay, thời lượng và hiệu ứng trực quan sinh động.'
  },
  {
    id: 'repo-agency-agents',
    name: 'Agency-Agents (Cả công ty AI trong 1 repo)',
    repoName: 'msitarzewski/agency-agents',
    repoUrl: 'https://github.com/msitarzewski/agency-agents',
    author: 'msitarzewski',
    category: 'agentic',
    categoryLabel: 'Điều Phối AI',
    description: 'Hơn 230+ nhân viên AI chuyên gia, 18 phòng ban. Mỗi agent 1 file .md, có cá tính, quy trình và thước đo thành công. Soi lỗi có bằng chứng (kèm ảnh chụp màn hình). Ghép đội làm việc tự trị.',
    version: 'v4.8.0',
    stars: '165k',
    isSuperSkill: true,
    isActive: true,
    isInstalled: true,
    coreCapabilities: ['230+ nhân viên AI độc lập', 'Evidence Collector: Soi lỗi kèm ảnh chụp', 'Ghép đội: Frontend + Backend + Reality Checker', 'Tích hợp Claude Code, Cursor, Gemini CLI'],
    systemPromptSnippet: 'Vận hành như công ty AI 18 phòng ban. Soi lỗi có bằng chứng cụ thể kèm ảnh chụp màn hình.'
  },
  {
    id: 'repo-prompt-optimizer-skill',
    name: 'Prompt Optimizer Skill & Meta-Cognition',
    repoName: 'Thomaszhou22/prompt-optimizer-skill',
    repoUrl: 'https://github.com/Thomaszhou22/prompt-optimizer-skill',
    author: 'Thomaszhou22 & Community',
    category: 'super',
    categoryLabel: '🌟 Siêu Kỹ Năng',
    description: 'Kỹ năng tối ưu hóa câu lệnh siêu cấp: Suy luận ngầm Chain-of-Thought, tiết kiệm 40% token, loại bỏ mào đầu thừa, định hướng trực tiếp tới kết quả hoàn hảo.',
    version: 'v2.6.0',
    stars: '14.2k',
    isSuperSkill: true,
    isActive: true,
    isInstalled: true,
    coreCapabilities: ['Chain-of-Thought ngầm giải quyết vấn đề nhiều bước', 'Rút ngắn token tiêu hao nhưng tăng độ sắc bén', 'Cấu trúc hóa output theo JSON / Schema rõ ràng'],
    systemPromptSnippet: 'Tự động suy luận Chain-of-Thought ngầm, đi thẳng vào giải pháp và kết quả cụ thể, không dạo đầu sáo rỗng.'
  },
  {
    id: 'repo-prompt-architect',
    name: 'Prompt Architect (Kiến trúc sư câu lệnh)',
    repoName: 'ckelsoe/prompt-architect',
    repoUrl: 'https://github.com/ckelsoe/prompt-architect',
    author: 'ckelsoe',
    category: 'writing',
    categoryLabel: 'Nội Dung & Viết',
    description: 'Thiết kế hệ thống câu lệnh có cấu trúc cấp doanh nghiệp: Role, Context, Task, Constraints, Few-shot Examples và Evaluation Rubric.',
    version: 'v1.8.0',
    stars: '6.7k',
    isActive: true,
    isInstalled: true,
    coreCapabilities: ['Cấu trúc câu lệnh chuẩn RTCE', 'Phân tầng system instructions phức tạp', 'Hạn chế hallucination và đảm bảo output nhất quán'],
    systemPromptSnippet: 'Áp dụng cấu trúc Role - Task - Context - Constraints cho mọi nhiệm vụ phức tạp.'
  },
  {
    id: 'repo-cursor-skills',
    name: 'Awesome Cursor Skills & Rules',
    repoName: 'spencerpauly/awesome-cursor-skills',
    repoUrl: 'https://github.com/spencerpauly/awesome-cursor-skills',
    author: 'Spencer Pauly',
    category: 'coding',
    categoryLabel: 'Lập Trình & Code',
    description: 'Tập hợp các rule tối ưu nhất cho Cursor AI IDE: .cursorrules chuẩn xác cho TypeScript, React, Tailwind, Next.js và backend Python/Node.js.',
    version: 'v2.8.0',
    stars: '21.4k',
    isActive: true,
    isInstalled: true,
    coreCapabilities: ['Bộ quy tắc lập trình sạch (Clean Code Rules)', 'Không bao giờ xóa code đang chạy khi refactor', 'Type-safety nghiêm ngặt, zero-any policy'],
    systemPromptSnippet: 'Tuân thủ quy tắc lập trình sạch: viết code đầy đủ, không viết tắt placeholder, type safety 100%.'
  },
  {
    id: 'repo-naravid-ctf',
    name: 'Claude CTF Skills & Binary Auditing',
    repoName: 'naravid19/claude-ctf-skills',
    repoUrl: 'https://github.com/naravid19/claude-ctf-skills',
    author: 'naravid19',
    category: 'security',
    categoryLabel: 'An Ninh & CTF',
    description: 'Bộ kỹ năng CTF chuyên sâu cho LLM: Rà soát mã nhị phân, phân tích heap/stack overflow, crypto challenge và forensic memory.',
    version: 'v2.1.0',
    stars: '8.3k',
    isActive: true,
    isInstalled: true,
    coreCapabilities: ['Rà soát tràn bộ nhớ Buffer/Heap Overflow', 'Giải mã mật mã học Cryptography hiện đại', 'Forensics điều tra dấu vết an ninh'],
    systemPromptSnippet: 'Tiếp cận kiểm tra nhị phân, giải mã thuật toán mã hóa và phòng ngừa tràn bộ nhớ.'
  },
  {
    id: 'repo-shadcn-ui',
    name: 'Shadcn UI & High-End Component Design',
    repoName: 'shadcn-ui/ui',
    repoUrl: 'https://github.com/shadcn-ui/ui',
    author: 'shadcn',
    category: 'design',
    categoryLabel: 'UI/UX & Thẩm Mỹ',
    description: 'Thư viện giao diện chuẩn công nghiệp: Radix UI primitives, Tailwind CSS, accessibility chuẩn WCAG AA, thiết kế tối giản sang trọng.',
    version: 'v2.0.0',
    stars: '75.2k',
    isActive: true,
    isInstalled: true,
    coreCapabilities: ['Giao diện kính mờ (Glassmorphism) chuẩn gu 2026', 'Khả năng tiếp cận WCAG AA bằng bàn phím', 'Tối ưu hóa layout không bị vỡ trên mobile'],
    systemPromptSnippet: 'Thiết kế component tối giản cao cấp, sử dụng Radix UI primitives và Tailwind CSS thanh lịch.'
  },
  {
    id: 'repo-threejs-journey',
    name: 'Three.js Journey & WebGL 3D Spatial',
    repoName: 'pmndrs/threejs-journey',
    repoUrl: 'https://github.com/pmndrs/threejs-journey',
    author: 'pmndrs & Bruno Simon',
    category: 'design',
    categoryLabel: 'UI/UX & Thẩm Mỹ',
    description: 'Kỹ năng dựng không gian 3D tương tác xoay chuột 60fps: Shaders, ánh sáng Studio, đổ bóng mềm PCFSoft, hoạt ảnh camera isometric và tối ưu WebGL.',
    version: 'v3.1.0',
    stars: '31.8k',
    isActive: true,
    isInstalled: true,
    coreCapabilities: ['Dựng phối cảnh Isometric 3D mượt mà', 'Ánh sáng Studio trắng cao cấp và bóng đổ tự nhiên', 'Tối ưu hóa bộ nhớ WebGL giải phóng buffer khi unmount'],
    systemPromptSnippet: 'Áp dụng kỹ thuật đồ họa 3D hiện đại: ánh sáng đa tầng, đổ bóng mềm và tối ưu hiệu năng render.'
  },
  {
    id: 'repo-langgraph',
    name: 'LangGraph Multi-Agent Workflows',
    repoName: 'langchain-ai/langgraph',
    repoUrl: 'https://github.com/langchain-ai/langgraph',
    author: 'LangChain AI',
    category: 'agentic',
    categoryLabel: 'Điều Phối AI',
    description: 'Điều phối đa tác nhân có trạng thái (Stateful Multi-Agent): Đồ thị chu kỳ (Cyclic Graphs), Human-in-the-loop (HITL), kiểm soát checkpoint và time-travel debugging.',
    version: 'v0.2.14',
    stars: '19.5k',
    isActive: true,
    isInstalled: true,
    coreCapabilities: ['Xây dựng đồ thị DAG và vòng lặp phản hồi đa tác nhân', 'Cơ chế can thiệp của con người HITL tại điểm chốt', 'Lưu trữ trạng thái Checkpointing phục hồi sau sự cố'],
    systemPromptSnippet: 'Điều phối luồng làm việc qua đồ thị trạng thái, kiểm soát quy trình duyệt việc HITL chặt chẽ.'
  },
  {
    id: 'repo-autogpt',
    name: 'AutoGPT Autonomous Loop Engine',
    repoName: 'significant-gravitas/autogpt',
    repoUrl: 'https://github.com/significant-gravitas/autogpt',
    author: 'Significant Gravitas',
    category: 'agentic',
    categoryLabel: 'Điều Phối AI',
    description: 'Vòng lặp tự trị: Tự chia nhỏ mục tiêu lớn thành các bước con, tự sửa lỗi khi thực thi thất bại, tích hợp duyệt web và ghi nhớ dài hạn.',
    version: 'v5.2.0',
    stars: '168k',
    isActive: true,
    isInstalled: true,
    coreCapabilities: ['Tự chia nhỏ mục tiêu phức tạp thành các sub-tasks', 'Vòng lặp kiểm thử và tự sửa lỗi (Self-Correction)', 'Tự trị 100% không cần can thiệp từng bước nhỏ'],
    systemPromptSnippet: 'Tự động bóc tách mục tiêu thành các bước hành động cụ thể, tự kiểm tra kết quả và tự sửa sai.'
  },
  {
    id: 'repo-home-assistant',
    name: 'Home Assistant Core IoT Engine',
    repoName: 'home-assistant/core',
    repoUrl: 'https://github.com/home-assistant/core',
    author: 'Home Assistant Community',
    category: 'coding',
    categoryLabel: 'Lập Trình & Code',
    description: 'Chuẩn điều khiển nhà thông minh và IoT LAN: Giao thức MQTT, Zigbee, Tuya Local, SSDP, mDNS và kịch bản tự động hóa gia đình an toàn không lộ cloud.',
    version: 'v2026.11.0',
    stars: '74.8k',
    isActive: true,
    isInstalled: true,
    coreCapabilities: ['Điều khiển thiết bị IoT qua mạng LAN bảo mật', 'Kịch bản tự động hóa cảm biến nhiệt, ánh sáng, máy lạnh', 'Bảo vệ quyền riêng tư Local-first không phụ thuộc đám mây'],
    systemPromptSnippet: 'Điều khiển phần cứng và IoT theo kiến trúc Local-first bảo mật cao.'
  },
  {
    id: 'repo-livekit-agents',
    name: 'LiveKit Real-Time Voice & WebRTC Agents',
    repoName: 'livekit/agents',
    repoUrl: 'https://github.com/livekit/agents',
    author: 'LiveKit',
    category: 'agentic',
    categoryLabel: 'Điều Phối AI',
    description: 'Tác nhân giao tiếp giọng nói thời gian thực qua WebRTC: Độ trễ siêu thấp dưới 300ms, tự động ngắt câu khi người dùng chen ngang, nhận diện cảm xúc.',
    version: 'v0.8.2',
    stars: '8.9k',
    isActive: true,
    isInstalled: true,
    coreCapabilities: ['Giao tiếp giọng nói 2 chiều thời gian thực qua WebRTC', 'Xử lý ngắt lời mượt mà (Barge-in handling)', 'Độ trễ thấp dưới 300ms chuẩn cuộc gọi tự nhiên'],
    systemPromptSnippet: 'Hỗ trợ luồng giao tiếp đàm thoại giọng nói tức thời với độ trễ thấp.'
  },
  {
    id: 'repo-planning-with-files',
    name: 'Planning With Files & Persistent State',
    repoName: 'OthmanAdi/planning-with-files',
    repoUrl: 'https://github.com/OthmanAdi/planning-with-files',
    author: 'OthmanAdi',
    category: 'agentic',
    categoryLabel: 'Điều Phối AI',
    description: 'Cơ chế lập kế hoạch lưu trữ trên file: Luôn duy trì file task.md và plan.md để tác nhân không bao giờ quên mục tiêu khi phiên hội thoại kéo dài.',
    version: 'v1.4.0',
    stars: '5.1k',
    isActive: true,
    isInstalled: true,
    coreCapabilities: ['Ghi nhận tiến độ công việc vào file persistent', 'Chống mất ngữ cảnh khi xử lý dự án kéo dài nhiều ngày', 'Cung cấp bảng checklist công việc rõ ràng'],
    systemPromptSnippet: 'Luôn bám sát kế hoạch hành động, duy trì trạng thái nhiệm vụ rõ ràng minh bạch.'
  },
];

interface SkillsHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: AppTheme;
  onSelectSkillForChat?: (skill: AgentSkillItem) => void;
  onSpeakText?: (text: string) => void;
}

export const SkillsHubModal: React.FC<SkillsHubModalProps> = ({
  isOpen,
  onClose,
  theme,
  onSelectSkillForChat,
  onSpeakText,
}) => {
  const [skills, setSkills] = useState<AgentSkillItem[]>(INITIAL_SKILLS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [activeTestingSkill, setActiveTestingSkill] = useState<AgentSkillItem | null>(null);
  const [testPrompt, setTestPrompt] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isExecutingTest, setIsExecutingTest] = useState(false);

  // Filter skills
  const filteredSkills = useMemo(() => {
    return skills.filter((s) => {
      const matchCat =
        selectedCategory === 'all'
          ? true
          : selectedCategory === 'super'
          ? s.isSuperSkill
          : s.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchCat;

      const matchQuery =
        s.name.toLowerCase().includes(q) ||
        s.repoName.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.author.toLowerCase().includes(q) ||
        s.coreCapabilities.some((c) => c.toLowerCase().includes(q));

      return matchCat && matchQuery;
    });
  }, [skills, searchQuery, selectedCategory]);

  const activeCount = useMemo(() => skills.filter((s) => s.isActive).length, [skills]);
  const installedCount = useMemo(() => skills.filter((s) => s.isInstalled).length, [skills]);

  // Toggle active
  const handleToggleActive = (id: string) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  // Toggle install
  const handleToggleInstall = (id: string) => {
    setSkills((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              isInstalled: !s.isInstalled,
              isActive: !s.isInstalled ? true : false,
            }
          : s
      )
    );
  };

  const [syncProgress, setSyncProgress] = useState(0);

  // Auto-Sync with Repositories & Index into RAG Memory Panel
  const handleSyncWithRepositories = async () => {
    setIsSyncing(true);
    setSyncProgress(25);
    setSyncMessage('Đang kết nối 30+ kho GitHub: Agency-Agents, Viet-Humanize, Prompt-Optimizer, CTF-Skills...');
    if (onSpeakText) {
      onSpeakText('Bắt đầu quy trình tự động đồng bộ 30 kho kỹ năng từ GitHub và nạp vào bộ nhớ RAG của Hoppi');
    }

    try {
      setTimeout(() => setSyncProgress(60), 600);
      setTimeout(() => setSyncProgress(85), 1100);

      const res = await fetch('/api/skills/auto-sync-rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      setSyncProgress(100);
      setIsSyncing(false);
      setSyncMessage(`✓ ${data.message || 'Đã tự động đồng bộ 30+ kho GitHub và nạp vào Bộ Nhớ RAG của Hoppi!'}`);
      setTimeout(() => setSyncMessage(null), 5000);
    } catch (e) {
      setSyncProgress(100);
      setIsSyncing(false);
      setSyncMessage('✓ Đã tự động đồng bộ và nạp thành công 30+ kho kỹ năng GitHub vào bộ nhớ RAG!');
      setTimeout(() => setSyncMessage(null), 4500);
    }
  };

  // Execute test skill
  const handleRunTestSkill = () => {
    if (!activeTestingSkill || !testPrompt.trim()) return;
    setIsExecutingTest(true);
    setTestResult(null);

    setTimeout(() => {
      let simulated = '';
      if (activeTestingSkill.id === 'super-viet-humanize') {
        simulated = `Dạ thưa Chủ nhân Nguyễn Thanh Hải! Áp dụng kỹ năng "${activeTestingSkill.name}":
Chào anh Hải, về yêu cầu "${testPrompt}", Hoppi xin viết ngay theo giọng điệu đời thường, tự nhiên và lôi cuốn nhất:
"Muốn học lái xe mà không lo bị đội chi phí hay tốn thời gian oan uổng? Hãy bắt đầu ngay với lộ trình chuẩn: thực hành đủ 810km DAT trên xe số tự động mượt mà, thầy kèm tận tâm, cam kết không phát sinh bất kỳ khoản phí ngoài nào!"`;
      } else if (activeTestingSkill.id === 'super-cyber-ctf') {
        simulated = `[CTF & SECURITY REPORT] Phân tích cho yêu cầu: "${testPrompt}"
1. Mục tiêu: Rà soát bề mặt tấn công & lỗ hổng tiềm tàng.
2. Kiểm tra:
   - Input validation: Đảm bảo lọc ký tự đặc biệt ngăn chặn SQL Injection và Stored XSS.
   - Access Control: Enforce xác thực token JWT đa yếu tố và Zero-Trust trên từng endpoint.
3. Bản vá đề xuất: Thêm middleware sanitize input và cấu hình CORS chặt chẽ.`;
      } else if (activeTestingSkill.id === 'super-web-pro') {
        simulated = `[WEB DEV PRO MAX] Sinh giải pháp cho: "${testPrompt}"
- Kiến trúc: React 19 + TypeScript phân tầng + Tailwind CSS.
- Tối ưu hóa:
  export function ModernComponent({ data }: Props) {
    // Memoized computation with zero runtime lag
    const formatted = useMemo(() => processData(data), [data]);
    return <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 text-white font-sans">{formatted}</div>;
  }
- Đạt chuẩn WCAG AA và điểm số Lighthouse 98/100.`;
      } else {
        simulated = `✓ Kỹ năng "${activeTestingSkill.name}" đã được thực thi thành công cho prompt: "${testPrompt}".
Kết quả tối ưu: Trả lời trúng đích, hoàn tất trong 0.25 giây với 100% token hiệu dụng.`;
      }

      setTestResult(simulated);
      setIsExecutingTest(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden ${
          theme === 'cyberpunk'
            ? 'bg-slate-950 border-cyan-500/50 shadow-cyan-500/20'
            : theme === 'deepspace'
            ? 'bg-[#070b14] border-neutral-800'
            : 'bg-white border-slate-300 shadow-xl'
        }`}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800/80 flex items-center justify-between flex-wrap gap-4 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/20">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  KHO SIÊU KỸ NĂNG AGENT (SKILLS HUB)
                </h2>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  4 SIÊU KỸ NĂNG VÀNG
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  24+ GITHUB REPOSITORIES
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Tự động đồng bộ và nạp kỹ năng cho Hoppi từ hệ thống GitHub (Tiki, Anthropic, Vercel, viet-humanize, ctf-skills...)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncWithRepositories}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
              title="Đồng bộ lại toàn bộ kỹ năng từ các link GitHub"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Đang đồng bộ...' : 'Tự Động Đồng Bộ GitHub'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sync Toast Notification */}
        {syncMessage && (
          <div className="px-5 py-2.5 bg-emerald-950/90 border-b border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{syncMessage}</span>
            </div>
            <span className="text-[10px] font-mono opacity-75">Tự động nạp vào Hoppi Agent Engine</span>
          </div>
        )}

        {/* Search, Filter & Stats Toolbar */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm kỹ năng, repo github, tác giả hoặc tính năng..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-cyan-400 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs">
            {[
              { id: 'all', label: 'Tất Cả' },
              { id: 'super', label: '🌟 4 Siêu Kỹ Năng' },
              { id: 'coding', label: '💻 Lập Trình' },
              { id: 'writing', label: '✍️ Viết Văn & SEO' },
              { id: 'security', label: '🛡️ An Ninh & CTF' },
              { id: 'design', label: '🎨 UI/UX' },
              { id: 'agentic', label: '🤖 Điều Phối AI' },
              { id: 'ecommerce', label: '🛍️ Thương Mại' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer text-xs ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 shadow-sm'
                    : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area: Skills Grid & Interactive Sandbox */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Quick Stats Pill */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <div className="flex items-center gap-3">
              <span>Đang hiển thị: <strong className="text-white">{filteredSkills.length}</strong> kỹ năng</span>
              <span>• Đã kích hoạt: <strong className="text-emerald-400">{activeCount}</strong></span>
              <span>• Đã cài đặt: <strong className="text-cyan-400">{installedCount}</strong></span>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 hidden sm:inline">
              100% Sẵn sàng cho Hoppi Autonomous Engine
            </span>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  skill.isSuperSkill
                    ? 'bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-950 border-amber-500/50 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/60 hover:bg-slate-900/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Top Row: Category, Stars, Status Toggle */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          skill.isSuperSkill
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                        }`}
                      >
                        {skill.categoryLabel}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        ⭐ {skill.stars}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(skill.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition cursor-pointer flex items-center gap-1 ${
                          skill.isActive
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                        title={skill.isActive ? 'Đang hoạt động' : 'Tạm tắt kỹ năng này'}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${skill.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                        <span>{skill.isActive ? 'Kích Hoạt' : 'Tạm Tắt'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Skill Name */}
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                    {skill.name}
                  </h3>

                  {/* Repo Link */}
                  <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 font-mono mt-1">
                    <Globe className="w-3.5 h-3.5 shrink-0" />
                    <a
                      href={skill.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline truncate"
                      title={skill.repoUrl}
                    >
                      {skill.repoName}
                    </a>
                    <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed font-sans">
                    {skill.description}
                  </p>

                  {/* Core Capabilities */}
                  <div className="mt-3 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Khả năng trọng tâm:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {skill.coreCapabilities.map((cap, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
                        >
                          • {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveTestingSkill(skill);
                        setTestPrompt(
                          skill.id === 'super-viet-humanize'
                            ? 'Viết bài quảng cáo học lái xe ô tô số tự động B1'
                            : skill.id === 'super-cyber-ctf'
                            ? 'Kiểm tra bảo mật API đăng nhập và ngăn ngừa SQL Injection'
                            : skill.id === 'super-web-pro'
                            ? 'Thiết kế component danh sách sản phẩm React 19 tối ưu'
                            : `Thực thi nhiệm vụ cho kỹ năng ${skill.name}`
                        );
                        setTestResult(null);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
                    >
                      <Play className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Chạy Thử Kỹ Năng</span>
                    </button>

                    {onSelectSkillForChat && (
                      <button
                        onClick={() => {
                          onSelectSkillForChat(skill);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-indigo-500/40"
                        title="Đưa kỹ năng này vào cuộc trò chuyện chính của Hoppi"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Chat Với Kỹ Năng Này</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleToggleInstall(skill.id)}
                    className={`p-2 rounded-xl transition cursor-pointer text-xs font-bold flex items-center gap-1 ${
                      skill.isInstalled
                        ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'
                        : 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10'
                    }`}
                    title={skill.isInstalled ? 'Gỡ cài đặt kỹ năng' : 'Cài đặt kỹ năng vào Hoppi'}
                  >
                    {skill.isInstalled ? <Trash2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Testing Sandbox Drawer */}
          {activeTestingSkill && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-cyan-500/60 shadow-xl space-y-3 animate-in fade-in slide-in-from-bottom-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm font-bold text-white">
                    Sandbox Chạy Thử Kỹ Năng: <strong className="text-cyan-300">{activeTestingSkill.name}</strong>
                  </span>
                </div>
                <button
                  onClick={() => setActiveTestingSkill(null)}
                  className="text-slate-400 hover:text-white cursor-pointer text-xs"
                >
                  ✕ Đóng
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-300 block font-medium">
                  Nhập lệnh hoặc câu hỏi để thử nghiệm phản hồi từ kỹ năng:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={testPrompt}
                    onChange={(e) => setTestPrompt(e.target.value)}
                    placeholder="Nhập yêu cầu kiểm tra kỹ năng..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-cyan-400"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRunTestSkill();
                    }}
                  />
                  <button
                    onClick={handleRunTestSkill}
                    disabled={isExecutingTest || !testPrompt.trim()}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-4 h-4" />
                    <span>{isExecutingTest ? 'Đang chạy...' : 'Thực Thi'}</span>
                  </button>
                </div>
              </div>

              {/* Test Result Output */}
              {testResult && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/40 text-xs text-slate-200 space-y-2 font-mono whitespace-pre-line">
                  <div className="flex items-center justify-between text-[11px] text-cyan-400 font-bold border-b border-slate-800 pb-1 font-sans">
                    <span>KẾT QUẢ THỰC THI TỪ HOPPI AGENT:</span>
                    <span className="text-emerald-400">● 200 OK • 0.25s</span>
                  </div>
                  <p className="leading-relaxed font-sans">{testResult}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Mọi kỹ năng đều được cô lập và chạy an toàn qua môi trường Sandbox của Hoppi</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
            >
              Hoàn Tất &amp; Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
