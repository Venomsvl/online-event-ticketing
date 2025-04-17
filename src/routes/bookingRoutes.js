const express = require('express');
const router = express.Router();
const { createBooking, viewBookingById, deleteBooking } = require('../controllers/bookingController');

router.post('/', createBooking); 
router.get('/:id', viewBookingById); 
router.delete('/:id', deleteBooking); 

module.exports = router;
