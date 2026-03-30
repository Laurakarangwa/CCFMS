import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/audit', { params: { limit: 100 } }).then(({ data }) => setLogs(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1>Audit log</h1>
      <p style={{ color: '#64748b', marginBottom: '1rem' }}>Sign-in, complaint submission, updates and resolution (NFR 5).</p>
      {loading ? <p>Loading...</p> : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#f1f5f9' }}><th style={{ padding: '0.5rem', textAlign: 'left' }}>Time</th><th style={{ padding: '0.5rem', textAlign: 'left' }}>User</th><th style={{ padding: '0.5rem', textAlign: 'left' }}>Action</th><th style={{ padding: '0.5rem', textAlign: 'left' }}>Entity</th></tr></thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.5rem', fontSize: '0.875rem' }}>{new Date(l.created_at).toLocaleString()}</td>
                  <td style={{ padding: '0.5rem' }}>{l.full_name || l.email || '—'}</td>
                  <td style={{ padding: '0.5rem' }}>{l.action}</td>
                  <td style={{ padding: '0.5rem' }}>{l.entity_type} {l.entity_id ? `(${String(l.entity_id).slice(0, 8)}...)` : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && <p style={{ padding: '1rem' }}>No audit entries yet.</p>}
        </div>
      )}
    </div>
  );
}
