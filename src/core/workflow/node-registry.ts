/**
 * 节点注册表
 * 定义所有可用的节点类型
 */

import { NodeDefinition, NodeType } from './types';

/**
 * 触发器节点
 */
const triggerNodes: NodeDefinition[] = [
  {
    type: 'trigger.manual',
    displayName: '手动触发',
    description: '手动启动工作流',
    category: 'trigger',
    icon: 'PlayCircleOutlined',
    inputs: [],
    outputs: [
      { id: 'main', name: 'main', displayName: '输出', type: 'output', dataType: 'json', required: true }
    ],
    parameters: [],
    defaultSettings: {}
  },
  {
    type: 'trigger.schedule',
    displayName: '定时触发',
    description: '按计划自动启动工作流',
    category: 'trigger',
    icon: 'ClockCircleOutlined',
    inputs: [],
    outputs: [
      { id: 'main', name: 'main', displayName: '输出', type: 'output', dataType: 'json', required: true }
    ],
    parameters: [
      {
        id: 'cron',
        name: 'cron',
        displayName: 'Cron 表达式',
        type: 'string',
        required: true,
        placeholder: '0 8 * * *',
        description: '例如: 0 8 * * * 表示每天早上8点'
      },
      {
        id: 'timezone',
        name: 'timezone',
        displayName: '时区',
        type: 'select',
        required: true,
        default: 'Asia/Shanghai',
        options: [
          { label: '北京时间 (UTC+8)', value: 'Asia/Shanghai' },
          { label: 'UTC', value: 'UTC' }
        ]
      }
    ],
    defaultSettings: {}
  },
  {
    type: 'trigger.webhook',
    displayName: 'Webhook 触发',
    description: '通过 Webhook URL 启动工作流',
    category: 'trigger',
    icon: 'ApiOutlined',
    inputs: [],
    outputs: [
      { id: 'main', name: 'main', displayName: '输出', type: 'output', dataType: 'json', required: true }
    ],
    parameters: [
      {
        id: 'path',
        name: 'path',
        displayName: '路径',
        type: 'string',
        required: true,
        placeholder: '/my-workflow'
      },
      {
        id: 'method',
        name: 'method',
        displayName: 'HTTP 方法',
        type: 'select',
        required: true,
        default: 'POST',
        options: [
          { label: 'POST', value: 'POST' },
          { label: 'GET', value: 'GET' }
        ]
      }
    ],
    defaultSettings: {}
  }
];

/**
 * AI 节点
 */
