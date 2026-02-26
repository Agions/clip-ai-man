import React, { useState } from 'react';
import { 
  Card, Button, Slider, Switch, Select, Space, Typography, 
  Progress, Tag, Divider, Tooltip, message, Empty, Badge
} from 'antd';
import { 
  ScissorOutlined, ThunderboltOutlined, 
  ClockCircleOutlined, VideoCameraOutlined,
  DeleteOutlined, PlayCircleOutlined, PauseCircleOutlined,
  QuestionCircleOutlined, CheckCircleOutlined, LoadingOutlined
} from '@ant-design/icons';
import styles from './AIClipController.module.less';

const { Text, Title } = Typography;
const { Option } = Select;

interface ClipSegment {
  id: string;
  start: number;
  end: number;
  type: 'highlight' | 'boring' | 'normal' | 'transition';
  confidence: number;
  reason?: string;
  selected?: boolean;
}

interface AIClipControllerProps {
  videoDuration: number;
  segments?: ClipSegment[];
  onApplyClips?: (segments: ClipSegment[]) => void;
  onAnalyze?: () => void;
  analyzing?: boolean;
}

const AIClipController: React.FC<AIClipControllerProps> = ({
  videoDuration,
  segments = [],
  onApplyClips,
  onAnalyze,
  analyzing = false
}) => {
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [clipMode, setClipMode] = useState<'smart' | 'highlights' | 'custom'>('smart');
  const [intensity, setIntensity] = useState<number>(70);
  const [minDuration, setMinDuration] = useState<number>(3);
  const [autoRemoveBoring, setAutoRemoveBoring] = useState<boolean>(true);

  // 格式化时间
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 计算总时长
  const calculateTotalDuration = () => {
    return segments.reduce((total, seg) => {
      if (selectedSegments.includes(seg.id) || selectedSegments.length === 0) {
        return total + (seg.end - seg.start);
      }
      return total;
    }, 0);
  };

  // 处理片段选择
  const handleSegmentSelect = (segmentId: string) => {
    setSelectedSegments(prev => 
      prev.includes(segmentId)
        ? prev.filter(id => id !== segmentId)
        : [...prev, segmentId]
    );
  };

  // 全选
  const handleSelectAll = () => {
    setSelectedSegments(segments.map(s => s.id));
  };

  // 清除选择
  const handleClearSelection = () => {
    setSelectedSegments([]);
  };

  // 应用剪辑
  const handleApply = () => {
    const selected = segments.filter(s => selectedSegments.includes(s.id));
    onApplyClips?.(selected);
    message.success(`已应用 ${selected.length} 个片段`);
  };

  // 获取片段类型标签颜色
  const getSegmentTagColor = (type: ClipSegment['type']) => {
    switch (type) {
      case 'highlight': return 'gold';
      case 'boring': return 'default';
      case 'transition': return 'blue';
      default: return 'green';
    }
  };

  // 获取片段类型名称
  const getSegmentTypeName = (type: ClipSegment['type']) => {
    switch (type) {
      case 'highlight': return '精彩片段';
      case 'boring': return '平淡内容';
      case 'transition': return '转场';
      default: return '普通片段';
    }
  };

  // 模拟分析数据
  const mockSegments: ClipSegment[] = [
    { id: '1', start: 0, end: 15, type: 'highlight', confidence: 0.92, reason: '开场精彩画面' },
    { id: '2', start: 15, end: 45, type: 'normal', confidence: 0.65, reason: '内容叙事' },
    { id: '3', start: 45, end: 60, type: 'highlight', confidence: 0.88, reason: '高潮部分' },
    { id: '4', start: 60, end: 90, type: 'boring', confidence: 0.78, reason: '冗长对话' },
    { id: '5', start: 90, end: 120, type: 'highlight', confidence: 0.95, reason: '精彩结尾' },
    { id: '6', start: 120, end: 135, type: 'transition', confidence: 0.72, reason: '场景转换' },
  ];

  const displaySegments = segments.length > 0 ? segments : mockSegments;
  const totalDuration = calculateTotalDuration();
  const highlightCount = displaySegments.filter(s => s.type === 'highlight').length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <ThunderboltOutlined className={styles.headerIcon} />
          <Title level={5} className={styles.title}>AI 智能剪辑</Title>
        </div>
        <Badge 
          count={highlightCount} 
          style={{ backgroundColor: '#faad14' }}
          title="精彩片段数"
        />
      </div>

      {/* 分析按钮 */}
      <div className={styles.analyzeSection}>
        <Button 
          type="primary" 
          icon={analyzing ? <LoadingOutlined /> : <VideoCameraOutlined />}
          onClick={onAnalyze}
          loading={analyzing}
          block
        >
          {analyzing ? 'AI 分析中...' : 'AI 分析视频'}
        </Button>
        <Text type="secondary" className={styles.hint}>
          AI 将自动识别精彩片段、删除冗余内容
        </Text>
      </div>

      <Divider />

      {/* 剪辑模式设置 */}
      <div className={styles.settingsSection}>
        <Text strong className={styles.sectionLabel}>剪辑模式</Text>
        <Select 
          value={clipMode} 
          onChange={setClipMode}
          style={{ width: '100%' }}
        >
          <Option value="smart">
            <Space>
              <ThunderboltOutlined /> 智能模式
            </Space>
          </Option>
          <Option value="highlights">
            <Space>
              <PlayCircleOutlined /> 仅保留精彩片段
            </Space>
          </Option>
          <Option value="custom">
            <Space>
              <ScissorOutlined /> 自定义模式
            </Space>
          </Option>
        </Select>

        {clipMode === 'custom' && (
          <>
            <div className={styles.sliderSection}>
              <div className={styles.sliderHeader}>
                <Text>AI 强度</Text>
                <Text>{intensity}%</Text>
              </div>
              <Slider 
                value={intensity} 
                onChange={setIntensity}
                min={0}
                max={100}
              />
            </div>

            <div className={styles.sliderSection}>
              <div className={styles.sliderHeader}>
                <Text>最短片段</Text>
                <Text>{minDuration}秒</Text>
              </div>
              <Slider 
                value={minDuration} 
                onChange={setMinDuration}
                min={1}
                max={30}
              />
            </div>

            <div className={styles.switchSection}>
              <Text>自动删除平淡内容</Text>
              <Switch 
                checked={autoRemoveBoring} 
                onChange={setAutoRemoveBoring}
              />
            </div>
          </>
        )}
      </div>

      <Divider />

      {/* 片段列表 */}
      <div className={styles.segmentsSection}>
        <div className={styles.segmentsHeader}>
          <Text strong className={styles.sectionLabel}>
            识别片段 ({displaySegments.length})
          </Text>
          <Space size="small">
            <Button type="link" size="small" onClick={handleSelectAll}>全选</Button>
            <Button type="link" size="small" onClick={handleClearSelection}>清除</Button>
          </Space>
        </div>

        <div className={styles.segmentsList}>
          {displaySegments.length === 0 ? (
            <Empty 
              description="点击上方按钮分析视频" 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            displaySegments.map((segment) => (
              <Card 
                key={segment.id}
                size="small"
                className={`${styles.segmentCard} ${
                  selectedSegments.includes(segment.id) ? styles.selected : ''
                } ${segment.type === 'highlight' ? styles.highlight : ''}`}
                onClick={() => handleSegmentSelect(segment.id)}
              >
                <div className={styles.segmentContent}>
                  <div className={styles.segmentTime}>
                    <ClockCircleOutlined />
                    <Text>
                      {formatTime(segment.start)} - {formatTime(segment.end)}
                    </Text>
                  </div>
                  <div className={styles.segmentInfo}>
                    <Tag color={getSegmentTagColor(segment.type)}>
                      {getSegmentTypeName(segment.type)}
                    </Tag>
                    <Tooltip title={`AI 置信度: ${(segment.confidence * 100).toFixed(0)}%`}>
                      <Progress 
                        percent={segment.confidence * 100} 
                        size="small"
                        showInfo={false}
                        strokeColor={segment.type === 'highlight' ? '#faad14' : '#52c41a'}
                      />
                    </Tooltip>
                  </div>
                  {segment.reason && (
                    <Text type="secondary" className={styles.segmentReason}>
                      {segment.reason}
                    </Text>
                  )}
                </div>
                {selectedSegments.includes(segment.id) && (
                  <CheckCircleOutlined className={styles.checkIcon} />
                )}
              </Card>
            ))
          )}
        </div>
      </div>

      {/* 统计信息 */}
      {displaySegments.length > 0 && (
        <div className={styles.statsSection}>
          <div className={styles.statItem}>
            <Text type="secondary">原时长</Text>
            <Text strong>{formatTime(videoDuration)}</Text>
          </div>
          <div className={styles.statItem}>
            <Text type="secondary">剪辑后</Text>
            <Text strong>{formatTime(totalDuration || videoDuration)}</Text>
          </div>
          <div className={styles.statItem}>
            <Text type="secondary">压缩比</Text>
            <Text strong>
              {totalDuration > 0 ? ((1 - totalDuration / videoDuration) * 100).toFixed(0) : 0}%
            </Text>
          </div>
        </div>
      )}

      {/* 应用按钮 */}
      <div className={styles.applySection}>
        <Button 
          type="primary"
          icon={<ScissorOutlined />}
          onClick={handleApply}
          disabled={displaySegments.length === 0}
          block
        >
          应用剪辑
        </Button>
      </div>
    </div>
  );
};

export default AIClipController;
