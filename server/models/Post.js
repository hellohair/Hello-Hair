// models/Post.js
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  description: String,
  mediaUrl: String,       // File or link
  hairType: String,
  porosity: String,
  density: String,
  thickness: String,
  curlShape: String,
  styleOccasion: String,
  audience: String,       // e.g. "Children", "Teens", "Adults", "All"
  visibility: String,     // e.g. "Private", "Unlisted", "Public"
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
