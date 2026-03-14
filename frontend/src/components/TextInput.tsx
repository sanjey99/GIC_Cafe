import { Form, Input } from 'antd';
import type { Rule } from 'antd/es/form';

interface TextInputProps {
  name: string;
  label: string;
  placeholder?: string;
  rules?: Rule[];
  maxLength?: number;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  name,
  label,
  placeholder,
  rules,
  maxLength,
  multiline = false,
  rows = 3,
  disabled = false,
}) => {
  return (
    <Form.Item label={label} name={name} rules={rules}>
      {multiline ? (
        <Input.TextArea
          placeholder={placeholder}
          maxLength={maxLength}
          rows={rows}
          showCount={!!maxLength}
          disabled={disabled}
        />
      ) : (
        <Input
          placeholder={placeholder}
          maxLength={maxLength}
          showCount={!!maxLength}
          disabled={disabled}
        />
      )}
    </Form.Item>
  );
};

export default TextInput;
