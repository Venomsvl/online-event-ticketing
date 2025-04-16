<<<<<<< HEAD
//Muna's Part
=======
>>>>>>> 7ab17e5c5ec851e13fd0ba7dbbb4f4cba546352e
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
<<<<<<< HEAD
        default: Date.now  
    },
    //Salma's Part
=======
        default: Date.now 
    } 
    //Salmas part
>>>>>>> 7ab17e5c5ec851e13fd0ba7dbbb4f4cba546352e
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
<<<<<<< HEAD
    }
});

module.exports = mongoose.model('Booking', BookingSchema);
=======
    },
    
});

module.exports = mongoose.model('Booking', BookingSchema);
>>>>>>> 7ab17e5c5ec851e13fd0ba7dbbb4f4cba546352e
