const express = require('express');
const app = express();
const bookingRoutes = require('./routes/bookingRoutes');

// Middleware
app.use(express.json());

// Register routes
app.use('/api/v1/bookings', bookingRoutes);

// ...existing code...
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});