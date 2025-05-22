const express = require('express');
const router = express.Router();
const { createBooking, viewBookingById, deleteBooking } = require('../Controllers/bookingController');

router.post('/', createBooking); 
router.get('/:id', viewBookingById); 
router.delete('/:id', deleteBooking); 

module.exports = router;
