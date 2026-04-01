import { useForm } from 'react-hook-form';
import { AlertCircle, Plus } from 'lucide-react';
import Modal from '../ui/Modal';
import useAppContext from '../../hooks/useAppContext';
import toast from 'react-hot-toast';

const AddCategoryModal = ({ isOpen, onClose }) => {
  const { addCategory } = useAppContext();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await addCategory(data);
      toast.success(`Category "${data.name}" created!`);
      reset();
      onClose();
    } catch (err) {
      toast.error('Failed to create category.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Category">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div style={{ marginBottom: 16 }}>
          <label className="form-label">Category Name</label>
          <input
            type="text"
            placeholder="e.g. Electronics, Furniture"
            className={`form-input${errors.name ? ' error' : ''}`}
            {...register('name', { 
              required: 'Category name is required',
              minLength: { value: 3, message: 'Minimum 3 characters' }
            })}
          />
          {errors.name && (
            <p className="form-error"><AlertCircle size={12} />{errors.name.message}</p>
          )}
        </div>
        <div style={{ marginBottom: 20 }}>
          <label className="form-label">Description (Optional)</label>
          <textarea
            placeholder="Describe what kind of products go here..."
            className="form-input"
            style={{ minHeight: 80, resize: 'vertical' }}
            {...register('description')}
          />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
          <button 
            type="button" 
            onClick={onClose} 
            className="btn btn-ghost"
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            {isSubmitting ? 'Creating...' : (
              <><Plus size={16} /> Create Category</>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCategoryModal;
