//Muna's Part
const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const bookingSchema = new Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tickets: [{
        type: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    bookingDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
bookingSchema.index({ event: 1, user: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ paymentStatus: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
