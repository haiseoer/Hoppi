export type ExpressiveMood = 'happy' | 'curious' | 'focused' | 'empathetic' | 'critical';
export type AppTheme = 'cyberpunk' | 'deepspace' | 'light';

export interface UserIdentity {
  isMaster: boolean;
  name: string;
  email: string;
  role: 'Chủ nhân (Admin)' | 'Khách truy cập (Guest)';
  authMethod: 'faceid' | 'passcode' | 'trusted_token' | 'none';
  trustedToken?: string;
  deviceId: string;
  deviceName: string;
  authenticatedAt: string;
}

export interface TrustedDevice {
  id: string;
  name: string;
  os: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  tokenHash: string;
  status: 'active' | 'revoked';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  mood?: ExpressiveMood;
  senderName?: string;
  isGuest?: boolean;
  hitlApprovalId?: string;
  actions?: string[];
  codeSnippet?: {
    language: string;
    code: string;
  };
  designArtifact?: DesignArtifact;
  attachments?: {
    id: string;
    name: string;
    type: 'image' | 'video' | 'file';
    url: string;
    sizeFormatted: string;
  }[];
}

export interface DesignArtifact {
  title: string;
  category: 'banner' | 'poster' | 'social_card' | 'logo_mockup' | 'landing_hero' | 'spreadsheet' | 'slide_deck' | 'document' | 'video_storyboard' | 'cleanup_report';
  slogan?: string;
  dimensions?: string;
  palette?: string[];
  targetAudience?: string;
  keyVisualDesc: string;
  ctaText?: string;
  badgeText?: string;
  features?: string[];
  previewGradient?: string;
  imageUrl?: string;
  spreadsheetData?: {
    columns: string[];
    rows: (string | number)[][];
    summary?: string;
  };
  slideDeckData?: {
    slides: {
      slideNumber: number;
      title: string;
      bulletPoints: string[];
      visualIdea: string;
    }[];
  };
  documentData?: {
    sections: {
      heading: string;
      content: string;
    }[];
  };
  cleanupTasks?: {
    id: string;
    category: string;
    description: string;
    savedSpace: string;
    status: 'ready' | 'cleaned';
  }[];
  videoStoryboard?: {
    scenes: {
      sceneNumber: number;
      time: string;
      hookType: string;
      visual: string;
      audioVoiceover: string;
    }[];
  };
}

export interface ApprovalRequest {
  id: string;
  requesterName: string;
  requesterType: 'guest' | 'code_agent' | 'sales_crm' | 'lan_iot';
  actionTitle: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  payload?: Record<string, any>;
}

export interface CRMLead {
  id: string;
  name: string;
  avatar: string;
  channel: 'Zalo OA' | 'Fanpage' | 'Email' | 'Website';
  lastMessage: string;
  sentiment: 'Hào hứng' | 'Cân nhắc' | 'Khẩn cấp' | 'Thắc mắc giá';
  buyingIntent: number; // 0 - 100%
  status: 'Tiềm năng' | 'Đang tư vấn' | 'Báo giá' | 'Đã chốt đơn' | 'Từ chối';
  dealValueVND: number;
  phone?: string;
  updatedAt: string;
}

export interface IoTDevice {
  id: string;
  name: string;
  type: 'light' | 'switch' | 'router' | 'climate' | 'camera' | 'lock' | 'curtain';
  location: string;
  ip: string;
  protocol: 'mDNS' | 'SSDP' | 'Tuya / Local' | 'Tasmota';
  isOnline: boolean;
  state: {
    power: boolean;
    brightness?: number;
    color?: string;
    temperature?: number;
    bandwidthMbps?: number;
    locked?: boolean;
    securityArmed?: boolean;
    position?: number;
  };
}

