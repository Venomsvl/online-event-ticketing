const mongoose = require('mongoose');
const User = require('./User'); // Ensure the correct path to the user model

const eventSchema = mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    date: {
        type: Date,
        require: true,
    },
    location: {
        type: String,
        require: true,
    },
    category: {
        type: String,
        require: true,
    },
    image: {
        type: String,
        require: false,
    },
    ticket_price: {
        type: Number,
        require: true,
    },
    total_tickets: {
        type: Number,
        require: true
    },
 
})
const Event = mongoose.model('Event',eventSchema);
module.exports = Event;