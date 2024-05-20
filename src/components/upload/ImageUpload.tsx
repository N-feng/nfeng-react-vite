import { ProFormUploadButton } from "@ant-design/pro-components"
import { baseURL, getToken } from "../../utils/request";

export const ImageUpload: React.FC<{
  options?: {
    label: React.ReactNode;
    value: number;
  }[];
  /** Value 和 onChange 会被自动注入 */
  value?: [];
  label?: string;
  name?: string;
  onChange?: (value: string) => void;
  maxCount?: number;
  max?: number;
}> = (props) => {
  console.log('props: ', props);

  const action = `${baseURL}/product/upload`
  const token = getToken()
  
  return (
    <ProFormUploadButton 
      name={props.name}
      label={props.label}
      action={action}
      fieldProps={{
        defaultFileList: props.value,
        headers: {
          Authorization: token && `Bearer ${token}`
        },
      }}
      max={props.max || props.maxCount}
    />
  )
}