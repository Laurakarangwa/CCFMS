import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function RegisterCitizen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { 
        email, 
        password, 
        fullName, 
        phone, 
        role: 'citizen' 
      });
      login(data.user, data.token);
      navigate('/citizen');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto', padding: '2rem', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>CCFMS Rwanda</h1>
        <h2 style={{ fontSize: '1.25rem', color: '#3b82f6' }}>Citizen Registration</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Create account to submit complaints</p>
      </div>
      
      {error && <div className="msg error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full name *</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </div>
        <div className="form-group">
          <label>Phone (optional)</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+250 7XX XXX XXX" />
        </div>
        <div className="form-group">
          <label>Password *</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" />
        </div>
        <div className="form-group">
          <label>Confirm Password *</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} autoComplete="new-password" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
          {loading ? 'Creating account...' : 'Create Citizen Account'}
        </button>
      </form>
      
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Already have an account?</p>
        <Link to="/login/citizen" style={{ color: '#3b82f6', textDecoration: 'none' }}>
          Sign in as Citizen
        </Link>
      </div>
      
      <div style={{ marginTop: '1rem', textAlign: 'center', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
        <Link to="/login" style={{ color: '#64748b', textDecoration: 'none' }}>
          ← Back to login selection
        </Link>
      </div>
    </div>
  );
}
