import { Form, Input } from 'antd';
import type { Rule } from 'antd/es/form';

interface TextInputProps {
  /** Form field name */
  name: string;
  /** Field label */
  label: string;
  /** Placeholder text */
  placeholder?: string;
  /** Ant Design validation rules */
  rules?: Rule[];
  /** Maximum character length (shows counter if set) */
  maxLength?: number;
  /** Whether to render a textarea */
  multiline?: boolean;
  /** Rows for textarea (default: 3) */
  rows?: number;
  /** Whether the field is disabled */
  disabled?: boolean;
}

/**
 * Reusable text input component wrapping Ant Design's Form.Item + Input.
 * Supports single-line text fields and multiline textareas with
 * built-in validation, character counting, and consistent styling.
 */
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
