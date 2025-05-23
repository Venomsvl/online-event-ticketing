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

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Protected routes
router.get('/my/events', verifyToken, getMyEvents);
router.get('/my/analytics', verifyToken, getMyEventsAnalytics);

// Organizer-only routes
router.post('/', verifyToken, isOrganizer, createEvent);
router.put('/:id', verifyToken, isOrganizer, updateEvent);
router.delete('/:id', verifyToken, isOrganizer, deleteEvent);

// Admin-only routes
router.put('/:id/status', verifyToken, isAdmin, approveOrReject);

module.exports = router; 
