const pool = require('../config/db');

async function updateProfile(req, res) {
  try {
    const { full_name, phone } = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      'UPDATE users SET full_name = $1, phone = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [full_name, phone, userId]
    );

    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update profile' });
  }
}

async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Get current password hash
    const userResult = await pool.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const bcrypt = require('bcryptjs');
    const currentPasswordMatch = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);

    if (!currentPasswordMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [newPasswordHash, userId]
    );

    return res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to change password' });
  }
}

async function updateProfilePicture(req, res) {
  try {
    const { profile_picture } = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      'UPDATE users SET profile_picture = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [profile_picture, userId]
    );

    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update profile picture' });
  }
}

module.exports = { updateProfile, changePassword, updateProfilePicture };
