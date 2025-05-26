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
    location: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false,
        default: null
    },
    ticket_price: {
        type: Number,
        required: true,
        min: 0
    },
    total_tickets: {
        type: Number,
        required: true,
        min: 1
    },
    remaining_tickets: {
        type: Number,
        required: true,
        min: 0
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event_status: {
        type: String,
        enum: ['pending', 'approved', 'declined'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Add a pre-save hook to set remaining_tickets if not set
eventSchema.pre('save', function(next) {
    if (this.isNew && !this.remaining_tickets) {
        this.remaining_tickets = this.total_tickets;
    }
    next();
});

// Add method to check ticket availability
eventSchema.methods.hasAvailableTickets = function(quantity) {
    return this.remaining_tickets >= quantity;
};

// Add method to book tickets
eventSchema.methods.bookTickets = function(quantity) {
    if (!this.hasAvailableTickets(quantity)) {
        throw new Error('Not enough tickets available');
    }
    this.remaining_tickets -= quantity;
    return this.save();
};

// Add method to release tickets (for cancellations)
eventSchema.methods.releaseTickets = function(quantity) {
    this.remaining_tickets = Math.min(this.total_tickets, this.remaining_tickets + quantity);
    return this.save();
};

module.exports = mongoose.models.Event || mongoose.model('Event', eventSchema); 