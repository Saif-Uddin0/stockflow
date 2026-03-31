import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, Mail, Lock, Zap, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

const DEMO_EMAIL    = 'demo@stockflow.com';
const DEMO_PASSWORD = 'demo1234';

const Login = () => {
  const { signInUser } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [fireErr,  setFireErr]  = useState('');

  const {
    register, handleSubmit, setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ email, password }) => {
    setFireErr('');
    setLoading(true);
    try {
      await signInUser(email, password);
      toast.success('Welcome back! 👋');
      navigate('/');
    } catch (err) {
      const msg =
        err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found'
          ? 'Invalid email or password.'
          : err.code === 'auth/too-many-requests'
          ? 'Too many attempts. Please try again later.'
          : 'Sign-in failed. Please try again.';
      setFireErr(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setValue('email', DEMO_EMAIL);
    setValue('password', DEMO_PASSWORD);
    toast('Demo credentials pre-filled — click Sign In!', { icon: '⚡' });
  };

  return (
    <>
      <div style={{ marginBottom: 28, textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 6 }}>Welcome back</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Sign in to your StockFlow account
        </p>
      </div>

      {/* Demo Login Banner */}
      <button
        type="button"
        onClick={handleDemoLogin}
        style={{
          width: '100%',
          padding: '11px 16px',
          marginBottom: 20,
          border: '1px solid rgba(99,102,241,0.4)',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(99,102,241,0.08)',
          color: 'var(--primary)',
          fontSize: '0.875rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(99,102,241,0.15)';
          e.currentTarget.style.borderColor = 'rgba(99,102,241,0.7)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(99,102,241,0.08)';
          e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
        }}
      >
        <Zap size={15} strokeWidth={2.5} />
        Try Demo Login
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: 'var(--border-light)' }} />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>or sign in with email</span>
        <div style={{ flex: 1, height: 1, background: 'var(--border-light)' }} />
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
              placeholder="••••••••"
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
              Signing in...
            </>
          ) : 'Sign In'}
        </button>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </form>

      <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Don't have an account?{' '}
        <Link to="/auth/signup" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
          Create one
        </Link>
      </p>
    </>
  );
};

export default Login;