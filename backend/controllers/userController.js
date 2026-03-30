const bcrypt = require('bcryptjs');
const User = require('../models/User');
const pool = require('../config/db');

const SALT_ROUNDS = 10;

async function getMe(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to get user' });
  }
}

async function list(req, res) {
  try {
    const filters = {};
    if (req.query.role) filters.role = req.query.role;
    if (req.query.department_id) filters.departmentId = req.query.department_id;
    const users = await User.list(filters);
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to list users' });
  }
}

async function create(req, res) {
  try {
    const { email, password, full_name, phone, role, department_id } = req.body;
    if (!email || !password || !full_name || !role) {
      return res.status(400).json({ message: 'Email, password, full name and role are required' });
    }
    const existing = await User.findByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      email,
      passwordHash,
      fullName: full_name,
      phone,
      role,
      departmentId: department_id || null,
    });
    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to create user' });
  }
}

module.exports = { getMe, list, create };
