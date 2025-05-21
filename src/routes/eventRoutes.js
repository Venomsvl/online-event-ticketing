const express = require('express');
const router = express.Router();
const EventController = require('../Controllers/EventController'); //iport event controller
const adminMiddleware = require('../middlewares/adminMiddleware'); //import the admin and auth middlewares
const authMiddleware = require('../middlewares/authMiddleware');

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Protected routes
router.get('/my/events', authMiddleware, EventController.getMyEvents);
router.get('/my/analytics', authMiddleware, EventController.getMyEventsAnalytics);

// Organizer-only routes
router.post('/', authMiddleware, adminMiddleware, EventController.createEvent);
router.put('/:id', authMiddleware, adminMiddleware, EventController.updateEvent);
router.delete('/:id', authMiddleware, adminMiddleware, EventController.deleteEvent);

// Admin-only routes
router.put('/:id/status', authMiddleware, adminMiddleware, EventController.approveOrReject);

module.exports = router;
