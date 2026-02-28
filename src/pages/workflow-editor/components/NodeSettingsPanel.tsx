/**
 * 节点设置面板
 */

import React from 'react';
import { Form, Input, InputNumber, Select, Switch, Divider, Button, Popconfirm, Slider, Tooltip } from 'antd';
import { DeleteOutlined, CopyOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useWorkflowEditor } from '@/core/workflow/store';
import { getNodeDefinition } from '@/core/workflow/node-registry';
import styles from './NodeSettingsPanel.module.less';

interface NodeSettingsPanelProps {
  nodeId: string;
}

export const NodeSettingsPanel: React.FC<NodeSettingsPanelProps> = ({ nodeId }) => {
  const { currentWorkflow, updateNode, deleteNode, copySelectedNode, pasteNode } = useWorkflowEditor();
  const [form] = Form.useForm();

  const node = currentWorkflow?.nodes.find(n => n.id === nodeId);
  const definition = node ? getNodeDefinition(node.type) : null;

  if (!node || !definition) {
    return <div className={styles.empty}>节点不存在</div>;
  }

  const handleValuesChange = (values: any) => {
    updateNode(nodeId, { parameters: { ...node.parameters, ...values } });
  };

  const handleDelete = () => {
    deleteNode(nodeId);
  };

  const handleDuplicate = () => {
    copySelectedNode();
    pasteNode({ x: node.position.x + 50, y: node.position.y + 50 });
  };

  // 渲染参数输入组件
  const renderParameterInput = (param: any) => {
    const commonProps = {
      placeholder: param.placeholder,
    };

    switch (param.type) {
      case 'string':
        return param.id === 'prompt' || param.id === 'text' ? (
          <Input.TextArea rows={4} {...commonProps} />
        ) : (
          <Input {...commonProps} />
        );
      
      case 'number':
        return param.id.includes('temperature') || param.id.includes('pitch') ? (
          <Slider 
            min={0} 
            max={2} 
            step={0.1} 
            marks={{ 0: '0', 1: '1', 2: '2' }}
          />
        ) : (
          <InputNumber style={{ width: '100%' }} min={param.min} max={param.max} />
        );
      
      case 'boolean':
        return <Switch />;
      
      case 'select':
        return (
          <Select>
            {param.options?.map((opt: any) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        );
      
      case 'multiselect':
        return (
          <Select mode="multiple">
            {param.options?.map((opt: any) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        );
      
      case 'code':
      case 'json':
        return (
          <Input.TextArea 
            rows={6} 
            className={styles.codeEditor}
            {...commonProps}
          />
        );
      
      default:
        return <Input {...commonProps} />;
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>{node.name}</h3>
        <span className={styles.nodeType}>{definition.displayName}</span>
      </div>

      <Divider />

      <Form
        form={form}
        layout="vertical"
        initialValues={node.parameters}
        onValuesChange={handleValuesChange}
        className={styles.form}
      >
        {/* 节点名称 */}
        <Form.Item label="名称">
          <Input
            value={node.name}
            onChange={(e) => updateNode(nodeId, { name: e.target.value })}
          />
        </Form.Item>

        {/* 参数配置 */}
        {definition.parameters.length > 0 && (
          <>
            <Divider>参数配置</Divider>
            {definition.parameters.map((param) => (
              <Form.Item
                key={param.id}
                label={
                  <span>
                    {param.displayName}
                    {param.description && (
                      <Tooltip title={param.description}>
                        <QuestionCircleOutlined style={{ marginLeft: 4, color: '#64748b' }} />
                      </Tooltip>
                    )}
                  </span>
                }
                name={param.id}
                required={param.required}
              >
                {renderParameterInput(param)}
              </Form.Item>
            ))}
          </>
        )}

        <Divider>高级设置</Divider>

        {/* 执行设置 */}
        <Form.Item label="执行一次">
          <Switch
            checked={node.settings.executeOnce}
            onChange={(checked) =>
              updateNode(nodeId, {
                settings: { ...node.settings, executeOnce: checked }
              })
            }
          />
          <span className={styles.hint}>仅处理第一个输入项</span>
        </Form.Item>

        {/* 重试设置 */}
        <Form.Item label="失败重试">
          <Switch
            checked={node.settings.retryOnFail}
            onChange={(checked) =>
              updateNode(nodeId, {
                settings: { ...node.settings, retryOnFail: checked }
              })
            }
          />
        </Form.Item>

        {node.settings.retryOnFail && (
          <Form.Item label="重试次数">
            <InputNumber
              value={node.settings.retryCount || 2}
              onChange={(val) =>
                updateNode(nodeId, {
                  settings: { ...node.settings, retryCount: val || 2 }
                })
              }
              min={1}
              max={5}
            />
          </Form.Item>
        )}

        {/* 超时设置 */}
        <Form.Item label="超时时间 (秒)">
          <InputNumber
            value={node.settings.timeout || 60}
            onChange={(val) =>
              updateNode(nodeId, {
                settings: { ...node.settings, timeout: val || 60 }
              })
            }
            min={10}
            max={600}
            style={{ width: '100%' }}
          />
        </Form.Item>

        {/* 错误处理 */}
        <Form.Item label="错误处理">
          <Select
            value={node.settings.onError || 'stop'}
            onChange={(val) =>
              updateNode(nodeId, {
                settings: { ...node.settings, onError: val }
              })
            }
          >
            <Select.Option value="stop">停止工作流</Select.Option>
            <Select.Option value="continue">继续执行</Select.Option>
            <Select.Option value="continueWithError">继续并传递错误</Select.Option>
          </Select>
        </Form.Item>

        {/* 备注 */}
        <Form.Item label="备注">
          <Input.TextArea
            value={node.settings.notes}
            onChange={(e) =>
              updateNode(nodeId, {
                settings: { ...node.settings, notes: e.target.value }
              })
            }
            rows={2}
            placeholder="添加节点备注..."
          />
        </Form.Item>
      </Form>

      <Divider />

      {/* 操作按钮 */}
      <div className={styles.actions}>
        <Button icon={<CopyOutlined />} onClick={handleDuplicate}>
          复制节点
        </Button>
        <Popconfirm 
          title="确定删除此节点？" 
          onConfirm={handleDelete}
          okText="删除"
          cancelText="取消"
        >
          <Button danger icon={<DeleteOutlined />}>
            删除节点
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
};

export default NodeSettingsPanel;
