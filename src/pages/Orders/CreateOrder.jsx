import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router';
import { 
  ShoppingBag, Search, Plus, Minus, Trash2, 
  ChevronLeft, AlertCircle, CheckCircle2, User, 
  Package
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAppContext from '../../hooks/useAppContext';

const CreateOrder = () => {
  const { products, addOrder } = useAppContext();
  const navigate = useNavigate();
  
  const [customerName, setCustomerName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
      p.status === 'active'
    ).slice(0, 5);
  }, [searchTerm, products]);

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const addToCart = (product) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      if (existing.qty >= product.stock) {
        toast.error(`Only ${product.stock} units available.`);
        return;
      }
      setCart(cart.map(item => item.productId === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      if (product.stock <= 0) {
        toast.error('Out of stock.');
        return;
      }
      setCart([...cart, { productId: product.id, productName: product.name, price: product.price, qty: 1, stock: product.stock }]);
    }
    setSearchTerm('');
  };

  const updateQty = (productId, delta) => {
    setCart(cart.map(item => {
      if (item.productId === productId) {
        const newQty = item.qty + delta;
        if (newQty <= 0) return item;
        if (newQty > item.stock) return item;
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const handlePlaceOrder = async () => {
    if (!customerName.trim() || cart.length === 0) {
      toast.error('Check customer name and cart.');
      return;
    }
    try {
      await addOrder({ customerName, items: cart, totalPrice, status: 'pending' });
      toast.success('Order placed!');
      navigate('/orders');
    } catch (err) {
      toast.error('Failed to place order.');
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link to="/orders" className="btn btn-ghost btn-sm"><ChevronLeft size={20} /></Link>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Create Order</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Add items to current order.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <h4 className="form-label">Customer Details</h4>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
              <input type="text" placeholder="Customer Name" className="form-input" style={{ paddingLeft: 38 }} value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            </div>
          </div>

          <div className="card">
            <h4 className="form-label">Add Products</h4>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
              <input type="text" placeholder="Search products..." className="form-input" style={{ paddingLeft: 38 }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              {searchResults.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, background: 'var(--bg-surface2)', border: '1px solid var(--border-light)', borderRadius: 8, marginTop: 8 }}>
                  {searchResults.map(p => (
                    <div key={p.id} onClick={() => addToCart(p)} style={{ padding: '10px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <span>{p.name}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-faint)' }}>${p.price} • {p.stock} in stock</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length === 0 ? <p style={{ textAlign: 'center', padding: 40, color: 'var(--text-faint)' }}>Empty cart.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {cart.map(item => (
                  <div key={item.productId} className="card" style={{ display: 'flex', justifyContent: 'space-between', padding: 12, background: 'rgba(255,255,255,0.02)' }}>
                    <div>
                      <p style={{ fontWeight: 600, margin: 0 }}>{item.productName}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', margin: 0 }}>${item.price} each</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <button onClick={() => updateQty(item.productId, -1)} className="btn btn-ghost btn-sm" style={{ padding: 4 }}><Minus size={14} /></button>
                      <span style={{ fontWeight: 700 }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.productId, 1)} className="btn btn-ghost btn-sm" style={{ padding: 4 }}><Plus size={14} /></button>
                      <button onClick={() => removeFromCart(item.productId)} style={{ color: 'var(--danger)', background: 'transparent', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card" style={{ background: 'var(--primary)', color: '#fff' }}>
          <h4 style={{ opacity: 0.8, textTransform: 'uppercase', fontSize: '0.8rem' }}>Order Summary</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
            <span>Total Items</span>
            <span style={{ fontWeight: 700 }}>{totalItems}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, alignItems: 'flex-end' }}>
            <span>Total Amount</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>${totalPrice.toLocaleString()}</span>
          </div>
          <button onClick={handlePlaceOrder} disabled={cart.length === 0} style={{ width: '100%', marginTop: 24, padding: 14, borderRadius: 8, border: 'none', background: '#fff', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>Confirm Order</button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;