const express = require('express');
const app = express();
const BookingRoutes = require('./Routes/BookingRoutes');

app.use(express.json());
app.use('/api/bookings', BookingRoutes);

module.exports = app;