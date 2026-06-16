const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },

        sender: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },

        type: {
            type: String,
            enum: [
                'proposal_received',
                'proposal_accepted',
                'proposal_rejected',
                'milestone_created',
                'milestone_funded',
                'milestone_submitted',
                'milestone_approved',
                'payment_released',
                'payment_refunded',
                'dispute_opened',
                'project_started',
                'project_cancelled',
                'project_completed',
                'message_received',
                'system',
            ],
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        message: {
            type: String,
            required: true,
        },

        relatedProject: {
            type: mongoose.Schema.ObjectId,
            ref: 'Project',
        },

        relatedMilestone: {
            type: mongoose.Schema.ObjectId,
            ref: 'Milestone',
        },

        relatedProposal: {
            type: mongoose.Schema.ObjectId,
            ref: 'Proposal',
        },

        isRead: {
            type: Boolean,
            default: false,
        },

        readAt: Date,
    },
    { timestamps: true },
);

notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
