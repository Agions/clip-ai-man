# 漫剧师 项目重命名与重构执行计划

## 项目新名称
**漫剧师** - AI 漫剧创作平台

## 重构目标
1. 重命名项目为 漫剧师
2. 重构目录结构
3. 清理重复代码
4. 统一命名规范

## 执行步骤

### Phase 1: 准备
- [ ] 备份当前代码
- [ ] 创建重构分支
- [ ] 更新 package.json

### Phase 2: 目录重构
- [ ] 创建标准目录结构
- [ ] 移动文件到新位置
- [ ] 更新路径别名

### Phase 3: 代码清理
- [ ] 删除重复的服务
- [ ] 删除未使用的组件
- [ ] 合并类型定义

### Phase 4: 命名更新
- [ ] 更新项目名称为 漫剧师
- [ ] 更新所有文档
- [ ] 更新 README

### Phase 5: 验证
- [ ] 构建测试
- [ ] 功能测试
- [ ] 提交代码

## 新目录结构

```
nova/
├── src/
│   ├── core/                 # 核心层
│   │   ├── api/             # API 客户端
│   │   ├── services/        # 业务服务
│   │   ├── hooks/           # 自定义 Hooks
│   │   ├── stores/          # 状态管理
│   │   ├── types/           # 类型定义
│   │   ├── constants/       # 常量
│   │   └── utils/           # 工具函数
│   ├── components/          # 组件层
│   │   ├── common/          # 通用组件
│   │   ├── business/        # 业务组件
│   │   └── layout/          # 布局组件
│   ├── pages/               # 页面层
│   ├── assets/              # 静态资源
│   └── styles/              # 全局样式
├── public/                  # 公共资源
├── docs/                    # 文档
├── scripts/                 # 脚本
└── package.json
```

## 关键变更

### 1. 项目名称
- 漫剧师 → 漫剧师
- 漫剧工坊 → 漫剧工坊

### 2. 核心概念
- 小说 (Novel)
- 剧本 (Script)
- 分镜 (Storyboard)
- 角色 (Character)
- 场景 (Scene)
- 漫剧 (Drama)

### 3. 服务命名
- NovelService - 小说服务
- ScriptService - 剧本服务
- StoryboardService - 分镜服务
- CharacterService - 角色服务
- DramaService - 漫剧服务
- AIService - AI 服务

### 4. 页面命名
- NovelPage - 小说页
- ScriptPage - 剧本页
- StoryboardPage - 分镜页
- CharacterPage - 角色页
- DramaPage - 漫剧页
- ExportPage - 导出页
