import {
  ProColumns,
  ProForm,
  ProFormCheckbox,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Col, Modal, Row, Space } from 'antd';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MySelect } from '../../../components/MySelect';
import { ImageUpload } from '../../../components/upload/ImageUpload';
import { queryProductList } from '../../../api/ProductController';
import { useFetch } from '../../../hook/useFetch';

type LayoutType = Parameters<typeof ProForm>[0]['layout'];
const LAYOUT_TYPE_HORIZONTAL = 'horizontal';

export interface FormValueType extends Partial<any> {
  target?: string;
  template?: string;
  // type?: string;
  time?: string;
  frequency?: string;
}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<any>;
  columns: ProColumns<any>[]
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [formLayoutType, setFormLayoutType] = useState<LayoutType>(
    LAYOUT_TYPE_HORIZONTAL,
  );

  const formItemLayout =
    formLayoutType === LAYOUT_TYPE_HORIZONTAL
      ? {
          labelCol: { span: 6 },
          wrapperCol: { span: 14 },
        }
      : null;

  
      const { data: { list: productList = [] } }: any = useFetch(queryProductList);
  return (

    <Modal
      width={640}
      style={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="权限编辑"
      open={props.updateModalVisible}
      footer={null}
      onCancel={() => props.onCancel()}
    >
      <ProForm
        {...formItemLayout}
        layout={formLayoutType}
        submitter={{
          render: (props, doms) => {
            return formLayoutType === LAYOUT_TYPE_HORIZONTAL ? (
              <Row>
                <Col span={14} offset={formItemLayout?.labelCol.span}>
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
        onFinish={props.onSubmit}
        initialValues={{
          title: props.values.title,
          useMode: 'chapter',
          id: props.values.id,
          tableId: props.values.tableId,
          pMark: props.values.pMark,
          orderItems: props.values.orderItems.map((item: any) => item.productId),
          totalPrice: props.values.totalPrice,
          totalNum: props.values.totalNum,
        }}
      >
        <ProFormText
          width="md"
          name="id"
          label="订单id"
          tooltip="id是唯一的 key"
          disabled={true}
        />
        {/* <ProFormSelect
          width="md"
          name="cid"
          label="订单分类"
          valueEnum={{
            0: '表一',
            1: '表二',
          }}
          rules={[{ required: true, message: '请选择订单分类!' }]}
        /> */}

        <ProFormText
          width="md"
          name="tableId"
          label="桌号"
        />
        <ProFormText
          width="md"
          name="pMark"
          label="备注口味信息"
        />
        <ProForm.Item
          label="菜品信息"
          name="orderItems"
          rules={[{ required: true, message: '请选择订单分类!' }]}
        >
          <ProFormCheckbox.Group
            options={productList.map((item: any) => {
              return {
                ...item,
                label: `${item.title} (RMB ${item.price})`,
                value: item.id,
              }
            })}
            // fieldNames={{
            //   label: 'title',
            //   value: 'id',
            // }}
          />
        </ProForm.Item>
        <ProFormDigit label="总价格" name="totalPrice" />
        <ProFormDigit
          label="总数量"
          name="totalNum"
          fieldProps={{ precision: 0 }}
        />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
