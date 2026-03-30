const statusColors = {
  submitted: '#94a3b8',
  in_review: '#f59e0b',
  assigned: '#3b82f6',
  in_progress: '#8b5cf6',
  resolved: '#10b981',
  closed: '#6b7280',
  reopened: '#ef4444',
};

export default function StatusBadge({ status, style = {} }) {
  const label = (status || '').replace(/_/g, ' ');
  const color = statusColors[status] || '#64748b';
  return (
    <span style={{ 
      display: 'inline-block', 
      padding: '0.2rem 0.5rem', 
      borderRadius: 4, 
      fontSize: '0.8rem', 
      fontWeight: 500, 
      background: color, 
      color: '#fff', 
      textTransform: 'capitalize',
      transition: 'all 0.3s ease',
      ...style
    }}>
      {label}
    </span>
  );
}
