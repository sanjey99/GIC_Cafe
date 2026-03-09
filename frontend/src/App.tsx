import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, Layout, Menu } from 'antd';
import { CoffeeOutlined, TeamOutlined } from '@ant-design/icons';
import CafesPage from './pages/CafesPage';
import EmployeesPage from './pages/EmployeesPage';
import AddEditCafePage from './pages/AddEditCafePage';
import AddEditEmployeePage from './pages/AddEditEmployeePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
});

const { Header, Content } = Layout;

const AppLayout: React.FC = () => {
  const location = useLocation();
  const selectedKey = location.pathname.startsWith('/employees') ? 'employees' : 'cafes';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', padding: '0 24px' }}>
        <div style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginRight: 40 }}>
          Cafe Manager
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={[
            { key: 'cafes', icon: <CoffeeOutlined />, label: <Link to="/cafes">Cafes</Link> },
            { key: 'employees', icon: <TeamOutlined />, label: <Link to="/employees">Employees</Link> },
          ]}
          style={{ flex: 1 }}
        />
      </Header>
      <Content style={{ background: '#f5f5f5' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/cafes" replace />} />
          <Route path="/cafes" element={<CafesPage />} />
          <Route path="/cafes/add" element={<AddEditCafePage />} />
          <Route path="/cafes/edit/:id" element={<AddEditCafePage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/employees/add" element={<AddEditEmployeePage />} />
          <Route path="/employees/edit/:id" element={<AddEditEmployeePage />} />
        </Routes>
      </Content>
    </Layout>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1a7f64',
            borderRadius: 6,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          },
        }}
      >
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
