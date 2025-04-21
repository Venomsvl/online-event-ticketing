const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
app.use(express.json());
const bookingRoutes = require('./src/routes/bookingRoutes');
app.use('/api/v1/bookings', bookingRoutes);
console.log(bookingRoutes);
// Routes
app.use(authRoutes);
app.use(userRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/online-event-ticketing')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB', err));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
