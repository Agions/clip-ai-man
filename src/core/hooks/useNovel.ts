/**
 * 小说拆解 Hook
 * 管理小说解析和剧本生成
 */

import { useState, useCallback } from 'react';
import {
  novelService,
  type NovelParseResult,
  type Script,
  type ScriptScene,
  type Storyboard
} from '@/core/services/novel.service';

// Hook 返回类型
export interface UseNovelReturn {
  // 状态
  isParsing: boolean;
  isConverting: boolean;
  isGeneratingStoryboard: boolean;
  error: string | null;
  novelResult: NovelParseResult | null;
  script: Script | null;
  storyboards: Map<string, Storyboard[]>;

  // 操作
  parseNovel: (content: string, maxChapters?: number) => Promise<NovelParseResult>;
  generateScript: (chaptersToUse?: number, scenesPerChapter?: number) => Promise<Script>;
  generateStoryboard: (scene: ScriptScene) => Promise<Storyboard[]>;
  analyzeSuitability: () => { score: number; reasons: string[]; suggestions: string[] };
  exportScript: (format: 'json' | 'pdf' | 'docx') => string;

  // 重置
  reset: () => void;
}

export function useNovel(): UseNovelReturn {
  // 状态
  const [isParsing, setIsParsing] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isGeneratingStoryboard, setIsGeneratingStoryboard] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [novelResult, setNovelResult] = useState<NovelParseResult | null>(null);
  const [script, setScript] = useState<Script | null>(null);
  const [storyboards, setStoryboards] = useState<Map<string, Storyboard[]>>(new Map());

  /**
   * 解析小说
   */
  const parseNovel = useCallback(async (
    content: string,
    maxChapters: number = 50
  ): Promise<NovelParseResult> => {
    setIsParsing(true);
    setError(null);

    try {
      const result = await novelService.parseNovel(content, { maxChapters });
      setNovelResult(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : '解析失败';
      setError(message);
      throw err;
    } finally {
      setIsParsing(false);
    }
  }, []);

  /**
   * 生成剧本
   */
  const generateScript = useCallback(async (
    chaptersToUse: number = 5,
    scenesPerChapter: number = 3
  ): Promise<Script> => {
    if (!novelResult) {
      throw new Error('请先解析小说');
    }

    setIsConverting(true);
    setError(null);

    try {
      const newScript = await novelService.generateScript(novelResult, {
        chaptersToUse,
        scenesPerChapter
      });
      setScript(newScript);
      return newScript;
    } catch (err) {
      const message = err instanceof Error ? err.message : '生成失败';
      setError(message);
      throw err;
    } finally {
      setIsConverting(false);
    }
  }, [novelResult]);

  /**
   * 生成分镜
   */
  const generateStoryboard = useCallback(async (
    scene: ScriptScene
  ): Promise<Storyboard[]> => {
    setIsGeneratingStoryboard(true);
    setError(null);

    try {
      const panels = await novelService.generateStoryboard(scene);
      setStoryboards(prev => new Map(prev).set(scene.id, panels));
      return panels;
    } catch (err) {
      const message = err instanceof Error ? err.message : '分镜生成失败';
      setError(message);
      throw err;
    } finally {
      setIsGeneratingStoryboard(false);
    }
  }, []);

  /**
   * 分析适合度
   */
  const analyzeSuitability = useCallback(() => {
    if (!novelResult) {
      return { score: 0, reasons: ['未解析小说'], suggestions: ['请先上传小说'] };
    }
    return novelService.analyzeNovelSuitability(novelResult);
  }, [novelResult]);

  /**
   * 导出剧本
   */
  const exportScript = useCallback((format: 'json' | 'pdf' | 'docx'): string => {
    if (!script) {
      throw new Error('请先生成剧本');
    }
    return novelService.exportScript(script, format);
  }, [script]);

  /**
   * 重置
   */
  const reset = useCallback(() => {
    setNovelResult(null);
    setScript(null);
    setStoryboards(new Map());
    setError(null);
  }, []);

  return {
    // 状态
    isParsing,
    isConverting,
    isGeneratingStoryboard,
    error,
    novelResult,
    script,
    storyboards,

    // 操作
    parseNovel,
    generateScript,
    generateStoryboard,
    analyzeSuitability,
    exportScript,

    // 重置
    reset
  };
}

export default useNovel;
