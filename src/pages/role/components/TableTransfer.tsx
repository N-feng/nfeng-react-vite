import { Button, Flex, Modal, Space, Switch, Table, Tag, Transfer, notification } from "antd";
import { useState } from "react";
import type { GetProp, TableColumnsType, TableProps, TransferProps } from 'antd';
import difference from 'lodash/difference';
import { useFetch } from "../../../hook/useFetch";
import { queryAccessList } from "../../../api/AccessController";
import { doAuth } from "../../../api/AuthController";

type TransferItem = GetProp<TransferProps, 'dataSource'>[number];
type TableRowSelection<T extends object> = TableProps<T>['rowSelection'];

interface DataType {
  key: string;
  id: string;
  moduleName: string;
  type: number;
  actionName: string;
  disabled: boolean;
}

interface TableTransferProps extends TransferProps<TransferItem> {
  dataSource: DataType[];
  leftColumns: TableColumnsType<DataType>;
  rightColumns: TableColumnsType<DataType>;
}

// Customize Table Transfer
const TableTransfer = ({ leftColumns, rightColumns, ...restProps }: TableTransferProps) => (
  <Transfer {...restProps}>
    {({
      direction,
      filteredItems,
      onItemSelectAll,
      onItemSelect,
      selectedKeys: listSelectedKeys,
      disabled: listDisabled,
    }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;

      const rowSelection: TableRowSelection<TransferItem> = {
        getCheckboxProps: (item) => ({ disabled: listDisabled || item.disabled }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter((item) => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys as string[], selected);
        },
        onSelect({ key }, selected) {
          onItemSelect(key as string, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };

      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          size="small"
          style={{ pointerEvents: listDisabled ? 'none' : undefined }}
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return;
              onItemSelect(key as string, !listSelectedKeys.includes(key as string));
            },
          })}
        />
      );
    }}
  </Transfer>
);

const valueEnum: any = {
  "1": { text: '模块', status: '1' },
  "2": { text: '菜单', status: '2' },
  "3": { text: '操作', status: '3' },
}

const leftTableColumns: TableColumnsType<DataType> = [
  {
    dataIndex: 'moduleName',
    title: '模版名称',
  },
  {
    dataIndex: 'type',
    title: '节点类型',
    render: (tag) => <Tag>{valueEnum[tag].text}</Tag>,
  },
  {
    dataIndex: 'actionName',
    title: '操作名称',
  },
];

const rightTableColumns: TableColumnsType<DataType> = [
  {
    dataIndex: 'moduleName',
    title: '模版名称',
  },
  {
    dataIndex: 'actionName',
    title: '操作名称',
  },
];

export interface FormValueType extends Partial<API.UserInfo> {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
}

export interface TableTransProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.RoleInfo>
}

const App: React.FC<TableTransProps> = (props: any) => {
  const { values } = props;

  const originTargetKeys = (values?.access || []).map((item: any) => item.id)

  const { data }: any = useFetch(queryAccessList)
  const dataSource = (data || []).map((item: any) => ({ ...item, disabled: false, key: item.id }))

  const [targetKeys, setTargetKeys] = useState<string[]>(originTargetKeys);
  const [disabled, setDisabled] = useState(false);
  const [showSearch, setShowSearch] = useState(true);

  const onChange = (nextTargetKeys: string[]) => {
    setTargetKeys(nextTargetKeys);
  };

  const triggerDisable = (checked: boolean) => {
    setDisabled(checked);
  };

  const triggerShowSearch = (checked: boolean) => {
    setShowSearch(checked);
  };

  const handleOk = async () => {
    const res: any = await doAuth({
      roleId: values.id, 
      accessIds: targetKeys
    });
    if (res.code === 200) {
      notification.success({
        message: '授权成功',
        description: '烦请该用户重新登录哦！',
      });
      props.onSubmit()
    }
  };

  const filterOption = (inputValue: any, item: any) => {
    return (item.moduleName || '').indexOf(inputValue) !== -1 
      || (item.actionName || '').indexOf(inputValue) !== -1
  }
            

  return (
    <>
      <Modal
        width={'70%'}
        destroyOnClose
        title="授权"
        open={props.updateModalVisible}
        onOk={handleOk}
        onCancel={() => props.onCancel()}
        footer={null}
      >
        <TableTransfer
          dataSource={dataSource}
          titles={['所有权限', '已有权限']}
          // locale={{ searchPlaceholder: '请输入模版名称' }}
          targetKeys={targetKeys}
          disabled={disabled}
          showSearch={showSearch}
          // onChange={onChange}
          filterOption={filterOption}
          leftColumns={leftTableColumns}
          rightColumns={rightTableColumns}
        />
        <Flex style={{ marginTop: 16 }} justify="space-between">
          <Space>
            <Switch
              unCheckedChildren="disabled"
              checkedChildren="disabled"
              checked={disabled}
              onChange={triggerDisable}
            />
            <Switch
              unCheckedChildren="showSearch"
              checkedChildren="showSearch"
              checked={showSearch}
              onChange={triggerShowSearch}
            />
          </Space>
          <Button type="primary" onClick={handleOk}>确定</Button>
        </Flex>
      </Modal>
    </>
  );
};

export default App;