import { useState, useEffect } from 'react';
import { AppContext } from './AppContext';

const AppProvider = ({ children }) => {
  const [products, setProducts]         = useState([]);
  const [categories, setCategories]     = useState([]);
  const [orders, setOrders]             = useState([]);
  const [restockQueue, setRestockQueue] = useState([]);
  const [activityLog, setActivityLog]   = useState([]);
  const [loading, setLoading]           = useState(true);

  // ── Load all JSON data from public/data/ on mount ──────────
  useEffect(() => {
    const load = async () => {
      try {
        const [p, c, o, rq, al] = await Promise.all([
          fetch('/data/products.json').then(r => r.json()),
          fetch('/data/categories.json').then(r => r.json()),
          fetch('/data/orders.json').then(r => r.json()),
          fetch('/data/restock-queue.json').then(r => r.json()),
          fetch('/data/activity-log.json').then(r => r.json()),
        ]);
        setProducts(p);
        setCategories(c);
        setOrders(o);
        setRestockQueue(rq);
        setActivityLog(al.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } catch (err) {
        console.error('Failed to load demo data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Activity log helper ────────────────────────────────────
  const addLog = (message, type = 'system') => {
    const entry = {
      id: `log-${Date.now()}`,
      message,
      type,
      timestamp: new Date().toISOString(),
    };
    setActivityLog(prev => [entry, ...prev]);
  };

  // ── Product helpers ────────────────────────────────────────
  const addProduct = (product) => {
    const newProduct = { ...product, id: `prod-${Date.now()}`, createdAt: new Date().toISOString() };
    setProducts(prev => [newProduct, ...prev]);
    addLog(`New product "${product.name}" added`, 'product');
    // auto-add to restock queue if below threshold
    if (product.stock < product.minThreshold) {
      addToRestockQueue(newProduct);
    }
    return newProduct;
  };

  const updateProductStock = (productId, newStock) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      const updated = {
        ...p,
        stock: newStock,
        status: newStock === 0 ? 'out_of_stock' : 'active',
      };
      addLog(`Stock updated for "${p.name}" → ${newStock} units`, 'stock');
      // remove from restock queue if stock now above threshold
      if (newStock >= p.minThreshold) {
        setRestockQueue(prev => prev.filter(r => r.productId !== productId));
      }
      return updated;
    }));
  };

  // ── Category helpers ───────────────────────────────────────
  const addCategory = (category) => {
    const newCat = { ...category, id: `cat-${Date.now()}`, productCount: 0, createdAt: new Date().toISOString() };
    setCategories(prev => [newCat, ...prev]);
    addLog(`Category "${category.name}" created`, 'category');
    return newCat;
  };

  // ── Order helpers ──────────────────────────────────────────
  const addOrder = (orderData) => {
    const id = `ord-${1000 + orders.length + 1}`;
    const newOrder = { ...orderData, id, status: 'pending', createdAt: new Date().toISOString() };

    // deduct stock for each item
    orderData.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        const newStock = Math.max(0, product.stock - item.qty);
        updateProductStock(item.productId, newStock);
        if (newStock < product.minThreshold) {
          addToRestockQueue({ ...product, stock: newStock });
        }
      }
    });

    setOrders(prev => [newOrder, ...prev]);
    addLog(`Order #${id} created`, 'order');
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      addLog(`Order #${orderId} marked as ${newStatus}`, 'order');
      return { ...o, status: newStatus };
    }));
  };

  const cancelOrder = (orderId) => updateOrderStatus(orderId, 'cancelled');

  // ── Restock helpers ────────────────────────────────────────
  const addToRestockQueue = (product) => {
    setRestockQueue(prev => {
      if (prev.find(r => r.productId === product.id)) return prev;
      const deficit = product.minThreshold - product.stock;
      const priority = product.stock === 0 ? 'high' : deficit >= 5 ? 'high' : deficit >= 3 ? 'medium' : 'low';
      const entry = {
        id: `rq-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        categoryName: product.categoryName,
        currentStock: product.stock,
        minThreshold: product.minThreshold,
        priority,
        addedAt: new Date().toISOString(),
      };
      addLog(`"${product.name}" added to Restock Queue`, 'restock');
      return [entry, ...prev].sort((a, b) => a.currentStock - b.currentStock);
    });
  };

  const restockProduct = (productId, qty) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    updateProductStock(productId, product.stock + qty);
    setRestockQueue(prev => prev.filter(r => r.productId !== productId));
    addLog(`"${product.name}" restocked (+${qty} units)`, 'stock');
  };

  const removeFromRestockQueue = (queueId) => {
    setRestockQueue(prev => prev.filter(r => r.id !== queueId));
  };

  // ── Derived stats ──────────────────────────────────────────
  const today = new Date().toDateString();
  const todaysOrders   = orders.filter(o => new Date(o.createdAt).toDateString() === today);
  const pendingOrders  = orders.filter(o => o.status === 'pending');
  const lowStockCount  = products.filter(p => p.stock < p.minThreshold).length;
  const revenueToday   = todaysOrders.reduce((s, o) => s + o.totalPrice, 0);

  const stats = {
    totalOrdersToday: todaysOrders.length,
    pendingOrders: pendingOrders.length,
    lowStockCount,
    revenueToday,
  };

  const value = {
    // state
    products, categories, orders, restockQueue, activityLog, loading, stats,
    // actions
    addProduct, updateProductStock, addCategory,
    addOrder, updateOrderStatus, cancelOrder,
    restockProduct, removeFromRestockQueue, addLog,
  };

  return <AppContext value={value}>{children}</AppContext>;
};

export default AppProvider;
