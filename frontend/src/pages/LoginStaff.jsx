import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginStaff() {
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
      if (!['agent', 'officer', 'supervisor'].includes(data.user.role)) {
        setError('This login is for staff members only.');
        return;
      }
      login(data.user, data.token);
      const roleRoutes = {
        'agent': '/agent',
        'officer': '/officer', 
        'supervisor': '/supervisor'
      };
      navigate(roleRoutes[data.user.role]);
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
        <h2 style={{ fontSize: '1.25rem', color: '#059669' }}>Staff Login</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Agent, Officer, or Supervisor</p>
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
        <button type="submit" className="btn" disabled={loading} style={{ width: '100%', marginTop: '0.5rem', background: '#059669', color: 'white' }}>
          {loading ? 'Signing in...' : 'Sign in as Staff'}
        </button>
      </form>
      
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Not a staff member?</p>
        <Link to="/login" style={{ color: '#059669', textDecoration: 'none' }}>
          ← Back to login selection
        </Link>
      </div>
      
      <div style={{ marginTop: '1rem', textAlign: 'center', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
        <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
          Staff accounts are created by administrators
        </p>
      </div>
    </div>
  );
}
