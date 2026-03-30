import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const linkStyle = ({ isActive }) => ({ 
  display: 'block', 
  padding: '0.5rem 1rem', 
  color: isActive ? 'var(--info)' : 'var(--text-secondary)', 
  fontWeight: isActive ? 600 : 400, 
  borderLeft: isActive ? '3px solid var(--info)' : '3px solid transparent',
  transition: 'all 0.3s ease'
});

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role || 'citizen';

  return (
    <aside style={{ 
      width: '220px', 
      background: 'var(--card-bg)', 
      borderRight: '1px solid var(--border-color)', 
      padding: '1rem 0',
      transition: 'all 0.3s ease'
    }}>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {role === 'citizen' && (
          <>
            <NavLink to="/citizen" end style={linkStyle}>Dashboard</NavLink>
            <NavLink to="/citizen/submit" style={linkStyle}>Submit Complaint</NavLink>
            <NavLink to="/citizen/complaints" style={linkStyle}>My Complaints</NavLink>
            <NavLink to="/citizen/feedback" style={linkStyle}>Feedback</NavLink>
            <NavLink to="/profile" style={linkStyle}>⚙️ Profile</NavLink>
          </>
        )}
        {(role === 'admin' || role === 'supervisor' || role === 'officer' || role === 'agent') && (
          <>
            {role === 'admin' && <NavLink to="/admin" end style={linkStyle}>Dashboard</NavLink>}
            {role === 'admin' && <NavLink to="/admin/complaints" style={linkStyle}>Complaints</NavLink>}
            {role === 'admin' && <NavLink to="/admin/users" style={linkStyle}>Users</NavLink>}
            {role === 'admin' && <NavLink to="/admin/departments" style={linkStyle}>Departments</NavLink>}
            {role === 'admin' && <NavLink to="/admin/audit" style={linkStyle}>Audit Log</NavLink>}
            {role === 'officer' && <NavLink to="/officer" style={linkStyle}>My Cases</NavLink>}
            {role === 'supervisor' && <NavLink to="/supervisor" style={linkStyle}>Supervisor Dashboard</NavLink>}
            {role === 'agent' && <NavLink to="/agent" style={linkStyle}>Agent Dashboard</NavLink>}
            <NavLink to="/profile" style={linkStyle}>⚙️ Profile</NavLink>
            <NavLink to="/notepad" style={linkStyle}>📝 Notepad</NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}
