import {
  ActionType,
  PageContainer,
  ProTable,
  ProColumns,
  TableDropdown,
} from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useRef, useState } from 'react';
import { addUser, deleteUser, modifyUser, queryUserList } from '../../api/UserController';
import UpdateForm from './components/UpdateForm';
import CreateForm from './components/CreateForm';
import { useFetch } from '../../hook/useFetch';
import { queryRoleList } from '../../api/RoleController';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.UserInfo) => {
  const hide = message.loading('正在添加');
  try {
    await addUser({ ...fields });
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
const handleUpdate = async (fields: API.UserInfo) => {
  console.log('fields: ', fields);
  const hide = message.loading('正在配置');
  try {
    await modifyUser(
      {
        userId: fields.id || '',
      },
      {
        // name: fields.name || '',
        // nickName: fields.nickName || '',
        email: fields.email || '',
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
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteUser({
      id: selectedRows.find((row) => row.id)?.id || '',
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const UserPage = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [createFormValues, setCreateFormValues] = useState({});
  const [formTypeValues, setFormTypeValues] = useState(1); // 1新增 2修改
  const { data: { list: roleList = [] } }: any = useFetch(queryRoleList);
  // console.log('roleList: ', roleList);
  const actionRef = useRef<ActionType>();
  // const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);
  const columns: ProColumns<API.UserInfo>[] = [
    {
      title: '用户ID',
      dataIndex: 'id',
      tooltip: 'ID是唯一的 key',
      fieldProps: {
        disabled: true,
      }
    },
    {
      title: '用户名称',
      dataIndex: 'username',
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
      title: '用户密码',
      dataIndex: 'password',
      valueType: 'text',
      // hideInForm: true,
      search: false,
      hideInTable: true,
    },
    {
      title: '用户电话',
      dataIndex: 'mobile',
      valueType: 'text',
    },
    {
      title: '用户邮箱',
      dataIndex: 'email',
      valueType: 'text',
    },
    {
      title: '用户角色',
      dataIndex: 'roleIds',
      ellipsis: true,
      valueType: 'select',
      fieldProps: {
        // options: [
        //   { label: '模块', value: 1 },
        //   { label: '菜单', value: 2 },
        //   { label: '操作', value: 3 },
        // ],
        mode: 'multiple',
        fieldNames: {
          label: 'title',
          value: 'id',
        },
        options: roleList,
      },
      // renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
      //   if (type === 'form') {
      //     return null;
      //   }
      //   const stateType = form.getFieldValue('state');
      //   if (stateType === 3) {
      //     return <Input />;
      //   }
      //   if (stateType === 4) {
      //     return null;
      //   }
      //   return (
      //     <MySelect
      //       {...rest}
      //     />
      //   );
      // },
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
              setFormTypeValues(2);
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
        title: '用户管理',
      }}
    >
      <ProTable<API.UserInfo>
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
            onClick={() => {
              handleModalVisible(true)
              setCreateFormValues({})
              setFormTypeValues(1)
            }}
          >
            新建
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          const { data } = await queryUserList({
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
        title={formTypeValues === 1 ? '新增用户' : '编辑用户'}
      >
        <ProTable<API.UserInfo, API.UserInfo>
          onSubmit={async (value: any) => {
            console.log('value: ', value);
            const success = 
              formTypeValues === 1 ? 
                await handleAdd(value) : 
                await handleUpdate(value);
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
        />
      ) : null}
    </PageContainer>
  );
}

export default UserPage
