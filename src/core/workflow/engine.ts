/**
 * 工作流执行引擎
 * 基于 n8n 架构设计，连接 ManGaAI 实际服务
 */

import {
  Workflow,
  WorkflowNode,
  WorkflowExecution,
  NodeExecution,
  NodeData,
  NodeDataItem,
  NodeStatus,
  NodeType,
  NodeExecutor,
  NodeExecutionContext,
  WorkflowEvent,
  WorkflowEventListener,
  NodeConnection,
} from './types';
import { nodeRegistry, getNodeDefinition } from './node-registry';
import { aiService } from '../services/ai.service';
import { ttsService } from '../services/tts.service';
import { generationService } from '../services/generation.service';
import { ffmpegService } from '../services/ffmpeg.service';
import { storageService } from '../services/storage.service';
import { settingsService } from '../services/settings.service';

/**
 * 工作流执行器
 */
export class WorkflowEngine {
  private executions: Map<string, WorkflowExecution> = new Map();
  private listeners: WorkflowEventListener[] = [];
  private abortControllers: Map<string, AbortController> = new Map();

  /**
   * 执行工作流
   */
  async execute(
    workflow: Workflow,
    trigger: 'manual' | 'schedule' | 'webhook' = 'manual',
    initialData?: NodeData
  ): Promise<WorkflowExecution> {
    const executionId = `exec-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    
    const execution: WorkflowExecution = {
      id: executionId,
      workflowId: workflow.id,
      status: 'running',
      startedAt: Date.now(),
      trigger,
      nodeExecutions: [],
      data: {}
    };

    this.executions.set(executionId, execution);
    const abortController = new AbortController();
    this.abortControllers.set(executionId, abortController);

    try {
      // 验证工作流
      this.validateWorkflow(workflow);

      // 发送开始事件
      this.emit({
        type: 'workflow:start',
        workflowId: workflow.id,
        executionId,
        timestamp: Date.now()
      });

      // 找到触发器节点
      const triggerNodes = workflow.nodes.filter(n => n.type.startsWith('trigger.'));
      if (triggerNodes.length === 0) {
        throw new Error('工作流没有触发器节点');
      }

      // 从触发器开始执行
      for (const triggerNode of triggerNodes) {
        if (abortController.signal.aborted) break;
        await this.executeNode(workflow, triggerNode, execution, initialData);
      }

      // 执行完成
      execution.status = 'success';
      execution.finishedAt = Date.now();
      execution.duration = execution.finishedAt - execution.startedAt;

      this.emit({
        type: 'workflow:complete',
        workflowId: workflow.id,
        executionId,
        timestamp: Date.now()
      });

    } catch (error) {
      execution.status = 'error';
      execution.finishedAt = Date.now();
      execution.duration = execution.finishedAt - execution.startedAt;
      execution.error = error instanceof Error ? error.message : '执行失败';

      this.emit({
        type: 'workflow:error',
        workflowId: workflow.id,
        executionId,
        data: { error: execution.error },
        timestamp: Date.now()
      });
    } finally {
      this.abortControllers.delete(executionId);
    }

    return execution;
  }

  /**
   * 验证工作流
   */
  private validateWorkflow(workflow: Workflow): void {
    // 检查是否有触发器
    const triggerNodes = workflow.nodes.filter(n => n.type.startsWith('trigger.'));
    if (triggerNodes.length === 0) {
      throw new Error('工作流必须至少有一个触发器节点');
    }

    // 检查连接是否有效
    for (const conn of workflow.connections) {
      const sourceNode = workflow.nodes.find(n => n.id === conn.sourceNodeId);
      const targetNode = workflow.nodes.find(n => n.id === conn.targetNodeId);
      
      if (!sourceNode || !targetNode) {
        throw new Error(`无效的连接: ${conn.id}`);
      }

      // 检查端口是否存在
      const sourceDef = getNodeDefinition(sourceNode.type);
      const targetDef = getNodeDefinition(targetNode.type);
      
      if (sourceDef && !sourceDef.outputs.find(o => o.id === conn.sourceOutput)) {
        throw new Error(`节点 ${sourceNode.name} 没有输出端口 ${conn.sourceOutput}`);
      }
      
      if (targetDef && !targetDef.inputs.find(i => i.id === conn.targetInput)) {
        throw new Error(`节点 ${targetNode.name} 没有输入端口 ${conn.targetInput}`);
      }
    }

    // 检查是否有孤立节点（非触发器节点必须有输入连接）
    for (const node of workflow.nodes) {
      if (!node.type.startsWith('trigger.')) {
        const hasInput = workflow.connections.some(c => c.targetNodeId === node.id);
        if (!hasInput) {
          throw new Error(`节点 ${node.name} 没有输入连接`);
        }
      }
    }
  }

  /**
   * 执行单个节点
   */
  private async executeNode(
    workflow: Workflow,
    node: WorkflowNode,
    execution: WorkflowExecution,
    inputData?: NodeData
  ): Promise<NodeData> {
    const startTime = Date.now();
    const nodeExec: NodeExecution = {
      nodeId: node.id,
      status: 'running',
      startTime,
      input: inputData
    };

    execution.nodeExecutions.push(nodeExec);
    node.status = 'running';

    this.emit({
      type: 'node:start',
      workflowId: workflow.id,
      executionId: execution.id,
      nodeId: node.id,
      timestamp: startTime
    });

    try {
      // 获取节点执行器
      const executor = this.getExecutor(node.type);
      if (!executor) {
        throw new Error(`未找到节点执行器: ${node.type}`);
      }

      // 获取当前设置
      const settings = settingsService.getSettings();

      // 构建执行上下文
      const context: NodeExecutionContext = {
        nodeId: node.id,
        workflowId: workflow.id,
        executionId: execution.id,
        parameters: node.parameters,
        inputData: inputData || [],
        settings: node.settings,
        workflowData: execution.data,
        logger: {
          debug: (msg, data) => console.debug(`[${node.id}] ${msg}`, data),
          info: (msg, data) => console.info(`[${node.id}] ${msg}`, data),
          warn: (msg, data) => console.warn(`[${node.id}] ${msg}`, data),
          error: (msg, data) => console.error(`[${node.id}] ${msg}`, data)
        },
        services: {
          ai: aiService,
          tts: ttsService,
          image: generationService,
          video: generationService,
          ffmpeg: ffmpegService,
          storage: storageService
        },
        appSettings: settings
      };

      // 执行节点（支持重试）
      let outputData: NodeData;
      let lastError: Error | null = null;
      const retryCount = node.settings.retryOnFail ? (node.settings.retryCount || 2) : 0;
      
      for (let attempt = 0; attempt <= retryCount; attempt++) {
        try {
          outputData = await executor(context);
          lastError = null;
          break;
        } catch (error) {
          lastError = error as Error;
          if (attempt < retryCount) {
            const delay = Math.pow(2, attempt) * 1000; // 指数退避
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }

      if (lastError) {
        throw lastError;
      }

      // 应用节点设置
      if (node.settings.executeOnce && outputData!.length > 0) {
        outputData = [outputData![0]];
      }

      // 更新执行记录
      const endTime = Date.now();
      nodeExec.status = 'success';
      nodeExec.endTime = endTime;
      nodeExec.duration = endTime - startTime;
      nodeExec.output = outputData!;
      node.status = 'success';

      // 保存节点输出数据
      execution.data[node.id] = outputData!;

      this.emit({
        type: 'node:complete',
        workflowId: workflow.id,
        executionId: execution.id,
        nodeId: node.id,
        data: { duration: nodeExec.duration },
        timestamp: endTime
      });

      // 执行下游节点
      await this.executeDownstreamNodes(workflow, node, execution, outputData!);

      return outputData!;

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '节点执行失败';
      
      // 处理错误策略
      if (node.settings.onError === 'continue' || node.settings.onError === 'continueWithError') {
        nodeExec.status = 'error';
        nodeExec.error = errorMsg;
        node.status = 'error';
        
        this.emit({
          type: 'node:error',
          workflowId: workflow.id,
          executionId: execution.id,
          nodeId: node.id,
          data: { error: errorMsg },
          timestamp: Date.now()
        });

        // 继续执行下游
        const errorData: NodeData = [{
          json: { error: errorMsg, nodeId: node.id },
          binary: {}
        }];
        execution.data[node.id] = errorData;
        
        await this.executeDownstreamNodes(workflow, node, execution, errorData);
        return errorData;
      }

      // 停止工作流
      nodeExec.status = 'error';
      nodeExec.error = errorMsg;
      nodeExec.endTime = Date.now();
      node.status = 'error';

      this.emit({
        type: 'node:error',
        workflowId: workflow.id,
        executionId: execution.id,
        nodeId: node.id,
        data: { error: errorMsg },
        timestamp: Date.now()
      });

      throw error;
    }
  }

  /**
   * 执行下游节点
   */
  private async executeDownstreamNodes(
    workflow: Workflow,
    sourceNode: WorkflowNode,
    execution: WorkflowExecution,
    outputData: NodeData
  ): Promise<void> {
    // 找到所有从当前节点出发的连接
    const outgoingConnections = workflow.connections.filter(
      c => c.sourceNodeId === sourceNode.id
    );

    // 按输出端口分组
    const connectionsByOutput = new Map<string, NodeConnection[]>();
    for (const conn of outgoingConnections) {
      if (!connectionsByOutput.has(conn.sourceOutput)) {
        connectionsByOutput.set(conn.sourceOutput, []);
      }
      connectionsByOutput.get(conn.sourceOutput)!.push(conn);
    }

    // 并行执行下游节点
    const promises: Promise<NodeData>[] = [];
    
    for (const [outputName, connections] of connectionsByOutput) {
      for (const conn of connections) {
        const targetNode = workflow.nodes.find(n => n.id === conn.targetNodeId);
        if (!targetNode) continue;

        // 检查所有输入是否就绪
        const allInputsReady = this.checkInputsReady(workflow, targetNode, execution);
        if (!allInputsReady) continue;

        // 收集输入数据
        const inputData = this.collectInputData(workflow, targetNode, execution);
        
        promises.push(this.executeNode(workflow, targetNode, execution, inputData));
      }
    }

    await Promise.all(promises);
  }

  /**
   * 检查节点所有输入是否就绪
   */
  private checkInputsReady(
    workflow: Workflow,
    node: WorkflowNode,
    execution: WorkflowExecution
  ): boolean {
    const incomingConnections = workflow.connections.filter(
      c => c.targetNodeId === node.id
    );

    for (const conn of incomingConnections) {
      if (!execution.data[conn.sourceNodeId]) {
        return false;
      }
    }

    return true;
  }

  /**
   * 收集节点输入数据
   */
  private collectInputData(
    workflow: Workflow,
    node: WorkflowNode,
    execution: WorkflowExecution
  ): NodeData {
    const incomingConnections = workflow.connections.filter(
      c => c.targetNodeId === node.id
    );

    const data: NodeData = [];

    for (const conn of incomingConnections) {
      const sourceData = execution.data[conn.sourceNodeId];
      if (sourceData) {
        // 按输入端口过滤数据
        const sourceNode = workflow.nodes.find(n => n.id === conn.sourceNodeId);
        if (sourceNode) {
          const sourceDef = getNodeDefinition(sourceNode.type);
          const outputDef = sourceDef?.outputs.find(o => o.id === conn.sourceOutput);
          
          if (outputDef?.type === 'main') {
            data.push(...sourceData);
          } else if (outputDef?.id === 'error') {
            // 错误输出
            data.push(...sourceData.filter(d => d.json?.error));
          }
        }
      }
    }

    return data;
  }

  /**
   * 获取节点执行器
   */
  private getExecutor(nodeType: NodeType): NodeExecutor | null {
    const executors: Record<string, NodeExecutor> = {
      // ============================================
      // 触发器节点
      // ============================================
      'trigger.manual': async (ctx) => {
        return ctx.inputData.length > 0 ? ctx.inputData : [{ json: { triggered: true }, binary: {} }];
      },

      'trigger.schedule': async (ctx) => {
        return [{ 
          json: { 
            triggered: true, 
            scheduledAt: new Date().toISOString(),
            cron: ctx.parameters.cronExpression 
          }, 
          binary: {} 
        }];
      },

      'trigger.webhook': async (ctx) => {
        return [{ 
          json: { 
            triggered: true, 
            webhookPath: ctx.parameters.path,
            method: ctx.parameters.method
          }, 
          binary: {} 
        }];
      },

      // ============================================
      // AI 节点
      // ============================================
      'ai.chat': async (ctx) => {
        const { model, prompt, systemPrompt, temperature, maxTokens } = ctx.parameters;
        const inputText = ctx.inputData[0]?.json?.text || ctx.inputData[0]?.json?.prompt || '';
        
        const fullPrompt = inputText ? `${prompt}\n\n${inputText}` : prompt;
        
        // 获取 AI 设置
        const aiSettings = ctx.appSettings?.ai || {};
        
        try {
          // 调用 AI 服务
          const response = await aiService.chat(fullPrompt, {
            model,
            temperature: temperature ?? 0.7,
            maxTokens: maxTokens ?? 2000,
            systemPrompt
          });
          
          return [{ 
            json: { 
              response: response.content,
              model: response.model,
              usage: response.usage
            }, 
            binary: {} 
          }];
        } catch (error) {
          ctx.logger.error('AI 对话失败', error);
          throw new Error(`AI 对话失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
      },

