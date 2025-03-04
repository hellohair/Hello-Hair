const mongoose = require('mongoose');

const CurlQuizSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizName: { type: String, required: true },
  answers: { type: Object, required: true },
  result: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('CurlQuiz', CurlQuizSchema);
