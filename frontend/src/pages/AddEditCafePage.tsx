import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Upload, message, Spin, Modal, Card } from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import type { UploadFile, RcFile } from 'antd/es/upload';
import { useCafes, useCreateCafe, useUpdateCafe } from '../hooks/useCafes';
import TextInput from '../components/TextInput';

const MAX_LOGO_SIZE_MB = 2;

/**
 * Converts a file to a base64 data URL string.
 */
const fileToBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const AddEditCafePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const [form] = Form.useForm();
  const [dirty, setDirty] = useState(false);
  const [logoFileList, setLogoFileList] = useState<UploadFile[]>([]);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);

  const { data: cafes = [], isLoading } = useCafes();
  const createMutation = useCreateCafe();
  const updateMutation = useUpdateCafe();

  const existingCafe = isEdit ? cafes.find((c) => c.id === id) : undefined;

  useEffect(() => {
    if (existingCafe) {
      form.setFieldsValue({
        name: existingCafe.name,
        description: existingCafe.description,
        location: existingCafe.location,
      });
      // If existing logo is a base64 string, restore it
      if (existingCafe.logo) {
        setLogoBase64(existingCafe.logo);
        setLogoFileList([
          {
            uid: '-1',
            name: 'current-logo',
            status: 'done',
            url: existingCafe.logo,
          },
        ]);
      }
    }
  }, [existingCafe, form]);

  const handleLogoUpload = useCallback(async (file: RcFile) => {
    const isValidType = file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/gif' || file.type === 'image/webp';
    if (!isValidType) {
      message.error('Only PNG, JPG, GIF, or WebP files are allowed');
      return false;
    }
    const isWithinSize = file.size / 1024 / 1024 < MAX_LOGO_SIZE_MB;
    if (!isWithinSize) {
      message.error(`Logo must be smaller than ${MAX_LOGO_SIZE_MB}MB`);
      return false;
    }
    const base64 = await fileToBase64(file);
    setLogoBase64(base64);
    setLogoFileList([
      {
        uid: file.uid,
        name: file.name,
        status: 'done',
        url: base64,
      },
    ]);
    setDirty(true);
    return false; // prevent default upload
  }, []);

  const handleLogoRemove = useCallback(() => {
    setLogoBase64(null);
    setLogoFileList([]);
    setDirty(true);
  }, []);

  const handleSubmit = async (values: { name: string; description: string; location: string }) => {
    try {
      const payload = { ...values, logo: logoBase64 };
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, ...payload });
        message.success('Café updated successfully');
      } else {
        await createMutation.mutateAsync(payload);
        message.success('Café created successfully');
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
        okType: 'danger',
        cancelText: 'Stay',
        onOk: () => navigate('/cafes'),
      });
    } else {
      navigate('/cafes');
    }
  };

  if (isEdit && isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" tip="Loading café details..." />
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
        Back to Cafés
      </Button>

      <Card>
        <h1 className="text-2xl font-bold mb-6">
          {isEdit ? 'Edit Café' : 'Add New Café'}
        </h1>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={() => setDirty(true)}
          requiredMark="optional"
        >
          <TextInput
            name="name"
            label="Café Name"
            placeholder="Enter café name"
            maxLength={10}
            rules={[
              { required: true, message: 'Name is required' },
              { min: 6, message: 'Minimum 6 characters' },
              { max: 10, message: 'Maximum 10 characters' },
            ]}
          />

          <TextInput
            name="description"
            label="Description"
            placeholder="Brief description of the café"
            multiline
            rows={3}
            maxLength={256}
            rules={[
              { required: true, message: 'Description is required' },
              { max: 256, message: 'Maximum 256 characters' },
            ]}
          />

          <Form.Item label="Logo" tooltip="Upload a logo image (max 2MB, PNG/JPG/GIF/WebP)">
            <Upload
              listType="picture-card"
              fileList={logoFileList}
              beforeUpload={handleLogoUpload}
              onRemove={handleLogoRemove}
              accept="image/png,image/jpeg,image/gif,image/webp"
              maxCount={1}
            >
              {logoFileList.length === 0 && (
                <div>
                  <UploadOutlined style={{ fontSize: 20 }} />
                  <div style={{ marginTop: 8, fontSize: 12 }}>Upload Logo</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <TextInput
            name="location"
            label="Location"
            placeholder="e.g. Orchard, Bugis, Tanjong Pagar"
            rules={[{ required: true, message: 'Location is required' }]}
          />

          <Form.Item className="mt-8">
            <div className="flex gap-3">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={createMutation.isPending || updateMutation.isPending}
              >
                {isEdit ? 'Update Café' : 'Create Café'}
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

export default AddEditCafePage;
