const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
    getAllEvents,
    getEventById,
    getMyEvents,
    getMyEventsAnalytics,
    createEvent,
    updateEvent,
    deleteEvent,
    approveOrReject
} = require('../controllers/EventController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { isAdmin, isOrganizer, isOrganizerOrAdmin } = require('../middlewares/roleMiddleware');

// Validation middleware
const validateEvent = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('ticket_price').isFloat({ min: 0 }).withMessage('Valid ticket price is required'),
    body('total_tickets').isInt({ min: 1 }).withMessage('Valid number of tickets is required'),
];

// Protected routes - Apply authentication to all routes below
router.use(verifyToken);

// Organizer routes - These must come before the :id route to avoid conflicts
router.get('/organizer/my-events', isOrganizer, getMyEvents);
router.get('/organizer/analytics', isOrganizer, getMyEventsAnalytics);

// Event management routes
router.post('/', isOrganizerOrAdmin, validateEvent, createEvent);
router.put('/:id', isOrganizerOrAdmin, validateEvent, updateEvent);
router.delete('/:id', isOrganizerOrAdmin, deleteEvent);

// Public routes - These should be at the bottom to avoid conflicts with other routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Admin only routes
router.patch('/:id/status', isAdmin, approveOrReject);

module.exports = router; 
