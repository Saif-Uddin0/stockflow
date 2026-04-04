import { 
  AlertTriangle, CheckCircle2, 
  Package, RefreshCw, Layers 
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAppContext from '../../hooks/useAppContext';

const RestockQueue = () => {
  const { products, restockProduct, loading } = useAppContext();

  const restockItems = products
    .filter(p => p.stock < p.minThreshold)
    .map(p => {
      let priority = 'Low';
      let priorityColor = 'badge-info';
      const ratio = p.stock / p.minThreshold;
      if (p.stock === 0) {
        priority = 'High';
        priorityColor = 'badge-danger';
      } else if (ratio < 0.5) {
        priority = 'Medium';
        priorityColor = 'badge-warning';
      }
      return { ...p, priority, priorityColor };
    })
    .sort((a, b) => {
      const priorityMap = { High: 0, Medium: 1, Low: 2 };
      return priorityMap[a.priority] - priorityMap[b.priority];
    });

  const handleRestock = async (productId) => {
    try {
      await restockProduct(productId, 20);
      toast.success(`Restocked 20 units!`);
    } catch (err) {
      toast.error('Restock failed.');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 100, borderRadius: 'var(--radius)' }} />
        ))};
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeIn 0.3s ease' }}>
      <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius)', padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 54, height: 54, borderRadius: 16, background: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><AlertTriangle size={28} /></div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{restockItems.length} Items Require Attention</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Below threshold items are listed below.</p>
        </div>
      </div>

      {restockItems.length === 0 ? (
        <div className="card" style={{ padding: 80, textAlign: 'center' }}>
          <CheckCircle2 size={32} color="var(--success)" style={{ marginBottom: 12 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Healthy Inventory</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {restockItems.map(item => (
            <div key={item.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={20} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <h4 style={{ margin: 0 }}>{item.name}</h4>
                    <span className={`badge ${item.priorityColor}`}>{item.priority}</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', margin: '2px 0 0' }}>{item.categoryName} • Threshold: {item.minThreshold}</p>
                </div>
                <div style={{ display: 'flex', gap: 24, paddingRight: 40 }}>
                   <div style={{ textAlign: 'center' }}><p style={{ fontSize: '0.7rem', color: 'var(--text-faint)', margin: 0 }}>Stock</p><p style={{ fontWeight: 700, margin: 0 }}>{item.stock}</p></div>
                   <div style={{ textAlign: 'center' }}><p style={{ fontSize: '0.7rem', color: 'var(--text-faint)', margin: 0 }}>Short</p><p style={{ fontWeight: 700, margin: 0 }}>{item.minThreshold - item.stock}</p></div>
                </div>
              </div>
              <button onClick={() => handleRestock(item.id)} className="btn btn-primary" style={{ gap: 8 }}><RefreshCw size={16} /> Restock (+20)</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestockQueue;