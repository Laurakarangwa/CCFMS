const Feedback = require('../models/Feedback');
const pool = require('../config/db');

async function submit(req, res) {
  try {
    const { complaint_id, rating, comment } = req.body;
    if (!complaint_id || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Complaint ID and rating (1-5) are required' });
    }
    const comp = await pool.query('SELECT id, citizen_id, status FROM complaints WHERE id = $1', [complaint_id]);
    const c = comp.rows[0];
    if (!c) return res.status(404).json({ message: 'Complaint not found' });
    if (c.citizen_id !== req.user.id) return res.status(403).json({ message: 'Not your complaint' });
    if (c.status !== 'resolved' && c.status !== 'closed') {
      return res.status(400).json({ message: 'Feedback only after complaint is resolved or closed' });
    }
    const existing = await Feedback.getByComplaint(complaint_id);
    if (existing) return res.status(400).json({ message: 'Feedback already submitted for this complaint' });
    const feedback = await Feedback.create({ complaintId: complaint_id, citizenId: req.user.id, rating, comment });
    return res.status(201).json(feedback);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to submit feedback' });
  }
}

async function getByComplaint(req, res) {
  try {
    const feedback = await Feedback.getByComplaint(req.params.complaintId);
    if (!feedback) return res.status(404).json({ message: 'No feedback for this complaint' });
    return res.json(feedback);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to get feedback' });
  }
}

module.exports = { submit, getByComplaint };
