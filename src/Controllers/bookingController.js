const Event = require('../model/event');
const Booking = require('../model/booking');
const mongoose = require('mongoose');

checkBooking = async (req, res) => {
    const { eventId, userId, ticketsBooked } = req.body;

    try {
        const event = await Event.findById(eventId); 
        
        if (!event) return res.status(400).json({ message: "Event Not Found!" });

        if (event.remaining_tickets < ticketsBooked) {
            return res.status(400).json({ message: 'Not enough tickets available' });
        }

        const totalPrice = ticketsBooked * event.ticket_price;
        const booking = await Booking.create({
            eventId,
            userId,
            ticketsBooked,
            totalPrice,
            bookingStatus: 'Confirmed',
        });

        event.remaining_tickets -= ticketsBooked;
        await event.save();

        res.status(201).json({ message: 'Booking successful', booking });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

viewBookingById = async (req, res) => {
    try {
        const { id: bookingId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({ message: 'Invalid booking ID' });
        }

        const booking = await Booking.findById(bookingId).populate('eventId').populate('userId');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message }); 
    }
};

deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        const event = await Event.findById(booking.eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        event.remaining_tickets += booking.ticketsBooked;
        await event.save();

        booking.bookingStatus = 'Cancelled';
        await booking.save();

        res.status(200).json({ message: 'Booking cancelled successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message }); 
    }
};
