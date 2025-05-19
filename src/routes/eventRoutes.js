const express = require('express');
const router = express.Router();
const EventController = require('../Controllers/EventController'); //iport event controller
const adminMiddleware = require('../middlewares/adminMiddleware'); //import the admin and auth middlewares
const authMiddleware = require('../middlewares/authMiddleware');


//anyone can view posted events (1) 
router.get('/',EventController.viewPostedEvents);


//Only admins can approve or reject the event. (4)
router.put('/:id', authMiddleware, adminMiddleware, EventController.approveOrReject);



module.exports = router;
