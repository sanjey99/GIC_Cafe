import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Input, Space, Tag, Tooltip, message } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import {
  AllCommunityModule,
  ModuleRegistry,
  type ColDef,
  type ICellRendererParams,
} from 'ag-grid-community';
import { useCafes, useDeleteCafe } from '../hooks/useCafes';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import type { CafeDto } from '../api/types';

ModuleRegistry.registerModules([AllCommunityModule]);

const CafesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const locationFilter = searchParams.get('location') || '';
  const [search, setSearch] = useState(locationFilter);
  const [deleteTarget, setDeleteTarget] = useState<CafeDto | null>(null);

  const { data: cafes = [], isLoading } = useCafes(locationFilter || undefined);
  const deleteMutation = useDeleteCafe();

  const handleSearch = useCallback(() => {
    if (search.trim()) {
      setSearchParams({ location: search.trim() });
    } else {
      setSearchParams({});
    }
  }, [search, setSearchParams]);

  const handleClearSearch = useCallback(() => {
    setSearch('');
    setSearchParams({});
  }, [setSearchParams]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      message.success(`"${deleteTarget.name}" deleted successfully`);
      setDeleteTarget(null);
    } catch {
      message.error('Failed to delete cafe');
    }
  }, [deleteTarget, deleteMutation]);

  const columnDefs = useMemo<ColDef<CafeDto>[]>(
    () => [
      {
        headerName: 'Logo',
        field: 'logo',
        width: 80,
        cellRenderer: (params: ICellRendererParams<CafeDto>) =>
          params.value ? (
            <img
              src={params.value}
              alt="logo"
              style={{
                width: 40,
                height: 40,
                objectFit: 'cover',
                borderRadius: 6,
                border: '1px solid #e8e8e8',
              }}
            />
          ) : (
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 6,
                background: '#f0f5f3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                color: '#1a7f64',
              }}
            >
              ☕
            </div>
          ),
        sortable: false,
        filter: false,
      },
      { headerName: 'Name', field: 'name', flex: 1, filter: true },
      { headerName: 'Description', field: 'description', flex: 2, filter: true },
      {
        headerName: 'Employees',
        field: 'employees',
        width: 130,
        cellRenderer: (params: ICellRendererParams<CafeDto>) => (
          <Button
            type="link"
            size="small"
            onClick={() => navigate(`/employees?cafe=${params.data?.name}`)}
            style={{ fontWeight: 600 }}
          >
            {params.value} employee{params.value !== 1 ? 's' : ''}
          </Button>
        ),
      },
      {
        headerName: 'Location',
        field: 'location',
        width: 160,
        filter: true,
        cellRenderer: (params: ICellRendererParams<CafeDto>) => (
          <Tag icon={<EnvironmentOutlined />} color="green">
            {params.value}
          </Tag>
        ),
      },
      {
        headerName: 'Actions',
        width: 120,
        sortable: false,
        filter: false,
        cellRenderer: (params: ICellRendererParams<CafeDto>) => (
          <Space size="small">
            <Tooltip title="Edit">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => navigate(`/cafes/edit/${params.data?.id}`)}
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-2xl font-bold m-0">Cafés</h1>
          <p className="text-gray-500 mt-1 mb-0">
            Manage your café locations and their employees
          </p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => navigate('/cafes/add')}
        >
          Add New Café
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <Input
          placeholder="Filter by location..."
          prefix={<SearchOutlined style={{ color: '#bbb' }} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onPressEnter={handleSearch}
          allowClear
          onClear={handleClearSearch}
          style={{ width: 280 }}
        />
        <Button type="primary" ghost onClick={handleSearch}>
          Search
        </Button>
        {locationFilter && (
          <Tag closable onClose={handleClearSearch} color="blue">
            Location: {locationFilter}
          </Tag>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <AgGridReact<CafeDto>
          rowData={cafes}
          columnDefs={columnDefs}
          loading={isLoading}
          pagination
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
          domLayout="autoHeight"
          defaultColDef={{ resizable: true, sortable: true }}
          rowHeight={56}
          headerHeight={48}
        />
      </div>

      <ConfirmDeleteModal
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.name}"?`}
        description="This will permanently remove this café and all employees assigned to it. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
};

export default CafesPage;
