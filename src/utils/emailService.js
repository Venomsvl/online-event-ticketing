const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

// Example: SystemSettings model for storing system-wide configs like email credentials
const SystemSettings = mongoose.model('SystemSettings', new mongoose.Schema({
    email: String,
    emailPassword: String
}));

const sendEmail = async (to, subject, text) => {
    try {
        // Fetch the first system email credentials from the database
        const settings = await SystemSettings.findOne();
        if (!settings || !settings.email || !settings.emailPassword) {
            throw new Error('System email credentials not found in the database');
        }

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: settings.email,
                pass: settings.emailPassword
            }
        });

        const mailOptions = {
            from: settings.email,
            to,
            subject,
            text
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw error;
    }
};

module.exports = sendEmail;