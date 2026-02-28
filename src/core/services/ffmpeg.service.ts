/**
 * FFmpeg 视频处理服务
 * 封装 Tauri 后端命令，提供视频处理功能
 */

import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { message } from 'antd';

// 视频元数据
export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  fps: number;
  codec: string;
  bitrate: number;
}

// 视频片段
export interface VideoSegment {
  start: number;
  end: number;
  type?: string;
  content?: string;
}

// 剪辑参数
export interface CutVideoParams {
  inputPath: string;
  outputPath: string;
  segments: VideoSegment[];
  quality?: 'low' | 'medium' | 'high';
  format?: 'mp4' | 'mov' | 'avi' | 'mkv';
  transition?: 'none' | 'fade' | 'dissolve' | 'wipe' | 'slide';
  transitionDuration?: number;
  volume?: number;
  addSubtitles?: boolean;
}

// 预览参数
export interface PreviewParams {
  inputPath: string;
  segment: VideoSegment;
  transition?: string;
  transitionDuration?: number;
  volume?: number;
  addSubtitles?: boolean;
}

// 剪辑进度回调
export type CutProgressCallback = (progress: number) => void;

// FFmpeg 状态
export interface FFmpegStatus {
  installed: boolean;
  version?: string;
}

class FFmpegService {
  private unlistenFn: (() => void) | null = null;

  /**
   * 检查 FFmpeg 是否已安装
   */
  async checkFFmpeg(): Promise<FFmpegStatus> {
    try {
      const result = await invoke<Record<string, any>>('check_ffmpeg');
      return {
        installed: result.installed as boolean,
        version: result.version as string | undefined,
      };
    } catch (error) {
      console.error('检查 FFmpeg 失败:', error);
      return { installed: false };
    }
  }

  /**
   * 分析视频文件
   */
  async analyzeVideo(path: string): Promise<VideoMetadata> {
    try {
      const metadata = await invoke<VideoMetadata>('analyze_video', { path });
      return metadata;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '分析视频失败';
      message.error(errorMsg);
      throw error;
    }
  }

  /**
   * 提取关键帧
   */
  async extractKeyFrames(path: string, count: number = 5): Promise<string[]> {
    try {
      const frames = await invoke<string[]>('extract_key_frames', { path, count });
      return frames;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '提取关键帧失败';
      message.error(errorMsg);
      throw error;
    }
  }

  /**
   * 生成视频缩略图
   */
  async generateThumbnail(path: string): Promise<string> {
    try {
      const thumbnailPath = await invoke<string>('generate_thumbnail', { path });
      return thumbnailPath;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '生成缩略图失败';
      message.error(errorMsg);
      throw error;
    }
  }

  /**
   * 剪辑视频
   */
  async cutVideo(
    params: CutVideoParams,
    onProgress?: CutProgressCallback
  ): Promise<string> {
    // 监听进度事件
    if (onProgress) {
      this.unlistenFn = await listen<number>('cut_progress', (event) => {
        onProgress(event.payload);
      });
    }

    try {
      const outputPath = await invoke<string>('cut_video', {
        params: {
          input_path: params.inputPath,
          output_path: params.outputPath,
          segments: params.segments,
          quality: params.quality,
          format: params.format,
          transition: params.transition,
          transition_duration: params.transitionDuration,
          volume: params.volume,
          add_subtitles: params.addSubtitles,
        },
      });

      message.success('视频剪辑完成');
      return outputPath;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '剪辑视频失败';
      message.error(errorMsg);
      throw error;
    } finally {
      // 取消监听
      if (this.unlistenFn) {
        this.unlistenFn();
        this.unlistenFn = null;
      }
    }
  }

  /**
   * 生成预览片段
   */
  async generatePreview(params: PreviewParams): Promise<string> {
    try {
      const previewPath = await invoke<string>('generate_preview', {
        params: {
          input_path: params.inputPath,
          segment: params.segment,
          transition: params.transition,
          transition_duration: params.transitionDuration,
          volume: params.volume,
          add_subtitles: params.addSubtitles,
        },
      });

      return previewPath;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '生成预览失败';
      message.error(errorMsg);
      throw error;
    }
  }

  /**
   * 清理临时文件
   */
  async cleanTempFile(path: string): Promise<void> {
    try {
      await invoke('clean_temp_file', { params: { path } });
    } catch (error) {
      console.error('清理临时文件失败:', error);
    }
  }

  /**
   * 打开文件
   */
  async openFile(path: string): Promise<void> {
    try {
      await invoke('open_file', { path });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '打开文件失败';
      message.error(errorMsg);
      throw error;
    }
  }

