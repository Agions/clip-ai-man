/**
 * Services 统一导出
 */

// 核心服务
export { aiService } from './ai.service';
export { videoService } from './video.service';
export { storageService } from './storage.service';
export { visionService } from './vision.service';
export { costService } from './cost.service';
export { consistencyService } from './consistency.service';
export { enhancedConsistencyService } from './enhanced-consistency.service';
export { novelService } from './novel.service';
export { scriptTemplateService } from './scriptTemplate.service';
export { lipSyncService } from './lip-sync.service';
export { originalityService } from './originality.service';
export { dramaTemplateService } from './drama-template.service';
export { ttsService } from './tts.service';
export { generationService } from './generation.service';
export { ffmpegService } from './ffmpeg.service';

// 设置服务
export {
  settingsService,
  DEFAULT_SETTINGS,
} from './settings.service';
export type {
  AppSettings,
  GeneralSettings,
  AISettings,
  VideoSettings,
  NotificationSettings,
  ShortcutSettings,
  AdvancedSettings,
} from './settings.service';

// 类型导出
export type { AIResponse, RequestConfig } from './ai.service';
export type { CostRecord, CostStats, CostBudget } from './cost.service';
export type { Character, DramaStyle, ConsistencyRule, ConsistencyCheckpoint, ConsistencyIssue, CharacterLibrary } from './consistency.service';
export type { NovelChapter, ScriptScene, Script, NovelParseResult, Storyboard } from './novel.service';
export type { TTSProvider, TTSConfig, TTSOptions, TTSResult } from './tts.service';
export type { 
  GenerationType, 
  GenerationProvider, 
  GenerationConfig, 
  ImageGenerationOptions, 
  VideoGenerationOptions,
  GenerationTask,
  GenerationResult 
} from './generation.service';
export type {
  VideoMetadata,
  VideoSegment,
  CutVideoParams,
  PreviewParams,
  CutProgressCallback,
  FFmpegStatus,
} from './ffmpeg.service';
