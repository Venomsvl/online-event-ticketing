const Event = require('../model/Event');


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
      const { id } = req.params;  //taking ad from request
      const stat= req.body.status; //taking status from request body
      try {
        const event = await Event.findByIdAndUpdate(id, { event_status: stat }, { new: true }); //update status by id
        if (!event) {
          return res.status(404).json({ message: 'Event not found' }); //if event not found throw msg
        }
        return res.status(200).json({ message: 'Event status updated successfully', event });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }
};

module.exports = EventController;