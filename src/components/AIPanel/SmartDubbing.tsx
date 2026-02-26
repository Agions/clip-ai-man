import React, { useState } from 'react';
import { 
  Card, Button, Select, Slider, Space, Typography, 
  Progress, Tag, Divider, List, Avatar, message, Input, Tooltip
} from 'antd';
import { 
  AudioOutlined, PlayCircleOutlined, PauseCircleOutlined,
  DownloadOutlined, DeleteOutlined, PlusOutlined,
  UserOutlined, RobotOutlined, SoundOutlined, SyncOutlined,
  CheckCircleOutlined, LoadingOutlined
} from '@ant-design/icons';
import styles from './SmartDubbing.module.less';

const { Text, Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface Voiceover {
  id: string;
  text: string;
  voice: string;
  duration: number;
  status: 'pending' | 'generating' | 'completed' | 'error';
  audioUrl?: string;
}

interface SmartDubbingProps {
  onGenerate?: (text: string, voice: string) => void;
}

const VOICE_OPTIONS = [
  { id: 'zh-CN-XiaoxiaoNeural', name: '晓晓', gender: '女', style: '温柔' },
  { id: 'zh-CN-YunxiNeural', name: '云希', gender: '男', style: '自然' },
  { id: 'zh-CN-YunyangNeural', name: '云扬', gender: '男', style: '专业' },
  { id: 'zh-CN-XiaoyiNeural', name: '小艺', gender: '女', style: '活泼' },
];

const SmartDubbing: React.FC<SmartDubbingProps> = ({ onGenerate }) => {
  const [voiceText, setVoiceText] = useState<string>('');
  const [selectedVoice, setSelectedVoice] = useState<string>('zh-CN-XiaoxiaoNeural');
  const [speed, setSpeed] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(0);
  const [volume, setVolume] = useState<number>(80);
  const [voiceovers, setVoiceovers] = useState<Voiceover[]>([
    {
      id: '1',
      text: '欢迎使用 AI 智能配音功能',
      voice: 'zh-CN-XiaoxiaoNeural',
      duration: 3.5,
      status: 'completed',
    },
  ]);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // 生成配音
  const handleGenerate = () => {
    if (!voiceText.trim()) {
      message.warning('请输入配音文本');
      return;
    }

    const newVoiceover: Voiceover = {
      id: Date.now().toString(),
      text: voiceText,
      voice: selectedVoice,
      duration: voiceText.length / 5, // 估算时长
      status: 'generating',
    };

    setVoiceovers(prev => [...prev, newVoiceover]);
    setVoiceText('');

    // 模拟生成过程
    setTimeout(() => {
      setVoiceovers(prev => 
        prev.map(v => 
          v.id === newVoiceover.id 
            ? { ...v, status: 'completed' as const }
            : v
        )
      );
      message.success('配音生成完成');
    }, 2000);

    onGenerate?.(voiceText, selectedVoice);
  };

  // 播放/暂停
  const handlePlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  };

  // 删除配音
  const handleDelete = (id: string) => {
    setVoiceovers(prev => prev.filter(v => v.id !== id));
    message.success('已删除配音');
  };

  // 获取语音名称
  const getVoiceName = (voiceId: string) => {
    const voice = VOICE_OPTIONS.find(v => v.id === voiceId);
    return voice ? voice.name : voiceId;
  };

  // 格式化时长
  const formatDuration = (seconds: number): string => {
    const secs = Math.floor(seconds);
    const ms = Math.floor((seconds - secs) * 10);
    return `${secs}.${ms}s`;
  };

  // 估算字符时长
  const estimateDuration = (text: string): number => {
    return Math.max(1, text.length / (5 * speed));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <AudioOutlined className={styles.headerIcon} />
        <Title level={5} className={styles.title}>智能配音</Title>
      </div>

      {/* 配音输入 */}
      <div className={styles.inputSection}>
        <TextArea
          placeholder="输入配音文本..."
          value={voiceText}
          onChange={(e) => setVoiceText(e.target.value)}
          rows={4}
          maxLength={500}
          showCount
        />
        <div className={styles.estimateInfo}>
          <SoundOutlined />
          <Text type="secondary">
            预计时长: {formatDuration(estimateDuration(voiceText || '0'))}
          </Text>
        </div>
      </div>

      {/* 语音选择 */}
      <div className={styles.voiceSection}>
        <Text strong className={styles.sectionLabel}>选择音色</Text>
        <Select
          value={selectedVoice}
          onChange={setSelectedVoice}
          style={{ width: '100%' }}
          optionLabelProp="label"
        >
          {VOICE_OPTIONS.map(voice => (
            <Option 
              key={voice.id} 
              value={voice.id}
              label={voice.name}
            >
              <Space>
                <Avatar 
                  size="small" 
                  icon={voice.gender === '女' ? <UserOutlined /> : <RobotOutlined />}
                  style={{ 
                    backgroundColor: voice.gender === '女' ? '#eb6f92' : '#3b82f6' 
                  }}
                />
                <span>{voice.name}</span>
                <Tag>{voice.gender}</Tag>
                <Text type="secondary">{voice.style}</Text>
              </Space>
            </Option>
          ))}
        </Select>
      </div>

      {/* 参数调节 */}
      <div className={styles.paramsSection}>
        <Text strong className={styles.sectionLabel}>参数调节</Text>
        
        <div className={styles.paramItem}>
          <div className={styles.paramHeader}>
            <Text>语速</Text>
            <Text>{speed.toFixed(1)}x</Text>
          </div>
          <Slider
            value={speed}
            onChange={setSpeed}
            min={0.5}
            max={2}
            step={0.1}
          />
        </div>

        <div className={styles.paramItem}>
          <div className={styles.paramHeader}>
            <Text>音调</Text>
            <Text>{pitch > 0 ? `+${pitch}` : pitch}</Text>
          </div>
          <Slider
            value={pitch}
            onChange={setPitch}
            min={-10}
            max={10}
          />
        </div>

        <div className={styles.paramItem}>
          <div className={styles.paramHeader}>
            <Text>音量</Text>
            <Text>{volume}%</Text>
          </div>
          <Slider
            value={volume}
            onChange={setVolume}
            min={0}
            max={100}
          />
        </div>
      </div>

      <Divider />

      {/* 生成按钮 */}
      <Button
        type="primary"
        icon={<AudioOutlined />}
        onClick={handleGenerate}
        disabled={!voiceText.trim()}
        block
      >
        生成配音
      </Button>

      {/* 配音列表 */}
      <div className={styles.listSection}>
        <Text strong className={styles.sectionLabel}>
          配音列表 ({voiceovers.length})
        </Text>
        
        <List
          className={styles.voiceoverList}
          dataSource={voiceovers}
          renderItem={(item) => (
            <List.Item
              className={`${styles.voiceoverItem} ${
                item.status === 'generating' ? styles.generating : ''
              }`}
              actions={[
                <Tooltip title={playingId === item.id ? '暂停' : '播放'} key="play">
                  <Button
                    type="text"
                    size="small"
                    icon={
                      item.status === 'generating' 
                        ? <LoadingOutlined spin />
                        : playingId === item.id 
                          ? <PauseCircleOutlined /> 
                          : <PlayCircleOutlined />
                    }
                    onClick={() => handlePlay(item.id)}
                    disabled={item.status === 'generating'}
                  />
                </Tooltip>,
                <Tooltip title="删除" key="delete">
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(item.id)}
                  />
                </Tooltip>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar 
                    icon={<AudioOutlined />}
                    style={{ backgroundColor: '#52c41a' }}
                  />
                }
                title={
                  <Space>
                    <Text strong>配音 {item.id}</Text>
                    {item.status === 'completed' && (
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    )}
                    {item.status === 'generating' && (
                      <SyncOutlined spin style={{ color: '#1890ff' }} />
                    )}
                  </Space>
                }
                description={
                  <div className={styles.itemDesc}>
                    <Text ellipsis className={styles.itemText}>{item.text}</Text>
                    <Space size="small">
                      <Tag>{getVoiceName(item.voice)}</Tag>
                      <Text type="secondary">{formatDuration(item.duration)}</Text>
                    </Space>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default SmartDubbing;
