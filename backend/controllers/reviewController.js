const Review = require('../models/reviewModel');
const Project = require('../models/projectModel');
const User = require('../models/userModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createReview = catchAsync(async (req, res, next) => {
    const { project, rating, comment } = req.body;

    const foundProject = await Project.findById(project);

    if (!foundProject) {
        return next(new AppError('Project not found', 404));
    }

    if (foundProject.client._id.toString() !== req.user._id.toString()) {
        return next(new AppError('You can only review your own project', 403));
    }

    if (foundProject.status !== 'completed') {
        return next(new AppError('Project must be completed before review', 400));
    }

    if (!foundProject.assignedFreelancer) {
        return next(new AppError('Project has no assigned freelancer', 400));
    }

    const review = await Review.create({
        project,
        client: req.user._id,
        freelancer: foundProject.assignedFreelancer._id,
        rating,
        comment,
    });

    res.status(201).json({
        status: 'success',
        review,
    });
});

exports.getFreelancerReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find({
        freelancer: req.params.freelancerId,
    });

    res.status(200).json({
        status: 'success',
        length: reviews.length,
        reviews,
    });
});
