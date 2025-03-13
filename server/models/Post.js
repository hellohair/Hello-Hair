// server/models/Post.js
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  createdAt: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // If null => home post; if set => community post
  community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', default: null },

  title: String,
  description: String,
  mediaUrl: String,
  hairType: String,
  porosity: String,
  density: String,
  thickness: String,
  curlShape: String,
  styleOccasion: String,
  audience: String,
  visibility: String,

  comments: [CommentSchema],
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
