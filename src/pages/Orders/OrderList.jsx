import { useState } from 'react';
import { 
  ShoppingBag, Search, Filter, Clock, 
  CheckCircle2, Truck, MoreVertical, ExternalLink 
} from 'lucide-react';
import { Link } from 'react-router';
import useAppContext from '../../hooks/useAppContext';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

const statusConfig = {
  pending:   { bg: 'badge-warning', icon: Clock, label: 'Pending' },
  confirmed: { bg: 'badge-primary', icon: CheckCircle2, label: 'Confirmed' },
  shipped:   { bg: 'badge-info', icon: Truck, label: 'Shipped' },
  delivered: { bg: 'badge-success', icon: CheckCircle2, label: 'Delivered' }
};

const OrderList = () => {
  const { orders, updateOrderStatus, loading } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order marked as ${newStatus}`);
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 80, borderRadius: 'var(--radius)' }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 12, flex: 1, minWidth: 280 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="var(--text-faint)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Search by customer..." className="form-input" style={{ paddingLeft: 38 }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <select className="form-input" style={{ width: 140 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
        <Link to="/create-order" className="btn btn-primary"><ShoppingBag size={18} /> New Order</Link>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-light)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-faint)' }}>
              <tr>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>Order ID</th>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>Customer</th>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>Items</th>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>Total Price</th>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: 60, textAlign: 'center', color: 'var(--text-faint)' }}>No orders found.</td></tr>
              ) : filteredOrders.map(order => {
                const cfg = statusConfig[order.status] || statusConfig.pending;
                const Icon = cfg.icon;
                return (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.1s' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--primary)' }}>#{order.id.slice(0, 8)}</span>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-faint)', margin: '2px 0 0' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '0.9rem', fontWeight: 500 }}>{order.customerName}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.85rem' }}>{order.items.length} Product{order.items.length > 1 ? 's' : ''}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>{order.items.map(i => i.productName).join(', ').slice(0, 20)}...</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: 700, fontSize: '0.95rem' }}>${order.totalPrice.toLocaleString()}</td>
                    <td style={{ padding: '16px 20px' }}><span className={`badge ${cfg.bg}`} style={{ gap: 5 }}><Icon size={12} /> {cfg.label}</span></td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        style={{ background: 'var(--bg-surface2)', border: 'none', color: 'var(--text-muted)', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}
                      >
                        View <ExternalLink size={13} style={{ marginLeft: 4 }} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Order Details Modal ───────────────────────────── */}
      <Modal 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        title={`Order Details: #${selectedOrder?.id?.slice(0, 8)}`}
        maxWidth={600}
      >
        {selectedOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: 4 }}>Customer Name</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{selectedOrder.customerName}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: 4 }}>Status</p>
                <span className={`badge ${statusConfig[selectedOrder.status]?.bg || 'badge-warning'}`}>
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            <div className="divider" style={{ margin: '8px 0' }} />

            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 12, color: 'var(--text-muted)' }}>Items Summary</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: 8 }}>
                    <div>
                      <p style={{ fontSize: '0.9rem', fontWeight: 500, margin: 0 }}>{item.productName}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', margin: 0 }}>Quantity: {item.qty} × ${item.price}</p>
                    </div>
                    <p style={{ fontWeight: 600 }}>${(item.qty * item.price).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '14px 18px', background: 'var(--bg-surface2)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Total Amount</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>${selectedOrder.totalPrice.toLocaleString()}</span>
            </div>

            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 12, color: 'var(--text-muted)' }}>Update Status</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {Object.keys(statusConfig).map(status => (
                  <button 
                    key={status}
                    onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                    disabled={selectedOrder.status === status}
                    className={`btn btn-sm ${selectedOrder.status === status ? 'btn-ghost' : 'btn-primary'}`}
                    style={{ fontSize: '0.75rem', opacity: selectedOrder.status === status ? 0.5 : 1 }}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
                <button 
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                  disabled={selectedOrder.status === 'cancelled'}
                  className="btn btn-sm btn-danger"
                  style={{ fontSize: '0.75rem' }}
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderList;