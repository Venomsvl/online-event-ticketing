const Event = require('../models/Event');

// Get all approved events (public)
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: 'approved' });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};

// Create a new event (organizer only)
const createEvent = async (req, res) => {
    try {
        const event = new Event({
            ...req.body,
            creator: req.user._id,
            status: 'pending', // Default status for new events
        });
        await event.save();
        res.status(201).json({ message: 'Event created successfully', event });
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error: error.message });
    }
};

// Update an event (organizer/admin only)
const updateEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const updates = req.body;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Ensure only the creator or admin can update
        if (req.user.role !== 'admin' && req.user._id.toString() !== event.creator.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this event' });
        }

        // Restrict updates to specific fields
        const allowedUpdates = ['total_tickets', 'date', 'location'];
        for (const key in updates) {
            if (allowedUpdates.includes(key)) {
                event[key] = updates[key];
            }
        }

        await event.save();
        res.status(200).json({ message: 'Event updated successfully', event });
    } catch (error) {
        res.status(500).json({ message: 'Error updating event', error: error.message });
    }
};

// Delete an event (organizer/admin only)
const deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Ensure only the creator or admin can delete
        if (req.user.role !== 'admin' && req.user._id.toString() !== event.creator.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this event' });
        }

        await event.remove();
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
};

// Change the status of an event (admin only)
const changeEventStatus = async (req, res) => {
    try {
        const eventId = req.params.id;
        const { status } = req.body;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Ensure only admins can change the status
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to change event status' });
        }

        // Validate status
        if (!['pending', 'approved', 'declined'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        event.status = status;
        await event.save();
        res.status(200).json({ message: 'Event status updated successfully', event });
    } catch (error) {
        res.status(500).json({ message: 'Error updating event status', error: error.message });
    }
};

// Get analytics for organizer's events
const getAnalytics = async (req, res) => {
    try {
        const events = await Event.find({ creator: req.user._id });

        const analytics = events.map((event) => {
            const booked = event.total_tickets - event.remaining_tickets;
            const percentage = ((booked / event.total_tickets) * 100).toFixed(2);
            return {
                eventId: event._id,
                title: event.title,
                percentageBooked: `${percentage}%`,
            };
        });

        res.status(200).json({ analytics });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching analytics', error: error.message });
    }
};

module.exports = {
    getAllEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    changeEventStatus,
    getAnalytics,
};