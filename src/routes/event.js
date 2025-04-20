const express = require('express');
const router = express.Router();
const { 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  getAnalytics 
} = require('../controllers/eventController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');


// Organizers can create new event
router.post('/', verifyToken, checkRole(['organizer']), createEvent);

// Organizers/Admins can edit event (only specific fields!)
router.put('/:id', verifyToken, checkRole(['organizer', 'admin']), updateEvent);

// Organizers/Admins can delete event
router.delete('/:id', verifyToken, checkRole(['organizer', 'admin']), deleteEvent);

// Organizers can view their own event analytics
router.get('/user/analytics', verifyToken, checkRole(['organizer']), getAnalytics);

module.exports = router;
