const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/userController');

const router = express.Router();
router.use(auth);
router.get('/me', ctrl.getMe);
router.get('/', requireRole('admin', 'supervisor'), ctrl.list);
router.post('/', requireRole('admin'), ctrl.create);
module.exports = router;
