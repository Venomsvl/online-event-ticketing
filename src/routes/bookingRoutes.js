const express = require('express');
const router = express.Router();
const { createBooking, getBookingById, deleteBooking } = require('../controllers/bookingController');


router.post('/', createBooking);

router.get('/:id', getBookingById);

router.delete('/:id', deleteBooking);

module.exports = router;