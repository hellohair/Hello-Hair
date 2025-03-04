const express = require('express');
const { submitCurlQuiz } = require('../controllers/curlQuizController');
const router = express.Router();

// POST endpoint to submit the curl quiz
router.post('/', submitCurlQuiz);

module.exports = router;
