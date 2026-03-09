import { Modal } from 'antd';

interface Props {
  open: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ConfirmDeleteModal: React.FC<Props> = ({ open, title, onConfirm, onCancel, loading }) => (
  <Modal
    title="Confirm Deletion"
    open={open}
    onOk={onConfirm}
    onCancel={onCancel}
    okText="Delete"
    okButtonProps={{ danger: true, loading }}
    cancelButtonProps={{ disabled: loading }}
  >
    <p>{title}</p>
  </Modal>
);

export default ConfirmDeleteModal;
