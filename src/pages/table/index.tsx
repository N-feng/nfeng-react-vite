import {
  ActionType,
  PageContainer,
  ProTable,
  ProColumns,
  TableDropdown,
} from '@ant-design/pro-components';
import { Button, message, Image } from 'antd';
import { useRef, useState } from 'react';
import { addTable, deleteTable, modifyTable, queryTableList, showTableCode } from '../../api/TableController';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import Canvas from '../../components/Canvas';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: any) => {
  const hide = message.loading('正在添加');
  try {
    await addTable({ ...fields });
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
    await modifyTable(
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
    await deleteTable({
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

export const TablePage = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<any>[] = [
    {
      title: '桌号id',
      dataIndex: 'id',
      tooltip: 'id是唯一的 key',
      search: false,
      fieldProps: {
        disabled: true,
      }
    },
    {
      title: '桌号名称',
      dataIndex: 'title',
      valueType: 'text',
      formItemProps: {
        rules: [{ required: true, message: '请输入桌号名称!' }]
      }
    },
    {
      title: '桌号',
      dataIndex: 'table_num',
      valueType: 'text',
      formItemProps: {
        rules: [{ required: true, message: '请输入桌号!' }]
      }
    },
    {
      title: '桌号二维码',
      dataIndex: 'image',
      key: 'image',
      valueType: 'image',
      render: (_, row) => {
        // console.log(row)
        return  (
          row.codeSrc ? <Image
            width={80}
            preview={{
              imageRender: () => (
                // <video
                //   muted
                //   width="100%"
                //   controls
                //   src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/file/A*uYT7SZwhJnUAAAAAAAAAAAAADgCCAQ"
                // />
                <Canvas text={row.title} codeDir={row.codeSrc} />
              ),
              toolbarRender: () => null,
            }}
            src={row.codeSrc}
          /> : '-'
        )
        // return row.img_url.map((el: any) => (
        //   <Canvas
        //     width={80}
        //     src={el.url}
        //     key={el.uid}
        //   />
        // ))
      },
    },
    {
      title: '排序',
      dataIndex: 'sort',
      valueType: 'text',
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'radio',
      search: false,
      fieldProps: {
        options: [
          {
            value: '1',
            label: '显示',
          },
          {
            value: '0',
            label: '隐藏',
          },
        ]
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
              if (key === 'showCode') {
                await showTableCode(record.id)
                actionRef.current?.reloadAndRest?.();
              }
              if (key === 'delete') {
                await handleRemove([record])
                actionRef.current?.reloadAndRest?.();
              }
            }}
            menus={[
              { key: 'showCode', name: '显示二维码' },
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
        title: '桌号管理',
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
          const { data } = await queryTableList({
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
              sort: 100,
              status: "1",
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
