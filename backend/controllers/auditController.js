const AuditLog = require('../models/AuditLog');

async function list(req, res) {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 100, 500);
    const filters = {};
    if (req.query.user_id) filters.userId = req.query.user_id;
    if (req.query.action) filters.action = req.query.action;
    const logs = await AuditLog.list(filters, limit);
    return res.json(logs);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to list audit logs' });
  }
}

module.exports = { list };
