const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: true,
  },
  title: String,
  content: String,
  // In the future, you could store video links, images, etc.
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
