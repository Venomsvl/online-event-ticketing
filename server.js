const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./src/routes/authRoutes'); // Import the updated authRoutes
const userRoutes = require('./src/routes/userRoutes'); // Ensure this file exports a valid router
const adminRoutes = require('./src/routes/adminRoutes'); // Ensure this file exports a valid router
const eventRoutes = require('./src/routes/eventRoutes'); // Ensure this file exports a valid router
const errorHandler = require('./src/middlewares/errorHandler'); // Ensure this file exports a valid middleware

const dotenv = require('dotenv');


dotenv.config();

const app = express();

// Middleware
app.use(express.json());
const bookingRoutes = require('./src/routes/bookingRoutes');
app.use('/api/v1/bookings', bookingRoutes);
console.log(bookingRoutes);
// Routes
app.use("/api/v1/auth", authRoutes); // Auth routes
app.use("/api/v1/users", userRoutes); // User routes
app.use("/api/v1/admin", adminRoutes); // Admin routes
app.use("/api/v1/events", eventRoutes); // Event routes
app.use('/api/v1', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admin', adminRoutes); 

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/event-ticketing')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send('API is running');
});
