const mongoose = require('mongoose');

// Models
const User = require('./userModel');

const reviewSchema = new mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.ObjectId,
            ref: 'Project',
            required: true,
            unique: true,
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

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        comment: {
            type: String,
            trim: true,
            required: [true, 'Please provide a comment for your review'],
            minlength: [5, 'Review comment must be at least 5 characters'],
        },
    },
    { timestamps: true },
);

reviewSchema.pre(/^find/, function (next) {
    this.populate('client', 'name').populate('freelancer', 'name');
});

// middleware to update average rating of freelancers
reviewSchema.statics.calcAverageRating = async function (freelancerId) {
    const stats = await this.aggregate([
        {
            $match: { freelancer: freelancerId },
        },
        {
            $group: {
                _id: '$freelancer',
                avgRating: { $avg: '$rating' },
            },
        },
    ]);

    await User.findByIdAndUpdate(freelancerId, {
        'freelancerProfile.rating': stats.length > 0 ? stats[0].avgRating : 0,
    });
};

// Middlewares to update freelancer average after review
reviewSchema.post('save', async function () {
    await this.constructor.calcAverageRating(this.freelancer);
});

reviewSchema.post(/^findOneAnd/, async function (doc) {
    if (doc) {
        await doc.constructor.calcAverageRating(doc.freelancer);
    }
});

module.exports = mongoose.model('Review', reviewSchema);
