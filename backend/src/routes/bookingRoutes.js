const express = require('express');
const router = express.Router();
const {
    createBooking,
    getUserBookings,
    getBookingDetails,
    cancelBooking
} = require('../controllers/BookingController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Protected routes
router.post('/', verifyToken, createBooking);
router.get('/my-bookings', verifyToken, getUserBookings);
router.get('/:id', verifyToken, getBookingDetails);
router.put('/:id/cancel', verifyToken, cancelBooking);

module.exports = router;
