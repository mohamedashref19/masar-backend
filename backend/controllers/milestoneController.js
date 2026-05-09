// Models
const Milestone = require('./../models/milestoneModel');
const Project = require('./../models/projectModel');

// Utils
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const apiFeatures = require('./../utils/apiFeatures');

exports.createMilestone = catchAsync(async (req, res, next) => {
    const project = await Project.findById(req.params.projectId);

    if (!project) return next(new AppError('No project found with that id', 404));

    // checking if client has authority
    if (project.client._id.toString() !== req.user._id.toString())
        return next(new AppError(`You don't have authority to perform this action`, 403));

    if (project.status !== 'in-progress')
        return next(
            new AppError('You can only create a milestone when a project is in progress', 400),
        );

    if (!project.assignedFreelancer)
        return next(new AppError('A project must have an assigned freelancer', 400));

    const milestone = await Milestone.create({
        project: project._id,
        client: req.user._id,
        freelancer: project.assignedFreelancer,
        title: req.body.title,
        description: req.body.description,
        amount: req.body.amount,
    });

    return res.status(201).json({
        status: 'success',
        data: { milestone },
    });
});

exports.getProjectMilestones = catchAsync(async (req, res, next) => {
    const project = await Project.findById(req.params.projectId);

    if (!project) return next(new AppError('No project found with that id', 404));

    // console.log(req.user.role);

    if (
        project.client._id.toString() !== req.user._id.toString() &&
        (!project.assignedFreelancer || project.assignedFreelancer._id.toString() !== req.user._id.toString())
    ) return next(new AppError('You are not authorized', 403));
    

    const milestones = await Milestone.find({ project: project._id });

    if (milestones.length == 0) {
        return res.status(200).json({
            status: 'success',
            results: milestones.length,
            data: { milestones },
        });
    }
    return res.status(200).json({
        status: 'success',
        data: { milestones },
    });
});
