import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
    senderName: String,
    senderEmail: String,
    subject: String,
    content: String,
    time: { type: Date, default: Date.now },
    isReply: Boolean,
    attachments: [String] // filenames or URLs
});

const contactMessageSchema = new mongoose.Schema({
    senderName: { type: String, required: true },
    senderEmail: { type: String, required: true },
    subject: { type: String, required: true },
    content: { type: String, required: true },
    time: { type: Date, default: Date.now },
    attachments: [String],
    isStarred: { type: Boolean, default: false },
    isNew: { type: Boolean, default: true },
    priority: { type: String, default: 'medium' },
    replies: [replySchema]
});

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

export default ContactMessage;