const aiNodes: NodeDefinition[] = [
  {
    type: 'ai.chat',
    displayName: 'AI 对话',
    description: '使用 AI 模型进行对话',
    category: 'ai',
    icon: 'MessageOutlined',
    inputs: [
      { id: 'main', name: 'main', displayName: '输入', type: 'input', dataType: 'json', required: true }
    ],
    outputs: [
      { id: 'main', name: 'main', displayName: '输出', type: 'output', dataType: 'json', required: true }
    ],
    parameters: [
      {
        id: 'model',
        name: 'model',
        displayName: 'AI 模型',
        type: 'select',
        required: true,
        default: 'baidu',
        options: [
          { label: '百度 ERNIE', value: 'baidu' },
          { label: '阿里通义千问', value: 'alibaba' },
          { label: '智谱 GLM', value: 'zhipu' },
          { label: '月之暗面 Kimi', value: 'moonshot' },
          { label: 'MiniMax', value: 'minimax' },
          { label: '字节豆包', value: 'doubao' }
        ]
      },
      {
        id: 'prompt',
        name: 'prompt',
        displayName: '提示词',
        type: 'string',
        required: true,
        description: '支持使用 {{变量}} 引用输入数据'
      },
      {
        id: 'temperature',
        name: 'temperature',
        displayName: '温度',
        type: 'number',
        required: false,
        default: 0.7
      },
      {
        id: 'maxTokens',
        name: 'maxTokens',
        displayName: '最大 Token',
        type: 'number',
        required: false,
        default: 2000
      }
    ],
    defaultSettings: {
      retryOnFail: true,
      retryCount: 2
    }
  },
  {
    type: 'ai.script',
    displayName: '剧本生成',
    description: 'AI 自动生成漫剧剧本',
    category: 'ai',
    icon: 'FileTextOutlined',
    inputs: [
      { id: 'main', name: 'main', displayName: '输入', type: 'input', dataType: 'json', required: true }
    ],
    outputs: [
      { id: 'main', name: 'main', displayName: '输出', type: 'output', dataType: 'json', required: true }
    ],
    parameters: [
      {
        id: 'model',
        name: 'model',
        displayName: 'AI 模型',
        type: 'select',
        required: true,
        default: 'baidu'
      },
      {
        id: 'topic',
        name: 'topic',
        displayName: '主题',
        type: 'string',
        required: true
      },
      {
        id: 'style',
        name: 'style',
        displayName: '风格',
        type: 'select',
        required: true,
        default: 'professional',
        options: [
          { label: '专业正式', value: 'professional' },
          { label: '轻松随意', value: 'casual' },
          { label: '幽默风趣', value: 'humorous' },
          { label: '情感共鸣', value: 'emotional' }
        ]
      },
      {
        id: 'length',
        name: 'length',
        displayName: '长度',
        type: 'select',
        required: true,
        default: 'medium',
        options: [
          { label: '短 (1-3分钟)', value: 'short' },
          { label: '中 (3-5分钟)', value: 'medium' },
          { label: '长 (5-10分钟)', value: 'long' }
        ]
      }
    ],
    defaultSettings: {
      retryOnFail: true,
      retryCount: 2
    }
  },
  {
    type: 'ai.analyze',
    displayName: '内容分析',
    description: 'AI 分析内容并提取信息',
    category: 'ai',
    icon: 'ScanOutlined',
    inputs: [
      { id: 'main', name: 'main', displayName: '输入', type: 'input', dataType: 'json', required: true }
    ],
    outputs: [
      { id: 'main', name: 'main', displayName: '输出', type: 'output', dataType: 'json', required: true }
    ],
    parameters: [
      {
        id: 'model',
        name: 'model',
        displayName: 'AI 模型',
        type: 'select',
        required: true,
        default: 'moonshot'
      },
      {
        id: 'analysisType',
        name: 'analysisType',
        displayName: '分析类型',
        type: 'select',
        required: true,
        default: 'extract',
        options: [
          { label: '提取关键信息', value: 'extract' },
          { label: '情感分析', value: 'sentiment' },
          { label: '角色提取', value: 'character' },
          { label: '场景提取', value: 'scene' }
        ]
      }
    ],
    defaultSettings: {}
  }
];

/**
 * 图像节点
 */
const imageNodes: NodeDefinition[] = [
  {
    type: 'image.generate',
    displayName: '图像生成',
    description: 'AI 生成图像',
    category: 'image',
    icon: 'PictureOutlined',
    inputs: [
      { id: 'main', name: 'main', displayName: '输入', type: 'input', dataType: 'json', required: true }
    ],
    outputs: [
      { id: 'main', name: 'main', displayName: '输出', type: 'output', dataType: 'binary', required: true }
    ],
    parameters: [
      {
        id: 'provider',
        name: 'provider',
        displayName: '提供商',
        type: 'select',
        required: true,
        default: 'bytedance',
        options: [
          { label: '字节 Seedream', value: 'bytedance' },
          { label: '快手可灵', value: 'kling' }
        ]
      },
      {
        id: 'prompt',
        name: 'prompt',
        displayName: '提示词',
        type: 'string',
        required: true
      },
      {
        id: 'negativePrompt',
        name: 'negativePrompt',
        displayName: '负向提示词',
        type: 'string',
        required: false
      },
      {
        id: 'style',
        name: 'style',
        displayName: '风格',
        type: 'select',
        required: true,
        default: 'anime',
        options: [
          { label: '写实', value: 'realistic' },
          { label: '动漫', value: 'anime' },
          { label: '油画', value: 'oil' },
          { label: '水彩', value: 'watercolor' },
          { label: '3D', value: '3d' },
          { label: '国风', value: 'chinese' }
        ]
      },
      {
        id: 'aspectRatio',
        name: 'aspectRatio',
        displayName: '比例',
        type: 'select',
        required: true,
        default: '16:9',
        options: [
          { label: '16:9 横屏', value: '16:9' },
          { label: '9:16 竖屏', value: '9:16' },
          { label: '1:1 方形', value: '1:1' }
        ]
      },
      {
        id: 'count',
        name: 'count',
        displayName: '生成数量',
        type: 'number',
        required: false,
        default: 1
      }
    ],
    defaultSettings: {
      timeout: 120,
      retryOnFail: true,
      retryCount: 3
    }
  },
  {
    type: 'image.edit',
    displayName: '图像编辑',
    description: '编辑处理图像',
    category: 'image',
    icon: 'EditOutlined',
    inputs: [
      { id: 'main', name: 'main', displayName: '输入', type: 'input', dataType: 'binary', required: true }
    ],
    outputs: [
      { id: 'main', name: 'main', displayName: '输出', type: 'output', dataType: 'binary', required: true }
    ],
    parameters: [
      {
        id: 'operation',
        name: 'operation',
        displayName: '操作',
        type: 'select',
        required: true,
        default: 'resize',
        options: [
          { label: '调整大小', value: 'resize' },
          { label: '裁剪', value: 'crop' },
          { label: '旋转', value: 'rotate' },
          { label: '滤镜', value: 'filter' }
        ]
      }
    ],
    defaultSettings: {}
  },
  {
    type: 'image.upscale',
    displayName: '图像放大',
    description: '使用 AI 放大图像',
    category: 'image',
    icon: 'ZoomInOutlined',
    inputs: [
      { id: 'main', name: 'main', displayName: '输入', type: 'input', dataType: 'binary', required: true }
    ],
    outputs: [
      { id: 'main', name: 'main', displayName: '输出', type: 'output', dataType: 'binary', required: true }
    ],
    parameters: [
      {
        id: 'scale',
        name: 'scale',
        displayName: '放大倍数',
        type: 'select',
        required: true,
        default: '2x',
        options: [
          { label: '2x', value: '2' },
          { label: '4x', value: '4' }
        ]
      }
    ],
    defaultSettings: {}
  }
];

