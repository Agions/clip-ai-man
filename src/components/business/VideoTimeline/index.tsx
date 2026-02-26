/**
 * 视频时间轴组件
 * 用于展示和编辑视频时间轴
 */
import React from 'react';
import { Timeline, Card } from 'antd';
import type { Timeline as TimeLineType } from '@/core/types';

export interface VideoTimelineProps {
  timeline?: TimeLineType;
  videoInfo?: any;
  script?: any;
  onChange?: (timeline: TimeLineType) => void;
  onSave?: (timeline: any) => void;
  readonly?: boolean;
}

export const VideoTimeline: React.FC<VideoTimelineProps> = ({
  timeline,
  onChange,
  readonly = false
}) => {
  return (
    <Card title="视频时间轴" size="small">
      <Timeline>
        <Timeline.Item>开始</Timeline.Item>
        <Timeline.Item>场景 1</Timeline.Item>
        <Timeline.Item>场景 2</Timeline.Item>
        <Timeline.Item>场景 3</Timeline.Item>
        <Timeline.Item>结束</Timeline.Item>
      </Timeline>
    </Card>
  );
};

export default VideoTimeline;
