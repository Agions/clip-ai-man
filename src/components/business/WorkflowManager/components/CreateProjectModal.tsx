import React from 'react';
import { Modal, Form, Input, Select, Radio, Divider, Button, Space } from 'antd';
import { AI_PROVIDERS } from '@/core/constants';
import { WorkflowConfig } from '@/core/services/workflow.service';

const { TextArea } = Input;
const { Option } = Select;

interface CreateProjectModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  form: any;
}

const INITIAL_VALUES = {
  aiProvider: 'baidu',
  imageProvider: 'bytedance-seedream',
  videoProvider: 'bytedance-seedance',
  ttsProvider: 'edge',
  style: 'anime',
  aspectRatio: '16:9',
  duration: 5,
  autoProceed: true,
};

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  form,
}) => {
  return (
    <Modal
      title="创建漫剧项目"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={INITIAL_VALUES}
      >
        <Form.Item
          label="项目名称"
          name="name"
          rules={[{ required: true, message: '请输入项目名称' }]}
        >
          <Input placeholder="例如：我的第一部漫剧" />
        </Form.Item>

        <Form.Item label="项目描述" name="description">
          <TextArea rows={2} placeholder="简要描述项目内容..." />
        </Form.Item>

        <Divider orientation="left">AI 配置</Divider>

        <Form.Item label="AI 模型" name="aiProvider" rules={[{ required: true }]}>
          <Select>
            {AI_PROVIDERS.map((p) => (
              <Option key={p.id} value={p.id}>
                {p.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="API Key"
          name="aiApiKey"
          rules={[{ required: true, message: '请输入 API Key' }]}
        >
          <Input.Password placeholder="输入 AI 模型的 API Key" />
        </Form.Item>

        <Divider orientation="left">图像/视频配置</Divider>

        <Form.Item label="图像生成模型" name="imageProvider">
          <Select>
            <Option value="bytedance-seedream">字节 Seedream</Option>
            <Option value="kling">快手可灵</Option>
          </Select>
        </Form.Item>

        <Form.Item label="图像 API Key" name="imageApiKey">
          <Input.Password placeholder="输入图像生成 API Key" />
        </Form.Item>

        <Form.Item label="视频生成模型" name="videoProvider">
          <Select>
            <Option value="bytedance-seedance">字节 Seedance</Option>
            <Option value="kling">快手可灵</Option>
            <Option value="vidu">生数 Vidu</Option>
          </Select>
        </Form.Item>

        <Form.Item label="视频 API Key" name="videoApiKey">
          <Input.Password placeholder="输入视频生成 API Key" />
        </Form.Item>

        <Divider orientation="left">风格配置</Divider>

        <Form.Item label="画面风格" name="style">
          <Radio.Group>
            <Radio.Button value="realistic">写实</Radio.Button>
            <Radio.Button value="anime">动漫</Radio.Button>
            <Radio.Button value="3d">3D</Radio.Button>
            <Radio.Button value="chinese">国风</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="画面比例" name="aspectRatio">
          <Radio.Group>
            <Radio.Button value="16:9">16:9 横屏</Radio.Button>
            <Radio.Button value="9:16">9:16 竖屏</Radio.Button>
            <Radio.Button value="1:1">1:1 方形</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="视频时长" name="duration">
          <Radio.Group>
            <Radio.Button value={5}>5 秒</Radio.Button>
            <Radio.Button value={10}>10 秒</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="配音引擎" name="ttsProvider">
          <Select>
            <Option value="edge">Edge TTS（免费）</Option>
            <Option value="aliyun">阿里云</Option>
            <Option value="baidu">百度</Option>
            <Option value="iflytek">讯飞</Option>
          </Select>
        </Form.Item>

        <Form.Item name="autoProceed" valuePropName="checked">
          <Radio checked>自动执行所有步骤</Radio>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              创建项目
            </Button>
            <Button onClick={onCancel}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProjectModal;
