import { NavLink, useLocation } from 'react-router';
import {
  LayoutDashboard, Package, Tags, ShoppingCart,
  RefreshCw, ChevronLeft, ChevronRight, LogOut,
  Boxes,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useAppContext from '../../hooks/useAppContext';

const navItems = [
  { to: '/',               label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/products',       label: 'Products',     icon: Package },
  { to: '/categories',     label: 'Categories',   icon: Tags },
  { to: '/orders',         label: 'Orders',       icon: ShoppingCart },
  { to: '/restock',        label: 'Restock Queue',icon: RefreshCw },
];

const Sidebar = ({ collapsed, onToggle }) => {
  const { signOutUser } = useAuth();
  const { stats } = useAppContext();
  const location = useLocation();

  const handleLogout = async () => {
    try { await signOutUser(); } catch {}
  };

  return (
    <aside
      style={{
        width: collapsed ? 'var(--sidebar-w-collapsed)' : 'var(--sidebar-w)',
        minHeight: '100vh',
        background: '#0a0f1e',
        borderRight: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* ── Logo ─────────────────────────────────────────── */}
      <div style={{
        height: 'var(--header-h)',
        display: 'flex',
        alignItems: 'center',
        padding: collapsed ? '0 0 0 18px' : '0 16px',
        borderBottom: '1px solid var(--border-light)',
        gap: 10,
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'linear-gradient(135deg, var(--primary), #818cf8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 0 12px rgba(99,102,241,0.4)',
        }}>
          <Boxes size={18} color="#fff" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div style={{ animation: 'fadeIn 0.2s ease' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              StockFlow
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: -1, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Inventory Suite
            </div>
          </div>
        )}
      </div>

      {/* ── Nav items ────────────────────────────────────── */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          const showBadge = label === 'Restock Queue' && stats?.lowStockCount > 0;

          return (
            <NavLink
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: collapsed ? '10px 0' : '10px 12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 8,
                marginBottom: 4,
                transition: 'all 0.15s ease',
                background: isActive ? 'var(--primary-glow)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.88rem',
                textDecoration: 'none',
                position: 'relative',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                borderLeft: isActive && !collapsed ? '2px solid var(--primary)' : '2px solid transparent',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = 'var(--text)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} style={{ flexShrink: 0 }} />
              {!collapsed && <span style={{ flex: 1 }}>{label}</span>}
              {!collapsed && showBadge && (
                <span style={{
                  background: 'var(--warning)',
                  color: '#000',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: 999,
                  minWidth: 18,
                  textAlign: 'center',
                }}>
                  {stats.lowStockCount}
                </span>
              )}
              {collapsed && showBadge && (
                <span style={{
                  position: 'absolute',
                  top: 6, right: 6,
                  width: 8, height: 8,
                  background: 'var(--warning)',
                  borderRadius: '50%',
                }} />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ── Footer: Collapse toggle + Logout ─────────────── */}
      <div style={{ padding: '8px', borderTop: '1px solid var(--border-light)', flexShrink: 0 }}>
        <button
          onClick={handleLogout}
          title="Logout"
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: collapsed ? '10px 0' : '10px 12px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            width: '100%', border: 'none',
            background: 'transparent',
            color: 'var(--text-muted)', borderRadius: 8,
            fontSize: '0.88rem', transition: 'all 0.15s',
            cursor: 'pointer', whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
            e.currentTarget.style.color = 'var(--danger)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          <LogOut size={18} strokeWidth={2} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* ── Collapse toggle button ─────────────────────── */}
      <button
        onClick={onToggle}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        style={{
          position: 'absolute',
          bottom: 80,
          right: collapsed ? '50%' : 12,
          transform: collapsed ? 'translateX(50%)' : 'none',
          width: 24, height: 24,
          borderRadius: '50%',
          background: 'var(--bg-surface2)',
          border: '1px solid var(--border-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)', cursor: 'pointer',
          transition: 'all 0.2s ease',
          zIndex: 20,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-surface3)'; e.currentTarget.style.color = 'var(--text)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-surface2)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
      >
        {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>
    </aside>
  );
};

export default Sidebar;
