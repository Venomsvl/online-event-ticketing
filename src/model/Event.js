const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({

    title : {
        type: String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        required : true

    },
    location: {
        type: String,
        required : true 
    },
    category: {
        type: String,
        required : true 
    },
    image: {
        type: String,
        required : false 
    },
    ticket_price:{
        type : Number,
        required : true 
    },
    total_tickets :{
        type: Number,
        required : true 
    },
    remaining_tickets:{
        type: Number,
        required: true
    },
    
     //adding an event status field
    event_status:{
        type: String,
        enum: ['approved', 'pending', 'declined'],
        default: 'pending',
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})
const Event = mongoose.model('Event', eventSchema);
module.exports = Event;