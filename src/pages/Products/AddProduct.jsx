import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router';
import { 
  Package, DollarSign, Layers, AlertCircle, 
  ChevronLeft, Save, Hash 
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAppContext from '../../hooks/useAppContext';

const AddProduct = () => {
  const { categories, addProduct } = useAppContext();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { stock: 0, minThreshold: 5 }
  });

  const onSubmit = async (data) => {
    try {
      const selectedCat = categories.find(c => c.id === data.category);
      const newProduct = {
        ...data,
        categoryName: selectedCat ? selectedCat.name : 'Unknown',
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        minThreshold: parseInt(data.minThreshold),
        status: parseInt(data.stock) > 0 ? 'active' : 'out_of_stock'
      };
      await addProduct(newProduct);
      toast.success('Product added successfully!');
      navigate('/products');
    } catch (err) {
      toast.error('Failed to add product.');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link to="/products" className="btn btn-ghost btn-sm" style={{ padding: 8 }}>
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Add New Product</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>Complete all fields to add a new item.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card">
              <h4 style={{ marginBottom: 16, fontSize: '0.8rem', color: 'var(--text-faint)', textTransform: 'uppercase' }}>Basic Information</h4>
              <div style={{ marginBottom: 16 }}>
                <label className="form-label">Product Name</label>
                <input type="text" placeholder="e.g. Wireless Mouse" className={`form-input${errors.name ? ' error' : ''}`} {...register('name', { required: 'Name is required' })} />
                {errors.name && <p className="form-error"><AlertCircle size={12} />{errors.name.message}</p>}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label className="form-label">Category</label>
                <select className={`form-input${errors.category ? ' error' : ''}`} {...register('category', { required: 'Please select a category' })}>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.category && <p className="form-error"><AlertCircle size={12} />{errors.category.message}</p>}
              </div>
              <div>
                <label className="form-label">Unit Price ($)</label>
                <input type="number" step="0.01" className={`form-input${errors.price ? ' error' : ''}`} {...register('price', { required: 'Price is required', min: { value: 0.01, message: 'Must be > 0' } })} />
                {errors.price && <p className="form-error"><AlertCircle size={12} />{errors.price.message}</p>}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card">
              <h4 style={{ marginBottom: 16, fontSize: '0.8rem', color: 'var(--text-faint)', textTransform: 'uppercase' }}>Inventory Levels</h4>
              <div style={{ marginBottom: 16 }}>
                <label className="form-label">Initial Stock</label>
                <input type="number" className="form-input" {...register('stock', { min: 0 })} />
              </div>
              <div>
                <label className="form-label">Min. Threshold</label>
                <input type="number" className="form-input" {...register('minThreshold', { min: 1 })} />
              </div>
            </div>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg" style={{ width: '100%', gap: 10 }}>
              <Save size={20} /> {isSubmitting ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;