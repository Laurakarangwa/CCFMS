import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Notepad() {
  const [notes, setNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const { data } = await api.get('/notepad');
      if (data && data.notes) {
        setSavedNotes(data.notes);
      }
    } catch (err) {
      console.error('Failed to load notes:', err);
    }
  };

  const saveNotes = async () => {
    if (!notes.trim()) {
      setMessage('Cannot save empty notes');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    setLoading(true);
    try {
      await api.post('/notepad', { notes: notes.trim() });
      await loadNotes();
      setMessage('✅ Notes saved successfully!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('❌ Failed to save notes');
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await api.delete(`/notepad/${noteId}`);
      await loadNotes();
      setMessage('✅ Note deleted successfully!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('❌ Failed to delete note');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        padding: '1rem', 
        borderBottom: '1px solid #e5e7eb', 
        background: '#fff',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.125rem' }}>📝 Notepad</h3>
          <div>
            <button
              onClick={saveNotes}
              disabled={loading}
              className="btn btn-primary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              {loading ? '💾 Saving...' : '💾 Save Notes'}
            </button>
          </div>
        </div>
        
        {message && (
          <div style={{
            padding: '0.5rem',
            borderRadius: '0.25rem',
            background: message.includes('✅') ? '#f0fdf4' : '#fef2f2',
            color: message.includes('✅') ? '#166534' : '#dc2626',
            marginBottom: '0.5rem',
            fontSize: '0.875rem'
          }}>
            {message}
          </div>
        )}
        
        <small style={{ color: '#64748b' }}>
          Write notes, reminders, or tasks here. Notes are automatically saved and synced across devices.
        </small>
      </div>

      <div style={{ 
        flex: 1, 
        display: 'flex', 
        background: '#f9fafb',
        overflow: 'hidden'
      }}>
        {/* Main Notes Area */}
        <div style={{ flex: 1, padding: '1rem' }}>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Start typing your notes here...

📋 Tasks & Reminders:
• Follow up on complaint #123
• Call department about water issue
• Review urgent cases this week

📝 Meeting Notes:
• Team meeting - Friday 2PM
• Discuss new complaint procedures

💡 Ideas & Improvements:
• Consider adding SMS notifications
• Improve response time tracking
• Create better escalation system

You can use this space for:
• Quick notes during phone calls
• Task lists and reminders  
• Meeting minutes
• Important information to remember later
• Draft responses or templates

Your notes are private and automatically saved!"
            style={{
              width: '100%',
              height: '100%',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              padding: '0.75rem',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              resize: 'none',
              fontFamily: 'monospace'
            }}
          />
        </div>

        {/* Saved Notes Sidebar */}
        <div style={{ 
          width: '300px', 
          borderLeft: '1px solid #e5e7eb', 
          background: '#fff',
          overflow: 'auto'
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>📚 Saved Notes</h4>
          </div>
          
          {savedNotes.length > 0 ? (
            <div style={{ padding: '0 1rem' }}>
              {savedNotes.map((note) => (
                <div key={note.id} style={{
                  marginBottom: '0.75rem',
                  padding: '0.5rem',
                  background: '#f8fafc',
                  borderRadius: '0.25rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <small style={{ color: '#64748b', fontSize: '0.75rem' }}>
                      {new Date(note.created_at).toLocaleDateString()} {new Date(note.created_at).toLocaleTimeString()}
                    </small>
                    <button
                      onClick={() => deleteNote(note.id)}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '0.125rem 0.25rem',
                        borderRadius: '0.125rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: '#374151',
                    maxHeight: '100px',
                    overflow: 'hidden'
                  }}>
                    {note.notes.substring(0, 200)}
                    {note.notes.length > 200 && '...'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
              <p>No saved notes yet</p>
              <small>Start typing and save your first note!</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
