import { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 500 }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}>
      <div 
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease',
        }} 
      />
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: maxWidth,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>{title}</h3>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent', border: 'none',
              color: 'var(--text-muted)', cursor: 'pointer',
              padding: 4, borderRadius: 6, transition: 'all 0.15s',
            }}
          >
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: 20 }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
