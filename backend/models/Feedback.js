const pool = require('../config/db');

module.exports = {
  async create({ complaintId, citizenId, rating, comment }) {
    const r = await pool.query(
      `INSERT INTO feedback (complaint_id, citizen_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *`,
      [complaintId, citizenId, rating, comment || null]
    );
    return r.rows[0];
  },
  async getByComplaint(complaintId) {
    const r = await pool.query('SELECT * FROM feedback WHERE complaint_id = $1', [complaintId]);
    return r.rows[0];
  },
};
