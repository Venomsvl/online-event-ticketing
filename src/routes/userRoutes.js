const express = require('express');
const { body } = require('express-validator');
const { getUserProfile, updateUserProfile } = require('../Controllers/UserController');
const { getMyEvents, getMyEventsAnalytics } = require('../Controllers/EventController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { isOrganizer } = require('../middlewares/roleMiddleware');
const router = express.Router();

// Profile routes
router.get('/profile', verifyToken, getUserProfile);
router.put(
    '/profile',
    [
        verifyToken,
        body('name').optional().isString().withMessage('Name must be a string'),
        body('email').optional().isEmail().withMessage('Invalid email')
    ],
    updateUserProfile
);

// Organizer-specific routes
router.get('/events', verifyToken, isOrganizer, getMyEvents);
router.get('/events/analytics', verifyToken, isOrganizer, getMyEventsAnalytics);

module.exports = router;