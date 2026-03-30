const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/feedbackController');

const router = express.Router();
router.use(auth);
router.post('/', requireRole('citizen'), ctrl.submit);
router.get('/complaint/:complaintId', ctrl.getByComplaint);
module.exports = router;
