import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Space, Tag, Tooltip, message } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  ManOutlined,
  WomanOutlined,
} from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import {
  AllCommunityModule,
  ModuleRegistry,
  type ColDef,
  type ICellRendererParams,
} from 'ag-grid-community';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import { useEmployees, useDeleteEmployee } from '../hooks/useEmployees';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import type { EmployeeDto } from '../api/types';

dayjs.extend(relativeTime);
dayjs.extend(duration);

ModuleRegistry.registerModules([AllCommunityModule]);

/** Formats days worked into a human-readable string, e.g. "1y 3m" or "45d" */
const formatDaysWorked = (days: number): string => {
  if (days <= 0) return '0 days';
  const d = dayjs.duration(days, 'days');
  const years = Math.floor(d.asYears());
  const months = Math.floor(d.asMonths() % 12);
  const remainingDays = days - (years * 365 + months * 30);

  if (years > 0) return `${years}y ${months}m`;
  if (months > 0) return `${months}m ${remainingDays}d`;
  return `${days}d`;
};

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
      message.success(`Employee "${deleteTarget.name}" deleted`);
      setDeleteTarget(null);
    } catch {
      message.error('Failed to delete employee');
    }
  }, [deleteTarget, deleteMutation]);

  const columnDefs = useMemo<ColDef<EmployeeDto>[]>(
    () => [
      {
        headerName: 'Employee ID',
        field: 'id',
        width: 140,
        cellRenderer: (params: ICellRendererParams<EmployeeDto>) => (
          <code style={{ fontSize: 12, color: '#1a7f64' }}>{params.value}</code>
        ),
      },
      { headerName: 'Name', field: 'name', flex: 1, filter: true },
      { headerName: 'Email', field: 'emailAddress', flex: 1, filter: true },
      { headerName: 'Phone', field: 'phoneNumber', width: 120 },
      {
        headerName: 'Gender',
        field: 'gender',
        width: 100,
        cellRenderer: (params: ICellRendererParams<EmployeeDto>) => (
          <Tag
            icon={params.value === 'Male' ? <ManOutlined /> : <WomanOutlined />}
            color={params.value === 'Male' ? 'blue' : 'magenta'}
          >
            {params.value}
          </Tag>
        ),
      },
      {
        headerName: 'Days Worked',
        field: 'daysWorked',
        width: 130,
        sort: 'desc',
        cellRenderer: (params: ICellRendererParams<EmployeeDto>) => (
          <Tooltip title={`${params.value} days total`}>
            <span style={{ fontWeight: 500 }}>
              {formatDaysWorked(params.value as number)}
            </span>
          </Tooltip>
        ),
      },
      {
        headerName: 'Café',
        field: 'cafe',
        width: 150,
        filter: true,
        cellRenderer: (params: ICellRendererParams<EmployeeDto>) =>
          params.value ? (
            <Tag color="green">{params.value}</Tag>
          ) : (
            <span style={{ color: '#999' }}>Unassigned</span>
          ),
      },
      {
        headerName: 'Actions',
        width: 120,
        sortable: false,
        filter: false,
        cellRenderer: (params: ICellRendererParams<EmployeeDto>) => (
          <Space size="small">
            <Tooltip title="Edit">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => navigate(`/employees/edit/${params.data?.id}`)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => setDeleteTarget(params.data ?? null)}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [navigate],
  );

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-2xl font-bold m-0" style={{ color: 'var(--text-primary)' }}>
            Employees{cafeFilter ? ` — ${cafeFilter}` : ''}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4, marginBottom: 0 }}>
            {cafeFilter
              ? `Showing employees assigned to ${cafeFilter}`
              : 'Manage all employees across all cafés'}
          </p>
        </div>
        <Space>
          {cafeFilter && (
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/employees')}
            >
              Show All
            </Button>
          )}
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => navigate('/employees/add')}
          >
            Add New Employee
          </Button>
        </Space>
      </div>

      <div className="grid-wrapper">
        <AgGridReact<EmployeeDto>
          rowData={employees}
          columnDefs={columnDefs}
          loading={isLoading}
          pagination
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
          domLayout="autoHeight"
          defaultColDef={{ resizable: true, sortable: true }}
          rowHeight={52}
          headerHeight={48}
        />
      </div>

      <ConfirmDeleteModal
        open={!!deleteTarget}
        title={`Delete employee "${deleteTarget?.name}" (${deleteTarget?.id})?`}
        description="This will permanently remove this employee record. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
};

export default EmployeesPage;
