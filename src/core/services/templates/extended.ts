/**
 * 扩展漫剧模板库
 * 更多场景、角色、风格模板
 */

import { StoryboardTemplate, SceneTemplate, CharacterTemplate, StyleTemplate } from '../drama-template.service';

// ========== 扩展分镜模板 ==========

export const EXTENDED_STORYBOARD_TEMPLATES: StoryboardTemplate[] = [
  {
    id: 'sb_template_5',
    name: '浪漫邂逅',
    description: '男女主角浪漫相遇场景',
    genre: 'romance',
    shots: [
      { type: 'wide', angle: 'eye_level', movement: 'static', duration: 3, description: '街景环境' },
      { type: 'medium', angle: 'eye_level', movement: 'pan', duration: 2, description: '男主走过' },
      { type: 'medium', angle: 'eye_level', movement: 'pan', duration: 2, description: '女主走过' },
      { type: 'close', angle: 'eye_level', movement: 'static', duration: 2, description: '目光交汇' },
      { type: 'extreme_close', angle: 'eye_level', movement: 'zoom', duration: 1, description: '心跳特写' },
      { type: 'medium', angle: 'eye_level', movement: 'dolly', duration: 3, description: '两人靠近' }
    ],
    transitions: ['fade', 'slow_motion', 'soft_focus'],
    duration: 15,
    tags: ['浪漫', '爱情', '邂逅'],
    usageCount: 156
  },
  {
    id: 'sb_template_6',
    name: '职场对决',
    description: '办公室权力斗争场景',
    genre: 'workplace',
    shots: [
      { type: 'wide', angle: 'eye_level', movement: 'static', duration: 2, description: '会议室全景' },
      { type: 'medium', angle: 'high', movement: 'pan', duration: 3, description: '俯视会议桌' },
      { type: 'close', angle: 'eye_level', movement: 'static', duration: 2, description: '主角坚定' },
      { type: 'close', angle: 'eye_level', movement: 'static', duration: 2, description: '对手阴沉' },
      { type: 'over_shoulder', angle: 'eye_level', movement: 'zoom', duration: 3, description: '对峙镜头' }
    ],
    transitions: ['cut', 'hard_cut', 'quick_cut'],
    duration: 14,
    tags: ['职场', '对决', '紧张'],
    usageCount: 89
  },
  {
    id: 'sb_template_7',
    name: '古风武侠',
    description: '古代武侠打斗场景',
    genre: 'wuxia',
    shots: [
      { type: 'wide', angle: 'bird', movement: 'static', duration: 3, description: '竹林全景' },
      { type: 'medium', angle: 'eye_level', movement: 'track', duration: 2, description: '轻功追逐' },
      { type: 'close', angle: 'low', movement: 'zoom', duration: 1, description: '剑光一闪' },
      { type: 'extreme_close', angle: 'eye_level', movement: 'static', duration: 1, description: '眼神杀气' },
      { type: 'wide', angle: 'high', movement: 'dolly', duration: 3, description: '空中对决' }
    ],
    transitions: ['cut', 'flash_cut', 'motion_blur'],
    duration: 12,
    tags: ['武侠', '古风', '打斗'],
    usageCount: 134
  },
  {
    id: 'sb_template_8',
    name: '科幻未来',
    description: '未来科幻场景',
    genre: 'scifi',
    shots: [
      { type: 'wide', angle: 'bird', movement: 'track', duration: 4, description: '未来城市全景' },
      { type: 'medium', angle: 'eye_level', movement: 'pan', duration: 3, description: '飞行器穿梭' },
      { type: 'close', angle: 'eye_level', movement: 'static', duration: 2, description: '全息界面' },
      { type: 'extreme_close', angle: 'eye_level', movement: 'zoom', duration: 2, description: '机械义眼' }
    ],
    transitions: ['fade', 'glitch', 'scan_line'],
    duration: 13,
    tags: ['科幻', '未来', '科技'],
    usageCount: 76
  },
  {
    id: 'sb_template_9',
    name: '校园青春',
    description: '校园青春日常场景',
    genre: 'youth',
    shots: [
      { type: 'wide', angle: 'eye_level', movement: 'static', duration: 3, description: '教室全景' },
      { type: 'medium', angle: 'eye_level', movement: 'pan', duration: 2, description: '同学互动' },
      { type: 'close', angle: 'eye_level', movement: 'static', duration: 2, description: '偷看暗恋' },
      { type: 'medium', angle: 'high', movement: 'tilt', duration: 3, description: '窗外夕阳' }
    ],
    transitions: ['fade', 'soft_cut', 'dreamy'],
    duration: 12,
    tags: ['校园', '青春', '纯爱'],
    usageCount: 198
  },
  {
    id: 'sb_template_10',
    name: '美食探店',
    description: '美食探店推荐场景',
    genre: 'food',
    shots: [
      { type: 'wide', angle: 'eye_level', movement: 'static', duration: 2, description: '店铺外观' },
      { type: 'medium', angle: 'eye_level', movement: 'pan', duration: 2, description: '店内环境' },
      { type: 'close', angle: 'eye_level', movement: 'zoom', duration: 2, description: '美食特写' },
      { type: 'extreme_close', angle: 'eye_level', movement: 'static', duration: 1, description: '食物纹理' },
      { type: 'medium', angle: 'eye_level', movement: 'static', duration: 2, description: '品尝表情' }
    ],
    transitions: ['fade', 'cut', 'zoom_in'],
    duration: 11,
    tags: ['美食', '探店', '生活'],
    usageCount: 167
  },
  {
    id: 'sb_template_11',
    name: '恐怖惊悚',
    description: '恐怖惊悚场景',
    genre: 'horror',
    shots: [
      { type: 'wide', angle: 'low', movement: 'static', duration: 4, description: '阴暗走廊' },
      { type: 'medium', angle: 'dutch', movement: 'pan', duration: 3, description: '诡异移动' },
      { type: 'close', angle: 'high', movement: 'zoom', duration: 2, description: '突然惊吓' },
      { type: 'extreme_close', angle: 'eye_level', movement: 'shake', duration: 1, description: '惊恐表情' }
    ],
    transitions: ['cut', 'dark_cut', 'jump_scare'],
    duration: 12,
    tags: ['恐怖', '惊悚', '悬疑'],
    usageCount: 45
  },
  {
    id: 'sb_template_12',
    name: '运动竞技',
    description: '体育运动竞技场景',
    genre: 'sports',
    shots: [
      { type: 'wide', angle: 'high', movement: 'static', duration: 2, description: '赛场全景' },
      { type: 'medium', angle: 'eye_level', movement: 'track', duration: 3, description: '运动员奔跑' },
      { type: 'close', angle: 'low', movement: 'zoom', duration: 2, description: '汗水特写' },
      { type: 'extreme_close', angle: 'eye_level', movement: 'static', duration: 1, description: '坚定眼神' },
      { type: 'wide', angle: 'eye_level', movement: 'dolly', duration: 3, description: '冲刺终点' }
    ],
    transitions: ['cut', 'slow_motion', 'speed_ramp'],
    duration: 13,
    tags: ['运动', '竞技', '热血'],
    usageCount: 112
  }
];

