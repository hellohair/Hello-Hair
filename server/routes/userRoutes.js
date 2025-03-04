const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/update-location', authMiddleware, userController.updateLocation);

module.exports = router;
