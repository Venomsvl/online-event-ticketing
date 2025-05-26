const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const jwt = require('jsonwebtoken');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Initialize express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/bookings', bookingRoutes);

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

// Backward compatibility for admin login
app.post('/api/auth/admin-login', (req, res) => {
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

// Error handling
app.use(notFound);
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
                'DELETE /api/v1/users/:id': 'Delete a user (Admin)',
                'GET /api/v1/users/bookings': 'Get user\'s bookings (Standard User)',
                'GET /api/v1/users/events': 'Get organizer\'s events (Event Organizer)',
                'GET /api/v1/users/events/analytics': 'Get event analytics (Event Organizer)'
            },
            bookings: {
                'POST /api/v1/bookings': 'Book tickets (Standard User)',
                'GET /api/v1/bookings/:id': 'Get booking details (Standard User)',
                'DELETE /api/v1/bookings/:id': 'Cancel a booking (Standard User)'
            },
            events: {
                'POST /api/v1/events': 'Create new event (Event Organizer)',
                'GET /api/v1/events': 'Get all events (Public)',
                'GET /api/v1/events/:id': 'Get event details (Public)',
                'PUT /api/v1/events/:id': 'Update event (Organizer or Admin)',
                'DELETE /api/v1/events/:id': 'Delete event (Organizer or Admin)'
            }
        }
    });
});

// Debug route to check database contents
app.get('/api/v1/debug/users', async (req, res) => {
    try {
        const User = require('./model/User');
        const users = await User.find({}).select('-password');
        res.json({
            message: 'Users found in database',
            database: 'event-ticketing',
            collection: 'users',
            count: users.length,
            users: users
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching users',
            error: error.message
        });
    }
});

// Debug route to check database connection
app.get('/api/v1/debug/db', async (req, res) => {
    try {
        const dbState = mongoose.connection.readyState;
        const dbName = mongoose.connection.name;
        
        res.json({
            message: 'Database connection status',
            connectionState: dbState === 1 ? 'Connected' : 'Not Connected',
            databaseName: dbName,
            host: mongoose.connection.host,
            port: mongoose.connection.port
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error checking database',
            error: error.message
        });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});