const jwt = require('jsonwebtoken');
const Booking = require('../model/booking');

// Middleware to verify the token
const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization'); // Get the Authorization header
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token after "Bearer"

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        req.user = decoded; // Attach the decoded user to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

// Middleware to check if the user owns the booking
const checkBookingOwner = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id); // Find the booking by ID
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if the logged-in user owns the booking
        if (booking.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: You do not own this booking' });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { verifyToken, checkBookingOwner };