      'ai.script': async (ctx) => {
        const { model, topic, style, tone, length, audience, language, keywords } = ctx.parameters;
        
        try {
          const script = await aiService.generateScript(
            { id: model || 'default', name: model || '默认模型', provider: 'openai' } as any,
            {},
            {
              topic,
              style: style || 'drama',
              tone: tone || 'neutral',
              length: length || 'medium',
              audience: audience || 'general',
              language: language || 'zh-CN',
              keywords: keywords?.split(',').map((k: string) => k.trim()).filter(Boolean)
            }
          );
          
          return [{ json: script, binary: {} }];
        } catch (error) {
          ctx.logger.error('脚本生成失败', error);
          throw new Error(`脚本生成失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
      },

      'ai.analyze': async (ctx) => {
        const { model, analysisType } = ctx.parameters;
        const text = ctx.inputData[0]?.json?.text || ctx.inputData[0]?.json?.content || '';
        
        if (!text) {
          throw new Error('需要输入文本内容');
        }
        
        try {
          const result = await aiService.analyzeText(text, {
            model,
            type: analysisType
          });
          
          return [{ json: result, binary: {} }];
        } catch (error) {
          ctx.logger.error('文本分析失败', error);
          throw new Error(`文本分析失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
      },

      // ============================================
      // 图像节点
      // ============================================
      'image.generate': async (ctx) => {
        const { provider, prompt, negativePrompt, style, aspectRatio, count } = ctx.parameters;
        const inputPrompt = ctx.inputData[0]?.json?.prompt || '';
        
        const fullPrompt = inputPrompt ? `${prompt}, ${inputPrompt}` : prompt;
        
        try {
          const images = await generationService.generateImages({
            prompt: fullPrompt,
            negativePrompt,
            style,
            aspectRatio,
            count: count || 1,
            provider
          });
          
          return images.map((img: any) => ({
            json: { 
              prompt: fullPrompt, 
              style,
              width: img.width,
              height: img.height
            },
            binary: {
              image: {
                data: img.data || img.url,
                mimeType: img.mimeType || 'image/png',
                fileName: `image-${Date.now()}.png`,
                url: img.url
              }
            }
          }));
        } catch (error) {
          ctx.logger.error('图像生成失败', error);
          throw new Error(`图像生成失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
      },

      'image.edit': async (ctx) => {
        const { provider, prompt, mask } = ctx.parameters;
        const imageData = ctx.inputData[0]?.binary?.image;
        
        if (!imageData) {
          throw new Error('需要输入图像');
        }
        
        try {
          const result = await generationService.editImage({
            image: imageData.data,
            prompt,
            mask,
            provider
          });
          
          return [{
            json: { prompt, edited: true },
            binary: {
              image: {
                data: result.data,
                mimeType: imageData.mimeType,
                fileName: `edited-${Date.now()}.png`
              }
            }
          }];
        } catch (error) {
          ctx.logger.error('图像编辑失败', error);
          throw new Error(`图像编辑失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
      },

      'image.upscale': async (ctx) => {
        const { scale, model } = ctx.parameters;
        const imageData = ctx.inputData[0]?.binary?.image;
        
        if (!imageData) {
          throw new Error('需要输入图像');
        }
        
        try {
          const result = await generationService.upscaleImage({
            image: imageData.data,
            scale: scale || 2,
            model
          });
          
          return [{
            json: { scale, originalSize: imageData.size, upscaled: true },
            binary: {
              image: {
                data: result.data,
                mimeType: imageData.mimeType,
                fileName: `upscaled-${Date.now()}.png`
              }
            }
          }];
        } catch (error) {
          ctx.logger.error('图像放大失败', error);
          throw new Error(`图像放大失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
      },

      // ============================================
      // 视频节点
      // ============================================
      'video.generate': async (ctx) => {
        const { provider, duration, fps, resolution } = ctx.parameters;
        const imageData = ctx.inputData[0]?.binary?.image;
        const textPrompt = ctx.inputData[0]?.json?.prompt || ctx.parameters.prompt;
        
        try {
          const video = await generationService.generateVideo({
            image: imageData?.data,
            prompt: textPrompt,
            duration: duration || 5,
            fps: fps || 24,
            resolution,
            provider
          });
          
          return [{
            json: { duration, fps, resolution },
            binary: {
              video: {
                data: video.data,
                mimeType: 'video/mp4',
                fileName: `video-${Date.now()}.mp4`,
                url: video.url
              }
            }
          }];
        } catch (error) {
          ctx.logger.error('视频生成失败', error);
          throw new Error(`视频生成失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
      },

      'video.edit': async (ctx) => {
        const { operation, startTime, endTime, effects } = ctx.parameters;
        const videoData = ctx.inputData[0]?.binary?.video;
        
        if (!videoData) {
          throw new Error('需要输入视频');
        }
        
        try {
          const result = await ffmpegService.processVideo({
            input: videoData.data,
            operation,
            startTime,
            endTime,
            effects
          });
          
          return [{
            json: { operation, processed: true },
            binary: {
              video: {
                data: result.data,
                mimeType: 'video/mp4',
                fileName: `edited-${Date.now()}.mp4`
              }
            }
          }];
        } catch (error) {
          ctx.logger.error('视频编辑失败', error);
          throw new Error(`视频编辑失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
      },

      'video.merge': async (ctx) => {
        const { transition, transitionDuration } = ctx.parameters;
        const videos = ctx.inputData
          .filter(d => d.binary?.video)
          .map(d => d.binary!.video);
        
        if (videos.length < 2) {
          throw new Error('需要至少两个视频');
        }
        
        try {
          const result = await ffmpegService.mergeVideos(
            videos.map(v => v.data),
            { transition, transitionDuration }
          );
          
          return [{
            json: { videoCount: videos.length, transition },
            binary: {
              video: {
                data: result.data,
                mimeType: 'video/mp4',
                fileName: `merged-${Date.now()}.mp4`
              }
            }
          }];
        } catch (error) {
          ctx.logger.error('视频合并失败', error);
          throw new Error(`视频合并失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
      },

      // ============================================
      // 音频节点
      // ============================================
      'audio.tts': async (ctx) => {
        const { provider, voice, speed, pitch, volume } = ctx.parameters;
        const text = ctx.inputData[0]?.json?.text || ctx.parameters.text || '';
        
        if (!text) {
          throw new Error('需要输入文本');
        }
        
        try {
          const audio = await ttsService.synthesize({
            text,
            voice: voice || 'zh-CN-XiaoxiaoNeural',
            speed: speed || 1.0,
            pitch: pitch || 0,
            volume: volume || 80
          }, {
            provider: provider || 'edge'
          });
          
          return [{
            json: { text, voice, duration: audio.duration },
            binary: {
              audio: {
                data: audio.audioUrl,
                mimeType: 'audio/mp3',
                fileName: `audio-${Date.now()}.mp3`
              }
            }
          }];
        } catch (error) {
          ctx.logger.error('语音合成失败', error);
          throw new Error(`语音合成失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
      },

      'audio.music': async (ctx) => {
        const { provider, style, duration, tempo, mood } = ctx.parameters;
        
        try {
          const music = await generationService.generateMusic({
            style,
            duration: duration || 30,
            tempo,
            mood,
            provider
          });
          
          return [{
            json: { style, duration, tempo, mood },
            binary: {
              audio: {
                data: music.data,
                mimeType: 'audio/mp3',
                fileName: `music-${Date.now()}.mp3`
              }
            }
          }];
        } catch (error) {
          ctx.logger.error('音乐生成失败', error);
          throw new Error(`音乐生成失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
      },

      'audio.merge': async (ctx) => {
        const { fadeIn, fadeOut, crossfade } = ctx.parameters;
        const audioItems = ctx.inputData.filter(d => d.binary?.audio);
        const videoData = ctx.inputData.find(d => d.binary?.video)?.binary?.video;
        
        try {
          const result = await ffmpegService.mergeAudioVideo({
            video: videoData?.data,
            audios: audioItems.map(a => ({
              data: a.binary!.audio!.data,
              fadeIn,
              fadeOut
            })),
            crossfade
          });
          
          // 返回视频+音频或纯音频
          if (videoData) {
            return [{
              json: { audioCount: audioItems.length },
              binary: {
                video: {
                  data: result.data,
                  mimeType: 'video/mp4',
                  fileName: `final-${Date.now()}.mp4`
                }
              }
            }];
          } else {
            return [{
              json: { audioCount: audioItems.length },
              binary: {
                audio: {
                  data: result.data,
                  mimeType: 'audio/mp3',
                  fileName: `merged-audio-${Date.now()}.mp3`
                }
              }
            }];
          }
        } catch (error) {
          ctx.logger.error('音频合并失败', error);
          throw new Error(`音频合并失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
      },

      // ============================================
      // 数据节点
      // ============================================
      'data.input': async (ctx) => {
        const { dataType, value } = ctx.parameters;
        
        if (dataType === 'json') {
          try {
            const parsed = JSON.parse(value);
            return [{ json: parsed, binary: {} }];
          } catch {
            throw new Error('无效的 JSON 格式');
          }
        }
        
        return [{ json: { value }, binary: {} }];
      },

      'data.transform': async (ctx) => {
        const { transformations } = ctx.parameters;
        const input = ctx.inputData[0]?.json || {};
        
        let output = { ...input };
        
        for (const transform of (transformations || [])) {
          const { type, field, value, mapping } = transform;
          
          switch (type) {
            case 'set':
              output[field] = value;
              break;
            case 'rename':
              if (output[field] !== undefined) {
                output[mapping] = output[field];
                delete output[field];
              }
              break;
            case 'delete':
              delete output[field];
              break;
            case 'extract':
              output = { [field]: output[field] };
              break;
          }
        }
        
        return [{ json: output, binary: ctx.inputData[0]?.binary || {} }];
      },

      'data.merge': async (ctx) => {
        const { mode, keepBinary } = ctx.parameters;
        const merged: NodeDataItem = { json: {}, binary: {} };
        
        for (const item of ctx.inputData) {
          if (mode === 'append') {
            merged.json = { ...merged.json, ...item.json };
          } else if (mode === 'deep') {
            merged.json = this.deepMerge(merged.json, item.json);
          } else if (mode === 'array') {
            if (!Array.isArray(merged.json.items)) {
              merged.json.items = [];
            }
            merged.json.items.push(item.json);
          }
          
          if (keepBinary !== false) {
            merged.binary = { ...merged.binary, ...item.binary };
          }
        }
        
        return [merged];
      },

      'data.filter': async (ctx) => {
        const { condition, keepMatching } = ctx.parameters;
        
        const filtered = ctx.inputData.filter(item => {
          const matches = this.evaluateCondition(condition, item.json);
          return keepMatching ? matches : !matches;
        });
        
        return filtered.length > 0 ? filtered : [];
      },

      'data.code': async (ctx) => {
        const { code, language } = ctx.parameters;
        const $input = ctx.inputData;
        const $node = (nodeId: string) => ctx.workflowData[nodeId];
        const $workflow = { id: ctx.workflowId, executionId: ctx.executionId };
        
        try {
          if (language === 'javascript') {
            const fn = new Function('$input', '$node', '$workflow', code);
            const result = await fn($input, $node, $workflow);
            
            if (Array.isArray(result)) {
              return result.map(r => ({ json: r, binary: {} }));
            }
            return [{ json: result, binary: {} }];
          }
          
          throw new Error(`不支持的语言: ${language}`);
        } catch (error) {
          ctx.logger.error('代码执行失败', error);
          throw new Error(`代码执行失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
      },

      // ============================================
      // 流程控制节点
      // ============================================
      'flow.condition': async (ctx) => {
        const { conditions } = ctx.parameters;
        const input = ctx.inputData[0]?.json || {};
        
        // 评估所有条件
        for (const condition of (conditions || [])) {
          if (this.evaluateCondition(condition.expression, input)) {
            return [{ 
              json: { ...input, conditionResult: condition.output },
              binary: ctx.inputData[0]?.binary || {}
            }];
          }
        }
        
        // 默认输出
        return ctx.inputData;
      },

      'flow.loop': async (ctx) => {
        const { mode, maxIterations } = ctx.parameters;
        const items = ctx.inputData;
        const results: NodeData = [];
        
        if (mode === 'each') {
          // 对每个输入项执行
          const iterations = Math.min(items.length, maxIterations || 100);
          for (let i = 0; i < iterations; i++) {
            results.push({
              json: { ...items[i].json, index: i, total: iterations },
              binary: items[i].binary
            });
          }
        } else if (mode === 'count') {
          // 指定次数循环
          const count = Math.min(ctx.parameters.count || 1, maxIterations || 100);
          for (let i = 0; i < count; i++) {
            results.push({
              json: { index: i, total: count },
              binary: {}
            });
          }
        }
        
        return results;
      },

      'flow.parallel': async (ctx) => {
        // 并行执行由下游节点处理，这里只是标记
        return ctx.inputData;
      },

      'flow.delay': async (ctx) => {
        const { delay, unit } = ctx.parameters;
        const delayMs = unit === 'seconds' ? delay * 1000 :
                       unit === 'minutes' ? delay * 60 * 1000 :
                       unit === 'hours' ? delay * 60 * 60 * 1000 :
                       delay;
        
        await new Promise(resolve => setTimeout(resolve, delayMs));
        
        return ctx.inputData;
      },

      // ============================================
      // 输出节点
      // ============================================
      'output.export': async (ctx) => {
        const { format, filename } = ctx.parameters;
        const data = ctx.inputData[0];
        
        let exportData: any;
        let mimeType: string;
        
        if (data?.binary) {
          // 导出二进制数据
          const binaryKey = Object.keys(data.binary)[0];
          exportData = data.binary[binaryKey].data;
          mimeType = data.binary[binaryKey].mimeType;
        } else {
          // 导出 JSON
          exportData = JSON.stringify(data?.json || {}, null, 2);
          mimeType = 'application/json';
        }
        
        return [{
          json: {
            exported: true,
            format,
            filename: filename || `export-${Date.now()}`,
            mimeType,
            size: exportData.length
          },
          binary: {
            export: {
              data: exportData,
              mimeType,
              fileName: filename || `export-${Date.now()}`
            }
          }
        }];
      },

      'output.save': async (ctx) => {
        const { projectId, name, description } = ctx.parameters;
        const data = ctx.inputData[0];
        
        try {
          // 创建项目数据
          const projectData = {
            id: projectId || `project_${Date.now()}`,
            name: name || `工作流输出 ${new Date().toLocaleString()}`,
            description: description || '从工作流生成的项目',
            data: data?.json || {},
            binaryData: data?.binary || {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          storageService.projects.save(projectData);
          
          return [{
            json: {
              saved: true,
              projectId: projectData.id,
              name: projectData.name,
              savedAt: projectData.updatedAt
            },
            binary: data?.binary || {}
          }];
        } catch (error) {
          ctx.logger.error('保存失败', error);
          throw new Error(`保存失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
      }
    };

    return executors[nodeType] || null;
  }

  /**
   * 深度合并对象
   */
  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    for (const key of Object.keys(source)) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  /**
   * 评估条件表达式
   */
  private evaluateCondition(condition: string, data: any): boolean {
    try {
      // 支持简单表达式
      // 例如: "{{json.status}} === 'success'"
      let expr = condition;
      
      // 替换变量引用 {{json.field}}
      expr = expr.replace(/\{\{\s*json\.(\w+(?:\.\w+)*)\s*\}\}/g, (_, path) => {
        const value = path.split('.').reduce((obj: any, key: string) => obj?.[key], data);
        return JSON.stringify(value);
      });
      
      // 安全评估
      const fn = new Function('return (' + expr + ')');
      return fn();
    } catch (error) {
      console.warn('条件评估失败:', error);
      return false;
    }
  }

  /**
   * 停止执行
   */
  stop(executionId: string): void {
    const controller = this.abortControllers.get(executionId);
    if (controller) {
      controller.abort();
    }
  }

  /**
   * 获取执行记录
   */
  getExecution(executionId: string): WorkflowExecution | undefined {
    return this.executions.get(executionId);
  }

  /**
   * 订阅事件
   */
  subscribe(listener: WorkflowEventListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * 发送事件
   */
  private emit(event: WorkflowEvent): void {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (error) {
        console.error('事件监听器错误:', error);
      }
    }
  }
}

// 导出单例
export const workflowEngine = new WorkflowEngine();
