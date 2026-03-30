import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import './styles/dark-mode.css';

import LoginSelect from './pages/LoginSelect';
import LoginCitizen from './pages/LoginCitizen';
import LoginAdmin from './pages/LoginAdmin';
import LoginStaff from './pages/LoginStaff';
import RegisterCitizen from './pages/RegisterCitizen';
import Register from './pages/Register';

import CitizenDashboard from './pages/citizen/Dashboard';
import SubmitComplaint from './pages/citizen/SubmitComplaint';
import MyComplaints from './pages/citizen/MyComplaints';
import FeedbackPage from './pages/citizen/FeedbackPage';

import AdminDashboard from './pages/admin/Dashboard';
import AdminComplaints from './pages/admin/Complaints';
import AdminUsers from './pages/admin/Users';
import AdminDepartments from './pages/admin/Departments';
import AuditLog from './pages/admin/AuditLog';

import OfficerDashboard from './pages/officer/Dashboard';
import SupervisorDashboard from './pages/supervisor/Dashboard';
import AgentDashboard from './pages/agent/Dashboard';
import ProfileSettings from './pages/ProfileSettings';
import Notepad from './components/Notepad';

function AppRoutes() {
  const { user } = useAuth();
  const role = user?.role || 'citizen';

  return (
    <Routes>
      {/* Login/Register Routes */}
      <Route path="/login" element={<LoginSelect />} />
      <Route path="/login/citizen" element={<LoginCitizen />} />
      <Route path="/login/admin" element={<LoginAdmin />} />
      <Route path="/login/staff" element={<LoginStaff />} />
      <Route path="/register" element={<Navigate to="/register/citizen" replace />} />
      <Route path="/register/citizen" element={<RegisterCitizen />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to={role === 'citizen' ? '/citizen' : role === 'admin' ? '/admin' : role === 'officer' ? '/officer' : role === 'supervisor' ? '/supervisor' : '/agent'} replace />} />
        {/* Citizen */}
        <Route path="citizen" element={<CitizenDashboard />} />
        <Route path="citizen/submit" element={<SubmitComplaint />} />
        <Route path="citizen/complaints" element={<MyComplaints />} />
        <Route path="citizen/feedback" element={<FeedbackPage />} />
        {/* Profile & Settings - All Roles */}
        <Route path="profile" element={<ProfileSettings />} />
        {/* Notepad - Staff & Admin */}
        <Route path="notepad" element={<Notepad />} />
        {/* Admin */}
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/complaints" element={<AdminComplaints />} />
        <Route path="admin/users" element={<AdminUsers />} />
        <Route path="admin/departments" element={<AdminDepartments />} />
        <Route path="admin/audit" element={<AuditLog />} />
        {/* Officer */}
        <Route path="officer" element={<OfficerDashboard />} />
        {/* Supervisor */}
        <Route path="supervisor" element={<SupervisorDashboard />} />
        {/* Agent */}
        <Route path="agent" element={<AgentDashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