  /**
   * 格式化时长
   */
  formatDuration(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * 格式化文件大小
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * 获取视频分辨率名称
   */
  getResolutionName(width: number, height: number): string {
    if (width >= 3840 || height >= 2160) return '4K';
    if (width >= 1920 || height >= 1080) return '1080p';
    if (width >= 1280 || height >= 720) return '720p';
    if (width >= 854 || height >= 480) return '480p';
    return 'SD';
  }

  /**
   * 获取推荐质量设置
   */
  getRecommendedQuality(metadata: VideoMetadata): 'low' | 'medium' | 'high' {
    const resolution = metadata.width * metadata.height;
    if (resolution >= 1920 * 1080) return 'high';
    if (resolution >= 1280 * 720) return 'medium';
    return 'low';
  }

  /**
   * 合并多个视频
   */
  async mergeVideos(
    videos: string[] | Buffer[],
    options?: {
      transition?: string;
      transitionDuration?: number;
      outputFormat?: string;
    }
  ): Promise<{ data: string; duration?: number }> {
    try {
      // 如果是 Tauri 环境，调用后端
      if (typeof invoke !== 'undefined') {
        const result = await invoke<{ path: string; duration: number }>('merge_videos', {
          videos,
          options: {
            transition: options?.transition || 'none',
            transitionDuration: options?.transitionDuration || 0.5,
            outputFormat: options?.outputFormat || 'mp4'
          }
        });
        return { data: result.path, duration: result.duration };
      }

      // 浏览器环境模拟
      console.log('mergeVideos called with', videos.length, 'videos');
      return {
        data: videos[0]?.toString() || '',
        duration: videos.length * 5 // 模拟时长
      };
    } catch (error) {
      console.error('合并视频失败:', error);
      throw new Error(`合并视频失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 处理视频（剪辑、特效等）
   */
  async processVideo(options: {
    input: string | Buffer;
    operation: 'trim' | 'resize' | 'convert' | 'effect' | 'watermark';
    startTime?: number;
    endTime?: number;
    effects?: string[];
    width?: number;
    height?: number;
    outputFormat?: string;
  }): Promise<{ data: string }> {
    try {
      // 如果是 Tauri 环境，调用后端
      if (typeof invoke !== 'undefined') {
        const result = await invoke<{ path: string }>('process_video', {
          input: options.input,
          operation: options.operation,
          params: {
            startTime: options.startTime,
            endTime: options.endTime,
            effects: options.effects,
            width: options.width,
            height: options.height,
            outputFormat: options.outputFormat || 'mp4'
          }
        });
        return { data: result.path };
      }

      // 浏览器环境模拟
      console.log('processVideo called with operation:', options.operation);
      return {
        data: typeof options.input === 'string' ? options.input : ''
      };
    } catch (error) {
      console.error('视频处理失败:', error);
      throw new Error(`视频处理失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 合并音频和视频
   */
  async mergeAudioVideo(options: {
    video?: string | Buffer;
    audios?: Array<{
      data: string | Buffer;
      fadeIn?: number;
      fadeOut?: number;
    }>;
    crossfade?: number;
  }): Promise<{ data: string; duration?: number }> {
    try {
      // 如果是 Tauri 环境，调用后端
      if (typeof invoke !== 'undefined') {
        const result = await invoke<{ path: string; duration: number }>('merge_audio_video', {
          video: options.video,
          audios: options.audios,
          crossfade: options.crossfade || 0
        });
        return { data: result.path, duration: result.duration };
      }

      // 浏览器环境模拟
      console.log('mergeAudioVideo called');
      return {
        data: typeof options.video === 'string' ? options.video : '',
        duration: 30
      };
    } catch (error) {
      console.error('音视频合并失败:', error);
      throw new Error(`音视频合并失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 提取音频
   */
  async extractAudio(videoPath: string): Promise<{ data: string }> {
    try {
      if (typeof invoke !== 'undefined') {
        const result = await invoke<{ path: string }>('extract_audio', { videoPath });
        return { data: result.path };
      }
      return { data: '' };
    } catch (error) {
      console.error('提取音频失败:', error);
      throw new Error(`提取音频失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 添加字幕
   */
  async addSubtitles(options: {
    video: string | Buffer;
    subtitles: string | Buffer;
    fontPath?: string;
    fontSize?: number;
    position?: 'bottom' | 'top';
  }): Promise<{ data: string }> {
    try {
      if (typeof invoke !== 'undefined') {
        const result = await invoke<{ path: string }>('add_subtitles', {
          video: options.video,
          subtitles: options.subtitles,
          fontPath: options.fontPath,
          fontSize: options.fontSize || 24,
          position: options.position || 'bottom'
        });
        return { data: result.path };
      }
      return { data: typeof options.video === 'string' ? options.video : '' };
    } catch (error) {
      console.error('添加字幕失败:', error);
      throw new Error(`添加字幕失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }
}

// 导出单例
export const ffmpegService = new FFmpegService();
export default ffmpegService;
