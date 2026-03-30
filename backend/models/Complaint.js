const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

function refNum() {
  return 'CCF-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
}

module.exports = {
  refNum,
  async create({ 
    citizenId, 
    category, 
    location, 
    description, 
    attachments,
    phoneNumber,
    district,
    sector,
    cell,
    village,
    incidentDate,
    urgencyLevel,
    gpsCoordinates,
    preferredContactMethod
  }) {
    const ref = refNum();
    const r = await pool.query(
      `INSERT INTO complaints (
        reference_number, citizen_id, category, location, description, attachments,
        phone_number, district, sector, cell, village, incident_date, urgency_level,
        gps_coordinates, preferred_contact_method
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING *`,
      [
        ref, citizenId, category, location, description, JSON.stringify(attachments || []),
        phoneNumber || null, district || null, sector || null, cell || null, village || null,
        incidentDate || null, urgencyLevel || 'normal', gpsCoordinates || null,
        preferredContactMethod || 'email'
      ]
    );
    return r.rows[0];
  },
  async findById(id) {
    const r = await pool.query(
      `SELECT c.*, u_c.full_name as citizen_name, u_c.email as citizen_email,
              u_a.full_name as assigned_to_name, d.name as department_name
       FROM complaints c
       JOIN users u_c ON c.citizen_id = u_c.id
       LEFT JOIN users u_a ON c.assigned_to = u_a.id
       LEFT JOIN departments d ON c.assigned_department_id = d.id
       WHERE c.id = $1`,
      [id]
    );
    return r.rows[0];
  },
  async list(filters = {}) {
    let q = `SELECT c.*, u_c.full_name as citizen_name, u_c.email as citizen_email,
                    u_a.full_name as assigned_to_name, d.name as department_name
             FROM complaints c
             JOIN users u_c ON c.citizen_id = u_c.id
             LEFT JOIN users u_a ON c.assigned_to = u_a.id
             LEFT JOIN departments d ON c.assigned_department_id = d.id WHERE 1=1`;
    const params = [];
    let i = 1;
    if (filters.citizenId) { q += ` AND c.citizen_id = $${i}`; params.push(filters.citizenId); i++; }
    if (filters.assignedTo) { q += ` AND c.assigned_to = $${i}`; params.push(filters.assignedTo); i++; }
    if (filters.departmentId) { q += ` AND c.assigned_department_id = $${i}`; params.push(filters.departmentId); i++; }
    if (filters.status) { q += ` AND c.status = $${i}`; params.push(filters.status); i++; }
    q += ' ORDER BY c.created_at DESC';
    const r = await pool.query(q, params);
    return r.rows;
  },
  async updateStatus(id, status, resolutionNotes = null) {
    const updates = ['status = $2', 'updated_at = NOW()'];
    const params = [id, status];
    let i = 3;
    if (resolutionNotes !== null) { updates.push(`resolution_notes = $${i}`); params.push(resolutionNotes); i++; }
    if (status === 'resolved' || status === 'closed') updates.push('resolved_at = COALESCE(resolved_at, NOW())');
    if (status === 'closed') updates.push('closed_at = NOW()');
    const r = await pool.query(
      `UPDATE complaints SET ${updates.join(', ')} WHERE id = $1 RETURNING *`,
      params
    );
    return r.rows[0];
  },
  async assign(id, assignedTo, assignedDepartmentId) {
    const r = await pool.query(
      `UPDATE complaints SET assigned_to = $2, assigned_department_id = $3, status = 'assigned', assigned_at = NOW(), updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, assignedTo || null, assignedDepartmentId || null]
    );
    return r.rows[0];
  },
  async findSimilar(category, location, limit = 5) {
    const r = await pool.query(
      `SELECT id, reference_number, category, location, status, created_at
       FROM complaints
       WHERE category = $1 AND location ILIKE $2 AND status NOT IN ('closed')
       ORDER BY created_at DESC LIMIT $3`,
      [category, '%' + location + '%', limit]
    );
    return r.rows;
  },
};
