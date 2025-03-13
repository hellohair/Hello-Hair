// server/models/Community.js
const mongoose = require('mongoose');

const CommunitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String, default: 'Public' }, // e.g., "Public" or "Private"
  locked: { type: Boolean, default: false },  // true if the community is locked
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Community', CommunitySchema);
