const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:3001', 'http://localhost:3002'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/event-ticketing')
    .then(() => {
        console.log('Connected to MongoDB');
        console.log('Database: event-ticketing');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit if cannot connect to database
    });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});