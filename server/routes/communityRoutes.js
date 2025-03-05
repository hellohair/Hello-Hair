const express = require('express');
const router = express.Router();
const { getCommunity, joinCommunity } = require('../controllers/communityController');

router.get('/:communityName', getCommunity); // ✅ Get community details with populated members
router.post('/join', joinCommunity); // ✅ Join community

module.exports = router;
