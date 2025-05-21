const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const errorHandler = require('./src/middlewares/errorHandler');
const cors = require('cors');
const cookieParser = require('cookie-parser');

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

// Routes
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
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/event-ticketing', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
    console.log('Database:', mongoose.connection.db.databaseName);
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if cannot connect to database
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
