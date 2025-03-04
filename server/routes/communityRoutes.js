const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, communityController.createCommunity);
router.get('/', communityController.getCommunities);
router.post('/join/:communityId', authMiddleware, communityController.joinCommunity);

module.exports = router;
