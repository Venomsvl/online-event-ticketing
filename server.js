const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const errorHandler = require('./src/middlewares/errorHandler');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/events", eventRoutes);

const bookingRoutes = require('./src/routes/bookingRoutes');
app.use('/api/v1/bookings', bookingRoutes);

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

app.get('/', (req, res) => {
    res.send('API is running');
});
