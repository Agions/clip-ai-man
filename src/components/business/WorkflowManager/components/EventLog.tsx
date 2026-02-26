import React from 'react';
import { Card, Typography, Empty } from 'antd';

const { Text } = Typography;

interface EventLogProps {
  logs: string[];
}

export const EventLog: React.FC<EventLogProps> = ({ logs }) => {
  return (
    <Card size="small" title="执行日志">
      <div
        style={{
          maxHeight: 200,
          overflowY: 'auto',
          backgroundColor: '#1e1e1e',
          padding: 12,
          borderRadius: 4,
          fontFamily: 'Consolas, Monaco, monospace',
        }}
      >
        {logs.length === 0 ? (
          <Text type="secondary" style={{ color: '#888' }}>
            暂无日志
          </Text>
        ) : (
          logs.map((log, index) => (
            <div key={index} style={{ padding: '2px 0' }}>
              <Text style={{ fontSize: 12, color: '#d4d4d4' }}>{log}</Text>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default EventLog;
