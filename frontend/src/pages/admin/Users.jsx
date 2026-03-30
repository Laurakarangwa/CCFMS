import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ 
    email: '', 
    password: '', 
    full_name: '', 
    phone: '', 
    role: 'citizen', 
    department_id: '' 
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/users'),
      api.get('/departments')
    ])
      .then(([u, d]) => { 
        setUsers(u.data); 
        setDepartments(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.post('/users', { ...form, department_id: form.department_id || undefined });
      setMessage('User created.');
      setForm({ email: '', password: '', full_name: '', phone: '', role: 'citizen', department_id: '' });
      api.get('/users').then(({ data }) => setUsers(data));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div>
      <h1>Users</h1>
      <p style={{ color: '#64748b', marginBottom: '1rem' }}>Manage users and roles.</p>
      {message && <div className="msg success">{message}</div>}
      {error && <div className="msg error">{error}</div>}
      <div className="card" style={{ maxWidth: 400, marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.75rem' }}>Create user</h3>
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label>Full name</label>
            <input value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
              <option value="citizen">Citizen</option>
              <option value="agent">Agent</option>
              <option value="officer">Officer</option>
              <option value="supervisor">Supervisor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {(form.role === 'agent' || form.role === 'officer' || form.role === 'supervisor') && (
            <div className="form-group">
              <label>Department</label>
              <select value={form.department_id} onChange={(e) => setForm((f) => ({ ...f, department_id: e.target.value }))}>
                <option value="">Select Department</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          )}
          <button type="submit" className="btn btn-primary">Create</button>
        </form>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <thead><tr style={{ background: '#f1f5f9' }}><th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th><th style={{ padding: '0.75rem', textAlign: 'left' }}>Email</th><th style={{ padding: '0.75rem', textAlign: 'left' }}>Role</th><th style={{ padding: '0.75rem', textAlign: 'left' }}>Department</th></tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={{ borderTop: '1px solid #e2e8f0' }}>
              <td style={{ padding: '0.75rem' }}>{u.full_name}</td>
              <td style={{ padding: '0.75rem' }}>{u.email}</td>
              <td style={{ padding: '0.75rem' }}>{u.role}</td>
              <td style={{ padding: '0.75rem' }}>{u.department_name || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <p>Loading...</p>}
    </div>
  );
}
