import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Input, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, type ColDef, type ICellRendererParams } from 'ag-grid-community';
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
    if (search) {
      setSearchParams({ location: search });
    } else {
      setSearchParams({});
    }
  }, [search, setSearchParams]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      message.success('Cafe deleted successfully');
      setDeleteTarget(null);
    } catch {
      message.error('Failed to delete cafe');
    }
  }, [deleteTarget, deleteMutation]);

  const columnDefs = useMemo<ColDef<CafeDto>[]>(() => [
    {
      headerName: 'Logo',
      field: 'logo',
      width: 80,
      cellRenderer: (params: ICellRendererParams<CafeDto>) =>
        params.value ? (
          <img src={params.value} alt="logo" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
        ) : (
          <span style={{ color: '#999' }}>—</span>
        ),
      sortable: false,
      filter: false,
    },
    { headerName: 'Name', field: 'name', flex: 1, filter: true },
    { headerName: 'Description', field: 'description', flex: 2, filter: true },
    {
      headerName: 'Employees',
      field: 'employees',
      width: 120,
      cellRenderer: (params: ICellRendererParams<CafeDto>) => (
        <Button
          type="link"
          onClick={() => navigate(`/employees?cafe=${params.data?.name}`)}
        >
          {params.value}
        </Button>
      ),
    },
    { headerName: 'Location', field: 'location', width: 150, filter: true },
    {
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filter: false,
      cellRenderer: (params: ICellRendererParams<CafeDto>) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/cafes/edit/${params.data?.id}`)}
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
        <h1 className="text-2xl font-semibold">Cafes</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/cafes/add')}>
          Add Cafe
        </Button>
      </div>

      <Space className="mb-4">
        <Input
          placeholder="Filter by location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onPressEnter={handleSearch}
          allowClear
          style={{ width: 250 }}
        />
        <Button onClick={handleSearch}>Search</Button>
      </Space>

      <div style={{ width: '100%', height: 500 }}>
        <AgGridReact<CafeDto>
          rowData={cafes}
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
        title={`Are you sure you want to delete "${deleteTarget?.name}"? All employees assigned to this cafe will also be deleted.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
};

export default CafesPage;
