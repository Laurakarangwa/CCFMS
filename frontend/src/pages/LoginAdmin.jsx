import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (!['admin', 'supervisor'].includes(data.user.role)) {
        setError('This login is for administrators and supervisors only.');
        return;
      }
      login(data.user, data.token);
      navigate(data.user.role === 'admin' ? '/admin' : '/supervisor');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto', padding: '2rem', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>CCFMS Rwanda</h1>
        <h2 style={{ fontSize: '1.25rem', color: '#64748b' }}>Administrator Login</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Manage system and oversee operations</p>
      </div>
      
      {error && <div className="msg error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        </div>
        <button type="submit" className="btn btn-secondary" disabled={loading} style={{ width: '100%', marginTop: '0.5rem', background: '#64748b' }}>
          {loading ? 'Signing in...' : 'Sign in as Admin'}
        </button>
      </form>
      
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Not an administrator?</p>
        <Link to="/login" style={{ color: '#64748b', textDecoration: 'none' }}>
          ← Back to login selection
        </Link>
      </div>
    </div>
  );
}
