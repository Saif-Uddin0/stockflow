import { useLocation } from 'react-router';
import { Bell, Menu } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const pageTitles = {
  '/':            { title: 'Dashboard',    sub: 'Welcome back! Here\'s your store overview.' },
  '/products':    { title: 'Products',      sub: 'Manage your product catalog.' },
  '/add-product': { title: 'Add Product',   sub: 'Create a new product listing.' },
  '/categories':  { title: 'Categories',    sub: 'Organize products by category.' },
  '/orders':      { title: 'Orders',        sub: 'Track and manage customer orders.' },
  '/create-order':{ title: 'Create Order',  sub: 'Place a new customer order.' },
  '/restock':     { title: 'Restock Queue', sub: 'Products running low on stock.' },
};

const Header = ({ onMenuToggle }) => {
  const { user } = useAuth();
  const location = useLocation();
  const page = pageTitles[location.pathname] || { title: 'StockFlow', sub: '' };

  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? 'U';

  return (
    <header style={{
      height: 'var(--header-h)',
      background: '#0a0f1e',
      borderBottom: '1px solid var(--border-light)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 16,
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      zIndex: 5,
    }}>
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuToggle}
        style={{
          display: 'none',
          background: 'transparent', border: 'none',
          color: 'var(--text-muted)', cursor: 'pointer',
          padding: 4, borderRadius: 6,
        }}
        className="mobile-menu-btn"
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
          {page.title}
        </h1>
        {page.sub && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, marginTop: 1 }}>
            {page.sub}
          </p>
        )}
      </div>

      {/* Right section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Notification bell */}
        <button
          title="Notifications"
          style={{
            position: 'relative',
            background: 'transparent', border: 'none',
            color: 'var(--text-muted)', cursor: 'pointer',
            width: 36, height: 36, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-surface2)'; e.currentTarget.style.color = 'var(--text)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <Bell size={18} />
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: 'var(--border-light)' }} />

        {/* User avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 34, height: 34,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), #818cf8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: 700, color: '#fff',
            flexShrink: 0,
            boxShadow: '0 0 8px rgba(99,102,241,0.3)',
          }}>
            {initials}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.2 }}>
              {user?.displayName || 'User'}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>
              {user?.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
