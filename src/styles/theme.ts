/**
 * 专业漫剧主题配置
 * 统一的设计系统
 */

export const theme = {
  // 品牌色
  colors: {
    primary: '#6366f1',        // 主色 (靛蓝)
    primaryHover: '#4f46e5',
    primaryLight: '#e0e7ff',
    secondary: '#ec4899',       // 副色 (粉红)
    accent: '#14b8a6',        // 强调色 (青色)
    success: '#10b981',        // 成功
    warning: '#f59e0b',        // 警告
    error: '#ef4444',          // 错误
    info: '#3b82f6',          // 信息
  },
  
  // 背景色
  backgrounds: {
    card: '#ffffff',
    page: '#f8fafc',
    header: '#ffffff',
    sidebar: '#1e293b',
    sidebarHover: '#334155',
  },
  
  // 文字色
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
    tertiary: '#94a3b8',
    inverse: '#ffffff',
  },
  
  // 边框
  borders: {
    light: '#e2e8f0',
    medium: '#cbd5e1',
  },
  
  // 阴影
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  
  // 圆角
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  // 间距
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
  
  // 过渡
  transitions: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
  },
};

// Ant Design 主题覆盖
export const antTheme = {
  token: {
    colorPrimary: theme.colors.primary,
    colorSuccess: theme.colors.success,
    colorWarning: theme.colors.warning,
    colorError: theme.colors.error,
    colorInfo: theme.colors.info,
    borderRadius: 8,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    Button: {
      primaryShadow: '0 2px 4px rgba(99, 102, 241, 0.3)',
      controlHeight: 40,
    },
    Card: {
      paddingLG: 24,
    },
    Input: {
      controlHeight: 40,
    },
    Select: {
      controlHeight: 40,
    },
  },
};

// 导出样式工具类
export const styles = {
  card: {
    background: theme.backgrounds.card,
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadows.md,
    padding: theme.spacing.lg,
  },
  page: {
    background: theme.backgrounds.page,
    minHeight: '100vh',
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  flexBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default theme;
