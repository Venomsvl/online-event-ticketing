const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const EventController = require('../controllers/EventController');

// Public routes
router.get('/', EventController.getAllEvents);
router.get('/:id', EventController.getEventById);

// Protected routes (requires authentication)
router.get('/my/events', authMiddleware, EventController.getMyEvents);
router.get('/my/analytics', authMiddleware, EventController.getMyEventsAnalytics);

// Event management routes (requires authentication)
router.post('/', authMiddleware, EventController.createEvent);
router.put('/:id', authMiddleware, EventController.updateEvent);
router.delete('/:id', authMiddleware, EventController.deleteEvent);

module.exports = router; 