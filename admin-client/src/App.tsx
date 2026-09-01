import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Alert, Card, Col, Layout, Row, Statistic, Table, Tag, Typography } from 'antd';
import { api } from './api';
import type { AdminOverview } from './types';

const { Header, Content, Sider } = Layout;

function Login({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      const user = response.data?.data?.user;
      const token = response.data?.data?.token;
      if (!token || user?.role !== 'admin') throw new Error('This account does not have admin access.');
      localStorage.setItem('medaxis_admin_token', token);
      localStorage.setItem('medaxis_admin_user', JSON.stringify(user));
      onLogin(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return <div className="login-shell"><Card className="login-card"><Typography.Title level={2}>MedAxis Admin</Typography.Title><Typography.Paragraph type="secondary">Sign in with an administrator account.</Typography.Paragraph><input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><button onClick={submit}>Sign in</button>{error && <Alert message={error} type="error" showIcon />}</Card></div>;
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('medaxis_admin_token'));
  const overview = useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: async () => (await api.get<{ data: AdminOverview }>('/admin/overview')).data.data,
    enabled: Boolean(token),
  });

  if (!token) return <Login onLogin={setToken} />;

  const data = overview.data;
  return <Layout className="app-shell"><Sider width={240} theme="dark"><div className="brand">MedAxis <span>ADMIN</span></div><div className="nav-item active">Dashboard</div><div className="nav-item">Doctors</div><div className="nav-item">Patients</div><div className="nav-item">Operations</div><div className="nav-item">Hospitals</div><div className="nav-item">Analytics</div><div className="nav-item">Audit Logs</div></Sider><Layout><Header className="topbar"><Typography.Title level={3} style={{ margin: 0 }}>System Overview</Typography.Title><Tag color="blue">Admin</Tag></Header><Content className="content">{overview.isError && <Alert message="Unable to load admin overview" type="error" showIcon />}{data && <><Row gutter={[16, 16]}><Col xs={24} sm={12} lg={6}><Card><Statistic title="Doctors" value={data.doctors} suffix={<small>{data.activeDoctors} active</small>} /></Card></Col><Col xs={24} sm={12} lg={6}><Card><Statistic title="Patients" value={data.patients} /></Card></Col><Col xs={24} sm={12} lg={6}><Card><Statistic title="Operations" value={data.operations} /></Card></Col><Col xs={24} sm={12} lg={6}><Card><Statistic title="Hospitals" value={data.hospitals} suffix={<small>{data.activeHospitals} active</small>} /></Card></Col></Row><Row gutter={[16, 16]} style={{ marginTop: 16 }}><Col xs={24} lg={12}><Card title="Platform Users"><Statistic value={data.users} suffix={<small>{data.activeUsers} active</small>} /></Card></Col><Col xs={24} lg={12}><Card title="Revenue"><Row gutter={16}><Col span={8}><Statistic title="Total" value={data.revenue.totalCost} /></Col><Col span={8}><Statistic title="Paid" value={data.revenue.totalPaid} /></Col><Col span={8}><Statistic title="Remaining" value={data.revenue.totalRemaining} /></Col></Row></Card></Col></Row><Card title="Next" style={{ marginTop: 16 }}><Table pagination={false} dataSource={[{ key: '1', item: 'Doctors, Patients, Operations and Hospitals management' }, { key: '2', item: 'System-wide analytics and audit logs' }, { key: '3', item: 'Role and permission management' }]} columns={[{ title: 'Admin Portal foundation', dataIndex: 'item' }]} /></Card></>}</Content></Layout></Layout>;
}
