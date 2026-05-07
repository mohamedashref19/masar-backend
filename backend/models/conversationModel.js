const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.ObjectId,
            ref: 'Project',
            required: [true, 'Conversation must belong to a project'],
        },
        client: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        freelancer: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        lastMessage: {
            type: mongoose.Schema.ObjectId,
            ref: 'Message',
            default: null,
        },
        lastMessageAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true },
);

// Preventing two conversations on the same project between the same people
conversationSchema.index({ project: 1, client: 1, freelancer: 1 }, { unique: true });

module.exports = mongoose.model('Conversation', conversationSchema);