export interface MemoryVectorItem {
  id: string;
  title: string;
  source: 'ChatGPT' | 'Gemini' | 'Grok' | 'Claude' | 'PDF Document' | 'Source Code' | 'Macro Workflow' | 'Tệp Máy Tính' | 'Liên Kết Web' | string;
  contentSnippet: string;
  tags: string[];
  vectorDim: number;
  syncedAt: string;
  syncedSizeKB: number;
  internetEnrichment?: string;
  enrichedSources?: string[];
  keyConcepts?: string[];
  originalUrl?: string;
  fileName?: string;
  confidenceScore?: number;
}

export interface KnowledgeGap {
  id: string;
  sourceDoc: string;
  gapTitle: string;
  description: string;
  searchQuery: string;
  status: 'detected' | 'crawling' | 'synced_to_vector';
}

export type SecurityEventType =
  | 'faceid_success'
  | 'faceid_fail'
  | 'passcode_success'
  | 'passcode_fail'
  | 'device_registered'
  | 'device_revoked'
  | 'token_validated'
  | 'guest_access';

export interface SecurityAuditLog {
  id: string;
  eventType: SecurityEventType;
  title: string;
  details: string;
  deviceFingerprint: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'danger';
  timestamp: string;
  location?: string;
}

export interface VoiceCommandLogItem {
  id: string;
  command: string;
  timestamp: string;
  success: boolean;
  category: 'system' | 'code' | 'sales' | 'iot' | 'auth';
  durationMs?: number;
}

export interface ConnectedMeshDevice {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet' | 'server';
  os: string;
  browser: string;
  ip: string;
  isMasterDevice: boolean;
  isCurrent: boolean;
  status: 'online' | 'busy' | 'syncing' | 'idle';
  currentTask?: string | null;
  battery?: number;
  latencyMs?: number;
  lastSync: string;
  tokenHash: string;
  capabilities: string[];
  cpuUsage?: number;
  memoryUsage?: number;
  memoryTotalGB?: number;
  uptime?: string;
  taskCount?: number;
}

export type AppModule = 'chat' | 'orchestrator' | 'code' | 'sales' | 'rag' | 'iot' | 'security' | 'mesh' | 'schedule' | 'hq3d' | 'robot' | 'skills';

export interface HQDepartment {
  id: string;
  name: string;
  shortName: string;
  roleDescription: string;
  agentCount: number;
  leadAgentName: string;
  themeColor: string;
  hexColor: number;
  accentHex: number;
  zonePosition: [number, number, number];
  status: 'active' | 'busy' | 'syncing';
  currentTask: string;
  metrics: {
    tasksCompletedToday: number;
    hoursRunning: number;
    salaryVND: number; // 0đ
    outputRating: string;
  };
}

export interface HQWorkSkill {
  id: number;
  name: string;
  category: 'prd' | 'ui' | 'code' | 'qa' | 'devops';
  description: string;
  automatedRate: string;
  status: 'ready' | 'running';
}

export interface HoppiCompletionNotice {
  id: string;
  sourceDeviceId: string;
  sourceDeviceName: string;
  taskTitle: string;
  summary: string;
  spokenMessage: string;
  timestamp: string;
  mood?: ExpressiveMood;
  metrics?: {
    durationMs?: number;
    tokensProcessed?: number;
    syncedDevicesCount?: number;
  };
}

export interface IoTVoiceMapping {
  id: string;
  triggerPhrase: string;
  alternativePhrases: string[];
  targetDeviceId: string;
  targetDeviceName: string;
  endpointUrl: string;
  httpMethod: 'POST' | 'PUT' | 'GET';
  payloadJson: string;
  successMood: ExpressiveMood;
  feedbackSpeechVi: string;
  feedbackSpeechEn: string;
  category: 'lighting' | 'climate' | 'power' | 'security' | 'scenes';
  enabled: boolean;
}

