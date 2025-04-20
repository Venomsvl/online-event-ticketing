const express = require('express');
const mongoose = require('mongoose');
<<<<<<< HEAD
=======
const dotenv = require('dotenv');
>>>>>>> origin/Lana-2
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const errorHandler = require('./src/middlewares/errorHandler');

<<<<<<< HEAD
const app = express();
app.use(express.json());
const bookingRoutes = require('./src/routes/bookingRoutes');
app.use('/api/v1/bookings', bookingRoutes);
console.log(bookingRoutes);
// Routes
app.use(authRoutes);
app.use(userRoutes);
=======
// Load environment variables
dotenv.config();

const app = express();
app.use(express.json()); // Middleware to parse JSON

// Routes
app.use('/api/v1', authRoutes); // Register auth routes under /api/v1
app.use('/api/v1/users', userRoutes); // User-related routes
>>>>>>> origin/Lana-2

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
<<<<<<< HEAD
mongoose.connect('mongodb://localhost:27017/online-event-ticketing')
=======
mongoose
    .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/online-event-ticketing', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
>>>>>>> origin/Lana-2
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB', err));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
<<<<<<< HEAD
});
=======
});
>>>>>>> origin/Lana-2
