-- Create first admin account
-- Run: psql -U postgres -d ccfms -f scripts/create-admin.sql

INSERT INTO users (
  email, 
  password_hash, 
  full_name, 
  phone, 
  role, 
  is_active, 
  created_at, 
  updated_at
) VALUES (
  'admin@ccfms.rw',
  '$2a$10$abcdefghijklmnopqrstuvwx', -- Change this password hash
  'System Administrator',
  '+250 788 123 456',
  'admin',
  true,
  NOW(),
  NOW()
);
