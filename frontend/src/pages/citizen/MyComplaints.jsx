import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import ComplaintCard from '../../components/ComplaintCard';
import StatusBadge from '../../components/StatusBadge';

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const openId = searchParams.get('open');

  useEffect(() => {
    api.get('/complaints').then(({ data }) => setComplaints(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (openId && complaints.length) {
      const c = complaints.find((x) => x.id === openId);
      if (c) setSelected(c.id);
      else api.get(`/complaints/${openId}`).then(({ data }) => setSelected(data.id)).catch(() => {});
    }
  }, [openId, complaints]);

  const detail = selected ? complaints.find((c) => c.id === selected) : null;
  const canGiveFeedback = detail && ['resolved', 'closed'].includes(detail.status);

  return (
    <div>
      <h1>My complaints</h1>
      <p style={{ color: '#64748b', marginBottom: '1rem' }}>Track status and give feedback when resolved.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          {loading ? <p>Loading...</p> : complaints.length === 0 ? <p>No complaints.</p> : complaints.map((c) => (
            <div key={c.id} onClick={() => setSelected(c.id)} style={{ cursor: 'pointer' }}>
              <ComplaintCard c={c} />
            </div>
          ))}
        </div>
        <div>
          {detail ? (
            <div className="card">
              <strong>{detail.reference_number}</strong>
              <StatusBadge status={detail.status} style={{ marginLeft: '0.5rem' }} />
              <p style={{ marginTop: '0.5rem' }}><strong>Category:</strong> {detail.category}</p>
              <p><strong>Location:</strong> {detail.location}</p>
              <p><strong>Description:</strong> {detail.description}</p>
              {detail.resolution_notes && <p><strong>Resolution notes:</strong> {detail.resolution_notes}</p>}
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Created: {new Date(detail.created_at).toLocaleString()}</p>
              {canGiveFeedback && <a href="/citizen/feedback" className="btn btn-primary" style={{ marginTop: '0.75rem' }}>Give feedback</a>}
            </div>
          ) : <p style={{ color: '#94a3b8' }}>Select a complaint to view details.</p>}
        </div>
      </div>
    </div>
  );
}
