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
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
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

// API v1 Routes
app.use('/api/v1', authRoutes);           // Auth routes: /api/v1/register, /api/v1/login, etc.
app.use('/api/v1/users', userRoutes);     // User routes: /api/v1/users/profile, etc.
app.use('/api/v1/admin', adminRoutes);    // Admin routes
app.use('/api/v1/events', eventRoutes);   // Event routes: /api/v1/events
app.use('/api/v1/bookings', bookingRoutes); // Booking routes: /api/v1/bookings

// Backward compatibility routes (keep existing frontend working)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

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
                'DELETE /api/v1/users/:id': 'Delete a user (Admin)'
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('CORS enabled for frontend communication');
    console.log('API v1 endpoints available at http://localhost:' + PORT + '/api/v1');
});