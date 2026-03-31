import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

/* Google SVG icon */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
    <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
  </svg>
);

const Signup = () => {
  const { registerUser, googleSignIn, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [fireErr,  setFireErr]  = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm();

  /* ── Email / Password signup ──────────────────────────── */
  const onSubmit = async ({ name, email, password }) => {
    setFireErr('');
    setLoading(true);
    try {
      const result = await registerUser(email, password);
      // Save display name immediately after account creation
      await updateUserProfile(name);
      toast.success('Account created! Welcome to StockFlow 🎉');
      navigate('/');
    } catch (err) {
      const msg =
        err.code === 'auth/email-already-in-use' ? 'This email is already registered.' :
        err.code === 'auth/weak-password'         ? 'Password should be at least 6 characters.' :
                                                    'Signup failed. Please try again.';
      setFireErr(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Google signup ────────────────────────────────────── */
  const handleGoogleSignup = async () => {
    setFireErr('');
    setGLoading(true);
    try {
      await googleSignIn();
      toast.success('Signed in with Google! 🎉');
      navigate('/');
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setFireErr('Google sign-in failed. Please try again.');
      }
    } finally {
      setGLoading(false);
    }
  };

  return (
    <>
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 6 }}>Create account</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Start managing your inventory today
        </p>
      </div>

      {/* Google sign-in */}
      <button
        type="button"
        onClick={handleGoogleSignup}
        disabled={gLoading}
        style={{
          width: '100%', padding: '11px 16px', marginBottom: 16,
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-surface2)',
          color: 'var(--text)', fontSize: '0.875rem', fontWeight: 500,
          cursor: gLoading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          transition: 'all 0.15s ease',
          opacity: gLoading ? 0.6 : 1,
        }}
        onMouseEnter={e => { if (!gLoading) e.currentTarget.style.background = 'var(--bg-surface3)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-surface2)'; }}
      >
        {gLoading ? (
          <span style={{
            width: 16, height: 16, borderRadius: '50%',
            border: '2px solid var(--border-light)', borderTopColor: 'var(--primary)',
            animation: 'spin 0.7s linear infinite', display: 'inline-block',
          }} />
        ) : <GoogleIcon />}
        {gLoading ? 'Signing up...' : 'Continue with Google'}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: 'var(--border-light)' }} />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>or sign up with email</span>
        <div style={{ flex: 1, height: 1, background: 'var(--border-light)' }} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {fireErr && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 'var(--radius-sm)', padding: '10px 12px',
            marginBottom: 16, color: 'var(--danger)', fontSize: '0.85rem',
          }}>
            <AlertCircle size={15} />{fireErr}
          </div>
        )}

        {/* Full name */}
        <div style={{ marginBottom: 14 }}>
          <label className="form-label">Full name</label>
          <div style={{ position: 'relative' }}>
            <User size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none' }} />
            <input
              type="text" placeholder="John Doe"
              className={`form-input${errors.name ? ' error' : ''}`}
              style={{ paddingLeft: 36 }}
              {...register('name', { required: 'Full name is required' })}
            />
          </div>
          {errors.name && <p className="form-error"><AlertCircle size={11} />{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div style={{ marginBottom: 14 }}>
          <label className="form-label">Email address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none' }} />
            <input
              type="email" placeholder="you@example.com"
              className={`form-input${errors.email ? ' error' : ''}`}
              style={{ paddingLeft: 36 }}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Enter a valid email' },
              })}
            />
          </div>
          {errors.email && <p className="form-error"><AlertCircle size={11} />{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div style={{ marginBottom: 22 }}>
          <label className="form-label">Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none' }} />
            <input
              type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters"
              className={`form-input${errors.password ? ' error' : ''}`}
              style={{ paddingLeft: 36, paddingRight: 40 }}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters' },
              })}
            />
            <button
              type="button" onClick={() => setShowPass(p => !p)}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', padding: 2 }}
              aria-label={showPass ? 'Hide password' : 'Show password'}
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && <p className="form-error"><AlertCircle size={11} />{errors.password.message}</p>}
        </div>

        <button
          type="submit" disabled={loading}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          {loading ? (
            <><span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />Creating account...</>
          ) : 'Create Account'}
        </button>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </form>

      <p style={{ textAlign: 'center', marginTop: 18, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Already have an account?{' '}
        <Link to="/auth/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
      </p>
    </>
  );
};

export default Signup;