import {
  ActionType,
  PageContainer,
  ProTable,
  ProColumns,
  TableDropdown,
} from '@ant-design/pro-components';
import { Button, message, Image, Space, Tag } from 'antd';
import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { deleteSetting, querySettingList } from '../../api/SettingController';


/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: any[]) => {
  console.log('selectedRows: ', selectedRows);
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteSetting({
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

export const SettingPage = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<any>[] = [
    {
      title: '权限id',
      dataIndex: 'id',
      tooltip: 'id是唯一的 key',
      search: false,
      fieldProps: {
        disabled: true,
      }
    },
    {
      title: '菜品名称',
      dataIndex: 'title',
      valueType: 'text',
    },
    {
      title: '菜品分类',
      dataIndex: 'pro_cat',
      valueType: 'text',
      render: (_, row) => {
        // console.log('row: ', row);
        return row.pro_cat?.title || '-'
      }
    },
    {
      title: '菜品图片',
      dataIndex: 'image',
      key: 'image',
      valueType: 'image',
      render: (_, row) => {
        // console.log(row)
        return row.imgUrl.map((el: any) => (
          <Image
            width={80}
            src={el.url}
            key={el.uid}
          />
        ))
      },
    },

    {
      title: '增加时间',
      dataIndex: 'createdAt',
      valueType: 'text',
      hideInForm: true,
      search: false,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      valueType: 'text',
      hideInForm: true,
      search: false,
    },
    {
      title: '推荐',
      dataIndex: 'is_best',
      valueType: 'text',
      render: (_, record) => (
        record.is_best ? <Space>
          {/* {record.labels.map(({ name, color }: any) => (
            <Tag color={color} key={name}>
              {name}
            </Tag>
          ))} */}
          <Tag color='red' key={record.id+record.is_best}>荐</Tag>
        </Space> : '-'
      ),
    },
    {
      title: '热销',
      dataIndex: 'is_hot',
      valueType: 'text',
      render: (_, record) => (
        record.is_hot ? <Space>
          {/* {record.labels.map(({ name, color }: any) => (
            <Tag color={color} key={name}>
              {name}
            </Tag>
          ))} */}
          <Tag color='red' key={record.id+record.is_hot}>热</Tag>
        </Space> : '-'
      ),
    },
    // {
    //   title: '节点类型',
    //   dataIndex: 'type',
    //   // valueEnum: {
    //   //   1: { text: '模块', status: '1' },
    //   //   2: { text: '菜单', status: '2' },
    //   //   3: { text: '操作', status: '3' },
    //   // },
    //   valueType: 'select',
    //   fieldProps: {
    //     options: [
    //       { label: '模块', value: 1 },
    //       { label: '菜单', value: 2 },
    //       { label: '操作', value: 3 },
    //     ]
    //   },
    //   renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
    //     // console.log('rest: ', rest);
    //     // if (type === 'form') {
    //     //   return null;
    //     // }
    //     const stateType = form.getFieldValue('state');
    //     if (stateType === 3) {
    //       return <Input />;
    //     }
    //     if (stateType === 4) {
    //       return null;
    //     }
    //     return (
    //       <MySelect
    //         {...rest}
    //       />
    //     );
    //   },
    // },
    // {
    //   title: '模块id',
    //   dataIndex: 'moduleId',
    //   valueType: 'text',
    // },
    // {
    //   title: '排序',
    //   dataIndex: 'sort',
    //   valueType: 'text',
    //   search: false,
    // },
    // {
    //   title: '状态',
    //   dataIndex: 'status',
    //   valueType: 'text',
    //   search: false,
    // },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <NavLink to={`/product/update/${record.id}`}>
            <Button
              type='link'
              onClick={() => {
                // handleUpdateModalVisible(true);
                // setStepFormValues(record);
              }}
            >
              编辑
            </Button>
          </NavLink>
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
        title: '系统设置',
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
          // <Button
          //   key="1"
          //   type="primary"
          //   onClick={() => handleModalVisible(true)}
          // >
          //   新建
          // </Button>,
          <NavLink to={`/other/setting/create`}>
            <Button
              key="1"
              type="primary"
              // onClick={() => handleModalVisible(true)}
            >
              新建
            </Button>
          </NavLink>
        ]}
        request={async (params, sorter, filter) => {
          const { data } = await querySettingList({
            ...params,
            // FIXME: remove @ts-ignore
            // @ts-ignore
            sorter,
            filter,
          });
            // console.log('data: ', data);
          return {
            data: data?.list || [],
            // success,
          };
        }}
        columns={columns}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
      />
    </PageContainer>
  );
}

