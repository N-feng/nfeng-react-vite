import {
  ActionType,
  PageContainer,
  ProTable,
  ProColumns,
  TableDropdown,
} from '@ant-design/pro-components';
import { Button, Input, Space, Tag, message } from 'antd';
import { useRef, useState } from 'react';
import { addOrder, deleteOrder, modifyOrder, queryOrderList } from '../../api/OrderController';
import { MySelect } from '../../components/MySelect';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { useFetch } from '../../hook/useFetch';
import { queryProductList } from '../../api/ProductController';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: any) => {
  const hide = message.loading('正在添加');
  try {
    await addOrder({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: any) => {
  console.log('fields: ', fields);
  const hide = message.loading('正在配置');
  try {
    await modifyOrder(
      {
        id: fields.id || '',
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

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: any[]) => {
  console.log('selectedRows: ', selectedRows);
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteOrder({
      id: selectedRows.find((row) => row.id)?.id || '',
    });
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const OrderPage = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const { data: { list: productList = [] } }: any = useFetch(queryProductList);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<any>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      tooltip: 'id是唯一的 key',
      search: false,
      fieldProps: {
        disabled: true,
      }
    },
    {
      title: '订单id',
      dataIndex: 'orderId',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '桌号',
      dataIndex: 'tableId',
      valueType: 'text',
    },
    {
      title: '用餐人数',
      dataIndex: 'pNum',
      valueType: 'text',
    },
    {
      title: '备注口味信息',
      dataIndex: 'pMark',
      valueType: 'text',
    },
    {
      title: '菜品信息',
      dataIndex: 'orderItems',
      valueType: 'checkbox',
      fieldProps: {
      //   fieldNames: {
      //     label: 'title',
      //     value: 'id',
      //   },
        options: productList.map((item: any) => {
          return {
            ...item,
            label: item.title,
            value: item.id,
          }
        }),
      },
      render: (_, record) => (
        <Space>
          {record.orderItems.map(({ productTitle: name, color, id }: any) => {
            return (
              <Tag color={color} key={id}>
                {name}
              </Tag>
            )
          })}
        </Space>
      ),
    },
    {
      title: '总价格',
      dataIndex: 'totalPrice',
      valueType: 'text',
    },
    {
      title: '总数量',
      dataIndex: 'totalNum',
      valueType: 'text',
    },
    {
      title: '支付方式',
      dataIndex: 'payType',
      // valueEnum: {
      //   1: { text: '模块', status: '1' },
      //   2: { text: '菜单', status: '2' },
      //   3: { text: '操作', status: '3' },
      // },
      valueType: 'select',
      fieldProps: {
        options: [
          { label: '支付宝支付', value: 1 },
          { label: '微信支付', value: 2 },
        ]
      },
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        // console.log('rest: ', rest);
        // if (type === 'form') {
        //   return null;
        // }
        const stateType = form.getFieldValue('state');
        if (stateType === 3) {
          return <Input />;
        }
        if (stateType === 4) {
          return null;
        }
        return (
          <MySelect
            {...rest}
          />
        );
      },
      hideInForm: true,
    },
    {
      title: '支付状态',
      dataIndex: 'payStatus',
      valueType: 'text',
      search: false,
      hideInForm: true,
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      valueType: 'text',
      search: false,
      hideInForm: true,
    },
    {
      title: '增加时间',
      dataIndex: 'createdAt',
      valueType: 'text',
      hideInForm: true,
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Button
            type='link'
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            编辑
          </Button>
          <TableDropdown
            key="more"
            onSelect={async (key) => {
              if (key === 'delete') {
                await handleRemove([record])
                actionRef.current?.reloadAndRest?.();
              }
            }}
            menus={[
              // { key: 'copy', name: '复制' },
              { key: 'delete', name: '删除' },
            ]}
          />
        </>
      ),
    },
  ];
  return (
    <PageContainer
      header={{
        title: '订单管理',
      }}
    >
      <ProTable<any>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            onClick={() => handleModalVisible(true)}
          >
            新建
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          return await queryOrderList({
            ...params,
            // FIXME: remove @ts-ignore
            // @ts-ignore
            sorter,
            filter,
          });
        }}
        columns={columns}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
      />
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      >
        <ProTable<any, any>
          onSubmit={async (value: any) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="id"
          type="form"
          columns={columns.filter((item) => item.dataIndex !== 'id')}
          form={{
            initialValues: {
              tableId: 1,
              pNum: 5,
              pMark: '不要辣椒',
              totalPrice: 100,
              totalNum: 2,
            },
            submitter: {
              resetButtonProps: {
                style: {
                  display: 'none',
                },
              },
            },
          }}
        />
      </CreateForm>
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value: any) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
          columns={columns}
        />
      ) : null}
    </PageContainer>
  );
}

export default OrderPage
