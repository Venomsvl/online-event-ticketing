const Event = require('../model/Event');


const EventController = {

//Anyone can view posted events.
    viewPostedEvents: async (req, res) => {
    try {
          const events = await Event.find({ event_status: 'approved' });
          return res.status(200).json(events);
        } catch (e) {
          return res.status(500).json({ message: e.message });
        }
    },

//doublecheck c
//Only admins can approve or reject the event.
    approveOrReject: async (req, res) => {
      const { id } = req.params;  
      const stat= req.body.status;
      try {
        const event = await Event.findByIdAndUpdate(id, { event_status: stat }, { new: true });
        if (!event) {
          return res.status(404).json({ message: 'Event not found' });
        }
        return res.status(200).json({ message: 'Event status updated successfully', event });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }
};

module.exports = EventController;