import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import ComplaintCard from '../../components/ComplaintCard';

export default function SupervisorDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/complaints').then(({ data }) => setComplaints(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const byStatus = complaints.reduce((acc, c) => { acc[c.status] = (acc[c.status] || 0) + 1; return acc; }, {});

  return (
    <div>
      <h1>Supervisor dashboard</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Workload, SLA monitoring, escalations.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ textAlign: 'center' }}><strong>{complaints.length}</strong><br />Total</div>
        <div className="card" style={{ textAlign: 'center' }}><strong>{byStatus.assigned + byStatus.in_progress || 0}</strong><br />In progress</div>
        <div className="card" style={{ textAlign: 'center' }}><strong>{byStatus.resolved + byStatus.closed || 0}</strong><br />Resolved</div>
      </div>
      <h2 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>All complaints (view & assign)</h2>
      {loading ? <p>Loading...</p> : complaints.length === 0 ? <p>No complaints.</p> : complaints.map((c) => <ComplaintCard key={c.id} c={c} showCitizen />)}
      <p style={{ marginTop: '1rem' }}><Link to="/admin/complaints">Full complaint management</Link> (shared with admin).</p>
    </div>
  );
}
