import React, { useState } from 'react';
import { 
  Card, Button, Slider, Space, Typography, 
  Tag, Divider, List, Avatar, message, Tooltip, Progress
} from 'antd';
import { 
  ThunderboltOutlined, FireOutlined, StarOutlined,
  PlayCircleOutlined, PlusOutlined, CheckCircleOutlined,
  EyeOutlined, CrownOutlined
} from '@ant-design/icons';
import styles from './EffectsRecommender.module.less';

const { Text, Title } = Typography;

interface Effect {
  id: string;
  name: string;
  category: 'transition' | 'filter' | 'text' | 'animation' | 'particle';
  preview?: string;
  popularity: number;
  rating: number;
  aiRecommended: boolean;
  applied?: boolean;
}

const EFFECT_CATEGORIES = [
  { id: 'transition', name: '转场', icon: <PlayCircleOutlined /> },
  { id: 'filter', name: '滤镜', icon: <FireOutlined /> },
  { id: 'text', name: '文字', icon: <StarOutlined /> },
  { id: 'animation', name: '动画', icon: <ThunderboltOutlined /> },
  { id: 'particle', name: '粒子', icon: <FireOutlined /> },
];

const MOCK_EFFECTS: Effect[] = [
  { id: '1', name: '平滑缩放', category: 'transition', popularity: 95, rating: 4.8, aiRecommended: true },
  { id: '2', name: '闪烁过渡', category: 'transition', popularity: 88, rating: 4.5, aiRecommended: false },
  { id: '3', name: '电影调色', category: 'filter', popularity: 92, rating: 4.9, aiRecommended: true },
  { id: '4', name: '复古胶片', category: 'filter', popularity: 85, rating: 4.6, aiRecommended: false },
  { id: '5', name: '动态标题', category: 'text', popularity: 90, rating: 4.7, aiRecommended: true },
  { id: '6', name: '弹幕文字', category: 'text', popularity: 78, rating: 4.2, aiRecommended: false },
  { id: '7', name: '缩放弹出', category: 'animation', popularity: 86, rating: 4.4, aiRecommended: false },
  { id: '8', name: '光线粒子', category: 'particle', popularity: 94, rating: 4.8, aiRecommended: true },
];

