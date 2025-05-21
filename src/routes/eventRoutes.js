const express = require('express');
const router = express.Router();
const EventController = require('../Controllers/EventController');
const { verifyToken } = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Public routes
router.get('/', EventController.getAllEvents);
router.get('/:id', EventController.getEventById);

// Organizer-only routes
router.get('/my/events', verifyToken, roleMiddleware('organizer'), EventController.getMyEvents);
router.get('/my/analytics', verifyToken, roleMiddleware('organizer'), EventController.getMyEventsAnalytics);
router.post('/', verifyToken, roleMiddleware('organizer'), EventController.createEvent);
router.put('/:id', verifyToken, roleMiddleware('organizer'), EventController.updateEvent);
router.delete('/:id', verifyToken, roleMiddleware('organizer'), EventController.deleteEvent);

// Admin-only routes
router.put('/:id/status', verifyToken, roleMiddleware('admin'), EventController.approveOrReject);

module.exports = router;
