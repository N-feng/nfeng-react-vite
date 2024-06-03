import {
  ActionType,
  PageContainer,
  ProTable,
  ProColumns,
  TableDropdown,
} from '@ant-design/pro-components';
import { Button } from 'antd';
import { useRef, useState } from 'react';
import { queryRoleList } from '../../api/RoleController';
import TableTransfer from './components/TableTransfer';
import UpdateForm from './components/UpdateForm';
import CreateForm from './components/CreateForm';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.UserInfo) =>
  new Promise<any>((resolve, reject) => {
  setTimeout(() => {
    resolve(true);
  }, 2000);
  // reject('error');
});

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: API.RoleInfo) =>
  new Promise<any>((resolve, reject) => {
  setTimeout(() => {
    resolve(true);
  }, 2000);
  // reject('error');
});

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = (params: any) => 
new Promise<any>((resolve, reject) => {
  setTimeout(() => {
    resolve(true);
  }, 2000);
  // reject('error');
});

const RolePage = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [createFormValues, setCreateFormValues] = useState({});
  const [roleAccessModalVisible, handleRoleAccessModalVisible] = useState<boolean>(false);
  const [roleAccessValues, setRoleAccessValues] = useState({});
  const actionRef = useRef<ActionType>();
  // const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);
  const columns: ProColumns<API.UserInfo>[] = [
    {
      title: '角色id',
      dataIndex: '_id',
      tooltip: 'id是唯一的 key',
      hideInForm: true,
      search: false,
    },
    {
      title: '角色名称',
      dataIndex: 'title',
      valueType: 'text',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
      },
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      valueType: 'text',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'text',
      hideInForm: true,
      search: false,
    },
    {
      title: '修改时间',
      dataIndex: 'updatedAt',
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
              handleModalVisible(true);
              setCreateFormValues(record);
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
              if (key === 'doAuth') {
                handleRoleAccessModalVisible(true);
                setRoleAccessValues(record);
              }
            }}
            menus={[
              { key: 'doAuth', name: '授权' },
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
        title: '角色管理',
      }}
    >
      <ProTable<API.UserInfo>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="_id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            onClick={() => {
              handleModalVisible(true)
              setCreateFormValues({})
            }}
          >
            新建
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          const { data } = await queryRoleList({
            ...params,
            // FIXME: remove @ts-ignore
            // @ts-ignore
            sorter,
            filter,
          });
          return {
            data: data?.list || [],
            // success,
          };
        }}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        // }}
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
        }}
      />
      {/* {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <button style={{ fontWeight: 600 }}>{selectedRowsState.length}</button>{' '}
              项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )} */}
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      >
        <ProTable<API.RoleInfo, API.RoleInfo>
          onSubmit={async (value: any) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="key"
          type="form"
          columns={columns}
          form={{
            initialValues: createFormValues,
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
        />
      ) : null}
      {roleAccessValues && Object.keys(roleAccessValues).length ? (
        <TableTransfer
          onSubmit={async (value) => {
            handleRoleAccessModalVisible(false);
            setRoleAccessValues({});
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }}
          onCancel={() => {
            handleRoleAccessModalVisible(false);
            setRoleAccessValues({});
          }}
          updateModalVisible={roleAccessModalVisible}
          values={roleAccessValues}
        />
      ) : null}
    </PageContainer>
  );
}

export default RolePage
