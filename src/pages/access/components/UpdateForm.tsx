import {
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

export interface FormValueType extends Partial<API.AccessInfo> {
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
  values: Partial<API.AccessInfo>;
  columns: ProColumns<API.AccessInfo>[]
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
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
      
      <ProTable<API.AccessInfo>
        onSubmit={props.onSubmit}
        columns={props.columns}
        type='form'
        form={{
          initialValues: props.values,
          submitter: {
            render: (_, dom) => <div style={{ textAlign: 'right' }}>{dom}</div>,
            resetButtonProps: {
              style: {
                display: 'none',
              },
            },
          },
        }}
      />
    </Modal>
  );
};

export default UpdateForm;
