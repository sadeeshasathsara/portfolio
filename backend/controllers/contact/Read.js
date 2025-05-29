import ContactMessage from '../../models/ContactModel.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';

dayjs.extend(relativeTime);

const ReadMails = async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ time: -1 });

        const formatted = messages.map(msg => {
            const content = msg.content || '';
            return {
                id: msg._id.toString(),
                sender: msg.senderEmail,
                senderName: msg.senderName,
                subject: msg.subject,
                preview: content.slice(0, 100) + (content.length > 100 ? '...' : ''),
                content,
                time: dayjs(msg.time).fromNow(),
                isNew: msg.isNew,
                isStarred: msg.isStarred,
                hasAttachment: (msg.attachments || []).length > 0,
                attachments: msg.attachments || [],
                priority: msg.priority,
                previousEmails: (msg.replies || []).map((r, i) => ({
                    id: `reply${i + 1}`,
                    senderName: r.senderName,
                    subject: r.subject,
                    content: r.content,
                    time: dayjs(r.time).fromNow(),
                    isReply: r.isReply,
                    attachments: r.attachments || []
                }))
            };
        });


        res.status(200).json(formatted);
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        res.status(500).json({ message: 'Failed to fetch messages.' });
    }
}

export default ReadMails;
