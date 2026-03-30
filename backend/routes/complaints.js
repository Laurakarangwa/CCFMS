const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const { auditAction } = require('../middleware/audit');
const ctrl = require('../controllers/complaintController');

const router = express.Router();

router.get('/similar', auth, ctrl.checkDuplicate);

router.use(auth);

router.post('/', requireRole('citizen', 'agent'), auditAction('complaint_submit', 'complaint'), ctrl.create);
router.get('/', ctrl.list);
router.get('/my-assigned', requireRole('officer', 'supervisor'), ctrl.list);
router.get('/:id', ctrl.getById);
router.patch('/:id/assign', requireRole('admin', 'supervisor'), auditAction('complaint_assign', 'complaint'), ctrl.assign);
router.patch('/:id/status', requireRole('admin', 'supervisor', 'officer'), auditAction('complaint_status', 'complaint'), ctrl.updateStatus);

module.exports = router;
