const express = require('express');
const router = express.Router();
const EventController = require('../Controllers/EventController');
const adminMiddleware = require('../middlewares/adminMiddleware');
const { verifyToken } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', EventController.getAllEvents);
router.get('/:id', EventController.getEventById);

// Protected routes for organizers
router.get('/my/events', verifyToken, EventController.getMyEvents);
router.get('/my/analytics', verifyToken, EventController.getMyEventsAnalytics);

// Organizer-only routes
router.post('/', verifyToken, EventController.createEvent);
router.put('/:id', verifyToken, EventController.updateEvent);
router.delete('/:id', verifyToken, EventController.deleteEvent);

// Admin-only route for approving/rejecting events
router.put('/:id/status', verifyToken, adminMiddleware, EventController.approveOrReject);

module.exports = router;