/**
 * 视频节点
 */
const videoNodes: NodeDefinition[] = [
  {
    type: 'video.generate',
    displayName: '视频生成',
    description: 'AI 图生视频',
    category: 'video',
    icon: 'VideoCameraOutlined',
    inputs: [
      { id: 'main', name: 'main', displayName: '输入', type: 'input', dataType: 'binary', required: true }
    ],
    outputs: [
      { id: 'main', name: 'main', displayName: '输出', type: 'output', dataType: 'binary', required: true }
    ],
    parameters: [
      {
        id: 'provider',
        name: 'provider',
        displayName: '提供商',
        type: 'select',
        required: true,
        default: 'bytedance',
        options: [
          { label: '字节 Seedance', value: 'bytedance' },
          { label: '快手可灵', value: 'kling' },
          { label: '生数 Vidu', value: 'vidu' }
        ]
      },
      {
        id: 'duration',
        name: 'duration',
        displayName: '时长 (秒)',
        type: 'number',
        required: true,
        default: 5
      },
      {
        id: 'fps',
        name: 'fps',
        displayName: '帧率',
        type: 'number',
        required: false,
        default: 24
      }
    ],
    defaultSettings: {
      timeout: 300,
      retryOnFail: true,
      retryCount: 3
    }
  },
  {
    type: 'video.edit',
    displayName: '视频剪辑',
    description: '剪辑处理视频',
    category: 'video',
    icon: 'ScissorOutlined',
    inputs: [
      { id: 'main', name: 'main', displayName: '输入', type: 'input', dataType: 'binary', required: true, multiple: true }
    ],
    outputs: [
      { id: 'main', name: 'main', displayName: '输出', type: 'output', dataType: 'binary', required: true }
    ],
    parameters: [
      {
        id: 'operation',
        name: 'operation',
        displayName: '操作',
        type: 'select',
        required: true,
        default: 'merge',
        options: [
          { label: '合并', value: 'merge' },
          { label: '裁剪', value: 'trim' },
          { label: '添加字幕', value: 'subtitle' },
          { label: '添加转场', value: 'transition' }
        ]
      }
    ],
    defaultSettings: {}
  },
  {
    type: 'video.merge',
    displayName: '视频合成',
    description: '合并多个视频片段',
    category: 'video',
    icon: 'MergeCellsOutlined',
    inputs: [
      { id: 'main', name: 'main', displayName: '输入', type: 'input', dataType: 'binary', required: true, multiple: true }
    ],
    outputs: [
      { id: 'main', name: 'main', displayName: '输出', type: 'output', dataType: 'binary', required: true }
    ],
    parameters: [
      {
        id: 'transition',
        name: 'transition',
        displayName: '转场效果',
        type: 'select',
        required: true,
        default: 'fade',
        options: [
          { label: '淡入淡出', value: 'fade' },
          { label: '溶解', value: 'dissolve' },
          { label: '滑动', value: 'slide' },
          { label: '无', value: 'none' }
        ]
      },
      {
        id: 'transitionDuration',
        name: 'transitionDuration',
        displayName: '转场时长 (秒)',
        type: 'number',
        required: false,
        default: 0.5
      }
    ],
    defaultSettings: {}
  }
];

