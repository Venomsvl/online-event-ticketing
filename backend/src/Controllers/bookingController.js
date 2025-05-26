const Event = require('../model/Event');
const Booking = require('../model/booking');
const mongoose = require('mongoose');

// Create a new booking
const createBooking = async (req, res) => {
    try {
        const { eventId, ticketType, quantity, name, email, phone } = req.body;
        
        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Calculate total amount
        const basePrice = event.price;
        const vipMultiplier = ticketType === 'vip' ? 2 : 1;
        const totalAmount = quantity * basePrice * vipMultiplier;

        const booking = new Booking({
            event: eventId,
            user: req.user.id,
            ticketType,
            quantity,
            totalAmount,
            name,
            email,
            phone
        });

        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('event')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get booking details
const getBookingDetails = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('event');
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user owns the booking or is admin
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Cancel booking
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user owns the booking
        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Check if booking can be cancelled (e.g., not too close to event)
        const event = await Event.findById(booking.event);
        const eventDate = new Date(event.date);
        const now = new Date();
        const hoursUntilEvent = (eventDate - now) / (1000 * 60 * 60);

        if (hoursUntilEvent < 24) {
            return res.status(400).json({ message: 'Cannot cancel booking within 24 hours of event' });
        }

        booking.status = 'cancelled';
        await booking.save();
        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createBooking,
    getUserBookings,
    getBookingDetails,
    cancelBooking
};
