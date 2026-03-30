import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

export default function ComplaintCard({ c, showCitizen = false, linkTo }) {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <strong>{c.reference_number}</strong>
          {showCitizen && c.citizen_name && <span style={{ marginLeft: '0.5rem', color: '#64748b' }}> — {c.citizen_name}</span>}
        </div>
        <StatusBadge status={c.status} />
      </div>
      <p style={{ marginTop: '0.5rem', color: '#475569' }}>{c.category} · {c.location}</p>
      <p style={{ marginTop: '0.35rem', fontSize: '0.9rem' }}>{c.description?.slice(0, 120)}{c.description?.length > 120 ? '...' : ''}</p>
      <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>{new Date(c.created_at).toLocaleString()}</p>
      {linkTo && <Link to={linkTo} className="btn btn-secondary" style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>View</Link>}
    </div>
  );
}
