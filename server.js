const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./src/routes/authRoutes'); // Import the updated authRoutes
const userRoutes = require('./src/routes/userRoutes'); // Ensure this file exports a valid router
const adminRoutes = require('./src/routes/adminRoutes'); // Ensure this file exports a valid router
const eventRoutes = require('./src/routes/eventRoutes'); // Ensure this file exports a valid router
const errorHandler = require('./src/middlewares/errorHandler'); // Ensure this file exports a valid middleware

const dotenv = require('dotenv');


dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes); // Auth routes
app.use("/api/v1/users", userRoutes); // User routes
app.use("/api/v1/admin", adminRoutes); // Admin routes
app.use("/api/v1/events", eventRoutes); // Event routes
app.use('/api/v1', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admin', adminRoutes); 

// Error handler
app.use(errorHandler);

// MongoDB
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/online-event-ticketing', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
