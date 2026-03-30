import { useState, useEffect } from 'react';
import api from '../../services/api';
import ComplaintCard from '../../components/ComplaintCard';
import StatusBadge from '../../components/StatusBadge';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [assignTo, setAssignTo] = useState('');
  const [assignDept, setAssignDept] = useState('');
  const [status, setStatus] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Filter states
  const [filterStatus, setFilterStatus] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    Promise.all([api.get('/complaints'), api.get('/users'), api.get('/departments')])
      .then(([c, u, d]) => { setComplaints(c.data); setUsers(u.data); setDepartments(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const detail = selected ? complaints.find((c) => c.id === selected) : null;
  const officers = users.filter((u) => u.role === 'officer');

  // Filter and sort complaints
  const filteredComplaints = complaints
    .filter(c => {
      if (filterStatus && c.status !== filterStatus) return false;
      if (filterUrgency && c.urgency_level !== filterUrgency) return false;
      if (filterDepartment && c.department_name !== filterDepartment) return false;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          c.reference_number?.toLowerCase().includes(searchLower) ||
          c.citizen_name?.toLowerCase().includes(searchLower) ||
          c.category?.toLowerCase().includes(searchLower) ||
          c.location?.toLowerCase().includes(searchLower) ||
          c.description?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'created_at' || sortBy === 'updated_at') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  const handleAssign = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await api.patch(`/complaints/${selected}/assign`, { 
        assigned_to: assignTo || undefined, 
        assigned_department_id: assignDept || undefined 
      });
      const { data } = await api.get('/complaints');
      setComplaints(data);
      setSelected(null);
      setAssignTo('');
      setAssignDept('');
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to assign');
    } finally {
      setSaving(false);
    }
  };

  const handleStatus = async () => {
    if (!selected || !status) return;
    setSaving(true);
    try {
      await api.patch(`/complaints/${selected}/status`, { 
        status, 
        resolution_notes: resolutionNotes || undefined 
      });
      const { data } = await api.get('/complaints');
      setComplaints(data);
      setSelected(null);
      setStatus('');
      setResolutionNotes('');
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  const handleEscalate = async (complaintId) => {
    if (!confirm('Are you sure you want to escalate this complaint? This will notify higher authorities.')) return;
    
    try {
      await api.patch(`/complaints/${complaintId}/status`, { 
        status: 'escalated',
        resolution_notes: 'Escalated by administrator due to urgency or delay'
      });
      const { data } = await api.get('/complaints');
      setComplaints(data);
      alert('Complaint escalated successfully');
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to escalate');
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'fatal': return '#ef4444';
      case 'urgent': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const isOverdue = (complaint) => {
    const daysSinceCreated = (new Date() - new Date(complaint.created_at)) / (1000 * 60 * 60 * 24);
    return complaint.status !== 'resolved' && complaint.status !== 'closed' && daysSinceCreated > 7;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1>Complaint Management</h1>
          <p style={{ color: '#64748b', marginBottom: '0' }}>View, assign, and manage all complaints</p>
        </div>
        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Showing {filteredComplaints.length} of {complaints.length} complaints
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search complaints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '0.5rem' }}
          />
          
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '0.5rem' }}>
            <option value="">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="in_review">In Review</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select value={filterUrgency} onChange={(e) => setFilterUrgency(e.target.value)} style={{ padding: '0.5rem' }}>
            <option value="">All Urgency</option>
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
            <option value="fatal">Fatal</option>
          </select>

          <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} style={{ padding: '0.5rem' }}>
            <option value="">All Departments</option>
            {departments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '0.5rem' }}>
            <option value="created_at">Date Created</option>
            <option value="updated_at">Last Updated</option>
            <option value="urgency_level">Urgency</option>
            <option value="status">Status</option>
          </select>

          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ padding: '0.5rem' }}>
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => {
              setFilterStatus('');
              setFilterUrgency('');
              setFilterDepartment('');
              setSearchTerm('');
              setSortBy('created_at');
              setSortOrder('desc');
            }}
            className="btn"
            style={{ padding: '0.5rem 1rem', background: '#f3f4f6', color: '#374151' }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          {loading ? <p>Loading...</p> : filteredComplaints.map((c) => (
            <div 
              key={c.id} 
              onClick={() => setSelected(c.id)} 
              style={{ 
                cursor: 'pointer',
                border: selected === c.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '0.5rem',
                marginBottom: '0.5rem',
                background: selected === c.id ? '#f0f9ff' : '#fff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                  <strong>{c.reference_number}</strong>
                  <StatusBadge status={c.status} style={{ marginLeft: '0.5rem' }} />
                  {c.urgency_level && c.urgency_level !== 'normal' && (
                    <span 
                      style={{ 
                        marginLeft: '0.5rem', 
                        padding: '0.125rem 0.5rem', 
                        borderRadius: '0.25rem', 
                        fontSize: '0.75rem',
                        background: getUrgencyColor(c.urgency_level),
                        color: 'white'
                      }}
                    >
                      {c.urgency_level.toUpperCase()}
                    </span>
                  )}
                  {isOverdue(c) && (
                    <span style={{ marginLeft: '0.5rem', color: '#f59e0b', fontSize: '0.875rem' }}>⚠️ OVERDUE</span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEscalate(c.id);
                  }}
                  className="btn btn-warning"
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                >
                  Escalate
                </button>
              </div>
              <ComplaintCard c={c} showCitizen linkTo={null} />
            </div>
          ))}
          {filteredComplaints.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              No complaints found matching the current filters
            </div>
          )}
        </div>

        <div>
          {detail ? (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <strong>{detail.reference_number}</strong>
                  <StatusBadge status={detail.status} style={{ marginLeft: '0.5rem' }} />
                  {detail.urgency_level && detail.urgency_level !== 'normal' && (
                    <span 
                      style={{ 
                        marginLeft: '0.5rem', 
                        padding: '0.125rem 0.5rem', 
                        borderRadius: '0.25rem', 
                        fontSize: '0.75rem',
                        background: getUrgencyColor(detail.urgency_level),
                        color: 'white'
                      }}
                    >
                      {detail.urgency_level.toUpperCase()}
                    </span>
                  )}
                </div>
                {isOverdue(detail) && (
                  <div style={{ color: '#f59e0b', fontSize: '0.875rem' }}>
                    ⚠️ Overdue by {Math.floor((new Date() - new Date(detail.created_at)) / (1000 * 60 * 60 * 24))} days
                  </div>
                )}
              </div>
              
              <p style={{ marginTop: '0.5rem' }}><strong>Citizen:</strong> {detail.citizen_name}</p>
              <p><strong>Email:</strong> {detail.citizen_email}</p>
              <p><strong>Category:</strong> {detail.category}</p>
              <p><strong>Location:</strong> {detail.location}</p>
              
              {/* Enhanced location details */}
              {(detail.district || detail.sector || detail.cell || detail.village) && (
                <p><strong>Detailed Location:</strong> {[
                  detail.district,
                  detail.sector,
                  detail.cell,
                  detail.village
                ].filter(Boolean).join(' → ')}</p>
              )}
              
              {detail.incident_date && (
                <p><strong>Incident Date:</strong> {new Date(detail.incident_date).toLocaleDateString()}</p>
              )}
              
              {detail.phone_number && (
                <p><strong>Phone:</strong> {detail.phone_number}</p>
              )}
              
              {detail.gps_coordinates && (
                <p><strong>GPS:</strong> {detail.gps_coordinates}</p>
              )}
              
              <p><strong>Description:</strong> {detail.description}</p>
              
              {detail.department_name && <p><strong>Department:</strong> {detail.department_name}</p>}
              
              <p><strong>Created:</strong> {new Date(detail.created_at).toLocaleDateString()}</p>
              <p><strong>Last Updated:</strong> {new Date(detail.updated_at).toLocaleDateString()}</p>

              <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
              
              <div className="form-group">
                <label>Assign to officer</label>
                <select value={assignTo} onChange={(e) => setAssignTo(e.target.value)}>
                  <option value="">—</option>
                  {officers.map((u) => <option key={u.id} value={u.id}>{u.full_name}</option>)}
                </select>
              </div>
              
              <div className="form-group">
                <label>Department</label>
                <select value={assignDept} onChange={(e) => setAssignDept(e.target.value)}>
                  <option value="">—</option>
                  {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              
              <button type="button" className="btn btn-primary" onClick={handleAssign} disabled={saving}>
                {saving ? 'Assigning...' : 'Assign'}
              </button>
              
              <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
              
              <div className="form-group">
                <label>Update status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="">—</option>
                  <option value="in_review">In review</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                  <option value="reopened">Reopened</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Resolution notes</label>
                <textarea value={resolutionNotes} onChange={(e) => setResolutionNotes(e.target.value)} rows={3} />
              </div>
              
              <button type="button" className="btn btn-success" onClick={handleStatus} disabled={saving || !status}>
                {saving ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          ) : <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>Select a complaint to view details</p>}
        </div>
      </div>
    </div>
  );
}
