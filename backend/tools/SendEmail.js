// mailer.js
import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Exportable function
const SendEmail = async (to, subject, body) => {
    const mailOptions = {
        from: `"Sathsara K. " <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        html: body,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return { success: true, info };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
};

// Exportable function
const SendEmailToMe = async (from, subject, body) => {
    const mailOptions = {
        from: from,
        to: `"Sathsara K. " <${process.env.EMAIL_USER}>`,
        subject: subject,
        html: body,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return { success: true, info };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
};

export default SendEmail;
