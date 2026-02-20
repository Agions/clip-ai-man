# 漫剧师 项目详细重构执行计划

## 项目分析

### 代码统计
- **总文件数**: 100 个 TS/TSX 文件
- **总代码行数**: 27,421 行
- **最大文件**: Settings.tsx (957 行)
- **目录数**: 30+ 个目录

### 主要问题

#### 1. 服务层重复
- `src/services/` (旧) vs `src/core/services/` (新)
- aiService.ts (907行) vs ai.service.ts (608行)
- 功能重复但实现不同

#### 2. 目录结构混乱
```
src/
├── services/          # 旧服务层
├── core/services/     # 新服务层
├── hooks/             # 旧 hooks
├── core/hooks/        # 新 hooks
├── store/             # 旧状态
├── core/store/        # 新状态
├── types/             # 旧类型
├── core/types/        # 新类型
├── features/          # 功能模块（未使用）
├── shared/            # 共享模块（未使用）
└── ...
```

#### 3. 组件重复
- ScriptGenerator/ vs ScriptGeneratorV2/
- VideoUploader/ vs VideoUploader.tsx
- 新旧版本并存

#### 4. 大型文件
- Settings.tsx (957行) - 需要拆分
- VideoEditor.tsx (726行) - 需要拆分
- Workflow/index.tsx (670行) - 需要拆分

## 重构策略

### 策略 1: 渐进式重构
不一次性全部修改，而是分模块逐步重构

### 策略 2: 双轨并行
保持旧代码运行，同时开发新结构

### 策略 3: 功能优先
先保证功能正常，再优化结构

## 详细执行计划

### Phase 1: 基础设施 (1-2天)

#### 1.1 创建新目录结构
```
src/
├── @nova/                    # 新核心模块
│   ├── core/                # 核心层
│   │   ├── api/            # API 客户端
│   │   ├── services/       # 业务服务
│   │   ├── hooks/          # 自定义 Hooks
│   │   ├── stores/         # 状态管理
│   │   ├── types/          # 类型定义
│   │   ├── constants/      # 常量
│   │   └── utils/          # 工具函数
│   ├── components/         # 组件层
│   │   ├── common/        # 通用组件
│   │   ├── business/      # 业务组件
│   │   └── layout/        # 布局组件
│   └── pages/              # 页面层
├── legacy/                  # 旧代码（保留运行）
└── ...
```

