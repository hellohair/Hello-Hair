const express = require('express');
const { updateHairProfile } = require('../controllers/hairProfileController');

const router = express.Router();

// PUT request to update hair profile
router.put('/update/:userId', updateHairProfile);

module.exports = router;