// ========== 扩展场景模板 ==========

export const EXTENDED_SCENE_TEMPLATES: SceneTemplate[] = [
  {
    id: 'scene_template_3',
    name: '古风庭院',
    description: '古代中式庭院场景',
    genre: 'historical',
    background: '古典园林，假山流水，亭台楼阁，竹林小径',
    lighting: '自然光，柔和散射',
    mood: '古朴、宁静、诗意',
    elements: ['假山', '池塘', '亭子', '竹林', '石桥'],
    tags: ['古风', '庭院', '中式'],
    usageCount: 128
  },
  {
    id: 'scene_template_4',
    name: '未来都市',
    description: '科幻未来城市场景',
    genre: 'scifi',
    background: '高楼林立，全息广告，飞行汽车，霓虹灯光',
    lighting: '霓虹灯光，冷色调',
    mood: '科技、繁华、冷峻',
    elements: ['摩天楼', '全息屏', '飞行器', '霓虹灯', '玻璃幕墙'],
    tags: ['科幻', '未来', '都市'],
    usageCount: 87
  },
  {
    id: 'scene_template_5',
    name: '海边沙滩',
    description: '海边度假场景',
    genre: 'leisure',
    background: '蓝天白云，碧海金沙，椰树遮阳伞',
    lighting: '强烈阳光，明亮',
    mood: '放松、愉悦、自由',
    elements: ['沙滩', '海浪', '椰树', '遮阳伞', '躺椅'],
    tags: ['海边', '度假', '夏日'],
    usageCount: 156
  },
  {
    id: 'scene_template_6',
    name: '咖啡厅',
    description: '文艺咖啡厅场景',
    genre: 'lifestyle',
    background: '复古装修，木质桌椅，书架绿植，落地窗',
    lighting: '暖色灯光，柔和',
    mood: '温馨、文艺、静谧',
    elements: ['吧台', '书架', '绿植', '咖啡杯', '落地窗'],
    tags: ['咖啡厅', '文艺', '休闲'],
    usageCount: 143
  },
  {
    id: 'scene_template_7',
    name: '医院病房',
    description: '医院病房场景',
    genre: 'medical',
    background: '白色病房，病床医疗设备，窗外景色',
    lighting: '冷白灯光，自然光',
    mood: '严肃、紧张、希望',
    elements: ['病床', '监护仪', '输液架', '窗帘', '床头柜'],
    tags: ['医院', '医疗', '严肃'],
    usageCount: 67
  },
  {
    id: 'scene_template_8',
    name: '健身房',
    description: '现代健身房场景',
    genre: 'fitness',
    background: '器械区，瑜伽区，落地镜，工业风装修',
    lighting: '明亮灯光，活力感',
    mood: '活力、汗水、坚持',
    elements: ['跑步机', '哑铃', '瑜伽垫', '落地镜', '储物柜'],
    tags: ['健身', '运动', '活力'],
    usageCount: 98
  },
  {
    id: 'scene_template_9',
    name: '图书馆',
    description: '安静图书馆场景',
    genre: 'education',
    background: '书架林立，阅读桌椅，落地窗，复古装修',
    lighting: '自然光+暖色灯光',
    mood: '安静、知识、专注',
    elements: ['书架', '书桌', '台灯', '楼梯', '窗户'],
    tags: ['图书馆', '学习', '安静'],
    usageCount: 112
  },
  {
    id: 'scene_template_10',
    name: '夜市街道',
    description: '热闹夜市场景',
    genre: 'nightlife',
    background: '摊位林立，霓虹招牌，人流涌动，烟火气息',
    lighting: '霓虹灯光，暖色调',
    mood: '热闹、烟火、生活',
    elements: ['摊位', '招牌', '人群', '桌椅', '灯笼'],
    tags: ['夜市', '街道', '热闹'],
    usageCount: 134
  }
];

