import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import {
  generationService,
  GenerationTask,
  ImageGenerationOptions,
  VideoGenerationOptions,
  GenerationProvider,
} from '@/core/services/generation.service';

export const useGeneration = () => {
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<GenerationProvider>('bytedance-seedream');
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [numImages, setNumImages] = useState(1);
  const [duration, setDuration] = useState<5 | 10>(5);
  const [motionStrength, setMotionStrength] = useState(0.5);
  const [referenceImage, setReferenceImage] = useState<UploadFile | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tasks, setTasks] = useState<GenerationTask[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

  const refreshTasks = useCallback(() => {
    setTasks(generationService.getAllTasks());
  }, []);

  useEffect(() => {
    refreshTasks();
    const interval = setInterval(refreshTasks, 3000);
    return () => clearInterval(interval);
  }, [refreshTasks]);

  const generateImage = async () => {
    if (!prompt.trim()) {
      message.warning('请输入描述词');
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      const size = SIZE_PRESETS.find((s) => s.value === aspectRatio);
      const options: ImageGenerationOptions = {
        prompt: prompt.trim(),
        negativePrompt: negativePrompt.trim() || undefined,
        width: size?.width || 1024,
        height: size?.height || 1024,
        aspectRatio: aspectRatio as any,
        style: selectedStyle,
        numImages,
      };

      const result = await generationService.generateImage(
        options,
        { provider: selectedProvider, apiKey: 'mock-api-key' },
        (p) => setProgress(p)
      );

      if (result.status === 'completed') {
        message.success('图像生成完成');
        if (result.url) setPreviewImage(result.url);
      } else {
        message.error(result.error || '生成失败');
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : '生成失败');
    } finally {
      setIsGenerating(false);
      setProgress(0);
      refreshTasks();
    }
  };

  const generateVideo = async () => {
    if (!prompt.trim()) {
      message.warning('请输入描述词');
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      const options: VideoGenerationOptions = {
        prompt: prompt.trim(),
        negativePrompt: negativePrompt.trim() || undefined,
        imageUrl: referenceImage?.url,
        duration,
        aspectRatio: aspectRatio as any,
        motionStrength,
      };

      const result = await generationService.generateVideo(
        options,
        { provider: selectedProvider, apiKey: 'mock-api-key' },
        (p) => setProgress(p)
      );

      if (result.status === 'completed') {
        message.success('视频生成完成');
        if (result.url) setPreviewVideo(result.url);
      } else {
        message.error(result.error || '生成失败');
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : '生成失败');
    } finally {
      setIsGenerating(false);
      setProgress(0);
      refreshTasks();
    }
  };

  const cancelTask = (taskId: string) => {
    generationService.cancelTask(taskId);
    message.info('已取消');
    refreshTasks();
  };

  const deleteTask = (taskId: string) => {
    generationService.deleteTask(taskId);
    message.success('已删除');
    refreshTasks();
  };

  const downloadResult = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const clearPreview = () => {
    setPreviewImage(null);
    setPreviewVideo(null);
  };

  return {
    // State
    activeTab,
    prompt,
    negativePrompt,
    selectedProvider,
    selectedStyle,
    aspectRatio,
    numImages,
    duration,
    motionStrength,
    referenceImage,
    isGenerating,
    progress,
    tasks,
    previewImage,
    previewVideo,
    // Setters
    setActiveTab,
    setPrompt,
    setNegativePrompt,
    setSelectedProvider,
    setSelectedStyle,
    setAspectRatio,
    setNumImages,
    setDuration,
    setMotionStrength,
    setReferenceImage,
    // Actions
    generateImage,
    generateVideo,
    cancelTask,
    deleteTask,
    downloadResult,
    clearPreview,
    refreshTasks,
  };
};

const SIZE_PRESETS = [
  { label: '1:1 方形', value: '1:1', width: 1024, height: 1024 },
  { label: '16:9 宽屏', value: '16:9', width: 1920, height: 1080 },
  { label: '9:16 竖屏', value: '9:16', width: 1080, height: 1920 },
  { label: '4:3 标准', value: '4:3', width: 1440, height: 1080 },
  { label: '3:4 竖版', value: '3:4', width: 1080, height: 1440 },
];

export default useGeneration;