#### 1.2 配置路径别名
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@nova/*": ["./src/@nova/*"],
      "@legacy/*": ["./src/legacy/*"]
    }
  }
}
```

#### 1.3 创建类型系统
```typescript
// @nova/core/types/index.ts
export * from './novel.types';
export * from './script.types';
export * from './storyboard.types';
export * from './character.types';
export * from './drama.types';
export * from './ai.types';
export * from './common.types';
```

### Phase 2: 核心服务重构 (2-3天)

#### 2.1 服务层设计
```typescript
// @nova/core/services/index.ts
export { NovelService } from './novel.service';
export { ScriptService } from './script.service';
export { StoryboardService } from './storyboard.service';
export { CharacterService } from './character.service';
export { DramaService } from './drama.service';
export { AIService } from './ai.service';
export { StorageService } from './storage.service';
```

#### 2.2 逐个迁移服务
| 服务 | 旧文件 | 新文件 | 优先级 |
|------|--------|--------|--------|
| AI | aiService.ts + ai.service.ts | ai.service.ts | P0 |
| Novel | novel.service.ts | novel.service.ts | P0 |
| Script | scriptService.ts | script.service.ts | P0 |
| Storage | storageService.ts | storage.service.ts | P1 |
| Video | videoService.ts | video.service.ts | P1 |

### Phase 3: Hooks 重构 (1-2天)

#### 3.1 核心 Hooks
```typescript
// @nova/core/hooks/index.ts
export { useNovel } from './useNovel';
export { useScript } from './useScript';
export { useStoryboard } from './useStoryboard';
export { useCharacter } from './useCharacter';
export { useDrama } from './useDrama';
export { useAI } from './useAI';
```

#### 3.2 通用 Hooks
```typescript
export { useLocalStorage } from './useLocalStorage';
export { useDebounce } from './useDebounce';
export { useAsync } from './useAsync';
```

### Phase 4: 组件重构 (3-5天)

#### 4.1 通用组件
```
@nova/components/common/
├── Button/
├── Card/
├── Input/
├── Select/
├── Modal/
├── Loading/
└── Empty/
```

#### 4.2 业务组件
```
@nova/components/business/
├── NovelUploader/          # 小说上传
├── NovelParser/            # 小说解析
├── ScriptEditor/           # 剧本编辑
├── StoryboardEditor/       # 分镜编辑
├── StoryboardPreview/      # 分镜预览
├── CharacterDesigner/      # 角色设计
├── CharacterList/          # 角色列表
├── SceneRenderer/          # 场景渲染
├── DramaPlayer/            # 漫剧播放
├── DramaExporter/          # 漫剧导出
└── ModelSelector/          # 模型选择
```

#### 4.3 布局组件
```
@nova/components/layout/
├── MainLayout/
├── Sidebar/
├── Header/
└── Footer/
```

### Phase 5: 页面重构 (2-3天)

#### 5.1 页面结构
```
@nova/pages/
├── Home/                   # 首页
├── Novel/                  # 小说管理
│   ├── index.tsx          # 小说列表
│   ├── Upload.tsx         # 上传小说
│   └── Detail.tsx         # 小说详情
├── Script/                 # 剧本管理
│   ├── index.tsx          # 剧本列表
│   ├── Edit.tsx           # 编辑剧本
│   └── Detail.tsx         # 剧本详情
├── Storyboard/             # 分镜管理
│   ├── index.tsx          # 分镜列表
│   ├── Edit.tsx           # 编辑分镜
│   └── Preview.tsx        # 预览分镜
├── Character/              # 角色管理
│   ├── index.tsx          # 角色列表
│   ├── Design.tsx         # 设计角色
│   └── Detail.tsx         # 角色详情
├── Drama/                  # 漫剧管理
│   ├── index.tsx          # 漫剧列表
│   ├── Create.tsx         # 创建漫剧
│   ├── Edit.tsx           # 编辑漫剧
│   └── Export.tsx         # 导出漫剧
├── Settings/               # 设置
│   ├── index.tsx          # 设置主页
│   ├── API.tsx            # API 设置
│   ├── Model.tsx          # 模型设置
│   └── Preference.tsx     # 偏好设置
└── Dashboard/              # 仪表盘
    └── index.tsx
```

### Phase 6: 路由重构 (1天)

#### 6.1 路由配置
```typescript
// @nova/routes/index.tsx
const routes = [
  { path: '/', element: <Home /> },
  { path: '/novel', element: <NovelList /> },
  { path: '/novel/upload', element: <NovelUpload /> },
  { path: '/script', element: <ScriptList /> },
  { path: '/script/:id', element: <ScriptDetail /> },
  { path: '/storyboard', element: <StoryboardList /> },
  { path: '/character', element: <CharacterList /> },
  { path: '/drama', element: <DramaList /> },
  { path: '/drama/create', element: <DramaCreate /> },
  { path: '/settings', element: <Settings /> },
];
```

### Phase 7: 状态管理重构 (1-2天)

#### 7.1 Store 设计
```typescript
// @nova/core/stores/index.ts
export { useNovelStore } from './novel.store';
export { useScriptStore } from './script.store';
export { useStoryboardStore } from './storyboard.store';
export { useCharacterStore } from './character.store';
export { useDramaStore } from './drama.store';
export { useUIStore } from './ui.store';
```

### Phase 8: 测试与验证 (2-3天)

#### 8.1 单元测试
- 服务层测试
- Hooks 测试
- 组件测试

#### 8.2 集成测试
- 页面流程测试
- 数据流测试

#### 8.3 E2E 测试
- 完整用户流程

## 时间安排

| 阶段 | 任务 | 时间 | 依赖 |
|------|------|------|------|
| Phase 1 | 基础设施 | 1-2天 | 无 |
| Phase 2 | 核心服务 | 2-3天 | Phase 1 |
| Phase 3 | Hooks | 1-2天 | Phase 2 |
| Phase 4 | 组件 | 3-5天 | Phase 3 |
| Phase 5 | 页面 | 2-3天 | Phase 4 |
| Phase 6 | 路由 | 1天 | Phase 5 |
| Phase 7 | 状态管理 | 1-2天 | Phase 2 |
| Phase 8 | 测试 | 2-3天 | All |
| **总计** | | **13-21天** | |

## 风险控制

### 风险 1: 功能回归
**缓解**: 每个阶段完成后进行完整测试

### 风险 2: 时间超期
**缓解**: 优先完成核心功能，非核心可以延后

### 风险 3: 团队协作
**缓解**: 清晰的接口定义，模块间低耦合

## 成功标准

- [ ] 所有功能正常运行
- [ ] 代码行数减少 30%+
- [ ] 无重复代码
- [ ] 构建时间减少
- [ ] 测试覆盖率 80%+

## 下一步行动

1. 创建 @nova 目录结构
2. 开始 Phase 1 实施
3. 每日进度检查
