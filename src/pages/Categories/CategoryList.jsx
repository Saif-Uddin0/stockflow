import { useState } from 'react';
import { Package, Plus, Search, Tag, MoreVertical } from 'lucide-react';
import useAppContext from '../../hooks/useAppContext';
import AddCategoryModal from '../../components/categories/AddCategoryModal';

const CategoryList = () => {
  const { categories, loading } = useAppContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 140, borderRadius: 'var(--radius)' }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeIn 0.3s ease' }}>
      {/* ── Toolbar ───────────────────────────────────────── */}
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        gap: 16, flexWrap: 'wrap' 
      }}>
        <div style={{ position: 'relative', width: 300, minWidth: 200 }}>
          <Search size={16} color="var(--text-faint)" style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)'
          }} />
          <input 
            type="text" 
            placeholder="Search categories..." 
            className="form-input" 
            style={{ paddingLeft: 38 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus size={18} /> Create Category
        </button>
      </div>

      {/* ── Grid ──────────────────────────────────────────── */}
      {filteredCategories.length === 0 ? (
        <div style={{ 
          padding: 64, textAlign: 'center', border: '2px dashed var(--border-light)', 
          borderRadius: 'var(--radius-lg)', color: 'var(--text-faint)' 
        }}>
          <Tag size={48} strokeWidth={1} style={{ marginBottom: 16, opacity: 0.5 }} />
          <p>No categories found.</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: 20 
        }}>
          {filteredCategories.map(c => (
            <div key={c.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '20px 20px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ 
                    width: 44, height: 44, borderRadius: 12, 
                    background: 'var(--bg-surface2)', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' 
                  }}>
                    <Tag size={20} strokeWidth={2.5} />
                  </div>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', padding: 4 }}>
                    <MoreVertical size={16} />
                  </button>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 6px', color: 'var(--text)' }}>{c.name}</h3>
                <p style={{ 
                  fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, 
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', 
                  overflow: 'hidden', height: '2.5rem', lineHeight: 1.5
                }}>
                  {c.description || 'No description provided.'}
                </p>
              </div>
              <div style={{ 
                padding: '12px 20px', background: 'rgba(255,255,255,0.02)', 
                borderTop: '1px solid var(--border-light)', display: 'flex', 
                alignItems: 'center', gap: 6, color: 'var(--text-muted)' 
              }}>
                <Package size={14} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{c.productCount} Products</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add Category Modal ────────────────────────────── */}
      <AddCategoryModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
};

export default CategoryList;