import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, message, Spin, Modal } from 'antd';
import { useCafes, useCreateCafe, useUpdateCafe } from '../hooks/useCafes';

const AddEditCafePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const [form] = Form.useForm();
  const [dirty, setDirty] = useState(false);

  const { data: cafes = [], isLoading } = useCafes();
  const createMutation = useCreateCafe();
  const updateMutation = useUpdateCafe();

  const existingCafe = isEdit ? cafes.find((c) => c.id === id) : undefined;

  useEffect(() => {
    if (existingCafe) {
      form.setFieldsValue({
        name: existingCafe.name,
        description: existingCafe.description,
        logo: existingCafe.logo || '',
        location: existingCafe.location,
      });
    }
  }, [existingCafe, form]);

  const handleSubmit = async (values: { name: string; description: string; logo: string; location: string }) => {
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, ...values, logo: values.logo || null });
        message.success('Cafe updated');
      } else {
        await createMutation.mutateAsync({ ...values, logo: values.logo || null });
        message.success('Cafe created');
      }
      navigate('/cafes');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { errors?: Array<{ errorMessage: string }> } } };
      const msg = error?.response?.data?.errors?.[0]?.errorMessage || 'Operation failed';
      message.error(msg);
    }
  };

  const handleCancel = () => {
    if (dirty) {
      Modal.confirm({
        title: 'Unsaved Changes',
        content: 'You have unsaved changes. Are you sure you want to leave?',
        okText: 'Leave',
        cancelText: 'Stay',
        onOk: () => navigate('/cafes'),
      });
    } else {
      navigate('/cafes');
    }
  };

  if (isEdit && isLoading) return <Spin className="m-10" />;

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-semibold mb-6">{isEdit ? 'Edit Cafe' : 'Add Cafe'}</h1>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={() => setDirty(true)}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: 'Name is required' },
            { min: 6, message: 'Min 6 characters' },
            { max: 10, message: 'Max 10 characters' },
          ]}
        >
          <Input placeholder="Cafe name" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: 'Description is required' },
            { max: 256, message: 'Max 256 characters' },
          ]}
        >
          <Input.TextArea rows={3} placeholder="Brief description" showCount maxLength={256} />
        </Form.Item>

        <Form.Item
          label="Logo URL"
          name="logo"
        >
          <Input placeholder="https://example.com/logo.png (optional)" />
        </Form.Item>

        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: 'Location is required' }]}
        >
          <Input placeholder="e.g. Orchard" />
        </Form.Item>

        <Form.Item>
          <div className="flex gap-3">
            <Button
              type="primary"
              htmlType="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {isEdit ? 'Update' : 'Create'}
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddEditCafePage;
