import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginCitizen() {
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
      if (data.user.role !== 'citizen') {
        setError('This login is for citizens only. Please use the correct login page.');
        return;
      }
      login(data.user, data.token);
      navigate('/citizen');
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
        <h2 style={{ fontSize: '1.25rem', color: '#3b82f6' }}>Citizen Login</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Submit and track your complaints</p>
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
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
          {loading ? 'Signing in...' : 'Sign in as Citizen'}
        </button>
      </form>
      
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Not a citizen?</p>
        <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none' }}>
          ← Back to login selection
        </Link>
      </div>
      
      <div style={{ marginTop: '1rem', textAlign: 'center', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>No citizen account?</p>
        <Link to="/register/citizen" style={{ color: '#3b82f6', textDecoration: 'none' }}>
          Create Citizen Account
        </Link>
      </div>
    </div>
  );
}
