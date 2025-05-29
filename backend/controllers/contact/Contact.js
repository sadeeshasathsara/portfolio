import SendEmail from '../../tools/SendEmail.js';
import ContactMessage from '../../models/ContactModel.js';

const Contact = async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const emailBody = `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
    `;

    // Try to send the email
    const result = await SendEmail(email, `Contact Form: ${subject}`, emailBody);

    // Save the message to the DB with the correct field names
    try {
        await ContactMessage.create({
            senderName: name,
            senderEmail: email,
            subject: subject,
            content: message,
            sent: result.success,
            error: result.success ? null : (result.error?.message || 'Unknown error')
        });
    } catch (dbError) {
        console.error('Failed to save contact message to DB:', dbError);
    }


    // Respond to the client
    if (result.success) {
        res.status(200).json({ message: 'Message sent successfully.' });
    } else {
        res.status(500).json({ message: 'Failed to send message. Please try again later.' });
    }
};

export default Contact;
