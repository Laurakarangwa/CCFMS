import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CATEGORIES = ['Roads', 'Water & Sanitation', 'Electricity', 'Waste', 'Security', 'Health', 'Education', 'Other'];
const URGENCY_LEVELS = [
  { value: 'normal', label: 'Normal', description: 'Routine issue' },
  { value: 'urgent', label: 'Urgent', description: 'Requires attention soon' },
  { value: 'fatal', label: 'Fatal', description: 'Emergency - immediate attention required' }
];
const CONTACT_METHODS = ['email', 'phone', 'both'];

export default function SubmitComplaint() {
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  
  // New fields
  const [phoneNumber, setPhoneNumber] = useState('');
  const [district, setDistrict] = useState('');
  const [sector, setSector] = useState('');
  const [cell, setCell] = useState('');
  const [village, setVillage] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('normal');
  const [gpsCoordinates, setGpsCoordinates] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState('email');
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  const [similar, setSimilar] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (category && location && location.length >= 3) {
      api.get('/complaints/similar', { params: { category, location } }).then(({ data }) => setSimilar(data.similar || [])).catch(() => setSimilar([]));
    } else setSimilar([]);
  }, [category, location]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        return {
          id: response.data.id,
          name: file.name,
          url: response.data.url,
          type: file.type
        };
      });
      
      const uploadedFiles = await Promise.all(uploadPromises);
      setAttachments(prev => [...prev, ...uploadedFiles]);
    } catch (err) {
      setError('Failed to upload images: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = (indexToRemove) => {
    setAttachments(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await api.post('/complaints', {
        category,
        location,
        description,
        phoneNumber,
        district,
        sector,
        cell,
        village,
        incidentDate,
        urgencyLevel,
        gpsCoordinates,
        preferredContactMethod,
        attachments
      });
      setMessage('🎉 Thank you for your report! Your complaint has been successfully submitted and will be reviewed shortly. You can track its progress under "My Complaints". We appreciate your contribution to our community!');
      // Reset form
      setCategory('');
      setLocation('');
      setDescription('');
      setPhoneNumber('');
      setDistrict('');
      setSector('');
      setCell('');
      setVillage('');
      setIncidentDate('');
      setUrgencyLevel('normal');
      setGpsCoordinates('');
      setPreferredContactMethod('email');
      setAttachments([]);
      setTimeout(() => navigate('/citizen/complaints'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Submit a complaint</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Describe the issue; we may suggest similar existing cases.</p>
      {message && <div className="msg success">{message}</div>}
      {error && <div className="msg error">{error}</div>}
      {similar.length > 0 && (
        <div className="card" style={{ marginBottom: '1rem', background: '#fef3c7', border: '1px solid #f59e0b' }}>
          <strong>Similar open complaints</strong>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
            {similar.map((s) => <li key={s.id}>{s.reference_number} — {s.location} ({s.status})</li>)}
          </ul>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>You can still submit a new one or contact support to link to an existing case.</p>
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ maxWidth: 680 }}>
        <div className="form-group">
          <label>Category *</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Select category</option>
            {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Urgency Level *</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
            {URGENCY_LEVELS.map((level) => (
              <label key={level.value} style={{ display: 'flex', alignItems: 'center', padding: '0.5rem', border: `1px solid ${urgencyLevel === level.value ? '#3b82f6' : '#d1d5db'}`, borderRadius: '0.375rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="urgency"
                  value={level.value}
                  checked={urgencyLevel === level.value}
                  onChange={(e) => setUrgencyLevel(e.target.value)}
                  style={{ marginRight: '0.5rem' }}
                />
                <div>
                  <strong>{level.label}</strong>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{level.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Incident Date *</label>
          <input 
            type="date" 
            value={incidentDate} 
            onChange={(e) => setIncidentDate(e.target.value)} 
            max={new Date().toISOString().split('T')[0]}
            required 
          />
        </div>

        <div className="form-group">
          <label>Phone Number (Optional)</label>
          <input 
            type="tel" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
            placeholder="+250 7XX XXX XXX"
          />
        </div>

        <div className="form-group">
          <label>Location Details *</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
            <input 
              type="text" 
              value={district} 
              onChange={(e) => setDistrict(e.target.value)} 
              placeholder="District *" 
              required 
            />
            <input 
              type="text" 
              value={sector} 
              onChange={(e) => setSector(e.target.value)} 
              placeholder="Sector *" 
              required 
            />
            <input 
              type="text" 
              value={cell} 
              onChange={(e) => setCell(e.target.value)} 
              placeholder="Cell *" 
              required 
            />
            <input 
              type="text" 
              value={village} 
              onChange={(e) => setVillage(e.target.value)} 
              placeholder="Village *" 
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label>General Location Description *</label>
          <input 
            type="text" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            placeholder="e.g. Near the main market, opposite the school" 
            required 
          />
        </div>

        <div className="form-group">
          <label>GPS Coordinates (Optional)</label>
          <input 
            type="text" 
            value={gpsCoordinates} 
            onChange={(e) => setGpsCoordinates(e.target.value)} 
            placeholder="e.g. -1.9441, 30.0619 or paste Google Maps link"
          />
          <small style={{ color: '#64748b', display: 'block', marginTop: '0.25rem' }}>
            Paste GPS coordinates or Google Maps link for precise location
          </small>
        </div>

        <div className="form-group">
          <label>Preferred Contact Method *</label>
          <select value={preferredContactMethod} onChange={(e) => setPreferredContactMethod(e.target.value)} required>
            {CONTACT_METHODS.map((method) => (
              <option key={method} value={method}>
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Description of Issue *</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Please provide detailed information about the issue, including when it started, how it affects you, and any other relevant details..."
            rows={6}
            required 
          />
        </div>

        <div className="form-group">
          <label>📷 Attach Photos/Files (Optional)</label>
          <div style={{ border: '1px dashed #d1d5db', borderRadius: '0.375rem', padding: '1rem', textAlign: 'center' }}>
            <input
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.doc"
              onChange={handleImageUpload}
              disabled={uploading}
              style={{ display: 'none' }}
              id="file-upload"
            />
            <label 
              htmlFor="file-upload"
              style={{ 
                cursor: 'pointer', 
                padding: '0.5rem 1rem', 
                background: '#f3f4f6', 
                borderRadius: '0.375rem',
                display: 'inline-block'
              }}
            >
              {uploading ? '⏳ Uploading...' : '📁 Choose Files or Take Photos'}
            </label>
            <small style={{ display: 'block', marginTop: '0.5rem', color: '#64748b' }}>
              Supported: Images (JPG, PNG), Documents (PDF, DOC) - Max 5MB per file
            </small>
          </div>
          
          {attachments.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <strong>Uploaded Files:</strong>
              {attachments.map((file, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '0.5rem', 
                  background: '#f9fafb', 
                  borderRadius: '0.25rem', 
                  marginTop: '0.5rem' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {file.type.startsWith('image/') ? (
                      <img 
                        src={file.url} 
                        alt={file.name}
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '0.25rem' }}
                      />
                    ) : (
                      <span style={{ fontSize: '1.5rem' }}>📄</span>
                    )}
                    <span style={{ fontSize: '0.9rem' }}>{file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    style={{ 
                      background: '#ef4444', 
                      color: 'white', 
                      border: 'none', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem', 
                      cursor: 'pointer' 
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
}
