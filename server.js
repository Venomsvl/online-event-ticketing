const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const errorHandler = require('./src/middlewares/errorHandler');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Root route serves the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Register route
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);

// Hardcoded admin login route
const ADMIN_USERS = [
  { username: 'Lana', password: 'lana123' },
  { username: 'Salma', password: 'salma123' },
  { username: 'Muna', password: 'muna123' },
  { username: 'Party', password: 'party123' },
  { username: 'Aya', password: 'aya123' }
];

app.post('/api/auth/admin-login', (req, res) => {
  const { username, password } = req.body;
  const admin = ADMIN_USERS.find(
    (u) => u.username === username && u.password === password
  );
  if (admin) {
    return res.json({ success: true, role: 'admin', username });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }
});

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/event-ticketing')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Function to try different ports
const startServer = (initialPort) => {
  const server = app.listen(initialPort)
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${initialPort} is busy, trying ${initialPort + 1}...`);
        startServer(initialPort + 1);
      } else {
        console.error('Server error:', err);
      }
    })
    .on('listening', () => {
      const port = server.address().port;
      console.log(`Server is running on http://localhost:${port}`);
    });
};

// Start server with initial port
const initialPort = process.env.PORT || 3000;
startServer(initialPort);
