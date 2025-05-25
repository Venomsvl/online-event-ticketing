const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false,
        default: null
    },
    ticketTypes: [{
        type: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['DRAFT', 'PUBLISHED', 'CANCELLED'],
        default: 'DRAFT'
    },
    totalTickets: {
        type: Number,
        required: true,
        min: 1
    },
    remainingTickets: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

// Add a pre-save hook to set remainingTickets if not set
eventSchema.pre('save', function(next) {
    if (this.isNew && !this.remainingTickets) {
        this.remainingTickets = this.totalTickets;
    }
    next();
});

module.exports = mongoose.models.Event || mongoose.model('Event', eventSchema); 