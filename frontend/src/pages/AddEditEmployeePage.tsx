import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Radio, Select, message, Spin, Modal } from 'antd';
import { useCafes } from '../hooks/useCafes';
import { useEmployees, useCreateEmployee, useUpdateEmployee } from '../hooks/useEmployees';

const AddEditEmployeePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const [form] = Form.useForm();
  const [dirty, setDirty] = useState(false);

  const { data: cafes = [] } = useCafes();
  const { data: employees = [], isLoading } = useEmployees();
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();

  const existingEmployee = isEdit ? employees.find((e) => e.id === id) : undefined;
  const existingCafe = existingEmployee?.cafe
    ? cafes.find((c) => c.name === existingEmployee.cafe)
    : undefined;

  useEffect(() => {
    if (existingEmployee) {
      form.setFieldsValue({
        name: existingEmployee.name,
        emailAddress: existingEmployee.emailAddress,
        phoneNumber: existingEmployee.phoneNumber,
        gender: existingEmployee.phoneNumber ? undefined : undefined, // we'll need gender from API
        cafeId: existingCafe?.id || null,
      });
    }
  }, [existingEmployee, existingCafe, form]);

  const handleSubmit = async (values: {
    name: string;
    emailAddress: string;
    phoneNumber: string;
    gender: 'Male' | 'Female';
    cafeId: string | null;
  }) => {
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, ...values, cafeId: values.cafeId || null });
        message.success('Employee updated');
      } else {
        await createMutation.mutateAsync({ ...values, cafeId: values.cafeId || null });
        message.success('Employee created');
      }
      navigate('/employees');
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
        onOk: () => navigate('/employees'),
      });
    } else {
      navigate('/employees');
    }
  };

  if (isEdit && isLoading) return <Spin className="m-10" />;

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-semibold mb-6">{isEdit ? 'Edit Employee' : 'Add Employee'}</h1>

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
          <Input placeholder="Employee name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="emailAddress"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Invalid email format' },
          ]}
        >
          <Input placeholder="email@example.com" />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phoneNumber"
          rules={[
            { required: true, message: 'Phone is required' },
            { pattern: /^[89]\d{7}$/, message: 'Must start with 8 or 9 and have 8 digits' },
          ]}
        >
          <Input placeholder="8XXXXXXX or 9XXXXXXX" maxLength={8} />
        </Form.Item>

        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: 'Gender is required' }]}
        >
          <Radio.Group>
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Assigned Cafe" name="cafeId">
          <Select allowClear placeholder="Select a cafe (optional)">
            {cafes.map((c) => (
              <Select.Option key={c.id} value={c.id}>
                {c.name} — {c.location}
              </Select.Option>
            ))}
          </Select>
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

export default AddEditEmployeePage;
