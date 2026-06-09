// Modules
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Project must have a title'],
            trim: true,
        },

        description: {
            type: String,
            required: [true, 'Project must have a description'],
            trim: true,
        },

        category: {
            type: String,
            required: [true, 'Project must have a category'],
            trim: true,
        },

        skillsRequired: [String],

        budget: {
            type: Number,
            required: [true, 'Project must have a budget'],
            min: [1, 'Budget must be greater than 0'],
        },

        deadline: {
            type: Date,
            required: [true, 'Project must have a deadline'],
            validate: {
                validator: function (val) {
                    return val > Date.now();
                },
                message: 'Deadline Must be in the future',
            },
        },

        client: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Project must belong to a client'],
        },

        status: {
            type: String,
            enum: ['open', 'in-progress', 'completed', 'cancelled'],
            default: 'open',
        },

        assignedFreelancer: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },

        complexity: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
        },

        required_skills: [String], // Array of strings

        experience_required: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Expert'],
        },

        completedAt: Date,
    },

    { timestamps: true },
);

projectSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'client',
        select: 'name email',
    }).populate({
        path: 'assignedFreelancer',
        select: 'name email',
    });
});

projectSchema.pre('findOneAndDelete', async function (next) {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (docToUpdate) {
        await mongoose.model('Proposal').deleteMany({ project: docToUpdate._id });
    }
});

module.exports = mongoose.model('Project', projectSchema);
