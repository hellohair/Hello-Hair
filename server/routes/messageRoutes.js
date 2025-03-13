// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { sendMessage, getMessages, getContacts } = require('../controllers/messageController');

router.post('/', authMiddleware, sendMessage);
router.get('/:otherUserId', authMiddleware, getMessages);
router.get('/contacts', authMiddleware, getContacts);

module.exports = router;
