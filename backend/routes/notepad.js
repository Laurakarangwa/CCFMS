const express = require('express');
const { auth } = require('../middleware/auth');
const pool = require('../config/db');

const router = express.Router();

// Get user's notes
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM user_notes WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ notes: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notes' });
  }
});

// Save notes
router.post('/', auth, async (req, res) => {
  try {
    const { notes } = req.body;
    
    if (!notes || notes.trim().length === 0) {
      return res.status(400).json({ message: 'Notes cannot be empty' });
    }

    // Clear existing notes and save new ones
    await pool.query('DELETE FROM user_notes WHERE user_id = $1', [req.user.id]);
    
    const result = await pool.query(
      'INSERT INTO user_notes (user_id, notes, created_at) VALUES ($1, $2, NOW()) RETURNING *',
      [req.user.id, notes.trim()]
    );

    res.json({ success: true, note: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save notes' });
  }
});

// Delete specific note
router.delete('/:id', auth, async (req, res) => {
  try {
    const noteId = req.params.id;
    
    // Verify note belongs to user
    const noteCheck = await pool.query(
      'SELECT id FROM user_notes WHERE id = $1 AND user_id = $2',
      [noteId, req.user.id]
    );

    if (noteCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }

    await pool.query('DELETE FROM user_notes WHERE id = $1 AND user_id = $2', [noteId, req.user.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete note' });
  }
});

module.exports = router;
