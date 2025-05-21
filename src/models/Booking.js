const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    ticketType: {
        type: String,
        required: true,
        enum: ['standard', 'vip']
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    totalAmount: {
        type: String,
        required: true
    },
    bookingStatus: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
        default: 'PENDING',
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    ticketsBooked: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        default: 'guest',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

if (mongoose.models.Booking) {
    delete mongoose.models.Booking;
}

module.exports = mongoose.model('Booking', bookingSchema); 