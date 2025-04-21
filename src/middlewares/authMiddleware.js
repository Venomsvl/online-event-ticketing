const jwt = require('jsonwebtoken');
const Booking = require('../model/booking');

// Middleware to verify the token
const verifyToken = (req, res, next) => {}
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log('[authMiddleware] Authorization Header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('[authMiddleware] Missing or malformed Authorization header');
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    console.log('[authMiddleware] Token extracted:', token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('[authMiddleware] Token verified:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('[authMiddleware] JWT Verification Error:', error.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
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
