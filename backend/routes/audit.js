const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/auditController');

const router = express.Router();
router.use(auth);
router.get('/', requireRole('admin'), ctrl.list);
module.exports = router;
