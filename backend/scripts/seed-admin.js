/**
 * Run once to create an admin user: node scripts/seed-admin.js
 * Requires: npm install bcryptjs pg dotenv (or run from backend folder with dependencies)
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  const email = process.env.ADMIN_EMAIL || 'admin@ccfms.gov.rw';
  const password = process.env.ADMIN_PASSWORD || 'Admin123!';
  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    `INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, 'System Admin', 'admin')
     ON CONFLICT (email) DO NOTHING`,
    [email, hash]
  );
  console.log('Admin user ready:', email);
  await pool.end();
}

seed().catch((e) => { console.error(e); process.exit(1); });
