import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ProfileSettings() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    phone: '',
    email: ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        full_name: user.full_name || '',
        phone: user.phone || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    
    try {
      const { data } = await api.patch('/users/profile', {
        full_name: profileForm.full_name,
        phone: profileForm.phone
      });
      
      updateUser(data);
      setMessage('✅ Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      await api.patch('/users/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      setMessage('✅ Password changed successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setError('Profile picture must be less than 5MB');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    setUploadingPicture(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const { data } = await api.post('/upload/profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Update user context with new profile picture
      updateUser({ ...user, profile_picture: data.url });
      setMessage('✅ Profile picture updated!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setUploadingPicture(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Profile & Settings</h1>
        <p style={{ color: '#64748b', marginBottom: '0' }}>Manage your account information and preferences</p>
      </div>

      {message && <div className="msg success">{message}</div>}
      {error && <div className="msg error">{error}</div>}

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
        {['profile', 'security', 'info'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1rem',
              background: activeTab === tab ? '#3b82f6' : 'transparent',
              color: activeTab === tab ? 'white' : '#64748b',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #3b82f6' : '2px solid transparent',
              cursor: 'pointer',
              borderRadius: '0.375rem 0.375rem 0 0'
            }}
          >
            {tab === 'profile' && '👤 Profile'}
            {tab === 'security' && '🔐 Security'}
            {tab === 'info' && '📊 Account Info'}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Profile Information</h3>
            <form onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={profileForm.full_name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, full_name: e.target.value }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  disabled
                  style={{ background: '#f3f4f6', color: '#6b7280' }}
                />
                <small style={{ color: '#64748b', display: 'block', marginTop: '0.25rem' }}>
                  Email cannot be changed. Contact admin if needed.
                </small>
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+250 7XX XXX XXX"
                />
              </div>
              
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Profile Picture</h3>
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '1rem' }}>
                {(user?.profile_picture || profilePicture) ? (
                  <img
                    src={`http://localhost:5000${profilePicture || user.profile_picture}`}
                    alt="Profile"
                    style={{ 
                      width: '120px', 
                      height: '120px', 
                      borderRadius: '50%', 
                      objectFit: 'cover',
                      border: '3px solid var(--border-color)'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'var(--bg-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '3px solid var(--border-color)',
                    fontSize: '2rem',
                    color: 'var(--text-muted)'
                  }}>
                    👤
                  </div>
                )}
              </div>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                disabled={uploadingPicture}
                style={{ display: 'none' }}
                id="profile-pic-upload"
              />
              
              <label
                htmlFor="profile-pic-upload"
                style={{
                  padding: '0.5rem 1rem',
                  background: 'var(--button-primary)',
                  color: 'white',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  display: 'inline-block',
                  transition: 'all 0.3s ease'
                }}
              >
                {uploadingPicture ? '⏳ Uploading...' : '📷 Change Picture'}
              </label>
              
              <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                JPG, PNG - Max 5MB
              </small>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="card" style={{ maxWidth: '500px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Change Password</h3>
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                required
              />
            </div>
            
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                required
                minLength={6}
              />
            </div>
            
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
                minLength={6}
              />
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      )}

      {/* Account Info Tab */}
      {activeTab === 'info' && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Account Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <strong>User ID:</strong>
              <p style={{ color: '#64748b' }}>{user?.id}</p>
            </div>
            <div>
              <strong>Role:</strong>
              <p style={{ 
                textTransform: 'capitalize',
                padding: '0.25rem 0.5rem',
                background: '#3b82f6',
                color: 'white',
                borderRadius: '0.25rem',
                display: 'inline-block'
              }}>
                {user?.role}
              </p>
            </div>
            <div>
              <strong>Department:</strong>
              <p>{user?.department_name || 'Not assigned'}</p>
            </div>
            <div>
              <strong>Account Status:</strong>
              <p style={{ 
                color: user?.is_active ? '#22c55e' : '#ef4444',
                fontWeight: 'bold'
              }}>
                {user?.is_active ? '✅ Active' : '❌ Inactive'}
              </p>
            </div>
            <div>
              <strong>Member Since:</strong>
              <p>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div>
              <strong>Last Updated:</strong>
              <p>{user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
