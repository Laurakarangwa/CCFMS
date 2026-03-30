const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/departmentController');

const router = express.Router();
router.get('/', auth, ctrl.list);
router.post('/', auth, requireRole('admin'), ctrl.create);
module.exports = router;
