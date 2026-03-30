const pool = require('../config/db');

module.exports = {
  async create({ userId, action, entityType, entityId, details, ipAddress }) {
    await pool.query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address) VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId || null, action, entityType || null, entityId || null, details ? JSON.stringify(details) : null, ipAddress || null]
    );
  },
  async list(filters = {}, limit = 100) {
    let q = 'SELECT a.*, u.full_name, u.email FROM audit_logs a LEFT JOIN users u ON a.user_id = u.id WHERE 1=1';
    const params = [];
    let i = 1;
    if (filters.userId) { q += ` AND a.user_id = $${i}`; params.push(filters.userId); i++; }
    if (filters.action) { q += ` AND a.action = $${i}`; params.push(filters.action); i++; }
    q += ' ORDER BY a.created_at DESC LIMIT $' + i;
    params.push(limit);
    const r = await pool.query(q, params);
    return r.rows;
  },
};
