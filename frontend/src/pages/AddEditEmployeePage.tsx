import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Radio, Select, message, Spin, Modal, Card } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useCafes } from '../hooks/useCafes';
import { useEmployees, useCreateEmployee, useUpdateEmployee } from '../hooks/useEmployees';
import TextInput from '../components/TextInput';

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

  useEffect(() => {
    if (existingEmployee) {
      form.setFieldsValue({
        name: existingEmployee.name,
        emailAddress: existingEmployee.emailAddress,
        phoneNumber: existingEmployee.phoneNumber,
        gender: existingEmployee.gender,
        cafeId: existingEmployee.cafeId || undefined,
      });
    }
  }, [existingEmployee, form]);

  const handleSubmit = async (values: {
    name: string;
    emailAddress: string;
    phoneNumber: string;
    gender: 'Male' | 'Female';
    cafeId: string | undefined;
  }) => {
    try {
      const payload = { ...values, cafeId: values.cafeId || null };
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, ...payload });
        message.success('Employee updated successfully');
      } else {
        await createMutation.mutateAsync(payload);
        message.success('Employee created successfully');
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
        okType: 'danger',
        cancelText: 'Stay',
        onOk: () => navigate('/employees'),
      });
    } else {
      navigate('/employees');
    }
  };

  if (isEdit && isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" tip="Loading employee details..." />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={handleCancel}
        className="mb-4"
      >
        Back to Employees
      </Button>

      <Card>
        <h1 className="text-2xl font-bold mb-6">
          {isEdit ? 'Edit Employee' : 'Add New Employee'}
        </h1>

        {isEdit && existingEmployee && (
          <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-gray-500 text-sm">Employee ID: </span>
            <code className="text-sm font-semibold" style={{ color: '#1a7f64' }}>
              {existingEmployee.id}
            </code>
          </div>
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={() => setDirty(true)}
          requiredMark="optional"
        >
          <TextInput
            name="name"
            label="Full Name"
            placeholder="Enter employee name"
            maxLength={10}
            rules={[
              { required: true, message: 'Name is required' },
              { min: 6, message: 'Minimum 6 characters' },
              { max: 10, message: 'Maximum 10 characters' },
            ]}
          />

          <TextInput
            name="emailAddress"
            label="Email Address"
            placeholder="email@example.com"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Please enter a valid email address' },
            ]}
          />

          <TextInput
            name="phoneNumber"
            label="Phone Number"
            placeholder="8XXXXXXX or 9XXXXXXX"
            maxLength={8}
            rules={[
              { required: true, message: 'Phone number is required' },
              {
                pattern: /^[89]\d{7}$/,
                message: 'Must start with 8 or 9 and be exactly 8 digits',
              },
            ]}
          />

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

          <Form.Item label="Assigned Café" name="cafeId">
            <Select
              allowClear
              placeholder="Select a café (optional)"
              showSearch
              optionFilterProp="children"
            >
              {cafes.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name} — {c.location}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item className="mt-8">
            <div className="flex gap-3">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={createMutation.isPending || updateMutation.isPending}
              >
                {isEdit ? 'Update Employee' : 'Create Employee'}
              </Button>
              <Button size="large" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddEditEmployeePage;