/**
 * 音频节点
 */
const audioNodes: NodeDefinition[] = [
  {
    type: 'audio.tts',
    displayName: '语音合成',
    description: '文本转语音',
    category: 'audio',
    icon: 'SoundOutlined',
    inputs: [
      { id: 'main', name: 'main', displayName: '输入', type: 'input', dataType: 'json', required: true }
    ],
    outputs: [
      { id: 'main', name: 'main', displayName: '输出', type: 'output', dataType: 'binary', required: true }
    ],
    parameters: [
      {
        id: 'provider',
        name: 'provider',
        displayName: '引擎',
        type: 'select',
        required: true,
        default: 'edge',
        options: [
          { label: 'Edge TTS (免费)', value: 'edge' },
          { label: '阿里云', value: 'aliyun' },
          { label: '百度', value: 'baidu' },
          { label: '讯飞', value: 'iflytek' }
        ]
      },
      {
        id: 'voice',
        name: 'voice',
        displayName: '音色',
        type: 'string',
        required: true,
        default: 'zh-CN-XiaoxiaoNeural'
      },
      {
        id: 'speed',
        name: 'speed',
        displayName: '语速',
        type: 'number',
        required: false,
        default: 1.0
      },
      {
        id: 'pitch',
        name: 'pitch',
        displayName: '音调',
        type: 'number',
        required: false,
        default: 1.0
      }
    ],
    defaultSettings: {}
  },
  {
    type: 'audio.music',
    displayName: '音乐生成',
    description: 'AI 生成背景音乐',
    category: 'audio',
    icon: 'CustomerServiceOutlined',
    inputs: [
      { id: 'main', name: 'main', displayName: '输入', type: 'input', dataType: 'json', required: true }
    ],
    outputs: [
      { id: 'main', name: 'main', displayName: '输出', type: 'output', dataType: 'binary', required: true }
    ],
    parameters: [
      {
        id: 'style',
        name: 'style',
        displayName: '音乐风格',
        type: 'select',
        required: true,
        default: 'cinematic',
        options: [
          { label: '电影感', value: 'cinematic' },
          { label: '轻松愉快', value: 'happy' },
          { label: '悲伤', value: 'sad' },
          { label: '紧张', value: 'tense' }
        ]
      },
      {
        id: 'duration',
        name: 'duration',
        displayName: '时长 (秒)',
        type: 'number',
        required: true,
        default: 30
      }
    ],
    defaultSettings: {}
  },
  {
    type: 'audio.merge',
    displayName: '音频合成',
    description: '合并音频到视频',
    category: 'audio',
    icon: 'FileSyncOutlined',
    inputs: [
      { id: 'video', name: 'video', displayName: '视频', type: 'input', dataType: 'binary', required: true },
      { id: 'audio', name: 'audio', displayName: '音频', type: 'input', dataType: 'binary', required: true }
    ],
    outputs: [
      { id: 'main', name: 'main', displayName: '输出', type: 'output', dataType: 'binary', required: true }
    ],
    parameters: [
      {
        id: 'volume',
        name: 'volume',
        displayName: '音量',
        type: 'number',
        required: false,
        default: 1.0
      },
      {
        id: 'replaceAudio',
        name: 'replaceAudio',
        displayName: '替换原音频',
        type: 'boolean',
        required: false,
        default: false
      }
    ],
    defaultSettings: {}
  }
];

/**
 * 数据节点
 */
