/**
 * AI 模型相关常量
 */

// LLM 模型列表（用于 AI 服务）
export const LLM_MODELS = {
  BAIDU_ERNIE: {
    modelId: 'ernie-5.0',
    name: 'ERNIE 5.0',
    provider: 'baidu',
    description: '百度最新大模型',
    defaultModel: 'ernie-5.0',
  },
  ALIBABA_QWEN: {
    modelId: 'qwen-3.5',
    name: '通义千问 3.5',
    provider: 'alibaba',
    description: '阿里大模型',
    defaultModel: 'qwen-3.5',
  },
  ZHIPU_GLM: {
    modelId: 'glm-5',
    name: 'GLM-5',
    provider: 'zhipu',
    description: '智谱大模型',
    defaultModel: 'glm-5',
  },
  MOONSHOT_KIMI: {
    modelId: 'kimi-k2.5',
    name: 'Kimi k2.5',
    provider: 'moonshot',
    description: '月之暗面大模型',
    defaultModel: 'kimi-k2.5',
  },
  MINIMAX: {
    modelId: 'minimax-m2.5',
    name: 'MiniMax M2.5',
    provider: 'minimax',
    description: 'MiniMax大模型',
    defaultModel: 'minimax-m2.5',
  },
  BYTEDANCE_DOUBAO: {
    modelId: 'doubao-pro',
    name: '豆包 Pro',
    provider: 'doubao',
    description: '字节大模型',
    defaultModel: 'doubao-pro',
  },
} as const;

// 默认 LLM 模型
export const DEFAULT_LLM_MODEL = LLM_MODELS.BAIDU_ERNIE;

// 模型推荐配置
export const MODEL_RECOMMENDATIONS = {
  script: [LLM_MODELS.BAIDU_ERNIE, LLM_MODELS.ALIBABA_QWEN, LLM_MODELS.ZHIPU_GLM],
  analysis: [LLM_MODELS.MOONSHOT_KIMI, LLM_MODELS.MINIMAX],
  creative: [LLM_MODELS.BYTEDANCE_DOUBAO, LLM_MODELS.ALIBABA_QWEN],
} as const;

// AI 模型配置
export const AI_MODELS = {
  // 百度
  BAIDU: {
    name: '百度',
    models: [
      { value: 'ernie-5.0', label: 'ERNIE 5.0', desc: '百度最新大模型' }
    ],
    endpoint: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/',
    docs: 'https://cloud.baidu.com/doc/WENXINWORKSHOP/index.html'
  },
  // 阿里
  ALIBABA: {
    name: '阿里',
    models: [
      { value: 'qwen3.5', label: '通义千问 3.5', desc: '阿里大模型' }
    ],
    endpoint: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    docs: 'https://help.aliyun.com/dashscope/'
  },
  // 智谱
  ZHIPU: {
    name: '智谱',
    models: [
      { value: 'glm-5', label: 'GLM-5', desc: '智谱大模型' }
    ],
    endpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    docs: 'https://open.bigmodel.cn/dev/howuse/glm-4'
  },
  // 月之暗面
  MOONSHOT: {
    name: '月之暗面',
    models: [
      { value: 'kimi-k2.5', label: 'Kimi k2.5', desc: '月之暗面大模型' }
    ],
    endpoint: 'https://api.moonshot.cn/v1/chat/completions',
    docs: 'https://platform.moonshot.cn/docs'
  },
  // MiniMax
  MINIMAX: {
    name: 'MiniMax',
    models: [
      { value: 'minimax-m2.5', label: 'MiniMax M2.5', desc: 'MiniMax大模型' }
    ],
    endpoint: 'https://api.minimax.chat/v1/text/chatcompletion_v2',
    docs: 'https://api.minimax.chat/document/guides'
  },
  // 字节
  BYTEDANCE: {
    name: '字节',
    models: [
      { value: 'doubao-pro', label: '豆包 Pro', desc: '字节大模型' }
    ],
    endpoint: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
    docs: 'https://www.volcengine.com/docs/82379'
  }
} as const;

