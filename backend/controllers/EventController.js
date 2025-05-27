const Event = require('../models/Event');

const EventController = {
  // Get all events (public)
  getAllEvents: async (req, res) => {
    try {
      const events = await Event.find({ status: 'approved' });
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get event by ID
  getEventById: async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get events created by the authenticated user
  getMyEvents: async (req, res) => {
    try {
      const events = await Event.find({ organizer: req.user._id });
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get analytics for user's events
  getMyEventsAnalytics: async (req, res) => {
    try {
      const events = await Event.find({ organizer: req.user._id });
      const analytics = events.map(event => ({
        title: event.title,
        ticketsSold: event.total_tickets - event.remaining_tickets,
        totalTickets: event.total_tickets,
        revenue: (event.total_tickets - event.remaining_tickets) * event.ticket_price
      }));
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new event
  createEvent: async (req, res) => {
    try {
      const event = new Event({
        ...req.body,
        organizer: req.user._id,
        remaining_tickets: req.body.total_tickets,
        status: 'pending'
      });
      const savedEvent = await event.save();
      res.status(201).json(savedEvent);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update an event
  updateEvent: async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // Check if user is the organizer
      if (event.organizer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      // Update remaining_tickets if total_tickets is being updated
      if (req.body.total_tickets) {
        const ticketsSold = event.total_tickets - event.remaining_tickets;
        req.body.remaining_tickets = req.body.total_tickets - ticketsSold;
      }

      const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        { ...req.body },
        { new: true }
      );
      res.json(updatedEvent);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete an event
  deleteEvent: async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // Check if user is the organizer
      if (event.organizer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      await event.remove();
      res.json({ message: 'Event deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = EventController; 