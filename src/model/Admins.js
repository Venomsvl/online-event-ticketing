const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    emailPassword: {
        type: String,
        required: true
    },
    name:  { // Moved inside the schema definition
        type: String,
        required: true
    }

}); 

const Admin=mongoose.model('Admin', adminSchema);
module.exports=Admin