// 图像生成模型
export const IMAGE_MODELS = {
  // 字节
  SEEDREAM: {
    name: '字节 Seedream',
    model: 'seedream-2.0',
    endpoint: 'https://ark.cn-beijing.volces.com/api/v3/images/generations',
    styles: ['写实', '动漫', '油画', '水彩', '素描', '像素', '3D', '国风', '赛博朋克', '复古']
  },
  // 快手
  KOLORS: {
    name: '快手可灵',
    model: 'kolors-1.6',
    endpoint: 'https://api.klingai.com/v1/images/generations',
    styles: ['写实', '动漫', '油画', '水彩', '素描', '像素', '3D', '国风', '赛博朋克', '复古']
  }
} as const;

// 视频生成模型
export const VIDEO_MODELS = {
  // 字节
  SEEDANCE: {
    name: '字节 Seedance',
    model: 'seedance-2.0',
    endpoint: 'https://ark.cn-beijing.volces.com/api/v3/videos/generations',
    maxDuration: 10
  },
  // 快手
  KOLORS_VIDEO: {
    name: '快手可灵视频',
    model: 'kolors-video-1.6',
    endpoint: 'https://api.klingai.com/v1/videos/generations',
    maxDuration: 10
  },
  // 生数
  VIDU: {
    name: '生数 Vidu',
    model: 'vidu-2.0',
    endpoint: 'https://api.vidu.com/v1/videos/generations',
    maxDuration: 8
  }
} as const;

