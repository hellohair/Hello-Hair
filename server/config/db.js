// config/db.js

require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use MONGO_URI from environment variables
    console.log('MONGO_URI:', process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Stop the app if DB fails to connect
  }
};

module.exports = connectDB;
