import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/departments').then(({ data }) => setDepartments(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1>Departments</h1>
      <p style={{ color: '#64748b', marginBottom: '1rem' }}>Offices that handle complaints.</p>
      {loading ? <p>Loading...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {departments.map((d) => (
            <div key={d.id} className="card">
              <strong>{d.name}</strong> <span style={{ color: '#64748b' }}>({d.code})</span>
              {d.description && <p style={{ marginTop: '0.35rem', fontSize: '0.9rem' }}>{d.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
