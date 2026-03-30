import { Link } from 'react-router-dom';

export default function LoginSelect() {
  return (
    <div style={{ maxWidth: 500, margin: '4rem auto', padding: '2rem', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>CCFMS Rwanda</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center', color: '#1e40af' }}>
        Citizen Complaint & Feedback Management System
      </h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', textAlign: 'center' }}>I want to...</h3>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          <Link 
            to="/login/citizen" 
            className="btn btn-primary"
            style={{ 
              padding: '1rem', 
              fontSize: '1.1rem', 
              textAlign: 'center',
              textDecoration: 'none',
              display: 'block',
              background: '#3b82f6',
              color: 'white',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            🏠 Sign in as Citizen
            <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.9 }}>
              Submit and track complaints
            </div>
          </Link>

          <Link 
            to="/login/admin" 
            className="btn btn-secondary"
            style={{ 
              padding: '1rem', 
              fontSize: '1.1rem', 
              textAlign: 'center',
              textDecoration: 'none',
              display: 'block',
              background: '#64748b',
              color: 'white',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            👔 Sign in as Admin
            <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.9 }}>
              Manage system and complaints
            </div>
          </Link>

          <Link 
            to="/login/staff" 
            className="btn btn-secondary"
            style={{ 
              padding: '1rem', 
              fontSize: '1.1rem', 
              textAlign: 'center',
              textDecoration: 'none',
              display: 'block',
              background: '#059669',
              color: 'white',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            📋 Sign in as Staff
            <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.9 }}>
              Officer, Agent, or Supervisor
            </div>
          </Link>
        </div>
      </div>

      <div style={{ textAlign: 'center', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>New to the system?</h3>
        <Link 
          to="/register/citizen" 
          className="btn"
          style={{ 
            padding: '0.75rem 1.5rem', 
            fontSize: '1rem',
            textDecoration: 'none',
            display: 'inline-block',
            background: '#f3f4f6',
            color: '#374151',
            borderRadius: '0.5rem',
            border: '1px solid #d1d5db',
            cursor: 'pointer'
          }}
        >
          Create Citizen Account
        </Link>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>
          Staff accounts are created by administrators
        </p>
      </div>
    </div>
  );
}
