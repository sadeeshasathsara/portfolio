import ContactMessage from '../../models/ContactModel.js';
import SendEmail from '../../tools/SendEmail.js';

// Reply to a message
const Reply = async (req, res) => {
    const { id } = req.params;
    const { content, subject, attachments } = req.body;

    try {
        const originalMessage = await ContactMessage.findById(id);
        if (!originalMessage) {
            return res.status(404).json({ message: 'Message not found.' });
        }

        const reply = {
            senderName: 'You', // or process.env.REPLY_NAME
            senderEmail: process.env.EMAIL_USER,
            subject,
            content,
            attachments,
            isReply: true
        };

        // Send the reply email
        const result = await SendEmail(originalMessage.senderEmail, subject, content);

        if (!result.success) {
            return res.status(500).json({ message: 'Failed to send email.' });
        }

        // Save the reply to DB
        originalMessage.replies.push(reply);
        await originalMessage.save();

        res.status(200).json({ message: 'Reply sent and saved successfully.' });
    } catch (err) {
        console.error('Reply error:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

export default Reply;
