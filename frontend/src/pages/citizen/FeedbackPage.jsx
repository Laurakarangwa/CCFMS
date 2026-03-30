import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function FeedbackPage() {
  const [complaints, setComplaints] = useState([]);
  const [complaintId, setComplaintId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/complaints').then(({ data }) => {
      const resolved = data.filter((c) => ['resolved', 'closed'].includes(c.status));
      setComplaints(resolved);
      if (resolved.length && !complaintId) setComplaintId(resolved[0].id);
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!complaintId) return setError('Select a complaint');
    setLoading(true);
    try {
      await api.post('/feedback', { complaint_id: complaintId, rating, comment });
      setMessage('Thank you for your feedback.');
      setComplaintId('');
      setComment('');
      api.get('/complaints').then(({ data }) => setComplaints(data.filter((c) => ['resolved', 'closed'].includes(c.status))));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Feedback</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Rate how your complaint was resolved.</p>
      {message && <div className="msg success">{message}</div>}
      {error && <div className="msg error">{error}</div>}
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div className="form-group">
          <label>Complaint</label>
          <select value={complaintId} onChange={(e) => setComplaintId(e.target.value)} required>
            <option value="">Select resolved complaint</option>
            {complaints.map((c) => <option key={c.id} value={c.id}>{c.reference_number} — {c.category}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Rating (1–5)</label>
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Comment (optional)</label>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Submitting...' : 'Submit feedback'}</button>
      </form>
    </div>
  );
}
