/**
 * 常量定义
 * 集中管理所有常量
 */

// 脚本风格
export const SCRIPT_STYLES = [
  { value: 'professional', label: '专业正式', desc: '适合商业、教育类视频' },
  { value: 'casual', label: '轻松随意', desc: '适合生活、娱乐类视频' },
  { value: 'humorous', label: '幽默风趣', desc: '适合搞笑、娱乐类视频' },
  { value: 'emotional', label: '情感共鸣', desc: '适合故事、情感类视频' },
  { value: 'technical', label: '技术讲解', desc: '适合教程、科普类视频' },
  { value: 'promotional', label: '营销推广', desc: '适合产品、广告类视频' }
] as const;

// 语气选项
export const TONE_OPTIONS = [
  { value: 'friendly', label: '友好亲切' },
  { value: 'authoritative', label: '权威专业' },
  { value: 'enthusiastic', label: '热情激昂' },
  { value: 'calm', label: '平静沉稳' },
  { value: 'humorous', label: '幽默诙谐' }
] as const;

// 脚本长度
export const SCRIPT_LENGTHS = [
  { value: 'short', label: '简短', desc: '1-3分钟', words: '300-500字' },
  { value: 'medium', label: '适中', desc: '3-5分钟', words: '500-800字' },
  { value: 'long', label: '详细', desc: '5-10分钟', words: '800-1500字' }
] as const;

// 目标受众
export const TARGET_AUDIENCES = [
  { value: 'general', label: '普通大众' },
  { value: 'professional', label: '专业人士' },
  { value: 'student', label: '学生群体' },
  { value: 'business', label: '商务人士' },
  { value: 'tech', label: '技术爱好者' },
  { value: 'elderly', label: '中老年群体' }
] as const;

// 语言选项
export const LANGUAGE_OPTIONS = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' }
] as const;

// 视频格式
export const VIDEO_FORMATS = [
  { value: 'mp4', label: 'MP4', ext: '.mp4' },
  { value: 'mov', label: 'MOV', ext: '.mov' },
  { value: 'webm', label: 'WebM', ext: '.webm' },
  { value: 'avi', label: 'AVI', ext: '.avi' }
] as const;

// 导出质量
export const EXPORT_QUALITIES = [
  { value: 'low', label: '低质量', crf: 28 },
  { value: 'medium', label: '中等质量', crf: 23 },
  { value: 'high', label: '高质量', crf: 18 },
  { value: 'ultra', label: '超高质量', crf: 15 }
] as const;

// 分辨率选项
export const RESOLUTION_OPTIONS = [
  { value: '720p', label: '720p HD', width: 1280, height: 720 },
  { value: '1080p', label: '1080p Full HD', width: 1920, height: 1080 },
  { value: '2k', label: '2K QHD', width: 2560, height: 1440 },
  { value: '4k', label: '4K UHD', width: 3840, height: 2160 }
] as const;

// 转场效果
export const TRANSITION_EFFECTS = [
  { value: 'fade', label: '淡入淡出', duration: 0.5 },
  { value: 'dissolve', label: '交叉溶解', duration: 0.5 },
  { value: 'wipe', label: '擦除效果', duration: 0.5 },
  { value: 'slide', label: '滑动效果', duration: 0.5 },
  { value: 'zoom', label: '缩放效果', duration: 0.5 },
  { value: 'none', label: '无效果', duration: 0 }
] as const;

// 存储键名
export const STORAGE_KEYS = {
  PROJECTS: 'reelforge_projects',
  APP_STATE: 'reelforge_app_state',
  USER_PREFERENCES: 'reelforge_preferences',
  RECENT_FILES: 'reelforge_recent_files',
  MODEL_SETTINGS: 'reelforge_model_settings',
  EXPORT_HISTORY: 'reelforge_export_history'
} as const;

// 路由路径
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:id',
  PROJECT_EDIT: '/projects/:id/edit',
  EDITOR: '/editor',
  SETTINGS: '/settings',
  VIDEO_STUDIO: '/video-studio'
} as const;

// 事件名称
export const EVENTS = {
  PROJECT_CREATED: 'project:created',
  PROJECT_UPDATED: 'project:updated',
  PROJECT_DELETED: 'project:deleted',
  SCRIPT_GENERATED: 'script:generated',
  VIDEO_UPLOADED: 'video:uploaded',
  EXPORT_STARTED: 'export:started',
  EXPORT_COMPLETED: 'export:completed',
  EXPORT_FAILED: 'export:failed'
} as const;

// 错误码
export const ERROR_CODES = {
  UNKNOWN: 'E0000',
  NETWORK_ERROR: 'E0001',
  API_ERROR: 'E0002',
  VALIDATION_ERROR: 'E0003',
  NOT_FOUND: 'E0004',
  UNAUTHORIZED: 'E0005',
  FILE_TOO_LARGE: 'E0006',
  UNSUPPORTED_FORMAT: 'E0007',
  PROCESSING_ERROR: 'E0008'
} as const;

// 默认配置
export const DEFAULTS = {
  AUTO_SAVE_INTERVAL: 30, // 秒
  MAX_FILE_SIZE: 2 * 1024 * 1024 * 1024, // 2GB
  MAX_PROJECTS: 100,
  MAX_RECENT_FILES: 20,
  DEFAULT_VIDEO_QUALITY: 'high',
  DEFAULT_OUTPUT_FORMAT: 'mp4',
  DEFAULT_LANGUAGE: 'zh',
  DEFAULT_SCRIPT_LENGTH: 'medium',
  DEFAULT_STYLE: 'professional'
} as const;

// 文件类型映射
export const FILE_TYPE_MAP: Record<string, string> = {
  mp4: 'video',
  mov: 'video',
  avi: 'video',
  mkv: 'video',
  webm: 'video',
  flv: 'video',
  wmv: 'video',
  mp3: 'audio',
  wav: 'audio',
  flac: 'audio',
  aac: 'audio',
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  gif: 'image',
  webp: 'image',
  svg: 'image',
  pdf: 'document',
  doc: 'document',
  docx: 'document',
  txt: 'text',
  json: 'code',
  js: 'code',
  ts: 'code',
  srt: 'subtitle',
  vtt: 'subtitle',
  ass: 'subtitle'
} as const;

// 动画配置
export const ANIMATION_CONFIG = {
  duration: {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5
  },
  easing: {
    default: [0.4, 0, 0.2, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
    smooth: [0.25, 0.1, 0.25, 1]
  }
} as const;
