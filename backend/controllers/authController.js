const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { JWT_SECRET } = require('../middleware/auth');

const SALT_ROUNDS = 10;

async function register(req, res) {
  try {
    const { email, password, fullName, phone, role = 'citizen' } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: 'Email, password and full name are required' });
    }
    const existing = await User.findByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      email,
      passwordHash,
      fullName,
      phone,
      role: role === 'admin' ? 'citizen' : role,
    });
    await AuditLog.create({ userId: user.id, action: 'register', entityType: 'user', entityId: user.id });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({ user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role }, token });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Registration failed' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const pool = require('../config/db');
    const r = await pool.query('SELECT id, email, full_name, role, department_id, is_active, password_hash FROM users WHERE email = $1', [email]);
    const row = r.rows[0];
    if (!row) return res.status(401).json({ message: 'Invalid email or password' });
    const match = await bcrypt.compare(password, row.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid email or password' });
    if (!row.is_active) return res.status(403).json({ message: 'Account is inactive' });
    await AuditLog.create({ userId: row.id, action: 'login', entityType: 'user', entityId: row.id });
    const token = jwt.sign({ userId: row.id }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      user: {
        id: row.id,
        email: row.email,
        full_name: row.full_name,
        role: row.role,
        department_id: row.department_id,
      },
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Login failed' });
  }
}

module.exports = { register, login };