// ========== 扩展角色模板 ==========

export const EXTENDED_CHARACTER_TEMPLATES: CharacterTemplate[] = [
  {
    id: 'char_template_3',
    name: '霸道总裁',
    description: '冷酷帅气的霸道总裁',
    appearance: {
      gender: 'male',
      age: '30-35',
      archetype: '霸道总裁'
    },
    personality: ['冷酷', '强势', '专一', '有能力'],
    role: 'protagonist',
    tags: ['总裁', '冷酷', '帅气'],
    usageCount: 234
  },
  {
    id: 'char_template_4',
    name: '邻家女孩',
    description: '温柔可爱的邻家女孩',
    appearance: {
      gender: 'female',
      age: '20-25',
      archetype: '邻家女孩'
    },
    personality: ['温柔', '善良', '可爱', '乐观'],
    role: 'protagonist',
    tags: ['邻家', '温柔', '可爱'],
    usageCount: 198
  },
  {
    id: 'char_template_5',
    name: '高冷学霸',
    description: '高冷聪明的学霸',
    appearance: {
      gender: 'unknown',
      age: '18-22',
      archetype: '高冷学霸'
    },
    personality: ['高冷', '聪明', '认真', '内敛'],
    role: 'protagonist',
    tags: ['学霸', '高冷', '聪明'],
    usageCount: 167
  },
  {
    id: 'char_template_6',
    name: '热血少年',
    description: '热血冲动的少年',
    appearance: {
      gender: 'male',
      age: '16-20',
      archetype: '热血少年'
    },
    personality: ['热血', '冲动', '正义', '勇敢'],
    role: 'protagonist',
    tags: ['热血', '少年', '正义'],
    usageCount: 145
  },
  {
    id: 'char_template_7',
    name: '腹黑反派',
    description: '心机深沉的反派角色',
    appearance: {
      gender: 'unknown',
      age: '25-40',
      archetype: '腹黑反派'
    },
    personality: ['腹黑', '阴险', '聪明', '野心'],
    role: 'antagonist',
    tags: ['反派', '腹黑', '阴险'],
    usageCount: 89
  },
  {
    id: 'char_template_8',
    name: '御姐女王',
    description: '成熟魅力的御姐',
    appearance: {
      gender: 'female',
      age: '28-35',
      archetype: '御姐女王'
    },
    personality: ['成熟', '自信', '独立', '魅力'],
    role: 'protagonist',
    tags: ['御姐', '成熟', '魅力'],
    usageCount: 156
  }
];

