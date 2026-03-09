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
      <Header className="app-header" style={{ display: 'flex', alignItems: 'center', padding: '0 28px' }}>
        <div className="app-logo" style={{ marginRight: 40 }}>
          ☕ Café Manager
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={[
            { key: 'cafes', icon: <CoffeeOutlined />, label: <Link to="/cafes">Cafés</Link> },
            { key: 'employees', icon: <TeamOutlined />, label: <Link to="/employees">Employees</Link> },
          ]}
          style={{ flex: 1, background: 'transparent' }}
        />
      </Header>
      <Content style={{ background: 'var(--surface, #f7f9fb)' }}>
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
            colorBgLayout: '#f7f9fb',
            colorBgContainer: '#ffffff',
            borderRadius: 6,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            colorText: '#1a2332',
            colorTextSecondary: '#5e6c84',
            colorBorder: '#e8ecf1',
            controlHeight: 38,
          },
          components: {
            Button: { borderRadius: 6, controlHeight: 38, fontWeight: 500 },
            Card: { borderRadiusLG: 10, paddingLG: 24 },
            Input: { borderRadius: 6, controlHeight: 38 },
            Select: { borderRadius: 6, controlHeight: 38 },
            Table: { borderRadius: 10 },
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