const dataNodes: NodeDefinition[] = [
  {
    type: 'data.input',
    displayName: '数据输入',
    description: '定义输入数据',
    category: 'data',
    icon: 'ImportOutlined',
    inputs: [],
    outputs: [
      { id: 'main', name: 'main', displayName: '输出', type: 'output', dataType: 'json', required: true }
    ],
    parameters: [
      {
        id: 'data',
        name: 'data',
        displayName: '数据',
        type: 'json',
        required: true,
        default: {}
      }
    ],
    defaultSettings: {}
  },
  {
    type: 'data.transform',
    displayName: '数据转换',
    description: '转换数据格式',
    category: 'data',
    icon: 'TransformOutlined',
    inputs: [
      { id: 'main', name: 'main', displayName: '输入', type: 'input', dataType: 'json', required: true }
    ],
    outputs: [
      { id: 'main', name: 'main', displayName: '输出', type: 'output', dataType: 'json', required: true }
    ],
    parameters: [
      {
        id: 'transformations',
        name: 'transformations',
        displayName: '转换规则',
        type: 'json',
        required: true
      }
    ],
    defaultSettings: {}
  },
  {
    type: 'data.merge',
    displayName: '数据合并',
    description: '合并多个数据源',
    category: 'data',
    icon: 'MergeOutlined',
    inputs: [
      { id: 'main', name: 'main', displayName: '输入', type: 'input', dataType: 'json', required: true, multiple: true }
    ],
    outputs: [
      { id: 'main', name: 'main', displayName: '输出', type: 'output', dataType: 'json', required: true }
    ],
    parameters: [
      {
        id: 'mode',
        name: 'mode',
        displayName: '合并模式',
        type: 'select',
        required: true,
        default: 'append',
        options: [
          { label: '追加', value: 'append' },
          { label: '覆盖', value: 'override' },
          { label: '深度合并', value: 'deep' }
        ]
      }
    ],
    defaultSettings: {}
  },
  {
    type: 'data.filter',
    displayName: '数据过滤',
    description: '过滤数据',
    category: 'data',
    icon: 'FilterOutlined',
    inputs: [
      { id: 'main', name: 'main', displayName: '输入', type: 'input', dataType: 'json', required: true }
    ],
    outputs: [
      { id: 'true', name: 'true', displayName: '满足条件', type: 'output', dataType: 'json', required: true },
      { id: 'false', name: 'false', displayName: '不满足条件', type: 'output', dataType: 'json', required: true }
    ],
    parameters: [
      {
        id: 'condition',
        name: 'condition',
        displayName: '条件表达式',
        type: 'string',
        required: true,
        placeholder: '{{ $json.value }} > 10'
      }
    ],
    defaultSettings: {}
  },
  {
    type: 'data.code',
    displayName: '自定义代码',
    description: '执行自定义 JavaScript 代码',
    category: 'data',
    icon: 'CodeOutlined',
    inputs: [
      { id: 'main', name: 'main', displayName: '输入', type: 'input', dataType: 'any', required: true }
    ],
    outputs: [
      { id: 'main', name: 'main', displayName: '输出', type: 'output', dataType: 'any', required: true }
    ],
    parameters: [
      {
        id: 'code',
        name: 'code',
        displayName: '代码',
        type: 'code',
        required: true,
        default: `// 可用变量: $input, $node, $workflow
return $input;`
      }
    ],
    defaultSettings: {}
  }
];

/**
 * 流程控制节点
 */
const flowNodes: NodeDefinition[] = [
  {
    type: 'flow.condition',
    displayName: '条件分支',
    description: '根据条件执行不同分支',
    category: 'flow',
    icon: 'ForkOutlined',
    inputs: [
      { id: 'main', name: 'main', displayName: '输入', type: 'input', dataType: 'any', required: true }
    ],
    outputs: [
      { id: 'true', name: 'true', displayName: '是', type: 'output', dataType: 'any', required: true },
      { id: 'false', name: 'false', displayName: '否', type: 'output', dataType: 'any', required: true }
    ],
    parameters: [
      {
        id: 'condition',
        name: 'condition',
        displayName: '条件表达式',
        type: 'string',
        required: true
      }
    ],
    defaultSettings: {}
  },
  {
    type: 'flow.loop',
    displayName: '循环',
    description: '循环处理数据',
    category: 'flow',
    icon: 'ReloadOutlined',
    inputs: [
      { id: 'main', name: 'main', displayName: '输入', type: 'input', dataType: 'json', required: true }
    ],
    outputs: [
      { id: 'main', name: 'main', displayName: '输出', type: 'output', dataType: 'json', required: true }
    ],
    parameters: [
      {
        id: 'mode',
        name: 'mode',
        displayName: '循环模式',
        type: 'select',
        required: true,
        default: 'forEach',
        options: [
          { label: '遍历数组', value: 'forEach' },
          { label: '固定次数', value: 'count' },
          { label: '条件循环', value: 'while' }
        ]
      },
      {
        id: 'count',
        name: 'count',
        displayName: '循环次数',
        type: 'number',
        required: false
      }
    ],
    defaultSettings: {}
  },
  {
    type: 'flow.parallel',
    displayName: '并行执行',
    description: '并行执行多个分支',
    category: 'flow',
    icon: 'BranchesOutlined',
    inputs: [
      { id: 'main', name: 'main', displayName: '输入', type: 'input', dataType: 'any', required: true }
    ],
    outputs: [
      { id: 'main', name: 'main', displayName: '输出', type: 'output', dataType: 'any', required: true }
    ],
    parameters: [],
    defaultSettings: {}
  },
  {
    type: 'flow.delay',
    displayName: '延迟',
    description: '延迟执行',
    category: 'flow',
    icon: 'HourglassOutlined',
    inputs: [
      { id: 'main', name: 'main', displayName: '输入', type: 'input', dataType: 'any', required: true }
    ],
    outputs: [
      { id: 'main', name: 'main', displayName: '输出', type: 'output', dataType: 'any', required: true }
    ],
    parameters: [
      {
        id: 'delay',
        name: 'delay',
        displayName: '延迟时间 (秒)',
        type: 'number',
        required: true,
        default: 5
      }
    ],
    defaultSettings: {}
  }
];

