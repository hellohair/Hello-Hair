const mongoose = require('mongoose');

const CommunitySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]  // Store user references
}, { timestamps: true });

module.exports = mongoose.model('Community', CommunitySchema);
