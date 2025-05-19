const express = require('express');
const app = express();
const BookingRoutes = require('./routes/bookingRoutes'); // Fixed casing

app.use(express.json());
app.use('/api/bookings', BookingRoutes);

module.exports = app;