/**
 * 输出节点
 */
const outputNodes: NodeDefinition[] = [
  {
    type: 'output.export',
    displayName: '导出文件',
    description: '导出处理结果',
    category: 'output',
    icon: 'ExportOutlined',
    inputs: [
      { id: 'main', name: 'main', displayName: '输入', type: 'input', dataType: 'binary', required: true }
    ],
    outputs: [],
    parameters: [
      {
        id: 'format',
        name: 'format',
        displayName: '导出格式',
        type: 'select',
        required: true,
        default: 'mp4',
        options: [
          { label: 'MP4 视频', value: 'mp4' },
          { label: 'PNG 图像', value: 'png' },
          { label: 'MP3 音频', value: 'mp3' }
        ]
      },
      {
        id: 'quality',
        name: 'quality',
        displayName: '质量',
        type: 'select',
        required: true,
        default: 'high',
        options: [
          { label: '高质量', value: 'high' },
          { label: '中等质量', value: 'medium' },
          { label: '低质量', value: 'low' }
        ]
      }
    ],
    defaultSettings: {}
  },
  {
    type: 'output.save',
    displayName: '保存到项目',
    description: '保存到 ManGaAI 项目',
    category: 'output',
    icon: 'SaveOutlined',
    inputs: [
      { id: 'main', name: 'main', displayName: '输入', type: 'input', dataType: 'binary', required: true }
    ],
    outputs: [],
    parameters: [
      {
        id: 'projectId',
        name: 'projectId',
        displayName: '项目 ID',
        type: 'string',
        required: true
      },
      {
        id: 'name',
        name: 'name',
        displayName: '文件名',
        type: 'string',
        required: true
      }
    ],
    defaultSettings: {}
  }
];

/**
 * 所有节点定义
 */
export const nodeRegistry: Record<NodeType, NodeDefinition> = [
  ...triggerNodes,
  ...aiNodes,
  ...imageNodes,
  ...videoNodes,
  ...audioNodes,
  ...dataNodes,
  ...flowNodes,
  ...outputNodes
].reduce((acc, node) => {
  acc[node.type] = node;
  return acc;
}, {} as Record<NodeType, NodeDefinition>);

/**
 * 按分类获取节点
 */
export const nodesByCategory = {
  trigger: triggerNodes,
  ai: aiNodes,
  image: imageNodes,
  video: videoNodes,
  audio: audioNodes,
  data: dataNodes,
  flow: flowNodes,
  output: outputNodes
};

/**
 * 获取节点定义
 */
export function getNodeDefinition(type: NodeType): NodeDefinition | undefined {
  return nodeRegistry[type];
}

/**
 * 创建节点实例
 */
export function createNode(
  type: NodeType,
  id: string,
  position: { x: number; y: number },
  name?: string,
  parameters?: Record<string, any>
): import('./types').WorkflowNode {
  const definition = getNodeDefinition(type);
  if (!definition) {
    throw new Error(`Unknown node type: ${type}`);
  }

  return {
    id,
    type,
    name: name || definition.displayName,
    position,
    parameters: parameters || definition.parameters.reduce((acc, param) => {
      if (param.default !== undefined) {
        acc[param.id] = param.default;
      }
      return acc;
    }, {} as Record<string, any>),
    inputs: definition.inputs,
    outputs: definition.outputs,
    settings: {
      onError: 'stop',
      ...definition.defaultSettings
    }
  };
}