export interface IoTVoiceExecutionLog {
  id: string;
  timestamp: string;
  spokenText: string;
  matchedRuleId?: string;
  ruleTitle?: string;
  endpoint: string;
  httpMethod: string;
  status: 'success' | 'failed' | 'simulated';
  statusCode: number;
  latencyMs: number;
  avatarMoodTriggered: ExpressiveMood;
  responseSummary: string;
}

export type ResponseStylePreset = 'energetic' | 'empathetic' | 'technical' | 'concise' | 'playful' | 'custom';

export interface VoiceMoodSettings {
  pitch: number; // 0.5 - 2.0
  rate: number; // 0.5 - 2.0
  volume: number; // 0.1 - 1.0
  responseStyle: ResponseStylePreset;
  customPromptInstruction: string;
  preferredVoiceLang: 'vi-VN' | 'en-US';
  autoSpeakReplies: boolean;
  syncAvatarMoodWithVoice: boolean;
  lastUpdated?: string;
}

export const DEFAULT_VOICE_MOOD_SETTINGS: VoiceMoodSettings = {
  pitch: 1.15,
  rate: 1.05,
  volume: 1.0,
  responseStyle: 'energetic',
  customPromptInstruction: 'Chào anh Hải với năng lượng tích cực, xưng hô "anh Hải - Hoppi", trả lời rõ ràng và chủ động đề xuất giải pháp.',
  preferredVoiceLang: 'vi-VN',
  autoSpeakReplies: true,
  syncAvatarMoodWithVoice: true,
  lastUpdated: new Date().toISOString(),
};

export type ScheduleCategory = 'code' | 'sales' | 'iot' | 'rag' | 'wellness' | 'system';
export type TaskPriorityTier = 'critical' | 'routine' | 'maintenance';

export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  category: ScheduleCategory;
  dateStr: string; // YYYY-MM-DD
  startTime: string; // HH:mm (e.g. "09:00")
  endTime: string; // HH:mm (e.g. "11:00")
  durationMinutes: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  taskTier?: TaskPriorityTier;
  isAiSuggested?: boolean;
  aiRationale?: string;
  isCompleted?: boolean;
  syncedWithSystemCalendar?: boolean;
  calendarSource?: 'system_api' | 'google' | 'apple_ical' | 'local_mesh';
  deviceTargetId?: string;
  notificationSet?: boolean;
  tags?: string[];
}

export interface SmartTimeBlockSuggestion {
  id: string;
  title: string;
  category: ScheduleCategory;
  targetDate: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  durationMinutes: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  rationale: string;
  energyLevelFit: 'high_focus' | 'moderate' | 'chill_recovery';
  estimatedProductivityGain: string;
  relatedModule?: AppModule;
}

export interface CalendarSyncConfig {
  autoSyncEnabled: boolean;
  syncIntervalMinutes: number;
  lastSyncedAt?: string;
  defaultReminderMinutes: number;
  exportFormat: 'ics' | 'webcal' | 'google_intent';
  calendarName: string;
  totalSyncedEvents: number;
}

export interface TrafficHeatmapCell {
  deviceId: string;
  deviceName: string;
  hour: number; // 0 - 23
  hourLabel: string; // "00:00", "01:00", ...
  trafficKBps: number; // intensity metric
  packetCount: number;
  inboundKB: number;
  outboundKB: number;
  latencyMs: number;
  status: 'optimal' | 'busy' | 'spike';
}

export interface GlobalFileSyncPayload {
  id: string;
  targetDeviceId: string;
  targetDeviceName: string;
  fileName: string;
  fileType: 'code' | 'document' | 'config' | 'vector_chunk';
  language?: string;
  content: string;
  sizeBytes: number;
  checksumSha256: string;
  sentAt: string;
  status: 'sending' | 'synced' | 'failed';
  autoExecute?: boolean;
}

export interface LowPowerModeConfig {
  isActive: boolean;
  batteryLevel: number;
  isCharging: boolean;
  isManualOverride: boolean;
  animationFramerateReduction: boolean;
  iotPollingIntervalSeconds: number; // normal 4s vs low power 20s
}

