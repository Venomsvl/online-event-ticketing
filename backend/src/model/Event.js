const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({

    title : {
        type: String,
        require : true
    },
    description : {
        type : String,
        require : true
    },
    date : {
        type : Date,
        require : true

    },
    location: {
        type: String,
        require : true 
    },
    category: {
        type: String,
        require : true 
    },
    image: {
        type: String,
        require : false 
    },
    ticket_price:{
        type : Number,
        require : true 
    },
    total_tickets :{
        type: Number,
        require : true 
    },
    remaining_tickets:{
        type: Number,
        require: true
    },
    
    // Reference to the organizer (User)
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    
     //adding an event status field
    event_status:{
        type: String,
        enum: ['approved', 'pending', 'declined'],
        default: 'pending',
    },
    creator :{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        require: true
    },
    timestamp :{
        type: Date,
        require: true,
        default: Date.now
    }
})
const Event = mongoose.model('Event', eventSchema);
module.exports = Event;