require('dotenv').config({ path: __dirname + '/.env' });
console.log(process.env);
const cors = require('cors'); // Import CORS

const express = require('express');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const communityRoutes = require('./routes/communityRoutes');
const postRoutes = require('./routes/postRoutes');
const quizRoutes = require('./routes/quizRoutes');

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
app.use('/api/quiz', quizRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
