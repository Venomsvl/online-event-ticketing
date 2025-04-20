const express = require('express');
const router = express.Router();
const Event = require('../model/Event');
const EventController = require('../Controllers/EventController');
const adminMiddleware = require('../middlewares/adminMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

//PLSSS DOUBLE CHECK
//**anyone can view posted events (point 1) 
router.get('/',EventController.viewPostedEvents);

//doublecheckkkkk
//**Only admins can approve or reject the event. (point 4)
router.put('/:id', authMiddleware, adminMiddleware, EventController.approveOrReject);


//just a test ignore this
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Test route works!' });
});


module.exports = router;
