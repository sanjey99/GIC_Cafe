import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, type ColDef, type ICellRendererParams } from 'ag-grid-community';
import { useEmployees, useDeleteEmployee } from '../hooks/useEmployees';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import type { EmployeeDto } from '../api/types';

ModuleRegistry.registerModules([AllCommunityModule]);

const EmployeesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cafeFilter = searchParams.get('cafe') || undefined;
  const [deleteTarget, setDeleteTarget] = useState<EmployeeDto | null>(null);

  const { data: employees = [], isLoading } = useEmployees(cafeFilter);
  const deleteMutation = useDeleteEmployee();

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      message.success('Employee deleted successfully');
      setDeleteTarget(null);
    } catch {
      message.error('Failed to delete employee');
    }
  }, [deleteTarget, deleteMutation]);

  const columnDefs = useMemo<ColDef<EmployeeDto>[]>(() => [
    { headerName: 'Employee ID', field: 'id', width: 140 },
    { headerName: 'Name', field: 'name', flex: 1, filter: true },
    { headerName: 'Email', field: 'emailAddress', flex: 1, filter: true },
    { headerName: 'Phone', field: 'phoneNumber', width: 120 },
    { headerName: 'Days Worked', field: 'daysWorked', width: 120, sort: 'desc' },
    { headerName: 'Cafe', field: 'cafe', width: 150, filter: true },
    {
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filter: false,
      cellRenderer: (params: ICellRendererParams<EmployeeDto>) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/employees/edit/${params.data?.id}`)}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => setDeleteTarget(params.data ?? null)}
          />
        </Space>
      ),
    },
  ], [navigate]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">
          Employees {cafeFilter ? `— ${cafeFilter}` : ''}
        </h1>
        <Space>
          {cafeFilter && (
            <Button onClick={() => navigate('/employees')}>Show All</Button>
          )}
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/employees/add')}>
            Add Employee
          </Button>
        </Space>
      </div>

      <div style={{ width: '100%', height: 500 }}>
        <AgGridReact<EmployeeDto>
          rowData={employees}
          columnDefs={columnDefs}
          loading={isLoading}
          pagination
          paginationPageSize={10}
          domLayout="autoHeight"
          defaultColDef={{ resizable: true, sortable: true }}
        />
      </div>

      <ConfirmDeleteModal
        open={!!deleteTarget}
        title={`Are you sure you want to delete employee "${deleteTarget?.name}" (${deleteTarget?.id})?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
};

export default EmployeesPage;
