const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bcrypt = require('bcrypt');

// Define the user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters']
    },
    role: {
        type: String,
        enum: ['user', 'organizer', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;           // Remove password from responses
            ret.id = ret._id;              // Add id alias
            delete ret._id;
            delete ret.__v;
        }
    }
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next(); // Skip hashing if the password is not modified
    }

    try {
        console.log('[User Model] Hashing password for:', this.email);
        this.password = await bcrypt.hash(this.password, 10);
        console.log('[User Model] Password hashed successfully');
        next();
    } catch (error) {
        next(error);
    }
});

// Instance method to compare plaintext password with hashed password
userSchema.methods.checkPassword = function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
};

// Ensure we don't redefine the model in hot-reloading environments
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
