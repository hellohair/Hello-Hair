require('dotenv').config({ path: __dirname + '/.env' });
console.log(process.env);
const cors = require('cors'); // Import CORS

const express = require('express');
const connectDB = require('./config/db');
const hairProfileRoutes = require('./routes/hairProfileRoutes');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const communityRoutes = require('./routes/communityRoutes');
const postRoutes = require('./routes/postRoutes');
const curlQuizRoutes = require('./routes/curlQuizRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();

app.use(cors()); // Use CORS

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/curl-quiz', curlQuizRoutes);
app.use('/api/hair-profile', hairProfileRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
