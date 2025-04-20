const express = require('express');
const router = express.Router();
const { 
  getAllEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  changeEventStatus, 
  getAnalytics 
} = require('../controllers/eventController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// Anyone can view posted events
router.get('/', getAllEvents);

// Organizers can create new event
router.post('/', verifyToken, checkRole(['organizer']), createEvent);

// Organizers/Admins can edit event (only specific fields!)
router.put('/:id', verifyToken, checkRole(['organizer', 'admin']), updateEvent);

// Organizers/Admins can delete event
router.delete('/:id', verifyToken, checkRole(['organizer', 'admin']), deleteEvent);

// Admins can approve or reject events
router.patch('/:id/status', verifyToken, checkRole(['admin']), changeEventStatus);

// Organizers can view their own event analytics
router.get('/user/analytics', verifyToken, checkRole(['organizer']), getAnalytics);

module.exports = router;
