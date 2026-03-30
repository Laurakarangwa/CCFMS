require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const feedbackRoutes = require('./routes/feedback');
const userRoutes = require('./routes/users');
const departmentRoutes = require('./routes/departments');
const auditRoutes = require('./routes/audit');
const uploadRoutes = require('./routes/upload');
const notepadRoutes = require('./routes/notepad');
const profileRoutes = require('./routes/profile');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/upload', uploadRoutes);
console.log('Upload routes mounted at /api/upload');
app.use('/api/notepad', notepadRoutes);
app.use('/api/profile', profileRoutes);

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'CCFMS API running' }));

pool.query('SELECT 1').then(() => {
  console.log('PostgreSQL connected');
  app.listen(PORT, () => console.log(`CCFMS backend running on http://localhost:${PORT}`));
}).catch(err => {
  console.error('Database connection failed:', err.message);
  process.exit(1);
});
