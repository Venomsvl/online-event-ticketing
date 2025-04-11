//Muna's Part
const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const BookingSchema = new Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event', 
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now  
    },
    //Salma's Part
    ticketsBooked: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    bookingStatus: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        required: true
    }
});

module.exports = mongoose.model('Booking', BookingSchema);