/**
 * 专业仪表盘首页
 * 展示项目统计、最近活动、快捷操作
 */

import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Typography, 
  Space, 
  Statistic, 
  List, 
  Avatar, 
  Tag, 
  Progress,
  Timeline,
  Empty,
  Carousel,
  Badge
} from 'antd';
import { 
  PlusOutlined, 
  VideoCameraOutlined, 
  FileTextOutlined,
  ClockCircleOutlined,
  FireOutlined,
  RightOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  UserOutlined,
  ThunderboltOutlined,
  StarOutlined,
  HistoryOutlined,
  ArrowUpOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.less';

const { Title, Text, Paragraph } = Typography;

// 统计数据
const statsData = [
  { 
    title: '项目总数', 
    value: 12, 
    icon: <VideoCameraOutlined />, 
    color: '#6366f1',
    trend: '+3',
    trendUp: true
  },
  { 
    title: '进行中', 
    value: 3, 
    icon: <SyncOutlined spin />, 
    color: '#f59e0b',
    trend: '0',
    trendUp: false
  },
  { 
    title: '已完成', 
    value: 8, 
    icon: <CheckCircleOutlined />, 
    color: '#10b981',
    trend: '+2',
    trendUp: true
  },
  { 
    title: '本月产出', 
    value: 156, 
    icon: <ThunderboltOutlined />, 
    color: '#ec4899',
    trend: '+18%',
    trendUp: true
  },
];

// 最近项目
const recentProjects = [
  {
    id: '1',
    title: '星辰大海',
    description: '科幻漫剧第一集',
    thumbnail: 'https://picsum.photos/seed/drama1/400/225',
    progress: 75,
    status: '进行中',
    updateTime: '2小时前',
    episodes: 3
  },
  {
    id: '2',
    title: '都市恋曲',
    description: '浪漫爱情漫剧',
    thumbnail: 'https://picsum.photos/seed/drama2/400/225',
    progress: 100,
    status: '已完成',
    updateTime: '昨天',
    episodes: 5
  },
  {
    id: '3',
    title: '修仙传',
    description: '玄幻仙侠漫剧',
    thumbnail: 'https://picsum.photos/seed/drama3/400/225',
    progress: 45,
    status: '进行中',
    updateTime: '3天前',
    episodes: 2
  },
];

// 最近活动
const recentActivities = [
  {
    id: '1',
    action: '生成了角色设计',
    project: '星辰大海',
    time: '10分钟前',
    icon: <UserOutlined />,
    color: '#6366f1'
  },
  {
    id: '2',
    action: '完成了分镜设计',
    project: '都市恋曲',
    time: '2小时前',
    icon: <FileTextOutlined />,
    color: '#10b981'
  },
  {
    id: '3',
    action: '导出了视频',
    project: '都市恋曲',
    time: '昨天',
    icon: <VideoCameraOutlined />,
    color: '#ec4899'
  },
  {
    id: '4',
    action: '上传了小说',
    project: '修仙传',
    time: '3天前',
    icon: <PlusOutlined />,
    color: '#f59e0b'
  },
];

// 快捷操作
const quickActions = [
  {
    key: 'novel',
    title: '小说漫剧',
    description: '上传小说生成漫剧',
    icon: <FileTextOutlined />,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
  },
  {
    key: 'manga',
    title: '漫画视频',
    description: '漫画转视频',
    icon: <PlayCircleOutlined />,
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)'
  },
  {
    key: 'template',
    title: '模板创作',
    description: '使用模板创建',
    icon: <ThunderboltOutlined />,
    color: '#14b8a6',
    gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
  },
  {
    key: 'continue',
    title: '继续创作',
    description: '从上次继续',
    icon: <ClockCircleOutlined />,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.dashboard}>
      {/* 欢迎区 */}
      <div className={styles.welcomeSection}>
        <div className={styles.welcomeContent}>
          <Title level={2} className={styles.welcomeTitle}>
            欢迎回来，創作者 👋
          </Title>
          <Text className={styles.welcomeDesc}>
            今天想创作什么样的漫剧呢？
          </Text>
        </div>
        <Button 
          type="primary" 
          size="large" 
          icon={<PlusOutlined />}
          className={styles.createBtn}
          onClick={() => navigate('/workflow')}
        >
          创建新项目
        </Button>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className={styles.statCard} hoverable>
              <div className={styles.statContent}>
                <div 
                  className={styles.statIcon} 
                  style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                >
                  {stat.icon}
                </div>
                <div className={styles.statInfo}>
                  <Text className={styles.statTitle}>{stat.title}</Text>
                  <div className={styles.statValueRow}>
                    <Statistic 
                      value={stat.value} 
                      className={styles.statValue}
                      valueStyle={{ color: stat.color, fontWeight: 600 }}
                    />
                    {stat.trend && (
                      <Tag 
                        color={stat.trendUp ? 'success' : 'default'}
                        className={styles.statTrend}
                      >
                        {stat.trendUp ? <ArrowUpOutlined /> : null} {stat.trend}
                      </Tag>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        {/* 快捷操作 */}
        <Col xs={24} lg={8}>
          <Card 
            title="快捷开始" 
            className={styles.quickStartCard}
            extra={<a href="#">查看全部 <RightOutlined /></a>}
          >
            <Row gutter={[12, 12]}>
              {quickActions.map((action) => (
                <Col span={12} key={action.key}>
                  <div 
                    className={styles.quickActionItem}
                    onClick={() => navigate('/workflow')}
                  >
                    <div 
                      className={styles.quickActionIcon}
                      style={{ background: action.gradient }}
                    >
                      {action.icon}
                    </div>
                    <div className={styles.quickActionInfo}>
                      <div className={styles.quickActionTitle}>{action.title}</div>
                      <div className={styles.quickActionDesc}>{action.description}</div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* 最近项目 */}
        <Col xs={24} lg={10}>
          <Card 
            title="最近项目" 
            className={styles.recentProjectsCard}
            extra={<a href="/projects">查看全部 <RightOutlined /></a>}
          >
            <List
              itemLayout="horizontal"
              dataSource={recentProjects}
              renderItem={(project) => (
                <List.Item 
                  className={styles.projectItem}
                  actions={[
                    <Button type="text" key="more">
                      <RightOutlined />
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div className={styles.projectThumb}>
                        <img src={project.thumbnail} alt={project.title} />
                        <div className={styles.projectProgress}>
                          <Progress 
                            percent={project.progress} 
                            size="small"
                            showInfo={false}
                            strokeColor="#6366f1"
                          />
                        </div>
                      </div>
                    }
                    title={
                      <div className={styles.projectTitle}>
                        {project.title}
                        {project.status === '已完成' && (
                          <CheckCircleOutlined style={{ color: '#10b981', marginLeft: 8 }} />
                        )}
                      </div>
                    }
                    description={
                      <div className={styles.projectDesc}>
                        <Text type="secondary">{project.description}</Text>
                        <span className={styles.projectMeta}>
                          {project.episodes}集 · {project.updateTime}
                        </span>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 活动 timeline */}
        <Col xs={24} lg={6}>
          <Card 
            title="最近活动" 
            className={styles.activityCard}
          >
            <Timeline
              items={recentActivities.map(activity => ({
                color: activity.color,
                children: (
                  <div className={styles.activityItem}>
                    <div className={styles.activityAction}>{activity.action}</div>
                    <div className={styles.activityProject}>{activity.project}</div>
                    <div className={styles.activityTime}>{activity.time}</div>
                  </div>
                )
              }))}
            />
          </Card>
        </Col>
      </Row>

      {/* 项目进度 */}
      <Row gutter={[24, 24]} className={styles.progressSection}>
        <Col xs={24}>
          <Card title="进行中的项目" className={styles.progressCard}>
            <Row gutter={[16, 16]}>
              {recentProjects.filter(p => p.status === '进行中').map((project) => (
                <Col xs={24} sm={8} key={project.id}>
                  <div className={styles.progressItem}>
                    <div className={styles.progressThumb}>
                      <img src={project.thumbnail} alt={project.title} />
                      <div className={styles.progressOverlay}>
                        <Button 
                          type="primary" 
                          shape="circle" 
                          icon={<PlayCircleOutlined />}
                          className={styles.playBtn}
                        />
                      </div>
                    </div>
                    <div className={styles.progressInfo}>
                      <Title level={5} className={styles.progressTitle}>
                        {project.title}
                      </Title>
                      <Progress 
                        percent={project.progress} 
                        size="small"
                        strokeColor="#6366f1"
                      />
                      <Text type="secondary" className={styles.progressDesc}>
                        {project.description}
                      </Text>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
