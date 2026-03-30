// Run this script to create the first admin account
// Usage: node scripts/create-first-admin.js

const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function createFirstAdmin() {
  try {
    const adminEmail = 'admin@ccfms.rw';
    const adminPassword = 'admin123'; // Change this after first login
    const adminName = 'System Administrator';
    const adminPhone = '+250 788 123 456';

    console.log('Creating first admin account...');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('Name:', adminName);

    // Check if admin already exists
    const existingCheck = await pool.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    if (existingCheck.rows.length > 0) {
      console.log('Admin account already exists!');
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // Insert admin user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, phone, role, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())
       RETURNING id, email, full_name, role, is_active`,
      [adminEmail, passwordHash, adminName, adminPhone, 'admin']
    );

    console.log('✅ Admin account created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 Name:', adminName);
    console.log('🆔 User ID:', result.rows[0].id);
    console.log('');
    console.log('⚠️  IMPORTANT: Change the password after first login!');
    console.log('🔗 Login at: http://localhost:3000/login/admin');

  } catch (error) {
    console.error('❌ Error creating admin account:', error.message);
  } finally {
    await pool.end();
  }
}

createFirstAdmin();
