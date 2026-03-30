import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header style={{ 
      background: 'var(--card-bg)', 
      color: 'var(--text-primary)', 
      padding: '0.75rem 1.5rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      borderBottom: '1px solid var(--border-color)',
      transition: 'all 0.3s ease'
    }}>
      <Link to="/" style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.25rem' }}>CCFMS Rwanda</Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user?.profile_picture ? (
          <img
            src={`http://localhost:5000${user.profile_picture}`}
            alt="Profile"
            style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              objectFit: 'cover',
              border: '2px solid var(--border-color)'
            }}
          />
        ) : (
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--bg-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            color: 'var(--text-muted)'
          }}>
            👤
          </div>
        )}
        <span style={{ color: 'var(--text-secondary)' }}>{user?.full_name} ({user?.role})</span>
        <button type="button" className="btn btn-secondary" onClick={logout} style={{ padding: '0.35rem 0.75rem', fontSize: '0.875rem' }}>Logout</button>
      </div>
    </header>
  );
}
