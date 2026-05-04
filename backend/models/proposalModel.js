const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.ObjectId,
            ref: 'Project',
            required: [true, 'Proposal must belong to a project.'],
        },
        freelancer: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Proposal must belong to a freelancer.'],
        },
        coverLetter: {
            type: String,
            required: [true, 'Please provide a cover letter.'],
        },
        price: {
            type: Number,
            required: [true, 'Please provide your proposed price.'],
        },
        duration: {
            type: Number,
            required: [true, 'Please provide estimated duration in days.'],
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending',
        },
    },
    { timestamps: true },
);
//make sure not freelance apply same proposal more one
proposalSchema.index({ project: 1, freelancer: 1 }, { unique: true });
//to bring  freelance with proposal
proposalSchema.pre(/^find/, function () {
    this.populate({
        path: 'freelancer',
        select: 'name profileImage freelancerProfile',
    });
});

module.exports = mongoose.model('Proposal', proposalSchema);
