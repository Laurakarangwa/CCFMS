const pool = require('../config/db');

module.exports = {
  async findByEmail(email) {
    const r = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return r.rows[0];
  },
  async findById(id) {
    const r = await pool.query(
      'SELECT id, email, full_name, phone, role, department_id, is_active, created_at FROM users WHERE id = $1',
      [id]
    );
    return r.rows[0];
  },
  async create({ email, passwordHash, fullName, phone, role, departmentId }) {
    const r = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, phone, role, department_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, full_name, phone, role, department_id, created_at`,
      [email, passwordHash, fullName, phone || null, role, departmentId || null]
    );
    return r.rows[0];
  },
  async list(filters = {}) {
    let q = 'SELECT u.id, u.email, u.full_name, u.phone, u.role, u.department_id, u.is_active, u.created_at, d.name as department_name FROM users u LEFT JOIN departments d ON u.department_id = d.id WHERE 1=1';
    const params = [];
    let i = 1;
    if (filters.role) { q += ` AND u.role = $${i}`; params.push(filters.role); i++; }
    if (filters.departmentId) { q += ` AND u.department_id = $${i}`; params.push(filters.departmentId); i++; }
    q += ' ORDER BY u.created_at DESC';
    const r = await pool.query(q, params);
    return r.rows;
  },
};
