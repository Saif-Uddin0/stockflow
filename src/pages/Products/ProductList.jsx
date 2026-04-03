import { useState } from 'react';
import { 
  Plus, Search, Filter, Package, AlertCircle, 
  ArrowUpRight, MoreVertical, Layers 
} from 'lucide-react';
import { Link } from 'react-router';
import useAppContext from '../../hooks/useAppContext';
import Modal from '../../components/ui/Modal';

const ProductList = () => {
  const { products, categories, loading } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 180, borderRadius: 'var(--radius)' }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 12, flex: 1, minWidth: 300 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="var(--text-faint)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Search products..." className="form-input" style={{ paddingLeft: 38 }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <select className="form-input" style={{ width: 160 }} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="form-input" style={{ width: 140 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Status</option>
            <option value="active">Active</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
        <Link to="/add-product" className="btn btn-primary">
          <Plus size={18} /> Add Product
        </Link>
      </div>

      {filteredProducts.length === 0 ? (
        <div style={{ padding: 64, textAlign: 'center', border: '2px dashed var(--border-light)', borderRadius: 'var(--radius-lg)', color: 'var(--text-faint)' }}>
          <Package size={48} strokeWidth={1} style={{ marginBottom: 16, opacity: 0.5 }} />
          <p>No products found tracking your filters.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {filteredProducts.map(p => {
            const isLow = p.stock > 0 && p.stock < p.minThreshold;
            const isOOS = p.stock === 0;
            return (
              <div key={p.id} className="card" style={{ padding: 0, position: 'relative' }}>
                <div style={{ height: 4, background: isOOS ? 'var(--danger)' : isLow ? 'var(--warning)' : 'var(--success)' }} />
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ padding: 10, borderRadius: 10, background: 'var(--bg-surface2)', color: 'var(--primary)' }}><Package size={20} /></div>
                    <span className={`badge ${isOOS ? 'badge-danger' : isLow ? 'badge-warning' : 'badge-success'}`}>
                      {isOOS ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', margin: '0 0 4px', color: 'var(--text)' }}>{p.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-faint)', fontSize: '0.85rem', marginBottom: 16 }}>
                    <Layers size={14} /> {p.categoryName}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
                    <div>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-faint)', margin: 0, textTransform: 'uppercase' }}>Price</p>
                      <p style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>${p.price}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-faint)', margin: 0, textTransform: 'uppercase' }}>Stock</p>
                      <p style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: isOOS ? 'var(--danger)' : isLow ? 'var(--warning)' : 'var(--text)' }}>{p.stock} units</p>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>Min: {p.minThreshold}</span>
                  <button onClick={() => setSelectedProduct(p)} className="btn btn-ghost btn-sm">Details <ArrowUpRight size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Product Details Modal ─────────────────────────── */}
      <Modal 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        title="Product Information"
      >
        {selectedProduct && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: 4 }}>Full Name</p>
              <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedProduct.name}</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: 4 }}>Category</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
                  <Layers size={14} /> {selectedProduct.categoryName}
                </div>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: 4 }}>Current Status</p>
                <span className={`badge ${selectedProduct.stock === 0 ? 'badge-danger' : 'badge-success'}`}>
                  {selectedProduct.stock === 0 ? 'Out of Stock' : 'Active'}
                </span>
              </div>
            </div>

            <div style={{ padding: '16px 20px', background: 'var(--bg-surface2)', borderRadius: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: 4 }}>Price</p>
                <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>${selectedProduct.price}</p>
              </div>
              <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-light)', borderRight: '1px solid var(--border-light)' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: 4 }}>Stock</p>
                <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{selectedProduct.stock}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: 4 }}>Threshold</p>
                <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{selectedProduct.minThreshold}</p>
              </div>
            </div>

            {selectedProduct.stock < selectedProduct.minThreshold && (
              <div style={{ padding: '12px 16px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <AlertCircle size={16} color="var(--warning)" />
                <p style={{ fontSize: '0.85rem', color: 'var(--warning)', margin: 0, fontWeight: 500 }}>
                  Warning: Stock is below minimum threshold.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="btn btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductList;