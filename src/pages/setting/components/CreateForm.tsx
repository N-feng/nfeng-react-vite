import { Col, Row, Space } from 'antd';
import { useState } from 'react';
import { ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { message } from 'antd';
import { addSetting } from '../../../api/SettingController';
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
    await addSetting({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

export const SettingCreate = () => {

  const [formLayoutType, setFormLayoutType] = useState<LayoutType>(
    LAYOUT_TYPE_HORIZONTAL,
  );

  const formItemLayout =
    formLayoutType === LAYOUT_TYPE_HORIZONTAL
      ? {
          labelCol: { span: 4 },
          wrapperCol: { span: 17 },
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
          navigate("/other/setting/list")
        }
      }}
      initialValues={{
        title: '',
        useMode: 'chapter',
      }}
    >
      <ProFormText
        width="md"
        name="title"
        label="网站名称"
        tooltip="最长为 24 位"
        placeholder="请输入网站名称"
        rules={[{ required: true, message: '请输入网站名称!' }]}
      />
      <ImageUpload 
        name="img_url" 
        label="网站logo" 
      />
      <ProFormText
        width="md"
        name="site_keywords"
        label="网站关键词"
        placeholder="请输入网站关键词"
      />
      <ProFormTextArea
        colProps={{ span: 24 }}
        // width="md"
        name="site_description"
        label="网站描述"
        placeholder="请输入网站描述"
      />
      <ProFormText
        width="md"
        name="printer_user"
        label="小票打印机User"
        placeholder="请输入小票打印机User"
      />
      <ProFormText
        width="md"
        name="printer_key"
        label="小票打印机Key"
        placeholder="请输入小票打印机Key"
      />
      <ProFormText
        width="md"
        name="client_url"
        label="点餐系统域名"
        placeholder="请输入点餐系统域名"
      />
      <ProFormText
        width="md"
        name="address"
        label="地址"
        placeholder="请输入地址"
      />
      <ProFormText
        width="md"
        name="phone"
        label="电话"
        placeholder="请输入电话"
      />
      <ProFormText
        width="md"
        name="wifi_user"
        label="wifi用户名"
        placeholder="请输入wifi用户名"
      />
      <ProFormText
        width="md"
        name="wifi_password"
        label="wifi密码"
        placeholder="请输入wifi密码"
      />
      <ProFormText
        width="md"
        name="order_label"
        label="口味信息"
        placeholder="请输入口味信息"
        addonAfter={<i>例如：少辣 不要葱 打包带走</i>}
      />
      <ProFormText
        width="md"
        name="alipay"
        label="支付宝支付设置"
        placeholder="请输入支付宝支付设置"
      />
      <ProFormText
        width="md"
        name="weixinpay"
        label="微信支付设置"
        placeholder="请输入微信支付设置"
      />
    </ProForm>
  )
}
