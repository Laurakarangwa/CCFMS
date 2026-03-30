import { useState, useEffect } from 'react';
import api from '../../services/api';
import ComplaintCard from '../../components/ComplaintCard';
import StatusBadge from '../../components/StatusBadge';

export default function OfficerDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    console.log('=== OFFICER DASHBOARD LOADING ===');
    api.get('/complaints/my-assigned').then(({ data }) => {
      console.log('Officer assigned complaints received:', data);
      console.log('Number of complaints:', data.length);
      setComplaints(data);
    }).catch((err) => {
      console.error('Error fetching assigned complaints:', err);
    }).finally(() => setLoading(false));
    console.log('=== OFFICER DASHBOARD LOADING END ===');
  }, []);

  const detail = selected ? complaints.find((c) => c.id === selected) : null;

  const handleStatus = async () => {
    if (!selected || !status) return;
    setSaving(true);
    try {
      await api.patch(`/complaints/${selected}/status`, { status, resolution_notes: resolutionNotes || undefined });
      const { data } = await api.get('/complaints/my-assigned');
      setComplaints(data);
      setSelected(null);
      setStatus('');
      setResolutionNotes('');
    } catch (e) {
      alert(e.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1>My cases</h1>
      <p style={{ color: '#64748b', marginBottom: '1rem' }}>Assigned complaints — update status and add resolution notes.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          {loading ? <p>Loading...</p> : complaints.length === 0 ? <p>No cases assigned.</p> : complaints.map((c) => (
            <div key={c.id} onClick={() => setSelected(c.id)} style={{ cursor: 'pointer' }}>
              <ComplaintCard c={c} showCitizen />
            </div>
          ))}
        </div>
        <div>
          {detail ? (
            <div className="card">
              <strong>{detail.reference_number}</strong>
              <StatusBadge status={detail.status} style={{ marginLeft: '0.5rem' }} />
              <p style={{ marginTop: '0.5rem' }}>Citizen: {detail.citizen_name}</p>
              <p>Category: {detail.category} · {detail.location}</p>
              <p>Description: {detail.description}</p>
              <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
              <div className="form-group">
                <label>Update status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="">—</option>
                  <option value="in_progress">In progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Resolution notes</label>
                <textarea value={resolutionNotes} onChange={(e) => setResolutionNotes(e.target.value)} rows={3} />
              </div>
              <button type="button" className="btn btn-success" onClick={handleStatus} disabled={saving || !status}>Update</button>
            </div>
          ) : <p style={{ color: '#94a3b8' }}>Select a case.</p>}
        </div>
      </div>
    </div>
  );
}
