import { Select } from "antd";
import { FieldNames } from "rc-select/lib/Select";
import { useEffect, useState } from "react";

const MySelect: React.FC<{
  options?: {
    label: React.ReactNode;
    value: number;
  }[];
  /** Value 和 onChange 会被自动注入 */
  value?: string;
  onChange?: (value: string) => void;
  fieldNames?: FieldNames;
}> = (props) => {
  const { options } = props;

  const [innerOptions, setOptions] = useState<
    {
      label: React.ReactNode;
      value: number;
    }[]
  >([]);

  useEffect(() => {
    setOptions(options || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  return (
    <Select
      options={innerOptions}
      value={props.value}
      onChange={props.onChange}
      placeholder="请选择"
      style={{
        textAlign: "left",
      }}
      fieldNames={props.fieldNames}
    />
  );
};

export { MySelect };