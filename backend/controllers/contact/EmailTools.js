import ContactMessage from "../../models/ContactModel.js"

export const setRead = async (req, res) => {
    try {
        const { id } = req.body
        if (!id) return res.status(400).json({ message: 'Message ID is required.' })

        // Find the message by ID
        const mail = await ContactMessage.findById(id)
        if (!mail) {
            return res.status(404).json({ message: 'Message not found.' })
        }

        // Update the isNew field to false
        mail.isNew = false
        await mail.save()
        res.status(200).json({ message: 'Message marked as read successfully.' })
    } catch (error) {
        console.error('Error setting read status:', error)
        res.status(500).json({ message: 'Failed to set read status.' })
    }
}