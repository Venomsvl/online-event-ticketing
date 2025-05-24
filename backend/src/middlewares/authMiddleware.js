const jwt = require('jsonwebtoken');
const Booking = require('../model/Booking');
const secretKey = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware to verify the token
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, secretKey, (error, decoded) => {
        if (error) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
};

// Middleware to check if the user owns the booking
const checkBookingOwner = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: You do not own this booking' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { verifyToken, checkBookingOwner };