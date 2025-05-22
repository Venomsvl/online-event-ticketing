const Event = require('../model/Event');
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
        let events;

        // Admin sees everything
        if (req.user && req.user.role === "System Admin") {
            events = await Event.find();
        }
        // Organizer asks to see their own events only
        else if (req.user && req.user.role === "Organizer" && req.query.mine === "true") {
            events = await Event.find({
                $or: [{ event_status: "approved" }, { organizer: req.user._id }],
            });
        }
        // Everyone else (public, standard users, or organizer without ?mine)
        else {
            events = await Event.find({ event_status: "approved" });
        }

        res.status(200).json(events);
    }),

    // Get event by ID with role-based access
    getEventById: asyncHandler(async (req, res) => {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Admin can access everything
        if (req.user && req.user.role === "System Admin") {
            return res.status(200).json(event);
        }

        // Organizer can access if it's approved OR if it's their own event
        if (req.user && req.user.role === "Organizer" &&
            (event.event_status === "approved" || event.organizer.toString() === req.user._id.toString())) {
            return res.status(200).json(event);
        }

        // Public or standard users can only access approved events
        if (event.event_status === "approved") {
            return res.status(200).json(event);
        }

        // Otherwise, forbidden
        return res.status(403).json({ message: "You are not authorized to view this event" });
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

    // Update an existing event
    updateEvent: asyncHandler(async (req, res) => {
        const event = await Event.findById(req.params.id);

        if (!event) return res.status(404).json({ message: "Event not found" });

        const isAdmin = req.user.role === "System Admin";
        const isOrganizer = event.organizer.toString() === req.user._id.toString();

        if (!isAdmin && !isOrganizer) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Update fields if provided
        const fields = [
            "title",
            "description",
            "date",
            "location",
            "category",
            "image",
            "ticket_price",
            "total_tickets",
        ];

        // Optional: Adjust remaining_tickets if total_tickets is updated
        if (req.body.total_tickets) {
            const ticketsSold = event.total_tickets - event.remaining_tickets;
            event.total_tickets = req.body.total_tickets;
            event.remaining_tickets = req.body.total_tickets - ticketsSold;
        }

        fields.forEach((field) => {
            if (req.body[field] !== undefined) {
                event[field] = req.body[field];
            }
        });

        if (req.body.event_status !== undefined) {
            if (isAdmin) {
                if (!["approved", "pending", "declined"].includes(req.body.event_status)) {
                    return res.status(400).json({ message: "Invalid status value" });
                }
                event.event_status = req.body.event_status;
            } else {
                return res.status(403).json({ message: "Not authorized to change status" });
            }
        }

        await event.save();
        res.status(200).json(event);
    }),

    // Delete an event (Organizer or System Admin)
    deleteEvent: asyncHandler(async (req, res) => {
        const event = await Event.findById(req.params.id);

        if (!event) return res.status(404).json({ message: "Event not found" });

        if (req.user.role !== "System Admin" && event.organizer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await event.deleteOne();
        res.status(200).json({ message: "Event deleted" });
    }),

    // Get events created by the authenticated organizer
    getMyEvents: asyncHandler(async (req, res) => {
        const events = await Event.find({ organizer: req.user._id });
        res.status(200).json(events);
    }),

    // Get analytics for organizer's events
    getMyEventsAnalytics: asyncHandler(async (req, res) => {
        const events = await Event.find({ organizer: req.user._id });

        const analytics = events.map((e) => ({
            title: e.title,
            percentBooked: e.total_tickets === 0 ? 0 : Math.round(((e.total_tickets - e.remaining_tickets) / e.total_tickets) * 100),
        }));

        res.status(200).json(analytics);
    })
};

module.exports = EventController;