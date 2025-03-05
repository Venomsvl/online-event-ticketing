const mongoose=require('mongoose');
const Schema=mongoose.Schema({
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
     ticketsBooked:{
         type:Number,
         required:true
     },
     totalPrice:{
        type:Number,
        required:true
    },
     bookingStatus:{
        type:String,
        enum:['Pending','Confirmed','Cancelled'],
        required:true
    },
    createdAt: { type: Date, default: Date.now }
});
module.exports=mongoose.model('Booking',booking);