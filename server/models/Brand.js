const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  // A field to store educational content or links to it
  content: { type: String },
  // Additional fields like logo, website, etc.
}, { timestamps: true });

module.exports = mongoose.model('Brand', BrandSchema);
