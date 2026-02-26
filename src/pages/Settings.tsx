/**
 * 专业设置页面
 */

import React, { useState } from 'react';
import { 
  Card, 
  Tabs, 
  Form, 
  Input, 
  Button, 
  Switch, 
  Space, 
  Tag, 
  Typography,
  Divider,
  List,
  Avatar,
  Badge,
  Select,
  InputNumber,
  Slider,
  Alert,
  Row,
  Col,
  Progress
} from 'antd';
import { 
  ApiOutlined, 
  SettingOutlined, 
  UserOutlined, 
  BellOutlined, 
  SafetyOutlined,
  CloudOutlined,
  ThunderboltOutlined,
  KeyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import styles from './Settings.module.less';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// API 密钥配置
const apiProviders = [
  { 
    key: 'openai', 
    name: 'OpenAI', 
    logo: '🤖',
    models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    color: '#10a37f'
  },
  { 
    key: 'anthropic', 
    name: 'Anthropic', 
    logo: '🧠',
    models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    color: '#d4a373'
  },
  { 
    key: 'baidu', 
    name: '百度', 
    logo: '🔍',
    models: ['ernie-5.0', 'ernie-4.0'],
    color: '#2932e1'
  },
  { 
    key: 'alibaba', 
    name: '阿里', 
    logo: '☁️',
    models: ['qwen-3.5', 'qwen-plus', 'qwen-max'],
    color: '#ff6a00'
  },
  { 
    key: 'zhipu', 
    name: '智谱', 
    logo: '📊',
    models: ['glm-5', 'glm-4'],
    color: '#5e72e4'
  },
  { 
    key: 'moonshot', 
    name: '月之暗面', 
    logo: '🌙',
    models: ['kimi-k2.5'],
    color: '#1a1a1a'
  },
  { 
    key: 'minimax', 
    name: 'MiniMax', 
    logo: '🎭',
    models: ['minimax-m2.5'],
    color: '#ff6b6b'
  },
  { 
    key: 'doubao', 
    name: '字节豆包', 
    logo: '📱',
    models: ['doubao-pro-32k', 'doubao-lite-32k'],
    color: '#3c8cff'
  },
];

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('api');
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    openai: '',
    anthropic: '',
    baidu: '',
    alibaba: '',
    zhipu: '',
    moonshot: '',
    minimax: '',
    doubao: ''
  });

  const handleSaveApiKey = (provider: string) => {
    console.log('保存 API Key:', provider);
  };

  const tabItems = [
    {
      key: 'api',
      label: (
        <span>
          <ApiOutlined /> API 配置
        </span>
      ),
      children: (
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <Title level={4}>AI 模型 API</Title>
            <Paragraph type="secondary">
              配置您使用的 AI 服务商 API 密钥，不同服务商支持不同的模型。
            </Paragraph>
            
            <List
              dataSource={apiProviders}
              renderItem={(provider) => (
                <Card className={styles.providerCard} key={provider.key}>
                  <div className={styles.providerHeader}>
                    <div className={styles.providerInfo}>
                      <span className={styles.providerLogo}>{provider.logo}</span>
                      <span className={styles.providerName}>{provider.name}</span>
                      {apiKeys[provider.key] ? (
                        <Tag color="success" icon={<CheckCircleOutlined />}>已配置</Tag>
                      ) : (
                        <Tag icon={<CloseCircleOutlined />}>未配置</Tag>
                      )}
                    </div>
                    <Button 
                      type="link" 
                      icon={<EditOutlined />}
                      onClick={() => handleSaveApiKey(provider.key)}
                    >
                      {apiKeys[provider.key] ? '修改' : '添加'}
                    </Button>
                  </div>
                  
                  <div className={styles.modelSelect}>
                    <Text type="secondary">选择模型：</Text>
                    <Select
                      defaultValue={provider.models[0]}
                      style={{ width: 200 }}
                      options={provider.models.map(m => ({ label: m, value: m }))}
                    />
                  </div>
                </Card>
              )}
            />
          </div>

          <Divider />

          <div className={styles.section}>
            <Title level={4}>API 使用统计</Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Card className={styles.statCard}>
                  <div className={styles.statIcon} style={{ background: '#e0e7ff', color: '#6366f1' }}>
                    <ThunderboltOutlined />
                  </div>
                  <div className={styles.statInfo}>
                    <Text type="secondary">本月调用</Text>
                    <Title level={3}>1,234</Title>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card className={styles.statCard}>
                  <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#f59e0b' }}>
                    <KeyOutlined />
                  </div>
                  <div className={styles.statInfo}>
                    <Text type="secondary">消耗 Tokens</Text>
                    <Title level={3}>567K</Title>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card className={styles.statCard}>
                  <div className={styles.statIcon} style={{ background: '#d1fae5', color: '#10b981' }}>
                    <CheckCircleOutlined />
                  </div>
                  <div className={styles.statInfo}>
                    <Text type="secondary">成功调用</Text>
                    <Title level={3}>98.5%</Title>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      )
    },
    {
      key: 'general',
      label: (
        <span>
          <SettingOutlined /> 通用设置
        </span>
      ),
      children: (
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <Title level={4}>基本设置</Title>
            
            <Form layout="vertical">
              <Form.Item label="项目保存路径">
                <Input 
                  placeholder="/Users/username/ClipAiMan/projects" 
                  suffix={<Button type="text" size="small">浏览</Button>}
                />
              </Form.Item>
              
              <Form.Item label="默认视频分辨率">
                <Select
                  defaultValue="1080p"
                  options={[
                    { label: '720p', value: '720p' },
                    { label: '1080p', value: '1080p' },
                    { label: '2K', value: '2k' },
                    { label: '4K', value: '4k' },
                  ]}
                />
              </Form.Item>
              
              <Form.Item label="默认帧率">
                <Select
                  defaultValue="24"
                  options={[
                    { label: '24 fps', value: '24' },
                    { label: '30 fps', value: '30' },
                    { label: '60 fps', value: '60' },
                  ]}
                />
              </Form.Item>
              
              <Form.Item label="自动保存间隔">
                <InputNumber min={1} max={60} defaultValue={5} />
                <Text type="secondary" style={{ marginLeft: 8 }}>分钟</Text>
              </Form.Item>
            </Form>
          </div>

          <Divider />

          <div className={styles.section}>
            <Title level={4}>开关设置</Title>
            
            <div className={styles.switchItem}>
              <div className={styles.switchInfo}>
                <Text strong>自动保存项目</Text>
                <Text type="secondary">工作进度自动保存到本地</Text>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className={styles.switchItem}>
              <div className={styles.switchInfo}>
                <Text strong>显示高级选项</Text>
                <Text type="secondary">在界面中显示更多高级配置</Text>
              </div>
              <Switch />
            </div>
            
            <div className={styles.switchItem}>
              <div className={styles.switchInfo}>
                <Text strong>启用快捷键</Text>
                <Text type="secondary">使用键盘快捷键提高效率</Text>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className={styles.switchItem}>
              <div className={styles.switchInfo}>
                <Text strong>启动时检查更新</Text>
                <Text type="secondary">自动检查新版本并提示更新</Text>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'account',
      label: (
        <span>
          <UserOutlined /> 账户
        </span>
      ),
      children: (
        <div className={styles.tabContent}>
          <Card className={styles.accountCard}>
            <div className={styles.accountInfo}>
              <Avatar size={80} className={styles.avatar}>
                <UserOutlined />
              </Avatar>
              <div className={styles.accountDetail}>
                <Title level={4}>用户账户</Title>
                <Text type="secondary">创建时间：2026-02-15</Text>
                <div className={styles.accountTags}>
                  <Tag color="blue">免费版</Tag>
                </div>
              </div>
            </div>
          </Card>

          <Divider />

          <div className={styles.section}>
            <Title level={4}>账户设置</Title>
            
            <Form layout="vertical">
              <Form.Item label="显示名称">
                <Input placeholder="输入您的名称" />
              </Form.Item>
              
              <Form.Item label="邮箱">
                <Input placeholder="your@email.com" />
              </Form.Item>
              
              <Button type="primary">保存更改</Button>
            </Form>
          </div>
        </div>
      )
    },
    {
      key: 'notification',
      label: (
        <span>
          <BellOutlined /> 通知
        </span>
      ),
      children: (
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <Title level={4}>通知设置</Title>
            
            <div className={styles.switchItem}>
              <div className={styles.switchInfo}>
                <Text strong>项目完成通知</Text>
                <Text type="secondary">项目生成完成时推送通知</Text>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className={styles.switchItem}>
              <div className={styles.switchInfo}>
                <Text strong>错误提醒</Text>
                <Text type="secondary">发生错误时推送通知</Text>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className={styles.switchItem}>
              <div className={styles.switchInfo}>
                <Text strong>API 配额提醒</Text>
                <Text type="secondary">API 使用达到 80% 时提醒</Text>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className={styles.switchItem}>
              <div className={styles.switchInfo}>
                <Text strong>更新推送</Text>
                <Text type="secondary">新版本发布时推送通知</Text>
              </div>
              <Switch />
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'about',
      label: (
        <span>
          <InfoCircleOutlined /> 关于
        </span>
      ),
      children: (
        <div className={styles.tabContent}>
          <Card className={styles.aboutCard}>
            <div className={styles.aboutHeader}>
              <Title level={2}>🎬 ClipAiMan</Title>
              <Text type="secondary">AI 漫剧视频智能创作平台</Text>
            </div>
            
            <div className={styles.aboutInfo}>
              <div className={styles.infoItem}>
                <Text type="secondary">版本</Text>
                <Text>v2.1.0</Text>
              </div>
              <div className={styles.infoItem}>
                <Text type="secondary">构建时间</Text>
                <Text>2026-02-22</Text>
              </div>
              <div className={styles.infoItem}>
                <Text type="secondary">许可证</Text>
                <Text>MIT</Text>
              </div>
            </div>
            
            <Divider />
            
            <Alert
              type="info"
              showIcon
              message="感谢使用 ClipAiMan"
              description="如有问题或建议，请提交 Issue 或联系开发者。"
            />
          </Card>
        </div>
      )
    }
  ];

  return (
    <div className={styles.settings}>
      <Card className={styles.settingsCard}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className={styles.tabs}
        />
      </Card>
    </div>
  );
};

export default Settings;
