const express = require('express');
const { body } = require('express-validator');
const { getUserProfile, updateUserProfile } = require('../Controllers/UserController');
const { getMyEvents, getMyEventsAnalytics } = require('../Controllers/EventController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const router = express.Router();

// Profile routes
router.get('/profile', authMiddleware, getUserProfile);
router.put(
    '/profile',
    [
        authMiddleware,
        body('name').optional().isString().withMessage('Name must be a string'),
        body('email').optional().isEmail().withMessage('Invalid email')
    ],
    updateUserProfile
);

// Organizer-specific routes
router.get('/events', authMiddleware, roleMiddleware('Organizer'), getMyEvents);
router.get('/events/analytics', authMiddleware, roleMiddleware('Organizer'), getMyEventsAnalytics);

module.exports = router;