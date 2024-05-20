import { Button, Col, Row, Space } from 'antd';
import { useState } from 'react';
import EditorComponent from '../../../components/EditorComponent';
import { ProForm, ProFormCheckbox, ProFormRadio, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { modifyProduct, queryProductById } from '../../../api/ProductController';
import { NavLink, useLoaderData, useNavigate } from 'react-router-dom';
import { ImageUpload } from '../../../components/upload/ImageUpload';
import { queryProductCateOptions } from '../../../api/ProductCateController';
import { useFetch } from '../../../hook/useFetch';
import { MySelect } from '../../../components/MySelect';

type LayoutType = Parameters<typeof ProForm>[0]['layout'];
const LAYOUT_TYPE_HORIZONTAL = 'horizontal';

export interface FormValueType extends Partial<API.AccessInfo> {
  target?: string;
  template?: string;
  // type?: string;
  time?: string;
  frequency?: string;
}

export async function loader({ params }: any) {
  const { data: { product } } = await queryProductById(params.id);
  return { product };
}

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: API.AccessInfo) => {
  console.log('fields: ', fields);
  const hide = message.loading('正在配置');
  try {
    await modifyProduct(
      {
        id: fields.id,
      },
      
      {
        ...fields,
      },
    );
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

export const ProductUpdate = () => {

  const { product }: any = useLoaderData();
  // console.log('product: ', product);

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

  const [model, setModel] = useState(product.content);

  const { data: { list } }: any = useFetch(queryProductCateOptions);

  return (
    <ProForm
      {...formItemLayout}
      layout={formLayoutType}
      submitter={{
        render: (props, doms) => {
          return formLayoutType === LAYOUT_TYPE_HORIZONTAL ? (
            <Row>
              <Col span={14} offset={4}>
                <Space>
                  <NavLink to={`/product/list`}>
                    <Button
                      key="1"
                      // type="primary"
                      // onClick={() => handleModalVisible(true)}
                    >
                      返回
                    </Button>
                  </NavLink>
                  {doms}
                </Space>
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
        const success = await handleUpdate({
          ...values,
          content: model,
          id: product.id,
          // img_url: values.img_url.map((item: any) => {
          //   return {
          //     ...item,
          //     url: item.url || item.response.link
          //   }
          // })
        });
        if (success) {
          navigate("/product/list")
        }
      }}
      initialValues={{
        title: product.title,
        useMode: 'chapter',
        id: product.id,
        imgUrl: product.imgUrl ? [{
          url: product.imgUrl
        }] : [],
      }}
    >
      <ProFormText
        width="md"
        name="id"
        label="菜品id"
        tooltip="id是唯一的 key"
        disabled={true}
      />
      {/* <ProFormSelect
        width="md"
        name="cid"
        label="菜品分类"
        valueEnum={{
          0: '表一',
          1: '表二',
        }}
        rules={[{ required: true, message: '请选择菜品分类!' }]}
      /> */}

      <ProForm.Item
        label="菜品分类"
        name="cid"
        rules={[{ required: true, message: '请选择菜品分类!' }]}
      >
        <MySelect
          options={list}
          fieldNames={{
            label: 'title',
            value: 'id',
          }}
        />
      </ProForm.Item>
      <ProFormText
        width="md"
        name="title"
        label="菜品名称"
        tooltip="最长为 24 位"
        placeholder="请输入菜品名称"
        rules={[{ required: true, message: '请输入菜品名称!' }]}
      />
      <ImageUpload 
        name="imgUrl" 
        label="菜品图片"
        value={product.imgUrl}
        maxCount={1}
      />
      <ProFormText
        width="md"
        name="price"
        label="菜品价格"
        placeholder="请输入名称"
      />
      <ProFormRadio.Group
        name="status"
        width="md"
        label="菜品状态"
        options={[
          {
            value: '0',
            label: '显示',
          },
          {
            value: '1',
            label: '隐藏',
          },
        ]}
      />
      <ProFormCheckbox.Group
        name="checkbox-group"
        label="加入推荐"
        options={['精品', '热销']}
      />
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
