import React from 'react';
import { Radio, Tooltip, Space } from 'antd';
import { BulbOutlined, BulbFilled, SyncOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/context/ThemeContext';

interface ThemeSwitcherProps {
  compact?: boolean;
}

/**
 * 主题切换组件
 * 支持亮色和暗色两种模式
 */
const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ compact = false }) => {
  const { t } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();
  
  // 紧凑模式只显示切换图标
  if (compact) {
    return (
      <Tooltip title={t('theme.toggleDarkMode', '切换模式')}>
        <div 
          onClick={toggleTheme}
          style={{ 
            cursor: 'pointer', 
            padding: '8px', 
            borderRadius: '50%',
            transition: 'background 0.3s',
            fontSize: '16px'
          }}
        >
          {isDarkMode ? <BulbOutlined /> : <BulbFilled />}
        </div>
      </Tooltip>
    );
  }
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ fontSize: '13px', opacity: 0.85 }}>
        {t('theme.themeMode', '主题模式')}
      </div>
      <Radio.Group 
        value={isDarkMode ? 'dark' : 'light'} 
        onChange={e => {
          if (e.target.value !== (isDarkMode ? 'dark' : 'light')) {
            toggleTheme();
          }
        }}
        buttonStyle="solid"
        optionType="button"
      >
        <Radio.Button value="light">
          <Space size={4}>
            <BulbFilled />
            {t('theme.light', '浅色')}
          </Space>
        </Radio.Button>
        <Radio.Button value="dark">
          <Space size={4}>
            <BulbOutlined />
            {t('theme.dark', '深色')}
          </Space>
        </Radio.Button>
      </Radio.Group>
    </div>
  );
};

export default ThemeSwitcher;
