import { useState } from 'react';
import { Outlet } from 'react-router';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

const Root = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(p => !p)} />

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Header onMenuToggle={() => setCollapsed(p => !p)} />

        {/* Page content */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '28px 28px 40px',
          background: 'var(--bg-base)',
        }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', animation: 'fadeIn 0.3s ease' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Root;
