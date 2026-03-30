import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [recentAudit, setRecentAudit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    Promise.all([
      api.get('/complaints'),
      api.get('/users'),
      api.get('/departments'),
      api.get('/audit?limit=5')
    ])
      .then(([c, u, d, a]) => { 
        setComplaints(c.data); 
        setUsers(u.data); 
        setDepartments(d.data);
        setRecentAudit(a.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const byStatus = complaints.reduce((acc, c) => { acc[c.status] = (acc[c.status] || 0) + 1; return acc; }, {});
  const byUrgency = complaints.reduce((acc, c) => { acc[c.urgency_level || 'normal'] = (acc[c.urgency_level || 'normal'] || 0) + 1; return acc; }, {});
  const byDepartment = complaints.reduce((acc, c) => { 
    if (c.department_name) { acc[c.department_name] = (acc[c.department_name] || 0) + 1; }
    return acc; 
  }, {});

  const overdueComplaints = complaints.filter(c => {
    const daysSinceCreated = (new Date() - new Date(c.created_at)) / (1000 * 60 * 60 * 24);
    return c.status !== 'resolved' && c.status !== 'closed' && daysSinceCreated > 7;
  });

  const urgentComplaints = complaints.filter(c => c.urgency_level === 'urgent' || c.urgency_level === 'fatal');

  const stats = {
    totalComplaints: complaints.length,
    pendingComplaints: byStatus.submitted + byStatus.in_review || 0,
    inProgressComplaints: byStatus.assigned + byStatus.in_progress || 0,
    resolvedComplaints: byStatus.resolved + byStatus.closed || 0,
    totalUsers: users.length,
    activeUsers: users.filter(u => u.is_active).length,
    overdueCount: overdueComplaints.length,
    urgentCount: urgentComplaints.length
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading dashboard...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Admin Dashboard</h1>
          <p style={{ color: '#64748b', marginBottom: '0' }}>Comprehensive system overview and management</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} style={{ padding: '0.5rem' }}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Alert Section for Critical Issues */}
      {(overdueComplaints.length > 0 || urgentComplaints.length > 0) && (
        <div style={{ marginBottom: '2rem' }}>
          {urgentComplaints.length > 0 && (
            <div className="card" style={{ background: '#fef2f2', border: '1px solid #ef4444', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🚨</span>
                <div>
                  <strong>{urgentComplaints.length} Urgent Complaints</strong> require immediate attention
                  <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                    {urgentComplaints.filter(c => c.urgency_level === 'fatal').length} Fatal, {urgentComplaints.filter(c => c.urgency_level === 'urgent').length} Urgent
                  </div>
                </div>
              </div>
              <Link to="/admin/complaints" className="btn btn-danger" style={{ marginTop: '0.5rem' }}>
                Review Urgent Cases
              </Link>
            </div>
          )}
          
          {overdueComplaints.length > 0 && (
            <div className="card" style={{ background: '#fffbeb', border: '1px solid #f59e0b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                <div>
                  <strong>{overdueComplaints.length} Overdue Complaints</strong> need escalation
                  <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                    Pending for more than 7 days
                  </div>
                </div>
              </div>
              <Link to="/admin/complaints" className="btn btn-warning" style={{ marginTop: '0.5rem' }}>
                Escalate Cases
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center', background: '#f0f9ff', border: '1px solid #0ea5e9' }}>
          <strong style={{ fontSize: '1.5rem', color: '#0ea5e9' }}>{stats.totalComplaints}</strong>
          <br />Total Complaints
        </div>
        <div className="card" style={{ textAlign: 'center', background: '#fef2f2', border: '1px solid #ef4444' }}>
          <strong style={{ fontSize: '1.5rem', color: '#ef4444' }}>{stats.pendingComplaints}</strong>
          <br />Pending
        </div>
        <div className="card" style={{ textAlign: 'center', background: '#fef3c7', border: '1px solid #f59e0b' }}>
          <strong style={{ fontSize: '1.5rem', color: '#f59e0b' }}>{stats.inProgressComplaints}</strong>
          <br />In Progress
        </div>
        <div className="card" style={{ textAlign: 'center', background: '#f0fdf4', border: '1px solid #22c55e' }}>
          <strong style={{ fontSize: '1.5rem', color: '#22c55e' }}>{stats.resolvedComplaints}</strong>
          <br />Resolved
        </div>
        <div className="card" style={{ textAlign: 'center', background: '#f3f4f6', border: '1px solid #6b7280' }}>
          <strong style={{ fontSize: '1.5rem', color: '#6b7280' }}>{stats.totalUsers}</strong>
          <br />Total Users
        </div>
        <div className="card" style={{ textAlign: 'center', background: '#f0f9ff', border: '1px solid #0ea5e9' }}>
          <strong style={{ fontSize: '1.5rem', color: '#0ea5e9' }}>{stats.activeUsers}</strong>
          <br />Active Users
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <Link to="/admin/complaints" className="btn btn-primary">📋 Manage Complaints</Link>
          <Link to="/admin/users" className="btn btn-secondary">👥 Manage Users</Link>
          <Link to="/admin/departments" className="btn btn-secondary">🏢 Departments</Link>
          <Link to="/admin/audit" className="btn btn-secondary">📊 Audit Logs</Link>
        </div>
      </div>

      {/* Analytics Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <h3>Complaints by Status</h3>
          <div style={{ marginTop: '1rem' }}>
            {Object.entries(byStatus).map(([status, count]) => (
              <div key={status} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ textTransform: 'capitalize' }}>{status.replace('_', ' ')}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Complaints by Urgency</h3>
          <div style={{ marginTop: '1rem' }}>
            {Object.entries(byUrgency).map(([urgency, count]) => (
              <div key={urgency} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ textTransform: 'capitalize' }}>{urgency}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Performance */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Department Workload</h3>
        <div style={{ marginTop: '1rem' }}>
          {Object.entries(byDepartment).map(([dept, count]) => (
            <div key={dept} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
              <span>{dept}</span>
              <strong>{count} complaints</strong>
            </div>
          ))}
          {Object.keys(byDepartment).length === 0 && (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '1rem' }}>No department assignments yet</p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3>Recent System Activity</h3>
        <div style={{ marginTop: '1rem' }}>
          {recentAudit.length > 0 ? (
            recentAudit.map((log) => (
              <div key={log.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{log.action}</span>
                  <small style={{ color: '#64748b' }}>
                    {new Date(log.created_at).toLocaleDateString()}
                  </small>
                </div>
                {log.details && (
                  <small style={{ color: '#64748b' }}>
                    {JSON.stringify(log.details)}
                  </small>
                )}
              </div>
            ))
          ) : (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '1rem' }}>No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}
