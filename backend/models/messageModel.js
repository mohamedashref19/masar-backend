const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        conversation: {
            type: mongoose.Schema.ObjectId,
            ref: 'Conversation',
            required: [true, 'Message must belong to a conversation'],
        },
        sender: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Message must have a sender'],
        },
        content: {
            type: String,
            required: [true, 'Message cannot be empty'],
            trim: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model('Message', messageSchema);