// TTS 提供商
export const TTS_PROVIDERS = {
  EDGE: {
    name: 'Edge TTS',
    type: 'free',
    voices: [
      { value: 'zh-CN-XiaoxiaoNeural', label: '晓晓', gender: '女', locale: 'zh-CN' },
      { value: 'zh-CN-YunxiNeural', label: '云希', gender: '男', locale: 'zh-CN' },
      { value: 'zh-CN-YunjianNeural', label: '云健', gender: '男', locale: 'zh-CN' },
      { value: 'zh-CN-XiaoyiNeural', label: '晓伊', gender: '女', locale: 'zh-CN' },
      { value: 'zh-CN-YunyangNeural', label: '云扬', gender: '男', locale: 'zh-CN' },
      { value: 'zh-CN-XiaochenNeural', label: '晓晨', gender: '女', locale: 'zh-CN' },
      { value: 'zh-CN-XiaohanNeural', label: '晓涵', gender: '女', locale: 'zh-CN' },
      { value: 'zh-CN-XiaomengNeural', label: '晓梦', gender: '女', locale: 'zh-CN' },
      { value: 'zh-CN-XiaomoNeural', label: '晓墨', gender: '男', locale: 'zh-CN' },
      { value: 'zh-CN-XiaoruiNeural', label: '晓睿', gender: '男', locale: 'zh-CN' },
      { value: 'zh-CN-XiaoshuangNeural', label: '晓双', gender: '女', locale: 'zh-CN', child: true },
      { value: 'zh-CN-XiaoxuanNeural', label: '晓萱', gender: '女', locale: 'zh-CN' },
      { value: 'zh-CN-XiaoyanNeural', label: '晓颜', gender: '女', locale: 'zh-CN' },
      { value: 'zh-CN-XiaoyouNeural', label: '晓悠', gender: '女', locale: 'zh-CN', child: true },
      { value: 'zh-CN-YunfengNeural', label: '云峰', gender: '男', locale: 'zh-CN' },
      { value: 'zh-CN-YunhaoNeural', label: '云浩', gender: '男', locale: 'zh-CN' },
      { value: 'zh-CN-YunxiaNeural', label: '云夏', gender: '男', locale: 'zh-CN' },
      { value: 'zh-CN-YunyeNeural', label: '云野', gender: '男', locale: 'zh-CN' },
      { value: 'zh-CN-YunzeNeural', label: '云泽', gender: '男', locale: 'zh-CN' },
      { value: 'zh-CN-liaoning-XiaobeiNeural', label: '晓北(东北)', gender: '女', locale: 'zh-CN-liaoning' },
      { value: 'zh-CN-shaanxi-XiaoniNeural', label: '晓妮(陕西)', gender: '女', locale: 'zh-CN-shaanxi' },
      { value: 'zh-HK-HiuMaanNeural', label: '晓曼(粤语)', gender: '女', locale: 'zh-HK' },
      { value: 'zh-HK-WanLungNeural', label: '云龙(粤语)', gender: '男', locale: 'zh-HK' },
      { value: 'zh-TW-HsiaoChenNeural', label: '晓辰(台湾)', gender: '女', locale: 'zh-TW' },
      { value: 'zh-TW-YunJheNeural', label: '云哲(台湾)', gender: '男', locale: 'zh-TW' }
    ]
  },
  ALIBABA: {
    name: '阿里云',
    type: 'paid',
    endpoint: 'https://nls-gateway-cn-shanghai.aliyuncs.com/stream/v1/tts',
    voices: [
      { value: 'xiaoyun', label: '小云', gender: '女', scene: '通用' },
      { value: 'xiaogang', label: '小刚', gender: '男', scene: '通用' },
      { value: 'ruoxi', label: '若兮', gender: '女', scene: '客服' },
      { value: 'siqi', label: '思琪', gender: '女', scene: '客服' },
      { value: 'sijia', label: '思佳', gender: '女', scene: '客服' },
      { value: 'sicheng', label: '思诚', gender: '男', scene: '客服' },
      { value: 'aiqi', label: '艾琪', gender: '女', scene: '客服' },
      { value: 'aijia', label: '艾佳', gender: '女', scene: '客服' },
      { value: 'aicheng', label: '艾诚', gender: '男', scene: '客服' },
      { value: 'aida', label: '艾达', gender: '男', scene: '客服' },
      { value: 'ninger', label: '宁儿', gender: '女', scene: '文学' },
      { value: 'ruilin', label: '瑞琳', gender: '女', scene: '文学' },
      { value: 'siyue', label: '思悦', gender: '女', scene: '文学' },
      { value: 'aiya', label: '艾雅', gender: '女', scene: '文学' },
      { value: 'aixia', label: '艾夏', gender: '女', scene: '文学' },
      { value: 'aimei', label: '艾美', gender: '女', scene: '文学' },
      { value: 'aiyu', label: '艾雨', gender: '女', scene: '文学' },
      { value: 'aiyue', label: '艾悦', gender: '女', scene: '文学' },
      { value: 'aijing', label: '艾静', gender: '女', scene: '文学' },
      { value: 'xiaomei', label: '小美', gender: '女', scene: '直播' },
      { value: 'aina', label: '艾娜', gender: '女', scene: '直播' },
      { value: 'yina', label: '伊娜', gender: '女', scene: '直播' },
      { value: 'sijing', label: '思婧', gender: '女', scene: '直播' },
      { value: 'sitong', label: '思彤', gender: '女', scene: '直播' },
      { value: 'xiaobei', label: '小北', gender: '女', scene: '直播' }
    ]
  },
  BAIDU: {
    name: '百度',
    type: 'paid',
    endpoint: 'https://tsn.baidu.com/text2audio',
    voices: [
      { value: '0', label: '度小美', gender: '女', type: '精品' },
      { value: '1', label: '度小宇', gender: '男', type: '精品' },
      { value: '3', label: '度逍遥', gender: '男', type: '精品' },
      { value: '4', label: '度丫丫', gender: '女', type: '精品' },
      { value: '5003', label: '度灵儿', gender: '女', type: '精品' },
      { value: '5118', label: '度博文', gender: '男', type: '精品' },
      { value: '106', label: '度小贤', gender: '男', type: '精品' },
      { value: '110', label: '度小萌', gender: '女', type: '精品' },
      { value: '111', label: '度米朵', gender: '女', type: '精品' },
      { value: '103', label: '度逍遥', gender: '男', type: '精品' },
      { value: '5', label: '度小娇', gender: '女', type: '普通' },
      { value: '8', label: '度小娇', gender: '女', type: '普通' }
    ]
  },
  IFLYTEK: {
    name: '讯飞',
    type: 'paid',
    endpoint: 'https://api.xfyun.cn/v1/service/v1/tts',
    voices: [
      { value: 'xiaoyan', label: '小燕', gender: '女', desc: '标准女声' },
      { value: 'xiaoyu', label: '小宇', gender: '男', desc: '标准男声' },
      { value: 'catherine', label: '凯瑟琳', gender: '女', desc: '英文女声' },
      { value: 'henry', label: '亨利', gender: '男', desc: '英文男声' },
      { value: 'vixy', label: '小桃', gender: '女', desc: '可爱女声' }
    ]
  }
} as const;
