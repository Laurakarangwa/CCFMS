import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import ComplaintCard from '../../components/ComplaintCard';

export default function CitizenDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/complaints').then(({ data }) => setComplaints(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const byStatus = complaints.reduce((acc, c) => { acc[c.status] = (acc[c.status] || 0) + 1; return acc; }, {});

  return (
    <div>
      <h1>Citizen Dashboard</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Submit and track your complaints.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ textAlign: 'center' }}><strong>{complaints.length}</strong><br />Total</div>
        <div className="card" style={{ textAlign: 'center' }}><strong>{byStatus.submitted + byStatus.in_review || 0}</strong><br />Pending</div>
        <div className="card" style={{ textAlign: 'center' }}><strong>{byStatus.in_progress + byStatus.assigned || 0}</strong><br />In progress</div>
        <div className="card" style={{ textAlign: 'center' }}><strong>{byStatus.resolved + byStatus.closed || 0}</strong><br />Resolved</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.125rem' }}>Recent complaints</h2>
        <Link to="/citizen/submit" className="btn btn-primary">Submit complaint</Link>
      </div>
      {loading ? <p>Loading...</p> : complaints.length === 0 ? <p>No complaints yet. <Link to="/citizen/submit">Submit one</Link>.</p> : complaints.slice(0, 5).map((c) => <ComplaintCard key={c.id} c={c} linkTo={`/citizen/complaints?open=${c.id}`} />)}
    </div>
  );
}
