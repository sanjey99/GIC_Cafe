import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface Props {
  open: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ConfirmDeleteModal: React.FC<Props> = ({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  loading,
}) => (
  <Modal
    title={
      <span>
        <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
        Confirm Deletion
      </span>
    }
    open={open}
    onOk={onConfirm}
    onCancel={onCancel}
    okText="Delete"
    okButtonProps={{ danger: true, loading }}
    cancelButtonProps={{ disabled: loading }}
  >
    <p style={{ fontWeight: 500, marginBottom: 4 }}>{title}</p>
    {description && (
      <p style={{ color: '#666', fontSize: 13 }}>{description}</p>
    )}
  </Modal>
);

export default ConfirmDeleteModal;
