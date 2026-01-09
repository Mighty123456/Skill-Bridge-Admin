import { type FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { loginAdmin } from './authSlice';
import './LoginPage.css';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginAdmin({ email, password }));
    if (loginAdmin.fulfilled.match(result)) {
      const redirectTo = (location.state as any)?.from?.pathname ?? '/dashboard';
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <div className="sb-login-shell">
      <div className="sb-login-card">
        <div className="sb-login-header">
          <div className="sb-login-badge">
            <ShieldCheck size={32} color="var(--color-primary)" />
          </div>
          <div>
            <h1>SkillBridge Admin</h1>
            <p>Secure access to worker verification and platform controls.</p>
          </div>
        </div>

        <form className="sb-login-form" onSubmit={handleSubmit}>
          <label className="sb-login-field">
            <span>Email</span>
            <div className="sb-input-wrapper">
              <Mail size={18} className="sb-input-icon" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@skillbridge.com"
              />
            </div>
          </label>

          <label className="sb-login-field">
            <span>Password</span>
            <div className="sb-input-wrapper">
              <Lock size={18} className="sb-input-icon" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
          </label>

          {error && <div className="sb-login-error">{error}</div>}

          <button type="submit" className="sb-login-button" disabled={isLoading}>
            {isLoading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="sb-login-footnote">
          This area is restricted to authorized SkillBridge administrators only.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;


