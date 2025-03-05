const express = require('express');
const router = express.Router();
const { getProfile, toggleFollow } = require('../controllers/profileController');

router.get('/:userId', getProfile);
router.post('/follow/:userId', toggleFollow); // ✅ Follow/Unfollow a user

module.exports = router;
