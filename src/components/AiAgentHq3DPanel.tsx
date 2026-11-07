import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  AppTheme,
  UserIdentity,
} from '../types';
import {
  Building2,
  Users,
  Code2,
  Palette,
  FileText,
  ShieldCheck,
  Cpu,
  Zap,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Maximize2,
  Minimize2,
  Volume2,
  RotateCcw,
  Eye,
  Sliders,
  Clock,
  Layers,
  Send,
  Camera,
  Play,
  Coffee,
  CheckSquare,
  Terminal,
  Activity,
  Flame,
  Globe,
  Radio,
  Check,
  Compass,
} from 'lucide-react';

interface AiAgentHq3DPanelProps {
  theme: AppTheme;
  identity: UserIdentity | null;
  onNavigateToModule: (mod: any) => void;
  onSpeakText?: (text: string) => void;
  onDispatchCommand?: (cmd: string, attachments?: any[]) => void;
  onOpenSnapshotModal?: () => void;
  onOpenSkillsHub?: () => void;
}

export type OfficeVisualTheme = 'dark_neon' | 'studio_white' | 'blueprint';

interface AgentCharacterData {
  id: string;
  name: string;
  vietnameseName: string;
  role: string;
  colorHex: number;
  colorTailwind: string;
  status: string;
  currentTask: string;
  tools: string[];
  homeRoom: string;
  homePosition: [number, number, number];
  expression: '^ ^' | '◕ ‿ ◕' | '• •' | '★ ★' | '◠ ◡';
}

