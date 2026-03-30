const pool = require('../config/db');

module.exports = {
  async list() {
    const r = await pool.query('SELECT * FROM departments ORDER BY name');
    return r.rows;
  },
  async findById(id) {
    const r = await pool.query('SELECT * FROM departments WHERE id = $1', [id]);
    return r.rows[0];
  },
  async create({ name, code, description }) {
    const r = await pool.query(
      `INSERT INTO departments (name, code, description) VALUES ($1, $2, $3)
       RETURNING *`,
      [name, code, description || null]
    );
    return r.rows[0];
  },
};
