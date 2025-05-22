const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
    },
    used: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Add index for faster queries and automatic expiration
passwordResetSchema.index({ email: 1, otp: 1 });
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);

module.exports = PasswordReset;