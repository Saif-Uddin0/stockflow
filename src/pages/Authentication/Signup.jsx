import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

const Signup = () => {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [fireErr,  setFireErr]  = useState('');

  const {
    register, handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ name, email, password }) => {
    setFireErr('');
    setLoading(true);
    try {
      await registerUser(email, password);
      toast.success('Account created! Welcome to StockFlow 🎉');
      navigate('/');
    } catch (err) {
      const msg =
        err.code === 'auth/email-already-in-use'
          ? 'This email is already registered.'
          : err.code === 'auth/weak-password'
          ? 'Password should be at least 6 characters.'
          : 'Signup failed. Please try again.';
      setFireErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ marginBottom: 28, textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 6 }}>Create account</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Start managing your inventory today
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Firebase error */}
        {fireErr && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 12px',
            marginBottom: 16,
            color: 'var(--danger)',
            fontSize: '0.85rem',
          }}>
            <AlertCircle size={15} />
            {fireErr}
          </div>
        )}

        {/* Full name */}
        <div style={{ marginBottom: 16 }}>
          <label className="form-label">Full name</label>
          <div style={{ position: 'relative' }}>
            <User size={15} style={{
              position: 'absolute', left: 12, top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none',
            }} />
            <input
              type="text"
              placeholder="John Doe"
              className={`form-input${errors.name ? ' error' : ''}`}
              style={{ paddingLeft: 36 }}
              {...register('name', { required: 'Full name is required' })}
            />
          </div>
          {errors.name && (
            <p className="form-error"><AlertCircle size={11} />{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div style={{ marginBottom: 16 }}>
          <label className="form-label">Email address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={15} style={{
              position: 'absolute', left: 12, top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none',
            }} />
            <input
              type="email"
              placeholder="you@example.com"
              className={`form-input${errors.email ? ' error' : ''}`}
              style={{ paddingLeft: 36 }}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Enter a valid email' },
              })}
            />
          </div>
          {errors.email && (
            <p className="form-error"><AlertCircle size={11} />{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div style={{ marginBottom: 24 }}>
          <label className="form-label">Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={15} style={{
              position: 'absolute', left: 12, top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none',
            }} />
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Min. 6 characters"
              className={`form-input${errors.password ? ' error' : ''}`}
              style={{ paddingLeft: 36, paddingRight: 40 }}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters' },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPass(p => !p)}
              style={{
                position: 'absolute', right: 10, top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent', border: 'none',
                color: 'var(--text-faint)', cursor: 'pointer', padding: 2,
              }}
              aria-label={showPass ? 'Hide password' : 'Show password'}
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && (
            <p className="form-error"><AlertCircle size={11} />{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          {loading ? (
            <>
              <span style={{
                width: 16, height: 16, borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff',
                animation: 'spin 0.7s linear infinite',
              }} />
              Creating account...
            </>
          ) : 'Create Account'}
        </button>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </form>

      <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Already have an account?{' '}
        <Link to="/auth/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
          Sign in
        </Link>
      </p>
    </>
  );
};

export default Signup;