export interface QuickMaintenanceTaskPreset {
  id: string;
  title: string;
  category: ScheduleCategory;
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  taskTier?: TaskPriorityTier;
  durationMinutes: number;
  estimatedCpuLoad: string;
}

export type IoTSceneActionType =
  | 'power'
  | 'brightness'
  | 'color'
  | 'temperature'
  | 'securityMode'
  | 'doorLock'
  | 'curtain'
  | 'custom';

export interface IoTSceneDeviceAction {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceType: 'light' | 'switch' | 'router' | 'climate' | 'camera' | 'lock' | 'curtain';
  actionType: IoTSceneActionType;
  targetState: {
    power?: boolean;
    brightness?: number; // 0 - 100
    color?: string;
    temperature?: number; // 16 - 30
    securityArmed?: boolean; // high security armed
    locked?: boolean; // smart door lock
    position?: number; // curtain position %
    statusLabel?: string;
  };
  delayMs?: number;
}

export interface IoTScene {
  id: string;
  name: string;
  description: string;
  icon: 'moon' | 'briefcase' | 'shield' | 'sparkles' | 'sun' | 'tv' | 'coffee' | 'lock' | 'heart' | 'zap';
  themeColor: 'purple' | 'cyan' | 'amber' | 'emerald' | 'rose' | 'indigo';
  triggerVoicePhrase: string;
  alternativePhrases: string[];
  actions: IoTSceneDeviceAction[];
  feedbackSpeechVi: string;
  feedbackSpeechEn: string;
  targetMood: ExpressiveMood;
  isPreset?: boolean;
  createdAt: string;
  lastExecutedAt?: string;
  executionCount: number;
}

export type VoiceIntentCategory =
  | 'iot_control'
  | 'code_task'
  | 'general_query'
  | 'sales_crm'
  | 'system_routine';

export interface VoiceIntentDayStat {
  date: string; // DD/MM
  fullDate: string; // YYYY-MM-DD
  dayIndex: number;
  iot_control: number;
  code_task: number;
  general_query: number;
  sales_crm: number;
  system_routine: number;
  total: number;
}

export interface VoiceIntentSummary {
  category: VoiceIntentCategory;
  label: string;
  labelVi: string;
  totalCount: number;
  percentage: number;
  color: string;
  icon: string;
  avgLatencyMs: number;
  topExample: string;
  trendPercentage: number;
}

export type MeshPowerMode = 'high-performance' | 'battery-saver';

export interface MeshPowerModeEvent {
  type: 'MESH_POWER_MODE_CHANGED';
  mode: MeshPowerMode;
  timestamp: number;
  senderDeviceId?: string;
  devicesAffected?: string[];
  rates?: Record<string, number>;
}

export type EyeComfortPreset =
  | 'auto'
  | 'night_shift'
  | 'deep_space_oled'
  | 'cyber_soft'
  | 'high_visibility';

export type AmbientSensorSource = 'ambient_api' | 'mesh_iot' | 'time_circadian' | 'manual';

export interface AdaptiveLightConfig {
  isEnabled: boolean;
  sensorSource: AmbientSensorSource;
  ambientLux: number;
  screenBrightnessPercent: number;
  themeIntensityPercent: number;
  blueLightFilterPercent: number;
  contrastTuningPercent: number;
  circadianSync: boolean;
  activePreset: EyeComfortPreset;
}

export const DEFAULT_ADAPTIVE_LIGHT_CONFIG: AdaptiveLightConfig = {
  isEnabled: true,
  sensorSource: 'mesh_iot',
  ambientLux: 45,
  screenBrightnessPercent: 85,
  themeIntensityPercent: 65,
  blueLightFilterPercent: 20,
  contrastTuningPercent: 95,
  circadianSync: true,
  activePreset: 'auto',
};

