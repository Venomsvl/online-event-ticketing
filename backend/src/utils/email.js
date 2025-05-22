const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Send email function
exports.sendEmail = async ({ to, subject, text, html }) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_FROM || 'noreply@event-ticketing.com',
            to,
            subject,
            text,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}; 