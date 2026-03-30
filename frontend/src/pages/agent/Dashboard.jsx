import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function AgentDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/complaints').then(({ data }) => setComplaints(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1>Agent dashboard</h1>
      <p style={{ color: '#64748b', marginBottom: '1rem' }}>Front desk / call centre — create complaints on behalf of citizens and manage queue.</p>
      <Link to="/citizen/submit" className="btn btn-primary" style={{ marginBottom: '1rem' }}>Create complaint (on behalf of citizen)</Link>
      <p style={{ marginBottom: '0.5rem' }}>Agents use the same &quot;Submit complaint&quot; flow; in a full setup you would select or create the citizen first.</p>
      {loading ? <p>Loading...</p> : complaints.length === 0 ? <p>No complaints in queue.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {complaints.slice(0, 20).map((c) => (
            <div key={c.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span><strong>{c.reference_number}</strong> — {c.citizen_name} · {c.category}</span>
              <span style={{ color: '#64748b', textTransform: 'capitalize' }}>{c.status?.replace(/_/g, ' ')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