// ========== 扩展风格模板 ==========

export const EXTENDED_STYLE_TEMPLATES: StyleTemplate[] = [
  {
    id: 'style_template_3',
    name: '赛博朋克',
    description: '未来科技感风格',
    genre: 'scifi',
    artStyle: 'realistic',
    colorPalette: ['#ff0080', '#00ffff', '#2d004d', '#000000'],
    lightingStyle: '霓虹灯光，高对比度',
    characteristics: ['霓虹灯', '高科技', '低生活', '雨夜'],
    tags: ['赛博朋克', '科幻', '未来'],
    usageCount: 112
  },
  {
    id: 'style_template_4',
    name: '水墨国风',
    description: '中国传统水墨风格',
    genre: 'historical',
    artStyle: 'manga',
    colorPalette: ['#1a1a1a', '#4a4a4a', '#8a8a8a', '#ffffff'],
    lightingStyle: '淡雅水墨，留白意境',
    characteristics: ['水墨', '山水', '留白', '意境'],
    tags: ['水墨', '国风', '传统'],
    usageCount: 178
  },
  {
    id: 'style_template_5',
    name: '治愈系',
    description: '温暖治愈的风格',
    genre: 'slice_of_life',
    artStyle: 'anime',
    colorPalette: ['#ffb6c1', '#ffe4b5', '#e6e6fa', '#98fb98'],
    lightingStyle: '柔和暖光，温馨氛围',
    characteristics: ['柔和', '温暖', '治愈', '日常'],
    tags: ['治愈', '温暖', '日常'],
    usageCount: 234
  },
  {
    id: 'style_template_6',
    name: '暗黑哥特',
    description: '暗黑哥特风格',
    genre: 'dark',
    artStyle: 'realistic',
    colorPalette: ['#1a1a1a', '#4a0000', '#2d004d', '#000000'],
    lightingStyle: '暗调光线，神秘氛围',
    characteristics: ['暗黑', '哥特', '神秘', '华丽'],
    tags: ['暗黑', '哥特', '神秘'],
    usageCount: 67
  },
  {
    id: 'style_template_7',
    name: '像素风',
    description: '复古像素艺术风格',
    genre: 'retro',
    artStyle: 'chibi',
    colorPalette: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24'],
    lightingStyle: '平面光线，色块分明',
    characteristics: ['像素', '复古', '游戏', '怀旧'],
    tags: ['像素', '复古', '游戏'],
    usageCount: 89
  },
  {
    id: 'style_template_8',
    name: '蒸汽朋克',
    description: '蒸汽朋克机械风格',
    genre: 'steampunk',
    artStyle: 'realistic',
    colorPalette: ['#8b4513', '#d2691e', '#cd853f', '#daa520'],
    lightingStyle: '暖色调，金属光泽',
    characteristics: ['齿轮', '蒸汽', '机械', '复古未来'],
    tags: ['蒸汽朋克', '机械', '复古'],
    usageCount: 76
  }
];

// 导出所有扩展模板
export const ALL_EXTENDED_TEMPLATES = {
  storyboards: EXTENDED_STORYBOARD_TEMPLATES,
  scenes: EXTENDED_SCENE_TEMPLATES,
  characters: EXTENDED_CHARACTER_TEMPLATES,
  styles: EXTENDED_STYLE_TEMPLATES,
};
