import { useState, useEffect } from 'react';
import { AppContext } from './AppContext';
import useAuth from '../hooks/useAuth';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000' });

const AppProvider = ({ children }) => {
  const { user } = useAuth();

  const [products, setProducts]         = useState([]);
  const [categories, setCategories]     = useState([]);
  const [orders, setOrders]             = useState([]);
  const [restockQueue, setRestockQueue] = useState([]);
  const [activityLog, setActivityLog]   = useState([]);
  const [stats, setStats]               = useState({
    totalOrdersToday: 0,
    pendingOrders: 0,
    lowStockCount: 0,
    revenueToday: 0
  });
  const [loading, setLoading]           = useState(true);

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${user?.accessToken}` }
  });

  const fetchAllData = async () => {
    if (!user?.accessToken) return;
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const [pRes, cRes, oRes, rqRes, alRes, sRes] = await Promise.all([
        api.get('/products', headers).catch(() => ({ data: [] })),
        api.get('/categories', headers).catch(() => ({ data: [] })),
        api.get('/orders', headers).catch(() => ({ data: [] })),
        api.get('/restock-queue', headers).catch(() => ({ data: [] })),
        api.get('/activities', headers).catch(() => ({ data: [] })),
        api.get('/dashboard-stats', headers).catch(() => ({
          data: { totalOrders: 0, pendingOrders: 0, lowStockItems: 0, totalRevenue: 0 }
        })),
      ]);

      const pData = pRes.data || [];
      const cData = cRes.data || [];
      const oData = oRes.data || [];
      const rqData = rqRes.data || [];
      const alData = alRes.data || [];
      const sData = sRes.data || {};

      setProducts(pData.map(x => ({ ...x, id: x._id, stock: x.stockQuantity, minThreshold: x.minStockThreshold })));
      setCategories(cData.map(x => ({ ...x, id: x._id })));
      setOrders(oData.map(x => ({ 
        ...x, 
        id: x._id, 
        createdAt: x.date, // Backend uses 'date', frontend expects 'createdAt'
        items: (x.products || []).map(p => ({
          ...p,
          qty: p.quantity // Backend uses 'quantity', frontend uses 'qty'
        }))
      })));
      setRestockQueue(rqData.map(x => ({ ...x, id: x._id })));
      setActivityLog(alData.map(x => ({ ...x, id: x._id, type: x.action?.toLowerCase() || 'system', message: x.description })));
      
      setStats({
        totalOrdersToday: sData.totalOrders || 0,
        pendingOrders: sData.pendingOrders || 0,
        lowStockCount: sData.lowStockItems || 0,
        revenueToday: sData.totalRevenue || 0
      });
    } catch (err) {
      console.error('Failed to fetch data from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.accessToken) {
      fetchAllData();
    } else {
      setLoading(false);
    }
  }, [user?.accessToken]);

  // ── Product helpers ────────────────────────────────────────
  const addProduct = async (product) => {
    const payload = {
      name: product.name,
      categoryName: product.categoryName,
      category: product.category,
      price: product.price,
      stockQuantity: product.stock,
      minStockThreshold: product.minThreshold
    };
    await api.post('/products', payload, getAuthHeaders());
    await fetchAllData();
  };

  const updateProductStock = async (productId, newStock) => {
    await api.put(`/products/${productId}`, { stockQuantity: newStock }, getAuthHeaders());
    await fetchAllData();
  };

  // ── Category helpers ───────────────────────────────────────
  const addCategory = async (category) => {
    await api.post('/categories', category, getAuthHeaders());
    await fetchAllData();
  };

  // ── Order helpers ──────────────────────────────────────────
  const addOrder = async (orderData) => {
    const payload = {
      customerName: orderData.customerName,
      totalPrice: orderData.totalPrice,
      products: orderData.items.map(item => ({
        productId: item.productId,
        quantity: item.qty,
        price: item.price,
        productName: item.productName
      }))
    };
    await api.post('/orders', payload, getAuthHeaders());
    await fetchAllData();
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    await api.put(`/orders/${orderId}`, { status: newStatus }, getAuthHeaders());
    await fetchAllData();
  };

  const cancelOrder = async (orderId) => {
    await updateOrderStatus(orderId, 'cancelled');
  };

  // ── Restock helpers ────────────────────────────────────────
  const restockProduct = async (productId, qty) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    await updateProductStock(productId, product.stock + qty);
  };

  const removeFromRestockQueue = async (queueId) => {
    // The current backend doesn't explicitly have DELETE /restock-queue/:id
    // But stock update implicitly removes it. Let's just refetch.
    await fetchAllData();
  };

  // ── Activity Log ───────────────────────────────────────────
  const addLog = (message, type) => {
     // Activity logs are auto-generated on the backend for DB changes.
     console.log(`Log ignored in UI (handled by backend): ${message}`);
  };

  const value = {
    products, categories, orders, restockQueue, activityLog, loading, stats,
    addProduct, updateProductStock, addCategory,
    addOrder, updateOrderStatus, cancelOrder,
    restockProduct, removeFromRestockQueue, addLog,
  };

  return <AppContext value={value}>{children}</AppContext>;
};

export default AppProvider;
