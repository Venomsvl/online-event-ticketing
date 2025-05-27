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
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
    origin: ['http://localhost:5173','http://localhost:5000', 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());

// Basic health check endpoint that doesn't require database
app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Replace these with your actual MongoDB Atlas credentials
const DB_USERNAME = ''; // Add your username here
const DB_PASSWORD = ''; // Add your password here

// MongoDB connection options
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
    w: 'majority'
};

// MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ayamohamed:aya12mohamed@cluster0.jwqcxk0.mongodb.net/event-ticketing';

// Connect to MongoDB with retry logic
const connectWithRetry = async () => {
    try {
        await mongoose.connect(MONGODB_URI, mongoOptions);
        console.log('Connected to MongoDB Atlas successfully');
        console.log('Database: event-ticketing');
        return true;
    } catch (err) {
        console.error('MongoDB connection error:', err);
        console.log('Retrying connection in 5 seconds...');
        return new Promise(resolve => {
            setTimeout(async () => {
                try {
                    await mongoose.connect(MONGODB_URI, mongoOptions);
                    console.log('Connected to MongoDB Atlas successfully');
                    console.log('Database: event-ticketing');
                    resolve(true);
                } catch (retryErr) {
                    console.error('MongoDB connection retry failed:', retryErr);
                    resolve(false);
                }
            }, 5000);
        });
    }
};

// Connect to MongoDB before setting up routes
connectWithRetry().then((connected) => {
    if (connected) {
        // API v1 Routes
        app.use('/api/v1', authRoutes);           // Auth routes: /api/v1/register, /api/v1/login, etc.
        app.use('/api/v1/users', userRoutes);     // User routes: /api/v1/users/profile, etc.
        app.use('/api/v1/admin', adminRoutes);    // Admin routes
        app.use('/api/v1/events', eventRoutes);   // Event routes: /api/v1/events
        app.use('/api/v1/bookings', bookingRoutes); // Booking routes: /api/v1/bookings

        // Backward compatibility routes
        app.use('/api/auth', authRoutes);
        app.use('/api/users', userRoutes);
        app.use('/api/admin', adminRoutes);
        app.use('/api/events', eventRoutes);
        app.use('/api/bookings', bookingRoutes);
    } else {
        // If MongoDB connection fails, set up a route to inform clients
        app.use('/api', (req, res) => {
            res.status(503).json({
                error: 'Database Unavailable',
                message: 'The database connection failed. Please try again later.',
                details: 'Error connecting to MongoDB Atlas'
            });
        });
    }
});

// Rest of your code...
// JWT for admin authentication
const ADMIN_USERS = [
    { username: 'Lana', password: 'lana123' },
    { username: 'Salma', password: 'salma123' },
    { username: 'Muna', password: 'muna123' },
    { username: 'Party', password: 'party123' },
    { username: 'Aya', password: 'aya123' }
];

app.post('/api/v1/admin-login', (req, res) => {
    const { username, password } = req.body;
    const admin = ADMIN_USERS.find(
        (u) => u.username === username && u.password === password
    );
    if (admin) {
        // Generate JWT token for admin
        const token = jwt.sign(
            { id: 'admin-' + admin.username, role: 'admin', username: admin.username },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1h' }
        );

        // Set JWT as HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000 // 1 hour
        });

        return res.json({ success: true, role: 'admin', username: admin.username });
    } else {
        return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }
});

// Error handling middleware
app.use(errorHandler);

// API documentation route
app.get('/api/v1', (req, res) => {
    res.json({
        message: 'Online Event Ticketing API v1',
        version: '1.0.0',
        endpoints: {
            auth: {
                'POST /api/v1/register': 'Register a new user (Public)',
                'POST /api/v1/login': 'Login and return token (Public)',
                'PUT /api/v1/forgetPassword': 'Reset user password (Public)'
            },
            users: {
                'GET /api/v1/users': 'Get all users (Admin)',
                'GET /api/v1/users/profile': 'Get current user\'s profile (Authenticated)',
                'PUT /api/v1/users/profile': 'Update current user\'s profile (Authenticated)',
                'GET /api/v1/users/:id': 'Get user by ID (Admin)',
                'PUT /api/v1/users/:id': 'Update user\'s role (Admin)',
                'DELETE /api/v1/users/:id': 'Delete a user (Admin)'
            }
        }
    });
});

 const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});