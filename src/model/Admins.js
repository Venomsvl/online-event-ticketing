const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    emailPassword: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Admin', adminSchema);