const Department = require('../models/Department');

async function list(req, res) {
  try {
    const departments = await Department.list();
    return res.json(departments);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to list departments' });
  }
}

async function create(req, res) {
  try {
    const { name, code, description } = req.body;
    if (!name || !code) return res.status(400).json({ message: 'Name and code are required' });
    const department = await Department.create({ name, code, description });
    return res.status(201).json(department);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to create department' });
  }
}

module.exports = { list, create };
