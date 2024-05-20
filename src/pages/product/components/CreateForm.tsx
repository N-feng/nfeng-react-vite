import { Button, Col, Row, Space } from 'antd';
import { useState } from 'react';
import EditorComponent, { defaultContent } from '../../../components/EditorComponent';
import { ProForm, ProFormCheckbox, ProFormRadio, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import {
  PlusOutlined
} from '@ant-design/icons';
import { message } from 'antd';
import { addProduct } from '../../../api/ProductController';
import { useNavigate } from 'react-router-dom';
import { ImageUpload } from '../../../components/upload/ImageUpload';

type LayoutType = Parameters<typeof ProForm>[0]['layout'];
const LAYOUT_TYPE_HORIZONTAL = 'horizontal';

export interface FormValueType extends Partial<API.AccessInfo> {
  target?: string;
  template?: string;
  // type?: string;
  time?: string;
  frequency?: string;
}

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.AccessInfo) => {
  const hide = message.loading('正在添加');
  try {
    await addProduct({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

export const ProductCreate = () => {

  const [formLayoutType, setFormLayoutType] = useState<LayoutType>(
    LAYOUT_TYPE_HORIZONTAL,
  );

  const formItemLayout =
    formLayoutType === LAYOUT_TYPE_HORIZONTAL
      ? {
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
        }
      : null;

  const navigate = useNavigate();

  const [model, setModel] = useState("");

  return (
    <ProForm
      {...formItemLayout}
      layout={formLayoutType}
      submitter={{
        render: (props, doms) => {
          return formLayoutType === LAYOUT_TYPE_HORIZONTAL ? (
            <Row>
              <Col span={14} offset={4}>
                <Space>{doms}</Space>
              </Col>
            </Row>
          ) : (
            doms
          );
        },
      }}
      // @ts-ignore
      // labelWidth="auto"
      // trigger={
      //   <Button type="primary">
      //     <PlusOutlined />
      //     新建表单
      //   </Button>
      // }
      onFinish={async (values: any) => {
        console.log(values);
        const success = await handleAdd({
          ...values,
          content: model,
        });
        if (success) {
          navigate("/product/list")
        }
      }}
      initialValues={{
        name: '',
        useMode: 'chapter',
      }}
    >
      {/* <ProForm.Group> */}
        <ProFormText
          width="md"
          name="name"
          label="菜品名称"
          tooltip="最长为 24 位"
          placeholder="请输入菜品名称"
          rules={[{ required: true, message: '请输入菜品名称!' }]}
        />
        {/* <ProFormText
          width="md"
          name="company"
          label="菜品图片"
          placeholder="请输入名称"
        /> */}
        <ImageUpload 
          name="img_url"
          label="菜品图片"
          maxCount={1}
        />
        <ProFormText
          width="md"
          name="price"
          label="菜品价格"
          placeholder="请输入菜品价格"
        />
        <ProFormText
          width="md"
          name="sort"
          label="菜品排序"
          placeholder="请输入菜品排序"
        />
        <ProFormCheckbox.Group
          name="checkbox-group"
          label="加入推荐"
          options={['精品', '热销']}
        />
        <ProFormRadio.Group
          name="status"
          width="md"
          label="菜品状态"
          options={[
            {
              value: '1',
              label: '显示',
            },
            {
              value: '0',
              label: '隐藏',
            },
          ]}
        />
        <ProFormCheckbox.Group
          name="checkbox-group"
          label="加入推荐"
          options={['精品', '热销']}
        />
      {/* </ProForm.Group> */}
      <ProForm.Item
        label="菜品详情"
        wrapperCol={{ span: 20 }}
      >
        <EditorComponent
          value={model}
          onChange={setModel} 
        />
      </ProForm.Item>
    </ProForm>
  )
}
