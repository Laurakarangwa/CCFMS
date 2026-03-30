const express = require('express');
const { auth } = require('../middleware/auth');
const ctrl = require('../controllers/profileController');

const router = express.Router();

router.use(auth);

router.patch('/profile', ctrl.updateProfile);
router.patch('/password', ctrl.changePassword);
router.patch('/profile-picture', ctrl.updateProfilePicture);

module.exports = router;