export const AiAgentHq3DPanel: React.FC<AiAgentHq3DPanelProps> = ({
  theme,
  identity,
  onNavigateToModule,
  onSpeakText,
  onDispatchCommand,
  onOpenSnapshotModal,
  onOpenSkillsHub,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const viewportContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Video Reference Visual Theme & Camera Presets
  const [officeTheme, setOfficeTheme] = useState<OfficeVisualTheme>('dark_neon');
  const [selectedAgentId, setSelectedAgentId] = useState<string>('agent-hoppi');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('room-hq');
  const [cameraPreset, setCameraPreset] = useState<'isometric' | 'hq' | 'lab' | 'studio' | 'lounge' | 'clients'>('isometric');
  const [patrolSpeed, setPatrolSpeed] = useState<number>(1);
  const [isGatheredAtBoard, setIsGatheredAtBoard] = useState<boolean>(false);
  const [liveDispatchNotice, setLiveDispatchNotice] = useState<string | null>(null);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (viewportContainerRef.current?.requestFullscreen) {
        viewportContainerRef.current.requestFullscreen().catch(() => {
          setIsFullscreen(!isFullscreen);
        });
      } else {
        setIsFullscreen(!isFullscreen);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {
          setIsFullscreen(false);
        });
      } else {
        setIsFullscreen(false);
      }
    }
    setTimeout(() => window.dispatchEvent(new Event('resize')), 150);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      setTimeout(() => window.dispatchEvent(new Event('resize')), 150);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // 6 Iconic Agents from video 1_af3ed796.mp4
  const agentsList: AgentCharacterData[] = useMemo(() => [
    {
      id: 'agent-hoppi',
      name: 'Hoppi (Chief)',
      vietnameseName: 'Tổng Chỉ Huy Hoppi',
      role: 'Tác nhân điều hành tối cao 24/7, giám sát 18 phòng ban & bộ nhớ RAG',
      colorHex: 0x0f172a, // Obsidian Dark Navy with Gold Accents
      colorTailwind: 'text-cyan-400 bg-cyan-950/80 border-cyan-500/40',
      status: 'Điều hành 24/7',
      currentTask: 'Điều phối luồng công việc DAG và phân bổ việc cho các agent',
      tools: ['Gemini 3.8 Flash', 'RAG Vector Memory', 'Terminal', 'Zero-Trust Mesh'],
      homeRoom: 'SAMS HQ',
      homePosition: [0, 0, 1.2],
      expression: '^ ^',
    },
    {
      id: 'agent-atlas',
      name: 'Atlas (Planner)',
      vietnameseName: 'Atlas • Lập Kế Hoạch',
      role: 'Kế hoạch đa bước (Multi-step DAG Planning), phân rã mục tiêu',
      colorHex: 0xf97316, // Vibrant Glossy Orange Candy
      colorTailwind: 'text-orange-400 bg-orange-950/80 border-orange-500/40',
      status: 'Đang thuyết trình',
      currentTask: 'Vẽ bảng Launch Plan, sơ đồ tuần tự và phân công nhiệm vụ',
      tools: ['Launch Board', 'Notion', 'AutoGPT', 'Slack'],
      homeRoom: 'SAMS HQ',
      homePosition: [-2.2, 0, -1.8],
      expression: '^ ^',
    },
    {
      id: 'agent-sage',
      name: 'Sage (Research)',
      vietnameseName: 'Sage • Nghiên Cứu & Nội Dung',
      role: 'Thu thập dữ liệu web, bóc tách tài liệu và nhân hóa tiếng Việt',
      colorHex: 0xe2e8f0, // Mirrored Chrome / Silver Metallic
      colorTailwind: 'text-slate-200 bg-slate-800 border-slate-600',
      status: 'Thu thập tri thức',
      currentTask: 'Cào dữ liệu từ 24+ GitHub Repositories và chuẩn bị bài viết',
      tools: ['Viet-Humanize', 'Google Search', 'Perplexity API', 'Obsidian'],
      homeRoom: 'BLOB Studio',
      homePosition: [2, 0, -8.5],
      expression: '◕ ‿ ◕',
    },
    {
      id: 'agent-blue',
      name: 'Blue (Engineer)',
      vietnameseName: 'Blue • Kỹ Thuật & Lập Trình',
      role: 'Tự động sinh code Full-stack, Next.js, Three.js và vá lỗi hệ thống',
      colorHex: 0x0284c7, // Vibrant Royal Blue Metallic
      colorTailwind: 'text-blue-400 bg-blue-950/80 border-blue-500/40',
      status: 'Viết mã nguồn',
      currentTask: 'Biên dịch AST module Smart Vector Cache và tối ưu WebGL 60fps',
      tools: ['VS Code', 'GitHub CLI', 'Docker', 'Vercel Labs'],
      homeRoom: 'Agent Lab',
      homePosition: [-10, 0, -8],
      expression: '• •',
    },
    {
      id: 'agent-ruby',
      name: 'Ruby (Security)',
      vietnameseName: 'Ruby • An Ninh & Kiểm Thử',
      role: 'Rà soát lỗ hổng, kiểm tra két bảo mật (Vault), phê duyệt HITL',
      colorHex: 0xef4444, // Candy Glossy Ruby Red
      colorTailwind: 'text-rose-400 bg-rose-950/80 border-rose-500/40',
      status: 'Giám sát két bảo mật',
      currentTask: 'Kiểm toán tính toàn vẹn khóa mã hóa và rà soát an ninh mạng LAN',
      tools: ['CTF-Skills', 'Wireshark', 'Vault Guardian', 'HITL Gate'],
      homeRoom: 'SAMS HQ',
      homePosition: [2.5, 0, 1.8],
      expression: '• •',
    },
    {
      id: 'agent-iris',
      name: 'Iris (Design)',
      vietnameseName: 'Iris • Thiết Kế & UI/UX',
      role: 'Xưởng hình ảnh thương mại, thiết kế áp phích và render 3D batch',
      colorHex: 0xa855f7, // Metallic Glossy Purple
      colorTailwind: 'text-purple-400 bg-purple-950/80 border-purple-500/40',
      status: 'Batch Rendering',
      currentTask: 'Xử lý batch thiết kế banner thương mại và phối màu aesthetic',
      tools: ['Figma', 'Seedream 5.0 Pro', 'Shadcn UI', 'Blender'],
      homeRoom: 'BLOB Studio',
      homePosition: [3.8, 0, -9.2],
      expression: '★ ★',
    },
  ], []);

  // 6 Zones matching the video layout exactly:
  // Center: SAMS HQ | Top-Left: Agent Lab | Top-Center: BLOB Studio | Top-Right: Game Worlds | Middle-Right: Lounge | Bottom-Right: Landing Clients
  const roomZones = useMemo(() => [
    {
      id: 'room-hq',
      name: 'SAMS HQ',
      vietnameseTitle: 'TỔNG HÀNH DINH • PHÒNG CHỈ HUY TRUNG TÂM',
      colorHex: 0xf59e0b, // Warm Amber/Gold
      position: [0, 0, 1],
      size: [10.5, 8.5],
      badgeText: 'HQ Command Center',
      tagCount: '6 Agents Active',
      subText: 'Launch Plan Whiteboard • Két Bảo Mật Vault • Bàn Hội Nghị',
    },
    {
      id: 'room-lab',
      name: 'Agent Lab',
      vietnameseTitle: 'PHÒNG THÍ NGHIỆM TÁC NHÂN (AGENT LAB)',
      colorHex: 0x06b6d4, // Electric Cyan
      position: [-10.5, 0, -8],
      size: [8.5, 6.8],
      badgeText: '233 Tasks',
      tagCount: 'R&D / Server Racks',
      subText: 'Workstations Code • Tia Laser Quét Dữ Liệu • Docker Mesh',
    },
    {
      id: 'room-studio',
      name: 'BLOB Studio',
      vietnameseTitle: 'XƯỞNG THIẾT KẾ ĐỒ HỌA & BATCH MEDIA',
      colorHex: 0xf97316, // Bright Orange
      position: [2.5, 0, -9],
      size: [9.2, 6.8],
      badgeText: 'Media Batch',
      tagCount: 'From Brief to Batch',
      subText: 'Màn hình hiển thị lớn • Camera Tripod • Đèn Softbox Studio',
    },
    {
      id: 'room-gameworlds',
      name: 'Game Worlds',
      vietnameseTitle: 'KHU MÔI TRƯỜNG ẢO & SANDBOX (GAME WORLDS)',
      colorHex: 0xd946ef, // Magenta / Purple
      position: [12.5, 0, -7.5],
      size: [8.2, 6.8],
      badgeText: 'Virtual Sandbox',
      tagCount: 'Spatial 3D',
      subText: 'Khối chiếu Hologram 3D • Mô phỏng thế giới ảo WebGL',
    },
    {
      id: 'room-lounge',
      name: 'Lounge',
      vietnameseTitle: 'KHÔNG GIAN NGHỈ NGƠI & TIẾP KHÁCH (LOUNGE)',
      colorHex: 0xeab308, // Warm Gold
      position: [12.5, 0, 1.8],
      size: [8.2, 6.8],
      badgeText: 'Rest Area',
      tagCount: 'Coffee & Chill',
      subText: 'Sofa xám cao cấp • Bàn trà kính • Cây xanh văn phòng',
    },
    {
      id: 'room-clients',
      name: 'Landing Clients',
      vietnameseTitle: 'PHÒNG CSKH & ĐỐI TÁC (LANDING CLIENTS)',
      colorHex: 0x3b82f6, // Royal Blue
      position: [10.5, 0, 9.5],
      size: [8.8, 6.5],
      badgeText: 'CRM Partners',
      tagCount: 'Client Onboarding',
      subText: 'Bàn phê duyệt HITL • Thẻ xác nhận "You say yes" • Zalo OA',
    },
  ], []);

  // Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software rendering fallback
    let isSoftwareGl = false;
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl');
      if (gl) {
        const dbg = gl.getExtension('WEBGL_debug_renderer_info');
        if (dbg) {
          const rendererStr = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL).toLowerCase();
          if (rendererStr.includes('swiftshader') || rendererStr.includes('llvmpipe')) {
            isSoftwareGl = true;
          }
        }
      }
    } catch {}

    const scene = new THREE.Scene();

    // Background color matching the video's dark reflective atmosphere
    const bgColor = officeTheme === 'dark_neon'
      ? 0x070b14 // Deep reflective obsidian night
      : officeTheme === 'studio_white'
      ? 0xf8fafc // Apple Mac Studio clean off-white
      : 0x021d30; // Blueprint navy
    scene.background = new THREE.Color(bgColor);

    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    // Initial Isometric high-angle view matching 00:00 of video 1_af3ed796.mp4
    camera.position.set(22, 28, 28);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (!isSoftwareGl) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.minDistance = 8;
    controls.maxDistance = 75;
    controls.target.set(0, 0, 0);

    // Lighting
    if (officeTheme === 'dark_neon') {
      const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x050914, 0.7);
      scene.add(hemiLight);

      const mainSpot = new THREE.DirectionalLight(0xffffff, 1.2);
      mainSpot.position.set(15, 35, 20);
      if (!isSoftwareGl) {
        mainSpot.castShadow = true;
        mainSpot.shadow.mapSize.width = 2048;
        mainSpot.shadow.mapSize.height = 2048;
        mainSpot.shadow.camera.near = 1;
        mainSpot.shadow.camera.far = 120;
        const d = 28;
        mainSpot.shadow.camera.left = -d;
        mainSpot.shadow.camera.right = d;
        mainSpot.shadow.camera.top = d;
        mainSpot.shadow.camera.bottom = -d;
        mainSpot.shadow.bias = -0.0004;
      }
      scene.add(mainSpot);

      // Dedicated Point Lights inside each room for rich neon specular reflection
      const p1 = new THREE.PointLight(0xf59e0b, 1.8, 25);
      p1.position.set(0, 5, 1);
      scene.add(p1);

      const p2 = new THREE.PointLight(0x06b6d4, 1.6, 22);
      p2.position.set(-10, 5, -8);
      scene.add(p2);

      const p3 = new THREE.PointLight(0xf97316, 1.6, 22);
      p3.position.set(2.5, 5, -9);
      scene.add(p3);

      const p4 = new THREE.PointLight(0xd946ef, 1.5, 20);
      p4.position.set(12.5, 5, -7.5);
      scene.add(p4);

      const p5 = new THREE.PointLight(0xeab308, 1.4, 20);
      p5.position.set(12.5, 5, 1.8);
      scene.add(p5);

      const p6 = new THREE.PointLight(0x3b82f6, 1.5, 20);
      p6.position.set(10.5, 5, 9.5);
      scene.add(p6);
    } else {
      // Studio White clean lighting
      const hemi = new THREE.HemisphereLight(0xffffff, 0xe2e8f0, 1.2);
      scene.add(hemi);
      const sun = new THREE.DirectionalLight(0xfffbeb, 1.4);
      sun.position.set(18, 32, 16);
      scene.add(sun);
      const fill = new THREE.DirectionalLight(0xe0f2fe, 0.7);
      fill.position.set(-16, 20, -14);
      scene.add(fill);
    }

    // ========================================================
    // 1. FLOOR: HIGH-GLOSS REFLECTIVE OBSIDIAN SURFACE
    // ========================================================
    const floorGeo = new THREE.PlaneGeometry(48, 38);
    const floorMat = new THREE.MeshStandardMaterial({
      color: officeTheme === 'dark_neon' ? 0x090e1a : officeTheme === 'studio_white' ? 0xf1f5f9 : 0x031c2e,
      roughness: officeTheme === 'dark_neon' ? 0.12 : 0.35,
      metalness: officeTheme === 'dark_neon' ? 0.35 : 0.05,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = !isSoftwareGl;
    scene.add(floorMesh);

    // Subtle dark grid
    const grid1 = officeTheme === 'dark_neon' ? 0x1e293b : 0xcbd5e1;
    const grid2 = officeTheme === 'dark_neon' ? 0x0f172a : 0xe2e8f0;
    const gridHelper = new THREE.GridHelper(48, 48, grid1, grid2);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // Interactive meshes for clicking
    const interactiveRoomMeshes: THREE.Mesh[] = [];
    const interactiveAgentMeshes: { mesh: THREE.Object3D; data: AgentCharacterData }[] = [];

    // Helper: Create Floating 3D Room Signboard (matching exact video look)
    const createFloatingRoomLabel = (title: string, tag: string, x: number, z: number, colorHex: number) => {
      const labelGroup = new THREE.Group();
      labelGroup.position.set(x, 4.0, z);
      labelGroup.rotation.x = -Math.PI / 10; // tilt towards isometric view

      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 140;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, 512, 140);

        // Dark pill background
        ctx.fillStyle = 'rgba(11, 16, 27, 0.92)';
        ctx.beginPath();
        ctx.roundRect(10, 10, 492, 120, 24);
        ctx.fill();

        // Neon outline
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#' + colorHex.toString(16).padStart(6, '0');
        ctx.stroke();

        // Pin icon circle
        ctx.fillStyle = '#' + colorHex.toString(16).padStart(6, '0');
        ctx.beginPath();
        ctx.arc(42, 70, 10, 0, Math.PI * 2);
        ctx.fill();

        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px "Plus Jakarta Sans", Arial, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(title, 66, 68);

        // Sub tag
        ctx.fillStyle = '#94a3b8';
        ctx.font = '22px monospace';
        ctx.fillText(`● ${tag}`, 66, 106);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      const signMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(3.6, 1.0),
        new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide })
      );
      labelGroup.add(signMesh);

      // Support stem
      const stemGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8);
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.set(0, -0.6, 0);
      labelGroup.add(stem);

      scene.add(labelGroup);
      return labelGroup;
    };

    // ========================================================
    // 2. RENDER THE 6 ROOMS WITH ROUNDED NEON BOUNDARIES
    // ========================================================
    roomZones.forEach((room) => {
      const [rx, ry, rz] = room.position;
      const [w, h] = room.size;

      // Room Floor Mat with soft ambient glow
      const roomFloorGeo = new THREE.PlaneGeometry(w, h);
      const roomFloorMat = new THREE.MeshStandardMaterial({
        color: officeTheme === 'dark_neon' ? 0x0c1322 : 0xffffff,
        roughness: 0.25,
        metalness: 0.2,
      });
      const roomFloor = new THREE.Mesh(roomFloorGeo, roomFloorMat);
      roomFloor.rotation.x = -Math.PI / 2;
      roomFloor.position.set(rx, 0.02, rz);
      roomFloor.receiveShadow = !isSoftwareGl;
      roomFloor.userData = { roomId: room.id, roomName: room.name };
      scene.add(roomFloor);
      interactiveRoomMeshes.push(roomFloor);

      // Rounded Neon Wall Border around each room
      const neonLinePoints = [
        new THREE.Vector3(rx - w / 2, 0.08, rz - h / 2),
        new THREE.Vector3(rx + w / 2, 0.08, rz - h / 2),
        new THREE.Vector3(rx + w / 2, 0.08, rz + h / 2),
        new THREE.Vector3(rx - w / 2, 0.08, rz + h / 2),
        new THREE.Vector3(rx - w / 2, 0.08, rz - h / 2),
      ];
      const neonBorderGeo = new THREE.BufferGeometry().setFromPoints(neonLinePoints);
      const neonBorderMat = new THREE.LineBasicMaterial({
        color: room.colorHex,
        linewidth: 4,
      });
      const neonLine = new THREE.Line(neonBorderGeo, neonBorderMat);
      scene.add(neonLine);

      // Overhead Floating Signboard
      createFloatingRoomLabel(room.name, room.badgeText, rx, rz - h / 2 + 0.5, room.colorHex);

      // Room Specific Props (Matching Video Props)
      if (room.id === 'room-hq') {
        // --- 1. SAMS HQ: LAUNCH PLAN WHITEBOARD ("Thinking, drawn out.") ---
        const boardGroup = new THREE.Group();
        boardGroup.position.set(rx - 0.5, 0, rz - 2.6);

        // Whiteboard Canvas Texture with diagram & sticky notes
        const wbCanvas = document.createElement('canvas');
        wbCanvas.width = 640;
        wbCanvas.height = 380;
        const wbCtx = wbCanvas.getContext('2d');
        if (wbCtx) {
          wbCtx.fillStyle = '#ffffff';
          wbCtx.fillRect(0, 0, 640, 380);

          // Header
          wbCtx.fillStyle = '#0f172a';
          wbCtx.font = 'bold 32px "Plus Jakarta Sans", Arial, sans-serif';
          wbCtx.fillText('★ LAUNCH PLAN • HOPPI v4.0', 40, 50);

          // Flowchart Diagram Nodes
          wbCtx.fillStyle = '#f97316';
          wbCtx.fillRect(40, 90, 160, 60);
          wbCtx.fillStyle = '#ffffff';
          wbCtx.font = 'bold 18px Arial';
          wbCtx.fillText('1. RESEARCH', 55, 126);

          wbCtx.strokeStyle = '#64748b';
          wbCtx.lineWidth = 4;
          wbCtx.beginPath();
          wbCtx.moveTo(200, 120);
          wbCtx.lineTo(240, 120);
          wbCtx.stroke();

          wbCtx.fillStyle = '#0284c7';
          wbCtx.fillRect(240, 90, 160, 60);
          wbCtx.fillStyle = '#ffffff';
          wbCtx.fillText('2. BUILD THE FLOW', 248, 126);

          wbCtx.beginPath();
          wbCtx.moveTo(400, 120);
          wbCtx.lineTo(440, 120);
          wbCtx.stroke();

          wbCtx.fillStyle = '#10b981';
          wbCtx.fillRect(440, 90, 160, 60);
          wbCtx.fillStyle = '#ffffff';
          wbCtx.fillText('3. SHIP ON STAGING', 448, 126);

          // Colorful Sticky Notes (pink, yellow, cyan)
          wbCtx.fillStyle = '#fef08a'; // yellow sticky
          wbCtx.fillRect(40, 180, 120, 120);
          wbCtx.fillStyle = '#713f12';
          wbCtx.font = '14px Arial';
          wbCtx.fillText('• 29 Skills ready', 48, 210);
          wbCtx.fillText('• Fast RAG Sync', 48, 235);
          wbCtx.fillText('• Smart Cache', 48, 260);

          wbCtx.fillStyle = '#fbcfe8'; // pink sticky
          wbCtx.fillRect(180, 180, 120, 120);
          wbCtx.fillStyle = '#831843';
          wbCtx.fillText('• 10 Slides Deck', 188, 210);
          wbCtx.fillText('• UGC Video Script', 188, 235);
          wbCtx.fillText('• ZenTea Web Page', 188, 260);

          wbCtx.fillStyle = '#bae6fd'; // cyan sticky
          wbCtx.fillRect(320, 180, 120, 120);
          wbCtx.fillStyle = '#0c4a6e';
          wbCtx.fillText('• Desktop Overlay', 328, 210);
          wbCtx.fillText('• FaceID Security', 328, 235);
          wbCtx.fillText('• 18 AI Agents', 328, 260);
        }

        const wbTex = new THREE.CanvasTexture(wbCanvas);
        const wbMat = new THREE.MeshStandardMaterial({ map: wbTex, roughness: 0.3 });
        const wbMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.2), wbMat);
        wbMesh.position.set(0, 1.8, 0);
        boardGroup.add(wbMesh);

        // Frame and legs
        const frameMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
        const frameL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.8, 8), frameMat);
        frameL.position.set(-1.85, 1.4, 0);
        boardGroup.add(frameL);
        const frameR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.8, 8), frameMat);
        frameR.position.set(1.85, 1.4, 0);
        boardGroup.add(frameR);

        scene.add(boardGroup);

        // --- 2. SAMS HQ: EXECUTIVE DESK & LAPTOPS ---
        const deskMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2 });
        const desk = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.12, 1.4), deskMat);
        desk.position.set(rx, 0.95, rz + 0.8);
        scene.add(desk);

        // Chrome legs
        const legMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.1 });
        [-1.6, 1.6].forEach((dx) => {
          [-0.5, 0.5].forEach((dz) => {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.95, 8), legMat);
            leg.position.set(rx + dx, 0.475, rz + 0.8 + dz);
            scene.add(leg);
          });
        });

        // Glowing Laptop on desk
        const laptopMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });
        const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.02, 0.35), laptopMat);
        laptopBase.position.set(rx, 1.02, rz + 0.8);
        scene.add(laptopBase);
        const laptopScreen = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 0.35, 0.02),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
        );
        laptopScreen.position.set(rx, 1.2, rz + 0.65);
        laptopScreen.rotation.x = -0.2;
        scene.add(laptopScreen);

        // --- 3. SAMS HQ: METALLIC SAFE BOX ("Vault" - 00:43 in video) ---
        const safeGroup = new THREE.Group();
        safeGroup.position.set(rx + 3.4, 0.6, rz - 2.4);

        const safeMat = new THREE.MeshStandardMaterial({
          color: 0x64748b,
          metalness: 0.92,
          roughness: 0.18,
        });
        const safeBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.1), safeMat);
        safeGroup.add(safeBody);

        // Rotary dial wheel on door
        const dialMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.05 });
        const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.08, 16), dialMat);
        dial.rotation.x = Math.PI / 2;
        dial.position.set(0, 0.1, 0.58);
        safeGroup.add(dial);

        // Handle
        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 0.06), dialMat);
        handle.position.set(0.3, 0.1, 0.6);
        safeGroup.add(handle);

        scene.add(safeGroup);

        // --- 4. SAMS HQ: POTTED PLANT ---
        const potMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
        const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.2, 0.5, 12), potMat);
        pot.position.set(rx - 3.8, 0.25, rz + 2.8);
        scene.add(pot);
        const leafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.4 });
        for (let l = 0; l < 5; l++) {
          const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), leafMat);
          leaf.scale.set(1, 0.3, 1.5);
          leaf.rotation.y = (l * Math.PI) / 2.5;
          leaf.position.set(rx - 3.8, 0.55 + l * 0.08, rz + 2.8);
          scene.add(leaf);
        }
      }

      // --- AGENT LAB PROPS: Workstations, Server Racks & Laser ---
      if (room.id === 'room-lab') {
        const desk = new THREE.Mesh(
          new THREE.BoxGeometry(3.0, 0.1, 1.2),
          new THREE.MeshStandardMaterial({ color: 0x1e293b })
        );
        desk.position.set(rx, 0.95, rz);
        scene.add(desk);

        // Dual Monitors
        const monMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
        const monL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.04), monMat);
        monL.position.set(rx - 0.45, 1.4, rz - 0.3);
        monL.rotation.y = 0.15;
        scene.add(monL);
        const monR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.04), monMat);
        monR.position.set(rx + 0.45, 1.4, rz - 0.3);
        monR.rotation.y = -0.15;
        scene.add(monR);

        // Server Rack in corner
        const serverMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });
        const server = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.2, 0.8), serverMat);
        server.position.set(rx - 2.8, 1.1, rz - 2.0);
        scene.add(server);
      }

      // --- BLOB STUDIO PROPS: Curved Big Screen & Camera ---
      if (room.id === 'room-studio') {
        // Big Display Screen Wall
        const studioScreenMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
        const bigScreen = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.8, 0.08), studioScreenMat);
        bigScreen.position.set(rx, 1.6, rz - 2.2);
        scene.add(bigScreen);

        // Camera Tripod
        const camMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 });
        const camHead = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.4), camMat);
        camHead.position.set(rx + 2.5, 1.5, rz + 1.2);
        scene.add(camHead);
        const tripod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.25, 1.5, 6), camMat);
        tripod.position.set(rx + 2.5, 0.75, rz + 1.2);
        scene.add(tripod);
      }

      // --- LOUNGE PROPS: Sofa & Coffee Table ---
      if (room.id === 'room-lounge') {
        const sofaMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6 });
        const sofa = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.5, 1.2), sofaMat);
        sofa.position.set(rx, 0.35, rz - 1.2);
        scene.add(sofa);
        const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.7, 0.3), sofaMat);
        sofaBack.position.set(rx, 0.75, rz - 1.65);
        scene.add(sofaBack);

        // Coffee table
        const tableMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.1 });
        const table = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.3, 0.9), tableMat);
        table.position.set(rx, 0.25, rz + 0.6);
        scene.add(table);
      }

      // --- LANDING CLIENTS PROPS: Approval Card ("It does the legwork. You say yes.") ---
      if (room.id === 'room-clients') {
        const cDesk = new THREE.Mesh(
          new THREE.BoxGeometry(2.8, 0.1, 1.2),
          new THREE.MeshStandardMaterial({ color: 0x1e293b })
        );
        cDesk.position.set(rx, 0.95, rz);
        scene.add(cDesk);

        // Floating Approval card HUD
        const appCardCanvas = document.createElement('canvas');
        appCardCanvas.width = 300;
        appCardCanvas.height = 180;
        const aCtx = appCardCanvas.getContext('2d');
        if (aCtx) {
          aCtx.fillStyle = 'rgba(15, 23, 42, 0.95)';
          aCtx.beginPath();
          aCtx.roundRect(10, 10, 280, 160, 16);
          aCtx.fill();
          aCtx.strokeStyle = '#38bdf8';
          aCtx.lineWidth = 3;
          aCtx.stroke();

          aCtx.fillStyle = '#ffffff';
          aCtx.font = 'bold 20px Arial';
          aCtx.fillText('Client Proposal #429', 24, 45);
          aCtx.fillStyle = '#94a3b8';
          aCtx.font = '14px Arial';
          aCtx.fillText('Scope of Work: Zalo CRM', 24, 75);
          aCtx.fillText('Status: Awaiting Approval', 24, 100);

          aCtx.fillStyle = '#10b981';
          aCtx.fillRect(24, 120, 110, 35);
          aCtx.fillStyle = '#ffffff';
          aCtx.font = 'bold 15px Arial';
          aCtx.fillText('✓ Duyệt (Yes)', 35, 143);

          aCtx.fillStyle = '#334155';
          aCtx.fillRect(150, 120, 110, 35);
          aCtx.fillStyle = '#ffffff';
          aCtx.fillText('Sửa lại', 180, 143);
        }
        const appTex = new THREE.CanvasTexture(appCardCanvas);
        const appCard = new THREE.Mesh(
          new THREE.PlaneGeometry(1.8, 1.1),
          new THREE.MeshBasicMaterial({ map: appTex, transparent: true, side: THREE.DoubleSide })
        );
        appCard.position.set(rx, 1.8, rz + 0.2);
        appCard.rotation.x = -0.2;
        scene.add(appCard);
      }
    });

    // ========================================================
    // 3. GLOWING NEON PATHWAY TRACKS (Connecting all 6 rooms)
    // ========================================================
    const trackPoints: THREE.Vector3[] = [
      new THREE.Vector3(-10.5, 0.05, -8),  // Agent Lab
      new THREE.Vector3(-4, 0.05, -8),
      new THREE.Vector3(2.5, 0.05, -9),   // BLOB Studio
      new THREE.Vector3(8, 0.05, -8.5),
      new THREE.Vector3(12.5, 0.05, -7.5), // Game Worlds
      new THREE.Vector3(12.5, 0.05, 1.8),  // Lounge
      new THREE.Vector3(10.5, 0.05, 9.5),  // Landing Clients
      new THREE.Vector3(4, 0.05, 7),
      new THREE.Vector3(0, 0.05, 1),       // SAMS HQ Center
      new THREE.Vector3(-6, 0.05, 1),
      new THREE.Vector3(-10.5, 0.05, -3),
      new THREE.Vector3(-10.5, 0.05, -8),  // Back to Lab
    ];

    const trackCurve = new THREE.CatmullRomCurve3(trackPoints, true);
    const trackPointsDense = trackCurve.getPoints(160);
    const trackGeo = new THREE.BufferGeometry().setFromPoints(trackPointsDense);
    const trackMat = new THREE.LineBasicMaterial({
      color: 0xf59e0b, // Bright golden neon track
      linewidth: 3,
    });
    const trackLine = new THREE.Line(trackGeo, trackMat);
    scene.add(trackLine);

    // Glowing energy pulses moving along the track
    const energyPulses: { mesh: THREE.Mesh; t: number; speed: number }[] = [];
    for (let i = 0; i < 12; i++) {
      const pulseMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 8, 8),
        new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x38bdf8 : 0xfbbf24 })
      );
      pulseMesh.position.copy(trackPoints[0]);
      scene.add(pulseMesh);
      energyPulses.push({
        mesh: pulseMesh,
        t: (i / 12),
        speed: 0.04 + Math.random() * 0.02,
      });
    }

    // ========================================================
    // 4. THE 6 3D FIGURINE ROBOTS ("Meet the team")
    // ========================================================
    const robotMeshes: {
      group: THREE.Group;
      data: AgentCharacterData;
      tTrack: number;
      isPatrolling: boolean;
      headMesh: THREE.Mesh;
      haloMesh?: THREE.Mesh;
    }[] = [];

    // Helper: Create High-Fidelity Candy/Chrome Robot Character
    const createCandyRobotFigurine = (agent: AgentCharacterData) => {
      const group = new THREE.Group();
      const [hx, hy, hz] = agent.homePosition;
      group.position.set(hx, hy, hz);

      // Body Material: Glossy Candy / Metallic Chrome with Clearcoat
      const isChrome = agent.name.includes('Sage');
      const bodyMat = new THREE.MeshStandardMaterial({
        color: agent.colorHex,
        roughness: isChrome ? 0.05 : 0.12,
        metalness: isChrome ? 0.95 : 0.6,
      });

      // 1. Torso (Chubby Capsule/Pear shape)
      const torso = new THREE.Mesh(new THREE.SphereGeometry(0.32, 18, 18), bodyMat);
      torso.scale.set(1.0, 1.25, 0.95);
      torso.position.set(0, 0.75, 0);
      torso.castShadow = !isSoftwareGl;
      group.add(torso);

      // White Belly Accent Button
      const belly = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
      );
      belly.position.set(0, 0.72, 0.28);
      belly.scale.set(1, 1, 0.3);
      group.add(belly);

      // 2. Head (Rounded Visor Helmet)
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 1.35, 0);

      const headHelmet = new THREE.Mesh(
        new THREE.SphereGeometry(0.34, 20, 20),
        bodyMat
      );
      headHelmet.scale.set(1.15, 0.95, 1.05);
      headHelmet.castShadow = !isSoftwareGl;
      headGroup.add(headHelmet);

      // Dark Face Screen Visor
      const visorMat = new THREE.MeshStandardMaterial({
        color: 0x050914,
        roughness: 0.1,
        metalness: 0.8,
      });
      const visor = new THREE.Mesh(
        new THREE.SphereGeometry(0.26, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5),
        visorMat
      );
      visor.rotation.x = Math.PI / 2;
      visor.position.set(0, 0, 0.18);
      visor.scale.set(1.1, 0.7, 0.9);
      headGroup.add(visor);

      // Glowing Eyes Dynamic Canvas
      const eyeCanvas = document.createElement('canvas');
      eyeCanvas.width = 128;
      eyeCanvas.height = 64;
      const eyeCtx = eyeCanvas.getContext('2d');
      if (eyeCtx) {
        eyeCtx.fillStyle = '#050914';
        eyeCtx.fillRect(0, 0, 128, 64);

        eyeCtx.fillStyle = '#38bdf8';
        if (agent.expression === '^ ^') {
          // Smiling curved eyes
          eyeCtx.lineWidth = 6;
          eyeCtx.strokeStyle = '#38bdf8';
          eyeCtx.beginPath();
          eyeCtx.arc(40, 36, 16, Math.PI, 0);
          eyeCtx.stroke();
          eyeCtx.beginPath();
          eyeCtx.arc(88, 36, 16, Math.PI, 0);
          eyeCtx.stroke();
        } else if (agent.expression === '• •') {
          // Focused dots
          eyeCtx.beginPath();
          eyeCtx.arc(40, 32, 10, 0, Math.PI * 2);
          eyeCtx.fill();
          eyeCtx.beginPath();
          eyeCtx.arc(88, 32, 10, 0, Math.PI * 2);
          eyeCtx.fill();
        } else {
          // Happy big circles
          eyeCtx.beginPath();
          eyeCtx.arc(40, 32, 14, 0, Math.PI * 2);
          eyeCtx.fill();
          eyeCtx.beginPath();
          eyeCtx.arc(88, 32, 14, 0, Math.PI * 2);
          eyeCtx.fill();
          eyeCtx.fillStyle = '#ffffff';
          eyeCtx.beginPath();
          eyeCtx.arc(44, 28, 5, 0, Math.PI * 2);
          eyeCtx.fill();
          eyeCtx.beginPath();
          eyeCtx.arc(92, 28, 5, 0, Math.PI * 2);
          eyeCtx.fill();
        }
      }
      const eyeTex = new THREE.CanvasTexture(eyeCanvas);
      const eyePlane = new THREE.Mesh(
        new THREE.PlaneGeometry(0.38, 0.18),
        new THREE.MeshBasicMaterial({ map: eyeTex, transparent: true })
      );
      eyePlane.position.set(0, 0, 0.35);
      headGroup.add(eyePlane);

      // Antenna / Halo Ring for Hoppi
      let halo: THREE.Mesh | undefined;
      if (agent.id === 'agent-hoppi') {
        const haloGeo = new THREE.TorusGeometry(0.28, 0.04, 8, 24);
        const haloMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        halo = new THREE.Mesh(haloGeo, haloMat);
        halo.rotation.x = Math.PI / 2;
        halo.position.set(0, 0.52, 0);
        headGroup.add(halo);
      } else {
        // Cute Antenna
        const antStem = new THREE.Mesh(
          new THREE.CylinderGeometry(0.02, 0.02, 0.22, 6),
          bodyMat
        );
        antStem.position.set(0, 0.42, 0);
        headGroup.add(antStem);
        const antBall = new THREE.Mesh(
          new THREE.SphereGeometry(0.06, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        antBall.position.set(0, 0.54, 0);
        headGroup.add(antBall);
      }

      group.add(headGroup);

      // 3. Cute Float Feet / Limbs
      const footMat = bodyMat;
      const footL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), footMat);
      footL.position.set(-0.18, 0.18, 0);
      footL.scale.set(1, 0.6, 1.4);
      group.add(footL);
      const footR = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), footMat);
      footR.position.set(0.18, 0.18, 0);
      footR.scale.set(1, 0.6, 1.4);
      group.add(footR);

      // 4. Floating Overhead Name Pill Tag
      const tagCanvas = document.createElement('canvas');
      tagCanvas.width = 256;
      tagCanvas.height = 72;
      const tCtx = tagCanvas.getContext('2d');
      if (tCtx) {
        tCtx.fillStyle = 'rgba(11, 16, 27, 0.9)';
        tCtx.beginPath();
        tCtx.roundRect(4, 4, 248, 64, 18);
        tCtx.fill();
        tCtx.strokeStyle = '#' + agent.colorHex.toString(16).padStart(6, '0');
        tCtx.lineWidth = 4;
        tCtx.stroke();

        tCtx.fillStyle = '#ffffff';
        tCtx.font = 'bold 24px "Plus Jakarta Sans", Arial, sans-serif';
        tCtx.textAlign = 'center';
        tCtx.fillText(agent.name.split(' ')[0], 128, 44);
      }
      const tagTex = new THREE.CanvasTexture(tagCanvas);
      const tagMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.6, 0.45),
        new THREE.MeshBasicMaterial({ map: tagTex, transparent: true, side: THREE.DoubleSide })
      );
      tagMesh.position.set(0, 2.3, 0);
      group.add(tagMesh);

      scene.add(group);
      interactiveAgentMeshes.push({ mesh: torso, data: agent });

      return {
        group,
        data: agent,
        tTrack: Math.random(),
        isPatrolling: agent.id === 'agent-blue' || agent.id === 'agent-ruby',
        headMesh: headHelmet,
        haloMesh: halo,
      };
    };

    agentsList.forEach((agent) => {
      const bot = createCandyRobotFigurine(agent);
      robotMeshes.push(bot);
    });

    // ========================================================
    // 5. INTERACTIVE RAYCASTING FOR CLICK & HOVER
    // ========================================================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check agent click first
      const agentMeshesToCheck = interactiveAgentMeshes.map((a) => a.mesh);
      const agentHits = raycaster.intersectObjects(agentMeshesToCheck, true);
      if (agentHits.length > 0) {
        const hitObj = agentHits[0].object;
        const matched = interactiveAgentMeshes.find(
          (a) => a.mesh === hitObj || a.mesh.parent === hitObj.parent
        );
        if (matched) {
          setSelectedAgentId(matched.data.id);
          if (onSpeakText) {
            onSpeakText(`Tác nhân ${matched.data.vietnameseName} đang hoạt động tại ${matched.data.homeRoom}`);
          }
          return;
        }
      }

      // Check room floor click
      const roomHits = raycaster.intersectObjects(interactiveRoomMeshes);
      if (roomHits.length > 0) {
        const roomId = roomHits[0].object.userData.roomId;
        const roomName = roomHits[0].object.userData.roomName;
        if (roomId) {
          setSelectedRoomId(roomId);
          if (onSpeakText) {
            onSpeakText(`Chuyển tầm nhìn đến ${roomName}`);
          }
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // ========================================================
    // 6. ANIMATION & RENDER LOOP
    // ========================================================
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // 1. Animate Energy Pulses along tracks
      energyPulses.forEach((p) => {
        p.t = (p.t + delta * p.speed * patrolSpeed) % 1;
        const pt = trackCurve.getPoint(p.t);
        p.mesh.position.copy(pt);
        p.mesh.position.y = 0.08 + Math.sin(elapsed * 4 + p.t * 10) * 0.04;
      });

      // 2. Animate Robots (Breathe, Patrol, or Gather at Board)
      robotMeshes.forEach((bot, idx) => {
        // Idle breathing bob
        bot.group.position.y = Math.sin(elapsed * 2.5 + idx * 1.2) * 0.05;

        // Halo rotation for Hoppi
        if (bot.haloMesh) {
          bot.haloMesh.rotation.z += delta * 1.5;
        }

        // If gathered at board: Move to whiteboard
        if (isGatheredAtBoard) {
          const targetPos = new THREE.Vector3(
            -2.5 + idx * 0.9,
            0,
            -1.0 + Math.sin(idx) * 0.3
          );
          bot.group.position.lerp(targetPos, delta * 2.5);
          bot.group.lookAt(-0.5, 1.5, -2.6); // look at board
        } else if (bot.isPatrolling) {
          // Patrol along the track
          bot.tTrack = (bot.tTrack + delta * 0.03 * patrolSpeed) % 1;
          const posOnTrack = trackCurve.getPoint(bot.tTrack);
          const nextPos = trackCurve.getPoint((bot.tTrack + 0.01) % 1);

          bot.group.position.set(posOnTrack.x, 0, posOnTrack.z);
          bot.group.lookAt(nextPos.x, 0, nextPos.z);
        } else {
          // Return to home position
          const [hx, hy, hz] = bot.data.homePosition;
          bot.group.position.lerp(new THREE.Vector3(hx, 0, hz), delta * 2);
        }
      });

      // 3. Smooth Camera Transitions for Presets
      let targetCamPos = new THREE.Vector3(22, 28, 28);
      let targetLookAt = new THREE.Vector3(0, 0, 0);

      if (cameraPreset === 'isometric') {
        targetCamPos.set(20, 26, 26);
        targetLookAt.set(0, 0, 0);
      } else if (cameraPreset === 'hq') {
        targetCamPos.set(5, 7, 7);
        targetLookAt.set(0, 1.2, 1);
      } else if (cameraPreset === 'lab') {
        targetCamPos.set(-5, 6, -3);
        targetLookAt.set(-10.5, 1, -8);
      } else if (cameraPreset === 'studio') {
        targetCamPos.set(4, 6, -4);
        targetLookAt.set(2.5, 1, -9);
      } else if (cameraPreset === 'lounge') {
        targetCamPos.set(14, 5, 5);
        targetLookAt.set(12.5, 1, 1.8);
      } else if (cameraPreset === 'clients') {
        targetCamPos.set(12, 5, 12);
        targetLookAt.set(10.5, 1, 9.5);
      }

      // Smooth interpolation when switching presets
      camera.position.lerp(targetCamPos, delta * 2.5);
      controls.target.lerp(targetLookAt, delta * 2.5);

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, [officeTheme, cameraPreset, patrolSpeed, isGatheredAtBoard, roomZones, agentsList]);

  // Selected Agent Data
  const currentAgent = agentsList.find((a) => a.id === selectedAgentId) || agentsList[0];
  const currentRoom = roomZones.find((r) => r.id === selectedRoomId) || roomZones[0];

  const handleGatherAtBoard = () => {
    setIsGatheredAtBoard(true);
    setCameraPreset('hq');
    const msg = 'Đã triệu tập tất cả các AI Agent về bảng Launch Plan tại SAMS HQ để họp điều hành!';
    setLiveDispatchNotice(msg);
    if (onSpeakText) onSpeakText(msg);
    setTimeout(() => setLiveDispatchNotice(null), 4500);
  };

  const handleResumePatrol = () => {
    setIsGatheredAtBoard(false);
    setCameraPreset('isometric');
    const msg = 'Các AI Agent tiếp tục tuần tra trên đường ray neon và thực thi tác vụ chuyên trách.';
    setLiveDispatchNotice(msg);
    if (onSpeakText) onSpeakText(msg);
    setTimeout(() => setLiveDispatchNotice(null), 4500);
  };

  const handleDispatchTaskToAgent = (agent: AgentCharacterData) => {
    const prompt = `[LỆNH ĐIỀU PHỐI TỔNG HÀNH DINH 3D] Giao việc cho ${agent.vietnameseName}: Thực thi tác vụ "${agent.currentTask}" bằng các công cụ: ${agent.tools.join(', ')}.`;
    if (onDispatchCommand) {
      onDispatchCommand(prompt);
    }
    setLiveDispatchNotice(`✓ Đã phát lệnh tới ${agent.name}!`);
    setTimeout(() => setLiveDispatchNotice(null), 3000);
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Banner: Video 1_af3ed796.mp4 Reference Inspiration */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border transition-all ${
          officeTheme === 'dark_neon'
            ? 'bg-gradient-to-r from-slate-950 via-[#0a1124] to-[#070b14] border-cyan-500/40 shadow-xl shadow-cyan-500/10'
            : 'bg-gradient-to-r from-slate-50 via-white to-blue-50 border-slate-300 shadow-md text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-600/30 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/20">
              <Building2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                  TỔNG HÀNH DINH AI 3D • SAMS AGENT OFFICE
                </h2>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  TIKTOK @AXIAL.STUDIO 3D ENGINE
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  OPUS 5.5 LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Sàn đen bóng phản chiếu • Đường ray Neon phát sáng kết nối 6 phòng ban • 6 Tác nhân Chibi 3D Candy/Chrome di chuyển tuần tra tự động
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenSkillsHub && (
              <button
                onClick={onOpenSkillsHub}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                title="Mở Kho Kỹ Năng Agent RAG"
              >
                <Zap className="w-4 h-4" />
                <span>Kho Siêu Kỹ Năng (30+)</span>
              </button>
            )}

            <button
              onClick={() => {
                const text = `Dạ thưa Chủ nhân Nguyễn Thanh Hải! Đây là Tổng Hành Dinh AI 3D được dựng lại chính xác theo video TikTok axial.studio: Sàn đen bóng phản chiếu cao cấp, đường ray neon màu vàng phát sáng kết nối SAMS HQ, Agent Lab, BLOB Studio, Game Worlds, Lounge và Landing Clients. Toàn bộ 6 tác nhân robot Atlas, Sage, Blue, Ruby, Iris và Hoppi luôn túc trực, tuần tra và thực thi lệnh 24/7.`;
                if (onSpeakText) onSpeakText(text);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Nghe Hoppi thuyết minh về tổng hành dinh 3D"
            >
              <Volume2 className="w-4 h-4" />
              <span>Thuyết Minh Giọng Nói</span>
            </button>
          </div>
        </div>

        {/* 4 Highlights Bar matching video */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3 border-t border-slate-800/80 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Sàn &amp; Môi Trường:</span>
              <strong className="text-white text-xs">Obsidian Glossy Floor</strong>
              <span className="text-[9px] text-cyan-400 block font-mono">Đen bóng &amp; phản chiếu ánh sáng</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
            <Radio className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Đường Ray Neon:</span>
              <strong className="text-amber-300 text-xs">Glowing Track Circuit</strong>
              <span className="text-[9px] text-slate-400 block font-mono">Hạt năng lượng di chuyển liên tục</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
            <Users className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Đội Ngũ AI Agent:</span>
              <strong className="text-purple-300 text-xs">6 Robot Candy / Chrome</strong>
              <span className="text-[9px] text-slate-400 block font-mono">Atlas • Sage • Blue • Ruby • Iris • Hoppi</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
            <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Cơ Chế Phê Duyệt:</span>
              <strong className="text-emerald-300 text-xs">"You say yes" (HITL)</strong>
              <span className="text-[9px] text-emerald-400 block font-mono">Thẻ kính Hologram nổi trên bàn</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notice Banner */}
      {liveDispatchNotice && (
        <div className="p-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{liveDispatchNotice}</span>
        </div>
      )}

      {/* 3D INTERACTIVE CANVAS VIEWPORT */}
      <div
        ref={viewportContainerRef}
        className={`${
          isFullscreen
            ? 'fixed inset-0 z-50 w-screen h-screen rounded-none border-none'
            : 'relative w-full h-[620px] sm:h-[680px] rounded-3xl border border-slate-800'
        } overflow-hidden bg-slate-950 shadow-2xl transition-all duration-300`}
      >
        {/* Three.js Canvas Container */}
        <div ref={mountRef} className="w-full h-full" />

        {/* Top Floating Control Bar */}
        <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between gap-2.5 pointer-events-none">
          {/* Camera Presets Selector (Matching video navigation) */}
          <div className="pointer-events-auto flex items-center gap-1 bg-black/85 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-xl overflow-x-auto custom-scrollbar text-xs">
            <span className="px-2 text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1">
              <Compass className="w-3 h-3 text-cyan-400" />
              Góc Nhìn:
            </span>
            {[
              { id: 'isometric', label: '🎥 Toàn Cảnh (00:00)' },
              { id: 'hq', label: '🏢 SAMS HQ' },
              { id: 'lab', label: '🧪 Agent Lab' },
              { id: 'studio', label: '🎨 BLOB Studio' },
              { id: 'lounge', label: '☕ Lounge' },
              { id: 'clients', label: '👥 Landing Clients' },
            ].map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setCameraPreset(preset.id as any)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition cursor-pointer ${
                  cameraPreset === preset.id
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Action Group: Theme, Gather & Fullscreen */}
          <div className="pointer-events-auto flex items-center gap-2">
            {/* Visual Theme Switcher */}
            <div className="flex items-center gap-1 bg-black/85 backdrop-blur-md p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setOfficeTheme('dark_neon')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  officeTheme === 'dark_neon' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Sàn đen bóng phản chiếu & Neon (Đúng video clip)"
              >
                🌙 Neon Đen
              </button>
              <button
                type="button"
                onClick={() => setOfficeTheme('studio_white')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  officeTheme === 'studio_white' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Studio Trắng Apple (Clean Aesthetic)"
              >
                ☀️ Trắng Studio
              </button>
            </div>

            {/* Gather at Board Button */}
            {isGatheredAtBoard ? (
              <button
                type="button"
                onClick={handleResumePatrol}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Tiếp Tục Tuần Tra</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGatherAtBoard}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 text-white font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer transition"
                title="Triệu tập các agent về bảng kế hoạch tại SAMS HQ"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Họp Bảng Kế Hoạch</span>
              </button>
            )}

            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-black/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
              title="Toàn màn hình"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Bottom Floating Inspector Card ("Meet the team" & Room Status) */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 z-20 flex flex-col md:flex-row items-stretch md:items-end justify-between gap-3 pointer-events-none">
          
          {/* Agent Inspector Pill Box */}
          <div className="pointer-events-auto p-4 rounded-2xl bg-black/85 backdrop-blur-xl border border-cyan-500/30 shadow-2xl max-w-lg space-y-2.5">
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-4 h-4 rounded-full shadow"
                  style={{ backgroundColor: '#' + currentAgent.colorHex.toString(16).padStart(6, '0') }}
                ></div>
                <h4 className="font-extrabold text-sm text-white">{currentAgent.vietnameseName}</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                  {currentAgent.status}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Vị trí: {currentAgent.homeRoom}</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              <strong className="text-cyan-300">Nhiệm vụ trực tiếp:</strong> {currentAgent.currentTask}
            </p>

            <div className="flex items-center justify-between gap-2 pt-1">
              {/* Tools Chips */}
              <div className="flex items-center gap-1 overflow-x-auto text-[10px] font-mono text-slate-400">
                <span>Công cụ:</span>
                {currentAgent.tools.map((t, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 whitespace-nowrap">
                    {t}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handleDispatchTaskToAgent(currentAgent)}
                className="px-3 py-1 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1 shadow cursor-pointer transition shrink-0"
              >
                <Send className="w-3 h-3" />
                <span>Giao Việc</span>
              </button>
            </div>
          </div>

          {/* Quick Agent Lineup Selector ("Meet the team") */}
          <div className="pointer-events-auto p-2 bg-black/85 backdrop-blur-xl border border-slate-800 rounded-2xl flex items-center gap-1.5 shadow-2xl overflow-x-auto">
            {agentsList.map((ag) => (
              <button
                key={ag.id}
                type="button"
                onClick={() => {
                  setSelectedAgentId(ag.id);
                  if (ag.homeRoom === 'SAMS HQ') setCameraPreset('hq');
                  else if (ag.homeRoom === 'Agent Lab') setCameraPreset('lab');
                  else if (ag.homeRoom === 'BLOB Studio') setCameraPreset('studio');
                }}
                className={`p-2 rounded-xl flex items-center gap-2 transition cursor-pointer border ${
                  selectedAgentId === ag.id
                    ? 'bg-slate-800 border-cyan-400 text-white shadow-md'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title={ag.role}
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: '#' + ag.colorHex.toString(16).padStart(6, '0') }}
                ></div>
                <span className="text-xs font-bold whitespace-nowrap">{ag.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 6 Rooms Guide Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
        {roomZones.map((room) => {
          const isSelected = selectedRoomId === room.id;
          return (
            <div
              key={room.id}
              onClick={() => {
                setSelectedRoomId(room.id);
                if (room.id === 'room-hq') setCameraPreset('hq');
                else if (room.id === 'room-lab') setCameraPreset('lab');
                else if (room.id === 'room-studio') setCameraPreset('studio');
                else if (room.id === 'room-lounge') setCameraPreset('lounge');
                else if (room.id === 'room-clients') setCameraPreset('clients');
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-br from-cyan-950/60 to-slate-900 border-cyan-500/60 shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: '#' + room.colorHex.toString(16).padStart(6, '0') }}
                  ></div>
                  <h4 className="font-extrabold text-sm text-white">{room.name}</h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {room.badgeText}
                </span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-2">{room.subText}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
