const Event = require('../models/Event');
const asyncHandler = require('express-async-handler');

const EventController = {

//Anyone can view posted events. (1)
    viewPostedEvents: async (req, res) => {
    try {
          const events = await Event.find({ event_status: 'approved' }); //fetch events with an approved status
          return res.status(200).json(events);//return these events
        } catch (e) {
          return res.status(500).json({ message: e.message });
        }
    },


//Only admins can approve or reject the event. (4)
    approveOrReject: async (req, res) => {
      const { id } = req.params;  //taking id from request
      const status = req.body.status; //taking status from request body
      try {
        const event = await Event.findByIdAndUpdate(id, { event_status: status }, { new: true }); //update status by id
        if (!event) {
          return res.status(404).json({ message: 'Event not found' }); //if event not found throw msg
        }
        return res.status(200).json({ message: 'Event status updated successfully', event });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    },

    // Get all events with role-based access
    getAllEvents: asyncHandler(async (req, res) => {
        try {
            let query = {};
            
            // If not admin and requesting own events
            if (req.user?.role !== 'admin' && req.query.mine === 'true') {
                query.organizerId = req.user._id;
            }
            // If public access or regular user
            else if (!req.user || req.user.role === 'user') {
                query.status = 'PUBLISHED';
            }

            const events = await Event.find(query)
                .populate('organizerId', 'name email')
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                count: events.length,
                events
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching events',
                error: error.message
            });
        }
    }),

    // Get event by ID
    getEventById: asyncHandler(async (req, res) => {
        try {
            const event = await Event.findById(req.params.id)
                .populate('organizerId', 'name email');

            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: 'Event not found'
                });
            }

            // Check access rights
            if (event.status !== 'PUBLISHED' && 
                (!req.user || 
                (req.user.role !== 'admin' && 
                event.organizerId.toString() !== req.user._id.toString()))) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            res.status(200).json({
                success: true,
                event
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching event',
                error: error.message
            });
        }
    }),

    // Create a new event (Organizer only)
    createEvent: asyncHandler(async (req, res) => {
        const {
            title,
            description,
            date,
            location,
            category,
            image,
            ticket_price,
            total_tickets,
        } = req.body;

        const event = await Event.create({
            title,
            description,
            date,
            location,
            category,
            image,
            ticket_price,
            total_tickets,
            remaining_tickets: total_tickets,
            organizer: req.user._id,
            event_status: "pending", // default status for new events
        });

        res.status(201).json(event);
    }),

    // Update event
    updateEvent: asyncHandler(async (req, res) => {
        try {
            const event = await Event.findById(req.params.id);

            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: 'Event not found'
                });
            }

            // Check permissions
            if (req.user.role !== 'admin' && event.organizerId.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to update this event'
                });
            }

            // Update fields
            const updatableFields = [
                'title', 'description', 'date', 'time', 'location',
                'category', 'imageUrl', 'ticketTypes', 'status'
            ];

            updatableFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    event[field] = req.body[field];
                }
            });

            // Special handling for ticket updates
            if (req.body.totalTickets !== undefined) {
                const ticketDiff = req.body.totalTickets - event.totalTickets;
                event.totalTickets = req.body.totalTickets;
                event.remainingTickets = Math.max(0, event.remainingTickets + ticketDiff);
            }

            await event.save();

            res.status(200).json({
                success: true,
                message: 'Event updated successfully',
                event
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating event',
                error: error.message
            });
        }
    }),

    // Delete event
    deleteEvent: asyncHandler(async (req, res) => {
        try {
            const event = await Event.findById(req.params.id);

            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: 'Event not found'
                });
            }

            // Check permissions
            if (req.user.role !== 'admin' && event.organizerId.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to delete this event'
                });
            }

            await event.deleteOne();

            res.status(200).json({
                success: true,
                message: 'Event deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting event',
                error: error.message
            });
        }
    }),

    // Get organizer's events
    getMyEvents: asyncHandler(async (req, res) => {
        try {
            const events = await Event.find({ organizerId: req.user._id })
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                count: events.length,
                events
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching your events',
                error: error.message
            });
        }
    }),

    // Get analytics for organizer's events (or all events for admin)
    getMyEventsAnalytics: asyncHandler(async (req, res) => {
        let events;

        // If user is admin, get analytics for ALL events across all organizers
        if (req.user.role === 'admin') {
            // Get all events and populate organizer information
            events = await Event.find({}).populate('organizer', 'name email');
            
            const analytics = events.map((e) => ({
                name: e.title,  // Frontend expects 'name'
                ticketsSold: e.total_tickets - e.remaining_tickets,  // Calculate tickets sold
                totalTickets: e.total_tickets,  // Frontend expects 'totalTickets'
                price: e.ticket_price || 0,  // Frontend expects 'price'
                category: e.category,
                location: e.location,
                date: e.date,
                status: e.event_status,
                // Additional admin-specific fields
                organizer: e.organizer ? {
                    name: e.organizer.name,
                    email: e.organizer.email,
                    id: e.organizer._id
                } : null,
                eventId: e._id,
                revenue: (e.total_tickets - e.remaining_tickets) * (e.ticket_price || 0)
            }));

            return res.status(200).json(analytics);
        }

        // For regular organizers, find only their events
        events = await Event.find({ organizer: req.user._id });

        const analytics = events.map((e) => ({
            name: e.title,  // Frontend expects 'name'
            ticketsSold: e.total_tickets - e.remaining_tickets,  // Calculate tickets sold
            totalTickets: e.total_tickets,  // Frontend expects 'totalTickets'
            price: e.ticket_price || 0,  // Frontend expects 'price'
            category: e.category,
            location: e.location,
            date: e.date,
            status: e.event_status,
            eventId: e._id,
            revenue: (e.total_tickets - e.remaining_tickets) * (e.ticket_price || 0)
        }));

        res.status(200).json(analytics);
    })
};

module.exports = EventController;