const EffectsRecommender: React.FC = () => {
  const [effects, setEffects] = useState<Effect[]>(MOCK_EFFECTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [intensity, setIntensity] = useState<number>(70);
  const [showAIFilter, setShowAIFilter] = useState<boolean>(false);

  // 筛选特效
  const filteredEffects = effects.filter(effect => {
    if (selectedCategory !== 'all' && effect.category !== selectedCategory) {
      return false;
    }
    if (showAIFilter && !effect.aiRecommended) {
      return false;
    }
    return true;
  });

  // 应用特效
  const handleApply = (effectId: string) => {
    setEffects(prev => 
      prev.map(e => 
        e.id === effectId 
          ? { ...e, applied: !e.applied } 
          : e
      )
    );
    
    const effect = effects.find(e => e.id === effectId);
    if (effect?.applied) {
      message.success(`已移除 ${effect.name}`);
    } else {
      message.success(`已应用 ${effect?.name}`);
    }
  };

  // 获取分类图标
  const getCategoryIcon = (category: string) => {
    const cat = EFFECT_CATEGORIES.find(c => c.id === category);
    return cat?.icon || <StarOutlined />;
  };

  // 获取分类名称
  const getCategoryName = (category: string) => {
    const cat = EFFECT_CATEGORIES.find(c => c.id === category);
    return cat?.name || category;
  };

  // 获取分类标签颜色
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'transition': return 'blue';
      case 'filter': return 'orange';
      case 'text': return 'green';
      case 'animation': return 'purple';
      case 'particle': return 'magenta';
      default: return 'default';
    }
  };

  const appliedCount = effects.filter(e => e.applied).length;
  const aiRecommendedCount = effects.filter(e => e.aiRecommended).length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <ThunderboltOutlined className={styles.headerIcon} />
        <Title level={5} className={styles.title}>AI 特效推荐</Title>
        {aiRecommendedCount > 0 && (
          <Tag color="gold" className={styles.aiTag}>
            <CrownOutlined /> {aiRecommendedCount} 个AI推荐
          </Tag>
        )}
      </div>

      {/* AI 推荐说明 */}
      <Card className={styles.aiRecommendCard}>
        <div className={styles.aiRecommendContent}>
          <FireOutlined className={styles.fireIcon} />
          <div className={styles.aiRecommendText}>
            <Text strong>智能推荐</Text>
            <Text type="secondary">
              基于视频内容分析，自动推荐最适合的特效
            </Text>
          </div>
        </div>
      </Card>

      {/* 筛选 */}
      <div className={styles.filterSection}>
        <div className={styles.categoryTabs}>
          <Button
            type={selectedCategory === 'all' ? 'primary' : 'default'}
            onClick={() => setSelectedCategory('all')}
            size="small"
          >
            全部
          </Button>
          {EFFECT_CATEGORIES.map(cat => (
            <Button
              key={cat.id}
              type={selectedCategory === cat.id ? 'primary' : 'default'}
              onClick={() => setSelectedCategory(cat.id)}
              icon={cat.icon}
              size="small"
            >
              {cat.name}
            </Button>
          ))}
        </div>

        <div className={styles.filterRow}>
          <Button
            type={showAIFilter ? 'primary' : 'default'}
            onClick={() => setShowAIFilter(!showAIFilter)}
            icon={<CrownOutlined />}
            size="small"
          >
            仅AI推荐
          </Button>
          
          <div className={styles.intensityControl}>
            <Text type="secondary">强度</Text>
            <Slider
              value={intensity}
              onChange={setIntensity}
              min={0}
              max={100}
              style={{ width: 80 }}
              size="small"
            />
          </div>
        </div>
      </div>

      <Divider />

      {/* 已应用的特效 */}
      {appliedCount > 0 && (
        <div className={styles.appliedSection}>
          <Text strong className={styles.sectionLabel}>
            已应用 ({appliedCount})
          </Text>
          <div className={styles.appliedTags}>
            {effects.filter(e => e.applied).map(effect => (
              <Tag
                key={effect.id}
                closable
                onClose={() => handleApply(effect.id)}
                color="blue"
              >
                {effect.name}
              </Tag>
            ))}
          </div>
          <Divider />
        </div>
      )}

      {/* 特效列表 */}
      <div className={styles.listSection}>
        <Text strong className={styles.sectionLabel}>
          特效库 ({filteredEffects.length})
        </Text>

        <List
          className={styles.effectsList}
          dataSource={filteredEffects}
          renderItem={(effect) => (
            <Card
              size="small"
              className={`${styles.effectCard} ${effect.applied ? styles.applied : ''}`}
            >
              <div className={styles.effectPreview}>
                <div className={styles.previewPlaceholder}>
                  {getCategoryIcon(effect.category)}
                </div>
              </div>
              
              <div className={styles.effectInfo}>
                <div className={styles.effectHeader}>
                  <Space>
                    <Text strong>{effect.name}</Text>
                    {effect.aiRecommended && (
                      <Tag color="gold" className={styles.recommendTag}>
                        <CrownOutlined /> AI推荐
                      </Tag>
                    )}
                  </Space>
                </div>
                
                <div className={styles.effectMeta}>
                  <Tag color={getCategoryColor(effect.category)}>
                    {getCategoryName(effect.category)}
                  </Tag>
                  
                  <div className={styles.rating}>
                    <StarOutlined style={{ color: '#faad14' }} />
                    <Text>{effect.rating.toFixed(1)}</Text>
                  </div>
                  
                  <Tooltip title="热度">
                    <div className={styles.popularity}>
                      <EyeOutlined />
                      <Text type="secondary">{effect.popularity}%</Text>
                    </div>
                  </Tooltip>
                </div>
              </div>

              <div className={styles.effectActions}>
                <Button
                  type={effect.applied ? 'default' : 'primary'}
                  size="small"
                  icon={effect.applied ? <CheckCircleOutlined /> : <PlusOutlined />}
                  onClick={() => handleApply(effect.id)}
                >
                  {effect.applied ? '已应用' : '应用'}
                </Button>
              </div>
            </Card>
          )}
        />
      </div>
    </div>
  );
};

export default EffectsRecommender;
