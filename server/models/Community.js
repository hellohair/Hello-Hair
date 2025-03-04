const mongoose = require('mongoose');

const CommunitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  hairType: {
    type: String,
    enum: ['Straight', 'Wavy', 'Curly', 'Coily'],
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, { timestamps: true });

module.exports = mongoose.model('Community', CommunitySchema);
