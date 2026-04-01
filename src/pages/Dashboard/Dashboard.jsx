import useAppContext from '../../hooks/useAppContext';
import {
  ShoppingCart, Package, AlertTriangle, DollarSign,
  TrendingUp, Clock, ArrowUpRight,
} from 'lucide-react';

const statusColors = {
  order: { bg: 'rgba(99,102,241,0.12)', color: '#818cf8' },
  stock: { bg: 'rgba(16,185,129,0.12)', color: '#34d399' },
  restock: { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24' },
  product: { bg: 'rgba(56,189,248,0.12)', color: '#38bdf8' },
  category: { bg: 'rgba(167,139,250,0.12)', color: '#a78bfa' },
  system: { bg: 'rgba(148,163,184,0.1)', color: '#94a3b8' },
};

const StatCard = ({ icon: Icon, label, value, sub, color, glow }) => (
  <div style={{
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius)',
    padding: '20px 22px',
    display: 'flex', alignItems: 'flex-start', gap: 16,
    transition: 'transform 0.15s, box-shadow 0.15s',
    cursor: 'default',
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
  >
    <div style={{
      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
      background: color,
      boxShadow: glow,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon size={20} color="#fff" strokeWidth={2} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>{label}</p>
      <p style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text)', margin: '2px 0 2px', lineHeight: 1.2 }}>{value}</p>
      {sub && <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', margin: 0 }}>{sub}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  const { stats, products, orders, activityLog, loading } = useAppContext();

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 96, borderRadius: 'var(--radius)' }} />
        ))}
      </div>
    );
  }

  const lowStockProducts = products.filter(p => p.stock < p.minThreshold);
  const recentLogs = activityLog.slice(0, 8);

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    return isToday ? `Today, ${formatTime(iso)}` : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ` · ${formatTime(iso)}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeIn 0.3s ease' }}>

      {/* ── Stat Cards ─────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        <StatCard
          icon={ShoppingCart} label="Orders Today"
          value={stats.totalOrdersToday}
          sub={`${stats.pendingOrders} pending`}
          color="linear-gradient(135deg,#6366f1,#818cf8)"
          glow="0 4px 12px rgba(99,102,241,0.35)"
        />
        <StatCard
          icon={TrendingUp} label="Pending Orders"
          value={stats.pendingOrders}
          sub="Awaiting confirmation"
          color="linear-gradient(135deg,#f59e0b,#fbbf24)"
          glow="0 4px 12px rgba(245,158,11,0.35)"
        />
        <StatCard
          icon={AlertTriangle} label="Low Stock Items"
          value={stats.lowStockCount}
          sub="Below minimum threshold"
          color="linear-gradient(135deg,#ef4444,#f87171)"
          glow="0 4px 12px rgba(239,68,68,0.35)"
        />
        <StatCard
          icon={DollarSign} label="Revenue Today"
          value={`$${stats.revenueToday.toLocaleString()}`}
          sub="From confirmed orders"
          color="linear-gradient(135deg,#10b981,#34d399)"
          glow="0 4px 12px rgba(16,185,129,0.35)"
        />
      </div>

      {/* ── Bottom two-column layout ────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Product Summary */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Package size={16} color="var(--text-muted)" />
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>Product Summary</h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>{products.length} total</span>
          </div>
          <div style={{ padding: '8px 0', maxHeight: 320, overflowY: 'auto' }}>
            {products.slice(0, 8).map(p => {
              const isLow = p.stock < p.minThreshold;
              const isOOS = p.stock === 0;
              return (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 20px', gap: 12,
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                  transition: 'background 0.1s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.name}
                    </p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-faint)', margin: 0 }}>{p.categoryName}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: '0.78rem', color: isOOS ? 'var(--danger)' : isLow ? 'var(--warning)' : 'var(--text-muted)' }}>
                      {isOOS ? 'Out of stock' : `${p.stock} left`}
                    </span>
                    <span className={`badge ${isOOS ? 'badge-danger' : isLow ? 'badge-warning' : 'badge-success'}`}>
                      {isOOS ? 'OOS' : isLow ? 'Low' : 'OK'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Log */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={16} color="var(--text-muted)" />
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>Activity Log</h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>Recent actions</span>
          </div>
          <div style={{ padding: '8px 0', maxHeight: 320, overflowY: 'auto' }}>
            {recentLogs.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-faint)', fontSize: '0.85rem', padding: '32px 20px' }}>No activity yet</p>
            ) : recentLogs.map(log => {
              const c = statusColors[log.type] || statusColors.system;
              return (
                <div key={log.id} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '10px 20px',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                  transition: 'background 0.1s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: c.color, marginTop: 5,
                    boxShadow: `0 0 6px ${c.color}`,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.83rem', color: 'var(--text)', margin: 0, lineHeight: 1.4 }}>{log.message}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-faint)', margin: '2px 0 0' }}>{formatDate(log.timestamp)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Low Stock Alert strip */}
      {lowStockProducts.length > 0 && (
        <div style={{
          background: 'rgba(245,158,11,0.06)',
          border: '1px solid rgba(245,158,11,0.25)',
          borderRadius: 'var(--radius)',
          padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertTriangle size={16} color="var(--warning)" />
            <span style={{ fontSize: '0.875rem', color: 'var(--warning)', fontWeight: 500 }}>
              {lowStockProducts.length} product{lowStockProducts.length > 1 ? 's are' : ' is'} running low on stock
            </span>
          </div>
          <a href="/restock" style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: '0.8rem', color: 'var(--warning)', fontWeight: 600, textDecoration: 'none',
          }}>
            View Restock Queue <ArrowUpRight size={13} />
          </a>
        </div>
      )}
    </div>
  );
};

export default Dashboard;