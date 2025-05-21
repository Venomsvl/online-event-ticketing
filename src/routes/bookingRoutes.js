const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Create a new booking
router.post('/', async (req, res) => {
    console.log('Received booking request:', req.body);
    try {
        // Format the data before creating the booking
        const formattedData = {
            eventId: req.body.eventId,
            ticketType: req.body.ticketType.toLowerCase(),
            quantity: parseInt(req.body.quantity),
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            totalAmount: req.body.totalAmount,
            bookingStatus: 'PENDING',
            totalPrice: parseFloat(req.body.totalAmount.replace('$', '')),
            ticketsBooked: parseInt(req.body.quantity),
            userId: 'guest'
        };

        console.log('Formatted booking data:', formattedData);
        
        const booking = new Booking(formattedData);
        console.log('Created booking object:', booking);
        
        const savedBooking = await booking.save();
        console.log('Booking saved successfully:', savedBooking);
        
        res.status(201).json({ 
            success: true, 
            message: 'Booking created successfully',
            booking: savedBooking
        });
    } catch (error) {
        console.error('Detailed booking error:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        
        res.status(500).json({ 
            success: false, 
            message: 'Error creating booking: ' + error.message,
            error: error.message 
        });
    }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }
        res.json({
            success: true,
            booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching booking',
            error: error.message
        });
    }
});

module.exports = router;
